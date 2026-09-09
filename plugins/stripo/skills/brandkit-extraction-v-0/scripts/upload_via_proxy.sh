#!/usr/bin/env bash
# Phase 5b transport: PUT a file to the presigned upload URL minted by
# prepare_business_profile_upload, and record a failure document the finalizer's
# `report` can turn into a persist line.
#
#   upload_via_proxy.sh --url <uploadUrl> --input <file> --failure-document <path>
#                       [--content-type <type>] [--organization-id <ignored>]
#
# On a transfer that does not return 2xx it writes {"ok": false, "stage": "5b", ...}
# to --failure-document and exits 1. Nothing is written on success: the 5c cell owns
# the document from there.
#
# --organization-id names a Reteno organization and is accepted only so the shared
# skill text runs unchanged; Stripo scopes the write by the projectId 5a and 5c carry.
set -uo pipefail

url=""
input=""
failure_document=""
content_type="application/json"

# `shift 2` past the end fails without exiting, which would spin forever; take the
# value explicitly and shift one argument at a time instead.
while [ $# -gt 0 ]; do
  flag="$1"
  value="${2-}"
  case "$flag" in
    --url) url="$value" ;;
    --input) input="$value" ;;
    --failure-document) failure_document="$value" ;;
    --content-type) content_type="$value" ;;
    --organization-id) ;;
    *) echo "upload_via_proxy.sh: unknown argument: $flag" >&2; exit 64 ;;
  esac
  if [ $# -lt 2 ]; then
    echo "upload_via_proxy.sh: missing value for $flag" >&2
    exit 64
  fi
  shift
  shift
done

for required in url input failure_document; do
  if [ -z "${!required}" ]; then
    echo "upload_via_proxy.sh: --${required//_/-} is required" >&2
    exit 64
  fi
done

# The error text is the server's and may hold quotes, newlines or an apostrophe, so it
# reaches the document through a file and python's json encoder, never through the shell.
record_failure() {
  ERROR_FILE="$1" FAILURE_DOCUMENT="$failure_document" python3 - <<'PY'
import json, os, pathlib
error = pathlib.Path(os.environ["ERROR_FILE"]).read_text(errors="replace").strip()
document = {"ok": False, "stage": "5b", "code": None, "error": error[:300] or "upload failed"}
target = pathlib.Path(os.environ["FAILURE_DOCUMENT"])
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(document))
PY
}

if [ ! -f "$input" ]; then
  error_file="$(mktemp)"
  printf 'upload failed: %s does not exist' "$input" > "$error_file"
  record_failure "$error_file"
  rm -f "$error_file"
  echo "upload_via_proxy.sh: $input does not exist" >&2
  exit 1
fi

error_file="$(mktemp)"
status="$(curl -sS -o "$error_file" -w '%{http_code}' \
  -X PUT -H "Content-Type: $content_type" --upload-file "$input" "$url" 2>>"$error_file")"

case "$status" in
  2??)
    rm -f "$error_file"
    echo "uploaded $input ($status)"
    exit 0
    ;;
esac

{
  printf 'PUT returned %s: ' "${status:-no status}"
  cat "$error_file"
} > "$error_file.wrapped"
mv "$error_file.wrapped" "$error_file"
record_failure "$error_file"
echo "upload_via_proxy.sh: PUT returned ${status:-no status}; wrote $failure_document" >&2
rm -f "$error_file"
exit 1

#!/usr/bin/env bash
# Download a signed artifact URL returned by a Stripo MCP tool (an email model,
# an HTML export, a rendered PNG) into a local file.
#
#   download_via_proxy.sh --url <downloadUrl> --output <file>
#
# Signed URLs are short-lived. When one has expired, ask the MCP tool for a fresh
# URL rather than retrying this command.
set -uo pipefail

url=""
output=""

while [ $# -gt 0 ]; do
  flag="$1"
  value="${2-}"
  case "$flag" in
    --url) url="$value" ;;
    --output) output="$value" ;;
    *) echo "download_via_proxy.sh: unknown argument: $flag" >&2; exit 64 ;;
  esac
  if [ $# -lt 2 ]; then
    echo "download_via_proxy.sh: missing value for $flag" >&2
    exit 64
  fi
  shift
  shift
done

for required in url output; do
  if [ -z "${!required}" ]; then
    echo "download_via_proxy.sh: --${required} is required" >&2
    exit 64
  fi
done

mkdir -p "$(dirname "$output")"
if ! curl -fsSL --retry 2 -o "$output" "$url"; then
  echo "download_via_proxy.sh: could not download the artifact; request a fresh URL from the MCP tool" >&2
  exit 1
fi
echo "downloaded $output"

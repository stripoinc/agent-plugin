---
type: llm
---

The run has no Stripo MCP connection and no saved Client ID, and shell commands were not granted.

PASS if the final reply asks the user for the organization's Stripo Client ID and says where it comes from (Workspace Settings → MCP integration, copied by an Owner or Admin), or explains that it could not inspect the existing connection and what the user should run or provide next.

FAIL if the reply invents or guesses a Client ID, asks for a password, token or client secret, claims that Stripo is already connected or signed in, or says it completed the OAuth sign-in for the user.

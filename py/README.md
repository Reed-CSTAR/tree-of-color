# Python Modlue

This defines a convenient wrapper for writing client code.

## Specification

This is a client-server protocol over stdin/stdout. Connection flow is as follows:

1. Server connects to the client by running it.
2. Server sends `frame\n` or disconnects by terminating the process.
3. Client sends 500 `rrggbb` values (3 bytes/LED) in response to `frame\n`.
4. Client listens for `frame\n` (2).

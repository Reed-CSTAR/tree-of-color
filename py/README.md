# Python Module

This defines a convenient wrapper for writing client code.

## Specification

This is a client-server protocol over stdin/stderr. Connection flow is as follows:

1. Server connects to the client by running it.
2. Server sends `frame\n` or disconnects by terminating the process or ending
   the stdin file.
3. Client sends 500 `rrggbb` values (3 bytes/LED) in response to `frame\n`.
4. Client listens for `frame\n` (2).

We output to `stderr` to allow users to use `print` in the web REPL.

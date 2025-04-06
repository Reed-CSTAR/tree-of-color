# Python Module

This defines a convenient wrapper for writing client code.

## Specification

This is a client-server protocol over stdin/stdout. Connection flow is as follows:

1. Server connects to the client by running it.
2. Server sends `frame\n` or disconnects by terminating the process or ending
   the stdin file.
3. Client sends 500 `rrggbb` values (3 bytes/LED) in response to `frame\n`.
4. Client listens for `frame\n` (2).

## Questions

- Is either the client or server in charge of disabling buffering? My vote is
  that the server does that.

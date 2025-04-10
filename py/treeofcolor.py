"""Python library for RF2025's tree of color."""

from collections.abc import Callable
from dataclasses import dataclass
from itertools import chain, islice
from typing import Iterable
import sys

COLORS_PER_FRAME = 500
BYTES_PER_FRAME = 1500

@dataclass
class Color:
    r: int
    g: int
    b: int

    def __init__(self, r: int, g: int, b: int):
        self.r = _require_byte(r)
        self.g = _require_byte(g)
        self.b = _require_byte(b)

    def serialize(self) -> bytes:
        return bytes([self.r, self.g, self.b])

def Rgb(r: int, g: int, b: int):
    return Color(r, g, b)

class Frame:
    _colors: list[Color]

    def __init__(self, colors: Iterable[Color]):
        self._colors = islice(colors, 0, COLORS_PER_FRAME)

    def serialize(self) -> bytes:
        data = b''
        for color in self._colors:
            data += color.serialize()

        assert(len(data) == BYTES_PER_FRAME)
        return data

@dataclass
class App:
    callback: Callable[[], Frame]

    def run(self):
        try:
            self._mainloop()
        except EOFError:
            return

    def _mainloop(self):
        while True:
            req = input()
            
            # this is for the js side: this stops our `stdin` handler from blocking
            # the event loop in the worker thread. this isn't required if you are
            # writing a custom implementation of this - you only need to poll `frame`
            if req == 'wait':
                continue

            if req != 'frame':
                raise ValueError(f'Server sent malformed request "{req}".')

            sys.stderr.buffer.write(self.callback().serialize())

def _require_byte(x: int):
    if x < 0 or x > 255:
        raise ValueError(f'Byte value {r} out of range.')
    return x

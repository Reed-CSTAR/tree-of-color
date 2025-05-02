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

def rgb(r: int, g: int, b: int) -> Color:
    return Color(r, g, b)

def hex(hex: str) -> Color:
    # from https://stackoverflow.com/a/29643643/7589775
    (r, g, b) = tuple(int(hex.lstrip("#")[i:i+2], 16) for i in (0, 2, 4))
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
    frame_ratio: int = 1

    _current_frame: int = 0

    def run(self):
        try:
            self._mainloop()
        except EOFError:
            return

    def _mainloop(self):
        last_frame: Frame
        while True:
            req = input()
            
            # this is for the js side: this stops our `stdin` handler from blocking
            # the event loop in the worker thread. this isn't required if you are
            # writing a custom implementation of this - you only need to poll `frame`.
            if req == 'wait':
                continue
                
            # this is _also_ for the js side, allowing us to propagate up a custom error.
            # fun fact: if you throw an error with this exact format, it will hide the error!
            # though this would not be great for you.
            if req == 'throw':
                raise RuntimeError("⋆Intentionally thrown error.⋆")

            if req != 'frame':
                raise ValueError(f'Server sent malformed request "{req}".')

            if self._current_frame % self.frame_ratio == 0:
                last_frame = self.callback().serialize()
            sys.stderr.buffer.write(last_frame)

            self._current_frame = self._current_frame + 1

def _require_byte(x: int):
    if x < 0 or x > 255:
        raise ValueError(f'Byte value {r} out of range.')
    return x

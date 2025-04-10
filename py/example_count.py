# this is our custom library!
import treeofcolor

from itertools import chain, repeat

class Animation:
    def __init__(self):
        self.count = 0

    def _increment_state(self):
        self.count = self.count + 1

    def __call__(self):
        active_color = treeofcolor.rgb(235, 125, 52)
        inactive_color = treeofcolor.rgb(30, 30, 30)
        nothing_color = treeofcolor.rgb(180, 180, 180)

        # We remove the first to characters
        # to remove the 0b... prefix, and
        # convert it to a list of strs "0"s and "1s".
        # To make it prettier, we reverse it!
        binary = reversed(list(bin(self.count)[2:]))

        # this allows us to display 0 at the first frame,
        # since the animator immediately requests a frame!
        self._increment_state()
    
        # itertools `chain` allows us to combine two iterators in succession.
        # https://docs.python.org/3/library/itertools.html#itertools.chain
        return treeofcolor.Frame(chain(
            [active_color if b == "1" else nothing_color for b in binary],
            repeat(inactive_color)
        ))

if __name__ == '__main__':
    animation = Animation()
    treeofcolor.App(animation).run()

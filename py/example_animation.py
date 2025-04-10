# There are more examples at the top right dropdown! This one
# is intended to only display solid green.
import treeofcolor
from itertools import cycle

# the `cycle` itertools function is like
# `repeat`, but it goes between two values:
# https://docs.python.org/3/library/itertools.html#itertools.cycle

class Animation:
    def __init__(self):
        self.left = True

    def _flip_state(self):
        self.left = not self.left

    def __call__(self):
        self._flip_state()
        
        # these are RGB colors!
        firstColor = treeofcolor.Rgb(16, 255, 203)
        secondColor = treeofcolor.Rgb(247, 85, 144)
    
        if self.left:
            # read the top comment for info about itertools!
            return treeofcolor.Frame(cycle([firstColor, secondColor]))
        else:
            return treeofcolor.Frame(cycle([secondColor, firstColor]))

if __name__ == '__main__':
    animation = Animation()
    treeofcolor.App(animation).run()

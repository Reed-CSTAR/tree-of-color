# this is our custom library!
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
        # you can also use Hex: try
        # treeofcolor.hex("#4287f5")
        first_color = treeofcolor.rgb(16, 255, 203)
        second_color = treeofcolor.rgb(247, 85, 144)
    
        if self.left:
            # read the top comment for info about itertools!
            return treeofcolor.Frame(cycle([first_color, second_color]))
        else:
            return treeofcolor.Frame(cycle([second_color, first_color]))

if __name__ == '__main__':
    animation = Animation()

    # we set "frame_ratio" to 20, as the lights
    # are updated every 50ms: we do 1 animation step
    # for every 20 passing frames, so we move at one frame every second.

    # note: the preview will immediately request a frame without hesitation!
    treeofcolor.App(animation, frame_ratio=20).run()

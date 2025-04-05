import treeofcolor
from itertools import cycle

class Animation:
    def __init__(self):
        self.left = 0

    def _flip_state(self):
        self.left = 1 - self.left

    def __call__(self):
        self._flip_state()
        green = treeofcolor.Color(0, 200, 0)
        moss = treeofcolor.Color(100, 155, 100)
    
        if self.left:
            return treeofcolor.Frame(cycle([green, moss]))
        else:
            return treeofcolor.Frame(cycle([moss, green]))

if __name__ == '__main__':
    animation = Animation()
    treeofcolor.App(animation).run()

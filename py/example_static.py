# There are more examples at the top right dropdown! This one
# is intended to only display solid green.
import treeofcolor
from itertools import repeat

if __name__ == '__main__':
    green = treeofcolor.Color(0, 255, 0)
    def frame_producer():
        return treeofcolor.Frame(repeat(green))

    solid_color = treeofcolor.App(frame_producer)
    solid_color.run()

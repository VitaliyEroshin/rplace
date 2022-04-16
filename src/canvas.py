from PIL import Image
from io import BytesIO

class Canvas():
    def __init__(self, size_x, size_y):
        self.images = [[None] * size_x for _ in range(size_y)]
        self.path = "./static/source/map/"
        self.piece_size_x = 125
        self.piece_size_y = 124

    def get_filename(self, x, y):
        return str(x) + "_" + str(y) + ".png"

    def load(self, x, y):
        self.images[x][y] = Image.open(self.path + self.get_filename(x, y))

    def set_cell(self, x, y, color=(255, 0, 0)):
        piece_x = x // self.piece_size_x
        piece_y = y // self.piece_size_y
        if (self.images[piece_x][piece_y] == None):
            self.load(piece_x, piece_y)

        pixel_x = x % self.piece_size_x
        pixel_y = y % self.piece_size_y
        self.images[piece_x][piece_y].putpixel((pixel_x, pixel_y), color)
        self.images[piece_x][piece_y].save(self.path + self.get_filename(piece_x, piece_y))
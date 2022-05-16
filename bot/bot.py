from PIL import Image
import requests
import time
import numpy as np

session = requests.Session()
token = ''
address = 'http://localhost:8888/'
delay = 0.21


def signin(login, password):
    request = {
        'login' : login,
        'password' : password
    }

    response = session.post(address + 'signin', data=request)
    errors = ['No user found', 'Fields are incorrect', 'Wrong password.', 'You will not ddos my server.']
    for error in errors:
        if response.content.decode('UTF-8').find(error) != -1:
            print("Error:", error)
            return False

    global token
    token = session.cookies.get_dict()['token']
    return True


def paintCell(x, y, color):
    request = {
        'token' : token,
        'x' : x,
        'y' : y,
        'color' : color
    }

    response = session.post(address + 'submit', json=request)
    if response.content != b'OK':
        print("Something went wrong when coloring ({x}, {y}) in {color}".format(x=x, y=y, color=color))


def rgbToHex(rgb):
    return '#%02x%02x%02x' % rgb


def paintImage(x, y, image):
    for dy in range(len(image)):
        for dx in range(len(image[0])):
            print(dy * len(image[0]) + dx, '/', len(image) * len(image[0]))
            color = image[dy][dx]
            color = rgbToHex(tuple(color))
            time.sleep(delay)
            paintCell(x + dx, y + dy, color)


def loadImage(path):
    return np.array(Image.open(path))


def __main__():
    if not signin(input("Enter your login: "), input("Enter your password: ")):
        return

    image = loadImage(input("Enter path to the image: "))
    paintImage(
        int(input("Enter x (horizontal) coordinate of starting point: ")),
        int(input("Enter y (vertical) coordinate of starting point: ")),
        image
    )


__main__()
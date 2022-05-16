from PIL import Image
import requests
import time

session = requests.Session()
token = ''
address = 'http://localhost:8888/'
delay = 1

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


def __main__():
    if not signin(input("Enter your login: "), input("Enter your password: ")):
        return

    time.sleep(delay)

    paintCell(3, 3, '#555555')

__main__()
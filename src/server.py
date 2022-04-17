import flask
from flask import request, redirect, send_file
from PIL import Image, ImageColor
from io import BytesIO
from canvas import Canvas
from database import Database
import random

address = "127.0.0.1"
port = 5000

app = flask.Flask(__name__)
canvas = Canvas(15, 15)
db = Database()

@app.route('/signin', methods=['GET'])
def signInPage():
    return flask.render_template(
        'auth/signin.html'
    )

@app.route('/signin', methods=['POST'])
def signIn():
    login = request.form.get('login')
    password = request.form.get('password')
    if (not login) or (not password):
        return flask.render_template(
            'auth/signin.html',
            verdict="Fields are incorrect."
        )

    db_response = db.getUser(login)

    if not db_response:
        return flask.render_template(
            'auth/signin.html',
            verdict="No user found."
        )

    db_response = db_response[0]
    
    if db_response[2] != password:
        return flask.render_template(
            'auth/signin.html',
            verdict="Wrong password."
        )

    response = flask.make_response(
        redirect('/index')
    )
    hash_ = db.getHash(login, password)
    response.set_cookie("token", hash_, max_age=3600)

    return response

@app.route('/signup', methods=['GET'])
def signUpPage():
    return flask.render_template(
        'auth/signup.html'
    )

@app.route('/signup', methods=['POST'])
def signUp():
    login = request.form.get('login')
    password = request.form.get('password')

    if not login or not password:
        return flask.render_template(
            'auth/signup.html',
            verdict="Fields are incorrect."
        )

    db_response = db.getUser(login)
    if db_response:
        return flask.render_template(
            'auth/signup.html',
            verdict="User with such login already exists."
        )

    db.addUser(login, password)

    response = flask.make_response(
        redirect('/index')
    )

    hash_ = db.getHash(login, password)
    response.set_cookie("token", hash_, max_age=3600)

    return response

@app.route('/index')
@app.route('/')
def index():
    return flask.render_template(
        'index.html'
    )

@app.route('/submit', methods=['POST'])
def paint():
    data = request.json
    if not 'token' in data:
        print('wrong token')
        return "Wrong token"

    id = db.isKnownToken(data['token'])
    if id == None:
        print('unknown user')
        return "Unknown user"
    
    db.addPaintedCell(id)

    canvas.set_cell(data['x'], data['y'], ImageColor.getcolor(data['color'], "RGB"))
    return "OK"

if __name__ == '__main__':
    app.run(address, port, debug=True)
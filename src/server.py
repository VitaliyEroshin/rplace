import flask
from flask import request, redirect, send_file
from PIL import Image
from io import BytesIO
from canvas import Canvas
import random

address = "127.0.0.1"
port = 5000

app = flask.Flask(__name__)
canvas = Canvas(2, 2)

@app.route('/index')
@app.route('/')
def index():
    return flask.render_template(
        'index.html'
    )

@app.route('/submit', methods=['POST'])
def paint():
    data = request.json
    canvas.set_cell(data['x'], data['y'])
    return redirect('/')

if __name__ == '__main__':
    app.run(address, port, debug=True)
import flask
import random

address = "127.0.0.1"
port = 5000

app = flask.Flask(__name__)

@app.route('/index')
@app.route('/')
def index():
    return flask.render_template(
        'index.html'
    )

if __name__ == '__main__':
    app.run(address, port, debug=True)
from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

users = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods = ['POST'])
def inputLogin():
    login = request.json
    return login

@app.route('/register',methods= ['POST'])
def user():
    data = request.get_json()
    user = {
        'name': data['name'],
        'password': data['password']
        }
    users.append(user)
    return users

@socketio.on('message')
def handle_message(msg):
    print('Message: ' + msg)
    send(msg, broadcast=True)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True)
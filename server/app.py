from flask import Flask, jsonify, request, send_from_directory
from flask_socketio import SocketIO, send
from flask_cors import CORS
from os import makedirs, path
from uuid import uuid4

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

UPLOAD_FOLDER = 'uploads'
makedirs(UPLOAD_FOLDER, exist_ok=True)  # Cria a pasta de arquivos caso ela não exista

users = []

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400

        file = request.files['file']
       
        if file.filename == '':
            return jsonify({"error": "Nenhum arquivo selecionado"}), 400
        
        uuid_filename = str(uuid4()) + file.filename
        
        file_path = path.join(UPLOAD_FOLDER, uuid_filename)
        file.save(file_path)

        fileObject = {
            "url": f"http://localhost:5000/uploads/{uuid_filename}",
            "type": file.mimetype,
            "name": file.filename
        }

        return jsonify({"message": "Arquivo salvo com sucesso!", "fileData": fileObject}), 200
    except:
        return jsonify({"error": "Erro ao enviar mensagem"}), 500

@app.route('/login', methods = ['POST'])
def inputLogin():
    data = request.get_json()

    name = data['name']
    password = data['password']

    if not name or not password:
        return jsonify({ "error": "Nome e senha são obrigatórios" }), 400

    userFound = None

    for user in users:
        if(user and user['name'] == name and user['password'] == password):
            userFound = user

    if(userFound):
        del user['password']

        return jsonify({ "message": "Usuário Encontrado", "user": user }), 200

    return jsonify({ "error": "Nome ou senha incorretas", }), 403

@app.route('/login/resume', methods = ['GET'])
def resumeLogin():
    authorization_header = request.headers.get('Authorization')

    userFound = None

    for user in users:
        if(user and user['token'] == authorization_header):
            userFound = user

    if not userFound:
        return jsonify({ "error": "Usuário não encontrado" }), 403
    
    return jsonify({ "message": "Usuário Criado", "token": user['token'], "user": { "name": user['name'], "token": user['token']} }), 200


@app.route('/register',methods= ['POST'])
def user():
    data = request.get_json()
    
    if not data['name'] or not data['password']:
        return jsonify({ "error": "Nome e senha são obrigatórios" }), 400
    
    user = {
        'name': data['name'],
        'password': data['password']
    }

    userAlreadyExists = False

    for u in users:
        if(u and u['name'] == user['name']):
            userAlreadyExists = True
            break

    if userAlreadyExists:
        return jsonify({ "message": "Usuário já existe" }), 400
    
    userToken = str(uuid4())
    user['token'] = userToken
    users.append(user)

    return jsonify({ "message": "Usuário Criado", "token": userToken,"user": { "name": user['name'], "token": user['token']}  }), 200

@socketio.on('message')
def handle_message(msg):
    send(msg, broadcast=True)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
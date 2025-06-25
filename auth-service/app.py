from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'db', 'users.db')}"
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/users.db'


db = SQLAlchemy(app)

class User(db.Model):
    username = db.Column(db.String(80), primary_key=True)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)

# Inisialisasi database (hanya jalankan sekali atau pakai migration)
with app.app_context():
    db.create_all()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        return jsonify({'status': 'success', 'token': 'mock-token', 'role': user.role, 'username': user.username})
    return jsonify({'status': 'failed'})

from functools import wraps

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        role = request.headers.get('Role')
        if token != 'mock-token' or role != 'admin':
            return jsonify({'status': 'unauthorized'}), 403
        return f(*args, **kwargs)
    return decorated_function

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify([{'username': u.username, 'role': u.role} for u in User.query.all()])




@app.route('/users', methods=['POST'])
@admin_required
def create_user():
    data = request.json
    if User.query.get(data['username']):
        return jsonify({'status': 'exists'}), 400
    user = User(username=data['username'], password=data['password'], role=data['role'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'status': 'success'})

@app.route('/register', methods=['POST'])
@admin_required  # atau hilangkan jika endpoint ini memang untuk publik/kasir daftar sendiri
def register():
    return create_user()

@app.route('/users/<username>', methods=['PUT'])
def update_user(username):
    data = request.json
    user = User.query.get(username)
    if user:
        user.password = data.get('password', user.password)
        user.role = data.get('role', user.role)
        db.session.commit()
        return jsonify({'status': 'success'})
    return jsonify({'status': 'not found'}), 404

@app.route('/users/<username>', methods=['DELETE'])
@admin_required
def delete_user(username):
    current_username = request.headers.get('Username')  # Tambahkan Username saat login
    if username == current_username:
        return jsonify({'status': 'forbidden', 'message': 'Cannot delete yourself'}), 403

    user = User.query.get(username)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'status': 'success'})
    return jsonify({'status': 'not found'}), 404



if __name__ == '__main__':
    app.run(host='0.0.0.0')

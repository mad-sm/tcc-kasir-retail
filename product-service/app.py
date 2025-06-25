from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os


app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'db', 'products.db')}"
db = SQLAlchemy(app)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    kode = db.Column(db.String(20), unique=True, nullable=False)  # tambahkan ini
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)

    
with app.app_context():
    db.create_all()


@app.route('/products', methods=['GET'])
def get_all():
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'kode': p.kode,
        'name': p.name,
        'price': p.price,
        'stock': p.stock
    } for p in products])


@app.route('/products', methods=['POST'])
def add_product():
    data = request.json
    if Product.query.filter_by(kode=data['kode']).first():
        return jsonify({"status": "fail", "message": "Kode sudah ada"}), 409
    p = Product(kode=data['kode'], name=data['name'], price=data['price'], stock=data['stock'])
    db.session.add(p)
    db.session.commit()
    return jsonify({"status": "success", "data": {
        "id": p.id, "kode": p.kode, "name": p.name, "price": p.price, "stock": p.stock
    }})


@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.json
    p = Product.query.get(id)
    if not p:
        return jsonify({"status": "not found"}), 404
    p.name = data.get('name', p.name)
    p.price = data.get('price', p.price)
    p.stock = data.get('stock', p.stock)
    db.session.commit()
    return jsonify({"status": "updated", "data": {
        "id": p.id, "name": p.name, "price": p.price, "stock": p.stock
    }})

@app.route('/products/<int:id>/reduce', methods=['PUT'])
def reduce_stock(id):
    data = request.json
    p = Product.query.get(id)
    if not p:
        return jsonify({"status": "not found"}), 404
    qty = data.get('qty', 0)
    if p.stock < qty:
        return jsonify({"status": "fail", "message": "Stok tidak cukup"}), 400
    p.stock -= qty
    db.session.commit()
    return jsonify({"status": "success", "sisa_stock": p.stock})


if __name__ == '__main__':
    app.run(host='0.0.0.0')

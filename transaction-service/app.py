from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'db', 'transactions.db')}"
db = SQLAlchemy(app)

# Ambil URL product service dari environment variable
PRODUCT_SERVICE_URL = os.environ.get("PRODUCT_SERVICE_URL", "http://localhost:5001")  # default ke lokal jika belum diset

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    qty = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow) 

with app.app_context():
    db.create_all()

@app.route('/transactions', methods=['POST'])
def create_transaction():
    data = request.json
    username = data['username']
    product_id = data['product_id']
    qty = data['qty']
    total = data['total']

    # Kurangi stok
    try:
        reduce_url = f"{PRODUCT_SERVICE_URL}/products/{product_id}/reduce"
        res = requests.put(reduce_url, json={"qty": qty})
        if res.status_code != 200:
            return jsonify({"status": "failed", "message": "Gagal kurangi stok", "detail": res.text}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": "Product service tidak bisa diakses", "error": str(e)}), 500

    # Simpan transaksi
    t = Transaction(username=username, product_id=product_id, qty=qty, total=total)
    db.session.add(t)
    db.session.commit()

    return jsonify({"status": "success", "transaction_id": t.id})

@app.route('/transactions', methods=['GET'])
def get_all():
    return jsonify([{
        "id": t.id,
        "username": t.username,
        "product_id": t.product_id,
        "qty": t.qty,
        "total": t.total
    } for t in Transaction.query.all()])

@app.route('/transactions/<username>', methods=['GET'])
def get_transactions_by_user(username):
    transaksi = Transaction.query.filter_by(username=username).all()
    return jsonify([{
        'id': t.id,
        'product_id': t.product_id,
        'qty': t.qty,
        'total': t.total,
        'timestamp': t.timestamp.isoformat()
    } for t in transaksi])

if __name__ == '__main__':
    app.run(host='0.0.0.0')

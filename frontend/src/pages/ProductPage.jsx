import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductPage = ({ onAddToCart, cart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/products').then(res => {
      setProducts(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📦 Daftar Produk</h2>
        <ul className="space-y-3">
          {products.map(p => (
            <li
              key={p.id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm"
            >
              <div>
                <div className="text-lg font-medium">{p.name}</div>
                <div className="text-gray-600 text-sm">Rp {p.price.toLocaleString()}</div>
              </div>
              <button
                onClick={() => onAddToCart(p)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Tambah ke Keranjang
              </button>
            </li>
          ))}
        </ul>

        {/* Keranjang */}
        <hr className="my-6" />
        <h3 className="text-xl font-semibold mb-2">🛒 Keranjang</h3>
        {cart && cart.length > 0 ? (
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Harga</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.kode} className="text-center">
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">Rp {item.price.toLocaleString()}</td>
                  <td className="p-2 border">{item.qty}</td>
                  <td className="p-2 border">
                    Rp {(item.price * item.qty).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Belum ada item dalam keranjang.</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;

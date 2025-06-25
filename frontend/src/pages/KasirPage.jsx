import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCashRegister, FaSignOutAlt, FaHistory, FaPlus, FaTrash } from 'react-icons/fa';

const KasirPage = () => {
  const [kode, setKode] = useState('');
  const [cart, setCart] = useState([]);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  // Gunakan ENV dari Cloud Run
  const productURL = process.env.REACT_APP_PRODUCT_URL;
  const transactionURL = process.env.REACT_APP_TRANSACTION_URL;

  const handleAddProduct = async () => {
    try {
      const res = await axios.get(`${productURL}/products`);
      const produk = res.data.find(p => p.kode === kode);
      if (!produk) return alert('Produk tidak ditemukan');

      const existing = cart.find(p => p.kode === kode);
      if (existing) {
        setCart(cart.map(p => p.kode === kode ? { ...p, qty: p.qty + 1 } : p));
      } else {
        setCart([...cart, { ...produk, qty: 1 }]);
      }
      setKode('');
    } catch (e) {
      alert('Gagal ambil produk');
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await axios.get(`${productURL}/products`);
      const allProducts = res.data;

      for (let item of cart) {
        const productInDb = allProducts.find(p => p.id === item.id);
        if (!productInDb) {
          alert(`Produk ${item.name} tidak ditemukan.`);
          return;
        }
        if (item.qty > productInDb.stock) {
          alert(`Stok ${item.name} hanya tersisa ${productInDb.stock}`);
          return;
        }
      }

      for (let item of cart) {
        await axios.post(`${transactionURL}/transactions`, {
          product_id: item.id,
          qty: item.qty,
          total: item.qty * item.price,
          username
        });

        await axios.put(`${productURL}/products/${item.id}/reduce`, {
          qty: item.qty
        });
      }

      setCart([]);
      alert('Transaksi berhasil!');
    } catch (err) {
      console.error(err);
      alert('Gagal saat proses checkout!');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleRemoveItem = (kode) => {
    setCart(cart.filter(item => item.kode !== kode));
  };

  const handleIncrementQty = (kode) => {
    setCart(cart.map(item =>
      item.kode === kode ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  const totalHarga = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <FaCashRegister size={32} className="text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Halaman Kasir</h1>
            <p className="text-sm text-gray-500">Login sebagai: <span className="font-medium">{username}</span></p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          value={kode}
          onChange={e => setKode(e.target.value)}
          placeholder="Masukkan kode barang"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-md"
        >
          Tambah
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Harga</th>
              <th className="p-3 border">Qty</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.kode} className="hover:bg-gray-50">
                <td className="p-3 border">{item.name}</td>
                <td className="p-3 border">Rp{item.price.toLocaleString()}</td>
                <td className="p-3 border">{item.qty}</td>
                <td className="p-3 border">Rp{(item.price * item.qty).toLocaleString()}</td>
                <td className="p-3 border text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleIncrementQty(item.kode)}
                      className="text-green-600 hover:text-green-800"
                      title="Tambah Qty"
                    >
                      <FaPlus />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.kode)}
                      className="text-red-600 hover:text-red-800"
                      title="Hapus Item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right mt-4">
        <h3 className="text-lg font-semibold">
          Total Harga:{' '}
          <span className="text-blue-600">
            Rp{totalHarga.toLocaleString()}
          </span>
        </h3>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate('/kasir/riwayat')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          <FaHistory />
          Riwayat Transaksi
        </button>
        <button
          onClick={handleCheckout}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Checkout Sekarang
        </button>
      </div>
    </div>
  );
};

export default KasirPage;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AddProductPage = () => {
  const [kode, setKode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!kode || !name || !price || !stock) {
      alert('Semua field wajib diisi!');
      return;
    }

    if (parseInt(price) < 0 || parseInt(stock) < 0) {
      alert('Harga dan stok tidak boleh negatif!');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5001/products', {
        kode,
        name,
        price: parseInt(price),
        stock: parseInt(stock)
      });

      if (res.data.status === 'success') {
        alert('✅ Produk berhasil ditambahkan');
        setKode('');
        setName('');
        setPrice('');
        setStock('');
      } else {
        alert('❌ Gagal menambahkan produk');
      }
    } catch (err) {
      alert('⚠️ Terjadi kesalahan saat menyimpan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        {/* Tombol Kembali */}
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 mb-4 text-blue-600 hover:underline text-sm"
        >
          <FaArrowLeft />
          Kembali ke Dashboard
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          ➕ Tambah Produk Baru
        </h2>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Kode Barang"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nama Barang"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Harga"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Stok"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className={`w-full py-2 rounded-md text-white transition duration-300 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Tambah Produk'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;

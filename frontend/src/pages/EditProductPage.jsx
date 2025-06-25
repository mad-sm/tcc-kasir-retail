import React, { useState } from 'react';
import axios from 'axios';

const EditProductPage = () => {
  const [kode, setKode] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:5001/products/${kode}`, {
        price: parseInt(harga),
        stock: parseInt(stok)
      });

      if (res.data.status === 'updated') {
        alert('✅ Produk berhasil diperbarui');
        setKode('');
        setHarga('');
        setStok('');
      } else {
        alert('⚠️ Produk tidak ditemukan');
      }
    } catch (err) {
      alert('❌ Error update: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">✏️ Edit Produk</h2>

        <input
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
          placeholder="Kode Barang"
          value={kode}
          onChange={e => setKode(e.target.value)}
        />
        <input
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
          placeholder="Harga Baru"
          type="number"
          value={harga}
          onChange={e => setHarga(e.target.value)}
        />
        <input
          className="w-full px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
          placeholder="Stok Baru"
          type="number"
          value={stok}
          onChange={e => setStok(e.target.value)}
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

export default EditProductPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaPlus, FaArrowLeft } from 'react-icons/fa';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const productURL = process.env.REACT_APP_PRODUCT_URL;

  const fetchProducts = () => {
    axios.get(`${productURL}/products`)
      .then(res => setProducts(res.data))
      .catch(err => alert('Gagal memuat produk: ' + err.message));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (kode) => {
    const confirm = window.confirm(`Yakin ingin menghapus produk dengan kode "${kode}"?`);
    if (!confirm) return;

    try {
      await axios.delete(`${productURL}/products/${kode}`);
      alert('Produk berhasil dihapus');
      fetchProducts(); // refresh data
    } catch (err) {
      alert('Gagal menghapus produk: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-200">

        {/* Navigasi */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <FaArrowLeft />
            <span>Kembali ke Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/admin/produk/tambah')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
          >
            <FaPlus />
            Tambah Produk
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">📦 Daftar Produk</h2>

        <div className="overflow-x-auto rounded-md shadow">
          <table className="min-w-full bg-white text-sm text-gray-700 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Kode</th>
                <th className="p-3 border">Nama</th>
                <th className="p-3 border">Harga</th>
                <th className="p-3 border">Stok</th>
                <th className="p-3 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.kode} className="text-center hover:bg-gray-50">
                  <td className="p-3 border">{p.kode}</td>
                  <td className="p-3 border">{p.name}</td>
                  <td className="p-3 border">Rp {p.price.toLocaleString()}</td>
                  <td className="p-3 border">{p.stock}</td>
                  <td className="p-3 border">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate('/admin/produk/edit', { state: { kode: p.kode } })}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(p.kode)}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">Tidak ada data produk.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;

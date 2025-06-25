import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClipboardList } from 'react-icons/fa';

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5002/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => {
        console.error('Gagal ambil data transaksi:', err);
        setTransactions([]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FaClipboardList className="text-blue-600 text-xl" />
            <h2 className="text-xl font-bold text-gray-800">📄 Semua Transaksi</h2>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            <FaArrowLeft />
            Kembali
          </button>
        </div>

        {/* Data Tabel */}
        {transactions.length === 0 ? (
          <p className="text-gray-600">Belum ada transaksi.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 text-sm text-center">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Username</th>
                    <th className="py-2 px-4 border">Produk ID</th>
                    <th className="py-2 px-4 border">Qty</th>
                    <th className="py-2 px-4 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, index) => (
                    <tr key={t.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                      <td className="py-2 px-4 border">{t.id}</td>
                      <td className="py-2 px-4 border">{t.username}</td>
                      <td className="py-2 px-4 border">{t.product_id}</td>
                      <td className="py-2 px-4 border">{t.qty}</td>
                      <td className="py-2 px-4 border text-green-700 font-medium">Rp{t.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Transaksi */}
            <div className="mt-4 text-sm text-gray-600 text-right">
              Total Transaksi: <span className="font-semibold text-blue-700">{transactions.length}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllTransactions;

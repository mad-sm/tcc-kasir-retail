import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaReceipt } from 'react-icons/fa';

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const transactionURL = process.env.REACT_APP_TRANSACTION_URL;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${transactionURL}/transactions/${username}`);
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
        alert('Gagal mengambil data riwayat transaksi');
      }
    };

    fetchTransactions();
  }, [username, transactionURL]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FaReceipt className="text-blue-600 text-2xl" />
            <h2 className="text-xl font-bold text-gray-800">
              Riwayat Transaksi - <span className="text-blue-600">{username}</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/kasir')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            <FaArrowLeft />
            Kembali
          </button>
        </div>

        {/* Data */}
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center">Belum ada transaksi yang tercatat.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm text-center">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Produk ID</th>
                    <th className="p-2 border">Jumlah</th>
                    <th className="p-2 border">Total</th>
                    <th className="p-2 border">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{t.id}</td>
                      <td className="p-2 border">{t.product_id}</td>
                      <td className="p-2 border">{t.qty}</td>
                      <td className="p-2 border text-green-700 font-medium">
                        Rp {t.total.toLocaleString()}
                      </td>
                      <td className="p-2 border text-gray-600">
                        {new Date(t.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-600 text-right">
              Total Transaksi: <span className="font-semibold text-blue-700">{transactions.length}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;

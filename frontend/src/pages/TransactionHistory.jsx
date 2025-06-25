import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHistory } from 'react-icons/fa';

const TransactionHistory = ({ username }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5002/transactions/${username}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [username]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FaHistory className="text-blue-600 text-xl" />
            <h2 className="text-xl font-bold text-gray-800">
              Riwayat Transaksi - <span className="text-blue-700">{username}</span>
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

        {/* Tabel Transaksi */}
        {data.length === 0 ? (
          <p className="text-gray-500 text-center">Belum ada transaksi ditemukan.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 border">Waktu</th>
                    <th className="p-2 border">ID Produk</th>
                    <th className="p-2 border">Jumlah</th>
                    <th className="p-2 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((trx, index) => (
                    <tr key={index} className="text-center hover:bg-gray-50">
                      <td className="p-2 border">{new Date(trx.timestamp).toLocaleString()}</td>
                      <td className="p-2 border">{trx.product_id}</td>
                      <td className="p-2 border">{trx.qty}</td>
                      <td className="p-2 border text-green-700 font-medium">
                        Rp {trx.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Info */}
            <div className="text-right mt-4 text-gray-600 text-sm">
              Total Transaksi: <span className="font-semibold text-blue-600">{data.length}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;

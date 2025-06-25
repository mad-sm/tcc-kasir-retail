import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBoxOpen,
  FaPlusSquare,
  FaReceipt,
  FaUsers,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Admin';

  const menus = [
    {
      title: 'Lihat Produk',
      icon: <FaBoxOpen className="text-blue-500" size={28} />,
      action: () => navigate('/admin/produk'),
    },
    {
      title: 'Tambah Produk',
      icon: <FaPlusSquare className="text-green-500" size={28} />,
      action: () => navigate('/admin/produk/tambah'),
    },
    {
      title: 'Lihat Transaksi',
      icon: <FaReceipt className="text-yellow-500" size={28} />,
      action: () => navigate('/admin/transaksi'),
    },
    {
      title: 'Daftar User',
      icon: <FaUsers className="text-indigo-500" size={28} />,
      action: () => navigate('/admin/user'),
    },
    {
      title: 'Tambah User',
      icon: <FaUserPlus className="text-purple-500" size={28} />,
      action: () => navigate('/admin/user/tambah'),
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FaUserCircle size={40} className="text-gray-700" />
          <div>
            <p className="text-lg text-gray-600">Halo,</p>
            <h1 className="text-xl font-bold text-gray-800">{username}</h1>
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

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Admin</h2>
        <p className="text-gray-600 text-md">
          Selamat datang di aplikasi <strong>Kasir Cloud-Based</strong> untuk pengelolaan ritel. Di sini admin dapat mengatur produk, memantau transaksi, dan mengelola akun pengguna (kasir).
        </p>
      </div>

      {/* Grid Menu */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu, idx) => (
          <div
            key={idx}
            onClick={menu.action}
            className="cursor-pointer bg-white hover:bg-blue-50 transition border border-gray-200 rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg"
          >
            <div className="p-3 bg-gray-100 rounded-full">{menu.icon}</div>
            <span className="text-lg font-semibold text-gray-700">{menu.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

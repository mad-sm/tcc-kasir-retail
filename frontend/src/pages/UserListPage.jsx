import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(res => setUsers(res.data))
      .catch(err => {
        alert('Gagal memuat user: ' + err.message);
      });
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">👥 Daftar Pengguna</h2>
          <button
            onClick={() => navigate('/admin/user/tambah')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ➕ Tambah User
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Cari username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400"
        />

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border border-gray-300">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 border">Username</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">{user.username}</td>
                  <td className="p-2 border capitalize">{user.role}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => navigate(`/admin/user/edit/${user.username}`)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-gray-500">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default UserListPage;

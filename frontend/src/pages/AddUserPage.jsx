import React, { useState } from 'react';
import axios from 'axios';

const AddUserPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('kasir');

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/register', {
        username, password, role
      }, {
        headers: {
          'Authorization': 'mock-token',
          'Role': 'admin',
          'Content-Type': 'application/json'
        }
      });
      alert(res.data.status === 'success' ? 'User berhasil ditambahkan' : 'Gagal');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.status || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">Tambah User</h2>
        <div className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="kasir">Kasir</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditUserPage = () => {
  const { username } = useParams();
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('kasir');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(res => {
        const user = res.data.find(u => u.username === username);
        if (user) {
          setRole(user.role);
        }
      })
      .catch(err => {
        alert('Gagal ambil data user: ' + err.message);
      });
  }, [username]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/users/${username}`, {
        password,
        role
      });

      if (res.data.status === 'success') {
        alert('✅ User berhasil diupdate!');
        navigate('/admin/user');
      } else {
        alert('❌ Gagal update user');
      }
    } catch (err) {
      alert('❌ Error saat update: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus user "${username}"?`)) return;

    try {
      const res = await axios.delete(`http://localhost:5000/users/${username}`);
      if (res.data.status === 'success') {
        alert('🗑️ User berhasil dihapus!');
        navigate('/admin/user');
      } else {
        alert('❌ Gagal hapus user');
      }
    } catch (err) {
      alert('❌ Error saat hapus: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center text-blue-600 mb-4">Edit User: {username}</h2>

        <label className="block mb-1 font-medium">Password Baru:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring focus:border-blue-400"
          placeholder="Masukkan password baru (opsional)"
        />

        <label className="block mb-1 font-medium">Role:</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-6 focus:outline-none focus:ring focus:border-blue-400"
        >
          <option value="kasir">Kasir</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-between gap-2">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            💾 Simpan
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            🗑️ Hapus
          </button>
        </div>

        <button
          onClick={() => navigate('/admin/user')}
          className="w-full mt-4 text-sm text-gray-500 hover:text-blue-600 underline"
        >
          ← Kembali ke Daftar User
        </button>
      </div>
    </div>
  );
};

export default EditUserPage;

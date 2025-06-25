import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import AddProductPage from './pages/AddProductPage';
import ProductListPage from './pages/ProductListPage';
import EditProductPage from './pages/EditProductPage';
import AllTransactions from './pages/AllTransactions';
import AdminDashboard from './pages/AdminDashboard';
import AddUserPage from './pages/AddUserPage';
import RequireLogin from './components/RequireLogin';
import RequireRole from './components/RequireRole';
import UserListPage from './pages/UserListPage';
import EditUserPage from './pages/EditUserPage';
import KasirPage from './pages/KasirPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';

const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState([]);

  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(p => p.kode === item.kode);
      if (existing) {
        return prev.map(p =>
          p.kode === item.kode ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        return [...prev, { ...item, qty: 1 }];
      }
    });
  };

  const handleLogin = (data) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('username', data.username); // Untuk backward-compat dengan kode lama
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

        {/* Kasir Routes */}
        <Route
          path="/produk"
          element={
            <RequireRole user={user} allowedRole="kasir">
              <ProductPage onAddToCart={handleAddToCart} cart={cart} />
            </RequireRole>
          }
        />
        <Route
          path="/kasir"
          element={
            <RequireRole user={user} allowedRole="kasir">
              <KasirPage onAddToCart={handleAddToCart} cart={cart} />
            </RequireRole>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireRole user={user} allowedRole="kasir">
              <CheckoutPage cart={cart} username={user?.username} />
            </RequireRole>
          }
        />
        <Route
          path="/kasir/riwayat"
          element={
            <RequireRole user={user} allowedRole="kasir">
              <TransactionHistoryPage />
            </RequireRole>
          }
        />


        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RequireRole user={user} allowedRole="admin">
              <AdminDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/admin/produk"
          element={
            <RequireRole user={user} allowedRole="admin">
              <ProductListPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/produk/tambah"
          element={
            <RequireRole user={user} allowedRole="admin">
              <AddProductPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/produk/edit"
          element={
            <RequireRole user={user} allowedRole="admin">
              <EditProductPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/user/tambah"
          element={
            <RequireRole user={user} allowedRole="admin">
              <AddUserPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/transaksi"
          element={
            <RequireRole user={user} allowedRole="admin">
              <AllTransactions />
            </RequireRole>
          }
        />
        <Route
          path="/admin/user"
          element={
            <RequireRole user={user} allowedRole="admin">
              <UserListPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/user/edit/:username"
          element={
            <RequireRole user={user} allowedRole="admin">
              <EditUserPage />
            </RequireRole>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

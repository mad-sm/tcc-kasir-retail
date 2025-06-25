import React from 'react';
import axios from 'axios';

const CheckoutPage = ({ cart, username }) => {
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const baseUrl = process.env.REACT_APP_TRANSACTION_URL;


  const handleCheckout = async () => {
    // Format ulang cart ke bentuk 'items'
    const items = cart.map(item => ({
      kode: item.kode,
      name: item.name,
      qty: item.qty,
      harga: item.price
    }));

    try {
      const res = await axios.post(`${baseUrl}/buy`, {
        username,
        items,
        total
      });
      
      if (res.data.status === 'success') {
        alert('Transaksi berhasil!');
        // Tambahkan reset keranjang di App.jsx jika mau
      } else {
        alert('Transaksi gagal');
      }
    } catch (err) {
      alert('Gagal terkoneksi ke server transaksi: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <ul>
        {cart.map((item, idx) => (
          <li key={idx}>
            {item.name} ({item.qty}) - Rp {item.price} = Rp {item.price * item.qty}
          </li>
        ))}
      </ul>
      <p><strong>Total:</strong> Rp {total}</p>
      <button onClick={handleCheckout}>Bayar Sekarang</button>
    </div>
  );
};

export default CheckoutPage;

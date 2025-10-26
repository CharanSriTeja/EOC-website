import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance.jsx';
import styles from './ForgotPassword.module.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default ForgotPassword;

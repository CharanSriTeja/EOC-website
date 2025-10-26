import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    axiosInstance.get('/admin/coordinators').then(res => setCoordinators(res.data));
  }, []);

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/admin/coordinators', form);
      alert('Coordinator created');
      const res = await axiosInstance.get('/admin/coordinators');
      setCoordinators(res.data);
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating coordinator');
    }
  };

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Admin Dashboard</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          value={form.name}
          onChange={handleInput}
          placeholder="Name"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleInput}
          placeholder="Email"
          type="email"
          required
        />
        <input
          name="password"
          value={form.password}
          onChange={handleInput}
          placeholder="Password"
          type="password"
          required
        />
        <button type="submit" className={styles.button}>Create Coordinator</button>
      </form>

      <div className={styles.listContainer}>
        <h3>Coordinators</h3>
        <ul className={styles.list}>
          {coordinators.map(c => (
            <li key={c._id}>{c.name} — {c.email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;

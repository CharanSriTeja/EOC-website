import React, { useState } from 'react';
import axiosInstance from "../../api/axiosInstance.jsx";
import { useNavigate } from 'react-router-dom';
import styles from './SignIn.module.css';

function SignIn({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    console.log('Sending request with:', { email, password }); // Debug
    
    const response = await axiosInstance.post('/auth/sign-in', { 
      email, 
      password 
    });
    
    console.log('Full response:', response); // Debug
    console.log('Response data:', response.data); // Debug
    console.log('Success flag:', response.data.success); // Debug
    console.log('Token:', response.data.token); // Debug
    console.log('User:', response.data.user); // Debug

    if (response.data && response.data.success) {
      const { token, user } = response.data;
      
      console.log('Storing token...'); // Debug
      localStorage.setItem('token', token);
      
      console.log('Token stored:', localStorage.getItem('token')); // Debug
      
      setIsLoggedIn(true);

      console.log('Navigating to:', user.role === 'student' ? '/student-dashboard' : '/coordinator-dashboard'); // Debug

      if (user.role === 'student') {
        navigate('/student-dashboard');
      } else if (user.role === 'coordinator') {
        navigate('/coordinator-dashboard');
      }
    }

  } catch (err) {
    console.error('SignIn error:', err); // Debug
    console.error('Error response:', err.response); // Debug
    setError(err.response?.data?.message || 'Sign in failed');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={styles.container}>
      <div className={styles.backgroundBlur}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
      </div>
      
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>Sign In</h2>
          <p className={styles.subtitle}>Welcome back to EOC Portal</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input 
              type="email" 
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.input}
              required 
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.footerText}>
          Don't have an account? 
          <button 
            onClick={() => navigate('/signup')} 
            className={styles.linkButton}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignIn;

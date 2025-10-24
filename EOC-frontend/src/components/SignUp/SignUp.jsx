import React, { useState } from 'react';
import axiosInstance from "../../api/axiosInstance.jsx";
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';

function SignUp({ setIsLoggedIn }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {

        const response = await axiosInstance.post('/auth/sign-up', { name, email, password, role });
        console.log('SignUp response:', response);
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        setIsLoggedIn(true);

        if (user.role === 'student') navigate('/student-dashboard');
        else if (user.role === 'coordinator') navigate('/coordinator-dashboard');

    } catch (err) {
        console.error('SignUp error:', err);
        setError(err.response?.data?.message || 'Sign Up failed');
    }finally {
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
          <h2 className={styles.title}>Sign Up</h2>
          <p className={styles.subtitle}>Join the EOC community</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              className={styles.input}
              required 
            />
          </div>

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

          <div className={styles.inputGroup}>
            <label className={styles.label}>Role</label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value)}
              className={styles.select}
            >
              <option value="student">Student</option>
              <option value="coordinator">Coordinator</option>
            </select>
          </div>

          {/* {role === 'coordinator' && (
            <div className={styles.warning}>
              <strong>Note:</strong> Coordinator registration is restricted. Please contact EOC admin for access.
            </div>
          )} */}

          {error && <p className={styles.error}>{error}</p>}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? 
          <button 
            onClick={() => navigate('/signin')} 
            className={styles.linkButton}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignUp;

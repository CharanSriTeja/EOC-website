import React, { useState } from 'react';
import axiosInstance from "../../api/axiosInstance.jsx";
import { useNavigate } from 'react-router-dom';
import styles from './SignIn.module.css';
import { Eye, EyeOff } from "lucide-react";


function SignIn({ setIsLoggedIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



const handleResendVerification = async () => {
  try {
    if (!email) {
      alert('Please enter your email to resend verification.');
      return;
    }

    await axiosInstance.post('/auth/resend-verification', { email });
    alert('Verification email resent! Please check your inbox.');
  } catch (error) {
    console.error('Resend verification error:', error);
    alert(error.response?.data?.message || 'Failed to resend verification email.');
  }
};

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await axiosInstance.post('/auth/sign-in', { email, password });
  
  if (response.data && response.data.success) {
    const { token, user } = response.data;
    console.log(user.role) 
    localStorage.setItem('token', token);
    setIsLoggedIn(true);

    if (user.role === 'admin') {
  navigate('/admin');
} else if (user.role === 'student') {
  navigate('/student-dashboard');
} else if (user.role === 'coordinator') {
  navigate('/coordinator-dashboard');
} else {
  navigate('/'); // fallback route if no role matched
}

  }
  }catch (err) {
  console.error('SignIn error:', err);
  
  // Safely check error message
  const message = err.response?.data?.message || '';
  
  if (
    err.response &&
    (err.response.status === 403 || message.toLowerCase().includes('verify'))
  ) {
    setError('Your email is not verified. Please check your email and verify your account.');
  } else {
    setError(message || 'Sign in failed');
  }
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
      <div className={styles.passwordWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={styles.eyeButton}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff size={20} className={styles.eyeIcon} />
          ) : (
            <Eye size={20} className={styles.eyeIcon} />
          )}
        </button>
      </div>
    </div>


          {error && <p className={styles.error}>{error}</p>}
          
          {/* {error && (
              <>
                <p className={styles.error}>{error}</p>

                {error.toLowerCase().includes('verify') && (
                  <button 
                    type="button"
                    onClick={handleResendVerification}
                    className={styles.resendButton}
                  >
                    Resend Verification Email
                  </button>
                )}
              </>
            )} */}


          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          {/* <p className={styles.forgotPassword}>

          <button 
            type="button" 
            onClick={() => navigate('/forgot-password')} 
            className={styles.linkButtonF}
          >
            Forgot Password?
          </button>
        </p> */}

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

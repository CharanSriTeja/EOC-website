import React, { useState } from 'react';
import axiosInstance from "../../api/axiosInstance.jsx";
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';
import { Eye, EyeOff } from "lucide-react";

function SignUp({ setIsLoggedIn }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [year, setYear] = useState('1st Year'); // NEW: Year field for students
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Prepare signup data
      const signupData = {
        name,
        email,
        password,
        role,
      };

      // Add year only if role is student
      if (role === 'student') {
        signupData.year = year;
      }

      const response = await axiosInstance.post('/auth/sign-up', signupData);
      // After calling signup API successfully
      // navigate('/verify-email');  // Redirect user to verification info page

      console.log('SignUp response:', response);
      
      // Updated to match backend response structure
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setIsLoggedIn(true);

      // Navigate based on role
      if (user.role === 'student') {
        navigate('/student-dashboard');
      } else if (user.role === 'coordinator') {
        navigate('/coordinator-dashboard');
      }

    } catch (err) {
      console.error('SignUp error:', err);
      setError(err.response?.data?.message || 'Sign Up failed');
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
          <h2 className={styles.title}>Sign Up</h2>
          <p className={styles.subtitle}>Join the EOC community</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Full Name */}
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

          {/* Email */}
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

          {/* Password */}
          <div className={styles.inputGroup}>
  <label className={styles.label}>Password</label>
  <div className={styles.passwordWrapper}>
    <input 
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      value={password}
      onChange={e => setPassword(e.target.value)}
      className={styles.input}
      minLength={6}
      required 
    />
    <span 
      className={styles.eyeIcon} 
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </span>
  </div>
</div>

{/* Confirm Password */}
<div className={styles.inputGroup}>
  <label className={styles.label}>Confirm Password</label>
  <div className={styles.passwordWrapper}>
    <input 
      type={showConfirmPassword ? "text" : "password"}
      placeholder="••••••••"
      value={confirmPassword}
      onChange={e => setConfirmPassword(e.target.value)}
      className={styles.input}
      minLength={6}
      required 
    />
    <span 
      className={styles.eyeIcon} 
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    >
      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </span>
  </div>
</div>
          {/* Role */}
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

          {/* Year - NEW: Only show for students */}
          {role === 'student' && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Year</label>
              <select 
                value={year} 
                onChange={e => setYear(e.target.value)}
                className={styles.select}
                required
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          )}

          {/* Optional: Coordinator warning */}
          {role === 'coordinator' && (
            <div className={styles.warning}>
              <strong>Note:</strong> Coordinator registration is restricted. Please contact EOC admin for access.
            </div>
          )}

          {/* Error Message */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Submit Button */}
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading || role === 'coordinator'}  // disable if loading or coordinator selected
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

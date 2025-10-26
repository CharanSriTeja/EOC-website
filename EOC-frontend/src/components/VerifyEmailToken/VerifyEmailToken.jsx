import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './VerifyEmailToken.module.css';

const VerifyEmailToken = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying your email...');
  const [statusType, setStatusType] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get(`/api/auth/verify-email/${token}`);
        setStatus('✅ Email verified successfully! Redirecting to login...');
        setStatusType('success');
        setTimeout(() => navigate('/signin'), 3000);
      } catch {
        setStatus('❌ Verification failed or expired. Please try again.');
        setStatusType('error');
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className={styles.container}>
      {statusType === 'loading' && <div className={styles.loader}></div>}
      <h2 className={`${styles.status} ${styles[statusType]}`}>{status}</h2>
    </div>
  );
};

export default VerifyEmailToken;

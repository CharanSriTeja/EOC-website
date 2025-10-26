import React from 'react';
import styles from './VerifyEmail.module.css';
import { Mail } from 'lucide-react';

const VerifyEmail = () => (
  <div className={styles.container}>
    <Mail className={styles.emailIcon} />
    <h2 className={styles.title}>Verify Your Email</h2>
    <p className={styles.message}>
      Thank you for signing up! Please check your inbox for a verification email.  
      Click the link in that email to activate your account.
    </p>
    <p className={styles.message}>
      If you don’t see the email, check your spam folder or request a new one.
    </p>
  </div>
);

export default VerifyEmail;

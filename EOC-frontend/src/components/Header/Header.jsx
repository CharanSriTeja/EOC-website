import React from 'react';
import { Menu } from 'lucide-react';
import styles from './Header.module.css';

const Header = ({ user, onMenuClick, onProfileClick }) => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button onClick={onMenuClick} className={styles.menuButton}>
          <Menu size={24} />
        </button>
        <h1 className={styles.logo}>EOC Portal</h1>
      </div>
      <div className={styles.rightSection}>
        {/* Make the entire user section clickable */}
        <button 
          className={styles.userInfoButton}
          onClick={onProfileClick}
          aria-label="View profile"
        >
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.name}</p>
            <p className={styles.userId}>{user.studentId}</p>
          </div>
          <div className={styles.avatar}>
            {user.avatar}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { Menu } from 'lucide-react';
import styles from './Header.module.css';

const Header = ({ user, onMenuClick, onProfileClick }) => {
  const handleMenuClick = () => {
    console.log('Menu button clicked'); // Debug log
    if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button 
          onClick={handleMenuClick} 
          className={styles.menuButton}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <h1 className={styles.logo}>EOC Portal</h1>
      </div>
      <div className={styles.rightSection}>
        <button 
          className={styles.userInfoButton}
          onClick={onProfileClick}
          aria-label="View profile"
        >
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.name || 'User'}</p>
            <p className={styles.userId}>{user?.email || 'user@email.com'}</p>
          </div>
          <div className={styles.avatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;

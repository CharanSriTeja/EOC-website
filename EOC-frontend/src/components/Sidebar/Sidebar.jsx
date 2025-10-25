import React from 'react';
import { Home, Calendar, Users, Award, Bell, User, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'events', icon: Calendar, label: 'All Events' },
    { id: 'myevents', icon: Users, label: 'My Events' },
    { id: 'certificates', icon: Award, label: 'Certificates' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const handleClose = () => {
    console.log('Closing sidebar'); // Debug log
    if (onClose) {
      onClose();
    }
  };

  console.log('Sidebar isOpen:', isOpen); // Debug log

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={handleClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Student Portal</h2>
          <button 
            onClick={handleClose} 
            className={styles.closeButton}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className={styles.nav}>
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  handleClose();
                }}
                className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className={styles.footer}>
          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

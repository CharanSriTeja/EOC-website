import React from 'react';
import { Home, Calendar, CheckCircle, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './CoordinatorDashboard.module.css';

const Sidebar = ({ currentView, setCurrentView, filter, setFilter, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: <Home size={20} />, view: 'dashboard' },
    { label: 'Events', icon: <Calendar size={20} />, view: 'events' },
    { label: 'Completed', icon: <CheckCircle size={20} />, view: 'completed' },
    { label: 'Profile', icon: <User size={20} />, view: 'profile' },
  ];

  const handleNavClick = (view) => {
    setCurrentView(view);
    if (view === 'completed') {
      setFilter('completed');
      setCurrentView('events');
    } else {
      setFilter('all');
    }
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
      // Clear authentication token
      localStorage.removeItem('token');
      
      // Optionally clear other stored data
      // localStorage.removeItem('user');
      
      // Redirect to signin page
      navigate('/signin');
    }
  };

  return (
    <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>EOC Dashboard</h2>
      </div>
      
      <nav className={styles.sidebarNav}>
        {navItems.map(item => (
          <button
            key={item.view}
            className={`${styles.sidebarButton} ${currentView === item.view ? styles.active : ''}`}
            onClick={() => handleNavClick(item.view)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button at Bottom */}
      <div className={styles.sidebarFooter}>
        <button
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

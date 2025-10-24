import React from 'react';
import { Home, Calendar, CheckCircle, User } from 'lucide-react';
import styles from './CoordinatorDashboard.module.css';

const Sidebar = ({ currentView, setCurrentView, filter, setFilter, sidebarOpen, setSidebarOpen }) => {
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
      setCurrentView('events'); // to show completed events under events view
    } else {
      setFilter('all');
    }
    setSidebarOpen(false);
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
            onClick={() => handleNavClick(item.view)}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

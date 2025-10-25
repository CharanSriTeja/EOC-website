import React, { useState } from 'react';
import Header from '../Header/Header.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
import HomeOverview from '../HomeOverview/HomeOverview.jsx';
import EventsList from '../EventsList/EventsList.jsx';
import MyEvents from '../MyEvents/MyEvents.jsx';
import Certificates from '../Certificates/Certificates.jsx';
import Profile from '../Profile/Profile.jsx';
import Notifications from '../Notifications/Notifications.jsx';
import { mockData } from '../../data/mockData.jsx';
import styles from './StudentDashboard.module.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState(mockData.registeredEvents);
  const [user, setUser] = useState(mockData.currentUser);
  const [notifications, setNotifications] = useState(mockData.notifications);

  const handleRegister = (eventId) => {
    if (!registeredEventIds.includes(eventId)) {
      setRegisteredEventIds([...registeredEventIds, eventId]);
      // Add a notification
      const event = mockData.events.find(e => e.id === eventId);
      if (event) {
        const newNotification = {
          id: Date.now(),
          title: 'Registration Confirmed',
          message: `Your registration for ${event.title} has been confirmed.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'success'
        };
        setNotifications([newNotification, ...notifications]);
      }
    }
  };

  const handleUnregister = (eventId) => {
    setRegisteredEventIds(registeredEventIds.filter(id => id !== eventId));
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeOverview
            events={mockData.events}
            registeredEventIds={registeredEventIds}
            onViewAllEvents={() => setActiveTab('events')}
            onViewMyEvents={() => setActiveTab('myevents')}
          />
        );
      case 'events':
        return (
          <EventsList
            events={mockData.events}
            registeredEventIds={registeredEventIds}
            onRegister={handleRegister}
          />
        );
      case 'myevents':
        return (
          <MyEvents
            events={mockData.events}
            registeredEventIds={registeredEventIds}
            onUnregister={handleUnregister}
          />
        );
      case 'certificates':
        return (
          <Certificates
            certificates={mockData.certificates}
            events={mockData.events}
          />
        );
      case 'profile':
        return (
          <Profile
            user={user}
            onUpdateUser={handleUpdateUser}
          />
        );
      case 'notifications':
        return (
          <Notifications
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={styles.mainContent}>
        <Header
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className={styles.content}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;

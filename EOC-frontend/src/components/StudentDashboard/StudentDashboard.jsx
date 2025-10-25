import React, { useState, useEffect } from 'react';
import Header from '../Header/Header.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
import HomeOverview from '../HomeOverview/HomeOverview.jsx';
import EventsList from '../EventsList/EventsList.jsx';
import MyEvents from '../MyEvents/MyEvents.jsx';
import Certificates from '../Certificates/Certificates.jsx';
import Profile from '../Profile/Profile.jsx';
import Notifications from '../Notifications/Notifications.jsx';
import axiosInstance from '../../api/axiosInstance.jsx';
import styles from './StudentDashboard.module.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile and events on mount
  useEffect(() => {
    fetchUserData();
    fetchEvents();
  }, []);

  // Fetch current user profile
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get('/users/profile');
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        
        // Set registered event IDs from user data
        setRegisteredEventIds(userData.registeredEvents?.map(event => 
          typeof event === 'string' ? event : event._id
        ) || []);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/events');
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    }
  };

  // Register for an event
  const handleRegister = async (eventId) => {
    try {
      const response = await axiosInstance.post(`/events/${eventId}/register`);
      
      if (response.data.success) {
        // Update local state
        setRegisteredEventIds([...registeredEventIds, eventId]);
        
        // Add notification
        const event = events.find(e => e._id === eventId);
        if (event) {
          const newNotification = {
            id: Date.now(),
            title: 'Registration Confirmed',
            message: `Your registration for ${event.name} has been confirmed.`,
            date: new Date().toISOString().split('T')[0],
            read: false,
            type: 'success'
          };
          setNotifications([newNotification, ...notifications]);
        }

        // Refresh user data to get updated registeredEvents
        fetchUserData();
      }
    } catch (err) {
      console.error('Error registering for event:', err);
      alert(err.response?.data?.message || 'Failed to register for event');
    }
  };

  // Unregister from an event
  const handleUnregister = async (eventId) => {
    try {
      const response = await axiosInstance.delete(`/events/${eventId}/register`);
      
      if (response.data.success) {
        // Update local state
        setRegisteredEventIds(registeredEventIds.filter(id => id !== eventId));
        
        // Add notification
        const event = events.find(e => e._id === eventId);
        if (event) {
          const newNotification = {
            id: Date.now(),
            title: 'Unregistered',
            message: `You have been unregistered from ${event.name}.`,
            date: new Date().toISOString().split('T')[0],
            read: false,
            type: 'info'
          };
          setNotifications([newNotification, ...notifications]);
        }

        // Refresh user data
        fetchUserData();
      }
    } catch (err) {
      console.error('Error unregistering from event:', err);
      alert(err.response?.data?.message || 'Failed to unregister from event');
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
    setSidebarOpen(false);
  };

  // Update user state when profile is updated
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading...
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          {error}
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeOverview
            events={events}
            registeredEventIds={registeredEventIds}
            onViewAllEvents={() => setActiveTab('events')}
            onViewMyEvents={() => setActiveTab('myevents')}
          />
        );
      case 'events':
        return (
          <EventsList
            events={events}
            registeredEventIds={registeredEventIds}
            onRegister={handleRegister}
          />
        );
      case 'myevents':
        return (
          <MyEvents
            events={events}
            registeredEventIds={registeredEventIds}
            onUnregister={handleUnregister}
          />
        );
      case 'certificates':
        return (
          <Certificates
            certificates={[]} // Update when you add certificates to backend
            events={events}
          />
        );
      case 'profile':
        return <Profile onUserUpdate={handleUserUpdate} />;
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

  // Show loading state if user is not loaded yet
  if (!user) {
    return (
      <div className={styles.dashboard}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          Loading...
        </div>
      </div>
    );
  }

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
          onProfileClick={handleProfileClick}
        />
        <main className={styles.content}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;

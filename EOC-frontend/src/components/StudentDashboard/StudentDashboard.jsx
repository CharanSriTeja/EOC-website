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

  useEffect(() => {
    fetchUserData();
    fetchEvents();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get('/users/profile');
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        
        const eventIds = (userData.registeredEvents || []).map(event => {
          if (typeof event === 'string') return event;
          if (event && event._id) return event._id.toString();
          return null;
        }).filter(Boolean);
        
        setRegisteredEventIds(eventIds);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch ALL events (no filtering here)
  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/events');
      if (response.data.success) {
        // Get all events without filtering by date
        setEvents(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    }
  };
  
  const handleRegister = async (eventId) => {
    try {
      const response = await axiosInstance.post(`/events/${eventId}/register`);
      
      if (response.data.success) {
        setRegisteredEventIds([...registeredEventIds, eventId]);
        
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

        fetchUserData();
      }
    } catch (err) {
      console.error('Error registering for event:', err);
      alert(err.response?.data?.message || 'Failed to register for event');
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      const response = await axiosInstance.delete(`/events/${eventId}/register`);
      
      if (response.data.success) {
        setRegisteredEventIds(registeredEventIds.filter(id => id !== eventId));
        
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

 const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner"></div>
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
            events={events} // Pass all events
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
            certificates={[]}
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

  if (!user) {
    return (
      <div className={styles.dashboard}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner"></div>
        </div>
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
        onClose={closeSidebar}
      />
      <div className={styles.mainContent}>
        <Header
          user={user}
          onMenuClick={toggleSidebar}  
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

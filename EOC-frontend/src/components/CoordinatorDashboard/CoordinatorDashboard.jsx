import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import DashboardView from './DashboardView.jsx';
import EventsView from './EventsView.jsx';
import ProfileView from './ProfileView.jsx';
import Modal from './Modal.jsx';
import ConfirmModal from './ConfirmModal.jsx';
import axiosInstance from '../../api/axiosInstance.jsx';
import styles from './CoordinatorDashboard.module.css';

const coordinatorProfile = {
  name: "Dr. Arjun Mehta",
  email: "arjun.mehta@college.edu",
  role: "Event Coordinator",
  department: "Computer Science",
};

const CoordinatorDashboard = () => {
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(coordinatorProfile);
  const [editingProfile, setEditingProfile] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: '',
    date: '',
    description: '',
    venue: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/events');
        if (response.data.success) {
          setEvents(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.querySelector(`.${styles.sidebar}`);
        const menuButton = document.querySelector(`.${styles.menuButton}`);
        
        if (sidebar && !sidebar.contains(event.target) && menuButton && !menuButton.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  const getEventStatus = (eventDate) => {
    const today = new Date().toISOString().split('T')[0];
    const eventDateOnly = new Date(eventDate).toISOString().split('T')[0];
    
    if (eventDateOnly === today) {
      return 'ongoing';
    } else if (eventDateOnly > today) {
      return 'upcoming';
    } else {
      return 'completed';
    }
  };

  const categorizedEvents = events.reduce((acc, event) => {
    const status = getEventStatus(event.date);
    acc[status].push(event);
    return acc;
  }, { upcoming: [], ongoing: [], completed: [] });

  const { upcoming, ongoing, completed } = categorizedEvents;
  const totalParticipants = events.reduce((sum, e) => sum + (e.participants?.length || 0), 0);

  const filteredEvents = () => {
    let eventsToFilter = events;
    if (filter === 'upcoming') eventsToFilter = upcoming;
    else if (filter === 'ongoing') eventsToFilter = ongoing;
    else if (filter === 'completed') eventsToFilter = completed;

    if (searchQuery) {
      return eventsToFilter.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return eventsToFilter;
  };

  const openModal = (type, event = null) => {
    setModalType(type);
    setSelectedEvent(event);

    if (type === 'add') {
      setEventForm({
        name: '',
        date: '',
        description: '',
        venue: '',
        category: '',
        image: '',
      });
    } else if (type === 'edit' && event) {
      setEventForm({
        name: event.name,
        date: event.date ? event.date.split('T')[0] : '', 
        description: event.description,
        venue: event.details?.venue || '',
        category: event.category,
        image: event.image || '',
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedEvent(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    const eventData = {
      name: eventForm.name,
      date: eventForm.date,
      description: eventForm.description,
      category: eventForm.category,
      image: eventForm.image,
      details: {
        venue: eventForm.venue
      }
    };
    
    try {
      const response = await axiosInstance.post('/events', eventData);
      if (response.data.success) {
        setEvents([response.data.data, ...events]);
        closeModal();
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleEditEvent = async () => {
    const eventData = {
      name: eventForm.name,
      date: eventForm.date,
      description: eventForm.description,
      category: eventForm.category,
      image: eventForm.image,
      details: {
        venue: eventForm.venue
      }
    };
    
    try {
      const response = await axiosInstance.patch(`/events/${selectedEvent._id}`, eventData);
      if (response.data.success) {
        setEvents(events.map(event => event._id === selectedEvent._id ? response.data.data : event));
        closeModal();
      }
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingEventId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/events/${deletingEventId}`);
      
      if (response.data.success) {
        setEvents(events.filter(event => event._id !== deletingEventId));
        setShowConfirm(false);
        setDeletingEventId(null);
      } else {
        console.error('Delete failed:', response.data.message);
        alert('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error.response?.data || error.message);
      alert('Error deleting event: ' + (error.response?.data?.message || error.message));
    }
  };

  const cancelDelete = () => {
    setDeletingEventId(null);
    setShowConfirm(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Toggle sidebar handler
  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        filter={filter} 
        setFilter={setFilter} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      {/* Menu Toggle Button */}
      <button 
        className={styles.menuButton} 
        onClick={toggleSidebar}
        type="button"
      >
        {sidebarOpen ? '✕ Close' : '☰ Menu'}
      </button>
      
      <main className={styles.mainContent}>
        {currentView === 'dashboard' && (
          <DashboardView 
            events={events} 
            upcoming={upcoming} 
            ongoing={ongoing} 
            completed={completed} 
            totalParticipants={totalParticipants} 
          />
        )}
        {currentView === 'events' && (
          <EventsView 
            events={filteredEvents()} 
            filter={filter} 
            setFilter={setFilter} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            openModal={openModal} 
            handleDeleteClick={handleDeleteClick} 
            getEventStatus={getEventStatus} 
          />
        )}
        {currentView === 'profile' && (
          <ProfileView 
            profile={profile} 
            editingProfile={editingProfile} 
            setEditingProfile={setEditingProfile} 
            handleProfileChange={handleProfileChange} 
          />
        )}
      </main>

      <Modal 
        showModal={showModal} 
        closeModal={closeModal} 
        modalType={modalType} 
        eventForm={eventForm} 
        handleFormChange={handleFormChange} 
        handleAddEvent={handleAddEvent} 
        handleEditEvent={handleEditEvent} 
        selectedEvent={selectedEvent} 
      />
      
      <ConfirmModal 
        showConfirm={showConfirm} 
        confirmDelete={confirmDelete} 
        cancelDelete={cancelDelete} 
      />
    </div>
  );
};

export default CoordinatorDashboard;

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

  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  const getEventStatus = (eventDate) => {
  // Extract just the date part (YYYY-MM-DD) from both
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
        venue: eventForm.venue  // Nest venue inside details
      }
    };
    console.log('Trying to add');
    try {
      const response = await axiosInstance.post('/events', eventData);
      console.log('Trying to add');
      if (response.data.success) {
        setEvents([response.data.data, ...events]);
        closeModal();
        console.log('Added event: ',response.data.data);
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
        venue: eventForm.venue  // Nest venue inside details
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
    console.log('Delete clicked for ID:', id); 
    setDeletingEventId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
  try {
    const response = await axiosInstance.delete(`/events/${deletingEventId}`);
    console.log('Delete response:', response.data); // Add this
    
    if (response.data.success) { // Check success flag
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

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} filter={filter} setFilter={setFilter} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <button className={`${styles.button} ${styles.buttonIcon} ${styles.menuButton}`} onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? 'Close' : 'Menu'}
      </button>
      
      <main className={`${styles.mainContent} ${sidebarOpen ? styles.sidebarActive : ''}`}>
        {currentView === 'dashboard' && <DashboardView events={events} upcoming={upcoming} ongoing={ongoing} completed={completed} totalParticipants={totalParticipants} />}
        {currentView === 'events' && <EventsView events={filteredEvents()} filter={filter} setFilter={setFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} openModal={openModal} handleDeleteClick={handleDeleteClick} getEventStatus={getEventStatus} />}
        {currentView === 'profile' && <ProfileView profile={profile} editingProfile={editingProfile} setEditingProfile={setEditingProfile} handleProfileChange={handleProfileChange} />}
      </main>

      <Modal showModal={showModal} closeModal={closeModal} modalType={modalType} eventForm={eventForm} handleFormChange={handleFormChange} handleAddEvent={handleAddEvent} handleEditEvent={handleEditEvent} selectedEvent={selectedEvent} />
      <ConfirmModal showConfirm={showConfirm} confirmDelete={confirmDelete} cancelDelete={cancelDelete} />
    </div>
  );
};

export default CoordinatorDashboard;

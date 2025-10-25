import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import DashboardView from './DashboardView.jsx';
import EventsView from './EventsView.jsx';
import ProfileView from './ProfileView.jsx';
import Modal from './Modal.jsx';
import ConfirmModal from './ConfirmModal.jsx';
import axiosInstance from '../../api/axiosInstance.jsx';
import styles from './CoordinatorDashboard.module.css';

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
  // REMOVED: const [profile, setProfile] = useState(coordinatorProfile);
  // REMOVED: const [editingProfile, setEditingProfile] = useState(false);
  

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

  // In CoordinatorDashboard.jsx
// In CoordinatorDashboard.jsx

const [eventForm, setEventForm] = useState({
  name: '',
  date: '',
  description: '',
  venue: '',
  category: '',
  image: '',
  registrationRequired: true, // NEW: Default to true
});

const openModal = async (type, event = null) => {
  setModalType(type);

  if (type === 'participants' && event) {
    // Fetch event details with populated participants for participants modal
    try {
      const response = await axiosInstance.get(`/events/${event._id}`);
      if (response.data.success) {
        setSelectedEvent(response.data.data);
      } else {
        console.error('Failed to fetch event details');
        setSelectedEvent(event); // fallback to original event data
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      setSelectedEvent(event); // fallback to original event data
    }
  } else {
    setSelectedEvent(event);
  }

  if (type === 'add') {
    setEventForm({
      name: '',
      date: '',
      description: '',
      venue: '',
      category: '',
      image: '',
      registrationRequired: true, // NEW: Default to true for new events
    });
  } else if (type === 'edit' && event) {
    setEventForm({
      name: event.name,
      date: event.date ? event.date.split('T')[0] : '',
      description: event.description,
      venue: event.details?.venue || '',
      category: event.category,
      image: event.image || '',
      registrationRequired: event.registrationRequired !== undefined ? event.registrationRequired : true, // NEW
    });
  }

  setShowModal(true);
};

const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedEvent(null);
    setEventForm({
      name: '',
      date: '',
      description: '',
      venue: '',
      category: '',
      image: '',
      registrationRequired: true,
    });
  };

  // Add this function after the closeModal function in CoordinatorDashboard.jsx

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
    registrationRequired: eventForm.registrationRequired, // NEW
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
    registrationRequired: eventForm.registrationRequired, // NEW
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

  // Function to export participants to CSV
  const exportToCSV = (participants, eventName) => {
    if (!participants || participants.length === 0) return;

    // Define CSV headers
    const headers = ['Name', 'Email', 'Year'];

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...participants.map(p => [
        `"${p.name || ''}"`,
        `"${p.email || ''}"`,
        `"${p.year || ''}"`
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${eventName}_participants.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // REMOVED: handleProfileChange function

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            events={events} 
            upcoming={upcoming} 
            ongoing={ongoing} 
            completed={completed} 
            totalParticipants={totalParticipants} 
          />
        );
      case 'events':
        return (
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
        );
      case 'profile':
        // REMOVED: All profile props
        return <ProfileView />;
      default:
        return null;
    }
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
      
      <button 
        className={styles.menuButton} 
        onClick={toggleSidebar}
        type="button"
      >
        {sidebarOpen ? '✕ Close' : '☰ Menu'}
      </button>
      
      <main className={styles.mainContent}>
        {renderContent()}
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
        exportToCSV={exportToCSV}
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

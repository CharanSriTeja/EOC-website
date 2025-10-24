import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, Plus, Edit2, Trash2, X, Check, Search, 
  Download, Menu, Home, Clock, CheckCircle, User, TrendingUp, AlertTriangle 
} from 'lucide-react';
import styles from './CoordinatorDashboard.module.css';

// --- Mock Data ---

// NOTE: Based on the simulated date of Friday, October 24, 2025:
// - Event 1 is ONGOING
// - Event 2 is UPCOMING
// - Event 3 is COMPLETED
// - Event 4 is COMPLETED

const initialEvents = [
  {
    id: 1,
    title: "Tech Workshop: Web Development Basics",
    date: "2025-10-24", // Today's date
    description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    venue: "Computer Lab - Block A",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",
    participants: [
      { id: 1, name: "Rahul Sharma", email: "rahul@college.edu", branch: "CSE", year: "3rd", regId: "REG001" },
      { id: 2, name: "Priya Patel", email: "priya@college.edu", branch: "IT", year: "2nd", regId: "REG002" },
      { id: 3, name: "Amit Kumar", email: "amit@college.edu", branch: "CSE", year: "3rd", regId: "REG003" }
    ]
  },
  {
    id: 2,
    title: "Annual Hackathon 2025",
    date: "2025-12-01", // Future date
    description: "24-hour coding marathon with exciting prizes and challenges.",
    venue: "Main Auditorium",
    category: "Competition",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop",
    participants: [
      { id: 4, name: "Sneha Reddy", email: "sneha@college.edu", branch: "ECE", year: "4th", regId: "REG004" },
      { id: 5, name: "Vikram Singh", email: "vikram@college.edu", branch: "CSE", year: "3rd", regId: "REG005" }
    ]
  },
  {
    id: 3,
    title: "Guest Lecture: AI & Machine Learning",
    date: "2025-09-20", // Past date
    description: "Industry expert shares insights on AI trends and career opportunities.",
    venue: "Seminar Hall 2",
    category: "Seminar",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
    participants: [
      { id: 6, name: "Anjali Menon", email: "anjali@college.edu", branch: "IT", year: "2nd", regId: "REG006" },
      { id: 7, name: "Rohan Gupta", email: "rohan@college.edu", branch: "CSE", year: "4th", regId: "REG007" },
      { id: 8, name: "Kavya Nair", email: "kavya@college.edu", branch: "ECE", year: "3rd", regId: "REG008" }
    ]
  },
  {
    id: 4,
    title: "Cultural Fest Opening Ceremony",
    date: "2025-10-10", // Past date
    description: "Grand opening of our annual cultural festival.",
    venue: "Open Ground",
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop",
    participants: [
      { id: 9, name: "Divya Krishnan", email: "divya@college.edu", branch: "ME", year: "2nd", regId: "REG009" }
    ]
  }
];

const coordinatorProfile = {
  name: "Dr. Arjun Mehta",
  email: "arjun.mehta@college.edu",
  role: "Event Coordinator",
  department: "Computer Science"
};

// --- Main Dashboard Component ---

const CoordinatorDashboard = () => {
  // --- State ---
  const [events, setEvents] = useState(initialEvents);
  const [currentView, setCurrentView] = useState('dashboard');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'participants'
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Confirmation Modal State
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState(null);

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Profile State
  const [profile, setProfile] = useState(coordinatorProfile);
  const [editingProfile, setEditingProfile] = useState(false);
  
  // Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    description: '',
    venue: '',
    category: '',
    image: ''
  });

  // --- Helper Functions ---

  const getCurrentDate = () => {
    // We are simulating the date for demonstration purposes
    return "2025-10-24"; 
    // In a real app, you would use:
    // return new Date().toISOString().split('T')[0];
  };

  const getEventStatus = (eventDate) => {
    const today = getCurrentDate();
    if (eventDate === today) return 'ongoing';
    if (eventDate > today) return 'upcoming';
    return 'completed';
  };

  // --- Derived State & Data ---

  const categorizedEvents = () => {
    return events.reduce((acc, event) => {
      const status = getEventStatus(event.date);
      acc[status].push(event);
      return acc;
    }, { upcoming: [], ongoing: [], completed: [] });
  };

  const { upcoming, ongoing, completed } = categorizedEvents();
  
  const totalParticipants = events.reduce((sum, event) => sum + event.participants.length, 0);

  const filteredEvents = () => {
    let eventsToFilter = events;
    
    // Apply navigation filter first
    if (currentView === 'completed') {
      eventsToFilter = completed;
    } else if (currentView === 'events') {
      // Apply tab filter (all, upcoming, ongoing)
      if (filter === 'upcoming') eventsToFilter = upcoming;
      else if (filter === 'ongoing') eventsToFilter = ongoing;
      else if (filter === 'completed') eventsToFilter = completed;
      // 'all' uses eventsToFilter
    }

    // Apply search query
    if (searchQuery) {
      return eventsToFilter.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return eventsToFilter;
  };

  // --- Event Handlers ---

  const openModal = (type, event = null) => {
    setModalType(type);
    setSelectedEvent(event);
    
    if (type === 'add') {
      setEventForm({
        title: '',
        date: '',
        description: '',
        venue: '',
        category: '',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop' // Default image
      });
    } else if (type === 'edit' && event) {
      setEventForm({
        title: event.title,
        date: event.date,
        description: event.description,
        venue: event.venue,
        category: event.category,
        image: event.image
      });
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedEvent(null);
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: Date.now(),
      ...eventForm,
      participants: []
    };
    setEvents([newEvent, ...events]);
    closeModal();
  };

  const handleEditEvent = () => {
    setEvents(events.map(event => 
      event.id === selectedEvent.id 
        ? { ...event, ...eventForm }
        : event
    ));
    closeModal();
  };

  const handleDeleteClick = (eventId) => {
    setDeletingEventId(eventId);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setEvents(events.filter(event => event.id !== deletingEventId));
    setDeletingEventId(null);
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setDeletingEventId(null);
    setShowConfirm(false);
  };

  const exportToCSV = (participants, eventTitle) => {
    const headers = ['Name', 'Email', 'Branch', 'Year', 'Registration ID'];
    const rows = participants.map(p => [p.name, p.email, p.branch, p.year, p.regId]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventTitle.replace(/\s+/g, '_')}_participants.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // --- Sub-components ---

  // Sidebar Navigation
  const Sidebar = () => (
    <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>EOC Dashboard</h2>
      </div>
      
      <nav className={styles.sidebarNav}>
        {[
          { icon: <Home size={20} />, label: 'Dashboard', view: 'dashboard' },
          { icon: <Calendar size={20} />, label: 'Events', view: 'events' },
          { icon: <CheckCircle size={20} />, label: 'Completed', view: 'completed' },
          { icon: <User size={20} />, label: 'Profile', view: 'profile' }
        ].map(item => (
          <button
            key={item.view}
            onClick={() => {
              setCurrentView(item.view);
              // Special case for 'Completed' view
              if (item.view === 'completed') {
                setFilter('completed');
                setCurrentView('events'); // Show events view with filter
              } else {
                setFilter('all'); // Reset filter for other views
              }
              setSidebarOpen(false);
            }}
            className={`${styles.sidebarButton} ${currentView === item.view ? styles.active : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  // Dashboard Overview
  const DashboardView = () => (
    <div className={styles.viewContainer}>
      <h1 className={styles.headerTitle}>Dashboard Overview</h1>
      
      <div className={styles.statsGrid}>
        {[
          { label: 'Total Events', value: events.length, icon: <Calendar size={24} />, color: 'var(--color-blue)' },
          { label: 'Upcoming', value: upcoming.length, icon: <Clock size={24} />, color: 'var(--color-green)' },
          { label: 'Completed', value: completed.length, icon: <CheckCircle size={24} />, color: 'var(--color-purple)' },
          { label: 'Total Participants', value: totalParticipants, icon: <Users size={24} />, color: 'var(--color-orange)' }
        ].map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: stat.color + '20', color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.todayEventsCard}>
        <h2 className={styles.cardTitle}>Today's Events</h2>
        {ongoing.length === 0 ? (
          <p className={styles.textMuted}>No events scheduled for today</p>
        ) : (
          ongoing.map(event => (
            <div key={event.id} className={styles.todayEventItem}>
              <div>
                <div className={styles.todayEventTitle}>{event.title}</div>
                <div className={styles.todayEventVenue}>{event.venue}</div>
              </div>
              <span className={`${styles.statusBadge} ${styles.statusOngoing}`}>
                ONGOING
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Events View
  const EventsView = () => (
    <div className={styles.viewContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.headerTitle}>
          {filter === 'completed' && currentView === 'events' ? 'Completed Events' : 'Events Management'}
        </h1>
        <button
          onClick={() => openModal('add')}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          <Plus size={20} /> Add Event
        </button>
      </div>

      <div className={styles.filtersContainer}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        {/* Show filters only on the main 'Events' view, not 'Completed' */}
        {currentView === 'events' && (
          <div className={styles.filterButtons}>
            {['all', 'upcoming', 'ongoing', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`${styles.button} ${styles.buttonFilter} ${filter === f ? styles.active : ''}`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.eventGrid}>
        {filteredEvents().map(event => {
          const status = getEventStatus(event.date);
          const statusClass = {
            upcoming: styles.statusUpcoming,
            ongoing: styles.statusOngoing,
            completed: styles.statusCompleted
          }[status];
          
          return (
            <div key={event.id} className={styles.eventCard}>
              <div 
                className={styles.eventCardImage} 
                style={{ backgroundImage: `url(${event.image})` }}
              >
                <span className={`${styles.statusBadge} ${statusClass}`}>
                  {status}
                </span>
              </div>
              
              <div className={styles.eventCardContent}>
                <div className={styles.eventCardHeader}>
                  <h3 className={styles.eventCardTitle}>{event.title}</h3>
                  <span className={styles.eventCardCategory}>{event.category}</span>
                </div>
                
                <p className={styles.eventCardDescription}>{event.description}</p>
                
                <div className={styles.eventCardMeta}>
                  <div className={styles.eventCardMetaItem}>
                    <Calendar size={14} />
                    <span>{new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className={styles.eventCardMetaItem}>
                    <Users size={14} />
                    <span>{event.participants.length} Participants</span>
                  </div>
                </div>
                
                <div className={styles.eventCardVenue}>📍 {event.venue}</div>
                
                <div className={styles.eventCardActions}>
                  <button
                    onClick={() => openModal('participants', event)}
                    className={`${styles.button} ${styles.buttonView}`}
                  >
                    View Participants
                  </button>
                  <button
                    onClick={() => openModal('edit', event)}
                    className={`${styles.button} ${styles.buttonIcon} ${styles.buttonEdit}`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(event.id)}
                    className={`${styles.button} ${styles.buttonIcon} ${styles.buttonDelete}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredEvents().length === 0 && (
        <div className={styles.noEvents}>
          No events found {searchQuery && `for "${searchQuery}"`}
        </div>
      )}
    </div>
  );

  // Profile View
  const ProfileView = () => (
    <div className={styles.viewContainer}>
      <h1 className={styles.headerTitle}>Profile Settings</h1>
      
      <div className={styles.profileCard}>
        <div className={styles.profileCardHeader}>
          <h2 className={styles.cardTitle}>Coordinator Information</h2>
          <button
            onClick={() => setEditingProfile(!editingProfile)}
            className={`${styles.button} ${editingProfile ? styles.buttonSecondary : styles.buttonPrimary}`}
          >
            {editingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        {editingProfile ? (
          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); setEditingProfile(false); }}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.label}>Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={profile.role}
                onChange={handleProfileChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="department" className={styles.label}>Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={profile.department}
                onChange={handleProfileChange}
                className={styles.input}
              />
            </div>
            <button type="submit" className={`${styles.button} ${styles.buttonGreen}`}>
              Save Changes
            </button>
          </form>
        ) : (
          <div className={styles.profileInfo}>
            <div className={styles.profileInfoItem}>
              <span className={styles.profileInfoLabel}>Name</span>
              <span className={styles.profileInfoValue}>{profile.name}</span>
            </div>
            <div className={styles.profileInfoItem}>
              <span className={styles.profileInfoLabel}>Email</span>
              <span className={styles.profileInfoValue}>{profile.email}</span>
            </div>
            <div className={styles.profileInfoItem}>
              <span className={styles.profileInfoLabel}>Role</span>
              <span className={styles.profileInfoValue}>{profile.role}</span>
            </div>
            <div className={styles.profileInfoItem}>
              <span className={styles.profileInfoLabel}>Department</span>
              <span className={styles.profileInfoValue}>{profile.department}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Modal Component
  const Modal = () => {
    if (!showModal) return null;
    
    const isParticipantModal = modalType === 'participants';
    const isAddOrEdit = modalType === 'add' || modalType === 'edit';

    return (
      <div className={styles.modalOverlay} onClick={closeModal}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>
              {modalType === 'add' && 'Add New Event'}
              {modalType === 'edit' && 'Edit Event'}
              {modalType === 'participants' && `Participants for ${selectedEvent.title}`}
            </h2>
            <button onClick={closeModal} className={`${styles.button} ${styles.buttonIcon} ${styles.buttonClose}`}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.modalBody}>
            {/* Add/Edit Event Form */}
            {isAddOrEdit && (
              <form className={styles.form} onSubmit={(e) => {
                e.preventDefault();
                modalType === 'add' ? handleAddEvent() : handleEditEvent();
              }}>
                <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.label}>Event Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={eventForm.title}
                    onChange={handleFormChange}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="date" className={styles.label}>Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={eventForm.date}
                      onChange={handleFormChange}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="category" className={styles.label}>Category</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={eventForm.category}
                      onChange={handleFormChange}
                      className={styles.input}
                      placeholder="e.g., Workshop"
                      required
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="venue" className={styles.label}>Venue</label>
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    value={eventForm.venue}
                    onChange={handleFormChange}
                    className={styles.input}
                    placeholder="e.g., Main Auditorium"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="image" className={styles.label}>Image URL</label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={eventForm.image}
                    onChange={handleFormChange}
                    className={styles.input}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="description" className={styles.label}>Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={eventForm.description}
                    onChange={handleFormChange}
                    className={styles.textarea}
                    rows="4"
                  ></textarea>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" onClick={closeModal} className={`${styles.button} ${styles.buttonSecondary}`}>
                    Cancel
                  </button>
                  <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
                    {modalType === 'add' ? 'Add Event' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Participants List */}
            {isParticipantModal && (
              <div>
                <div className={styles.participantHeader}>
                  <h3 className={styles.participantCount}>
                    {selectedEvent.participants.length} Registered
                  </h3>
                  <button
                    onClick={() => exportToCSV(selectedEvent.participants, selectedEvent.title)}
                    className={`${styles.button} ${styles.buttonSecondary}`}
                  >
                    <Download size={18} /> Export CSV
                  </button>
                </div>
                <div className={styles.participantList}>
                  {selectedEvent.participants.length > 0 ? (
                    selectedEvent.participants.map(p => (
                      <div key={p.id} className={styles.participantItem}>
                        <div className={styles.participantInfo}>
                          <span className={styles.participantName}>{p.name}</span>
                          <span className={styles.participantEmail}>{p.email}</span>
                        </div>
                        <div className={styles.participantDetails}>
                          <span className={styles.participantDetailItem}>{p.branch} - {p.year} Year</span>
                          <span className={styles.participantDetailItem}>ID: {p.regId}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.textMuted}>No participants registered yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Confirmation Modal
  const ConfirmModal = () => {
    if (!showConfirm) return null;
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent} style={{ maxWidth: '400px' }}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Confirm Deletion</h2>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.confirmText}>
              <AlertTriangle size={48} className={styles.confirmIcon} />
              <p>Are you sure you want to delete this event? This action cannot be undone.</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={cancelDelete} className={`${styles.button} ${styles.buttonSecondary}`}>
                Cancel
              </button>
              <button onClick={confirmDelete} className={`${styles.button} ${styles.buttonDelete}`}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <button
        className={`${styles.button} ${styles.buttonIcon} ${styles.menuButton}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <main className={`${styles.mainContent} ${sidebarOpen ? styles.sidebarActive : ''}`}>
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'events' && <EventsView />}
        {currentView === 'profile' && <ProfileView />}
      </main>
      
      <Modal />
      <ConfirmModal />
    </div>
  );
};

// You would typically export this as the default export for your file
export default CoordinatorDashboard;


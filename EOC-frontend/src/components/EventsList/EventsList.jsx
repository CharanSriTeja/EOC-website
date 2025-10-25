import React, { useState, useEffect } from 'react';
import EventCard from '../EventCard/EventCard';
import EventDetailsModal from '../EventDetailsModal/EventDetailsModal';
import { Search } from 'lucide-react';
import styles from './EventsList.module.css';

const EventsList = ({ events, registeredEventIds, onRegister }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ['All', 'dance', 'hackathon', 'workshop', 'competition', 'festival', 'other'];

  // Separate events into upcoming and past
  const separateEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = [];
    const past = [];

    events.forEach(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate >= today && event.status !== 'completed') {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    return { upcoming, past };
  };

  const filterEvents = (eventList) => {
    let filtered = eventList;

    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.theme?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    return filtered;
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const isEventRegistered = (eventId) => {
    return registeredEventIds.some(id => {
      const registeredId = typeof id === 'object' && id._id ? id._id : id;
      return registeredId.toString() === eventId.toString();
    });
  };

  const { upcoming, past } = separateEvents();
  const filteredUpcoming = filterEvents(upcoming);
  const filteredPast = filterEvents(past);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>All Events</h2>
        <p className={styles.subtitle}>Discover and register for upcoming events</p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.categories}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Upcoming Events</h3>
        {filteredUpcoming.length > 0 ? (
          <div className={styles.eventsGrid}>
            {filteredUpcoming.map(event => (
              <EventCard
                key={event._id}
                event={event}
                isRegistered={isEventRegistered(event._id)}
                onRegister={() => onRegister(event._id)}
                onViewDetails={() => handleViewDetails(event)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No upcoming events found</p>
          </div>
        )}
      </div>

      {/* Past Events Section */}
      <div className={styles.section} style={{ marginTop: '3rem' }}>
        <h3 className={styles.sectionTitle}>Past Events</h3>
        {filteredPast.length > 0 ? (
          <div className={styles.eventsGrid}>
            {filteredPast.map(event => (
              <EventCard
                key={event._id}
                event={event}
                isRegistered={isEventRegistered(event._id)}
                onRegister={() => onRegister(event._id)}
                onViewDetails={() => handleViewDetails(event)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No past events found</p>
          </div>
        )}
      </div>

      <EventDetailsModal
        event={selectedEvent}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isRegistered={selectedEvent && isEventRegistered(selectedEvent._id)}
        onRegister={() => selectedEvent && onRegister(selectedEvent._id)}
      />
    </div>
  );
};

export default EventsList;

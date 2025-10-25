import React, { useState, useEffect } from 'react';
import EventCard from '../EventCard/EventCard';
import EventDetailsModal from '../EventDetailsModal/EventDetailsModal';
import { Search } from 'lucide-react';
import styles from './EventsList.module.css';

const EventsList = ({ events, registeredEventIds, onRegister }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Career'];

  useEffect(() => {
    let filtered = events.filter(e => !e.completed && new Date(e.date) >= new Date());

    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory]);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

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
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.resultsInfo}>
        <p className={styles.resultsText}>
          Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {filteredEvents.length > 0 ? (
        <div className={styles.eventsGrid}>
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={registeredEventIds.includes(event.id)}
              onRegister={() => onRegister(event.id)}
              onViewDetails={() => handleViewDetails(event)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No events found matching your criteria</p>
        </div>
      )}

      <EventDetailsModal
        event={selectedEvent}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isRegistered={selectedEvent && registeredEventIds.includes(selectedEvent.id)}
        onRegister={() => selectedEvent && onRegister(selectedEvent.id)}
      />
    </div>
  );
};

export default EventsList;

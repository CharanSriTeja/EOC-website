import React, { useState } from 'react';
import EventCard from '../EventCard/EventCard';
import EventDetailsModal from '../EventDetailsModal/EventDetailsModal';
import { Calendar } from 'lucide-react';
import styles from './MyEvents.module.css';

const MyEvents = ({ events, registeredEventIds, onUnregister }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Helper function to check if event ID is in registered list
  const isEventRegistered = (eventId) => {
    return registeredEventIds.some(id => {
      const registeredId = typeof id === 'object' && id._id ? id._id : id;
      return registeredId.toString() === eventId.toString();
    });
  };

  // Filter only registered events
  const registeredEvents = events.filter(e => isEventRegistered(e._id));

  // Separate upcoming and completed events
  const separateEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = [];
    const completed = [];

    registeredEvents.forEach(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate >= today && event.status !== 'completed') {
        upcoming.push(event);
      } else {
        completed.push(event);
      }
    });

    return { upcoming, completed };
  };

  const { upcoming: upcomingRegistered, completed: completedRegistered } = separateEvents();

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleUnregister = (eventId) => {
    if (window.confirm('Are you sure you want to unregister from this event?')) {
      onUnregister(eventId);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Events</h2>
        <p className={styles.subtitle}>
          You are registered for {registeredEvents.length} event{registeredEvents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {registeredEvents.length > 0 ? (
        <>
          {/* Upcoming Events Section */}
          {upcomingRegistered.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Upcoming Events ({upcomingRegistered.length})
              </h3>
              <div className={styles.eventsGrid}>
                {upcomingRegistered.map(event => (
                  <div key={event._id} className={styles.eventWrapper}>
                    <EventCard
                      event={event}
                      isRegistered={true}
                      onRegister={() => {}}
                      onViewDetails={() => handleViewDetails(event)}
                    />
                    {/* Add unregister button for upcoming events */}
                    <button
                      onClick={() => handleUnregister(event._id)}
                      className={styles.unregisterButton}
                    >
                      Unregister
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Events Section */}
          {completedRegistered.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Completed Events ({completedRegistered.length})
              </h3>
              <div className={styles.eventsGrid}>
                {completedRegistered.map(event => (
                  <div key={event._id} className={styles.eventWrapper}>
                    <EventCard
                      event={event}
                      isRegistered={true}
                      onRegister={() => {}}
                      onViewDetails={() => handleViewDetails(event)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <Calendar size={64} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No Registered Events</p>
          <p className={styles.emptyText}>
            You haven't registered for any events yet. Browse events to get started!
          </p>
        </div>
      )}

      <EventDetailsModal
        event={selectedEvent}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isRegistered={selectedEvent && isEventRegistered(selectedEvent._id)}
        onRegister={() => {}}
      />
    </div>
  );
};

export default MyEvents;

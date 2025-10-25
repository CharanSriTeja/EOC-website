import React, { useState } from 'react';
import EventCard from '../EventCard/EventCard';
import EventDetailsModal from '../EventDetailsModal/EventDetailsModal';
import { Calendar } from 'lucide-react';
import styles from './MyEvents.module.css';

const MyEvents = ({ events, registeredEventIds, onUnregister }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const registeredEvents = events.filter(e => registeredEventIds.includes(e.id));
  const upcomingRegistered = registeredEvents.filter(e => !e.completed && new Date(e.date) >= new Date());
  const completedRegistered = registeredEvents.filter(e => e.completed || new Date(e.date) < new Date());

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Events</h2>
        <p className={styles.subtitle}>View all your registered events</p>
      </div>

      {registeredEvents.length > 0 ? (
        <>
          {upcomingRegistered.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Upcoming Events ({upcomingRegistered.length})</h3>
              <div className={styles.eventsGrid}>
                {upcomingRegistered.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={true}
                    onRegister={() => {}}
                    onViewDetails={() => handleViewDetails(event)}
                    showRegistration={false}
                  />
                ))}
              </div>
            </div>
          )}

          {completedRegistered.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Completed Events ({completedRegistered.length})</h3>
              <div className={styles.eventsGrid}>
                {completedRegistered.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={true}
                    onRegister={() => {}}
                    onViewDetails={() => handleViewDetails(event)}
                    showRegistration={false}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <Calendar size={64} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No Registered Events</p>
          <p className={styles.emptyText}>You haven't registered for any events yet. Browse events to get started!</p>
        </div>
      )}

      <EventDetailsModal
        event={selectedEvent}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isRegistered={selectedEvent && registeredEventIds.includes(selectedEvent.id)}
        onRegister={() => {}}
      />
    </div>
  );
};

export default MyEvents;
import React from 'react';
import { X, Clock, MapPin, Users, Tag } from 'lucide-react';
import styles from './EventDetailsModal.module.css';

const EventDetailsModal = ({ event, isOpen, onClose, isRegistered, onRegister }) => {
  if (!isOpen || !event) return null;

  const isCompleted = event.completed || new Date(event.date) < new Date();

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={`${styles.modalHeader} ${styles[event.category.toLowerCase()]}`}>
          <h2 className={styles.modalTitle}>{event.title}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles[event.category.toLowerCase() + 'Badge']}`}>
              {event.category}
            </span>
            {isCompleted && (
              <span className={`${styles.badge} ${styles.completedBadge}`}>
                Completed
              </span>
            )}
          </div>
          <p className={styles.description}>{event.description}</p>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <Clock size={20} className={styles.icon} />
              <div>
                <p className={styles.detailLabel}>Date & Time</p>
                <p className={styles.detailValue}>{event.date}</p>
                <p className={styles.detailValue}>{event.time}</p>
              </div>
            </div>
            <div className={styles.detailItem}>
              <MapPin size={20} className={styles.icon} />
              <div>
                <p className={styles.detailLabel}>Location</p>
                <p className={styles.detailValue}>{event.location}</p>
              </div>
            </div>
            <div className={styles.detailItem}>
              <Users size={20} className={styles.icon} />
              <div>
                <p className={styles.detailLabel}>Capacity</p>
                <p className={styles.detailValue}>{event.registered} / {event.capacity} registered</p>
              </div>
            </div>
            <div className={styles.detailItem}>
              <Tag size={20} className={styles.icon} />
              <div>
                <p className={styles.detailLabel}>Duration</p>
                <p className={styles.detailValue}>{event.duration}</p>
              </div>
            </div>
          </div>
          <div className={styles.organizer}>
            <p className={styles.detailLabel}>Organized by</p>
            <p className={styles.organizerValue}>{event.organizer}</p>
          </div>
          {!isCompleted && (
            <button
              onClick={() => {
                onRegister();
                onClose();
              }}
              disabled={isRegistered || event.registered >= event.capacity}
              className={`${styles.registerButton} ${
                isRegistered ? styles.registered : event.registered >= event.capacity ? styles.disabled : ''
              }`}
            >
              {isRegistered ? 'Already Registered' : event.registered >= event.capacity ? 'Event Full' : 'Register Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
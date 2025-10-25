import React from 'react';
import { Clock, MapPin, Tag } from 'lucide-react';
import styles from './EventCard.module.css';

const EventCard = ({ event, isRegistered, onRegister, onViewDetails, showRegistration = true }) => {
  const isCompleted = event.completed || new Date(event.date) < new Date();
  const spotsLeft = event.capacity - event.registered;
  const isFull = spotsLeft <= 0;

  return (
    <div className={styles.card}>
      <div className={`${styles.cardHeader} ${styles[event.category.toLowerCase()]}`}>
        <h3 className={styles.cardTitle}>{event.title}</h3>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.badges}>
          <span className={`${styles.badge} ${styles[event.category.toLowerCase() + 'Badge']}`}>
            {event.category}
          </span>
          {isCompleted && (
            <span className={`${styles.badge} ${styles.completedBadge}`}>
              Completed
            </span>
          )}
          {isRegistered && !isCompleted && (
            <span className={`${styles.badge} ${styles.registeredBadge}`}>
              Registered
            </span>
          )}
        </div>
        <p className={styles.description}>{event.description}</p>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <Clock size={16} />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className={styles.detailItem}>
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <div className={styles.detailItem}>
            <Tag size={16} />
            <span>{event.duration}</span>
          </div>
        </div>
        {!isCompleted && (
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              <span>Registration</span>
              <span>{event.registered}/{event.capacity}</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${isFull ? styles.full : ''}`}
                style={{ width: `${(event.registered / event.capacity) * 100}%` }}
              />
            </div>
          </div>
        )}
        <div className={styles.actions}>
          <button onClick={onViewDetails} className={styles.secondaryButton}>
            View Details
          </button>
          {showRegistration && !isCompleted && (
            <button
              onClick={onRegister}
              disabled={isRegistered || isFull}
              className={`${styles.primaryButton} ${
                isRegistered ? styles.registered : isFull ? styles.disabled : ''
              }`}
            >
              {isRegistered ? 'Registered' : isFull ? 'Full' : 'Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;

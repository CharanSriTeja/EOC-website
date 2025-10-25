import React from 'react';
import { X, Calendar, MapPin, Users, Clock, Award } from 'lucide-react';
import styles from './EventDetailsModal.module.css';

const EventDetailsModal = ({ event, isOpen, onClose, isRegistered, onRegister }) => {
  if (!isOpen || !event) return null;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if registration is open
  const isRegistrationOpen = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    
    return event.registrationRequired && 
           eventDate >= today && 
           event.status !== 'completed';
  };

  const registrationOpen = isRegistrationOpen();
  const isCompleted = event.status === 'completed' || new Date(event.date) < new Date();

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      dance: '#9f7aea',
      hackathon: '#4299e1',
      workshop: '#48bb78',
      competition: '#ed8936',
      festival: '#f56565',
      other: '#718096'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header with Image */}
        <div className={styles.modalHeader}>
          <img
            src={event.image || 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360'}
            alt={event.name}
            className={styles.headerImage}
            onError={(e) => {
              e.target.src = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360';
            }}
          />
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
          {isCompleted && (
            <div className={styles.completedOverlay}>
              <span className={styles.completedBadge}>Completed</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* Title and Category */}
          <div className={styles.titleSection}>
            <h2 className={styles.modalTitle}>{event.name}</h2>
            <span 
              className={styles.categoryBadge}
              style={{ backgroundColor: getCategoryColor(event.category) }}
            >
              {event.category}
            </span>
          </div>

          {/* Theme */}
          {event.theme && (
            <p className={styles.theme}>{event.theme}</p>
          )}

          {/* Description */}
          {event.description && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>About Event</h3>
              <p className={styles.description}>{event.description}</p>
            </div>
          )}

          {/* Event Details Grid */}
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <Calendar size={20} className={styles.icon} />
              <div>
                <p className={styles.detailLabel}>Date</p>
                <p className={styles.detailValue}>{formatDate(event.date)}</p>
              </div>
            </div>

            {event.details?.venue && (
              <div className={styles.detailItem}>
                <MapPin size={20} className={styles.icon} />
                <div>
                  <p className={styles.detailLabel}>Venue</p>
                  <p className={styles.detailValue}>{event.details.venue}</p>
                </div>
              </div>
            )}

            {event.details?.duration && (
              <div className={styles.detailItem}>
                <Clock size={20} className={styles.icon} />
                <div>
                  <p className={styles.detailLabel}>Duration</p>
                  <p className={styles.detailValue}>{event.details.duration} hours</p>
                </div>
              </div>
            )}

            {event.participants && (
              <div className={styles.detailItem}>
                <Users size={20} className={styles.icon} />
                <div>
                  <p className={styles.detailLabel}>Participants</p>
                  <p className={styles.detailValue}>{event.participants.length} registered</p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Details */}
          {event.details?.prizes && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Award size={18} /> Prizes
              </h3>
              <p className={styles.detailsText}>{event.details.prizes}</p>
            </div>
          )}

          {event.details?.rules && event.details.rules.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Rules</h3>
              <ul className={styles.rulesList}>
                {event.details.rules.map((rule, index) => (
                  <li key={index} className={styles.ruleItem}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {event.eligibility && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Eligibility</h3>
              <p className={styles.detailsText}>{event.eligibility}</p>
            </div>
          )}

          {/* Organizer */}
          {event.createdBy && (
            <div className={styles.organizer}>
              <p className={styles.detailLabel}>Organized by</p>
              <p className={styles.organizerValue}>
                {event.createdBy.name || 'EOC Club'}
              </p>
            </div>
          )}

          {/* Registration Button */}
          {event.registrationRequired && (
            <div className={styles.actionSection}>
              {registrationOpen ? (
                !isRegistered ? (
                  <button
                    onClick={() => {
                      onRegister();
                      onClose();
                    }}
                    className={styles.registerButton}
                  >
                    Register Now
                  </button>
                ) : (
                  <button
                    className={`${styles.registerButton} ${styles.registered}`}
                    disabled
                  >
                    ✓ Already Registered
                  </button>
                )
              ) : (
                <button
                  className={`${styles.registerButton} ${styles.closed}`}
                  disabled
                >
                  Registration Closed
                </button>
              )}
            </div>
          )}

          {!event.registrationRequired && (
            <div className={styles.noRegistrationInfo}>
              <p>No registration required for this event</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;

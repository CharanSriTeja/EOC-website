import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import styles from './EventCard.module.css';

const EventCard = ({ event, isRegistered, onRegister, onViewDetails }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Check if registration is open
  const isRegistrationOpen = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    
    // Registration is open if:
    // 1. Event requires registration
    // 2. Event date is today or in the future
    // 3. Event status is not completed
    return event.registrationRequired && 
           eventDate >= today && 
           event.status !== 'completed';
  };

  // Get category badge color
  const getCategoryColor = (category) => {
    const colors = {
      dance: '#9f7aea',
      hackathon: '#4299e1',
      workshop: '#48bb78',
      competition: '#ed8936',
      festival: '#f56565',
      other: '#718096',
      'Cultural & Sports Fest': '#ed64a6',
      'National Festival': '#f56565',
      'Academic & Cultural Support': '#4299e1',
      'Health & Social Welfare': '#48bb78',
      'Wellness & Personal Development': '#9f7aea',
      'Academic Workshop': '#4299e1',
      'Project Exhibition': '#ed8936'
    };
    return colors[category] || colors.other;
  };

  const registrationOpen = isRegistrationOpen();

  return (
    <div className={styles.card}>
      {/* Event Image */}
      <div className={styles.imageContainer}>
        <img 
          src={event.image || 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360'} 
          alt={event.name}
          className={styles.image}
          onError={(e) => {
            e.target.src = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360';
          }}
        />
        
        {/* Category Badge */}
        <div 
          className={styles.categoryBadge}
          style={{ backgroundColor: getCategoryColor(event.category) }}
        >
          {event.category}
        </div>

        {/* Status Badge */}
        {event.status === 'upcoming' && (
          <div className={styles.statusBadge}>
            Upcoming
          </div>
        )}
        {event.status === 'completed' && (
          <div className={styles.statusBadgeCompleted}>
            Completed
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{event.name}</h3>
        
        {event.theme && (
          <p className={styles.theme}>{event.theme}</p>
        )}

        <p className={styles.description}>
          {event.description?.substring(0, 100)}
          {event.description?.length > 100 ? '...' : ''}
        </p>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <Calendar size={16} />
            <span>{formatDate(event.date)}</span>
          </div>

          {event.details?.venue && (
            <div className={styles.detailItem}>
              <MapPin size={16} />
              <span>{event.details.venue}</span>
            </div>
          )}

          {event.details?.duration && (
            <div className={styles.detailItem}>
              <Users size={16} />
              <span>{event.details.duration} hours</span>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.detailsButton}
            onClick={onViewDetails}
          >
            View Details
          </button>

          {/* Registration Button Logic */}
          {event.registrationRequired ? (
            registrationOpen ? (
              !isRegistered ? (
                <button 
                  className={styles.registerButton}
                  onClick={onRegister}
                >
                  Register
                </button>
              ) : (
                <button 
                  className={`${styles.registerButton} ${styles.registered}`}
                  disabled
                >
                  Registered ✓
                </button>
              )
            ) : (
              <button 
                className={`${styles.registerButton} ${styles.closed}`}
                disabled
              >
                Registration Closed
              </button>
            )
          ) : (
            <div className={styles.noRegistrationBadge}>
              No Registration Required
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;

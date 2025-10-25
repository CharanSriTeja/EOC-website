import React from 'react';
import { Calendar, Users, Award, Clock, MapPin } from 'lucide-react';
import styles from './HomeOverview.module.css';

const HomeOverview = ({ events, registeredEventIds, onViewAllEvents, onViewMyEvents }) => {
  // Filter upcoming events (date >= today and status not completed)
  const upcomingEvents = events
    .filter(e => {
      const eventDate = new Date(e.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today && e.status !== 'completed';
    })
    .slice(0, 3);

  // Count registered events
  const registeredCount = registeredEventIds.length;

  // Count completed events
  const completedCount = events.filter(e => {
    const eventDate = new Date(e.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today || e.status === 'completed';
  }).length;

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time function (if you have time in your events)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcomeSection}>
        <h2 className={styles.welcomeTitle}>Welcome Back!</h2>
        <p className={styles.welcomeText}>Here's what's happening with your events</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.blueCard}`}>
          <Calendar size={32} className={styles.statIcon} />
          <p className={styles.statLabel}>Upcoming Events</p>
          <p className={styles.statValue}>{upcomingEvents.length}</p>
        </div>
        <div className={`${styles.statCard} ${styles.greenCard}`}>
          <Users size={32} className={styles.statIcon} />
          <p className={styles.statLabel}>Registered Events</p>
          <p className={styles.statValue}>{registeredCount}</p>
        </div>
        <div className={`${styles.statCard} ${styles.purpleCard}`}>
          <Award size={32} className={styles.statIcon} />
          <p className={styles.statLabel}>Completed Events</p>
          <p className={styles.statValue}>{completedCount}</p>
        </div>
      </div>

      <div className={styles.eventsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Upcoming Events</h3>
          <button onClick={onViewAllEvents} className={styles.viewAllButton}>
            View All →
          </button>
        </div>
        {upcomingEvents.length > 0 ? (
          <div className={styles.eventsGrid}>
            {upcomingEvents.map(event => (
              <div key={event._id} className={styles.eventCard}>
                <div className={styles.eventHeader}>
                  <span 
                    className={styles.categoryBadge}
                    style={{
                      backgroundColor: getCategoryColor(event.category)
                    }}
                  >
                    {event.category}
                  </span>
                </div>
                
                <h4 className={styles.eventTitle}>{event.name}</h4>
                
                <p className={styles.eventDescription}>
                  {event.description 
                    ? (event.description.length > 100 
                        ? event.description.substring(0, 100) + '...' 
                        : event.description)
                    : 'No description available'}
                </p>
                
                <div className={styles.eventMeta}>
                  <div className={styles.eventMetaItem}>
                    <Clock size={14} />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  {event.details?.venue && (
                    <div className={styles.eventMetaItem}>
                      <MapPin size={14} />
                      <span>{event.details.venue}</span>
                    </div>
                  )}
                </div>
                
                <button onClick={onViewAllEvents} className={styles.eventButton}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Calendar size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>No upcoming events at the moment</p>
          </div>
        )}
      </div>

      <div className={styles.actionsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
        </div>
        <div className={styles.actionsGrid}>
          <button onClick={onViewAllEvents} className={styles.actionCard}>
            <Calendar size={24} className={styles.actionIcon} />
            <div>
              <p className={styles.actionTitle}>Browse Events</p>
              <p className={styles.actionText}>Explore all upcoming events</p>
            </div>
          </button>
          <button onClick={onViewMyEvents} className={styles.actionCard}>
            <Users size={24} className={styles.actionIcon} />
            <div>
              <p className={styles.actionTitle}>My Events</p>
              <p className={styles.actionText}>View your registered events</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function for category colors
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

export default HomeOverview;

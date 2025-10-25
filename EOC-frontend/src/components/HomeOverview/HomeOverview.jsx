import React from 'react';
import { Calendar, Users, Award, Clock } from 'lucide-react';
import styles from './HomeOverview.module.css';

const HomeOverview = ({ events, registeredEventIds, onViewAllEvents, onViewMyEvents }) => {
  const upcomingEvents = events.filter(e => !e.completed && new Date(e.date) >= new Date()).slice(0, 3);
  const registeredCount = registeredEventIds.length;
  const completedCount = events.filter(e => e.completed || new Date(e.date) < new Date()).length;

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
              <div key={event.id} className={styles.eventCard}>
                <h4 className={styles.eventTitle}>{event.title}</h4>
                <p className={styles.eventDescription}>{event.description}</p>
                <div className={styles.eventTime}>
                  <Clock size={14} />
                  <span>{event.date}</span>
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

export default HomeOverview;

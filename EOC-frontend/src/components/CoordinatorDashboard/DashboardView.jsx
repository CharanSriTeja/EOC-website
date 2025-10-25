import React from 'react';
import { Calendar, Clock, CheckCircle, Users } from 'lucide-react';
import styles from './CoordinatorDashboard.module.css';

const DashboardView = ({ events, upcoming, ongoing, completed, totalParticipants }) => {
  return (
    <div className={styles.viewContainer}>
      <h1 className={styles.headerTitle}>Dashboard Overview</h1>
      
      <div className={styles.statsGrid}>
        {[
          { label: 'Total Events', value: events.length, icon: <Calendar size={24} />, color: 'var(--color-blue)' },
          { label: 'Upcoming', value: upcoming.length, icon: <Clock size={24} />, color: 'var(--color-green)' },
          { label: 'Completed', value: completed.length, icon: <CheckCircle size={24} />, color: 'var(--color-purple)' },
          { label: 'Total Participants', value: totalParticipants, icon: <Users size={24} />, color: 'var(--color-orange)' }
        ].map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: stat.color + '20', color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.todayEventsCard}>
        <h2 className={styles.cardTitle}>Today's Events</h2>
        {ongoing.length === 0 ? (
          <p className={styles.textMuted}>No events scheduled for today</p>
        ) : (
          ongoing.map(event => (
            <div key={event._id} className={styles.todayEventItem}>
  <div className={styles.todayEventCard}>
    <div className={styles.todayEventHeader}>
      <h3 className={styles.todayEventTitle}>{event.name}</h3>
      <span className={`${styles.statusBadge} ${styles.statusOngoing}`}>
        Ongoing
      </span>
    </div>

    <p className={styles.todayEventDescription}>{event.description}</p>

    <div className={styles.todayEventDetails}>
      {/* --- Item 1 --- */}
      <div className={styles.todayEventDetailItem}>
        <div className={styles.todayEventDetailIcon}>
          <Calendar size={16} />
        </div>
        <span>
          {new Date(event.date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* --- Item 2 --- */}
      <div className={styles.todayEventDetailItem}>
        <div className={styles.todayEventDetailIcon}>
          <Users size={16} />
        </div>
        <span>{event.participants?.length || 0} Participants</span>
      </div>

      {/* --- Item 3 --- */}
      <div className={styles.todayEventDetailItem}>
        <div className={styles.todayEventDetailIcon}>
          <span>📍</span>
        </div>
        <span>{event.details?.venue || 'Venue not specified'}</span>
      </div>

      {/* --- Item 4 --- */}
      <div className={styles.todayEventDetailItem}>
        <div className={styles.todayEventDetailIcon}>
          <span>🏷️</span>
        </div>
        <span>{event.category}</span>
      </div>
    </div>

    {event.image && (
      <div className={styles.todayEventImage}>
        <img src={event.image} alt={event.name} />
      </div>
    )}
  </div>
  {/* The extra span at the end has been removed */}
</div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardView;

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
    <div className={styles.todayEventDetailItem}>
      <Calendar size={16} />
      <span>
        {new Date(event.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </span>
    </div>
    
    <div className={styles.todayEventDetailItem}>
      <Users size={16} />
      <span>{event.participants?.length || 0} Participants</span>
    </div>
    
    <div className={styles.todayEventDetailItem}>
      <span>📍</span>
      <span>{event.details?.venue || 'Venue not specified'}</span>
    </div>
    
    <div className={styles.todayEventDetailItem}>
      <span>🏷️</span>
      <span>{event.category}</span>
    </div>
  </div>
  
  {event.image && (
    <div className={styles.todayEventImage}>
      <img src={event.image} alt={event.name} />
    </div>
  )}
</div>

              <span className={`${styles.statusBadge} ${styles.statusOngoing}`}>ONGOING</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardView;

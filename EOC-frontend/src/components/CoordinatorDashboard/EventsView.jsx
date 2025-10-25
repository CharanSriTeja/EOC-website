import React from 'react';
import { Plus, Edit2, Trash2, Users, Calendar, Search } from 'lucide-react';
import styles from './CoordinatorDashboard.module.css';

const DEFAULT_IMAGE = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360';

const EventsView = ({
  events,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  openModal,
  handleDeleteClick,
  getEventStatus,
}) => {
  return (
    <div className={styles.viewContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.headerTitle}>
          {filter === 'completed' ? 'Completed Events' : 'Events Management'}
        </h1>

        <button
          onClick={() => openModal('add')}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          <Plus size={20} /> Add Event
        </button>
      </div>

      <div className={styles.filtersContainer}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {['all', 'upcoming', 'ongoing', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`${styles.button} ${styles.buttonFilter} ${
              filter === f ? styles.active : ''
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.eventGrid}>
        {events.map((event) => {
          const status = getEventStatus(event.date);
          const statusClass = {
            upcoming: styles.statusUpcoming,
            ongoing: styles.statusOngoing,
            completed: styles.statusCompleted,
          }[status];

          // Use default image if event.image is null/undefined/empty
          const eventImage = event.image || DEFAULT_IMAGE;

          return (
            <div key={event._id} className={styles.eventCard}>
              <div className={styles.eventCardImage}>
                <img
                  src={eventImage}
                  alt={event.name}
                  onError={(e) => {
                    e.target.src = DEFAULT_IMAGE; // Fallback if image fails to load
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <span className={`${styles.statusBadge} ${statusClass}`}>
                  {status}
                </span>
              </div>

              <div className={styles.eventCardContent}>
                <div className={styles.eventCardHeader}>
                  <h3 className={styles.eventCardTitle}>{event.name}</h3>
                  <span className={styles.eventCardCategory}>{event.category}</span>
                </div>

                <p className={styles.eventCardDescription}>
                  {event.description || 'No description available'}
                </p>


<div className={styles.eventCardMeta}>
  <div className={styles.eventCardMetaItem}>
    <Calendar size={14} />
    <span>
      {new Date(event.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}
    </span>
  </div>
  {/* Only show participants if registration is required */}
  {event.registrationRequired && (
    <div className={styles.eventCardMetaItem}>
      <Users size={14} />
      <span>{event.participants?.length || 0} Participants</span>
    </div>
  )}
</div>

{/* Update button logic */}
<div className={styles.eventCardActions}>
  {event.registrationRequired ? (
    <button
      onClick={() => openModal('participants', event)}
      className={`${styles.button} ${styles.buttonView}`}
    >
      View Participants
    </button>
  ) : (
    <div className={`${styles.button} ${styles.buttonView}`} style={{ 
      cursor: 'default', 
      opacity: 0.6,
      backgroundColor: '#e2e8f0'
    }}>
      No Registration
    </div>
  )}

  <button
    onClick={() => openModal('edit', event)}
    className={`${styles.button} ${styles.buttonIcon} ${styles.buttonEdit}`}
  >
    <Edit2 size={16} />
  </button>

  <button
    onClick={() => handleDeleteClick(event._id)}
    className={`${styles.button} ${styles.buttonIcon} ${styles.buttonDelete}`}
  >
    <Trash2 size={16} />
  </button>
</div>

              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className={styles.noEvents}>
            No events found {searchQuery && `for "${searchQuery}"`}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsView;

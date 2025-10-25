import React, { useState } from 'react';
import { Bell, CheckCircle, Info, Trash2 } from 'lucide-react';
import styles from './Notifications.module.css';

const Notifications = ({ notifications, onMarkAsRead, onDelete }) => {
  const [filter, setFilter] = useState('all');

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    if (type === 'success') return <CheckCircle size={20} className={styles.successIcon} />;
    return <Info size={20} className={styles.infoIcon} />;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Notifications</h2>
          <p className={styles.subtitle}>
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
      </div>

      <div className={styles.filters}>
        <button
          onClick={() => setFilter('all')}
          className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`${styles.filterButton} ${filter === 'unread' ? styles.active : ''}`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`${styles.filterButton} ${filter === 'read' ? styles.active : ''}`}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      {filteredNotifications.length > 0 ? (
        <div className={styles.notificationsList}>
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`${styles.notificationCard} ${!notification.read ? styles.unread : ''}`}
            >
              <div className={styles.iconWrapper}>
                {getIcon(notification.type)}
              </div>
              <div className={styles.content}>
                <h3 className={styles.notificationTitle}>{notification.title}</h3>
                <p className={styles.notificationMessage}>{notification.message}</p>
                <p className={styles.notificationDate}>{notification.date}</p>
              </div>
              <div className={styles.actions}>
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className={styles.markReadButton}
                    title="Mark as read"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(notification.id)}
                  className={styles.deleteButton}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Bell size={64} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No Notifications</p>
          <p className={styles.emptyText}>
            {filter === 'unread' ? 'You have no unread notifications' : 'No notifications to display'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
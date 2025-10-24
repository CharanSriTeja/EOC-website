import React from 'react';
import { AlertTriangle } from 'lucide-react';
import styles from './CoordinatorDashboard.module.css';

const ConfirmModal = ({ showConfirm, confirmDelete, cancelDelete }) => {
  if (!showConfirm) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ maxWidth: '400px' }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Confirm Deletion</h2>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.confirmText}>
            <AlertTriangle size={48} className={styles.confirmIcon} />
            <p>Are you sure you want to delete this event? This action cannot be undone.</p>
          </div>
          <div className={styles.modalActions}>
            <button
              onClick={cancelDelete}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className={`${styles.button} ${styles.buttonDelete}`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

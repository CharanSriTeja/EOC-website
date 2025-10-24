import React from 'react';
import styles from './CoordinatorDashboard.module.css';

const ProfileView = ({
  profile,
  editingProfile,
  setEditingProfile,
  handleProfileChange,
}) => {
  return (
    <div className={styles.viewContainer}>
      <h1 className={styles.headerTitle}>Profile Settings</h1>

      <div className={styles.profileCard}>
        <div className={styles.profileCardHeader}>
          <h2 className={styles.cardTitle}>Coordinator Information</h2>
          <button
            onClick={() => setEditingProfile(!editingProfile)}
            className={`${styles.button} ${editingProfile ? styles.buttonSecondary : styles.buttonPrimary}`}
          >
            {editingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editingProfile ? (
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.label}>Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={profile.role}
                onChange={handleProfileChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="department" className={styles.label}>Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={profile.department}
                onChange={handleProfileChange}
                className={styles.input}
              />
            </div>

            <button type="submit" className={`${styles.button} ${styles.buttonGreen}`}>
              Save Changes
            </button>
          </form>
        ) : (
          <div className={styles.profileInfo}>
            <div className={styles.profileInfoItem}>
              <span className={styles.profileInfoLabel}>Name</span>
              <span className={styles.profileInfoValue}>{profile.name}</span>
            </div>
            <div className={styles.profileInfoItem}>
              <span className={styles.profileInfoLabel}>Email</span>
              <span className={styles.profileInfoValue}>{profile.email}</span>
            </div>
            <div className={styles.profileInfoItem}>
              <span className={styles.profileInfoLabel}>Role</span>
              <span className={styles.profileInfoValue}>{profile.role}</span>
            </div>
            <div className={styles.profileInfoItem}>
              <span className={styles.profileInfoLabel}>Department</span>
              <span className={styles.profileInfoValue}>{profile.department}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;

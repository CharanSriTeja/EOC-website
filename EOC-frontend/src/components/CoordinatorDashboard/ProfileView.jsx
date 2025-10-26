import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import styles from './CoordinatorDashboard.module.css';

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users/profile');
      
      if (response.data.success) {
        setProfile(response.data.data);
        setFormData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      const response = await axiosInstance.patch('/users/profile', {
        name: formData.name,
        email: formData.email,
      });

      if (response.data.success) {
        setProfile(response.data.data);
        setFormData(response.data.data);
        setEditingProfile(false);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditingProfile(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
      </div>

    );
  }

  if (error) {
    return (
      <div className={styles.viewContainer}>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.viewContainer}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Profile not found
        </div>
      </div>
    );
  }

  return (
    <div className={styles.viewContainer}>
      <h1 className={styles.headerTitle}>Profile Settings</h1>

      <div className={styles.profileCard}>
        <div className={styles.profileCardHeader}>
          <h2 className={styles.cardTitle}>Coordinator Information</h2>
          <button
            onClick={() => editingProfile ? handleCancel() : setEditingProfile(true)}
            className={`${styles.button} ${editingProfile ? styles.buttonSecondary : styles.buttonPrimary}`}
            disabled={saveLoading}
          >
            {editingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editingProfile ? (
          <form className={styles.form} onSubmit={handleSaveProfile}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleProfileChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleProfileChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.label}>Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={profile.role || 'Coordinator'}
                className={styles.input}
                disabled
              />
            </div>

            <button 
              type="submit" 
              className={`${styles.button} ${styles.buttonGreen}`}
              disabled={saveLoading}
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
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
              <span className={styles.profileInfoValue}>
                {profile.role === 'coordinator' ? 'Coordinator' : profile.role}
              </span>
            </div>
            <div className={styles.profileInfoItem}>
              <span className={styles.profileInfoLabel}>Member Since</span>
              <span className={styles.profileInfoValue}>
                {new Date(profile.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;

import React, { useState, useEffect } from 'react';
import { User, Mail, BookOpen, Calendar, Edit2, Save, X } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance'; // Your axios instance
import styles from './Profile.module.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users/profile');
      
      if (response.data.success) {
        setUser(response.data.data);
        setFormData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const response = await axiosInstance.patch('/users/profile', {
        name: formData.name,
        email: formData.email,
        year: formData.year,
        bio: formData.bio,
      });

      if (response.data.success) {
        setUser(response.data.data);
        setFormData(response.data.data);
        setIsEditing(false);
        // Optional: Show success toast/notification
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
    setFormData(user);
    setIsEditing(false);
  };

  if (loading) {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <p className={styles.loaderText}>Loading profile...</p>
    </div>
  );
}


  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>User not found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Profile</h2>
        <button
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          className={styles.editButton}
          disabled={saveLoading}
        >
          {isEditing ? <X size={20} /> : <Edit2 size={20} />}
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>{user.avatar}</div>
          <h3 className={styles.userName}>{user.name}</h3>
          <p className={styles.userRole}>
            {user.role === 'student' ? 'Student' : 'Coordinator'}
          </p>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            {/* Full Name */}
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <User size={18} />
                <span>Full Name</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              ) : (
                <p className={styles.infoValue}>{user.name}</p>
              )}
            </div>

            {/* Email */}
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Mail size={18} />
                <span>Email</span>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              ) : (
                <p className={styles.infoValue}>{user.email}</p>
              )}
            </div>

            {/* Year (only for students) */}
            {user.role === 'student' && (
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>
                  <Calendar size={18} />
                  <span>Year</span>
                </div>
                {isEditing ? (
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                ) : (
                  <p className={styles.infoValue}>{user.year}</p>
                )}
              </div>
            )}

            {/* Registered Events Count */}
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <BookOpen size={18} />
                <span>Registered Events</span>
              </div>
              <p className={styles.infoValue}>
                {user.registeredEvents?.length || 0} events
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div className={styles.bioSection}>
            <div className={styles.infoLabel}>
              <span>Bio</span>
            </div>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className={styles.textarea}
                rows={4}
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
            ) : (
              <p className={styles.bioValue}>
                {user.bio || 'No bio added yet.'}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className={styles.actionButtons}>
              <button 
                onClick={handleCancel} 
                className={styles.cancelButton}
                disabled={saveLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className={styles.saveButton}
                disabled={saveLoading}
              >
                <Save size={18} />
                <span>{saveLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

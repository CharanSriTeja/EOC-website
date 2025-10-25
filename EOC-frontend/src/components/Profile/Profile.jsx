import React, { useState } from 'react';
import { User, Mail, Phone, BookOpen, Calendar, Edit2, Save, X } from 'lucide-react';
import styles from './Profile.module.css';

const Profile = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Profile</h2>
        <button
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          className={styles.editButton}
        >
          {isEditing ? <X size={20} /> : <Edit2 size={20} />}
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>{user.avatar}</div>
          <h3 className={styles.userName}>{user.name}</h3>
          <p className={styles.userRole}>Student</p>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
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
                />
              ) : (
                <p className={styles.infoValue}>{user.name}</p>
              )}
            </div>

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
                />
              ) : (
                <p className={styles.infoValue}>{user.email}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Phone size={18} />
                <span>Phone</span>
              </div>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.infoValue}>{user.phone}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Calendar size={18} />
                <span>Student ID</span>
              </div>
              <p className={styles.infoValue}>{user.studentId}</p>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <BookOpen size={18} />
                <span>Department</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.infoValue}>{user.department}</p>
              )}
            </div>

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
          </div>

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
              />
            ) : (
              <p className={styles.bioValue}>{user.bio}</p>
            )}
          </div>

          {isEditing && (
            <div className={styles.actionButtons}>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleSave} className={styles.saveButton}>
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
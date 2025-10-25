import React from 'react';
import { X, Download } from 'lucide-react';
import styles from './CoordinatorDashboard.module.css';

const Modal = ({
  showModal,
  closeModal,
  modalType,
  eventForm,
  handleFormChange,
  handleAddEvent,
  handleEditEvent,
  selectedEvent,
  exportToCSV,
}) => {
  if (!showModal) return null;

  const isParticipantModal = modalType === 'participants';
  const isAddOrEdit = modalType === 'add' || modalType === 'edit';

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'dance', label: 'Dance' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'competition', label: 'Competition' },
    { value: 'festival', label: 'Festival' },
    { value: 'other', label: 'Other' },
    { value: 'Cultural & Sports Fest', label: 'Cultural & Sports Fest' },
    { value: 'National Festival', label: 'National Festival' },
    { value: 'Academic & Cultural Support', label: 'Academic & Cultural Support' },
    { value: 'Health & Social Welfare', label: 'Health & Social Welfare' },
    { value: 'Wellness & Personal Development', label: 'Wellness & Personal Development' },
    { value: 'Academic Workshop', label: 'Academic Workshop' },
    { value: 'Project Exhibition', label: 'Project Exhibition' },
  ];

  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {modalType === 'add' && 'Add New Event'}
            {modalType === 'edit' && 'Edit Event'}
            {modalType === 'participants' && `Participants for ${selectedEvent?.name}`}
          </h2>
          <button onClick={closeModal} className={`${styles.button} ${styles.buttonIcon} ${styles.buttonClose}`}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Add/Edit Event Form */}
          {isAddOrEdit && (
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                modalType === 'add' ? handleAddEvent() : handleEditEvent();
              }}
            >
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Event Title</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={eventForm.name}
                  onChange={handleFormChange}
                  className={styles.input}
                  required
                  placeholder="Enter event name"
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="date" className={styles.label}>Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={eventForm.date}
                    onChange={handleFormChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category" className={styles.label}>Category</label>
                  <select
                    id="category"
                    name="category"
                    value={eventForm.category}
                    onChange={handleFormChange}
                    className={styles.input}
                    required
                  >
                    {categoryOptions.map(option => (
                      <option 
                        key={option.value} 
                        value={option.value}
                        disabled={option.value === ''}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="venue" className={styles.label}>Venue</label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={eventForm.venue}
                  onChange={handleFormChange}
                  className={styles.input}
                  placeholder="e.g., Main Auditorium"
                  required
                />
              </div>

              {/* NEW: Registration Required Toggle */}
              <div className={styles.formGroup}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    id="registrationRequired"
                    name="registrationRequired"
                    checked={eventForm.registrationRequired}
                    onChange={(e) => handleFormChange({
                      target: {
                        name: 'registrationRequired',
                        value: e.target.checked
                      }
                    })}
                    className={styles.checkbox}
                  />
                  <label htmlFor="registrationRequired" className={styles.checkboxLabel}>
                    Registration Required
                    <small style={{ display: 'block', color: '#718096', fontWeight: 'normal' }}>
                      Enable this if participants need to register for this event
                    </small>
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image" className={styles.label}>Image URL</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={eventForm.image}
                  onChange={handleFormChange}
                  className={styles.input}
                  placeholder="https://example.com/image.jpg (optional)"
                />
                <small style={{ color: '#718096', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  Leave empty to use default image
                </small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={eventForm.description}
                  onChange={handleFormChange}
                  className={styles.textarea}
                  rows="4"
                  placeholder="Enter event description..."
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal} className={`${styles.button} ${styles.buttonSecondary}`}>
                  Cancel
                </button>
                <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
                  {modalType === 'add' ? 'Add Event' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Participants List */}
          {isParticipantModal && (
            <div>
              {selectedEvent?.registrationRequired ? (
                <>
                  <div className={styles.participantHeader}>
                    <h3 className={styles.participantCount}>
                      {selectedEvent?.participants?.length || 0} Registered
                    </h3>
                    {selectedEvent?.participants?.length > 0 && (
                      <button
                        onClick={() => exportToCSV(selectedEvent.participants, selectedEvent.name)}
                        className={`${styles.button} ${styles.buttonSecondary}`}
                      >
                        <Download size={18} /> Export CSV
                      </button>
                    )}
                  </div>
                  <div className={styles.participantList}>
                    {selectedEvent?.participants?.length > 0 ? (
                      selectedEvent.participants.map((p, index) => (
                        <div key={p._id || index} className={styles.participantItem}>
                          <div className={styles.participantInfo}>
                            <span className={styles.participantName}>{p.name}</span>
                            <span className={styles.participantEmail}>{p.email}</span>
                          </div>
                          <div className={styles.participantDetails}>
                            {p.year && <span className={styles.participantDetailItem}>{p.year}</span>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={styles.textMuted}>No participants registered yet.</p>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p className={styles.textMuted}>
                    Registration is not required for this event.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

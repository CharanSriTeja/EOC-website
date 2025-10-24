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
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={eventForm.category}
                    onChange={handleFormChange}
                    className={styles.input}
                    placeholder="e.g., Workshop"
                    required
                  />
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

              <div className={styles.formGroup}>
                <label htmlFor="image" className={styles.label}>Image URL</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={eventForm.image}
                  onChange={handleFormChange}
                  className={styles.input}
                  placeholder="https://images.unsplash.com/..."
                />
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
              <div className={styles.participantHeader}>
                <h3 className={styles.participantCount}>
                  {selectedEvent?.participants?.length || 0} Registered
                </h3>
                <button
                  onClick={() => exportToCSV(selectedEvent.participants, selectedEvent.name)}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  <Download size={18} /> Export CSV
                </button>
              </div>
              <div className={styles.participantList}>
                {selectedEvent?.participants?.length > 0 ? (
                  selectedEvent.participants.map(p => (
                    <div key={p._id} className={styles.participantItem}>
                      <div className={styles.participantInfo}>
                        <span className={styles.participantName}>{p.name}</span>
                        <span className={styles.participantEmail}>{p.email}</span>
                      </div>
                      <div className={styles.participantDetails}>
                        <span className={styles.participantDetailItem}>{p.branch} - {p.year} Year</span>
                        <span className={styles.participantDetailItem}>ID: {p.regId}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.textMuted}>No participants registered yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

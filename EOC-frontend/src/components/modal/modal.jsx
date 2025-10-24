// 🟩 At top of file or separate Modal.jsx file
export const Modal = ({ showModal, closeModal, eventForm, handleFormChange, handleAddEvent, handleEditEvent, modalType }) => {
  if (!showModal) return null;
  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <form onSubmit={(e) => {
          e.preventDefault();
          modalType === 'add' ? handleAddEvent() : handleEditEvent();
        }}>
          <input
            type="text"
            name="title"
            value={eventForm.title}
            onChange={handleFormChange}
            placeholder="Event Title"
          />
        </form>
      </div>
    </div>
  );
};

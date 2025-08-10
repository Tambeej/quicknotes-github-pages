import { useState, useEffect } from "react";
import Modal from "react-modal";

export default function NoteModal({
  isOpen,
  onClose,
  note,
  notes,
  setNotes,
  CATEGORIES,
  noteDate,
  setNoteDate,
}) {
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [modalCategory, setModalCategory] = useState("Personal");

  useEffect(() => {
    if (note) {
      setModalTitle(note.title);
      setModalText(note.text);
      setModalCategory(note.category);
    }
  }, [note]);

  const handleUpdateNote = () => {
    const hasChanged =
      modalTitle.trim() !== note.title ||
      modalText.trim() !== note.text ||
      modalCategory !== note.category;

    if (!hasChanged) {
      // Nothing changed — just close the modal
      onClose();
      return;
    }
    const updatedNotes = notes.map((n) =>
      n.date === note.date
        ? {
            ...n,
            title: modalTitle.trim(),
            text: modalText.trim(),
            category: modalCategory,
            updatedAt: new Date().toLocaleString(),
          }
        : n
    );
    setNotes(updatedNotes);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      CATEGORIES={CATEGORIES}
      contentLabel="Note Modal"
      className="custom-modal-content"
      overlayClassName="custom-modal-overlay"
    >
      {note && (
        <div
          className="note-card"
          style={{
            backgroundColor: CATEGORIES[note.category] || CATEGORIES.Personal,
            border: `1px solid ${
              CATEGORIES[note.category] || CATEGORIES.Personal
            }`,
          }}
        >
          <div className="date-and-x">
            <small onClick={onClose} style={{ cursor: "pointer" }}>
              x
            </small>
          </div>

          <input
            className="in-modal-transparent"
            value={modalTitle}
            onChange={(e) => setModalTitle(e.target.value)}
          />
          <select
            value={modalCategory}
            onChange={(e) => setModalCategory(e.target.value)}
          >
            {Object.keys(CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <textarea
            className="in-modal-transparent"
            value={modalText}
            onChange={(e) => setModalText(e.target.value)}
            rows={4}
          />

          <button onClick={handleUpdateNote}>Update</button>
        </div>
      )}
    </Modal>
  );
}

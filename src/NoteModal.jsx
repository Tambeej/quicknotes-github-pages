import { useState, useEffect } from "react";
import Modal from "react-modal";

export default function NoteModal({ isOpen, onClose, note, notes, setNotes }) {
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    if (note) {
      setModalTitle(note.title);
      setModalText(note.text);
    }
  }, [note]);

  const handleUpdateNote = () => {
    const updatedNotes = notes.map((n) =>
      n.date === note.date
        ? {
            ...n,
            title: modalTitle.trim(),
            text: modalText.trim(),
            updatedDate:
              (n.updatedDate || n.date) + "\n" + new Date().toLocaleString(),
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
      contentLabel="Note Modal"
      className="custom-modal-content"
      overlayClassName="custom-modal-overlay"
    >
      {note && (
        <div className="note-card">
          <div className="date-and-x">
            <small onClick={onClose} style={{ cursor: "pointer" }}>
              x
            </small>
          </div>

          <input
            class="in-modal-transparent"
            value={modalTitle}
            onChange={(e) => setModalTitle(e.target.value)}
          />
          <textarea
            class="in-modal-transparent"
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

import { useState } from "react";

import NoteModal from "./NoteModal";

export default function Form() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  function openModal(note, index) {
    setSelectedNote(note);
    setEditingIndex(index);
    setTitle(note.title);
    setNoteText(note.text);
    setIsOpen(true);
  }

  const handleAddNote = () => {
    if (!noteText.trim()) return;

    const newNote = {
      title: title.trim(),
      text: noteText.trim(),
      date: new Date().toLocaleString(),
    };

    setNotes([newNote, ...notes]);
    setNoteText("");
    setTitle("");
  };

  const handleDeleteNote = (indexToDelete) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!shouldDelete) return;
    const filteredNotes = notes.filter((_, index) => index !== indexToDelete);
    setNotes(filteredNotes);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingIndex(null);
    setTitle("");
    setNoteText("");
  };

  return (
    <div className="container">
      <NoteModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        note={selectedNote}
        noteText={noteText}
        setNoteText={setNoteText}
        title={title}
        setTitle={setTitle}
        editingIndex={editingIndex}
        setNotes={setNotes}
        notes={notes}
      />
      <div className="text-container">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Your note..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={8}
        />
        <br />
        <button id="addNoteButton" onClick={handleAddNote}>
          Add Note
        </button>
      </div>
      <div className="notes-grid">
        {notes.map((note, index) => (
          <div
            className="note-card"
            key={index}
            onClick={() => openModal(note, index)}
          >
            <div className="date-and-x">
              <small className="note-date">{note.date}</small>
              <small
                onClick={() => handleDeleteNote(index)}
                style={{ cursor: "pointer" }}
              >
                x
              </small>
            </div>
            <h4 className="title-note">{note.title}</h4>
            <p className="text-note">{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

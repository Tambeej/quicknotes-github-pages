import { useEffect, useState } from "react";

import NoteModal from "./NoteModal";

export default function Form() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem("notes");
      console.log("Stored notes from localStorage:", storedNotes);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        console.log("Parsed notes:", parsedNotes);
        if (Array.isArray(parsedNotes)) {
          console.log("Setting notes state:", parsedNotes);
          setNotes(parsedNotes);
        } else {
          console.error("Stored notes is not an array:", parsedNotes);
        }
      } else {
        console.log("No notes found in localStorage, keeping empty array");
      }
    } catch (error) {
      console.error("Error loading notes from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      try {
        console.log("Saving notes to localStorage:", notes);
        localStorage.setItem("notes", JSON.stringify(notes));
      } catch (error) {
        console.error("Error saving notes to localStorage:", error);
      }
    } else {
      console.log("Skipping save to localStorage: notes array is empty");
    }
  }, [notes]);

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

  const handleDeleteNote = (indexToDelete, e) => {
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(index);
                }}
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

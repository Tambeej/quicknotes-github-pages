import { useEffect, useState } from "react";
import NoteModal from "./NoteModal";

const CATEGORIES = {
  Personal: "#d1e7dd",
  Work: "#f8d7da",
  Other: "#fff3cd",
};

export default function Form() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [noteDate, setNoteDate] = useState("");
  const [noteCategory, setNoteCategory] = useState("Personal");
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
    setNoteDate(note.date);
    setNoteText(note.text);
    setNoteCategory(note.category);
    setIsOpen(true);
  }

  const handleAddNote = () => {
    if (!noteText.trim()) return;

    const newNote = {
      title: title.trim(),
      text: noteText.trim(),
      category: noteCategory,
      createdAt: new Date().toLocaleString(),
      updatedAt: null,
    };

    setNotes([newNote, ...notes]);
    setNoteText("");
    setNoteCategory("Personal");
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
    setNoteCategory("Personal");
  };

  return (
    <div className="container">
      <NoteModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        note={selectedNote}
        noteText={noteText}
        noteCategory={noteCategory}
        setNoteText={setNoteText}
        setNoteCategory={setNoteCategory}
        title={title}
        setTitle={setTitle}
        editingIndex={editingIndex}
        setNotes={setNotes}
        notes={notes}
        CATEGORIES={CATEGORIES}
        setNoteDate={setNoteDate}
        noteDate={noteDate}
      />
      <div className="text-container">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          value={noteCategory}
          onChange={(e) => setNoteCategory(e.target.value)}
          style={{ margin: "10px 0" }}
        >
          {Object.keys(CATEGORIES).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
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
            style={{
              backgroundColor: CATEGORIES[note.category] || CATEGORIES.Personal,
              border: `1px solid ${
                CATEGORIES[note.category] || CATEGORIES.Personal
              }`,
            }}
          >
            <div className="date-and-x">
              <small>Created: {note.createdAt}</small>
              {note.updatedAt && <small>Updated: {note.updatedAt}</small>}
              <small
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(index);
                }}
                style={{ cursor: "pointer", padding: "2px" }}
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

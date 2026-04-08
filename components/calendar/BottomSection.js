"use client";

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import NotesPanel from "./NotesPanel";
import CalendarSection from "./CalendarSection";

function createNoteId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function BottomSection({ onVisibleMonthIndexChange }) {
  const [notes, setNotes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  function handleAddNote(note) {
    setNotes((currentNotes) => [
      {
        id: createNoteId(),
        title: note.title,
        description: note.description,
        date: new Date(note.date),
      },
      ...currentNotes,
    ]);

    toast.success("Note added successfully");
  }

  function handleDeleteNote(noteId) {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));
    toast.success("Note deleted successfully");
  }

  const handleSelectedDateChange = useCallback((date) => {
    setSelectedDate(date ? new Date(date) : null);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-2 p-2 sm:gap-4 sm:p-4 md:p-5 lg:grid-cols-[30%_70%]">
      <NotesPanel
        notes={notes}
        selectedDate={selectedDate}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />
      <CalendarSection
        notes={notes}
        onAddNote={handleAddNote}
        onSelectedDateChange={handleSelectedDateChange}
        onVisibleMonthIndexChange={onVisibleMonthIndexChange}
      />
    </div>
  );
}

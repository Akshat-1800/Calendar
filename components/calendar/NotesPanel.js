"use client";

import { useState } from "react";
import { format, startOfDay } from "date-fns";
import { cn } from "@/utils/cn";
import NoteModal from "./NoteModal";
import NoteDeleteConfirmModal from "./NoteDeleteConfirmModal";
import { getSeason, THEMES } from "@/utils/seasonTheme";

function getNotePreview(text) {
  if (!text) {
    return "No description";
  }

  return text.length > 90 ? `${text.slice(0, 90)}...` : text;
}

function normalizeDay(date) {
  return startOfDay(new Date(date));
}

export default function NotesPanel({ notes, selectedDate, onAddNote, onDeleteNote }) {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitleDraft, setNoteTitleDraft] = useState("");
  const [noteDescriptionDraft, setNoteDescriptionDraft] = useState("");
  const [noteDate, setNoteDate] = useState(null);

  const [showNoteDeleteModal, setShowNoteDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const sortedNotes = [...notes].sort((firstNote, secondNote) => secondNote.date - firstNote.date);
  const notesMonthIndex = selectedDate ? selectedDate.getMonth() : new Date().getMonth();
  const notesTheme = THEMES[getSeason(notesMonthIndex)];

  function handleOpenQuickAdd() {
    const baseDate = selectedDate ? normalizeDay(selectedDate) : normalizeDay(new Date());

    setNoteDate(baseDate);
    setNoteTitleDraft("");
    setNoteDescriptionDraft("");
    setShowNoteModal(true);
  }

  function handleCloseQuickAdd() {
    setShowNoteModal(false);
    setNoteTitleDraft("");
    setNoteDescriptionDraft("");
    setNoteDate(null);
  }

  function handleSaveQuickAdd() {
    const title = noteTitleDraft.trim();

    if (!title || !noteDate || !onAddNote) {
      return;
    }

    onAddNote({
      title,
      description: noteDescriptionDraft.trim(),
      date: new Date(noteDate),
    });

    handleCloseQuickAdd();
  }

  function handleDeleteRequest(note) {
    setNoteToDelete(note);
    setShowNoteDeleteModal(true);
  }

  function handleDeleteCancel() {
    setShowNoteDeleteModal(false);
    setNoteToDelete(null);
  }

  function handleDeleteConfirm() {
    if (!noteToDelete || !onDeleteNote) {
      return;
    }

    onDeleteNote(noteToDelete.id);
    handleDeleteCancel();
  }

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
          Notes
        </h3>

        <button
          type="button"
          onClick={handleOpenQuickAdd}
          aria-label="Add note"
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold leading-none text-white shadow-sm transition-all duration-200 ease-out hover:scale-110 active:scale-95",
            notesTheme.primary,
            notesTheme.primaryHover
          )}
        >
          +
        </button>
      </div>

      <div className="mt-4 max-h-112 space-y-3 overflow-y-auto pr-1 text-sm text-zinc-600">
        {sortedNotes.length === 0 ? (
          <p className="rounded-lg bg-zinc-100 px-3 py-2">
            No notes yet.
          </p>
        ) : (
          sortedNotes.map((note) => (
            <article
              key={note.id}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 transition-all duration-200 ease-out hover:translate-x-1 hover:border-zinc-300 hover:bg-gray-100"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">{note.title}</h4>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {format(note.date, "MMM d")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteRequest(note)}
                  className="rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 transition-all duration-200 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>

              <p className="mt-2 text-sm text-zinc-600">{getNotePreview(note.description)}</p>
            </article>
          ))
        )}
      </div>

      <NoteModal
        open={showNoteModal}
        selectedDate={noteDate}
        noteTitle={noteTitleDraft}
        noteDescription={noteDescriptionDraft}
        onTitleChange={setNoteTitleDraft}
        onDescriptionChange={setNoteDescriptionDraft}
        onSave={handleSaveQuickAdd}
        onCancel={handleCloseQuickAdd}
        theme={notesTheme}
      />

      <NoteDeleteConfirmModal
        open={showNoteDeleteModal && Boolean(noteToDelete)}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </aside>
  );
}

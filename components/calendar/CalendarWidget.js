"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  format,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { toast } from "react-hot-toast";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import DateActionPopover from "./DateActionPopover";
import RangeCreateModal from "./RangeCreateModal";
import RangeDetailsModal from "./RangeDetailsModal";
import RangeDeleteConfirmModal from "./RangeDeleteConfirmModal";
import NoteModal from "./NoteModal";
import {
  getCalendarDays,
  getYearNumber,
  getNextMonth,
  getPreviousMonth,
  MONTH_OPTIONS,
  setMonthInDate,
  setYearInDate,
} from "@/utils/date";

function getEmptyTempRange() {
  return { start: null, end: null };
}

function normalizeDay(date) {
  return startOfDay(new Date(date));
}

function orderRangeDates(firstDate, secondDate) {
  if (!firstDate || !secondDate) {
    return getEmptyTempRange();
  }

  const first = normalizeDay(firstDate);
  const second = normalizeDay(secondDate);

  if (isBefore(second, first)) {
    return { start: second, end: first };
  }

  return { start: first, end: second };
}

function createRangeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function CalendarWidget({ notes = [], onAddNote, onSelectedDateChange }) {
  const today = normalizeDay(new Date());
  const [mode, setMode] = useState("idle");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [tempRange, setTempRange] = useState(getEmptyTempRange());
  const [ranges, setRanges] = useState([]);
  const [activeRangeId, setActiveRangeId] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteDate, setNoteDate] = useState(null);
  const [noteTitleDraft, setNoteTitleDraft] = useState("");
  const [noteDescriptionDraft, setNoteDescriptionDraft] = useState("");

  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(today));
  const [popoverAnchorRect, setPopoverAnchorRect] = useState(null);
  const [rangeNameDraft, setRangeNameDraft] = useState("");
  const [showCreateRangeModal, setShowCreateRangeModal] = useState(false);
  const [showRangeDetailsModal, setShowRangeDetailsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);

  const calendarRef = useRef(null);

  const year = getYearNumber(visibleMonth);
  const monthIndex = visibleMonth.getMonth();
  const yearOptions = useMemo(
    () => Array.from({ length: 11 }, (_, index) => year - 5 + index),
    [year]
  );

  const days = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const selectedDateText = useMemo(
    () => (selectedDate ? format(selectedDate, "EEEE, MMMM do, yyyy") : "No date selected"),
    [selectedDate]
  );

  const activeRange = useMemo(
    () => ranges.find((range) => range.id === activeRangeId) || null,
    [ranges, activeRangeId]
  );

  const isAwaitingEndSelection =
    (mode === "selecting-range" || mode === "editing-range") &&
    Boolean(tempRange.start) &&
    !tempRange.end &&
    !showCreateRangeModal;

  const previewRange = useMemo(() => {
    if (!isAwaitingEndSelection || !tempRange.start) {
      return null;
    }

    const previewEnd = hoveredDate ? normalizeDay(hoveredDate) : normalizeDay(tempRange.start);
    return orderRangeDates(tempRange.start, previewEnd);
  }, [isAwaitingEndSelection, tempRange.start, hoveredDate]);

  useEffect(() => {
    if (!onSelectedDateChange) {
      return;
    }

    onSelectedDateChange(selectedDate ? new Date(selectedDate) : null);
  }, [selectedDate, onSelectedDateChange]);

  function closePopover() {
    setShowPopover(false);
  }

  function hasNote(date) {
    return notes.some((note) => isSameDay(note.date, date));
  }

  function openNoteModalForDate(date, nextActiveNoteId = null) {
    if (!date) {
      return;
    }

    setActiveNoteId(nextActiveNoteId);
    setNoteDate(normalizeDay(date));
    setNoteTitleDraft("");
    setNoteDescriptionDraft("");
    setShowNoteModal(true);
    setShowPopover(false);
    setShowRangeDetailsModal(false);
  }

  function closeNoteModal() {
    setShowNoteModal(false);
    setActiveNoteId(null);
    setNoteDate(null);
    setNoteTitleDraft("");
    setNoteDescriptionDraft("");
  }

  function resetSelectionFlow() {
    setMode("idle");
    setTempRange(getEmptyTempRange());
    setActiveRangeId(null);
    setHoveredDate(null);
    setRangeNameDraft("");
    setShowCreateRangeModal(false);
  }

  function findTopRangeByDate(date) {
    const currentDay = normalizeDay(date);

    for (let index = ranges.length - 1; index >= 0; index -= 1) {
      const range = ranges[index];

      if (isWithinInterval(currentDay, { start: range.start, end: range.end })) {
        return range;
      }
    }

    return null;
  }

  function getRangeStateForDate(date) {
    const currentDay = normalizeDay(date);
    const matchedRange = findTopRangeByDate(currentDay);

    if (matchedRange) {
      const isRangeStart = isSameDay(currentDay, matchedRange.start);
      const isRangeEnd = isSameDay(currentDay, matchedRange.end);

      return {
        isRangeStart,
        isRangeEnd,
        isRangeMiddle: !isRangeStart && !isRangeEnd,
        isPreview: false,
      };
    }

    if (previewRange?.start && previewRange?.end) {
      const interval = { start: previewRange.start, end: previewRange.end };
      const inPreview = isWithinInterval(currentDay, interval);

      if (inPreview) {
        return {
          isRangeStart: false,
          isRangeEnd: false,
          isRangeMiddle: false,
          isPreview: true,
        };
      }
    }

    return {
      isRangeStart: false,
      isRangeEnd: false,
      isRangeMiddle: false,
      isPreview: false,
    };
  }

  function handleStartRange() {
    if (!selectedDate) {
      return;
    }

    setMode("selecting-range");
    setTempRange({ start: normalizeDay(selectedDate), end: null });
    setShowPopover(false);
    setShowRangeDetailsModal(false);
    setShowDeleteConfirmModal(false);
    setActiveRangeId(null);
    setHoveredDate(null);
  }

  function handleCreateRangeCancel() {
    setShowCreateRangeModal(false);
    resetSelectionFlow();
  }

  function handleCreateRangeSave() {
    const rangeName = rangeNameDraft.trim();

    if (!rangeName || !tempRange.start || !tempRange.end) {
      return;
    }

    const orderedRange = orderRangeDates(tempRange.start, tempRange.end);

    setRanges((currentRanges) => [
      ...currentRanges,
      {
        id: createRangeId(),
        name: rangeName,
        start: new Date(orderedRange.start),
        end: new Date(orderedRange.end),
      },
    ]);

    toast.success("Range created successfully");

    setShowCreateRangeModal(false);
    resetSelectionFlow();
  }

  function handleSaveNote() {
    const noteTitle = noteTitleDraft.trim();

    if (!noteDate || !noteTitle || !onAddNote) {
      return;
    }

    onAddNote({
      title: noteTitle,
      description: noteDescriptionDraft.trim(),
      date: new Date(noteDate),
    });

    closeNoteModal();
  }

  function handleAddNoteFromPopover() {
    openNoteModalForDate(selectedDate, null);
  }

  function handleAddNoteFromRangeDetails() {
    openNoteModalForDate(selectedDate || activeRange?.start || null, activeRangeId);
  }

  function handleDeleteRequest() {
    if (!activeRange) {
      return;
    }

    setShowDeleteConfirmModal(true);
  }

  function handleDeleteCancel() {
    setShowDeleteConfirmModal(false);
  }

  function handleDeleteRange() {
    if (!activeRange) {
      return;
    }

    setRanges((currentRanges) =>
      currentRanges.filter((range) => range.id !== activeRange.id)
    );

    toast.success("Range deleted successfully");

    setShowDeleteConfirmModal(false);
    setShowRangeDetailsModal(false);
    setActiveRangeId(null);
  }

  function handleModifyRange() {
    if (!activeRange) {
      return;
    }

    setMode("editing-range");
    setActiveRangeId(activeRange.id);
    setTempRange({ start: normalizeDay(activeRange.start), end: null });
    setShowRangeDetailsModal(false);
    setShowDeleteConfirmModal(false);
    setShowPopover(false);
    setHoveredDate(null);
  }

  function handleDayHover(date) {
    if (!isAwaitingEndSelection) {
      return;
    }

    setHoveredDate(date ? normalizeDay(date) : null);
  }

  function handleDateSelect(date, targetElement) {
    const clickedDate = normalizeDay(date);

    setSelectedDate(clickedDate);
    setPopoverAnchorRect(targetElement?.getBoundingClientRect() ?? null);

    if (mode === "selecting-range") {
      const nextRange = orderRangeDates(tempRange.start, clickedDate);
      setTempRange({ start: new Date(nextRange.start), end: new Date(nextRange.end) });
      setShowCreateRangeModal(true);
      setShowPopover(false);
      return;
    }

    if (mode === "editing-range" && activeRangeId) {
      const nextRange = orderRangeDates(tempRange.start, clickedDate);

      setRanges((currentRanges) =>
        currentRanges.map((range) =>
          range.id === activeRangeId
            ? {
                ...range,
                start: new Date(nextRange.start),
                end: new Date(nextRange.end),
              }
            : range
        )
      );

      resetSelectionFlow();
      return;
    }

    const matchedRange = findTopRangeByDate(clickedDate);

    if (matchedRange) {
      setActiveRangeId(matchedRange.id);
      setShowRangeDetailsModal(true);
      setShowDeleteConfirmModal(false);
      setShowPopover(false);
      return;
    }

    setShowRangeDetailsModal(false);
    setShowDeleteConfirmModal(false);
    setActiveRangeId(null);
    setShowPopover(true);
  }

  useEffect(() => {
    if (!isAwaitingEndSelection) {
      return;
    }

    function handleOutsidePointer(event) {
      if (calendarRef.current?.contains(event.target)) {
        return;
      }

      resetSelectionFlow();
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        resetSelectionFlow();
      }
    }

    document.addEventListener("mousedown", handleOutsidePointer);
    document.addEventListener("touchstart", handleOutsidePointer);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointer);
      document.removeEventListener("touchstart", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAwaitingEndSelection, mode, tempRange.start]);

  function showPreviousMonth() {
    closePopover();
    setVisibleMonth((current) => getPreviousMonth(current));
  }

  function showNextMonth() {
    closePopover();
    setVisibleMonth((current) => getNextMonth(current));
  }

  function jumpToToday() {
    const currentDay = normalizeDay(new Date());
    setSelectedDate(currentDay);
    setVisibleMonth(startOfMonth(currentDay));
    closePopover();
  }

  function handleMonthChange(nextMonthIndex) {
    closePopover();
    setVisibleMonth((current) => setMonthInDate(current, nextMonthIndex));
  }

  function handleYearChange(nextYear) {
    closePopover();
    setVisibleMonth((current) => setYearInDate(current, nextYear));
  }

  return (
    <div ref={calendarRef}>
      <CalendarHeader
        monthOptions={MONTH_OPTIONS}
        monthIndex={monthIndex}
        yearOptions={yearOptions}
        year={year}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onPrevious={showPreviousMonth}
        onNext={showNextMonth}
        onToday={jumpToToday}
      />

      {isAwaitingEndSelection && (
        <p className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-all">
          Selecting range... click end date
        </p>
      )}

      <div className="mt-5">
        <CalendarGrid
          days={days}
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
          onDayHover={handleDayHover}
          getRangeStateForDate={getRangeStateForDate}
          hasNoteForDate={hasNote}
        />
      </div>

      <footer className="mt-5 rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
        <span className="font-medium text-zinc-900">Selected date:</span> {selectedDateText}
      </footer>

      <DateActionPopover
        open={showPopover}
        selectedDate={selectedDate}
        anchorRect={popoverAnchorRect}
        onClose={closePopover}
        onStartRange={handleStartRange}
        onAddNote={handleAddNoteFromPopover}
      />

      <RangeCreateModal
        open={showCreateRangeModal}
        name={rangeNameDraft}
        startDate={tempRange.start}
        endDate={tempRange.end}
        onNameChange={setRangeNameDraft}
        onSave={handleCreateRangeSave}
        onCancel={handleCreateRangeCancel}
      />

      <RangeDetailsModal
        open={showRangeDetailsModal && Boolean(activeRange)}
        range={activeRange}
        onModify={handleModifyRange}
        onAddNote={handleAddNoteFromRangeDetails}
        onDeleteRequest={handleDeleteRequest}
        onClose={() => {
          setShowRangeDetailsModal(false);
          setShowDeleteConfirmModal(false);
          setActiveRangeId(null);
        }}
      />

      <NoteModal
        open={showNoteModal}
        activeNoteId={activeNoteId}
        selectedDate={noteDate}
        noteTitle={noteTitleDraft}
        noteDescription={noteDescriptionDraft}
        onTitleChange={setNoteTitleDraft}
        onDescriptionChange={setNoteDescriptionDraft}
        onSave={handleSaveNote}
        onCancel={closeNoteModal}
      />

      <RangeDeleteConfirmModal
        open={showDeleteConfirmModal && Boolean(activeRange)}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteRange}
      />
    </div>
  );
}

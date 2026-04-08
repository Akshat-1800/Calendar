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
import { cn } from "@/utils/cn";
import { getSeason, THEMES } from "@/utils/seasonTheme";
import {
  getCalendarDays,
  MONTH_OPTIONS,
  setMonthInDate,
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

export default function CalendarWidget({
  notes = [],
  onAddNote,
  onSelectedDateChange,
  onVisibleMonthIndexChange,
}) {
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
  const [recentlyCompletedRange, setRecentlyCompletedRange] = useState(null);

  const calendarRef = useRef(null);

  const monthIndex = visibleMonth.getMonth();
  const year = visibleMonth.getFullYear();
  const season = getSeason(monthIndex);
  const theme = THEMES[season];

  const days = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const monthAnimationKey = useMemo(() => format(visibleMonth, "yyyy-MM"), [visibleMonth]);
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

  useEffect(() => {
    if (!onVisibleMonthIndexChange) {
      return;
    }

    onVisibleMonthIndexChange(monthIndex);
  }, [monthIndex, onVisibleMonthIndexChange]);

  useEffect(() => {
    if (!recentlyCompletedRange) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRecentlyCompletedRange(null);
    }, 260);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [recentlyCompletedRange]);

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
    const isRangeSelectionStart = Boolean(
      isAwaitingEndSelection && tempRange.start && isSameDay(currentDay, tempRange.start)
    );
    const isRecentlyCompleted = Boolean(
      recentlyCompletedRange &&
        isWithinInterval(currentDay, {
          start: recentlyCompletedRange.start,
          end: recentlyCompletedRange.end,
        })
    );

    if (matchedRange) {
      const isRangeStart = isSameDay(currentDay, matchedRange.start);
      const isRangeEnd = isSameDay(currentDay, matchedRange.end);

      return {
        isRangeStart,
        isRangeEnd,
        isRangeMiddle: !isRangeStart && !isRangeEnd,
        isPreview: false,
        isRangeSelectionStart,
        isRecentlyCompleted,
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
          isRangeSelectionStart,
          isRecentlyCompleted,
        };
      }
    }

    return {
      isRangeStart: false,
      isRangeEnd: false,
      isRangeMiddle: false,
      isPreview: false,
      isRangeSelectionStart,
      isRecentlyCompleted,
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

    setRecentlyCompletedRange({
      start: new Date(orderedRange.start),
      end: new Date(orderedRange.end),
    });

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

      setRecentlyCompletedRange({
        start: new Date(nextRange.start),
        end: new Date(nextRange.end),
      });

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
    setVisibleMonth((current) => {
      const nextMonthIndex = (current.getMonth() + 11) % 12;
      return setMonthInDate(current, nextMonthIndex);
    });
  }

  function showNextMonth() {
    closePopover();
    setVisibleMonth((current) => {
      const nextMonthIndex = (current.getMonth() + 1) % 12;
      return setMonthInDate(current, nextMonthIndex);
    });
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

  return (
    <div ref={calendarRef} className="transition-colors duration-300">
      <CalendarHeader
        monthOptions={MONTH_OPTIONS}
        monthIndex={monthIndex}
        year={year}
        onMonthChange={handleMonthChange}
        onPrevious={showPreviousMonth}
        onNext={showNextMonth}
        onToday={jumpToToday}
        theme={theme}
      />

      {isAwaitingEndSelection && (
        <p
          className={cn(
            "mt-3 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-300",
            theme.borderSoft,
            theme.preview,
            theme.textStrong
          )}
        >
          Selecting range... click end date
        </p>
      )}

      <div className="mt-4">
        <div key={monthAnimationKey} className="calendar-grid-enter transition-all duration-300 ease-in-out">
          <CalendarGrid
            days={days}
            selectedDate={selectedDate}
            onSelect={handleDateSelect}
            onDayHover={handleDayHover}
            getRangeStateForDate={getRangeStateForDate}
            hasNoteForDate={hasNote}
            theme={theme}
          />
        </div>
      </div>

      <footer className="mt-4 rounded-2xl bg-zinc-100 px-3 py-2.5 text-sm text-zinc-700 sm:px-4 sm:py-3">
        <span className="font-medium text-zinc-900">Selected date:</span> {selectedDateText}
      </footer>

      <DateActionPopover
        open={showPopover}
        selectedDate={selectedDate}
        anchorRect={popoverAnchorRect}
        onClose={closePopover}
        onStartRange={handleStartRange}
        onAddNote={handleAddNoteFromPopover}
        theme={theme}
      />

      <RangeCreateModal
        open={showCreateRangeModal}
        name={rangeNameDraft}
        startDate={tempRange.start}
        endDate={tempRange.end}
        onNameChange={setRangeNameDraft}
        onSave={handleCreateRangeSave}
        onCancel={handleCreateRangeCancel}
        theme={theme}
      />

      <RangeDetailsModal
        open={showRangeDetailsModal && Boolean(activeRange)}
        range={activeRange}
        onModify={handleModifyRange}
        onAddNote={handleAddNoteFromRangeDetails}
        onDeleteRequest={handleDeleteRequest}
        theme={theme}
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
        theme={theme}
      />

      <RangeDeleteConfirmModal
        open={showDeleteConfirmModal && Boolean(activeRange)}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteRange}
      />
    </div>
  );
}

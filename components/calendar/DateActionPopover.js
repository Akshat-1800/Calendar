"use client";

import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const POPOVER_WIDTH = 256;
const POPOVER_HEIGHT = 164;
const SCREEN_MARGIN = 12;

function getDesktopPopoverPosition(anchorRect) {
  if (typeof window === "undefined") {
    return { top: 80, left: SCREEN_MARGIN, width: POPOVER_WIDTH };
  }

  if (!anchorRect) {
    const fallbackLeft = Math.max((window.innerWidth - POPOVER_WIDTH) / 2, SCREEN_MARGIN);
    return { top: 80, left: Math.round(fallbackLeft), width: POPOVER_WIDTH };
  }

  const nextTop = anchorRect.bottom + 10;
  const top =
    nextTop + POPOVER_HEIGHT > window.innerHeight - SCREEN_MARGIN
      ? Math.max(SCREEN_MARGIN, anchorRect.top - POPOVER_HEIGHT - 10)
      : nextTop;

  const centeredLeft = anchorRect.left + anchorRect.width / 2 - POPOVER_WIDTH / 2;
  const maxLeft = Math.max(SCREEN_MARGIN, window.innerWidth - POPOVER_WIDTH - SCREEN_MARGIN);
  const left = Math.min(Math.max(centeredLeft, SCREEN_MARGIN), maxLeft);

  return { top: Math.round(top), left: Math.round(left), width: POPOVER_WIDTH };
}

export default function DateActionPopover({
  open,
  selectedDate,
  anchorRect,
  onClose,
  onStartRange,
  onAddNote,
}) {
  const desktopPanelRef = useRef(null);
  const mobilePanelRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    function handlePointerDown(event) {
      if (desktopPanelRef.current?.contains(event.target)) {
        return;
      }

      if (mobilePanelRef.current?.contains(event.target)) {
        return;
      }

      if (open) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open, onClose]);

  const desktopStyle = useMemo(() => getDesktopPopoverPosition(anchorRect), [anchorRect]);

  if (typeof document === "undefined" || !selectedDate) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-70">
      <button
        type="button"
        aria-label="Close date actions"
        onClick={onClose}
        className={cn(
          "pointer-events-auto absolute inset-0 bg-zinc-900/45 transition-opacity duration-200 sm:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <section
        ref={desktopPanelRef}
        role="dialog"
        aria-hidden={!open}
        aria-label="Date actions"
        style={desktopStyle}
        className={cn(
          "pointer-events-auto rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl ring-1 ring-black/5 transition-all duration-200 ease-out",
          "fixed hidden w-64 sm:block",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-1 scale-95 opacity-0 pointer-events-none"
        )}
      >
        <p className="mb-3 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-800">
          <span aria-hidden="true">📅 </span>
          {format(selectedDate, "EEE, MMM d, yyyy")}
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onAddNote}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            Add Note
          </button>
          <button
            type="button"
            onClick={onStartRange}
            className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            Start Range
          </button>
        </div>
      </section>

      <section
        ref={mobilePanelRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label="Date actions"
        className={cn(
          "pointer-events-auto fixed inset-x-4 bottom-4 mx-auto w-[min(92vw,22rem)] rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl ring-1 ring-black/5 transition-all duration-200 ease-out sm:hidden",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-[0.98] opacity-0 pointer-events-none"
        )}
      >
        <p className="mb-3 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-800">
          <span aria-hidden="true">📅 </span>
          {format(selectedDate, "EEE, MMM d, yyyy")}
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onAddNote}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            Add Note
          </button>
          <button
            type="button"
            onClick={onStartRange}
            className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            Start Range
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}
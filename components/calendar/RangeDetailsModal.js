"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

function formatDateLabel(date) {
  if (!date) {
    return "-";
  }

  return format(date, "EEE, MMM d, yyyy");
}

export default function RangeDetailsModal({
  open,
  range,
  onModify,
  onAddNote,
  onDeleteRequest,
  onClose,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) {
    return null;
  }

  return mounted
    ? createPortal(
        <div
          className={cn(
            "fixed inset-0 z-80 flex items-center justify-center p-4 transition-all duration-200",
            open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <button
            type="button"
            aria-label="Close range details modal"
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/50"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-label="Range details"
            className={cn(
              "relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl transition-all duration-200",
              open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
            )}
          >
            <h3 className="text-lg font-semibold text-zinc-900">{range?.name || "Range"}</h3>

            <div className="mt-4 rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
              <p>
                <span className="font-semibold text-zinc-900">Start Date:</span> {formatDateLabel(range?.start)}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-zinc-900">End Date:</span> {formatDateLabel(range?.end)}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={onModify}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Modify Dates
              </button>
              <button
                type="button"
                onClick={onAddNote}
                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                Add Note
              </button>
              <button
                type="button"
                onClick={onDeleteRequest}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </section>
        </div>,
        document.body
      )
    : null;
}

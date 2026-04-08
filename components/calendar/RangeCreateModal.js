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

export default function RangeCreateModal({
  open,
  name,
  startDate,
  endDate,
  onNameChange,
  onSave,
  onCancel,
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
        onCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCancel]);

  if (!mounted) {
    return null;
  }

  const canSave = Boolean(name.trim() && startDate && endDate);

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
            aria-label="Close create range modal"
            onClick={onCancel}
            className="absolute inset-0 bg-zinc-900/50"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-label="Create range"
            className={cn(
              "relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl transition-all duration-200",
              open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
            )}
          >
            <h3 className="text-lg font-semibold text-zinc-900">Create Range</h3>

            <div className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-zinc-700" htmlFor="range-name-input">
                Range Name
              </label>
              <input
                id="range-name-input"
                type="text"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="Enter range name"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

              <div className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
                <p>
                  <span className="font-semibold text-zinc-900">Start Date:</span> {formatDateLabel(startDate)}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-zinc-900">End Date:</span> {formatDateLabel(endDate)}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={!canSave}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all",
                  canSave ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-blue-300"
                )}
              >
                Save
              </button>
            </div>
          </section>
        </div>,
        document.body
      )
    : null;
}

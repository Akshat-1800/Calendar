"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

export default function NoteDeleteConfirmModal({ open, onCancel, onConfirm }) {
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

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-90 flex items-center justify-center p-4 transition-all duration-200 ease-out",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <button
        type="button"
        aria-label="Close delete note confirmation"
        onClick={onCancel}
        className="absolute inset-0 bg-zinc-900/45 backdrop-blur-sm transition-opacity duration-200 ease-out"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Delete note confirmation"
        className={cn(
          "relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl transition-all duration-200 ease-out",
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
        )}
      >
        <h3 className="text-lg font-semibold text-zinc-900">Delete Note</h3>
        <p className="mt-2 text-sm text-zinc-600">
          Are you sure you want to delete this note?
        </p>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}

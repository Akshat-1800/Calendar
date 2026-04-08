export default function NotesPanel() {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
        Notes Panel
      </h3>

      <div className="mt-4 space-y-3 text-sm text-zinc-600">
        <p className="rounded-lg bg-zinc-100 px-3 py-2">Placeholder: Add your reminders here.</p>
        <p className="rounded-lg bg-zinc-100 px-3 py-2">Placeholder: Meeting at 11:00 AM.</p>
        <p className="rounded-lg bg-zinc-100 px-3 py-2">Placeholder: Plan weekend goals.</p>
      </div>
    </aside>
  );
}

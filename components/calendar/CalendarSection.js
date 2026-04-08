import CalendarWidget from "./CalendarWidget";

export default function CalendarSection({
  notes,
  onAddNote,
  onSelectedDateChange,
  onVisibleMonthIndexChange,
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
        Calendar Section
      </h3>

      <div className="mt-4">
        <CalendarWidget
          notes={notes}
          onAddNote={onAddNote}
          onSelectedDateChange={onSelectedDateChange}
          onVisibleMonthIndexChange={onVisibleMonthIndexChange}
        />
      </div>
    </section>
  );
}

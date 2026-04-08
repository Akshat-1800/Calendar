import { cn } from "@/utils/cn";

export default function CalendarDayCell({ day, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(day.date)}
      className={cn(
        "relative h-12 rounded-xl border text-sm font-medium transition",
        day.inCurrentMonth
          ? "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100"
          : "border-zinc-100 bg-zinc-50 text-zinc-400 hover:bg-zinc-100",
        day.isToday && "border-emerald-300 bg-emerald-50 text-emerald-800",
        isSelected && "ring-2 ring-zinc-900 ring-offset-1"
      )}
      aria-label={`Select ${day.date.toDateString()}`}
    >
      {day.dayOfMonth}
      {day.isToday && (
        <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-600" />
      )}
    </button>
  );
}

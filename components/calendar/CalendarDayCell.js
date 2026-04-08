import { cn } from "@/utils/cn";

export default function CalendarDayCell({
  day,
  isSelected,
  onSelect,
  onHover,
  rangeState,
  hasNote,
}) {
  const isRangeStart = Boolean(rangeState?.isRangeStart);
  const isRangeEnd = Boolean(rangeState?.isRangeEnd);
  const isRangeMiddle = Boolean(rangeState?.isRangeMiddle);
  const isPreview = Boolean(rangeState?.isPreview);
  const isRangeEdge = isRangeStart || isRangeEnd;
  const useDefaultHover = !isRangeEdge && !isRangeMiddle && !isPreview;

  return (
    <button
      type="button"
      onClick={(event) => onSelect(day.date, event.currentTarget)}
      onMouseEnter={() => onHover?.(day.date)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(day.date)}
      onBlur={() => onHover?.(null)}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center justify-self-center rounded-xl border text-sm md:h-12 md:w-12 md:text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1",
        day.inCurrentMonth
          ? "border-zinc-200 bg-white text-zinc-800"
          : "border-zinc-100 bg-zinc-50 text-zinc-400",
        useDefaultHover && "hover:bg-zinc-100 hover:scale-[1.02]",
        isPreview && "rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100",
        isRangeMiddle && "rounded-xl bg-blue-100 text-blue-900 hover:bg-blue-200",
        isRangeEdge && "rounded-full border-blue-500 bg-blue-500 text-white hover:bg-blue-600",
        hasNote && "ring-2 ring-blue-400 ring-offset-1",
        !hasNote && day.isToday && "ring-1 ring-emerald-400 ring-offset-1",
        isSelected && "outline-2 outline-zinc-900"
      )}
      aria-label={`Select ${day.date.toDateString()}`}
    >
      <span className="relative z-10 font-medium">{day.dayOfMonth}</span>
    </button>
  );
}

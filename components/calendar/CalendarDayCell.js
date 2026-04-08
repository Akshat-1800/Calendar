import { cn } from "@/utils/cn";
import { THEMES } from "@/utils/seasonTheme";

export default function CalendarDayCell({
  day,
  isSelected,
  onSelect,
  onHover,
  rangeState,
  hasNote,
  theme = THEMES.winter,
}) {
  const isRangeStart = Boolean(rangeState?.isRangeStart);
  const isRangeEnd = Boolean(rangeState?.isRangeEnd);
  const isRangeMiddle = Boolean(rangeState?.isRangeMiddle);
  const isPreview = Boolean(rangeState?.isPreview);
  const isRangeSelectionStart = Boolean(rangeState?.isRangeSelectionStart);
  const isRecentlyCompleted = Boolean(rangeState?.isRecentlyCompleted);
  const isRangeEdge = isRangeStart || isRangeEnd;
  const isSavedRangeCell = isRangeEdge || isRangeMiddle;
  const hasRangeVisual = isSavedRangeCell || isPreview;
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
        "relative mx-auto flex aspect-square w-full max-w-8 items-center justify-center rounded-xl border text-[11px] transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 active:scale-95 sm:max-w-10 sm:text-sm md:max-w-11 md:text-base lg:max-w-12",
        day.inCurrentMonth
          ? "border-zinc-200 bg-white text-zinc-800"
          : "border-zinc-100 bg-zinc-50 text-zinc-400",
        useDefaultHover && "hover:bg-zinc-100 hover:shadow-sm md:hover:scale-105",
        isPreview && cn("rounded-xl border transition-colors duration-200 md:hover:scale-105", theme.borderSoft, theme.preview, theme.previewHover),
        isRangeMiddle && cn("rounded-xl border transition-colors duration-200 md:hover:scale-105", theme.borderSoft, theme.light, theme.lightHover),
        isRangeEdge && cn("rounded-xl border transition-colors duration-200 md:hover:scale-105", theme.borderSoft, theme.lightHover),
        isRangeSelectionStart && "animate-pulse",
        isRecentlyCompleted && "range-pop",
        hasNote && cn("ring-2 ring-offset-1", theme.ring),
        !hasNote && day.isToday && "ring-1 ring-emerald-400 ring-offset-1",
        isSelected && "outline-2 outline-zinc-900"
      )}
      aria-label={`Select ${day.date.toDateString()}`}
    >
      <span className={cn("relative z-10 font-medium transition-colors duration-200", hasRangeVisual && theme.textStrong)}>
        {day.dayOfMonth}
      </span>
    </button>
  );
}

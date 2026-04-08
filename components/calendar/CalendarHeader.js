import { ChevronLeft, ChevronRight } from "./Icons";
import { cn } from "@/utils/cn";

export default function CalendarHeader({
  monthOptions,
  monthIndex,
  year,
  onMonthChange,
  onPrevious,
  onNext,
  onToday,
  theme,
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 rounded-xl p-2 transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between",
        theme?.headerGradient
      )}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <label htmlFor="month-selector" className="sr-only">
            Select month
          </label>
          <select
            id="month-selector"
            value={monthIndex}
            onChange={(event) => onMonthChange(Number(event.target.value))}
            className="cursor-pointer appearance-none rounded-lg border-b-2 border-b-transparent bg-gray-100 px-3 py-1 pr-7 text-lg font-semibold tracking-tight text-zinc-900 transition-all duration-200 hover:border-b-zinc-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          >
            {monthOptions.map((monthName, index) => (
              <option key={monthName} value={index}>
                {monthName}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
            ▼
          </span>
        </div>

        <span className="text-lg font-semibold tracking-tight text-zinc-900">{year}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
          aria-label="Go to previous month"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={onToday}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Today
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
          aria-label="Go to next month"
        >
          <ChevronRight />
        </button>
      </div>
    </header>
  );
}

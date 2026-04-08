import { ChevronLeft, ChevronRight } from "./Icons";

export default function CalendarHeader({
  monthOptions,
  monthIndex,
  yearOptions,
  year,
  onMonthChange,
  onYearChange,
  onPrevious,
  onNext,
  onToday,
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <label htmlFor="month-selector" className="sr-only">
              Select month
            </label>
            <select
              id="month-selector"
              value={monthIndex}
              onChange={(event) => onMonthChange(Number(event.target.value))}
              className="cursor-pointer appearance-none rounded-lg border border-zinc-200 bg-white px-3 py-2 pr-7 text-lg font-semibold tracking-tight text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300"
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

          <div className="relative">
            <label htmlFor="year-selector" className="sr-only">
              Select year
            </label>
            <select
              id="year-selector"
              value={year}
              onChange={(event) => onYearChange(Number(event.target.value))}
              className="cursor-pointer appearance-none rounded-lg border border-zinc-200 bg-white px-3 py-2 pr-7 text-lg font-semibold tracking-tight text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300"
            >
              {yearOptions.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
              ▼
            </span>
          </div>
        </div>

        <p className="text-sm text-zinc-600">A clean date-fns powered calendar.</p>
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

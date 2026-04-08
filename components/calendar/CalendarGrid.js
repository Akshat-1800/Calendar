import { isSameDay } from "date-fns";
import { WEEKDAY_LABELS } from "@/utils/date";
import CalendarDayCell from "./CalendarDayCell";

export default function CalendarGrid({
  days,
  selectedDate,
  onSelect,
  onDayHover,
  getRangeStateForDate,
  hasNoteForDate,
  theme,
}) {
  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-2">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 sm:text-xs sm:tracking-wider">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day) => (
          <CalendarDayCell
            key={day.date.toISOString()}
            day={day}
            isSelected={Boolean(selectedDate) && isSameDay(day.date, selectedDate)}
            onSelect={onSelect}
            onHover={onDayHover}
            rangeState={getRangeStateForDate?.(day.date)}
            hasNote={hasNoteForDate?.(day.date)}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}

import { isSameDay } from "date-fns";
import { WEEKDAY_LABELS } from "@/utils/date";
import CalendarDayCell from "./CalendarDayCell";

export default function CalendarGrid({ days, selectedDate, onSelect }) {
  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-2">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <CalendarDayCell
            key={day.date.toISOString()}
            day={day}
            isSelected={isSameDay(day.date, selectedDate)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

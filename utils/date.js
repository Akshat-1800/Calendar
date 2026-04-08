import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getMonthLabel(date) {
  return format(date, "MMMM yyyy");
}

export function getMonthName(date) {
  return MONTH_OPTIONS[date.getMonth()];
}

export function getYearNumber(date) {
  return date.getFullYear();
}

export function getPreviousMonth(date) {
  return subMonths(date, 1);
}

export function getNextMonth(date) {
  return addMonths(date, 1);
}

export function setMonthInDate(date, monthIndex) {
  return startOfMonth(setMonth(date, monthIndex));
}

export function setYearInDate(date, year) {
  return startOfMonth(setYear(date, year));
}

export function getCalendarDays(monthDate) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);

  const rangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const rangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: rangeStart, end: rangeEnd }).map((date) => ({
    date,
    dayOfMonth: format(date, "d"),
    inCurrentMonth: isSameMonth(date, monthDate),
    isToday: isToday(date),
  }));
}

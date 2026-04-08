"use client";

import { useMemo, useState } from "react";
import { format, startOfMonth } from "date-fns";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import {
  getCalendarDays,
  getYearNumber,
  getNextMonth,
  getPreviousMonth,
  MONTH_OPTIONS,
  setMonthInDate,
  setYearInDate,
} from "@/utils/date";

export default function CalendarWidget() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(today));
  const year = getYearNumber(visibleMonth);
  const monthIndex = visibleMonth.getMonth();
  const yearOptions = useMemo(
    () => Array.from({ length: 11 }, (_, index) => year - 5 + index),
    [year]
  );

  const days = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const selectedDateText = useMemo(
    () => format(selectedDate, "EEEE, MMMM do, yyyy"),
    [selectedDate]
  );

  function showPreviousMonth() {
    setVisibleMonth((current) => getPreviousMonth(current));
  }

  function showNextMonth() {
    setVisibleMonth((current) => getNextMonth(current));
  }

  function jumpToToday() {
    const currentDay = new Date();
    setSelectedDate(currentDay);
    setVisibleMonth(startOfMonth(currentDay));
  }

  function handleMonthChange(nextMonthIndex) {
    setVisibleMonth((current) => setMonthInDate(current, nextMonthIndex));
  }

  function handleYearChange(nextYear) {
    setVisibleMonth((current) => setYearInDate(current, nextYear));
  }

  return (
    <div>
      <CalendarHeader
        monthOptions={MONTH_OPTIONS}
        monthIndex={monthIndex}
        yearOptions={yearOptions}
        year={year}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onPrevious={showPreviousMonth}
        onNext={showNextMonth}
        onToday={jumpToToday}
      />

      <div className="mt-5">
        <CalendarGrid days={days} selectedDate={selectedDate} onSelect={setSelectedDate} />
      </div>

      <footer className="mt-5 rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
        <span className="font-medium text-zinc-900">Selected date:</span> {selectedDateText}
      </footer>
    </div>
  );
}

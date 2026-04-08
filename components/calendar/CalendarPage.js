"use client";

import { useState } from "react";
import HeroImage from "./HeroImage";
import HangingString from "./HangingString";
import BottomSection from "./BottomSection";

export default function CalendarPage() {
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());

  return (
    <main className="min-h-dvh bg-transparent">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-2 py-2 sm:px-4 sm:py-4">
        <div className="flex w-full items-center justify-center bg-transparent p-1 sm:p-3 md:p-4">
          <div className="group relative w-full max-w-3xl">
            <span
              className="absolute left-1/2 top-0 z-30 h-2 w-2 -translate-x-1/2 rounded-full bg-zinc-800 shadow-[0_4px_10px_rgba(24,24,27,0.42)]"
              aria-hidden="true"
            />

            <HangingString />

            <section className="relative z-20 mt-4 w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl ring-1 ring-inset ring-white/55 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl">
              <div className="h-3 border-b border-zinc-300 bg-zinc-200/95">
                <div className="mx-auto flex h-full w-full items-center justify-between px-3 sm:px-6">
                  {Array.from({ length: 14 }, (_, index) => (
                    <span key={index} className="h-2 w-2 rounded-full bg-zinc-500" aria-hidden="true" />
                  ))}
                </div>
              </div>

              <HeroImage monthIndex={monthIndex} />
              <BottomSection onVisibleMonthIndexChange={setMonthIndex} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

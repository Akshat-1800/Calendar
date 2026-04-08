"use client";

import { useState } from "react";
import HeroImage from "./HeroImage";
import HangingString from "./HangingString";
import BottomSection from "./BottomSection";

export default function CalendarPage() {
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-3 py-4 sm:px-6 sm:py-10">
        <div className="flex min-h-[82vh] w-full max-w-6xl items-center justify-center bg-transparent p-2 sm:p-8 md:p-10">
          <div className="group relative w-full max-w-4xl">
            <span
              className="absolute left-1/2 top-0 z-30 h-2 w-2 -translate-x-1/2 rounded-full bg-zinc-800 shadow-[0_4px_10px_rgba(24,24,27,0.42)]"
              aria-hidden="true"
            />

            <HangingString />

            <section className="relative z-20 mt-5 w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl ring-1 ring-inset ring-white/55 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl">
              <div className="h-3 border-b border-zinc-300 bg-zinc-200/95">
                <div className="mx-auto flex h-full w-full items-center justify-between px-3 sm:px-8">
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

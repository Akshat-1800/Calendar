import HeroImage from "./HeroImage";
import HangingString from "./HangingString";
import BottomSection from "./BottomSection";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex min-h-[82vh] w-full max-w-6xl items-center justify-center bg-neutral-100 p-5 sm:p-8 md:p-10">
          <div className="group relative w-full max-w-4xl">
            <span
              className="absolute left-1/2 top-0 z-30 h-2 w-2 -translate-x-1/2 rounded-full bg-zinc-800 shadow-sm"
              aria-hidden="true"
            />

            <HangingString />

            <section className="relative z-20 mt-6 w-full overflow-hidden rounded-3xl border border-gray-200 bg-neutral-50 shadow-lg ring-1 ring-inset ring-white/55 transition duration-300 hover:translate-y-1">
              <HeroImage />
              <BottomSection />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

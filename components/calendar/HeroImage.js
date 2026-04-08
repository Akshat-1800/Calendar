import { getSeason, THEMES } from "@/utils/seasonTheme";

export default function HeroImage({ monthIndex = new Date().getMonth() }) {
  const season = getSeason(monthIndex);
  const theme = THEMES[season];

  return (
    <div className="relative h-40 w-full overflow-hidden rounded-t-3xl transition-colors duration-300 sm:h-48 md:h-52">
      <img
        src={theme.image}
        alt={`${season} seasonal landscape`}
        className="h-full w-full object-cover transition-opacity duration-300"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/25 to-transparent"
        aria-hidden="true"
      />

      <div className="absolute bottom-4 left-4 right-4 text-white sm:bottom-5 sm:left-5 sm:right-5">
        <p className="text-xs uppercase tracking-[0.2em] text-white/85">Daily planning</p>
        <h3 className="mt-1 text-xl font-semibold leading-tight sm:text-2xl">Keep Your Month In Focus</h3>
      </div>
    </div>
  );
}

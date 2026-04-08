export default function HangingString() {
  return (
    <span
      className="pointer-events-none absolute left-1/2 top-1.5 z-10 h-6 w-[6px] -translate-x-1/2 bg-linear-to-b from-zinc-900/95 via-zinc-700/85 to-zinc-500/45 [clip-path:polygon(50%_0%,100%_100%,0_100%)] opacity-95 transition-all duration-300 ease-out group-hover:h-7 group-hover:opacity-100 group-hover:rotate-1"
      aria-hidden="true"
    />
  );
}

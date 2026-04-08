export default function HangingString() {
  return (
    <span
      className="pointer-events-none absolute left-1/2 top-2 z-10 h-4 w-px -translate-x-1/2 bg-gray-400/80 transition-[height] duration-300 ease-out group-hover:h-5"
      aria-hidden="true"
    />
  );
}

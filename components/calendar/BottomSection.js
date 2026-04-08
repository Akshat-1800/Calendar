import NotesPanel from "./NotesPanel";
import CalendarSection from "./CalendarSection";

export default function BottomSection() {
  return (
    <div className="grid grid-cols-1 gap-4 p-5 sm:gap-5 sm:p-7 md:p-8 lg:grid-cols-[30%_70%]">
      <NotesPanel />
      <CalendarSection />
    </div>
  );
}

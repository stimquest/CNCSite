"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const parseDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const toDateKey = (date: Date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, "0"),
  String(date.getDate()).padStart(2, "0"),
].join("-");

interface FrenchWeekDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function FrenchWeekDatePicker({ value, onChange }: FrenchWeekDatePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedDate = parseDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [displayedMonth, setDisplayedMonth] = useState(() => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  useEffect(() => {
    if (isOpen) {
      const date = parseDate(value);
      setDisplayedMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }, [isOpen, value]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1);
    const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
    const firstCell = new Date(firstOfMonth);
    firstCell.setDate(firstCell.getDate() - mondayOffset);
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(firstCell);
      day.setDate(firstCell.getDate() + index);
      return day;
    });
  }, [displayedMonth]);

  const selectedMonday = parseDate(value);
  selectedMonday.setDate(selectedMonday.getDate() - ((selectedMonday.getDay() + 6) % 7));
  const selectedSunday = new Date(selectedMonday);
  selectedSunday.setDate(selectedMonday.getDate() + 6);
  const displayValue = selectedMonday.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const monthLabel = displayedMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const todayKey = toDateKey(new Date());

  return (
    <div ref={rootRef} className="relative not-italic">
      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="flex w-full items-center gap-3 rounded-xl border border-orange-200 bg-white p-3 text-left shadow-sm transition hover:border-orange-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
          <CalendarDays size={19} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-orange-600">Choisir une semaine</span>
          <span className="mt-0.5 block truncate text-sm font-black capitalize text-abysse">{displayValue}</span>
        </span>
        <ChevronRight size={16} className={"shrink-0 text-orange-400 transition-transform " + (isOpen ? "rotate-90" : "")} />
      </button>

      {isOpen && (
        <div role="dialog" aria-label="Choisir une semaine" className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full min-w-[300px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:min-w-[320px]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Mois précédent"
              onClick={() => setDisplayedMonth(month => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-abysse"
            ><ChevronLeft size={18} /></button>
            <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">Calendrier</p>
              <h3 className="text-sm font-black capitalize text-abysse">{monthLabel}</h3>
            </div>
            <button
              type="button"
              aria-label="Mois suivant"
              onClick={() => setDisplayedMonth(month => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-abysse"
            ><ChevronRight size={18} /></button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => (
              <span key={day + index} className="py-1 text-center text-[9px] font-black uppercase tracking-wide text-slate-400">{day}</span>
            ))}
            {calendarDays.map((day, index) => {
              const dayKey = toDateKey(day);
              const isInMonth = day.getMonth() === displayedMonth.getMonth();
              const isInSelectedWeek = day >= selectedMonday && day <= selectedSunday;
              const isSelected = dayKey === toDateKey(selectedMonday);
              const isToday = dayKey === todayKey;
              const dayClass = "relative flex aspect-square items-center justify-center rounded-lg text-xs font-bold transition "
                + (isSelected ? "bg-abysse text-white shadow-md " : isInSelectedWeek ? "bg-orange-100 text-orange-900 " : "text-slate-700 hover:bg-slate-100 ")
                + (!isInMonth ? "opacity-30 " : "")
                + (isToday && !isSelected ? "ring-1 ring-inset ring-turquoise" : "");
              return (
                <button
                  key={dayKey}
                  type="button"
                  aria-label={day.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  aria-pressed={isInSelectedWeek}
                  onClick={() => {
                    const monday = new Date(day);
                    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
                    onChange(toDateKey(monday));
                    setIsOpen(false);
                  }}
                  className={dayClass}
                >
                  {day.getDate()}
                  {index % 7 === 0 && isInSelectedWeek && <span className="absolute bottom-0.5 size-1 rounded-full bg-orange-500" />}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[10px] text-slate-500">Semaine du <strong className="capitalize text-abysse">{selectedMonday.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</strong></span>
            <button
              type="button"
              onClick={() => {
                const monday = new Date();
                monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
                onChange(toDateKey(monday));
                setDisplayedMonth(new Date(monday.getFullYear(), monday.getMonth(), 1));
                setIsOpen(false);
              }}
              className="rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-wide text-turquoise hover:bg-turquoise/10"
            >Cette semaine</button>
          </div>
        </div>
      )}
    </div>
  );
}

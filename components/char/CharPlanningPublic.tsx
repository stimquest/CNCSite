"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Phone, Monitor, CalendarDays } from 'lucide-react';

interface CharSessionPublic {
    _id: string;
    date: string;
    heureDebut: string;
    heureFin: string;
    capaciteMax: number;
    placesReservees: number;
}

interface Props {
    sessions: CharSessionPublic[];
    phoneNumber?: string;
}

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function getCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7;
    const days: (Date | null)[] = Array(startDow).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(year, month, d));
    }
    while (days.length % 7 !== 0) days.push(null);
    return days;
}

function toIso(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// --- Composant CTA adaptif mobile/desktop ---
function PhoneCallCta({ phoneNumber, label = 'Appeler pour réserver', size = 'lg' }: { phoneNumber: string; label?: string; size?: 'sm' | 'lg' }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Touch primary input = mobile/tablette
        const mql = window.matchMedia('(pointer: coarse)');
        setIsMobile(mql.matches);
        const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mql.addEventListener('change', listener);
        return () => mql.removeEventListener('change', listener);
    }, []);

    if (size === 'sm') {
        return isMobile ? (
            <a
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="mt-3 flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-abysse transition-all"
            >
                <Phone size={14} /> {label}
            </a>
        ) : (
            <div className="mt-3 flex items-center justify-center gap-2 py-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl">
                <Phone size={14} />
                <span className="font-black text-sm tracking-tight">{phoneNumber}</span>
            </div>
        );
    }

    // Version large — bannière principale
    return isMobile ? (
        <a
            href={`tel:${phoneNumber.replace(/\s/g, '')}`}
            className="flex items-center gap-3 bg-linear-to-r from-orange-500 to-orange-400 text-white px-5 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-500 transition-all group"
        >
            <div className="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <Phone size={20} />
            </div>
            <div>
                <p className="font-black text-xs uppercase tracking-wider opacity-80">Appuyez pour appeler</p>
                <p className="font-black text-xl tracking-tight">{phoneNumber}</p>
            </div>
            <div className="ml-auto opacity-60 group-hover:translate-x-1 transition-transform text-lg">→</div>
        </a>
    ) : (
        <div className="flex items-center gap-4 bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200 px-6 py-4 rounded-2xl shadow-sm">
            <div className="p-2.5 bg-orange-100 rounded-xl text-orange-500">
                <Phone size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-orange-500 mb-0.5">Réservation par téléphone</p>
                <p className="font-black text-2xl text-abysse tracking-tight">{phoneNumber}</p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-slate-400">
                <Monitor size={14} />
                <span className="text-[10px] font-bold text-slate-400">Composez ce numéro</span>
            </div>
        </div>
    );
}


export default function CharPlanningPublic({ sessions, phoneNumber = '02 33 47 14 81' }: Props) {
    const now = new Date();
    const todayIso = toIso(now);
    const upcomingDates = useMemo(() => [...new Set(sessions.map(s => s.date))]
        .filter(date => date >= todayIso).sort(), [sessions, todayIso]);
    const firstDate = upcomingDates[0];
    const [currentYear, setCurrentYear] = useState(() => firstDate ? Number(firstDate.slice(0, 4)) : now.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(() => firstDate ? Number(firstDate.slice(5, 7)) - 1 : now.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(() => firstDate ?? null);

    const sessionsByDate = useMemo(() => {
        const map: Record<string, CharSessionPublic[]> = {};
        for (const s of sessions) {
            if (!map[s.date]) map[s.date] = [];
            map[s.date].push(s);
        }
        Object.values(map).forEach(daySessions => daySessions.sort((a, b) => a.heureDebut.localeCompare(b.heureDebut)));
        return map;
    }, [sessions]);

    const selectedSessions = selectedDate ? (sessionsByDate[selectedDate] ?? []) : [];
    const calendarDays = getCalendarDays(currentYear, currentMonth);
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const monthDates = upcomingDates.filter(date => date.startsWith(monthPrefix));
    const nextScheduledDate = upcomingDates.find(date => date.slice(0, 7) > monthPrefix);

    const showMonth = (offset: number) => {
        const date = new Date(currentYear, currentMonth + offset, 1);
        const prefix = toIso(date).slice(0, 7);
        setCurrentYear(date.getFullYear());
        setCurrentMonth(date.getMonth());
        setSelectedDate(upcomingDates.find(day => day.startsWith(prefix)) ?? null);
    };
    const jumpToDate = (date: string) => {
        setCurrentYear(Number(date.slice(0, 4)));
        setCurrentMonth(Number(date.slice(5, 7)) - 1);
        setSelectedDate(date);
    };

    const getAvailability = (session: CharSessionPublic) => {
        if ((session.placesReservees ?? 0) >= session.capaciteMax * 0.6) return { label: 'Très demandé', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' };
        return { label: 'Disponible', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    };

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black uppercase italic text-abysse tracking-tighter">
                    Planning Char à Voile
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Choisissez un jour coloré pour voir les horaires, puis appelez-nous pour réserver.
                </p>
            </div>

            {/* CTA téléphone — adaptatif mobile/desktop */}
            <PhoneCallCta phoneNumber={phoneNumber} size="lg" />

            {firstDate && (
                <button type="button" onClick={() => jumpToDate(firstDate)} className="w-full flex items-center gap-3 rounded-2xl bg-abysse px-4 py-3 text-left text-white hover:bg-abysse/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500">
                    <CalendarDays size={22} className="shrink-0 text-turquoise" aria-hidden="true" />
                    <span className="flex-1">
                        <span className="block text-[10px] uppercase tracking-wider text-white/70 font-bold">Prochaine séance</span>
                        <span className="block text-sm font-bold">{new Date(`${firstDate}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </span>
                    <ChevronRight size={18} aria-hidden="true" />
                </button>
            )}

            {/* CALENDAR VIEW */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <button type="button" aria-label="Mois précédent" onClick={() => showMonth(-1)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-abysse">
                        <ChevronLeft size={18} />
                    </button>
                    <h3 className="font-black text-sm uppercase tracking-widest text-abysse">
                        {MONTHS_FR[currentMonth]} {currentYear}
                    </h3>
                    <button type="button" aria-label="Mois suivant" onClick={() => showMonth(1)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-abysse">
                        <ChevronRight size={18} />
                    </button>
                </div>

                {monthDates.length === 0 && (
                    <div className="px-5 py-4 bg-slate-50 border-b border-slate-200" role="status">
                        <p className="text-sm font-bold text-abysse">Aucune séance à venir en {MONTHS_FR[currentMonth].toLowerCase()}.</p>
                        {nextScheduledDate ? (
                            <button type="button" onClick={() => jumpToDate(nextScheduledDate)} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-orange-700 underline underline-offset-4">
                                Voir les prochaines séances <ChevronRight size={15} aria-hidden="true" />
                            </button>
                        ) : (
                            <p className="mt-1 text-xs leading-relaxed text-slate-500">Appelez-nous pour connaître les prochaines possibilités.</p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/30">
                    {DAYS_SHORT.map(d => (
                        <div key={d} className="py-2 text-center text-[10px] font-black uppercase text-slate-400 tracking-wider">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7">
                    {calendarDays.map((day, idx) => {
                        if (!day) return <div key={idx} className="min-h-[62px] bg-slate-50/40" />;

                        const iso = toIso(day);
                        const daySessions = sessionsByDate[iso] ?? [];
                        const hasSession = daySessions.length > 0;
                        const isToday = iso === todayIso;
                        const isPast = iso < todayIso;
                        const isSelected = selectedDate === iso;
                        const anyHigh = daySessions.some(s => (s.placesReservees ?? 0) >= s.capaciteMax * 0.6);

                        return (
                            <button
                                key={idx}
                                type="button"
                                disabled={!hasSession || isPast}
                                aria-pressed={isSelected}
                                aria-label={`${day.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} : ${isPast ? 'date passée' : hasSession ? `séance prévue${anyHigh ? ', très demandé' : ', disponible'}` : 'aucune séance'}${isToday ? ', aujourd’hui' : ''}`}
                                onClick={() => setSelectedDate(iso)}
                                className={`min-h-[62px] m-0.5 rounded-lg flex flex-col gap-1 items-center justify-center relative transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-abysse
                                    ${hasSession && !isPast ? anyHigh ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200' : isPast ? 'text-slate-300' : 'text-slate-400'}
                                    ${isSelected ? 'ring-2 ring-inset ring-abysse' : ''}
                                `}
                            >
                                <span className={`text-sm font-extrabold leading-none ${isToday ? 'underline decoration-orange-500 decoration-2 underline-offset-4' : ''}`}>
                                    {day.getDate()}
                                </span>
                                {hasSession && !isPast && (
                                    <span className="text-[9px] font-bold leading-none">{anyHigh ? 'Demandé' : 'Séance'}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 border-t border-slate-100 bg-slate-50/30">
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-600"><span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-300 inline-block" aria-hidden="true" />Disponible</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-600"><span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300 inline-block" aria-hidden="true" />Très demandé</span>
                </div>

                {selectedDate && selectedSessions.length > 0 && (
                    <div className="border-t border-slate-100 p-4 bg-slate-50" aria-live="polite" aria-atomic="true">
                        <p className="text-[10px] font-black uppercase text-orange-600 tracking-wider mb-3">
                            Horaires du {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <div className="space-y-2">
                            {selectedSessions.map(s => {
                                const avail = getAvailability(s);
                                return (
                                    <div key={s._id} className="flex flex-wrap gap-2 items-center justify-between bg-white rounded-xl p-3 border border-slate-200">
                                        <span className="block font-black text-abysse text-sm">
                                            🕐 {s.heureDebut} — {s.heureFin}
                                        </span>
                                        <span className={`text-[11px] font-black px-3 py-1.5 rounded-xl border ${avail.badgeColor}`}>
                                            {avail.label === 'Très demandé' ? `🟡 ${avail.label}` : `🟢 ${avail.label}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <PhoneCallCta phoneNumber={phoneNumber} size="sm" label="Appeler pour réserver" />
                    </div>
                )}
            </div>
        </div>
    );
}

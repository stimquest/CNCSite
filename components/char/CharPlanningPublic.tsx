"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Phone, Monitor } from 'lucide-react';

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


export default function CharPlanningPublic({ sessions, phoneNumber = '02 XX XX XX XX' }: Props) {
    const now = new Date();
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const sessionsByDate = useMemo(() => {
        const map: Record<string, CharSessionPublic[]> = {};
        for (const s of sessions) {
            if (!map[s.date]) map[s.date] = [];
            map[s.date].push(s);
        }
        return map;
    }, [sessions]);

    const selectedSessions = selectedDate ? (sessionsByDate[selectedDate] ?? []) : [];
    const todayIso = toIso(now);
    const calendarDays = getCalendarDays(currentYear, currentMonth);

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11); }
        else setCurrentMonth(m => m - 1);
        setSelectedDate(null);
    };
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0); }
        else setCurrentMonth(m => m + 1);
        setSelectedDate(null);
    };

    const getAvailability = (session: CharSessionPublic) => {
        const remaining = session.capaciteMax - (session.placesReservees ?? 0);
        if ((session.placesReservees ?? 0) >= session.capaciteMax * 0.6) return { label: 'Très demandé', color: 'bg-amber-400', textColor: 'text-amber-600', badgeColor: 'bg-amber-100 text-amber-700 border-amber-200', remaining };
        return { label: 'Disponible', color: 'bg-emerald-500', textColor: 'text-emerald-600', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200', remaining };
    };

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black uppercase italic text-abysse tracking-tighter">
                    Planning Char à Voile
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Consultez les créneaux disponibles et appelez-nous pour réserver.
                </p>
            </div>

            {/* CTA téléphone — adaptatif mobile/desktop */}
            <PhoneCallCta phoneNumber={phoneNumber} size="lg" />

            {/* CALENDAR VIEW */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <button onClick={prevMonth} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-abysse">
                        <ChevronLeft size={18} />
                    </button>
                    <h3 className="font-black text-sm uppercase tracking-widest text-abysse">
                        {MONTHS_FR[currentMonth]} {currentYear}
                    </h3>
                    <button onClick={nextMonth} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-abysse">
                        <ChevronRight size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/30">
                    {DAYS_SHORT.map(d => (
                        <div key={d} className="py-2 text-center text-[10px] font-black uppercase text-slate-400 tracking-wider">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7">
                    {calendarDays.map((day, idx) => {
                        if (!day) return <div key={idx} className="h-14 border-b border-r border-slate-50 last:border-r-0 bg-slate-50/20" />;

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
                                onClick={() => hasSession && !isPast ? setSelectedDate(isSelected ? null : iso) : undefined}
                                className={`h-14 flex flex-col items-center justify-center relative border-b border-r border-slate-50 last:border-r-0 transition-all
                                    ${isPast ? 'opacity-30 cursor-default' : ''}
                                    ${hasSession && !isPast ? 'cursor-pointer hover:bg-orange-50/50' : 'cursor-default'}
                                    ${isSelected ? 'bg-orange-50 ring-2 ring-inset ring-orange-300' : ''}
                                `}
                            >
                                <span className={`text-sm font-bold leading-none mb-1
                                    ${isToday ? 'text-orange-500' : isPast ? 'text-slate-300' : 'text-slate-700'}
                                    ${isSelected ? 'text-orange-600 font-black' : ''}
                                `}>
                                    {day.getDate()}
                                </span>
                                {hasSession && !isPast && (
                                    <span className={`w-5 h-1.5 rounded-full ${anyHigh ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4 px-6 py-3 border-t border-slate-100 bg-slate-50/30">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Légende :</span>
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500"><span className="w-3 h-1 rounded-full bg-emerald-500 inline-block"></span>Disponible</span>
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500"><span className="w-3 h-1 rounded-full bg-amber-400 inline-block"></span>Très demandé</span>
                </div>

                {selectedDate && selectedSessions.length > 0 && (
                    <div className="border-t border-slate-100 p-5 md:p-6 bg-orange-50/30 animate-in fade-in slide-in-from-top-1">
                        <p className="text-[10px] font-black uppercase text-orange-600 tracking-wider mb-3">
                            {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <div className="space-y-2">
                            {selectedSessions.map(s => {
                                const avail = getAvailability(s);
                                return (
                                    <div key={s._id} className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
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

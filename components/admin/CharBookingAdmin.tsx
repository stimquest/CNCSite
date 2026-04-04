"use client";

import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Save, Phone, Users, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, RefreshCw, Eye, EyeOff, Pencil, X, BarChart2, AlertTriangle } from 'lucide-react';
import { CharSessionDoc, CharBookingDoc, CharBookingStatut } from '@/types';

// --- UTILS ---
const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});
const formatDateShort = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short'
});
const today = () => new Date().toISOString().split('T')[0];

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const toIso = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};
const getCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7;
    const days: (Date | null)[] = Array(startDow).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    while (days.length % 7 !== 0) days.push(null);
    return days;
};
const getWeekStart = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
};
const addWeeks = (weekStart: string, n: number) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + n * 7);
    return d.toISOString().split('T')[0];
};

const STATUT_CONFIG: Record<CharBookingStatut, { label: string; icon: React.ReactNode; color: string }> = {
    confirme: { label: 'Confirmé', icon: <CheckCircle size={12} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    liste_attente: { label: 'Liste attente', icon: <Clock size={12} />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    annule: { label: 'Annulé', icon: <XCircle size={12} />, color: 'text-red-500 bg-red-50 border-red-200' },
};

const getCapacityProps = (reserved: number, max: number) => {
    const rate = max > 0 ? (reserved / max) * 100 : 0;
    if (rate < 50) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', activeBg: 'bg-emerald-500' };
    if (rate < 80) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', activeBg: 'bg-amber-500' };
    if (rate < 100) return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', activeBg: 'bg-orange-500' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', activeBg: 'bg-red-500' };
};

interface Props {
    sessions: CharSessionDoc[];
    onRefresh: () => void;
}

interface NewSessionForm {
    date: string;
    heureDebut: string;
    heureFin: string;
    capaciteMax: number;
    notes: string;
    actif: boolean;
}

interface NewBookingForm {
    clientNom: string;
    clientTel: string;
    nbPlaces: number;
    statut: CharBookingStatut;
    notes: string;
}

const emptySessionForm = (): NewSessionForm => ({
    date: today(),
    heureDebut: '',
    heureFin: '',
    capaciteMax: 8,
    notes: '',
    actif: true,
});

const emptyBookingForm = (): NewBookingForm => ({
    clientNom: '',
    clientTel: '',
    nbPlaces: 1,
    statut: 'confirme',
    notes: '',
});

export default function CharBookingAdmin({ sessions, onRefresh }: Props) {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [sessionBookings, setSessionBookings] = useState<CharBookingDoc[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    const [currentWeek, setCurrentWeek] = useState(() => getWeekStart(today()));
    const [calYear, setCalYear] = useState(() => new Date().getFullYear());
    const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
    const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
    const [editBookingForm, setEditBookingForm] = useState<Partial<NewBookingForm>>({});
    const [showNewSession, setShowNewSession] = useState(false);
    const [showNewBooking, setShowNewBooking] = useState(false);
    const [showDashboardModal, setShowDashboardModal] = useState(false);
    const [dashYear, setDashYear] = useState(() => new Date().getFullYear());
    const [dashMonth, setDashMonth] = useState(() => new Date().getMonth());
    const [sessionForm, setSessionForm] = useState<NewSessionForm>(emptySessionForm());
    const [bookingForm, setBookingForm] = useState<NewBookingForm>(emptyBookingForm());
    const [isSaving, setIsSaving] = useState(false);

    const selectedSession = sessions.find(s => s._id === selectedSessionId);
    const placesReservees = selectedSession?.placesRestantes !== undefined
        ? (selectedSession.capaciteMax - selectedSession.placesRestantes)
        : (selectedSession as any)?.placesReservees ?? 0;
    const placesRestantes = selectedSession ? selectedSession.capaciteMax - placesReservees : 0;

    const loadBookings = useCallback(async (sessionId: string) => {
        setLoadingBookings(true);
        try {
            const res = await fetch(`/api/char/bookings?sessionId=${sessionId}`);
            if (res.ok) {
                const data = await res.json();
                setSessionBookings(data.bookings ?? []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingBookings(false);
        }
    }, []);

    const handleSelectSession = (id: string) => {
        setSelectedSessionId(id);
        setShowNewBooking(false);
        setBookingForm(emptyBookingForm());
        loadBookings(id);
    };

    const api = async (type: string, body: Record<string, unknown>) => {
        const res = await fetch('/api/cockpit/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, ...body }),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Erreur serveur');
        }
        return res.json();
    };

    const handleCreateSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionForm.date || !sessionForm.heureDebut || !sessionForm.heureFin) {
            return alert('Remplissez la date et les horaires.');
        }
        setIsSaving(true);
        try {
            await api('CREATE_CHAR_SESSION', { patch: sessionForm });
            setShowNewSession(false);
            setSessionForm(emptySessionForm());
            onRefresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleActif = async (session: CharSessionDoc) => {
        setIsSaving(true);
        try {
            await api('UPDATE_CHAR_SESSION', { _id: session._id, patch: { actif: !session.actif } });
            onRefresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSession = async (session: CharSessionDoc) => {
        if (!confirm(`Supprimer la session du ${formatDateShort(session.date)} ? Toutes les réservations seront supprimées.`)) return;
        setIsSaving(true);
        try {
            await api('DELETE_CHAR_SESSION', { _id: session._id });
            if (selectedSessionId === session._id) setSelectedSessionId(null);
            onRefresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSessionId || !bookingForm.clientNom || !bookingForm.clientTel) {
            return alert('Nom et téléphone obligatoires.');
        }
        if (bookingForm.statut === 'confirme' && bookingForm.nbPlaces > placesRestantes) {
            return alert(`Seulement ${placesRestantes} place(s) restante(s).`);
        }
        setIsSaving(true);
        try {
            await api('CREATE_CHAR_BOOKING', {
                patch: { sessionId: selectedSessionId, ...bookingForm }
            });
            setShowNewBooking(false);
            setBookingForm(emptyBookingForm());
            await loadBookings(selectedSessionId);
            onRefresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateBookingStatut = async (bookingId: string, statut: CharBookingStatut) => {
        setIsSaving(true);
        try {
            await api('UPDATE_CHAR_BOOKING', { _id: bookingId, patch: { statut } });
            if (selectedSessionId) await loadBookings(selectedSessionId);
            onRefresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditBooking = (b: CharBookingDoc) => {
        setEditingBookingId(b._id);
        setEditBookingForm({ clientNom: b.clientNom, clientTel: b.clientTel, nbPlaces: b.nbPlaces, statut: b.statut, notes: b.notes ?? '' });
    };

    const handleSaveEditBooking = async (bookingId: string) => {
        setIsSaving(true);
        try {
            await api('UPDATE_CHAR_BOOKING', { _id: bookingId, patch: editBookingForm });
            setEditingBookingId(null);
            if (selectedSessionId) await loadBookings(selectedSessionId);
            onRefresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteBooking = async (bookingId: string) => {
        if (!confirm('Supprimer cette réservation ?')) return;
        setIsSaving(true);
        try {
            await api('DELETE_CHAR_BOOKING', { _id: bookingId });
            if (selectedSessionId) await loadBookings(selectedSessionId);
            onRefresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const computeStats = (list: CharSessionDoc[]) => {
        let totalCap = 0;
        let totalRes = 0;
        list.forEach(s => {
            totalCap += s.capaciteMax;
            totalRes += ((s as any).placesReservees ?? 0);
        });
        const fillRate = totalCap > 0 ? Math.round((totalRes / totalCap) * 100) : 0;
        return { count: list.length, totalCap, totalRes, fillRate };
    };

    const nowIso = today();
    const upcomingSessions = sessions.filter(s => s.date >= nowIso);
    const upStats = computeStats(upcomingSessions);
    const allStats = computeStats(sessions);

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* SIDEBAR — Sessions */}
            <div className="lg:w-80 shrink-0 space-y-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowNewSession(v => !v)}
                        className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest hover:bg-abysse transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                    >
                        <Plus size={16} /> Session
                    </button>
                    <button
                        onClick={() => setShowDashboardModal(true)}
                        className="p-3 bg-white text-abysse border border-slate-200 rounded-xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
                        title="Vue d'ensemble"
                    >
                        <BarChart2 size={16} />
                    </button>
                </div>

                {/* Formulaire nouvelle session */}
                {showNewSession && (
                    <form onSubmit={handleCreateSession} className="bg-orange-50 border border-orange-100 rounded-2xl p-5 space-y-3 animate-in fade-in slide-in-from-top-2">
                        <p className="text-[10px] font-black uppercase text-orange-700 tracking-wider">Nouvelle session</p>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500">Date 🌊</label>
                            <input type="date" required value={sessionForm.date} onChange={e => setSessionForm(f => ({ ...f, date: e.target.value }))}
                                className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm font-bold text-abysse outline-none focus:ring-2 ring-orange-100" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-500">Début</label>
                                <input type="text" required placeholder="10h30" value={sessionForm.heureDebut} onChange={e => setSessionForm(f => ({ ...f, heureDebut: e.target.value }))}
                                    className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm font-bold text-center outline-none focus:ring-2 ring-orange-100" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-500">Fin</label>
                                <input type="text" required placeholder="12h30" value={sessionForm.heureFin} onChange={e => setSessionForm(f => ({ ...f, heureFin: e.target.value }))}
                                    className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm font-bold text-center outline-none focus:ring-2 ring-orange-100" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-slate-500">Capacité max</label>
                            <input type="number" required min={1} max={50} value={sessionForm.capaciteMax} onChange={e => setSessionForm(f => ({ ...f, capaciteMax: parseInt(e.target.value) }))}
                                className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm font-bold text-center outline-none focus:ring-2 ring-orange-100" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-slate-500">Notes (marée, conditions...)</label>
                            <textarea rows={2} value={sessionForm.notes} onChange={e => setSessionForm(f => ({ ...f, notes: e.target.value }))}
                                className="w-full p-2 bg-white border border-orange-200 rounded-lg text-xs outline-none focus:ring-2 ring-orange-100 resize-none" />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={sessionForm.actif} onChange={e => setSessionForm(f => ({ ...f, actif: e.target.checked }))} className="size-4 accent-orange-500" />
                                <span className="text-[10px] font-bold uppercase text-slate-500">Visible publiquement</span>
                            </label>
                            <button type="submit" disabled={isSaving}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-abysse transition-all flex items-center gap-1.5">
                                {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />} Créer
                            </button>
                        </div>
                    </form>
                )}

                {/* Mini calendrier — sélecteur de semaine */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {/* Header mois */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/50">
                        <button onClick={() => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1); }} className="p-1 rounded-lg hover:bg-white text-slate-400 hover:text-abysse transition-all">
                            <ChevronLeft size={14} />
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-widest text-abysse">{MONTHS_FR[calMonth]} {calYear}</span>
                        <button onClick={() => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1); }} className="p-1 rounded-lg hover:bg-white text-slate-400 hover:text-abysse transition-all">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                    {/* Jours */}
                    <div className="grid grid-cols-7 border-b border-slate-50">
                        {DAYS_SHORT.map((d, i) => <div key={i} className="py-1 text-center text-[9px] font-black uppercase text-slate-300">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7">
                        {(() => {
                            const calDays = getCalendarDays(calYear, calMonth);
                            const sessionDates = new Set(sessions.map(s => s.date));
                            const todayIso = today();
                            const rows: React.ReactNode[] = [];
                            for (let i = 0; i < calDays.length; i += 7) {
                                const week = calDays.slice(i, i + 7);
                                const firstReal = week.find(d => d !== null) as Date;
                                const weekStart = firstReal ? getWeekStart(toIso(firstReal)) : null;
                                const isSelectedWeek = weekStart === currentWeek;
                                const hasSessionsInWeek = week.some(d => d && sessionDates.has(toIso(d)));
                                rows.push(
                                    <div key={i} className={`contents`}>
                                        {week.map((day, j) => {
                                            if (!day) return <div key={j} className={`h-8 ${isSelectedWeek ? 'bg-orange-50' : ''}`} />;
                                            const iso = toIso(day);
                                            const hasSession = sessionDates.has(iso);
                                            const isToday = iso === todayIso;
                                            return (
                                                <button
                                                    key={j}
                                                    onClick={() => weekStart && setCurrentWeek(weekStart)}
                                                    className={`h-8 flex flex-col items-center justify-center transition-all
                                                        ${isSelectedWeek ? 'bg-orange-50' : hasSessionsInWeek ? 'hover:bg-slate-50' : 'hover:bg-slate-50'}
                                                        ${j === 0 && isSelectedWeek ? 'rounded-l-lg' : ''}
                                                        ${j === 6 && isSelectedWeek ? 'rounded-r-lg' : ''}
                                                    `}
                                                >
                                                    <span className={`text-[11px] font-bold leading-none
                                                        ${isToday ? 'text-orange-500 font-black' : isSelectedWeek ? 'text-abysse font-black' : 'text-slate-500'}
                                                    `}>{day.getDate()}</span>
                                                    {hasSession && <span className={`w-1 h-1 rounded-full mt-0.5 ${isSelectedWeek ? 'bg-orange-400' : 'bg-emerald-400'}`} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            }
                            return rows;
                        })()}
                    </div>
                </div>

                {/* Liste des sessions de la semaine */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-y-auto shadow-sm max-h-[calc(100vh-280px)]">
                    {(() => {
                        const weekEnd = addWeeks(currentWeek, 1);
                        const weekSessions = sessions.filter(s => s.date >= currentWeek && s.date < weekEnd);
                        if (weekSessions.length === 0) return (
                            <p className="text-center text-[11px] text-slate-400 italic py-8">Aucune session cette semaine</p>
                        );
                        return weekSessions.map(s => {
                            const reserved = (s as any).placesReservees ?? 0;
                            const remaining = s.capaciteMax - reserved;
                            const isFull = remaining <= 0;
                            const isSelected = selectedSessionId === s._id;
                            return (
                                <button
                                    key={s._id}
                                    onClick={() => handleSelectSession(s._id)}
                                    className={`w-full p-4 text-left border-b border-slate-50 last:border-0 transition-all hover:bg-slate-50 group ${isSelected ? 'bg-orange-50/60 border-l-4 border-l-orange-500 pl-3' : ''}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <span className="block font-black text-abysse text-sm uppercase tracking-tighter truncate">
                                                {formatDateShort(s.date)}
                                            </span>
                                            <span className="block text-[11px] text-slate-500 font-bold mt-0.5">
                                                {s.heureDebut} – {s.heureFin}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className={`flex flex-col gap-1 w-20 px-2 py-1 rounded-lg border ${getCapacityProps(reserved, s.capaciteMax).bg} ${getCapacityProps(reserved, s.capaciteMax).border} ${getCapacityProps(reserved, s.capaciteMax).text}`}>
                                                <div className="flex justify-between w-full text-[9px] font-black leading-none">
                                                    <span>{remaining} libr.</span>
                                                    <span>/{s.capaciteMax}</span>
                                                </div>
                                                <div className="h-1 w-full bg-white/50 rounded-full overflow-hidden">
                                                    <div className={`h-full opacity-80 ${getCapacityProps(reserved, s.capaciteMax).activeBg}`} style={{ width: `${s.capaciteMax > 0 ? (reserved / s.capaciteMax) * 100 : 0}%` }} />
                                                </div>
                                            </div>
                                            <span className={`text-[9px] font-bold ${s.actif === false ? 'text-slate-400' : 'text-emerald-500'}`}>
                                                {s.actif === false ? '🔒 masqué' : '🟢 visible'}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        });
                    })()}
                </div>
            </div>

            {/* MAIN — Détail session + bookings */}
            <div className="flex-1 min-w-0 lg:sticky lg:top-6 lg:self-start">
                {!selectedSession ? (
                    <div className="h-full min-h-64 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-4xl bg-white/50">
                        <Users size={36} className="mb-3 opacity-30" />
                        <p className="font-bold uppercase tracking-widest text-[10px]">Sélectionnez une session</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Header session */}
                        <div className="p-6 md:p-8 border-b border-slate-100 bg-linear-to-r from-orange-50/50 to-white">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-black uppercase italic text-abysse tracking-tighter">
                                        {formatDate(selectedSession.date)}
                                    </h3>
                                    <p className="text-sm font-bold text-slate-500 mt-1">
                                        🕐 {selectedSession.heureDebut} — {selectedSession.heureFin}
                                    </p>
                                    {selectedSession.notes && (
                                        <p className="text-xs text-slate-400 italic mt-1">{selectedSession.notes}</p>
                                    )}
                                </div>
                                <div className="flex items-start gap-3">
                                    {/* Capacité */}
                                    <div className="text-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-w-[120px]">
                                        <span className={`block text-3xl font-black ${getCapacityProps(placesReservees, selectedSession.capaciteMax).text.replace('text-', 'text-').replace('700', '500')}`}>
                                            {placesRestantes}
                                        </span>
                                        <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">places libres sur {selectedSession.capaciteMax}</span>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
                                            <div className={`h-full opacity-80 ${getCapacityProps(placesReservees, selectedSession.capaciteMax).activeBg}`} style={{ width: `${selectedSession.capaciteMax > 0 ? (placesReservees / selectedSession.capaciteMax) * 100 : 0}%` }} />
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleToggleActif(selectedSession)}
                                            className={`p-2.5 rounded-xl border transition-all text-[10px] font-black uppercase flex items-center gap-1.5 ${selectedSession.actif === false ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-slate-100 hover:text-slate-500'}`}
                                        >
                                            {selectedSession.actif === false ? <Eye size={13} /> : <EyeOff size={13} />}
                                            {selectedSession.actif === false ? 'Activer' : 'Masquer'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSession(selectedSession)}
                                            className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Alertes d'état (Complet vs Masqué) */}
                            {selectedSession.actif !== false && placesRestantes <= 0 && (
                                <div className="bg-amber-50 border-t border-amber-200 p-4 px-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-100/50 text-amber-600 rounded-lg shrink-0">
                                            <AlertTriangle size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-widest text-amber-800 leading-tight">Session Complète</p>
                                            <p className="text-xs text-amber-700/80 font-bold mt-0.5">Cette session est à 100% mais toujours visible en ligne.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleToggleActif(selectedSession)} disabled={isSaving} className="px-4 py-2 bg-amber-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-amber-600 transition-all shrink-0 text-center flex items-center justify-center gap-2">
                                        <EyeOff size={14} /> Masquer
                                    </button>
                                </div>
                            )}

                            {selectedSession.actif === false && placesRestantes > 0 && (
                                <div className="bg-emerald-50 border-t border-emerald-200 p-4 px-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100/50 text-emerald-600 rounded-lg shrink-0">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-800 leading-tight">Places Libérées</p>
                                            <p className="text-xs text-emerald-700/80 font-bold mt-0.5">Cette session n'est plus complète, vous pouvez la réactiver.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleToggleActif(selectedSession)} disabled={isSaving} className="px-4 py-2 bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-emerald-600 transition-all shrink-0 text-center flex items-center justify-center gap-2">
                                        <Eye size={14} /> Laisser visible
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Bookings */}
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-black text-sm uppercase text-abysse tracking-tighter">
                                    Réservations
                                    {sessionBookings.length > 0 && (
                                        <span className="ml-2 text-slate-400 font-normal">({sessionBookings.length})</span>
                                    )}
                                </h4>
                                <button
                                    onClick={() => setShowNewBooking(v => !v)}
                                    className="px-4 py-2 bg-abysse text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-turquoise transition-all flex items-center gap-1.5"
                                >
                                    {showNewBooking ? <ChevronUp size={12} /> : <Plus size={12} />}
                                    Saisir réservation
                                </button>
                            </div>

                            {/* Formulaire nouvelle réservation */}
                            {showNewBooking && (
                                <form onSubmit={handleCreateBooking} className="bg-abysse/5 border border-abysse/10 rounded-2xl p-5 mb-5 space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-[10px] font-black uppercase text-abysse tracking-wider">Nouvelle réservation — appel téléphonique</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-500">Nom du client *</label>
                                            <input type="text" required placeholder="Dupont Jean" value={bookingForm.clientNom} onChange={e => setBookingForm(f => ({ ...f, clientNom: e.target.value }))}
                                                className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-abysse outline-none focus:ring-2 ring-abysse/10 focus:border-abysse/30" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-500">Téléphone *</label>
                                            <input type="tel" required placeholder="06 XX XX XX XX" value={bookingForm.clientTel} onChange={e => setBookingForm(f => ({ ...f, clientTel: e.target.value }))}
                                                className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-abysse outline-none focus:ring-2 ring-abysse/10 focus:border-abysse/30" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-500">Nb de places</label>
                                            <input type="number" required min={1} max={placesRestantes > 0 ? placesRestantes : 50} value={bookingForm.nbPlaces} onChange={e => setBookingForm(f => ({ ...f, nbPlaces: parseInt(e.target.value) }))}
                                                className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-center text-abysse outline-none focus:ring-2 ring-abysse/10" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-500">Statut</label>
                                            <select value={bookingForm.statut} onChange={e => setBookingForm(f => ({ ...f, statut: e.target.value as CharBookingStatut }))}
                                                className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-abysse outline-none focus:ring-2 ring-abysse/10">
                                                <option value="confirme">✅ Confirmé</option>
                                                <option value="liste_attente">⏳ Liste attente</option>
                                                <option value="annule">❌ Annulé</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-500">Notes (optionnel)</label>
                                        <input type="text" placeholder="Observations..." value={bookingForm.notes} onChange={e => setBookingForm(f => ({ ...f, notes: e.target.value }))}
                                            className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm text-abysse outline-none focus:ring-2 ring-abysse/10" />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-1">
                                        <button type="button" onClick={() => setShowNewBooking(false)}
                                            className="px-4 py-2 text-slate-400 font-bold text-xs uppercase rounded-xl hover:bg-slate-50 transition-all">
                                            Annuler
                                        </button>
                                        <button type="submit" disabled={isSaving}
                                            className="px-5 py-2 bg-abysse text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-turquoise transition-all flex items-center gap-1.5">
                                            {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />} Enregistrer
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Liste des réservations */}
                            {loadingBookings ? (
                                <div className="py-8 flex justify-center">
                                    <RefreshCw size={20} className="animate-spin text-slate-300" />
                                </div>
                            ) : sessionBookings.length === 0 ? (
                                <div className="py-10 text-center text-slate-300">
                                    <Phone size={28} className="mx-auto mb-2 opacity-40" />
                                    <p className="text-[11px] font-bold uppercase tracking-wider">Aucune réservation pour cette session</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {sessionBookings.map(b => {
                                        const statut = STATUT_CONFIG[b.statut] ?? STATUT_CONFIG.confirme;
                                        const isEditing = editingBookingId === b._id;
                                        return (
                                            <div key={b._id} className={`rounded-2xl border transition-all ${isEditing ? 'border-abysse/30 bg-abysse/5' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
                                                {/* Ligne de résumé */}
                                                <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 group">
                                                    <div className="flex-1 w-full min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-black text-abysse text-sm">{b.clientNom}</span>
                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${statut.color}`}>
                                                                {statut.icon} {statut.label}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-full">
                                                                {b.nbPlaces} place{b.nbPlaces > 1 ? 's' : ''}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                            <a href={`tel:${b.clientTel}`} className="text-[11px] text-turquoise font-black flex items-center gap-1 hover:underline bg-turquoise/10 px-2 py-0.5 rounded-lg active:scale-95 transition-transform">
                                                                <Phone size={10} /> {b.clientTel}
                                                            </a>
                                                            {b.notes && <span className="text-[10px] text-slate-400 italic truncate max-w-full">{b.notes}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 w-full md:w-auto mt-2 pt-3 border-t border-slate-100 md:border-t-0 md:mt-0 md:pt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => isEditing ? setEditingBookingId(null) : handleEditBooking(b)}
                                                            className={`p-2.5 rounded-xl border transition-all shadow-sm ${isEditing ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-slate-200 text-slate-400 hover:text-abysse hover:border-abysse/30'}`}>
                                                            {isEditing ? <X size={14} /> : <Pencil size={14} />}
                                                        </button>
                                                        {!isEditing && (
                                                            <select
                                                                value={b.statut}
                                                                onChange={e => handleUpdateBookingStatut(b._id, e.target.value as CharBookingStatut)}
                                                                className="flex-1 md:flex-none text-[10px] font-black uppercase py-2.5 px-3 bg-white border border-slate-200 rounded-xl outline-none hover:border-abysse/30 cursor-pointer text-abysse appearance-none"
                                                            >
                                                                <option value="confirme">✅ Confirmé</option>
                                                                <option value="liste_attente">⏳ Attente</option>
                                                                <option value="annule">❌ Annulé</option>
                                                            </select>
                                                        )}
                                                        <button onClick={() => handleDeleteBooking(b._id)}
                                                            className="p-2.5 rounded-xl text-red-400 hover:text-white hover:bg-red-500 bg-white border border-slate-200 hover:border-red-500 transition-all shadow-sm">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* Formulaire d'édition inline */}
                                                {isEditing && (
                                                    <div className="px-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-1">
                                                        <div className="h-px bg-abysse/10" />
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-[9px] font-black uppercase text-slate-400">Nom</label>
                                                                <input type="text" value={editBookingForm.clientNom ?? ''} onChange={e => setEditBookingForm(f => ({ ...f, clientNom: e.target.value }))}
                                                                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-abysse outline-none focus:ring-2 ring-abysse/10 focus:border-abysse/30" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[9px] font-black uppercase text-slate-400">Téléphone</label>
                                                                <input type="tel" value={editBookingForm.clientTel ?? ''} onChange={e => setEditBookingForm(f => ({ ...f, clientTel: e.target.value }))}
                                                                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-abysse outline-none focus:ring-2 ring-abysse/10 focus:border-abysse/30" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[9px] font-black uppercase text-slate-400">Nb places</label>
                                                                <input type="number" min={1} max={50} value={editBookingForm.nbPlaces ?? 1} onChange={e => setEditBookingForm(f => ({ ...f, nbPlaces: parseInt(e.target.value) }))}
                                                                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-center text-abysse outline-none focus:ring-2 ring-abysse/10" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[9px] font-black uppercase text-slate-400">Statut</label>
                                                                <select value={editBookingForm.statut ?? 'confirme'} onChange={e => setEditBookingForm(f => ({ ...f, statut: e.target.value as CharBookingStatut }))}
                                                                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-abysse outline-none focus:ring-2 ring-abysse/10">
                                                                    <option value="confirme">✅ Confirmé</option>
                                                                    <option value="liste_attente">⏳ Liste attente</option>
                                                                    <option value="annule">❌ Annulé</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-black uppercase text-slate-400">Notes</label>
                                                            <input type="text" placeholder="Observations..." value={editBookingForm.notes ?? ''} onChange={e => setEditBookingForm(f => ({ ...f, notes: e.target.value }))}
                                                                className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-sm text-abysse outline-none focus:ring-2 ring-abysse/10" />
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <button type="button" onClick={() => setEditingBookingId(null)}
                                                                className="px-4 py-2 text-slate-400 font-bold text-xs uppercase rounded-xl hover:bg-white transition-all">
                                                                Annuler
                                                            </button>
                                                            <button type="button" onClick={() => handleSaveEditBooking(b._id)} disabled={isSaving}
                                                                className="px-5 py-2 bg-abysse text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-turquoise transition-all flex items-center gap-1.5">
                                                                {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />} Sauvegarder
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* Modal Dashboard */}
            {showDashboardModal && (
                <div className="fixed inset-0 bg-abysse/80 backdrop-blur-sm z-100 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100 bg-slate-50">
                            <h2 className="text-2xl font-black uppercase italic text-abysse tracking-tighter flex items-center gap-3">
                                <BarChart2 className="text-orange-500" size={28} />
                                Vue d'ensemble (Char à voile)
                            </h2>
                            <button onClick={() => setShowDashboardModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400 hover:text-abysse">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh] space-y-8">
                            
                            {/* Chiffres Globaux */}
                            <div>
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">À Venir (à partir d'aujourd'hui)</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-black text-orange-500">{upStats.count}</span>
                                        <span className="text-[9px] font-bold uppercase text-orange-800/60 mt-1">Sessions</span>
                                    </div>
                                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-black text-emerald-600">{upStats.totalRes}</span>
                                        <span className="text-[9px] font-bold uppercase text-emerald-800/60 mt-1">Inscrits</span>
                                    </div>
                                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-black text-blue-600">{upStats.totalCap}</span>
                                        <span className="text-[9px] font-bold uppercase text-blue-800/60 mt-1">Capacité max</span>
                                    </div>
                                    <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center ${upStats.fillRate >= 80 ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-abysse'}`}>
                                        <span className="text-3xl font-black">{upStats.fillRate}%</span>
                                        <span className="text-[9px] font-bold uppercase mt-1 opacity-70">Remplissage</span>
                                    </div>
                                </div>
                            </div>

                            {/* Historique et Calendrier */}
                            <div className="flex flex-col xl:flex-row gap-6">
                                <div className="xl:flex-1 shrink-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Calendrier des sessions</h3>
                                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1 rounded-xl text-abysse">
                                            <button onClick={() => { if (dashMonth === 0) { setDashYear(y => y - 1); setDashMonth(11); } else setDashMonth(m => m - 1); }} className="p-1 hover:bg-white rounded-lg transition-colors"><ChevronLeft size={16} /></button>
                                            <span className="text-[10px] font-black uppercase min-w-[100px] text-center">{MONTHS_FR[dashMonth]} {dashYear}</span>
                                            <button onClick={() => { if (dashMonth === 11) { setDashYear(y => y + 1); setDashMonth(0); } else setDashMonth(m => m + 1); }} className="p-1 hover:bg-white rounded-lg transition-colors"><ChevronRight size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                                        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                                            {DAYS_SHORT.map((d, i) => <div key={i} className="py-2 text-center text-[10px] font-black uppercase text-slate-400 border-r last:border-0 border-slate-100">{d}</div>)}
                                        </div>
                                        <div className="grid grid-cols-7 auto-rows-[minmax(90px,auto)] text-center md:text-left">
                                            {(() => {
                                                const days = getCalendarDays(dashYear, dashMonth);
                                                return days.map((day, i) => {
                                                    if (!day) return <div key={i} className="border-b border-r border-slate-50 bg-slate-50/30" />;
                                                    const iso = toIso(day);
                                                    const daySessions = sessions.filter(s => s.date === iso);
                                                    const isToday = iso === nowIso;
                                                    return (
                                                        <div key={i} className={`p-1.5 md:p-2 border-b border-r last:border-r-0 border-slate-100 flex flex-col gap-1 transition-colors hover:bg-slate-50/50 ${isToday ? 'bg-orange-50/50' : ''}`}>
                                                            <span className={`text-[10px] font-black ${isToday ? 'text-orange-600' : 'text-slate-400'}`}>{day.getDate()}</span>
                                                            <div className="flex flex-col gap-1">
                                                                {daySessions.map(s => {
                                                                    const reserved = (s as any).placesReservees ?? 0;
                                                                    const rem = s.capaciteMax - reserved;
                                                                    const capProps = getCapacityProps(reserved, s.capaciteMax);
                                                                    
                                                                    return (
                                                                        <div key={s._id} className={`p-1.5 rounded-lg border text-[9px] cursor-default flex flex-col gap-1.5 transition-all hover:brightness-95 ${capProps.bg} ${capProps.border} ${capProps.text}`} title={`${s.heureDebut}-${s.heureFin} (${rem} libres sur ${s.capaciteMax})`}>
                                                                            <div className="font-bold flex flex-col xl:flex-row xl:justify-between gap-0.5 leading-none">
                                                                                <span>{s.heureDebut}</span>
                                                                                <span className="font-black tracking-tighter">{rem}/{s.capaciteMax}</span>
                                                                            </div>
                                                                            <div className="hidden md:block h-1 w-full bg-white/50 rounded-sm overflow-hidden">
                                                                                <div className={`h-full opacity-80 ${capProps.activeBg}`} style={{ width: `${s.capaciteMax > 0 ? (reserved / s.capaciteMax) * 100 : 0}%` }} />
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="xl:w-64 shrink-0">
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Historique Global</h3>
                                    <div className="flex flex-col gap-3">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                                            <span className="text-2xl font-black text-slate-700">{allStats.count}</span>
                                            <span className="text-[9px] font-bold uppercase text-slate-400 mt-1">Total Sessions</span>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                                            <span className="text-2xl font-black text-slate-700">{allStats.totalRes}</span>
                                            <span className="text-[9px] font-bold uppercase text-slate-400 mt-1">Total Inscrits</span>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                                            <span className="text-2xl font-black text-slate-700">{allStats.fillRate}%</span>
                                            <span className="text-[9px] font-bold uppercase text-slate-400 mt-1">Taux Rempliss. Moyen</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

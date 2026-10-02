"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Plus, Trash2, Save, Phone, Users, CheckCircle, Clock, ChevronUp, ChevronLeft, ChevronRight, RefreshCw, CalendarDays, Copy, Search, UserPlus, Pencil, X, BarChart2 } from 'lucide-react';
import { CharSessionDoc, CharBookingDoc, CharBookingStatut } from '@/types';
import styles from './CharBookingAdmin.module.css';
import { parisToday } from '@/lib/editorial';

// --- UTILS ---
const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});
const formatDateShort = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short'
});
const today = () => parisToday();

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const FOLLOW_UP_REASONS = [
    { value: 'nombre_a_confirmer', label: 'Nombre final à confirmer' },
    { value: 'organisation_a_verifier', label: 'Organisation ou matériel à vérifier' },
    { value: 'meteo_a_confirmer', label: 'Conditions météo à confirmer' },
    { value: 'demande_speciale', label: 'Demande particulière à valider' },
    { value: 'surbooking_a_regulariser', label: 'Surbooking à régulariser' },
] as const;
const followUpLabel = (reason?: string) => reason === 'place_a_liberer'
    ? 'Prévenir le référent si une place se libère'
    : FOLLOW_UP_REASONS.find(item => item.value === reason)?.label;

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
    const d = new Date(`${dateStr}T12:00:00`);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return toIso(d);
};
const addWeeks = (weekStart: string, n: number) => {
    const d = new Date(`${weekStart}T12:00:00`);
    d.setDate(d.getDate() + n * 7);
    return toIso(d);
};

const getCapacityProps = (reserved: number, max: number) => {
    const rate = max > 0 ? (reserved / max) * 100 : 0;
    if (rate < 50) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', activeBg: 'bg-emerald-500' };
    if (rate < 80) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', activeBg: 'bg-amber-500' };
    if (rate < 100) return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', activeBg: 'bg-orange-500' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', activeBg: 'bg-red-500' };
};

const reservedPlaces = (session: CharSessionDoc) => session.placesRestantes !== undefined ? session.capaciteMax - session.placesRestantes : (session as CharSessionDoc & { placesReservees?: number }).placesReservees ?? 0;

interface Props {
    sessions: CharSessionDoc[];
    onRefresh: () => void;
    initialMode?: 'plan' | 'reserve' | 'follow';
    initialSessionId?: string;
    initialBookingId?: string;
    initialDate?: string;
    initialCreate?: boolean;
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
    motifSuivi: string;
    notes: string;
    todo: string;
    todoDone: boolean;
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
    motifSuivi: '',
    notes: '',
    todo: '',
    todoDone: false,
});

export default function CharBookingAdmin({ sessions, onRefresh, initialMode = 'reserve', initialSessionId, initialBookingId, initialDate: requestedDate, initialCreate = false }: Props) {
    const initialDate = sessions.find(session => session._id === initialSessionId)?.date || requestedDate || today();
    const [mode, setMode] = useState<'plan' | 'reserve' | 'follow'>(initialMode);
    const [showUnavailable, setShowUnavailable] = useState(false);
    const [bookingQuery, setBookingQuery] = useState('');
    const [bookingFilter, setBookingFilter] = useState<'active' | 'confirme' | 'a_valider' | 'liste_attente' | 'annule'>('active');
    const [actionError, setActionError] = useState('');
    const [actionNotice, setActionNotice] = useState('');
    const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [sessionBookings, setSessionBookings] = useState<CharBookingDoc[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    const [currentWeek, setCurrentWeek] = useState(() => getWeekStart(initialDate));
    const [calYear, setCalYear] = useState(() => new Date(`${initialDate}T12:00:00`).getFullYear());
    const [calMonth, setCalMonth] = useState(() => new Date(`${initialDate}T12:00:00`).getMonth());
    const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
    const [editBookingForm, setEditBookingForm] = useState<Partial<NewBookingForm>>({});
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const bookingsRequest = useRef(0);
    const initialBookingOpened = useRef(false);
    const [bookingsError, setBookingsError] = useState('');
    const detailPanel = useRef<HTMLDivElement>(null);
    const [showNewSession, setShowNewSession] = useState(initialCreate);
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [isDuplicatingSession, setIsDuplicatingSession] = useState(false);
    const sessionEditor = useRef<HTMLFormElement>(null);
    const [showNewBooking, setShowNewBooking] = useState(false);
    const [showDashboardModal, setShowDashboardModal] = useState(false);
    const [dashYear, setDashYear] = useState(() => new Date().getFullYear());
    const [dashMonth, setDashMonth] = useState(() => new Date().getMonth());
    const [sessionForm, setSessionForm] = useState<NewSessionForm>(emptySessionForm());
    const [bookingForm, setBookingForm] = useState<NewBookingForm>(emptyBookingForm());
    const [isSaving, setIsSaving] = useState(false);

    const selectedSession = sessions.find(s => s._id === selectedSessionId);
    const placesReservees = selectedSession ? bookingCounts[selectedSession._id] ?? reservedPlaces(selectedSession) : 0;
    const placesRestantes = selectedSession ? selectedSession.capaciteMax - placesReservees : 0;

    const loadBookings = useCallback(async (sessionId: string) => {
        const request = ++bookingsRequest.current;
        setLoadingBookings(true);
        setBookingsError('');
        try {
            const res = await fetch(`/api/char/bookings?sessionId=${sessionId}`);
            if (res.ok) {
                const data = await res.json();
                if (request === bookingsRequest.current) {
                    const bookings: CharBookingDoc[] = data.bookings ?? [];
                    setSessionBookings(bookings);
                    setBookingCounts(current => ({ ...current, [sessionId]: bookings.filter(booking => booking.statut === 'confirme').reduce((sum, booking) => sum + booking.nbPlaces, 0) }));
                    const initialBooking = !initialBookingOpened.current && initialBookingId ? bookings.find(booking => booking._id === initialBookingId) : undefined;
                    if (initialBooking) {
                        initialBookingOpened.current = true;
                        setEditingBookingId(initialBooking._id);
                        setEditBookingForm({ clientNom: initialBooking.clientNom, clientTel: initialBooking.clientTel, nbPlaces: initialBooking.nbPlaces, statut: initialBooking.statut, motifSuivi: initialBooking.motifSuivi ?? '', notes: initialBooking.notes ?? '', todo: initialBooking.todo ?? '', todoDone: initialBooking.todoDone ?? false });
                    }
                }
            } else { throw new Error('Chargement impossible'); }
        } catch (e) {
            if (request === bookingsRequest.current) setBookingsError('Impossible de charger les réservations.');
        } finally {
            if (request === bookingsRequest.current) setLoadingBookings(false);
        }
    }, []);

    const handleSelectSession = (id: string) => {
        if (isSaving) return;
        setActionNotice('');
        const session = sessions.find(session => session._id === id);
        if (session) { setSelectedDate(session.date); setCalYear(new Date(`${session.date}T12:00:00`).getFullYear()); setCalMonth(new Date(`${session.date}T12:00:00`).getMonth()); }
        setSelectedSessionId(id);
        setSessionBookings([]);
        setEditingBookingId(null);
        setShowNewBooking(false);
        setActionError('');
        setBookingQuery('');
        loadBookings(id);
        if (window.matchMedia('(max-width: 767px)').matches) {
            requestAnimationFrame(() => detailPanel.current?.scrollIntoView({ block: 'start' }));
        }
    };

    const api = async (type: string, body: Record<string, unknown>) => {
        const res = await fetch('/api/cockpit/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, ...body }),
        });
        if (res.redirected) throw new Error('Votre session a expiré. Reconnectez-vous pour continuer.');
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Erreur serveur');
        }
        return res.json();
    };

    const handleCreateSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionForm.date || !sessionForm.heureDebut || !sessionForm.heureFin) {
            return setActionError('Remplissez la date et les horaires.');
        }
        const timeInMinutes = (value: string) => {
            const match = value.trim().match(/^(\d{1,2})(?:h|:)(\d{2})?$/);
            if (!match) return NaN;
            const hours = Number(match[1]); const minutes = Number(match[2] || 0);
            return hours < 24 && minutes < 60 ? hours * 60 + minutes : NaN;
        };
        const start = timeInMinutes(sessionForm.heureDebut); const end = timeInMinutes(sessionForm.heureFin);
        if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return setActionError('Indiquez des horaires valides, avec une fin après le début (ex. 10h30 – 12h30).');
        if (!Number.isInteger(sessionForm.capaciteMax) || sessionForm.capaciteMax < 1 || sessionForm.capaciteMax > 50) return setActionError('Choisissez une capacité de 1 à 50 personnes.');
        const original = sessions.find(session => session._id === editingSessionId);
        if (original && sessionForm.capaciteMax < (bookingCounts[original._id] ?? reservedPlaces(original))) return setActionError('La capacité doit rester au moins égale au nombre de places déjà réservées.');
        setActionError('');
        setIsSaving(true);
        try {
            await api(editingSessionId ? 'UPDATE_CHAR_SESSION' : 'CREATE_CHAR_SESSION', {
                ...(editingSessionId ? { _id: editingSessionId } : {}), patch: sessionForm,
            });
            setActionNotice(editingSessionId ? 'Les modifications de la séance sont enregistrées.' : 'La nouvelle séance est ajoutée au planning.');
            setEditingSessionId(null);
            setShowNewSession(false);
            setSessionForm(emptySessionForm());
            onRefresh();
        } catch (err: any) {
            setActionError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSession = async (session: CharSessionDoc) => {
        if (!confirm(`Supprimer la session du ${formatDateShort(session.date)} ? Toutes les réservations seront supprimées.`)) return;
        setActionError('');
        setIsSaving(true);
        try {
            await api('DELETE_CHAR_SESSION', { _id: session._id });
            if (selectedSessionId === session._id) setSelectedSessionId(null);
            onRefresh();
        } catch (err: any) {
            setActionError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSessionId || !bookingForm.clientNom.trim() || !bookingForm.clientTel.trim()) {
            return setActionError('Nom et téléphone obligatoires.');
        }
        if (!Number.isInteger(bookingForm.nbPlaces) || bookingForm.nbPlaces < 1 || bookingForm.nbPlaces > 50) return setActionError('Choisissez de 1 à 50 personnes.');
        if (bookingForm.statut === 'a_valider' && !bookingForm.motifSuivi) return setActionError('Indiquez ce qui doit être validé avant de poursuivre.');
        if (loadingBookings || bookingsError) return setActionError('Attendez le chargement des réservations avant d’enregistrer.');
        if (bookingForm.statut === 'confirme' && bookingForm.nbPlaces > placesRestantes) {
            return setActionError(`Il reste ${Math.max(0, placesRestantes)} place(s). Choisissez un autre créneau ou la liste d’attente.`);
        }
        setActionError('');
        setIsSaving(true);
        try {
            await api('CREATE_CHAR_BOOKING', {
                patch: { sessionId: selectedSessionId, ...bookingForm, clientNom: bookingForm.clientNom.trim(), clientTel: bookingForm.clientTel.trim() }
            });
            setActionNotice(`${bookingForm.clientNom} · ${bookingForm.nbPlaces} personne(s) ${bookingForm.statut === 'liste_attente' ? 'à prévenir si une place se libère' : bookingForm.statut === 'a_valider' ? 'à valider' : 'inscrite(s)'}.`);
            setShowNewBooking(false);
            setBookingForm(emptyBookingForm());
            await loadBookings(selectedSessionId);
            onRefresh();
        } catch (err: any) {
            setActionError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateBookingStatut = async (bookingId: string, statut: CharBookingStatut) => {
        const booking = sessionBookings.find(item => item._id === bookingId);
        if (statut === 'confirme' && booking?.statut !== 'confirme' && (booking?.nbPlaces || 0) > placesRestantes) return setActionError('Il n’y a pas assez de places pour confirmer cette réservation.');
        const motifSuivi = statut === 'liste_attente' ? 'place_a_liberer' : statut === 'a_valider' ? (booking?.motifSuivi && booking.motifSuivi !== 'place_a_liberer' ? booking.motifSuivi : 'nombre_a_confirmer') : '';
        setActionError('');
        setIsSaving(true);
        try {
            await api('UPDATE_CHAR_BOOKING', { _id: bookingId, patch: { statut, motifSuivi } });
            if (selectedSessionId) await loadBookings(selectedSessionId);
            onRefresh();
        } catch (err: any) {
            setActionError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditBooking = (b: CharBookingDoc) => {
        setEditingBookingId(b._id);
        setEditBookingForm({ clientNom: b.clientNom, clientTel: b.clientTel, nbPlaces: b.nbPlaces, statut: b.statut, motifSuivi: b.motifSuivi ?? '', notes: b.notes ?? '', todo: b.todo ?? '', todoDone: b.todoDone ?? false });
    };

    const handleSaveEditBooking = async (bookingId: string) => {
        const original = sessionBookings.find(booking => booking._id === bookingId);
        const requested = editBookingForm.nbPlaces || 0;
        if (!editBookingForm.clientNom?.trim() || !editBookingForm.clientTel?.trim() || !Number.isInteger(requested) || requested < 1 || requested > 50) return setActionError('Renseignez un nom, un téléphone et de 1 à 50 personnes.');
        if (editBookingForm.statut === 'confirme' && requested > placesRestantes + (original?.statut === 'confirme' ? original.nbPlaces : 0)) return setActionError('Il n’y a pas assez de places pour cette modification.');
        const motifSuivi = editBookingForm.statut === 'liste_attente' ? 'place_a_liberer' : editBookingForm.statut === 'a_valider' ? (editBookingForm.motifSuivi || 'nombre_a_confirmer') : '';
        setActionError('');
        setIsSaving(true);
        try {
            await api('UPDATE_CHAR_BOOKING', { _id: bookingId, patch: { ...editBookingForm, motifSuivi } });
            setEditingBookingId(null);
            if (selectedSessionId) await loadBookings(selectedSessionId);
            onRefresh();
        } catch (err: any) {
            setActionError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteBooking = async (bookingId: string) => {
        if (!confirm('Supprimer cette réservation ?')) return;
        setActionError('');
        setIsSaving(true);
        try {
            await api('DELETE_CHAR_BOOKING', { _id: bookingId });
            if (selectedSessionId) await loadBookings(selectedSessionId);
            onRefresh();
        } catch (err: any) {
            setActionError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const computeStats = (list: CharSessionDoc[]) => {
        let totalCap = 0;
        let totalRes = 0;
        list.forEach(s => {
            totalCap += s.capaciteMax;
            totalRes += reservedPlaces(s);
        });
        const fillRate = totalCap > 0 ? Math.round((totalRes / totalCap) * 100) : 0;
        return { count: list.length, totalCap, totalRes, fillRate };
    };

    const nowIso = today();
    const upcomingSessions = sessions.filter(s => s.date >= nowIso);
    const upStats = computeStats(upcomingSessions);
    const allStats = computeStats(sessions);

    const weekEnd = addWeeks(currentWeek, 1);
    const weekSessions = sessions.filter(session => session.date >= currentWeek && session.date < weekEnd)
        .sort((a, b) => a.date.localeCompare(b.date) || a.heureDebut.localeCompare(b.heureDebut, 'fr', { numeric: true }));
    const weekDays = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(`${currentWeek}T12:00:00`); date.setDate(date.getDate() + index); return toIso(date);
    });
    useEffect(() => {
        const candidates = sessions.filter(session => session.date === selectedDate && session.date >= currentWeek && session.date < addWeeks(currentWeek, 1))
            .sort((a, b) => a.date.localeCompare(b.date) || a.heureDebut.localeCompare(b.heureDebut, 'fr', { numeric: true }));
        if (candidates.some(session => session._id === selectedSessionId)) return;
        const eligible = mode === 'reserve' && !showUnavailable ? candidates.filter(session => session.capaciteMax - (bookingCounts[session._id] ?? reservedPlaces(session)) >= bookingForm.nbPlaces) : candidates;
        const next = eligible.find(session => session._id === initialSessionId) || (mode === 'reserve' && !showUnavailable ? eligible.find(session => session.date >= today()) : eligible.find(session => session.date >= today()) || eligible[0]);
        if (!next) return;
        setSelectedSessionId(next._id); setSessionBookings([]); setEditingBookingId(null); setShowNewBooking(false);
        void loadBookings(next._id);
    }, [currentWeek, selectedDate, sessions, selectedSessionId, loadBookings, mode, showUnavailable, bookingCounts, bookingForm.nbPlaces, initialSessionId]);

    const availableSessions = mode !== 'reserve' || showUnavailable ? weekSessions : weekSessions.filter(session => session.date >= nowIso && session.capaciteMax - (bookingCounts[session._id] ?? reservedPlaces(session)) >= bookingForm.nbPlaces);
    const visibleBookings = sessionBookings.filter(booking => {
        const matchesStatus = bookingFilter === 'active' ? booking.statut !== 'annule' : booking.statut === bookingFilter;
        const query = bookingQuery.trim().toLocaleLowerCase('fr');
        return matchesStatus && (!query || booking.clientNom.toLocaleLowerCase('fr').includes(query) || booking.clientTel.replace(/\s/g, '').includes(query.replace(/\s/g, '')));
    });
    const confirmedCount = sessionBookings.filter(booking => booking.statut === 'confirme').reduce((sum, booking) => sum + booking.nbPlaces, 0);
    const validationCount = sessionBookings.filter(booking => booking.statut === 'a_valider').reduce((sum, booking) => sum + booking.nbPlaces, 0);
    const waitingCount = sessionBookings.filter(booking => booking.statut === 'liste_attente').reduce((sum, booking) => sum + booking.nbPlaces, 0);

    function chooseWeek(date: string, focusDate?: string) {
        if (isSaving) return;
        setActionNotice(''); setActionError('');
        const focused = new Date(`${date}T12:00:00`);
        focused.setDate(focused.getDate() + (new Date(`${selectedDate}T12:00:00`).getDay() + 6) % 7);
        const nextDate = focusDate || toIso(focused);
        setCurrentWeek(date); setSelectedDate(nextDate);
        setCalYear(new Date(`${nextDate}T12:00:00`).getFullYear()); setCalMonth(new Date(`${nextDate}T12:00:00`).getMonth());
        setSelectedSessionId(null); setSessionBookings([]); setEditingBookingId(null); setShowNewBooking(false);
        bookingsRequest.current++; setLoadingBookings(false); setBookingsError('');
    }
    function chooseDate(date: string) { chooseWeek(getWeekStart(date), date); }
    function openSessionEditor(form: NewSessionForm, sessionId: string | null = null) {
        if (isSaving) return;
        setMode('plan'); setIsDuplicatingSession(false); setEditingSessionId(sessionId); setSessionForm(form); setShowNewSession(true);
        setActionError(''); setActionNotice('');
        requestAnimationFrame(() => sessionEditor.current?.scrollIntoView({ block: 'nearest' }));
    }
    function newSession(date = today()) { openSessionEditor({ ...emptySessionForm(), date }); }
    function editSession(session: CharSessionDoc) {
        openSessionEditor({ date: session.date, heureDebut: session.heureDebut, heureFin: session.heureFin, capaciteMax: session.capaciteMax, notes: session.notes || '', actif: session.actif !== false }, session._id);
    }
    function duplicateSession(session: CharSessionDoc) {
        openSessionEditor({ date: session.date, heureDebut: session.heureDebut, heureFin: session.heureFin, capaciteMax: session.capaciteMax, notes: session.notes || '', actif: session.actif !== false });
        setIsDuplicatingSession(true);
    }
    function chooseMode(next: 'plan' | 'reserve' | 'follow') {
        if (isSaving) return;
        setMode(next); setShowNewSession(false); setEditingSessionId(null); setShowNewBooking(false);
        setActionNotice(''); setActionError('');
        if (next === 'reserve') setSelectedSessionId(null);
    }

    return (
        <div className={styles.root}>
            <header data-admin-page-header data-admin-header-compact>
                <h3 data-admin-page-title className={styles.pageHeading}>Char à voile · gestion du planning et des réservations</h3>
            </header>
            <div className={styles.modeBar}>
                <div className={styles.modeSwitch} role="group" aria-label="Organisation du char à voile">
                    <button type="button" disabled={isSaving} aria-pressed={mode === 'reserve'} onClick={() => chooseMode('reserve')} className={mode === 'reserve' ? styles.activeMode : ''}><Phone size={15} /> Prendre un appel</button>
                    <button type="button" disabled={isSaving} aria-pressed={mode === 'plan'} onClick={() => chooseMode('plan')} className={mode === 'plan' ? styles.activeMode : ''}><CalendarDays size={15} /> Préparer le planning</button>
                    <button type="button" disabled={isSaving} aria-pressed={mode === 'follow'} onClick={() => chooseMode('follow')} className={mode === 'follow' ? styles.activeMode : ''}><Users size={15} /> Suivre les réservations</button>
                </div>
            </div>
            {actionError && (mode === 'plan' || !selectedSession || showNewSession) && <p role="alert" className={styles.errorNotice}>{actionError}</p>}
            {actionNotice && (mode === 'plan' || !selectedSession) && <p role="status" className={styles.successNotice}><CheckCircle size={18} /> {actionNotice}</p>}
            <section aria-label="Planning hebdomadaire" className={styles.bookingLayout}>
                <section aria-label="Calendrier des séances" className={styles.calendar}>
                    <header className={styles.calendarHeader}>
                        <button type="button" disabled={isSaving} aria-label="Mois précédent" onClick={() => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1); }}><ChevronLeft size={18} /></button>
                        <h4>{MONTHS_FR[calMonth]} {calYear}</h4>
                        <button type="button" disabled={isSaving} aria-label="Mois suivant" onClick={() => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1); }}><ChevronRight size={18} /></button>
                    </header>
                    <div className={styles.calendarGrid}>
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => <span key={day} className={styles.calendarWeekday}>{day}</span>)}
                        {getCalendarDays(calYear, calMonth).map((day, index) => {
                            if (!day) return <span key={`empty-${index}`} />;
                            const date = toIso(day);
                            const selectedWeek = date >= currentWeek && date < weekEnd;
                            const hasSession = sessions.some(session => session.date === date);
                            return <button type="button" key={date} disabled={isSaving} aria-label={formatDate(date)} aria-pressed={date === selectedDate} aria-current={date === nowIso ? 'date' : undefined} onClick={() => chooseDate(date)} className={`${styles.calendarDay} ${selectedWeek ? styles.calendarSelectedWeek : ''} ${date === selectedDate ? styles.calendarSelectedDay : ''}`}>
                                <span>{day.getDate()}</span>
                                <span aria-hidden="true" className={`${styles.calendarDot} ${hasSession ? styles.hasSession : ''}`} />
                            </button>;
                        })}
                    </div>
                    <p className={styles.calendarLegend}><span aria-hidden="true" /> Une séance est prévue</p>
                </section>
                    <div className={styles.workArea}>
                    <div className={styles.dateControls}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
                            <button type="button" disabled={isSaving} aria-label="Semaine précédente" onClick={() => chooseWeek(addWeeks(currentWeek, -1))} className="rounded-lg p-2 text-abysse hover:bg-slate-100"><ChevronLeft size={18} /></button>
                            <button type="button" disabled={isSaving} onClick={() => chooseDate(today())} className="px-2 py-2 text-xs font-bold text-abysse">Aujourd’hui</button>
                            <button type="button" disabled={isSaving} aria-label="Semaine suivante" onClick={() => chooseWeek(addWeeks(currentWeek, 1))} className="rounded-lg p-2 text-abysse hover:bg-slate-100"><ChevronRight size={18} /></button>
                        </div>
                        <h4 className={styles.weekRange}>Du {new Date(`${currentWeek}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', ...(currentWeek.slice(0, 4) !== weekDays[6].slice(0, 4) ? { year: 'numeric' as const } : {}) })} au {new Date(`${weekDays[6]}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => setShowDashboardModal(true)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-abysse"><BarChart2 size={15} /> Bilan</button>
                        <button type="button" disabled={isSaving} onClick={() => newSession(selectedDate)} className="inline-flex items-center gap-2 rounded-lg bg-abysse px-4 py-2.5 text-xs font-bold text-white"><Plus size={16} /> Nouvelle séance</button>
                    </div>
                </div>
                    </div>
                {showNewSession && (
                    <form ref={sessionEditor} onSubmit={handleCreateSession} className="bg-white border border-slate-200 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <p className="col-span-full text-base font-bold text-abysse">{editingSessionId ? 'Modifier la séance' : isDuplicatingSession ? 'Dupliquer la séance' : 'Nouvelle séance'}</p>
                        {isDuplicatingSession && <p className="col-span-full text-sm text-slate-500">Choisissez le jour et les horaires de la nouvelle séance. Elle sera créée sans inscriptions.</p>}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500">Date</label>
                            <input type="date" aria-label="Date de la séance" required value={sessionForm.date} onChange={e => setSessionForm(f => ({ ...f, date: e.target.value }))}
                                className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm font-bold text-abysse outline-none focus:ring-2 ring-orange-100" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-500">Début</label>
                                <input type="text" required aria-label="Heure de début" placeholder="10h30" value={sessionForm.heureDebut} onChange={e => setSessionForm(f => ({ ...f, heureDebut: e.target.value }))}
                                    className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm font-bold text-center outline-none focus:ring-2 ring-orange-100" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-500">Fin</label>
                                <input type="text" required aria-label="Heure de fin" placeholder="12h30" value={sessionForm.heureFin} onChange={e => setSessionForm(f => ({ ...f, heureFin: e.target.value }))}
                                    className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm font-bold text-center outline-none focus:ring-2 ring-orange-100" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-slate-500">Capacité max</label>
                            <input type="number" aria-label="Capacité de la séance" required min={1} max={50} value={sessionForm.capaciteMax} onChange={e => setSessionForm(f => ({ ...f, capaciteMax: parseInt(e.target.value) }))}
                                className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm font-bold text-center outline-none focus:ring-2 ring-orange-100" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-slate-500">Notes (marée, conditions...)</label>
                            <textarea aria-label="Notes de la séance" rows={2} value={sessionForm.notes} onChange={e => setSessionForm(f => ({ ...f, notes: e.target.value }))}
                                className="w-full p-2 bg-white border border-orange-200 rounded-lg text-xs outline-none focus:ring-2 ring-orange-100 resize-none" />
                        </div>
                        <div className="col-span-full flex flex-wrap items-center justify-between gap-3 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={sessionForm.actif} onChange={e => setSessionForm(f => ({ ...f, actif: e.target.checked }))} className="size-4 accent-orange-500" />
                                <span className="text-[10px] font-bold uppercase text-slate-500">Afficher les horaires sur le site</span>
                            </label>
                            <button type="button" disabled={isSaving} onClick={() => { setShowNewSession(false); setEditingSessionId(null); setActionError(''); }} className="ml-auto px-3 py-2 text-xs font-bold text-slate-500">Annuler</button>
                            <button type="submit" disabled={isSaving}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-abysse transition-all flex items-center gap-1.5">
                                {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />} {editingSessionId ? 'Enregistrer la séance' : 'Créer la séance'}
                            </button>
                        </div>
                    </form>
                )}

            {mode === 'plan' ? <section aria-label="Préparation des séances" className={styles.planner}>
                <div className={styles.plannerIntro}><div><h4>Les séances de la semaine</h4><p>Fixez les horaires et la capacité, puis prenez les réservations lors des appels.</p></div><span>{weekSessions.length} séance{weekSessions.length > 1 ? 's' : ''}</span></div>
                <div className={styles.planningDays}>
                    {weekDays.map(date => {
                        const daySessions = weekSessions.filter(session => session.date === date);
                        return <section key={date} className={`${styles.planningDay} ${date === nowIso ? styles.today : ''} ${date === selectedDate ? styles.selectedPlanningDay : ''}`} data-selected-day={date === selectedDate}>
                            <header>
                                <button type="button" disabled={isSaving} aria-label={`Sélectionner le ${formatDate(date)}`} aria-pressed={date === selectedDate} onClick={() => chooseDate(date)} className={styles.selectPlanningDay}>
                                <div className={styles.weekdayRow}><h5>{new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long' }).replace(/^./, letter => letter.toUpperCase())}</h5>{date === nowIso && <span className={styles.todayLabel}>Aujourd’hui</span>}</div>
                                <time dateTime={date} className={styles.dayDate}><strong>{new Date(`${date}T12:00:00`).getDate()}</strong><span>{new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', { month: 'long' })}</span></time>
                                </button>
                            </header>
                            <div className={styles.daySessions}>
                                {daySessions.map(session => {
                                    const reserved = bookingCounts[session._id] ?? reservedPlaces(session);
                                    const remaining = Math.max(0, session.capaciteMax - reserved);
                                    return <article key={session._id} className={`${styles.planningSession} ${remaining === 0 ? styles.full : remaining <= 3 ? styles.limited : styles.available}`}>
                                        <strong>{session.heureDebut} – {session.heureFin}</strong>
                                        <p>{reserved} inscrit{reserved > 1 ? 's' : ''} / {session.capaciteMax} places</p>
                                        <span>{remaining ? `${remaining} place${remaining > 1 ? 's' : ''} libre${remaining > 1 ? 's' : ''}` : 'Complet'}</span>
                                        {session.notes && <p className={styles.sessionNotes}>{session.notes}</p>}
                                        <div className={styles.planningActions}>
                                            <button type="button" disabled={isSaving} aria-label={`Modifier la séance du ${formatDateShort(date)} à ${session.heureDebut}`} onClick={() => editSession(session)}><Pencil size={14} /> Modifier</button>
                                            <button type="button" disabled={isSaving} aria-label={`Dupliquer la séance du ${formatDateShort(date)} à ${session.heureDebut}`} onClick={() => duplicateSession(session)} title="Dupliquer la séance"><Copy size={14} /></button>
                                        </div>
                                        <button type="button" disabled={isSaving} className={styles.sessionReservations} onClick={() => { chooseMode('follow'); handleSelectSession(session._id); }}>Réservations <ChevronRight size={13} /></button>
                                    </article>;
                                })}
                                {!daySessions.length && <p className={styles.emptyDay}>Pas de séance</p>}
                            </div>
                            <button type="button" disabled={isSaving} className={styles.addSession} onClick={() => newSession(date)} aria-label={`Ajouter une séance le ${formatDateShort(date)}`}><Plus size={14} /> Ajouter</button>
                        </section>;
                    })}
                </div>
            </section> : <div className={styles.workspace}>
                <aside aria-label="Séances de la semaine" className={styles.agenda}>
                    <div className={styles.finderHeader}>
                        <span className={styles.step}>1</span><div><h4>{mode === 'reserve' ? 'Trouver un créneau' : 'Choisir une séance'}</h4><p>{mode === 'reserve' ? 'Les disponibilités pour votre groupe' : 'Les séances de la semaine'}</p></div>
                    </div>
                    {mode === 'reserve' && <div className={styles.groupSize}>
                        <label htmlFor="char-group-size">Combien de personnes ?</label>
                        <div className={styles.stepper}>
                            <button type="button" aria-label="Une personne de moins" disabled={bookingForm.nbPlaces <= 1 || isSaving} onClick={() => setBookingForm(form => ({ ...form, nbPlaces: form.nbPlaces - 1 }))}>−</button>
                            <input id="char-group-size" disabled={isSaving} type="number" min={1} max={50} value={bookingForm.nbPlaces || ''} onChange={event => setBookingForm(form => ({ ...form, nbPlaces: Number(event.target.value) }))} />
                            <button type="button" aria-label="Une personne de plus" disabled={bookingForm.nbPlaces >= 50 || isSaving} onClick={() => setBookingForm(form => ({ ...form, nbPlaces: form.nbPlaces + 1 }))}>+</button>
                        </div>
                        <label className={styles.showAll}><input type="checkbox" disabled={isSaving} checked={showUnavailable} onChange={event => setShowUnavailable(event.target.checked)} /> Voir toutes les séances</label>
                    </div>}
                    {weekDays.filter(date => availableSessions.some(session => session.date === date)).map(date => <section key={date} className={date === selectedDate ? styles.selectedSessionDay : ''} data-selected-day={date === selectedDate}>
                        <h5 className={styles.dateTitle}>{formatDate(date)}</h5>
                        {availableSessions.filter(session => session.date === date).map(session => {
                            const remaining = Math.max(0, session.capaciteMax - (bookingCounts[session._id] ?? reservedPlaces(session)));
                            return <button type="button" disabled={isSaving} key={session._id} onClick={() => handleSelectSession(session._id)} aria-pressed={selectedSessionId === session._id} aria-label={`Séance ${formatDateShort(session.date)} ${session.heureDebut} à ${session.heureFin}`} className={`${styles.session} ${selectedSessionId === session._id ? styles.selected : ''} ${remaining === 0 ? styles.full : remaining <= 3 ? styles.limited : styles.available}`}>
                                <span><span className="block font-bold text-abysse">{session.heureDebut} – {session.heureFin}</span>{session.actif === false && <span className="mt-1 block text-xs text-slate-500">Horaires non affichés sur le site</span>}</span>
                                <span className={`text-sm font-semibold ${remaining ? 'text-abysse' : 'text-red-600'}`}>{remaining ? `${remaining} place${remaining > 1 ? 's' : ''} libre${remaining > 1 ? 's' : ''}` : 'Complet'}<ChevronRight size={15} /></span>
                            </button>;
                        })}
                    </section>)}
                    {!availableSessions.length && <div className={styles.noAvailability}><p>{weekSessions.length ? 'Aucun créneau ne peut accueillir ce groupe cette semaine.' : 'Aucune séance cette semaine.'}</p><button type="button" onClick={() => chooseWeek(addWeeks(currentWeek, 1))}>Chercher la semaine suivante <ChevronRight size={15} /></button>{weekSessions.length > 0 && <button type="button" onClick={() => setShowUnavailable(true)}>Voir les séances pour une liste d’attente</button>}</div>}
                </aside>

            {/* MAIN — Détail session + bookings */}
            <div ref={detailPanel} className="min-w-0 scroll-mt-44">
                {!selectedSession ? (
                    <div className="h-full min-h-36 p-5 text-center flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-cyan-200 rounded-2xl bg-cyan-50">
                        <Users size={36} className="mb-3 opacity-30" />
                        <p className="text-sm font-semibold text-abysse">{weekSessions.some(session => session.date === selectedDate) ? `Choisissez un créneau pour le ${formatDateShort(selectedDate)}` : `Aucune séance le ${formatDateShort(selectedDate)}`}</p>
                        <button type="button" disabled={isSaving} onClick={() => newSession(selectedDate)} className={styles.addSession}><Plus size={14} /> Préparer une séance ce jour</button>
                    </div>
                ) : (
                    <div className={styles.detail}>
                        <header className={styles.detailHeader}>
                            <div className={styles.selectedSessionSummary}>
                                <h3>{formatDate(selectedSession.date)}</h3>
                                <p className={styles.selectedSessionMeta}><strong>{selectedSession.heureDebut} – {selectedSession.heureFin}</strong><span aria-hidden="true">·</span><span><strong>{Math.max(0, placesRestantes)} place{placesRestantes > 1 ? 's' : ''} libre{placesRestantes > 1 ? 's' : ''}</strong> sur {selectedSession.capaciteMax}</span></p>
                                {selectedSession.notes && <p className={styles.selectedSessionNotes}>{selectedSession.notes}</p>}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button type="button" disabled={isSaving} onClick={() => editSession(selectedSession)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"><Pencil size={14} /> Modifier la séance</button>
                                <button type="button" aria-label="Supprimer cette séance" disabled={isSaving} onClick={() => handleDeleteSession(selectedSession)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
                            </div>
                        </header>

                        {/* Bookings */}
                        <div className={styles.detailBody}>
                            {actionError && !showNewSession && <p role="alert" className={`${styles.errorNotice} mb-4`}>{actionError}</p>}
                            {actionNotice && <p role="status" className={`${styles.successNotice} mb-4`}><CheckCircle size={18} /> {actionNotice}</p>}
                            {bookingsError && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{bookingsError} <button type="button" onClick={() => loadBookings(selectedSession._id)} className="font-bold underline">Réessayer</button></p>}
                            {loadingBookings && <p role="status" className="mb-4 text-sm text-slate-500">Vérification des places disponibles…</p>}
                            {mode === 'follow' && <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                <h4 className="font-black text-sm uppercase text-abysse tracking-tighter">
                                    Réservations
                                    {sessionBookings.length > 0 && (
                                        <span className="ml-2 text-slate-400 font-normal">({sessionBookings.length})</span>
                                    )}
                                </h4>
                                <button
                                    onClick={() => setShowNewBooking(v => !v)}
                                    className="px-4 py-2 bg-abysse text-white rounded-lg font-semibold text-sm hover:bg-turquoise flex items-center gap-1.5"
                                >
                                    {showNewBooking ? <ChevronUp size={12} /> : <Plus size={12} />}
                                    Ajouter une réservation
                                </button>
                            </div>

                            }
                            {/* Formulaire nouvelle réservation */}
                            {(mode === 'reserve' || showNewBooking) && (
                                <form onSubmit={handleCreateBooking} className={styles.bookingForm}>
                                    <div className={styles.formHeading}><span className={styles.step}>2</span><div><h4>Inscrire le groupe</h4><p>{bookingForm.nbPlaces} personne{bookingForm.nbPlaces > 1 ? 's' : ''} · {selectedSession.heureDebut} – {selectedSession.heureFin}</p></div></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-500">Nom du client *</label>
                                            <input type="text" aria-label="Nom du client" disabled={isSaving} autoComplete="name" required placeholder="Nom et prénom" value={bookingForm.clientNom} onChange={e => setBookingForm(f => ({ ...f, clientNom: e.target.value }))}
                                                className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-abysse outline-none focus:ring-2 ring-abysse/10 focus:border-abysse/30" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-500">Téléphone *</label>
                                            <input type="tel" aria-label="Téléphone du client" disabled={isSaving} autoComplete="tel" required placeholder="06 XX XX XX XX" value={bookingForm.clientTel} onChange={e => setBookingForm(f => ({ ...f, clientTel: e.target.value }))}
                                                className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-abysse outline-none focus:ring-2 ring-abysse/10 focus:border-abysse/30" />
                                        </div>
                                        {mode === 'follow' && (<div>
                                            <label className="text-[10px] font-bold uppercase text-slate-500">Nb de places</label>
                                            <input type="number" required min={1} aria-label="Nombre de personnes" disabled={isSaving} max={50} value={bookingForm.nbPlaces} onChange={e => setBookingForm(f => ({ ...f, nbPlaces: parseInt(e.target.value) }))}
                                                className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-center text-abysse outline-none focus:ring-2 ring-abysse/10" />
                                        </div>)}
                                        <fieldset className={styles.bookingChoice}>
                                            <legend>Réservation</legend>
                                            <button type="button" disabled={isSaving} aria-pressed={bookingForm.statut === 'confirme'} onClick={() => setBookingForm(form => ({ ...form, statut: 'confirme', motifSuivi: '' }))}><CheckCircle size={15} /> Confirmée</button>
                                            <button type="button" disabled={isSaving} aria-pressed={bookingForm.statut === 'a_valider'} onClick={() => setBookingForm(form => ({ ...form, statut: 'a_valider', motifSuivi: form.motifSuivi === 'place_a_liberer' || !form.motifSuivi ? 'nombre_a_confirmer' : form.motifSuivi }))}><Clock size={15} /> À valider</button>
                                        </fieldset>
                                        {bookingForm.statut === 'a_valider' && <div className={styles.followUpReason}>
                                            <label htmlFor="booking-follow-up">Que faut-il valider ?</label>
                                            <select id="booking-follow-up" disabled={isSaving} value={bookingForm.motifSuivi} onChange={e => setBookingForm(form => ({ ...form, motifSuivi: e.target.value }))}>
                                                {FOLLOW_UP_REASONS.map(reason => <option key={reason.value} value={reason.value}>{reason.label}</option>)}
                                            </select>
                                        </div>}
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-500">Notes internes (optionnel)</label>
                                            <input type="text" disabled={isSaving} aria-label="Notes de la réservation" placeholder="Observations..." value={bookingForm.notes} onChange={e => setBookingForm(f => ({ ...f, notes: e.target.value }))}
                                                className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm text-abysse outline-none focus:ring-2 ring-abysse/10" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-500">À faire pour ce groupe (optionnel)</label>
                                            <textarea disabled={isSaving} aria-label="À faire pour ce groupe" placeholder="Ex. Prévoir un char supplémentaire et rappeler pour confirmer l’accueil du groupe..." rows={2} value={bookingForm.todo} onChange={e => setBookingForm(f => ({ ...f, todo: e.target.value, todoDone: false }))}
                                                className="w-full mt-1 p-2.5 bg-white border border-amber-200 rounded-xl text-sm text-abysse outline-none focus:ring-2 ring-amber-100 resize-y" />
                                        </div>
                                    </div>
                                    {bookingForm.nbPlaces > placesRestantes && <div className={styles.capacityWarning}>
                                        <strong>Il reste {Math.max(0, placesRestantes)} place(s) : ce groupe ne peut pas être confirmé normalement.</strong>
                                        <div className={styles.capacityChoices}>
                                            <button type="button" disabled={isSaving} onClick={() => setBookingForm(form => ({ ...form, statut: 'liste_attente', motifSuivi: 'place_a_liberer' }))}>Prévenir si une place se libère</button>
                                            <button type="button" disabled={isSaving} className={styles.overbookingChoice} onClick={() => setBookingForm(form => ({ ...form, statut: 'a_valider', motifSuivi: 'surbooking_a_regulariser' }))}>Enregistrer en surbooking à régulariser</button>
                                        </div>
                                    </div>}
                                    <div className="flex flex-wrap justify-end gap-2 pt-1">
                                        <button type="button" disabled={isSaving} onClick={() => { setShowNewBooking(false); setBookingForm(emptyBookingForm()); setActionError(''); }}
                                            className="px-4 py-2 text-slate-400 font-bold text-xs uppercase rounded-xl hover:bg-slate-50 transition-all">
                                            Effacer
                                        </button>
                                        <button type="submit" disabled={isSaving || loadingBookings || !!bookingsError || !Number.isInteger(bookingForm.nbPlaces) || bookingForm.nbPlaces < 1 || bookingForm.nbPlaces > 50 || (bookingForm.statut === 'confirme' && bookingForm.nbPlaces > placesRestantes)}
                                            className="px-5 py-2 bg-abysse text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-turquoise transition-all flex items-center gap-1.5">
                                            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <UserPlus size={16} />} {bookingForm.statut === 'liste_attente' ? 'Enregistrer la demande' : bookingForm.statut === 'a_valider' ? 'Enregistrer à valider' : 'Confirmer la réservation'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {mode === 'follow' && <>
                            <div className={styles.bookingSearch}><Search size={18} /><input aria-label="Rechercher un inscrit" value={bookingQuery} onChange={event => setBookingQuery(event.target.value)} placeholder="Rechercher un nom ou un téléphone" /></div>
                            <div className={styles.statusTabs} role="group" aria-label="Filtrer les réservations">
                                {([{ value: 'active', label: 'Tous les groupes' }, { value: 'confirme', label: `Confirmés · ${confirmedCount}` }, { value: 'a_valider', label: `À valider · ${validationCount}` }, { value: 'liste_attente', label: `Places à libérer · ${waitingCount}` }, { value: 'annule', label: 'Annulés' }] as const).map(filter => <button type="button" key={filter.value} aria-pressed={bookingFilter === filter.value} onClick={() => setBookingFilter(filter.value)}>{filter.label}</button>)}
                            </div>
                            {/* Liste des réservations */}
                            {bookingsError ? null : loadingBookings ? (
                                <div className="py-8 flex justify-center">
                                    <RefreshCw size={20} className="animate-spin text-slate-300" />
                                </div>
                            ) : visibleBookings.length === 0 ? (
                                <div className="py-10 text-center text-slate-300">
                                    <Phone size={28} className="mx-auto mb-2 opacity-40" />
                                    <p className="text-[11px] font-bold uppercase tracking-wider">{sessionBookings.length ? 'Aucune réservation ne correspond à ce filtre' : 'Aucune réservation pour cette séance'}</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {visibleBookings.map(b => {
                                        const isEditing = editingBookingId === b._id;
                                        return (
                                            <div key={b._id} data-booking-status={b.statut} className={`${styles.bookingRow} ${isEditing ? styles.bookingRowEditing : ''}`}>
                                                <div className={styles.bookingSummary}>
                                                    <div className={styles.bookingIdentity}>
                                                        <div className={styles.bookingTitle}>
                                                            <span className={styles.bookingName}>{b.clientNom}</span>
                                                            <span className={styles.bookingPlaces}>{b.nbPlaces} place{b.nbPlaces > 1 ? 's' : ''}</span>
                                                            <span className={styles.bookingStatus} data-status={b.statut}>
                                                                {b.statut === 'confirme' ? <CheckCircle size={14} aria-hidden="true" /> : b.statut === 'annule' ? <X size={14} aria-hidden="true" /> : <Clock size={14} aria-hidden="true" />}
                                                                {b.statut === 'confirme' ? 'Réservation confirmée' : b.statut === 'a_valider' ? 'À valider avant confirmation' : b.statut === 'liste_attente' ? 'À prévenir si une place se libère' : 'Réservation annulée'}
                                                            </span>
                                                        </div>
                                                        {followUpLabel(b.motifSuivi) && b.statut !== 'confirme' && b.statut !== 'annule' && <p className={styles.followUpSummary}><strong>Suivi :</strong> {followUpLabel(b.motifSuivi)}</p>}
                                                        <div className={styles.bookingMeta}>
                                                            <a href={`tel:${b.clientTel}`} className={styles.bookingPhone}>
                                                                <Phone size={13} aria-hidden="true" /> <span>{b.clientTel}</span>
                                                            </a>
                                                            {b.notes && <span className={styles.bookingNotes}>{b.notes}</span>}
                                                        </div>
                                                        {b.todo?.trim() && <div className={`mt-2 flex items-start gap-2 rounded-xl px-3 py-2 text-xs ${b.todoDone ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}><span className="shrink-0 font-bold">{b.todoDone ? 'Traité' : 'À faire'}</span><span className={b.todoDone ? 'line-through opacity-70' : ''}>{b.todo}</span></div>}
                                                    </div>
                                                    <div className={styles.bookingControls}>
                                                        <button type="button" aria-label={isEditing ? `Fermer la modification de ${b.clientNom}` : `Modifier la réservation de ${b.clientNom}`} onClick={() => isEditing ? setEditingBookingId(null) : handleEditBooking(b)} className={styles.bookingAction}>
                                                            {isEditing ? <X size={15} aria-hidden="true" /> : <Pencil size={15} aria-hidden="true" />}
                                                            <span>{isEditing ? 'Fermer' : 'Modifier'}</span>
                                                        </button>
                                                        {!isEditing && (
                                                            <label className={styles.bookingStatusControl}>
                                                                <span>Changer le statut</span>
                                                                <select
                                                                    aria-label={`Changer le statut de la réservation de ${b.clientNom}`}
                                                                    disabled={isSaving}
                                                                    value={b.statut}
                                                                    onChange={e => handleUpdateBookingStatut(b._id, e.target.value as CharBookingStatut)}
                                                                >
                                                                    <option value="confirme">Confirmée</option>
                                                                    <option value="a_valider">À valider</option>
                                                                    <option value="liste_attente">Prévenir si une place se libère</option>
                                                                    <option value="annule">Annulée</option>
                                                                </select>
                                                            </label>
                                                        )}
                                                        <button type="button" aria-label={`Supprimer la réservation de ${b.clientNom}`} onClick={() => handleDeleteBooking(b._id)} className={styles.bookingDelete}>
                                                            <Trash2 size={15} aria-hidden="true" /> <span>Supprimer</span>
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
                                                                <select value={editBookingForm.statut ?? 'confirme'} onChange={e => { const statut = e.target.value as CharBookingStatut; setEditBookingForm(f => ({ ...f, statut, motifSuivi: statut === 'liste_attente' ? 'place_a_liberer' : statut === 'a_valider' ? (f.motifSuivi && f.motifSuivi !== 'place_a_liberer' ? f.motifSuivi : 'nombre_a_confirmer') : '' })); }}
                                                                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-abysse outline-none focus:ring-2 ring-abysse/10">
                                                                    <option value="confirme">Confirmé</option>
                                                                    <option value="a_valider">À valider</option>
                                                                    <option value="liste_attente">Prévenir si une place se libère</option>
                                                                    <option value="annule">Annulé</option>
                                                                </select>
                                                            </div>
                                                            {(editBookingForm.statut === 'a_valider' || editBookingForm.statut === 'liste_attente') && <div className="col-span-2">
                                                                <label className="text-[9px] font-black uppercase text-slate-400">Motif du suivi</label>
                                                                {editBookingForm.statut === 'liste_attente' ? <p className="mt-1 p-2 bg-amber-50 border border-amber-200 rounded-xl text-sm font-semibold text-amber-900">Prévenir le référent si une place se libère</p> : <select value={editBookingForm.motifSuivi || 'nombre_a_confirmer'} onChange={e => setEditBookingForm(f => ({ ...f, motifSuivi: e.target.value }))} className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-abysse outline-none focus:ring-2 ring-abysse/10">
                                                                    {FOLLOW_UP_REASONS.map(reason => <option key={reason.value} value={reason.value}>{reason.label}</option>)}
                                                                </select>}
                                                            </div>}
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-black uppercase text-slate-400">Notes internes</label>
                                                            <input type="text" placeholder="Observations..." value={editBookingForm.notes ?? ''} onChange={e => setEditBookingForm(f => ({ ...f, notes: e.target.value }))}
                                                                className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-sm text-abysse outline-none focus:ring-2 ring-abysse/10" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-black uppercase text-amber-800">À faire pour ce groupe</label>
                                                            <textarea aria-label={`À faire pour ${b.clientNom}`} rows={2} placeholder="Ex. Prévoir un char supplémentaire et rappeler pour confirmer l’accueil du groupe..." value={editBookingForm.todo ?? ''} onChange={e => setEditBookingForm(f => ({ ...f, todo: e.target.value, todoDone: false }))}
                                                                className="w-full mt-1 p-2 bg-white border border-amber-200 rounded-xl text-sm text-abysse outline-none focus:ring-2 ring-amber-100 resize-y" />
                                                            {!!editBookingForm.todo?.trim() && <label className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={editBookingForm.todoDone ?? false} onChange={e => setEditBookingForm(f => ({ ...f, todoDone: e.target.checked }))} /> Demande traitée</label>}
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
                            </>}
                        </div>
                    </div>
                )}
            </div>
            </div>}
                </div>
            </section>
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
                                                                    const reserved = reservedPlaces(s);
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

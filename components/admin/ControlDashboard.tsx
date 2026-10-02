"use client";

import { ArrowRight, Bell, CalendarDays, CheckCircle, ClipboardList, FileText, Monitor, Phone, RefreshCw, Ship, Footprints, AlertTriangle, Users, ListChecks, Zap, Binoculars, CloudSun } from 'lucide-react';
import { useState } from 'react';
import { useLiveStatus } from '@/contexts/LiveStatusContext';
import { expandAgendaEvents, parisToday, type AgendaSource } from '@/lib/editorial';
import { CharSessionDoc, PlanningMarche, SpotStatus, WeeklyPlanning } from '@/types';
import styles from './ControlDashboard.module.css';

export type ControlTab = 'HOME' | 'DASHBOARD' | 'CHAR' | 'COCKPIT' | 'STAGES' | 'FICHES' | 'PRICING' | 'MARCHE' | 'AGENDA' | 'SIGNAGE';
export type CharMode = 'reserve' | 'plan' | 'follow';
export type ControlAction = 'take-call' | 'new-session' | 'new-stage-week' | 'new-message' | 'new-article' | 'new-event' | 'new-slide' | 'new-marche-period';

interface Message { _id: string; title: string; category: string; isPinned: boolean; expiresAt?: string; publishedAt: string }
interface Props {
    plannings: WeeklyPlanning[];
    marchePlannings: PlanningMarche[];
    sessions: CharSessionDoc[];
    messages: Message[];
    articles: AgendaSource[];
    slides: { _id: string; isActive?: boolean }[];
    onNavigate: (tab: ControlTab, mode?: CharMode, planning?: WeeklyPlanning, sessionId?: string, bookingId?: string, date?: string) => void;
    onRefresh: () => Promise<void>;
    onAction: (action: ControlAction) => void;
}
interface Task { key: string; title: string; detail: string; tab: ControlTab; mode?: CharMode; planning?: WeeklyPlanning; sessionId?: string; bookingId?: string; urgent?: boolean }
const dateLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const reserved = (session: CharSessionDoc) => session.placesRestantes !== undefined ? session.capaciteMax - session.placesRestantes : session.placesReservees ?? 0;
const shortcuts = [
    { action: 'new-session', label: 'Créer une séance de char', detail: 'Renseigner l’horaire et les places', icon: Ship },
    { action: 'new-message', label: 'Rédiger une info Vigie', detail: 'Ouvrir un nouveau message', icon: Bell },
    { action: 'new-stage-week', label: 'Créer une semaine de stages', detail: 'Préparer un nouveau planning', icon: ClipboardList },
    { action: 'new-event', label: 'Ajouter un événement', detail: 'Ouvrir une nouvelle fiche agenda', icon: CalendarDays },
    { action: 'new-article', label: 'Rédiger un article', detail: 'Ouvrir l’éditeur du blog', icon: FileText },
    { action: 'new-slide', label: 'Créer une diapositive', detail: 'Préparer une information pour l’écran', icon: Monitor },
    { action: 'new-marche-period', label: 'Créer une période de marche', detail: 'Commencer un nouveau planning', icon: Footprints },
] satisfies { action: ControlAction; label: string; detail: string; icon: typeof Phone }[];

export default function ControlDashboard({ plannings, marchePlannings, sessions, messages, articles, slides, onNavigate, onRefresh, onAction }: Props) {
    const live = useLiveStatus();
    const [refreshing, setRefreshing] = useState(false);
    const [refreshError, setRefreshError] = useState('');
    const today = parisToday();
    const now = Date.now();
    const tomorrowDate = new Date(`${today}T12:00:00`);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = dateKey(tomorrowDate);
    const weekStartDate = new Date(`${today}T12:00:00`);
    weekStartDate.setDate(weekStartDate.getDate() - ((weekStartDate.getDay() + 6) % 7));
    const weekStart = dateKey(weekStartDate);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    const weekEnd = dateKey(weekEndDate);
    const upcoming = sessions.filter(session => session.actif !== false && session.date >= today).sort((a, b) => a.date.localeCompare(b.date) || a.heureDebut.localeCompare(b.heureDebut, 'fr', { numeric: true }));
    const todaySessions = upcoming.filter(session => session.date === today);
    const tomorrowSessions = upcoming.filter(session => session.date === tomorrow);
    const weekSessions = sessions.filter(session => session.actif !== false && session.date >= weekStart && session.date <= weekEnd);
    const todayReserved = todaySessions.reduce((total, session) => total + reserved(session), 0);
    const tomorrowReserved = tomorrowSessions.reduce((total, session) => total + reserved(session), 0);
    const weekReserved = weekSessions.reduce((total, session) => total + reserved(session), 0);
    const weekCapacity = weekSessions.reduce((total, session) => total + Math.max(0, session.capaciteMax), 0);
    const weekOccupancy = weekCapacity ? Math.round((weekReserved / weekCapacity) * 100) : null;
    const followUpSessions = sessions.filter(session => session.date >= today && (session.reservationsASuivre?.length ?? session.reservationsEnAttente ?? 0) > 0).sort((a, b) => a.date.localeCompare(b.date));
    const drafts = plannings.filter(planning => planning.endDate >= today && planning.isPublished !== true).sort((a, b) => a.startDate.localeCompare(b.startDate));
    const fullSessions = upcoming.filter(session => reserved(session) >= session.capaciteMax);
    const expiredPinned = messages.filter(message => message.isPinned && message.expiresAt && Date.parse(message.expiresAt) <= now);
    const activeMessages = messages.filter(message => (!message.expiresAt || Date.parse(message.expiresAt) > now) && (!message.publishedAt || Date.parse(message.publishedAt) <= now));
    const confirmation = live.lastConfirmedAt;
    const confirmationTime = confirmation ? Date.parse(confirmation) : Number.NaN;
    const staleCockpit = !live.isLoading && (!Number.isFinite(confirmationTime) || now - confirmationTime > 20 * 60 * 60 * 1000);
    const tasks: Task[] = [];
    upcoming.forEach(session => session.reservationTodos?.forEach(todo => tasks.push({ key: `reservation-todo-${todo._id}`, title: `Suivre la demande de ${todo.clientNom}`, detail: `Char à voile · ${dateLabel(session.date)} à ${session.heureDebut} · ${todo.nbPlaces} personne${todo.nbPlaces > 1 ? 's' : ''} · ${todo.todo}`, tab: 'CHAR', mode: 'follow', sessionId: session._id, bookingId: todo._id, urgent: true })));
    followUpSessions.forEach(session => {
        if (session.reservationsASuivre?.length) {
            session.reservationsASuivre.forEach(booking => tasks.push({
                key: `booking-follow-up-${booking._id}`,
                title: booking.statut === 'liste_attente' ? `Prévenir ${booking.clientNom} si une place se libère` : booking.motifSuivi === 'surbooking_a_regulariser' ? `Régulariser le surbooking de ${booking.clientNom}` : `Valider la réservation de ${booking.clientNom}`,
                detail: `${dateLabel(session.date)} à ${session.heureDebut} · ${booking.nbPlaces} personne${booking.nbPlaces > 1 ? 's' : ''}${session.actif === false ? ' · séance inactive' : ''}.`,
                tab: 'CHAR', mode: 'follow', sessionId: session._id, bookingId: booking._id, urgent: true
            }));
        } else {
            tasks.push({ key: `waiting-${session._id}`, title: `Examiner les réservations à suivre du ${dateLabel(session.date)}`, detail: `${session.heureDebut} · ${session.reservationsEnAttente} dossier${(session.reservationsEnAttente ?? 0) > 1 ? 's' : ''} à traiter.`, tab: 'CHAR', mode: 'follow', sessionId: session._id, urgent: true });
        }
    });
    drafts.filter(planning => planning.days?.some(day => day.stageSlots?.length)).forEach(planning => tasks.push({ key: planning._id || planning.startDate, title: `Publier le planning : ${planning.title}`, detail: `Du ${dateLabel(planning.startDate)} au ${dateLabel(planning.endDate)} · non publié`, tab: 'STAGES', planning }));
    if (expiredPinned.length) tasks.push({ key: 'messages', title: 'Revoir les messages épinglés expirés', detail: `${expiredPinned.length} message${expiredPinned.length > 1 ? 's' : ''} arrivé${expiredPinned.length > 1 ? 's' : ''} à expiration.`, tab: 'DASHBOARD' });
    const events = expandAgendaEvents(articles, today).slice(0, 4);
    const statusAlerts = [
        { label: 'Char à voile', status: live.charStatus, message: live.charMessage },
        { label: 'Marche aquatique', status: live.marcheStatus, message: live.marcheMessage },
        { label: 'Activités nautiques', status: live.nautiqueStatus, message: live.nautiqueMessage },
    ].filter(activity => [SpotStatus.CRITICAL, SpotStatus.COMPROMISED, SpotStatus.CLOSED, SpotStatus.RESTRICTED].includes(activity.status));
    const futureMarche = marchePlannings.flatMap(planning => (planning.weeks || []).flatMap(week => (week.days || []).flatMap(day => (day.sessions || []).map(session => ({ date: day.date, time: session.time, key: `${planning._id}-${day._key}-${session._key}` }))))).filter(session => session.date >= today).sort((a, b) => a.date.localeCompare(b.date));

    async function refresh() {
        setRefreshing(true); setRefreshError('');
        try { await Promise.all([onRefresh(), live.refreshData()]); }
        catch { setRefreshError('Actualisation impossible. Réessayez.'); }
        finally { setRefreshing(false); }
    }
    return (
        <div className={styles.root}>
            <header data-admin-page-header className={styles.heading}>
                <div className={styles.headingIdentity}><div><h1 data-admin-page-title>Tableau de bord</h1><p data-admin-page-description>{new Date(`${today}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p></div></div>
                <div className={styles.headerActions}><button type="button" className={styles.refresh} disabled={refreshing} onClick={refresh}><RefreshCw size={16} />{refreshing ? 'Actualisation…' : 'Actualiser'}</button><button type="button" className={styles.primary} onClick={() => onNavigate('CHAR', 'reserve')}><Phone size={18} />Prendre un appel</button></div>
            </header>
            {refreshError && <p role="alert">{refreshError}</p>}
            <div className={styles.metrics} role="group" aria-label="Indicateurs des réservations">
                <button type="button" className={styles.conditionsMetric} data-due={staleCockpit} data-loading={live.isLoading} onClick={() => onNavigate('COCKPIT')}>
                    <span className={styles.metricIcon} aria-hidden="true">{staleCockpit ? <AlertTriangle size={22} /> : <CloudSun size={22} />}</span>
                    <span className={styles.metricLabel}>Conditions du jour</span>
                    <strong>{live.isLoading ? '…' : staleCockpit ? 'À vérifier' : 'À jour'}</strong>
                    <small>{staleCockpit ? 'Mettre à jour le Cockpit' : 'Confirmation effectuée'} <ArrowRight size={13} /></small>
                </button>
                <button type="button" onClick={() => onNavigate('CHAR', 'plan', undefined, undefined, undefined, today)}><span className={styles.metricIcon} aria-hidden="true"><Ship size={22} /></span><span className={styles.metricLabel}>Séances aujourd’hui</span><strong>{todaySessions.length}</strong><small>Voir le planning <ArrowRight size={13} /></small></button>
                <button type="button" onClick={() => onNavigate('CHAR', 'follow', undefined, undefined, undefined, today)}><span className={styles.metricIcon} aria-hidden="true"><Users size={22} /></span><span className={styles.metricLabel}>Places réservées aujourd’hui</span><strong>{todayReserved}</strong><small>Suivre les réservations <ArrowRight size={13} /></small></button>
                <button type="button" onClick={() => onNavigate('CHAR', 'follow', undefined, undefined, undefined, tomorrow)}><span className={styles.metricIcon} aria-hidden="true"><CalendarDays size={22} /></span><span className={styles.metricLabel}>Places réservées demain</span><strong>{tomorrowReserved}</strong><small>{tomorrowSessions.length} séance{tomorrowSessions.length > 1 ? 's' : ''} prévue{tomorrowSessions.length > 1 ? 's' : ''} <ArrowRight size={13} /></small></button>
                <button type="button" onClick={() => onNavigate('CHAR', 'plan', undefined, undefined, undefined, today)}><span className={styles.metricIcon} aria-hidden="true"><CalendarDays size={22} /></span><span className={styles.metricLabel}>Taux de réservation cette semaine</span><strong>{weekOccupancy === null ? '—' : `${weekOccupancy}%`}</strong><small>{weekCapacity ? `${weekReserved} / ${weekCapacity} places · ${dateLabel(weekStart)}–${dateLabel(weekEnd)}` : 'Aucune séance prévue'} <ArrowRight size={13} /></small></button>
            </div>
            <div className={styles.layout}>
                <div className={styles.main}>
                    <section id="control-tasks" className={styles.panel}>
                        <div className={styles.sectionHeading}><h2><ListChecks size={21} aria-hidden="true" />À faire</h2><span className={styles.count}>{tasks.length} point{tasks.length > 1 ? 's' : ''}</span></div>
                        {tasks.length ? <ul className={styles.list}>{tasks.map(task => <li key={task.key}><button type="button" className={styles.task} onClick={() => onNavigate(task.tab, task.mode, task.planning, task.sessionId, task.bookingId)}><span className={task.urgent ? styles.urgent : styles.dot} aria-hidden="true">{task.planning ? <CalendarDays size={19} /> : <AlertTriangle size={19} />}</span><span className={styles.rowText}><strong>{task.title}</strong><small>{task.detail}</small></span><ArrowRight size={17} /></button></li>)}</ul> : <p className={styles.empty}><CheckCircle size={20} />Aucun point à traiter détecté dans les données disponibles.</p>}
                    </section>
                    <section className={styles.panel}>
                        <div className={styles.sectionHeading}><h2><Ship size={21} aria-hidden="true" />Prochaines séances de char</h2><button type="button" onClick={() => onNavigate('CHAR', 'plan')}>Planning <ArrowRight size={15} /></button></div>
                        {upcoming.length ? <div className={styles.tableWrap}><table><thead><tr><th>Date</th><th>Horaire</th><th>Réservées</th><th>Disponibles</th><th>Remplissage</th></tr></thead><tbody>{upcoming.slice(0, 6).map(session => {
                            const count = reserved(session); const remaining = Math.max(0, session.capaciteMax - count);
                            return <tr key={session._id}><td>{session.date === today ? 'Aujourd’hui' : dateLabel(session.date)}</td><td>{session.heureDebut} – {session.heureFin}</td><td>{count} / {session.capaciteMax}</td><td><span className={remaining === 0 ? styles.full : ''}>{remaining === 0 ? 'Complet' : remaining}</span></td><td><div className={styles.occupancy}><meter min={0} max={Math.max(1, session.capaciteMax)} value={count} aria-label={`Remplissage du ${dateLabel(session.date)} à ${session.heureDebut}`} /><button type="button" aria-label={`Voir les réservations du ${dateLabel(session.date)} à ${session.heureDebut}`} onClick={() => onNavigate('CHAR', 'follow', undefined, session._id)}><ArrowRight size={16} /></button></div></td></tr>;
                        })}</tbody></table></div> : <div className={styles.empty}><CalendarDays size={20} /><span>Aucune séance de char à venir.</span><button type="button" onClick={() => onNavigate('CHAR', 'plan')}>Préparer le planning <ArrowRight size={15} /></button></div>}
                    </section>
                    <section className={styles.panel}>
                        <div className={styles.sectionHeading}><h2><CalendarDays size={21} aria-hidden="true" />À préparer</h2><span>Prochaines échéances</span></div>
                        <ul className={styles.list}>
                            {plannings.filter(planning => planning.endDate >= today && planning.isPublished === true).sort((a, b) => a.startDate.localeCompare(b.startDate)).slice(0, 2).map(planning => <li key={planning._id || planning.startDate}><button type="button" className={styles.task} onClick={() => onNavigate('STAGES', undefined, planning)}><CalendarDays size={18} /><span className={styles.rowText}><strong>{planning.title}</strong><small>Stages · du {dateLabel(planning.startDate)} au {dateLabel(planning.endDate)} · publié</small></span><ArrowRight size={16} /></button></li>)}
                            {events.map(event => <li key={event._key}><button type="button" className={styles.task} onClick={() => onNavigate('AGENDA')}><FileText size={18} /><span className={styles.rowText}><strong>{event.title || 'Événement'}</strong><small>Agenda · {dateLabel(event.startDate)} {event.time}</small></span><ArrowRight size={16} /></button></li>)}
                            {futureMarche.slice(0, 2).map(session => <li key={session.key}><button type="button" className={styles.task} onClick={() => onNavigate('MARCHE')}><Footprints size={18} /><span className={styles.rowText}><strong>Marche aquatique</strong><small>{dateLabel(session.date)} · {session.time}</small></span><ArrowRight size={16} /></button></li>)}
                        </ul>
                        {!events.length && !futureMarche.length && !plannings.some(planning => planning.endDate >= today && planning.isPublished === true) && <p className={styles.empty}>Aucune échéance publiée à venir dans les stages, la marche ou l’agenda.</p>}
                    </section>
                </div>
                <aside className={styles.rail}>
                    <section className={`${styles.panel} ${styles.actionPanel}`}><div className={styles.sectionHeading}><h2><Zap size={21} aria-hidden="true" />Actions rapides</h2></div><ul className={styles.list}>{shortcuts.map(shortcut => <li key={shortcut.action}><button type="button" className={styles.shortcut} onClick={() => onAction(shortcut.action)}><span className={styles.actionIcon} aria-hidden="true"><shortcut.icon size={20} /></span><span className={styles.rowText}><strong>{shortcut.label}</strong><small>{shortcut.detail}</small></span><ArrowRight size={15} /></button></li>)}</ul></section>
                    <section className={styles.panel}><div className={styles.sectionHeading}><h2><Binoculars size={21} aria-hidden="true" />À surveiller</h2></div><ul className={styles.list}>
                        {statusAlerts.map(activity => <li key={activity.label}><button type="button" className={styles.task} onClick={() => onNavigate('COCKPIT')}><AlertTriangle size={18} /><span className={styles.rowText}><strong>{activity.label}</strong><small>{activity.message || 'Statut restreint ou défavorable à vérifier.'}</small></span><ArrowRight size={15} /></button></li>)}
                        <li><button type="button" className={styles.watch} onClick={() => onNavigate('CHAR', 'follow')}><span>Séances de char complètes à venir</span><strong>{fullSessions.length}</strong><ArrowRight size={15} /></button></li>
                        <li><button type="button" className={styles.watch} onClick={() => onNavigate('DASHBOARD')}><span>Messages Vigie en cours</span><strong>{activeMessages.length}</strong><ArrowRight size={15} /></button></li>
                        <li><button type="button" className={styles.watch} onClick={() => onNavigate('SIGNAGE')}><span>Diapositives personnalisées actives</span><strong>{slides.filter(slide => slide.isActive).length}</strong><ArrowRight size={15} /></button></li>
                    </ul></section>
                </aside>
            </div>
        </div>
    );
}

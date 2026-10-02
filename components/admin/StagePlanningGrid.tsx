"use client";

import { useState, type CSSProperties } from 'react';
import type { ActivityType, StageDefinition, StageSlot, WeeklyPlanning } from '@/types';
import styles from './StagePlanningGrid.module.css';

function minutes(value: string): number | null {
    const text = value.trim();
    const match = text.match(/^(\d{1,2})(?:[h:](\d{0,2}))?$/i);
    const compact = text.match(/^(\d{1,2})(\d{2})$/);
    const parts = match || compact;
    if (!parts) return null;
    const h = Number(parts[1]), m = Number(parts[2] || 0);
    return h < 24 && m < 60 ? h * 60 + m : null;
}

const timeLabel = (value: number) => `${String(Math.floor(value / 60)).padStart(2, '0')}h${String(value % 60).padStart(2, '0')}`;
function durationOf(slot: StageSlot | undefined, stage: StageDefinition) {
    const [start, end] = (slot?.time || '').split(' - ').map(minutes);
    return start != null && end != null && end > start ? end - start : stage.planningType === 'kid' ? 120 : 180;
}
const range = (start: number, duration: number) => `${timeLabel(start)} - ${timeLabel(start + duration)}`;

function hasTime(slot: StageSlot | undefined) {
    return minutes((slot?.time || '').split(' - ')[0]) !== null;
}

function HourInput({ value, label, onCommit }: { value: string; label: string; onCommit: (value: number | null) => boolean }) {
    const [draft, setDraft] = useState(value);
    const [error, setError] = useState('');
    return <div className="min-w-0 flex-1">
        <input type="text" inputMode="numeric" aria-label={label} aria-invalid={!!error}
            value={draft} placeholder="09h30" onFocus={e => e.target.select()}
            onChange={e => { setDraft(e.target.value); setError(''); }}
            onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
                if (e.key === 'Escape') { setDraft(value); setError(''); }
            }}
            onBlur={() => {
                const parsed = draft.trim() ? minutes(draft) : null;
                if (draft.trim() && parsed === null) { setError('Heure invalide : ex. 930 ou 09h30'); return; }
                if (!onCommit(parsed)) { setError('Le créneau doit finir avant minuit.'); return; }
                setDraft(parsed === null ? '' : timeLabel(parsed));
                setError('');
            }}
            className={`w-full rounded-lg border bg-white px-2 py-2 text-sm font-bold text-abysse outline-none focus:border-turquoise ${error ? 'border-red-500' : 'border-slate-200'}`} />
        {error && <span role="alert" className="block text-xs text-red-600">{error}</span>}
    </div>;
}

interface Props {
    planning: WeeklyPlanning;
    stages: StageDefinition[];
    activities: { label: string; value: ActivityType }[];
    onChange: (planning: WeeklyPlanning) => void;
}

export default function StagePlanningGrid({ planning, stages, activities, onChange }: Props) {
    const [bulkDay, setBulkDay] = useState<string | null>(null);
    const [groups, setGroups] = useState<string[]>([]);
    const [bulkHour, setBulkHour] = useState('');
    const [message, setMessage] = useState('');
    const [onlyScheduled, setOnlyScheduled] = useState(false);
    const stageRows = stages.map(stage => ({
        stage,
        count: planning.days.filter(day => hasTime(day.stageSlots?.find(slot => slot.stageKey === stage.key))).length,
    }));
    const scheduledRows = stageRows.filter(row => row.count > 0);
    const slotCount = scheduledRows.reduce((total, row) => total + row.count, 0);
    const visibleRows = stageRows.filter(row => !onlyScheduled || row.count > 0);
    const dayForBulk = planning.days.find(day => day._key === bulkDay);
    const columns = { '--stage-day-count': planning.days.length } as CSSProperties;

    function updateSlot(dayKey: string, stage: StageDefinition, updates: Partial<StageSlot>) {
        onChange({ ...planning, days: planning.days.map(day => {
            if (day._key !== dayKey) return day;
            const existing = day.stageSlots?.find(slot => slot.stageKey === stage.key);
            const next = { ...(existing || { _key: `slot-${stage.key}-${Date.now()}`, stageKey: stage.key }), ...updates };
            return { ...day, stageSlots: existing ? day.stageSlots.map(slot => slot.stageKey === stage.key ? next : slot) : [...(day.stageSlots || []), next] };
        }) });
    }

    function applyBulk() {
        const start = minutes(bulkHour);
        if (start === null || !dayForBulk || !groups.length) { setMessage('Choisissez les groupes et une heure valide.'); return; }
        const selected = stages.filter(stage => groups.includes(stage.key));
        if (selected.some(stage => start + durationOf(dayForBulk.stageSlots?.find(slot => slot.stageKey === stage.key), stage) >= 1440)) {
            setMessage('Un des créneaux finirait après minuit. Aucun horaire modifié.'); return;
        }
        const slots = [...(dayForBulk.stageSlots || [])];
        selected.forEach(stage => {
            const index = slots.findIndex(slot => slot.stageKey === stage.key);
            const existing = slots[index];
            const next = { ...(existing || { _key: `slot-${stage.key}-${Date.now()}`, stageKey: stage.key }), time: range(start, durationOf(existing, stage)) };
            if (index < 0) slots.push(next); else slots[index] = next;
        });
        onChange({ ...planning, days: planning.days.map(day => day._key === bulkDay ? { ...day, stageSlots: slots } : day) });
        setMessage(`${selected.length} groupe(s) à ${timeLabel(start)} le ${dayForBulk.name.toLowerCase()}. Durées conservées. Pensez à enregistrer.`);
    }

    return <div className={`${styles.root} space-y-4`}>
        <section aria-label="Résumé des créneaux" className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-turquoise/30 bg-turquoise/10 p-4">
            <div>
                <p className="text-sm font-bold text-abysse">{scheduledRows.length ? `${scheduledRows.length} groupe${scheduledRows.length > 1 ? 's' : ''} programmé${scheduledRows.length > 1 ? 's' : ''} · ${slotCount} créneau${slotCount > 1 ? 'x' : ''} cette semaine` : 'Aucun créneau programmé cette semaine'}</p>
                <p className="mt-1 text-xs text-abysse/75">{scheduledRows.length ? scheduledRows.map(({ stage }) => stage.label).join(' · ') : 'Renseignez une heure de début pour programmer un groupe.'}</p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-abysse">
                <input type="checkbox" checked={onlyScheduled} onChange={e => setOnlyScheduled(e.target.checked)} className="size-4 accent-turquoise" />
                Groupes programmés uniquement
            </label>
        </section>
        <p className="text-xs text-slate-500">Saisissez 930 pour 09h30, puis Tab. La durée est conservée. « Horaire commun » permet de modifier plusieurs groupes d’une journée.</p>
        {dayForBulk && <section className="rounded-2xl border border-turquoise/30 bg-turquoise/5 p-4 space-y-3" aria-label="Horaire commun">
            <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-abysse">Horaire commun · {dayForBulk.name} {new Date(dayForBulk.date).toLocaleDateString('fr-FR')}</h3>
                <button type="button" onClick={() => setBulkDay(null)} className="text-sm underline">Fermer</button>
            </div>
            <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setGroups(groups.length === stages.length ? [] : stages.map(stage => stage.key))} className="px-3 py-2 text-xs font-bold underline">{groups.length === stages.length ? 'Tout désélectionner' : 'Tous les groupes'}</button>
                {stages.map(stage => <label key={stage.key} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={groups.includes(stage.key)} onChange={e => setGroups(e.target.checked ? [...groups, stage.key] : groups.filter(key => key !== stage.key))} className="accent-turquoise" />{stage.label}
                </label>)}
            </div>
            <div className="flex flex-wrap items-end gap-3">
                <label className="text-xs font-bold text-abysse">Heure de début
                    <input value={bulkHour} onChange={e => { setBulkHour(e.target.value); setMessage(''); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyBulk(); } }} inputMode="numeric" placeholder="09h30" className="block mt-1 w-28 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
                </label>
                <button type="button" disabled={!groups.length || minutes(bulkHour) === null} onClick={applyBulk} className="rounded-lg bg-abysse px-4 py-2 text-sm font-bold text-white disabled:opacity-40">Appliquer à {groups.length} groupe(s)</button>
            </div>
            <p className="text-xs text-slate-500">Chaque groupe garde sa durée et son activité. Un créneau vide prend la durée habituelle du groupe.</p>
            <p role="status" className="text-sm font-medium text-abysse">{message}</p>
        </section>}
        <div className={`${styles.table} rounded-xl border border-slate-200`} style={columns}>
            <div className={`${styles.header} bg-slate-50`}>
                <div className="bg-slate-50 p-2 text-xs font-bold text-slate-500">Groupe / Jour</div>
                {planning.days.map(day => <div key={day._key} className="min-w-0 border-l border-slate-200 p-2">
                    <div className="text-sm font-bold text-abysse">{day.name}</div>
                    <div className="text-xs text-slate-500">{new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                    <button type="button" onClick={() => { setBulkDay(day._key); setGroups([]); setBulkHour(''); setMessage(''); }} className="mt-2 text-xs font-bold text-abysse underline">Horaire commun</button>
                </div>)}
            </div>
            {visibleRows.map(({ stage, count }) => <div key={stage.key} className={`${styles.row} border-t ${count ? 'border-turquoise/30' : 'border-slate-200'}`}>
                <div className={`${styles.group} flex flex-col justify-center gap-2 border-l-4 p-3 ${count ? 'border-turquoise bg-[#e6f6fa] text-abysse' : 'border-transparent bg-slate-50 text-slate-500'}`}>
                    <span className="text-sm font-bold">{stage.label}</span>
                    {count > 0 && <span className="text-xs font-semibold text-abysse">{count} créneau{count > 1 ? 'x' : ''}</span>}
                </div>
                {planning.days.map(day => {
                    const slot = day.stageSlots?.find(item => item.stageKey === stage.key);
                    const duration = durationOf(slot, stage);
                    const startText = (slot?.time || '').split(' - ')[0];
                    const start = minutes(startText);
                    const raids = (day.raidStageKey || '').split(',').filter(Boolean);
                    const isRaid = raids.includes(stage.key);
                    const durations = [...new Set([60, 90, 120, 150, 180, 210, 240, 300, 360, 420, duration])].sort((a, b) => a - b);
                    return <div key={day._key} className={`${styles.cell} space-y-2 p-2 ${isRaid ? 'border-orange-200 bg-orange-50' : start !== null ? 'border-turquoise/30 bg-turquoise/5' : 'border-slate-200 bg-slate-50/60'}`}>
                        <div className={styles.dayLabel}>
                            <div className="text-sm font-bold text-abysse">{day.name} <span className="text-xs font-normal text-slate-500">{new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span></div>
                            <button type="button" onClick={() => { setBulkDay(day._key); setGroups([]); setBulkHour(''); setMessage(''); }} className="mt-1 text-xs font-bold text-abysse underline">Horaire commun</button>
                        </div>
                        <div className={styles.hourControls}>
                            <HourInput key={slot?.time || 'empty'} value={startText} label={`Début ${stage.label}, ${day.name}`} onCommit={value => {
                                if (value !== null && value + duration >= 1440) return false;
                                updateSlot(day._key, stage, { time: value === null ? '' : range(value, duration) }); return true;
                            }} />
                            <select aria-label={`Durée ${stage.label}, ${day.name}`} value={duration} disabled={start === null}
                                onChange={e => { if (start !== null) updateSlot(day._key, stage, { time: range(start, Number(e.target.value)) }); }}
                                className="min-w-0 w-full rounded-lg border border-turquoise/20 bg-turquoise/10 px-1 py-2 text-xs font-bold text-abysse disabled:opacity-40">
                                {durations.map(value => <option key={value} value={value} disabled={start !== null && start + value >= 1440}>{Math.floor(value / 60)}h{value % 60 ? String(value % 60).padStart(2, '0') : ''}</option>)}
                            </select>
                        </div>
                        {start !== null && <div className="text-sm font-bold tabular-nums text-abysse">{slot?.time}</div>}
                        <select aria-label={`Activité ${stage.label}, ${day.name}`} value={slot?.activity || ''} onChange={e => updateSlot(day._key, stage, { activity: (e.target.value || undefined) as ActivityType | undefined })} className="min-w-0 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs">
                            <option value="">Activité…</option>
                            {activities.map(activity => <option key={activity.value} value={activity.value}>{activity.label}</option>)}
                        </select>
                        <label className="flex items-center gap-2 py-1 text-xs text-slate-500"><input type="checkbox" checked={isRaid} className="accent-orange-500" onChange={e => {
                            const next = e.target.checked ? [...raids, stage.key] : raids.filter(key => key !== stage.key);
                            onChange({ ...planning, days: planning.days.map(item => item._key === day._key ? { ...item, raidStageKey: next.join(','), isRaidDay: next.length > 0 } : item) });
                        }} />Raid</label>
                    </div>;
                })}
            </div>)}
            {onlyScheduled && visibleRows.length === 0 && <p className="p-6 text-center text-sm text-slate-500">Aucun groupe programmé. Décochez le filtre pour renseigner des créneaux.</p>}
        </div>
    </div>;
}

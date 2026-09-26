"use client";

import { useState } from 'react';
import type { ActivityType, StageDefinition, StageSlot, WeeklyPlanning } from '@/types';

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
    const dayForBulk = planning.days.find(day => day._key === bulkDay);
    const columns = { gridTemplateColumns: `160px repeat(${planning.days.length}, minmax(160px, 1fr))` };

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

    return <div className="space-y-4">
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
        <div className="overflow-x-auto rounded-xl border border-slate-200">
            <div className="grid bg-slate-50" style={columns}>
                <div className="sticky left-0 z-10 bg-slate-50 p-3 text-xs font-bold text-slate-500">Groupe / Jour</div>
                {planning.days.map(day => <div key={day._key} className="border-l border-slate-200 p-3">
                    <div className="font-bold text-abysse">{day.name}</div>
                    <div className="text-xs text-slate-500">{new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                    <button type="button" onClick={() => { setBulkDay(day._key); setGroups([]); setBulkHour(''); setMessage(''); }} className="mt-2 text-xs font-bold text-abysse underline">Horaire commun</button>
                </div>)}
            </div>
            {stages.map(stage => <div key={stage.key} className="grid border-t border-slate-200" style={columns}>
                <div className="sticky left-0 z-10 flex items-center bg-slate-50 p-3 text-xs font-bold text-abysse">{stage.label}</div>
                {planning.days.map(day => {
                    const slot = day.stageSlots?.find(item => item.stageKey === stage.key);
                    const duration = durationOf(slot, stage);
                    const startText = (slot?.time || '').split(' - ')[0];
                    const start = minutes(startText);
                    const raids = (day.raidStageKey || '').split(',').filter(Boolean);
                    const isRaid = raids.includes(stage.key);
                    const durations = [...new Set([60, 90, 120, 150, 180, 210, 240, 300, 360, 420, duration])].sort((a, b) => a - b);
                    return <div key={day._key} className={`space-y-2 border-l border-slate-200 p-2 ${isRaid ? 'bg-orange-50' : 'bg-white'}`}>
                        <div className="flex items-start gap-1">
                            <HourInput key={slot?.time || 'empty'} value={startText} label={`Début ${stage.label}, ${day.name}`} onCommit={value => {
                                if (value !== null && value + duration >= 1440) return false;
                                updateSlot(day._key, stage, { time: value === null ? '' : range(value, duration) }); return true;
                            }} />
                            <select aria-label={`Durée ${stage.label}, ${day.name}`} value={duration} disabled={start === null}
                                onChange={e => { if (start !== null) updateSlot(day._key, stage, { time: range(start, Number(e.target.value)) }); }}
                                className="w-20 rounded-lg border border-turquoise/20 bg-turquoise/10 px-1 py-2 text-xs font-bold text-abysse disabled:opacity-40">
                                {durations.map(value => <option key={value} value={value} disabled={start !== null && start + value >= 1440}>{Math.floor(value / 60)}h{value % 60 ? String(value % 60).padStart(2, '0') : ''}</option>)}
                            </select>
                        </div>
                        <div className="min-h-4 text-xs font-semibold text-slate-500">{start !== null ? slot?.time : 'Pas de créneau'}</div>
                        <select aria-label={`Activité ${stage.label}, ${day.name}`} value={slot?.activity || ''} onChange={e => updateSlot(day._key, stage, { activity: (e.target.value || undefined) as ActivityType | undefined })} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs">
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
        </div>
    </div>;
}

"use client";

import React, { useState, useEffect } from 'react';
import { useLiveStatus } from '@/contexts/LiveStatusContext';
import { Check, Loader2, Save, Pencil, Undo2, CheckCircle2, AlertTriangle, XCircle, MinusCircle } from 'lucide-react';
import styles from './CockpitClient.module.css';


// ─── Types ────────────────────────────────────────────────────────
type StatusKey = 'OPEN' | 'RESTRICTED' | 'CLOSED' | 'INACTIVE';

const STATUS_GRIDS = {
    stage: [
        { id: 'OPEN', label: 'Confirmée', short: 'OK', activeBg: 'bg-emerald-500 text-white border-emerald-400' },
        { id: 'RESTRICTED', label: 'Cond. techniques', short: '~', activeBg: 'bg-amber-400 text-slate-900 border-amber-300' },
        { id: 'CLOSED', label: 'Annulée', short: '✕', activeBg: 'bg-rose-500 text-white border-rose-400' },
        { id: 'INACTIVE', label: 'Hors Période', short: '—', activeBg: 'bg-slate-400 text-white border-slate-300' },
    ],
    autonome_voile: [
        { id: 'OPEN', label: 'Favorables', short: 'OK', activeBg: 'bg-emerald-500 text-white border-emerald-400' },
        { id: 'RESTRICTED', label: 'Techniques (Exp.)', short: '~', activeBg: 'bg-amber-400 text-slate-900 border-amber-300' },
        { id: 'CLOSED', label: 'Déconseillée', short: '✕', activeBg: 'bg-rose-500 text-white border-rose-400' },
    ],
    marche: [
        { id: 'OPEN', label: 'Confirmée', short: 'OK', activeBg: 'bg-emerald-500 text-white border-emerald-400' },
        { id: 'RESTRICTED', label: 'Parcours adapté', short: '~', activeBg: 'bg-amber-400 text-slate-900 border-amber-300' },
        { id: 'CLOSED', label: 'Reportée', short: '✕', activeBg: 'bg-rose-500 text-white border-rose-400' },
        { id: 'INACTIVE', label: 'Pas de séance', short: '—', activeBg: 'bg-slate-400 text-white border-slate-300' },
    ],
    char: [
        { id: 'OPEN', label: 'Confirmée', short: 'OK', activeBg: 'bg-emerald-500 text-white border-emerald-400' },
        { id: 'RESTRICTED', label: 'Cond. techniques', short: '~', activeBg: 'bg-amber-400 text-slate-900 border-amber-300' },
        { id: 'CLOSED', label: 'Annulée', short: '✕', activeBg: 'bg-rose-500 text-white border-rose-400' },
    ],
};

// Activités fixes (non-stages) — ne changent jamais
const FIXED_ACTIVITIES = [
    { key: 'nautique', label: 'Sports Nautiques', statusField: 'nautiqueStatus', msgField: 'nautiqueMessage', grid: 'autonome_voile' as const },
    { key: 'char', label: 'Char à Voile', statusField: 'charStatus', msgField: 'charMessage', grid: 'char' as const },
    { key: 'marche', label: 'Marche Aquatique', statusField: 'marcheStatus', msgField: 'marcheMessage', grid: 'marche' as const },
];

const LANES = [
    { id: 'OPEN' as const, label: 'Maintenu', sub: 'Pratique ou séance confirmée', hotkey: '1', tone: 'open', Icon: CheckCircle2 },
    { id: 'RESTRICTED' as const, label: 'Adapté', sub: 'Conditions techniques, parcours ajusté', hotkey: '2', tone: 'restricted', Icon: AlertTriangle },
    { id: 'CLOSED' as const, label: 'Annulé', sub: 'Déconseillé, reporté ou annulé', hotkey: '3', tone: 'closed', Icon: XCircle },
    { id: 'INACTIVE' as const, label: 'Hors période', sub: "Pas programmé aujourd'hui", hotkey: '4', tone: 'inactive', Icon: MinusCircle },
];

const STAGE_SUGGESTIONS: Record<string, Record<string, string[]>> = {
    default: {
        OPEN: ["Séance maintenue dans de bonnes conditions.", "Conditions adaptées, séance confirmée."],
        RESTRICTED: ["Conditions dynamiques, adaptation prévue.", "Vent soutenu, séance technique."],
        CLOSED: ["Conditions incompatibles avec la sécurité.", "Vent inadapté, séance annulée."],
        INACTIVE: ["Stage hors période."],
    },
    'mini-mousses': {
        OPEN: ["Séance maintenue dans de bonnes conditions.", "Conditions adaptées au groupe."],
        RESTRICTED: ["Vent soutenu, encadrement renforcé.", "Séance adaptée aux conditions du jour."],
        CLOSED: ["Conditions non adaptées aux enfants.", "Sécurité non garantie aujourd'hui."],
        INACTIVE: ["Hors période Mini-Mousses."],
    },
    multiglisse: {
        OPEN: ["Conditions favorables, programme maintenu."],
        RESTRICTED: ["Support adapté aux conditions du jour."],
        CLOSED: ["Conditions inadaptées, stage annulé."],
        INACTIVE: ["Stage Multiglisse hors période."],
    },
    kite: {
        OPEN: ["Vent favorable, séance maintenue."],
        RESTRICTED: ["Vent limite, adaptation du programme."],
        CLOSED: ["Vent inadapté (trop fort ou insuffisant)."],
        INACTIVE: ["Stage Kite hors période."],
    },
};

const FIXED_SUGGESTIONS: Record<string, Record<string, string[]>> = {
    nautique: {
        OPEN: ["Conditions favorables, sortie libre.", "Plan d'eau calme."],
        RESTRICTED: ["Vent soutenu, pratiquants expérimentés uniquement."],
        CLOSED: ["Sortie déconseillée aujourd'hui."],
    },
    char: {
        OPEN: ["Conditions favorables, séance maintenue.", "Vent régulier, activité confirmée."],
        RESTRICTED: ["Vent soutenu, séance dynamique.", "Conditions techniques, adaptation prévue."],
        CLOSED: ["Vent insuffisant aujourd'hui.", "Vent trop fort pour naviguer en sécurité."],
    },
    marche: {
        OPEN: ["Parcours maintenu.", "Conditions favorables pour la marche."],
        RESTRICTED: ["Itinéraire ajusté selon les conditions.", "Parcours abrité privilégié."],
        CLOSED: ["Conditions météo défavorables.", "Sortie annulée par précaution."],
        INACTIVE: ["Pas de séance aujourd'hui."],
    },
};

export default function CockpitClient({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void }) {
    const content = useLiveStatus();
    const { stageDefinitions, stageStatuses } = content;

    const [editingMsg, setEditingMsg] = useState<string | null>(null);
    const [localMsg, setLocalMsg] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(timer); }, []);
    const [toast, setToast] = useState<string | null>(null);
    const [lastConfirmedAt, setLastConfirmedAt] = useState<string | null>(content.lastConfirmedAt || null);

    useEffect(() => {
        if (content.lastConfirmedAt) setLastConfirmedAt(content.lastConfirmedAt);
    }, [content.lastConfirmedAt]);

    const hoursSinceConfirm = lastConfirmedAt
        ? (now - new Date(lastConfirmedAt).getTime()) / 3600000
        : null;
    const needsConfirm = hoursSinceConfirm === null || hoursSinceConfirm > 20;
    const baseActivities = [
        ...FIXED_ACTIVITIES.map(activity => ({
            key: activity.key, label: activity.label, group: 'Pratiques & activités',
            status: (content as any)[activity.statusField] || 'OPEN',
            message: (content as any)[activity.msgField] || '', grid: STATUS_GRIDS[activity.grid],
            suggestions: FIXED_SUGGESTIONS[activity.key],
        })),
        ...stageDefinitions.map(stage => ({
            key: 'stage-' + stage.key, label: stage.label, group: 'Stages école de voile',
            status: stageStatuses[stage.key]?.status || 'OPEN',
            message: stageStatuses[stage.key]?.message || '', grid: STATUS_GRIDS.stage,
            suggestions: STAGE_SUGGESTIONS[stage.key] || STAGE_SUGGESTIONS.default,
        })),
    ];


    // ─── Brouillon : rien n'est publié avant validation ────────────
    const [draft, setDraft] = useState<Record<string, { status?: string; message?: string }>>({});
    const [publishing, setPublishing] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [dragKeys, setDragKeys] = useState<string[]>([]);
    const [overLane, setOverLane] = useState<string | null>(null);
    const [focusKey, setFocusKey] = useState<string | null>(null);

    const activities = baseActivities.map(a => {
        const entry = draft[a.key];
        const status = entry?.status ?? a.status;
        const message = entry?.message ?? a.message;
        return { ...a, baseStatus: a.status, baseMessage: a.message, status, message, changed: status !== a.status || message !== a.message };
    });
    const changed = activities.filter(a => a.changed);
    const dirtyCount = changed.length;
    const busy = publishing;
    const locked = publishing || editingMsg !== null;

    const effective = (a: { status: string }) => a.status;
    const supports = (a: (typeof activities)[number], status: string) => a.grid.some(option => option.id === status);

    // Écrit dans le brouillon ; si l'activité retrouve son état publié, elle sort du brouillon.
    const patchDraft = (key: string, patch: { status?: string; message?: string }) => {
        const base = baseActivities.find(a => a.key === key);
        if (!base) return;
        setDraft(previous => {
            const next = { ...previous[key], ...patch };
            const rest = { ...previous };
            if ((next.status ?? base.status) === base.status && (next.message ?? base.message) === base.message) delete rest[key];
            else rest[key] = next;
            return rest;
        });
    };

    const moveMany = (keys: string[], status: StatusKey) => {
        const targets = activities.filter(a => keys.includes(a.key) && supports(a, status) && a.status !== status);
        if (!targets.length) return;
        targets.forEach(a => patchDraft(a.key, { status, message: status === a.baseStatus ? a.baseMessage : '' }));
        setSelected([]);
    };

    const cancelDraft = () => {
        setDraft({});
        setSelected([]);
        setEditingMsg(null);
        setLocalMsg('');
        setError(null);
        setToast('Modifications annulées');
        setTimeout(() => setToast(null), 2500);
    };

    // Publie les modifications du brouillon (s'il y en a) puis confirme que les conditions sont à jour.
    const publish = async () => {
        if (publishing || editingMsg !== null) return;
        setPublishing(true);
        setError(null);
        try {
            const post = async (body: object) => {
                const res = await fetch('/api/cockpit/direct', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
                if (!res.ok) throw new Error('HTTP ' + res.status);
            };
            const fixedPatch: Record<string, string> = {};
            changed.filter(a => !a.key.startsWith('stage-')).forEach(a => {
                const fixed = FIXED_ACTIVITIES.find(f => f.key === a.key)!;
                fixedPatch[fixed.statusField] = a.status;
                fixedPatch[fixed.msgField] = a.message;
            });
            if (Object.keys(fixedPatch).length) await post({ type: 'PATCH', patch: fixedPatch });
            for (const a of changed.filter(a => a.key.startsWith('stage-'))) {
                await post({ type: 'PATCH_STAGE', stageKey: a.key.slice(6), status: a.status, message: a.message });
            }
            await post({ type: 'CONFIRM' });
            setLastConfirmedAt(new Date().toISOString());
            await content.refreshData();
            setDraft({});
            setToast(dirtyCount ? '✅ Modifications publiées et conditions confirmées' : '✅ Conditions confirmées');
            setTimeout(() => setToast(null), 3000);
        } catch {
            setError('La publication a échoué. Vos modifications sont conservées : réessayez.');
            await content.refreshData();
        } finally {
            setPublishing(false);
        }
    };

    useEffect(() => { onDirtyChange?.(dirtyCount > 0); }, [dirtyCount]);
    useEffect(() => () => onDirtyChange?.(false), []);
    useEffect(() => {
        if (!dirtyCount) return;
        const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirtyCount]);

    const toggleSelect = (key: string) => setSelected(previous => previous.includes(key) ? previous.filter(k => k !== key) : [...previous, key]);
    const selectGroup = (group?: string) => setSelected(activities.filter(a => !group || a.group === group).map(a => a.key));

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && editingMsg === null) { event.preventDefault(); publish(); return; }
            if (editingMsg !== null || event.ctrlKey || event.metaKey || event.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
            const lane = LANES.find(l => l.hotkey === event.key);
            if (lane) {
                const keys = selected.length ? selected : focusKey ? [focusKey] : [];
                if (keys.length) { event.preventDefault(); moveMany(keys, lane.id); }
            } else if (event.key === 'Escape') setSelected([]);
            else if (event.key.toLowerCase() === 'a') { event.preventDefault(); selectGroup(); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    const noteActivity = activities.find(a => a.key === editingMsg);
    const startNote = (key: string, message: string) => { setEditingMsg(key); setLocalMsg(message); setError(null); };
    const dragEligible = (status: string) => dragKeys.some(k => { const a = activities.find(x => x.key === k); return a && supports(a, status) && effective(a) !== status; });

    return <div className={styles.root}>
        {(toast || error) && <div role={error ? 'alert' : 'status'} className={`${styles.feedback} ${error ? styles.error : ''}`}>
            {error || toast}
        </div>}
        <header data-admin-page-header className={styles.intro}>
            <div className={styles.heading}>
                <h2 data-admin-page-title>Conditions des activités</h2>
                <p>
                    <time>{new Date(now).toLocaleDateString('fr-FR', { timeZone:'Europe/Paris',weekday:'long',day:'numeric',month:'long' })}</time>
                    <span className={styles.divider}>·</span>Visible par les clients
                    <span className={styles.divider}>·</span>
                    <span className={styles.freshness} data-fresh={!needsConfirm}><span className={styles.freshnessDot}/>{needsConfirm?'À vérifier':'À jour'}</span>
                    <time dateTime={lastConfirmedAt || undefined}>{lastConfirmedAt ? 'Vérifié le ' + new Date(lastConfirmedAt).toLocaleString('fr-FR',{timeZone:'Europe/Paris',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'}) : 'Pas encore vérifié'}</time>
                </p>
            </div>
            <div className={styles.confirmation}>
                {dirtyCount > 0 && <button className={styles.revert} disabled={publishing} onClick={cancelDraft}><Undo2 size={14}/> Annuler les modifications</button>}
                <button className={styles.confirm} data-dirty={dirtyCount > 0} disabled={locked} onClick={publish} title={dirtyCount > 0 ? 'Rien n’est publié tant que vous ne validez pas' : 'Conserve les statuts actuels'}>{publishing ? <Loader2 size={16} className="animate-spin"/> : <Check size={16}/>} {publishing ? 'Publication…' : dirtyCount > 0 ? `Publier ${dirtyCount} modification${dirtyCount > 1 ? 's' : ''} et confirmer` : 'Confirmer : tout est à jour'}<kbd>Ctrl ↵</kbd></button>
            </div>
        </header>
        <div className={styles.surface}>
        <div className={styles.selectionBar}>
            <div className={styles.barPick}>
                <span className={styles.barLabel}>Sélectionner</span>
                <button className={styles.chip} onClick={() => selectGroup()}>Tout <kbd>A</kbd></button>
                <button className={styles.chip} onClick={() => selectGroup('Pratiques & activités')}>Pratiques</button>
                <button className={styles.chip} onClick={() => selectGroup('Stages école de voile')}>Stages</button>
                <button className={styles.chip} disabled={selected.length === 0} onClick={() => setSelected([])}>Aucune <kbd>Esc</kbd></button>
            </div>
            <div className={styles.barMove}>
                <span className={styles.barCount} data-active={selected.length > 0}>{selected.length > 0 ? `${selected.length} sélectionnée${selected.length > 1 ? 's' : ''} →` : 'Déplacer vers →'}</span>
                {LANES.map(lane => <button key={lane.id} className={`${styles.moveBtn} ${styles[lane.tone]}`}
                    disabled={!selected.some(k => { const a = activities.find(x => x.key === k); return a && supports(a, lane.id) && effective(a) !== lane.id; })}
                    onClick={() => moveMany(selected, lane.id)}><lane.Icon size={15} />{lane.label}<kbd>{lane.hotkey}</kbd></button>)}
            </div>
        </div>
        <div className={styles.board}>
            {LANES.map(lane => {
                const members = activities.filter(a => effective(a) === lane.id);
                const eligible = dragKeys.length > 0 && dragEligible(lane.id);
                return <section key={lane.id} aria-label={lane.label}
                    className={`${styles.lane} ${styles[lane.tone]}`}
                    data-over={overLane === lane.id && eligible}
                    data-dim={dragKeys.length > 0 && !eligible}
                    onDragOver={event => { if (eligible) { event.preventDefault(); setOverLane(lane.id); } }}
                    onDragLeave={() => setOverLane(current => current === lane.id ? null : current)}
                    onDrop={event => { event.preventDefault(); const keys = dragKeys; setDragKeys([]); setOverLane(null); moveMany(keys, lane.id); }}>
                    <button className={styles.laneHead} disabled={selected.length === 0}
                        title={selected.length ? `Déplacer la sélection vers « ${lane.label} »` : undefined}
                        onClick={() => moveMany(selected, lane.id)}>
                        <lane.Icon size={17} className={styles.laneIcon} />
                        <span className={styles.laneTitle}>{lane.label}</span>
                    </button>
                    <p className={styles.laneSub}>{lane.sub}</p>
                    <div className={styles.laneBody}>
                        {members.map(a => {
                            const option = a.grid.find(o => o.id === effective(a));
                            const isSel = selected.includes(a.key);
                            return <div key={a.key} role="button" tabIndex={0} draggable
                                aria-pressed={isSel} aria-label={`${a.label} : ${option?.label}`}
                                className={styles.token} data-selected={isSel} data-changed={a.changed} data-dragging={dragKeys.includes(a.key)}
                                onClick={() => toggleSelect(a.key)}
                                onDoubleClick={() => startNote(a.key, a.message)}
                                onFocus={() => setFocusKey(a.key)}
                                onKeyDown={event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); toggleSelect(a.key); } }}
                                onDragStart={event => {
                                    event.dataTransfer.effectAllowed = 'move';
                                    event.dataTransfer.setData('text/plain', a.key);
                                    setDragKeys(isSel ? selected : [a.key]);
                                }}
                                onDragEnd={() => { setDragKeys([]); setOverLane(null); }}>
                                <span className={styles.tokenCheck} aria-hidden="true">{isSel && <Check size={12} strokeWidth={3} />}</span>
                                <span className={styles.tokenTop}>
                                    <span className={styles.tokenName}>{a.label}</span>
                                    <button className={styles.tokenNote} draggable={false} aria-label={`${a.message ? 'Modifier' : 'Ajouter'} une précision pour ${a.label}`}
                                        onClick={event => { event.stopPropagation(); startNote(a.key, a.message); }}><Pencil size={13} /></button>
                                </span>
                                {a.changed && <span className={styles.tokenWas}>était : {LANES.find(l => l.id === a.baseStatus)?.label}</span>}
                                <span className={styles.tokenMeta}>{a.group === 'Stages école de voile' ? 'Stage' : 'Activité'} · {option?.label}</span>
                                {a.message && <span className={styles.tokenMsg}>{a.message}</span>}
                            </div>;
                        })}
                        {members.length === 0 && <p className={styles.empty}>{eligible ? 'Déposer ici' : '—'}</p>}
                    </div>
                </section>;
            })}
        </div>
        {noteActivity && <div className={styles.editor}>
            <label htmlFor={`note-${noteActivity.key}`}>Précision pour {noteActivity.label}</label>
            <textarea id={`note-${noteActivity.key}`} autoFocus disabled={busy} value={localMsg} onChange={event => setLocalMsg(event.target.value)} placeholder="Message visible par les clients…" />
            <div className={styles.suggestions}>
                {(noteActivity.suggestions[effective(noteActivity)] || []).map(note => <button key={note} disabled={busy} className={styles.suggestion}
                    onClick={() => setLocalMsg(previous => previous ? previous + ' — ' + note : note)}>+ {note}</button>)}
            </div>
            <div className={styles.editorFooter}>
                <button className={styles.save} disabled={busy || localMsg === noteActivity.message}
                    onClick={() => { patchDraft(noteActivity.key, { message: localMsg }); setEditingMsg(null); setLocalMsg(''); }}><Save size={15} />Valider la précision</button>
                <button className={styles.cancel} disabled={busy} onClick={() => {setEditingMsg(null);setLocalMsg('');setError(null);}}>Annuler</button>
                {localMsg && <button className={styles.cancel} disabled={busy} onClick={() => setLocalMsg('')}>Effacer le texte</button>}
                <span className={styles.draftNote}>Publiée à la validation</span>
            </div>
        </div>}
        {stageDefinitions.length===0 && <p className={styles.footerNote}>{content.isLoading?'Chargement des stages…':'Aucun stage défini.'}</p>}
        <footer className={styles.footerNote}><span>Rien n’est publié avant validation. Double-clic sur une activité : ajouter une précision.</span><span>Déplacer une activité efface sa précision.</span></footer>
        </div>
    </div>;
}

"use client";

import React, { useState, useEffect } from 'react';
import { useLiveStatus } from '@/contexts/LiveStatusContext';
import { Check, XCircle, Loader2, Save, Waves, LayoutDashboard } from 'lucide-react';
import { SpotStatus } from '@/types';

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

export default function CockpitClient() {
    const content = useLiveStatus();
    const { stageDefinitions, stageStatuses } = content;

    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [editingMsg, setEditingMsg] = useState<string | null>(null);
    const [localMsg, setLocalMsg] = useState('');
    const [toast, setToast] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [lastConfirmedAt, setLastConfirmedAt] = useState<string | null>(content.lastConfirmedAt || null);

    useEffect(() => {
        if (content.lastConfirmedAt) setLastConfirmedAt(content.lastConfirmedAt);
    }, [content.lastConfirmedAt]);

    // ─── Save helpers ──────────────────────────────────────────────

    const saveFixed = async (patch: Record<string, any>, label?: string) => {
        const savingKey = Object.keys(patch)[0];
        setIsSaving(savingKey);

        const enrichedPatch = { ...patch };
        Object.keys(patch).forEach(key => {
            if (key.endsWith('Status')) {
                enrichedPatch[key.replace('Status', 'Message')] = '';
            }
        });

        try {
            const res = await fetch('/api/cockpit/direct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'PATCH', patch: enrichedPatch })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur serveur');
            await content.refreshData();
            setToast(label || '✓ Enregistré');
            setTimeout(() => setToast(null), 2000);
        } catch (err: any) {
            alert(`⚠️ Erreur: ${err.message || "lors de l'enregistrement."}`);
        } finally {
            setIsSaving(null);
        }
    };

    const saveStage = async (stageKey: string, updates: { status?: string; message?: string }, label?: string) => {
        setIsSaving(`stage-${stageKey}`);
        try {
            const res = await fetch('/api/cockpit/direct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'PATCH_STAGE', stageKey, ...updates })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur serveur');
            await content.refreshData();
            setToast(label || '✓ Enregistré');
            setTimeout(() => setToast(null), 2000);
        } catch (err: any) {
            alert(`⚠️ Erreur: ${err.message || "lors de l'enregistrement."}`);
        } finally {
            setIsSaving(null);
        }
    };

    // ─── Bulk actions ──────────────────────────────────────────────

    const setAllToStatus = async (status: StatusKey) => {
        setIsSaving('bulk');
        const fixedPatch: Record<string, any> = {};
        FIXED_ACTIVITIES.forEach(a => { fixedPatch[a.statusField] = status; fixedPatch[a.msgField] = ''; });
        try {
            await fetch('/api/cockpit/direct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'PATCH', patch: { ...fixedPatch, lastPublishedAt: new Date().toISOString() } })
            });
            // Patch all stages
            for (const stage of stageDefinitions) {
                await fetch('/api/cockpit/direct', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'PATCH_STAGE', stageKey: stage.key, status, message: '' })
                });
            }
            await content.refreshData();
            setToast(`Tout → ${status}`);
            setTimeout(() => setToast(null), 2000);
        } catch (err: any) {
            alert(`⚠️ Erreur: ${err.message}`);
        } finally {
            setIsSaving(null);
        }
    };

    const setStagesOnlyToStatus = async (status: StatusKey) => {
        setIsSaving('bulk-stages');
        try {
            for (const stage of stageDefinitions) {
                await fetch('/api/cockpit/direct', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'PATCH_STAGE', stageKey: stage.key, status, message: '' })
                });
            }
            await content.refreshData();
            setToast(`Stages → ${status}`);
            setTimeout(() => setToast(null), 2000);
        } catch (err: any) {
            alert(`⚠️ Erreur: ${err.message}`);
        } finally {
            setIsSaving(null);
        }
    };

    const confirm = async () => {
        setIsConfirming(true);
        try {
            await fetch('/api/cockpit/direct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'CONFIRM' })
            });
            const now = new Date().toISOString();
            setLastConfirmedAt(now);
            setToast('✅ Conditions confirmées');
            setTimeout(() => setToast(null), 3000);
        } catch {
            alert('Erreur réseau');
        } finally {
            setIsConfirming(false);
        }
    };

    const hoursSinceConfirm = lastConfirmedAt
        ? (Date.now() - new Date(lastConfirmedAt).getTime()) / 3600000
        : null;
    const needsConfirm = hoursSinceConfirm === null || hoursSinceConfirm > 20;

    // ─── Render helpers ────────────────────────────────────────────

    const renderNoteInput = (
        key: string,
        currentMsg: string,
        onSave: (msg: string) => void,
        suggestions: string[]
    ) => {
        const isEditing = editingMsg === key;
        return (
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={isEditing ? localMsg : currentMsg}
                        onChange={e => { setEditingMsg(key); setLocalMsg(e.target.value); }}
                        placeholder="Ajouter une précision..."
                        className={`flex-1 bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-abysse outline-none transition-colors ${isEditing ? 'border-turquoise bg-white focus:ring-2 focus:ring-turquoise/20' : 'border-slate-200'}`}
                    />
                    {isEditing && (
                        <button
                            onClick={() => { onSave(localMsg); setEditingMsg(null); }}
                            className="px-5 py-2.5 bg-abysse text-white rounded-xl text-xs font-black uppercase flex items-center justify-center shadow-md active:scale-95"
                        >
                            <Save size={16} />
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map(note => (
                        <button
                            key={note}
                            onClick={() => {
                                const prev = isEditing ? localMsg : currentMsg;
                                const next = prev ? `${prev} - ${note}` : note;
                                onSave(next);
                                setEditingMsg(null);
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold hover:bg-slate-50 hover:text-abysse hover:border-slate-300 transition-colors"
                        >
                            + {note}
                        </button>
                    ))}
                    {(isEditing ? localMsg : currentMsg) && (
                        <button
                            onClick={() => { onSave(''); setLocalMsg(''); setEditingMsg(null); }}
                            className="px-2.5 py-1.5 bg-rose-50 border border-rose-100 text-rose-500 rounded-lg text-[10px] font-bold hover:bg-rose-100 transition-colors"
                        >
                            Effacer note
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <LayoutDashboard size={24} className="text-turquoise" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-abysse">Gestion Cockpit</h2>
                    {isSaving && <Loader2 className="animate-spin text-turquoise ml-2" size={18} />}
                </div>
                {toast && (
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg uppercase tracking-widest animate-in fade-in">{toast}</span>
                )}
            </div>

            <div className="space-y-8">
                {/* ── BOUTON CONFIRMER ── */}
                <div className={`rounded-2xl border p-4 ${needsConfirm ? 'border-amber-500/30 bg-amber-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                    {needsConfirm && (
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3">
                            ⚠️ Confirmation requise — le tableau n'a pas été validé depuis plus de 20h
                        </p>
                    )}
                    <button
                        onClick={confirm}
                        disabled={isConfirming}
                        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all active:scale-98 flex items-center justify-center gap-3 ${needsConfirm
                            ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            } disabled:opacity-50`}
                    >
                        {isConfirming ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                        {needsConfirm ? 'Tout va bien — Confirmer les conditions' : 'Conditions confirmées ✓'}
                    </button>
                    {lastConfirmedAt && !needsConfirm && (
                        <p className="text-center text-[10px] text-emerald-500/60 mt-2 font-medium">
                            Confirmé {new Date(lastConfirmedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    )}
                </div>

                {/* ── ACTIONS RAPIDES ── */}
                <div className="space-y-3">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block border-b border-slate-100 pb-2">Actions rapides — Tout</span>
                    <div className="grid grid-cols-3 gap-3">
                        {(['OPEN', 'RESTRICTED', 'CLOSED'] as StatusKey[]).map(s => (
                            <button
                                key={s}
                                onClick={() => setAllToStatus(s)}
                                disabled={isSaving === 'bulk'}
                                className={`py-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all active:scale-95 bg-white shadow-sm hover:shadow-md disabled:opacity-50 ${s === 'OPEN' ? 'border-emerald-200 text-emerald-600' : s === 'RESTRICTED' ? 'border-amber-200 text-amber-600' : 'border-rose-200 text-rose-600'}`}
                            >
                                Tout → {s === 'OPEN' ? 'Oui' : s === 'RESTRICTED' ? 'Adapté' : 'Non'}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setStagesOnlyToStatus('CLOSED')}
                            disabled={isSaving === 'bulk-stages'}
                            className="py-3 rounded-xl border border-slate-200 bg-white shadow-sm text-xs font-black text-slate-500 uppercase tracking-wider hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Stages → Annulé
                        </button>
                        <button
                            onClick={() => setStagesOnlyToStatus('INACTIVE')}
                            disabled={isSaving === 'bulk-stages'}
                            className="py-3 rounded-xl border border-slate-200 bg-white shadow-sm text-xs font-black text-slate-500 uppercase tracking-wider hover:bg-slate-100 hover:text-slate-700 hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Stages → Hors Saison
                        </button>
                    </div>
                </div>

                {/* ── LAYOUT 2 COLONNES : gauche=non-stages / droite=stages ── */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

                    {/* ── COLONNE GAUCHE : Activités non-stages ── */}
                    <div className="space-y-4">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block border-b border-slate-100 pb-2">
                            Pratiques & Activités
                        </span>
                        <div className="bg-white border border-slate-200 rounded-3xl divide-y divide-slate-100 shadow-sm overflow-hidden">
                            {FIXED_ACTIVITIES.map(act => {
                                const currentStatus = ((content as any)[act.statusField] as string) || 'OPEN';
                                const currentMsg = ((content as any)[act.msgField] as string) || '';
                                const grid = STATUS_GRIDS[act.grid];

                                return (
                                    <div key={act.key} className="p-5 flex flex-col gap-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                            <span className="text-base font-black uppercase text-abysse flex-1 min-w-0">{act.label}</span>
                                            <div className="flex flex-wrap gap-1 shrink-0 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                                {grid.map(opt => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => saveFixed({ [act.statusField]: opt.id }, `${act.label} → ${opt.label}`)}
                                                        disabled={isSaving === act.statusField}
                                                        className={`px-3 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wide transition-all active:scale-95 shadow-sm ${currentStatus === opt.id ? opt.activeBg : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {renderNoteInput(
                                            act.key,
                                            currentMsg,
                                            (msg) => saveFixed({ [act.msgField]: msg }),
                                            (FIXED_SUGGESTIONS[act.key]?.[currentStatus]) || []
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── COLONNE DROITE : Stages (dynamiques) ── */}
                    <div className="space-y-4">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block border-b border-slate-100 pb-2">
                            Stages École de Voile
                            {stageDefinitions.length === 0 && (
                                <span className="ml-2 text-amber-500 normal-case font-medium">(chargement…)</span>
                            )}
                        </span>
                        <div className="bg-white border border-slate-200 rounded-3xl divide-y divide-slate-100 shadow-sm overflow-hidden">
                            {stageDefinitions.map(stage => {
                                const statusEntry = stageStatuses[stage.key];
                                const currentStatus = (statusEntry?.status as string) || 'OPEN';
                                const currentMsg = statusEntry?.message || '';

                                return (
                                    <div key={stage.key} className="p-5 flex flex-col gap-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                            <span className="text-base font-black uppercase text-abysse flex-1 min-w-0">
                                                {stage.label}
                                            </span>
                                            <div className="flex flex-wrap gap-1 shrink-0 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                                {STATUS_GRIDS.stage.map(opt => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => saveStage(stage.key, { status: opt.id, message: '' }, `${stage.label} → ${opt.label}`)}
                                                        disabled={isSaving === `stage-${stage.key}`}
                                                        className={`px-3 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wide transition-all active:scale-95 shadow-sm ${currentStatus === opt.id ? opt.activeBg : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {renderNoteInput(
                                            `stage-${stage.key}`,
                                            currentMsg,
                                            (msg) => saveStage(stage.key, { message: msg }),
                                            (STAGE_SUGGESTIONS[stage.key] || STAGE_SUGGESTIONS.default)[currentStatus] || []
                                        )}
                                    </div>
                                );
                            })}
                            {stageDefinitions.length === 0 && (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    Aucun stage actif défini dans Sanity.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

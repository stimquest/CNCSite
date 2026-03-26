"use client";

import React, { useState, useEffect } from 'react';
import { useLiveStatus } from '@/contexts/LiveStatusContext';
import { Check, XCircle, Loader2, Save, Waves, LayoutDashboard } from 'lucide-react';

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
    generic: [
        { id: 'OPEN', label: 'Ouverte', short: 'OK', activeBg: 'bg-emerald-500 text-white border-emerald-400' },
        { id: 'RESTRICTED', label: 'Adaptée', short: '~', activeBg: 'bg-amber-400 text-slate-900 border-amber-300' },
        { id: 'CLOSED', label: 'Suspendue', short: '✕', activeBg: 'bg-rose-500 text-white border-rose-400' },
    ]
};

// All activities managed from the cockpit
const ACTIVITIES = [
    { key: 'char', label: 'Char à Voile', statusField: 'charStatus', msgField: 'charMessage', category: 'encadree' },
    { key: 'nautique', label: 'Sports Nautiques', statusField: 'nautiqueStatus', msgField: 'nautiqueMessage', category: 'autonome' },
    { key: 'marche', label: 'Marche Aquatique', statusField: 'marcheStatus', msgField: 'marcheMessage', category: 'encadree' },
    { key: 'minimousses', label: 'Mini-Mousses', statusField: 'stagesMiniMoussesStatus', msgField: 'stagesMiniMoussesMessage', category: 'encadree' },
    { key: 'moussaillons', label: 'Moussaillons', statusField: 'stagesMoussaillonsStatus', msgField: 'stagesMoussaillonsMessage', category: 'encadree' },
    { key: 'initiation', label: 'Initiation', statusField: 'stagesInitiationStatus', msgField: 'stagesInitiationMessage', category: 'encadree' },
    { key: 'perf', label: 'Perfectionnement', statusField: 'stagesPerfStatus', msgField: 'stagesPerfMessage', category: 'encadree' },
];

export default function CockpitClient() {
    const content = useLiveStatus();

    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [editingMsg, setEditingMsg] = useState<string | null>(null);
    const [localMsg, setLocalMsg] = useState('');
    const [localVibeMsg, setLocalVibeMsg] = useState(content.statusMessage || '');
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => { setLocalVibeMsg(content.statusMessage || ''); }, [content.statusMessage]);

    const save = async (patch: Record<string, any>, label?: string) => {
        const savingKey = Object.keys(patch)[0];
        setIsSaving(savingKey);

        // Auto-clear messages when status changes
        const enrichedPatch = { ...patch };
        Object.keys(patch).forEach(key => {
            if (key.endsWith('Status')) {
                const msgKey = key.replace('Status', 'Message');
                enrichedPatch[msgKey] = '';
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

    // Bulk actions
    const setAllStatus = (status: StatusKey) => {
        const patch: Record<string, any> = {};
        ACTIVITIES.forEach(act => { patch[act.statusField] = status; });
        save(patch, `Tout → ${STATUS_GRIDS.generic.find(o => o.id === status)?.label}`);
    };

    const setGroupStatus = (category: string, status: StatusKey) => {
        const patch: Record<string, any> = {};
        ACTIVITIES.filter(a => a.category === category).forEach(act => { patch[act.statusField] = status; });
        save(patch, `Action groupée`);
    };

    const [isConfirming, setIsConfirming] = useState(false);
    const [lastConfirmedAt, setLastConfirmedAt] = useState<string | null>(null);

    // Load lastConfirmedAt on mount
    useEffect(() => {
        fetch('/api/cockpit/direct')
            .then(r => r.json())
            .then(d => { if (d.lastConfirmedAt) setLastConfirmedAt(d.lastConfirmedAt); })
            .catch(() => { });
    }, []);

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

    // Freshness: hours since last confirmation or update
    const lastActionAt = lastConfirmedAt || null;
    const hoursSinceConfirm = lastActionAt
        ? (Date.now() - new Date(lastActionAt).getTime()) / 3600000
        : null;
    const needsConfirm = hoursSinceConfirm === null || hoursSinceConfirm > 20;

    const getSuggestedNotes = (actKey: string, status: string) => {
        if (actKey === 'char') {
            if (status === 'OPEN') return ["Conditions favorables, séance maintenue.", "Vent régulier, activité confirmée."];
            if (status === 'RESTRICTED') return ["Vent soutenu, séance dynamique.", "Conditions techniques, adaptation prévue.", "Rafales présentes, vigilance renforcée."];
            return ["Vent insuffisant aujourd’hui.", "Vent trop fort pour naviguer en sécurité.", "Conditions météo défavorables."];
        }
        if (actKey === 'minimousses') {
            if (status === 'OPEN') return ["Séance maintenue dans de bonnes conditions.", "Conditions adaptées au groupe."];
            if (status === 'RESTRICTED') return ["Vent soutenu, encadrement renforcé.", "Séance adaptée aux conditions du jour."];
            return ["Conditions non adaptées aux enfants.", "Sécurité non garantie aujourd’hui."];
        }
        if (['moussaillons', 'initiation', 'perf', 'nautique'].includes(actKey)) {
            if (status === 'OPEN') return ["Conditions favorables, séance maintenue.", "Activité confirmée normalement."];
            if (status === 'RESTRICTED') return ["Conditions dynamiques, adaptation prévue.", "Vent soutenu, séance technique."];
            return ["Conditions incompatibles avec la sécurité.", "Vent inadapté à la séance prévue."];
        }
        if (actKey === 'marche') {
            if (status === 'OPEN') return ["Parcours maintenu.", "Conditions favorables pour la marche."];
            if (status === 'RESTRICTED') return ["Itinéraire ajusté selon les conditions.", "Parcours abrité privilégié aujourd’hui."];
            return ["Conditions météo défavorables.", "Sortie annulée par précaution."];
        }
        return [];
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
                {/* ── BOUTON CONFIRMER (priorité maximale) ── */}
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

                {/* ── SECTION 1 : ACTIONS RAPIDES ── */}
                <div className="space-y-4">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block border-b border-slate-100 pb-2">Actions rapides</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {STATUS_GRIDS.generic.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setAllStatus(opt.id as StatusKey)}
                                className={`py-4 rounded-xl border text-xs font-black uppercase tracking-wider transition-all active:scale-95 bg-white shadow-sm hover:shadow-md ${opt.id === 'OPEN' ? 'border-emerald-200 text-emerald-600' : opt.id === 'RESTRICTED' ? 'border-amber-200 text-amber-600' : 'border-rose-200 text-rose-600'}`}
                            >
                                Tout → {opt.id === 'OPEN' ? 'Oui' : opt.id === 'RESTRICTED' ? 'Adapté' : 'Non'}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button onClick={() => setGroupStatus('autonome', 'CLOSED')} className="py-3 rounded-xl border border-slate-200 bg-white shadow-sm text-xs font-black text-slate-500 uppercase tracking-wider hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95">
                            Autonomes → Déconseillée
                        </button>
                        <button onClick={() => setGroupStatus('encadree', 'CLOSED')} className="py-3 rounded-xl border border-slate-200 bg-white shadow-sm text-xs font-black text-slate-500 uppercase tracking-wider hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95">
                            Encadrées → Annulé
                        </button>
                    </div>
                </div>

                {/* ── SECTION 2 : TOUTES LES ACTIVITÉS ── */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Colonne Pratiques autonomes */}
                    <div className="space-y-4">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block border-b border-slate-100 pb-2">Pratiques autonomes</span>
                        <div className="bg-white border border-slate-200 rounded-3xl divide-y divide-slate-100 shadow-sm overflow-hidden">
                            {ACTIVITIES.filter(a => a.category === 'autonome').map(act => {
                                const currentStatus = (content as any)[act.statusField] as string || 'OPEN';
                                const currentMsg = (content as any)[act.msgField] as string || '';
                                const isEditing = editingMsg === act.key;

                                return (
                                    <div key={act.key} className="p-5 flex flex-col gap-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <span className="text-base font-black uppercase text-abysse flex-1 min-w-0">{act.label}</span>
                                            <div className="flex flex-wrap gap-1 shrink-0 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                                {STATUS_GRIDS.autonome_voile.map(opt => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => save({ [act.statusField]: opt.id }, `${act.label} → ${opt.label}`)}
                                                        disabled={isSaving === act.statusField}
                                                        className={`px-3 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wide transition-all active:scale-95 shadow-sm ${currentStatus === opt.id ? opt.activeBg : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={isEditing ? localMsg : currentMsg}
                                                    onChange={e => {
                                                        setEditingMsg(act.key);
                                                        setLocalMsg(e.target.value);
                                                    }}
                                                    placeholder="Ajouter une précision (ex: pas de vent)..."
                                                    className={`flex-1 bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-abysse outline-none transition-colors ${isEditing ? 'border-turquoise bg-white focus:ring-2 focus:ring-turquoise/20' : 'border-slate-200'}`}
                                                />
                                                {isEditing && (
                                                    <button
                                                        onClick={() => { save({ [act.msgField]: localMsg }); setEditingMsg(null); }}
                                                        className="px-5 py-2.5 bg-abysse text-white rounded-xl text-xs font-black uppercase flex items-center justify-center shadow-md active:scale-95"
                                                    >
                                                        <Save size={16} />
                                                    </button>
                                                )}
                                            </div>
                                            {/* Quick Notes Suggestions */}
                                            <div className="flex flex-wrap gap-2">
                                                {getSuggestedNotes(act.key, currentStatus).map(note => (
                                                    <button
                                                        key={note}
                                                        onClick={() => {
                                                            const newVal = (isEditing ? localMsg : currentMsg) ? `${isEditing ? localMsg : currentMsg} - ${note}` : note;
                                                            setEditingMsg(act.key);
                                                            setLocalMsg(newVal);
                                                            // Auto-save tag selection to be super fast
                                                            save({ [act.msgField]: newVal });
                                                            setEditingMsg(null);
                                                        }}
                                                        className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold hover:bg-slate-50 hover:text-abysse hover:border-slate-300 transition-colors"
                                                    >
                                                        + {note}
                                                    </button>
                                                ))}
                                                {(isEditing ? localMsg : currentMsg) && (
                                                    <button
                                                        onClick={() => {
                                                            save({ [act.msgField]: '' });
                                                            setLocalMsg('');
                                                            setEditingMsg(null);
                                                        }}
                                                        className="px-2.5 py-1.5 bg-rose-50 border border-rose-100 text-rose-500 rounded-lg text-[10px] font-bold hover:bg-rose-100 transition-colors"
                                                    >
                                                        Effacer note
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Colonne Activités encadrées */}
                    <div className="space-y-4">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block border-b border-slate-100 pb-2">Activités encadrées</span>
                        <div className="bg-white border border-slate-200 rounded-3xl divide-y divide-slate-100 shadow-sm overflow-hidden">
                            {ACTIVITIES.filter(a => a.category === 'encadree').map(act => {
                                const currentStatus = (content as any)[act.statusField] as string || 'OPEN';
                                const currentMsg = (content as any)[act.msgField] as string || '';
                                const isEditing = editingMsg === act.key;

                                return (
                                    <div key={act.key} className="p-5 flex flex-col gap-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <span className="text-base font-black uppercase text-abysse flex-1 min-w-0">{act.label}</span>
                                            <div className="flex flex-wrap gap-1 shrink-0 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                                {(act.key === 'marche' ? STATUS_GRIDS.marche : STATUS_GRIDS.stage).map(opt => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => save({ [act.statusField]: opt.id }, `${act.label} → ${opt.label}`)}
                                                        disabled={isSaving === act.statusField}
                                                        className={`px-3 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wide transition-all active:scale-95 shadow-sm ${currentStatus === opt.id ? opt.activeBg : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={isEditing ? localMsg : currentMsg}
                                                    onChange={e => {
                                                        setEditingMsg(act.key);
                                                        setLocalMsg(e.target.value);
                                                    }}
                                                    placeholder="Ajouter une précision (ex: pas de vent)..."
                                                    className={`flex-1 bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-abysse outline-none transition-colors ${isEditing ? 'border-turquoise bg-white focus:ring-2 focus:ring-turquoise/20' : 'border-slate-200'}`}
                                                />
                                                {isEditing && (
                                                    <button
                                                        onClick={() => { save({ [act.msgField]: localMsg }); setEditingMsg(null); }}
                                                        className="px-5 py-2.5 bg-abysse text-white rounded-xl text-xs font-black uppercase flex items-center justify-center shadow-md active:scale-95"
                                                    >
                                                        <Save size={16} />
                                                    </button>
                                                )}
                                            </div>
                                            {/* Quick Notes Suggestions */}
                                            <div className="flex flex-wrap gap-2">
                                                {getSuggestedNotes(act.key, currentStatus).map(note => (
                                                    <button
                                                        key={note}
                                                        onClick={() => {
                                                            const newVal = (isEditing ? localMsg : currentMsg) ? `${isEditing ? localMsg : currentMsg} - ${note}` : note;
                                                            setEditingMsg(act.key);
                                                            setLocalMsg(newVal);
                                                            // Auto-save tag selection to be super fast
                                                            save({ [act.msgField]: newVal });
                                                            setEditingMsg(null);
                                                        }}
                                                        className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold hover:bg-slate-50 hover:text-abysse hover:border-slate-300 transition-colors"
                                                    >
                                                        + {note}
                                                    </button>
                                                ))}
                                                {(isEditing ? localMsg : currentMsg) && (
                                                    <button
                                                        onClick={() => {
                                                            save({ [act.msgField]: '' });
                                                            setLocalMsg('');
                                                            setEditingMsg(null);
                                                        }}
                                                        className="px-2.5 py-1.5 bg-rose-50 border border-rose-100 text-rose-500 rounded-lg text-[10px] font-bold hover:bg-rose-100 transition-colors"
                                                    >
                                                        Effacer note
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

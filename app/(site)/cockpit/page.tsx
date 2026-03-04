"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useContent } from '@/contexts/ContentContext';
import { Check, XCircle, Loader2, ArrowLeft, Home, Save, Waves } from 'lucide-react';
import Link from 'next/link';

const MAGIC_KEY = "CNC2026";

// ─── Types ────────────────────────────────────────────────────────
type StatusKey = 'OPEN' | 'RESTRICTED' | 'CLOSED';

const STATUS_OPTIONS: { id: StatusKey; label: string; short: string; bg: string; activeBg: string; ring: string }[] = [
    { id: 'OPEN', label: 'Ouverte', short: 'OK', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', activeBg: 'bg-emerald-500 text-white border-emerald-400', ring: 'ring-emerald-500/30' },
    { id: 'RESTRICTED', label: 'Adapté', short: '~', bg: 'bg-amber-400/10 text-amber-500 border-amber-400/20', activeBg: 'bg-amber-400 text-slate-900 border-amber-300', ring: 'ring-amber-400/30' },
    { id: 'CLOSED', label: 'Annulé', short: '✕', bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20', activeBg: 'bg-rose-500 text-white border-rose-400', ring: 'ring-rose-500/30' },
];

// All activities managed from the cockpit
const ACTIVITIES = [
    { key: 'char', label: 'Char à Voile', statusField: 'charStatus', msgField: 'charMessage', category: 'autonome' },
    { key: 'nautique', label: 'Sports Nautiques', statusField: 'nautiqueStatus', msgField: 'nautiqueMessage', category: 'autonome' },
    { key: 'marche', label: 'Marche Aquatique', statusField: 'marcheStatus', msgField: 'marcheMessage', category: 'autonome' },
    { key: 'minimousses', label: 'Mini-Mousses', statusField: 'stagesMiniMoussesStatus', msgField: 'stagesMiniMoussesMessage', category: 'stage' },
    { key: 'moussaillons', label: 'Moussaillons', statusField: 'stagesMoussaillonsStatus', msgField: 'stagesMoussaillonsMessage', category: 'stage' },
    { key: 'initiation', label: 'Initiation', statusField: 'stagesInitiationStatus', msgField: 'stagesInitiationMessage', category: 'stage' },
    { key: 'perf', label: 'Perfectionnement', statusField: 'stagesPerfStatus', msgField: 'stagesPerfMessage', category: 'stage' },
];

// ─── Main Cockpit ─────────────────────────────────────────────────
function CockpitContent() {
    const searchParams = useSearchParams();
    const key = searchParams.get('key');
    const content = useContent();

    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [editingMsg, setEditingMsg] = useState<string | null>(null);
    const [localMsg, setLocalMsg] = useState('');
    const [localVibeMsg, setLocalVibeMsg] = useState(content.statusMessage || '');
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => { setLocalVibeMsg(content.statusMessage || ''); }, [content.statusMessage]);

    const isAuthorized = key === MAGIC_KEY;

    // Generic setter lookup
    const setters: Record<string, (v: any) => void> = {
        spotStatus: content.setSpotStatus,
        statusMessage: content.setStatusMessage,
        charStatus: content.setCharStatus, charMessage: content.setCharMessage,
        nautiqueStatus: content.setNautiqueStatus, nautiqueMessage: content.setNautiqueMessage,
        marcheStatus: content.setMarcheStatus, marcheMessage: content.setMarcheMessage,
        stagesMiniMoussesStatus: content.setStagesMiniMoussesStatus, stagesMiniMoussesMessage: content.setStagesMiniMoussesMessage,
        stagesMoussaillonsStatus: content.setStagesMoussaillonsStatus, stagesMoussaillonsMessage: content.setStagesMoussaillonsMessage,
        stagesInitiationStatus: content.setStagesInitiationStatus, stagesInitiationMessage: content.setStagesInitiationMessage,
        stagesPerfStatus: content.setStagesPerfStatus, stagesPerfMessage: content.setStagesPerfMessage,
    };

    const save = async (patch: Record<string, any>, label?: string) => {
        const savingKey = Object.keys(patch)[0];
        setIsSaving(savingKey);
        // Optimistic update
        Object.entries(patch).forEach(([k, v]) => { if (setters[k]) setters[k](v); });
        try {
            const res = await fetch('/api/cockpit/direct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'PATCH', patch })
            });
            if (!res.ok) throw new Error('Erreur serveur');
            setToast(label || '✓ Enregistré');
            setTimeout(() => setToast(null), 2000);
        } catch {
            alert("⚠️ Erreur lors de l'enregistrement.");
        } finally {
            setIsSaving(null);
        }
    };

    // Bulk actions
    const setAllStatus = (status: StatusKey) => {
        const patch: Record<string, any> = {};
        ACTIVITIES.forEach(act => { patch[act.statusField] = status; });
        save(patch, `Tout → ${STATUS_OPTIONS.find(o => o.id === status)?.label}`);
    };

    const setGroupStatus = (category: string, status: StatusKey) => {
        const patch: Record<string, any> = {};
        ACTIVITIES.filter(a => a.category === category).forEach(act => { patch[act.statusField] = status; });
        save(patch, `${category === 'autonome' ? 'Autonomes' : 'Stages'} → ${STATUS_OPTIONS.find(o => o.id === status)?.label}`);
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="size-20 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-6"><XCircle size={40} /></div>
                <h1 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Accès Refusé</h1>
                <Link href="/" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest">Retour Accueil</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 px-4 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Home size={20} className="text-turquoise" />
                        <h1 className="text-sm font-black uppercase italic tracking-tighter">Cockpit</h1>
                        {isSaving && <Loader2 className="animate-spin text-turquoise" size={14} />}
                    </div>
                    <div className="flex items-center gap-2">
                        {toast && (
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-in fade-in">{toast}</span>
                        )}
                        <Link href="/" className="size-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400">
                            <ArrowLeft size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

                {/* ── SECTION 1 : ACTIONS RAPIDES ── */}
                <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 block">Actions rapides</span>
                    <div className="grid grid-cols-3 gap-2">
                        {STATUS_OPTIONS.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setAllStatus(opt.id)}
                                className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${opt.bg} hover:opacity-80`}
                            >
                                Tout → {opt.label}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setGroupStatus('autonome', 'CLOSED')} className="py-2.5 rounded-xl border border-white/10 bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-wider hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all active:scale-95">
                            Autonomes → Annulé
                        </button>
                        <button onClick={() => setGroupStatus('stage', 'CLOSED')} className="py-2.5 rounded-xl border border-white/10 bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-wider hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all active:scale-95">
                            Stages → Annulé
                        </button>
                    </div>
                </div>

                {/* ── SECTION 2 : TOUTES LES ACTIVITÉS ── */}
                <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 block">Pratiques autonomes</span>
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
                        {ACTIVITIES.filter(a => a.category === 'autonome').map(act => {
                            const currentStatus = (content as any)[act.statusField] as string || 'OPEN';
                            const currentMsg = (content as any)[act.msgField] as string || '';
                            const isEditing = editingMsg === act.key;

                            return (
                                <div key={act.key} className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-white flex-1 min-w-0 truncate">{act.label}</span>
                                        <div className="flex gap-1 shrink-0">
                                            {STATUS_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => save({ [act.statusField]: opt.id }, `${act.label} → ${opt.label}`)}
                                                    disabled={isSaving === act.statusField}
                                                    className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wide transition-all active:scale-90 ${currentStatus === opt.id ? opt.activeBg + ' ring-2 ' + opt.ring : opt.bg + ' opacity-40 hover:opacity-70'}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => { setEditingMsg(isEditing ? null : act.key); setLocalMsg(currentMsg); }}
                                            className={`text-[9px] font-bold px-2 py-1 rounded-lg transition-all ${isEditing ? 'bg-turquoise/20 text-turquoise' : 'text-slate-600 hover:text-slate-400'}`}
                                        >
                                            {isEditing ? 'Fermer' : 'Note'}
                                        </button>
                                    </div>
                                    {isEditing && (
                                        <div className="mt-3 flex gap-2">
                                            <input
                                                type="text"
                                                value={localMsg}
                                                onChange={e => setLocalMsg(e.target.value)}
                                                placeholder="Raison ou note..."
                                                className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-turquoise"
                                            />
                                            <button
                                                onClick={() => { save({ [act.msgField]: localMsg }); setEditingMsg(null); }}
                                                disabled={localMsg === currentMsg}
                                                className="px-3 py-2 bg-turquoise text-abysse rounded-lg text-[10px] font-black uppercase disabled:opacity-20"
                                            >
                                                <Save size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 block">Stages encadrés</span>
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
                        {ACTIVITIES.filter(a => a.category === 'stage').map(act => {
                            const currentStatus = (content as any)[act.statusField] as string || 'OPEN';
                            const currentMsg = (content as any)[act.msgField] as string || '';
                            const isEditing = editingMsg === act.key;

                            return (
                                <div key={act.key} className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-white flex-1 min-w-0 truncate">{act.label}</span>
                                        <div className="flex gap-1 shrink-0">
                                            {STATUS_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => save({ [act.statusField]: opt.id }, `${act.label} → ${opt.label}`)}
                                                    disabled={isSaving === act.statusField}
                                                    className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wide transition-all active:scale-90 ${currentStatus === opt.id ? opt.activeBg + ' ring-2 ' + opt.ring : opt.bg + ' opacity-40 hover:opacity-70'}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => { setEditingMsg(isEditing ? null : act.key); setLocalMsg(currentMsg); }}
                                            className={`text-[9px] font-bold px-2 py-1 rounded-lg transition-all ${isEditing ? 'bg-turquoise/20 text-turquoise' : 'text-slate-600 hover:text-slate-400'}`}
                                        >
                                            {isEditing ? 'Fermer' : 'Note'}
                                        </button>
                                    </div>
                                    {isEditing && (
                                        <div className="mt-3 flex gap-2">
                                            <input
                                                type="text"
                                                value={localMsg}
                                                onChange={e => setLocalMsg(e.target.value)}
                                                placeholder="Raison ou note..."
                                                className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-turquoise"
                                            />
                                            <button
                                                onClick={() => { save({ [act.msgField]: localMsg }); setEditingMsg(null); }}
                                                disabled={localMsg === currentMsg}
                                                className="px-3 py-2 bg-turquoise text-abysse rounded-lg text-[10px] font-black uppercase disabled:opacity-20"
                                            >
                                                <Save size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── SECTION 3 : MESSAGE VIGIE ── */}
                <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 block">Message de la vigie</span>
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3">
                        <div className="flex gap-1 mb-2">
                            {STATUS_OPTIONS.map(opt => {
                                const isActive = content.spotStatus === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => save({ spotStatus: opt.id }, `Vibe → ${opt.label}`)}
                                        className={`flex-1 py-2 rounded-lg border text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 ${isActive ? opt.activeBg + ' ring-2 ' + opt.ring : opt.bg + ' opacity-40 hover:opacity-70'}`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                        <textarea
                            value={localVibeMsg}
                            onChange={e => setLocalVibeMsg(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-turquoise transition-colors h-20 resize-none"
                            placeholder="Conditions, ambiance, conseils..."
                        />
                        <button
                            onClick={() => save({ statusMessage: localVibeMsg }, 'Message vigie enregistré')}
                            disabled={localVibeMsg === content.statusMessage}
                            className="w-full py-3 bg-white/10 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-turquoise hover:text-abysse transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                        >
                            <Save size={12} /> Enregistrer le message
                        </button>
                    </div>
                </div>

                <div className="py-6 text-center opacity-20">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em]">CNC Cockpit 3.0 • Vue unifiée</p>
                </div>
            </div>
        </div>
    );
}

export default function CockpitPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-turquoise" size={32} /></div>}>
            <CockpitContent />
        </Suspense>
    );
}

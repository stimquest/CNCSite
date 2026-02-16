"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useContent } from '@/contexts/ContentContext';
import { Check, AlertCircle, XCircle, Loader2, ArrowLeft, Home, Bell, Save, Star, Waves, Wind } from 'lucide-react';
import Link from 'next/link';

const MAGIC_KEY = "CNC2026";

const TAGS_OPTIONS = [
    { label: 'Vent fort', icon: '💨' },
    { label: 'Vent faible', icon: '🌬' },
    { label: 'Clapot', icon: '🌊' },
    { label: 'Pluie', icon: '🌧' },
    { label: 'Rafales', icon: '⚠️' },
    { label: 'Marée basse', icon: '⛵' },
    { label: 'Marée haute', icon: '🌊' },
];

const STATUS_LEVELS = [
    { id: 'OPEN', label: 'Ouverte', color: 'bg-emerald-500', border: 'border-emerald-400', icon: <Check size={16} /> },
    { id: 'RESTRICTED', label: 'Adaptée', color: 'bg-amber-400', border: 'border-amber-300', icon: <Waves size={16} /> },
    { id: 'CLOSED', label: 'Suspendue', color: 'bg-rose-500', border: 'border-rose-400', icon: <XCircle size={16} /> }
];

function CockpitContent() {
    const searchParams = useSearchParams();
    const key = searchParams.get('key');
    const {
        spotStatus, statusMessage,
        charStatus, charMessage, charTags,
        marcheStatus, marcheMessage, marcheTags,
        nautiqueStatus, nautiqueMessage, nautiqueTags,
        setSpotStatus, setStatusMessage,
        setCharStatus, setCharMessage, setCharTags,
        setMarcheStatus, setMarcheMessage, setMarcheTags,
        setNautiqueStatus, setNautiqueMessage, setNautiqueTags,
        refreshData
    } = useContent();

    const [isSaving, setIsSaving] = useState(false);

    // Local state for textareas
    const [localMessage, setLocalMessage] = useState(statusMessage || '');
    const [localCharMsg, setLocalCharMsg] = useState(charMessage || '');
    const [localMarcheMsg, setLocalMarcheMsg] = useState(marcheMessage || '');
    const [localNautiqueMsg, setLocalNautiqueMsg] = useState(nautiqueMessage || '');

    const [activeTab, setActiveTab] = useState<'GENERAL' | 'CHAR' | 'MARCHE' | 'NAUTIQUE'>('GENERAL');

    useEffect(() => {
        setLocalMessage(statusMessage || '');
        setLocalCharMsg(charMessage || '');
        setLocalMarcheMsg(marcheMessage || '');
        setLocalNautiqueMsg(nautiqueMessage || '');
    }, [statusMessage, charMessage, marcheMessage, nautiqueMessage]);

    const isAuthorized = key === MAGIC_KEY;

    const optimisticUpdate = (field: string, value: any) => {
        switch (field) {
            case 'spotStatus': setSpotStatus(value); break;
            case 'statusMessage': setStatusMessage(value); break;
            case 'charStatus': setCharStatus(value); break;
            case 'charMessage': setCharMessage(value); break;
            case 'charTags': setCharTags(value); break;
            case 'marcheStatus': setMarcheStatus(value); break;
            case 'marcheMessage': setMarcheMessage(value); break;
            case 'marcheTags': setMarcheTags(value); break;
            case 'nautiqueStatus': setNautiqueStatus(value); break;
            case 'nautiqueMessage': setNautiqueMessage(value); break;
            case 'nautiqueTags': setNautiqueTags(value); break;
        }
    };

    const handleQuickUpdate = async (field: string, value: any, extraFields?: Record<string, any>) => {
        optimisticUpdate(field, value);
        if (extraFields) {
            Object.entries(extraFields).forEach(([f, v]) => optimisticUpdate(f, v));
        }

        setIsSaving(true);
        try {
            const patch: any = { [field]: value };
            if (extraFields) {
                Object.assign(patch, extraFields);
            }

            const res = await fetch('/api/cockpit/direct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'PATCH', patch })
            });

            if (!res.ok) throw new Error('Update failed');
            // No alert for simple status changes, but alert for saves with messages
            if (extraFields) alert("✅ Changement enregistré");
        } catch (err) {
            console.error("Cockpit Error:", err);
            alert("⚠️ Erreur lors de l'enregistrement.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleNotify = async (activity: string, status: string, message: string) => {
        const levelLabel = STATUS_LEVELS.find(l => l.id === status)?.label || status;
        const confirmMsg = `Envoyer une alerte Push : ${activity} -> ${levelLabel} ?`;
        if (!confirm(confirmMsg)) return;

        setIsSaving(true);
        try {
            const title = `Direct ${activity} : ${levelLabel}`;
            const content = message || `Le statut pour ${activity} est passé à : ${levelLabel}. Consultez le site pour plus de détails.`;

            const res = await fetch('/api/cockpit/direct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'PATCH',
                    patch: {},
                    notify: { title, content }
                })
            });

            if (!res.ok) throw new Error('Notification failed');
            alert("🚀 Push envoyé !");
        } catch (err) {
            console.error("Notify Error:", err);
            alert("❌ Erreur alertes OneSignal");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="size-20 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-6 font-bold">
                    <XCircle size={40} />
                </div>
                <h1 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Accès Refusé</h1>
                <Link href="/" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest">Retour Accueil</Link>
            </div>
        );
    }

    const NuancedSelector = ({ current, onSelect }: { current: string, onSelect: (id: string) => void }) => (
        <div className="grid grid-cols-1 gap-2">
            {STATUS_LEVELS.map((level) => (
                <button
                    key={level.id}
                    onClick={() => onSelect(level.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-95 ${current === level.id
                        ? `${level.color} ${level.border} text-abysse shadow-lg`
                        : 'bg-white/5 border-white/10 text-slate-400 opacity-60'
                        }`}
                >
                    <div className={`size-8 rounded-full flex items-center justify-center ${current === level.id ? 'bg-white/30' : 'bg-white/10'}`}>
                        {level.icon}
                    </div>
                    <span className="text-xs font-black uppercase italic tracking-widest">{level.label}</span>
                    {current === level.id && <Check className="ml-auto" size={16} strokeWidth={3} />}
                </button>
            ))}
        </div>
    );

    const TagSelector = ({ tags, onToggle }: { tags: string[], onToggle: (newTags: string[]) => void }) => (
        <div className="flex flex-wrap gap-2">
            {TAGS_OPTIONS.map((tag) => {
                const isSelected = (tags || []).includes(tag.label);
                return (
                    <button
                        key={tag.label}
                        onClick={() => {
                            const next = isSelected
                                ? tags.filter(t => t !== tag.label)
                                : [...(tags || []), tag.label];
                            onToggle(next);
                        }}
                        className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight flex items-center gap-2 border transition-all ${isSelected
                                ? 'bg-turquoise border-turquoise text-abysse shadow-md'
                                : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                            }`}
                    >
                        <span>{tag.icon}</span>
                        {tag.label}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans p-4 flex flex-col max-w-md mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pt-4 shrink-0">
                <div className="flex items-center gap-2 text-turquoise">
                    <Home size={24} />
                    <h1 className="text-lg font-black uppercase italic tracking-tighter leading-none">Cockpit Cmd</h1>
                </div>
                <div className="flex items-center gap-2">
                    {isSaving && <Loader2 className="animate-spin text-turquoise" size={16} />}
                    <Link href="/" className="size-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400">
                        <ArrowLeft size={20} />
                    </Link>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar whitespace-nowrap shrink-0">
                {[
                    { id: 'GENERAL', label: 'Vibe Générale' },
                    { id: 'CHAR', label: 'Char' },
                    { id: 'MARCHE', label: 'Marche' },
                    { id: 'NAUTIQUE', label: 'Nautique' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-turquoise text-abysse' : 'bg-white/5 text-slate-500 border border-white/10'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pb-20">
                {/* --- TAB: GENERAL (Spot Vibe) --- */}
                {activeTab === 'GENERAL' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 block">Vibe du plan d'eau</label>
                            <NuancedSelector current={spotStatus} onSelect={(s) => handleQuickUpdate('spotStatus', s)} />
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Message de La Vigie</label>
                            <textarea
                                value={localMessage}
                                onChange={(e) => setLocalMessage(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-turquoise transition-colors h-32"
                                placeholder="Conditions météo, ambiance, conseils..."
                            />
                            <button
                                onClick={() => handleQuickUpdate('spotStatus', spotStatus, { statusMessage: localMessage })}
                                disabled={isSaving || localMessage === statusMessage}
                                className="w-full py-4 bg-white/10 rounded-xl font-black uppercase text-xs hover:bg-turquoise hover:text-abysse transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                            >
                                <Save size={14} /> Enregistrer la Vibe
                            </button>
                        </div>
                    </div>
                )}

                {/* --- TAB: ACTIVITÉS --- */}
                {['CHAR', 'MARCHE', 'NAUTIQUE'].includes(activeTab) && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {(() => {
                            const configs = {
                                CHAR: { label: 'Décision Char à Voile', status: charStatus, field: 'charStatus', msg: localCharMsg, setMsg: setLocalCharMsg, dbMsg: charMessage, msgField: 'charMessage', tags: charTags, tagsField: 'charTags' },
                                MARCHE: { label: 'Décision Marche Aquat.', status: marcheStatus, field: 'marcheStatus', msg: localMarcheMsg, setMsg: setLocalMarcheMsg, dbMsg: marcheMessage, msgField: 'marcheMessage', tags: marcheTags, tagsField: 'marcheTags' },
                                NAUTIQUE: { label: 'Décision Voile / Nautique', status: nautiqueStatus, field: 'nautiqueStatus', msg: localNautiqueMsg, setMsg: setLocalNautiqueMsg, dbMsg: nautiqueMessage, msgField: 'nautiqueMessage', tags: nautiqueTags, tagsField: 'nautiqueTags' }
                            };
                            const config = configs[activeTab as keyof typeof configs];

                            return (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 block">{config.label}</label>
                                        <NuancedSelector current={config.status || 'OPEN'} onSelect={(s) => handleQuickUpdate(config.field, s)} />
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Badges (Automates)</label>
                                            <TagSelector
                                                tags={config.tags}
                                                onToggle={(next) => handleQuickUpdate(config.tagsField, next)}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Note Précise (Raison / Décalage)</label>
                                            <textarea
                                                placeholder="Ex: Vent trop faible pour rouler..."
                                                value={config.msg}
                                                onChange={(e) => config.setMsg(e.target.value)}
                                                className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-turquoise transition-colors h-24"
                                            />
                                        </div>

                                        <button
                                            onClick={() => handleQuickUpdate(config.field, (config.status || 'OPEN'), { [config.msgField]: config.msg })}
                                            disabled={isSaving || config.msg === config.dbMsg}
                                            className="w-full py-4 bg-white/10 rounded-xl font-black uppercase text-xs hover:bg-turquoise hover:text-abysse transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                                        >
                                            <Save size={14} /> Enregistrer la note
                                        </button>

                                        <div className="pt-6 border-t border-white/10 space-y-3">
                                            <p className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-widest leading-tight">Envoyer info aux clients</p>
                                            <button
                                                onClick={() => handleNotify(activeTab, (config.status || 'OPEN'), config.msg)}
                                                disabled={isSaving}
                                                className="w-full py-5 bg-abysse text-white border border-white/10 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-lg flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 transition-all hover:bg-turquoise hover:text-abysse"
                                            >
                                                <Bell size={18} /> Alerter les Clients
                                            </button>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                )}
            </div>

            <div className="py-6 text-center shrink-0 mb-4 opacity-30">
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">CNC Cockpit 2.0 • Decisional Mode</p>
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

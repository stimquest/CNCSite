"use client";

import React from 'react';
import { useLiveStatus } from '@/contexts/LiveStatusContext';
import { Wind, Waves, Navigation, Anchor, Users } from 'lucide-react';

const STATUS_STYLES = {
    OPEN: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
    RESTRICTED: { bg: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-400' },
    CLOSED: { bg: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' },
    INACTIVE: { bg: 'bg-slate-50 text-slate-400 border-slate-100', dot: 'bg-slate-300' },
};

const getNormalizedStatus = (status: string) => {
    if (!status) return 'CLOSED';
    const s = status.toUpperCase();
    if (s === 'INACTIVE') return 'INACTIVE';
    if (['OPEN', 'IDEAL', 'FAVORABLE'].includes(s)) return 'OPEN';
    if (['RESTRICTED', 'VARIABLE'].includes(s)) return 'RESTRICTED';
    return 'CLOSED';
};

const getFixedLabel = (key: string, normalizedStatus: string) => {
    if (key === 'char') {
        if (normalizedStatus === 'OPEN') return 'Confirmée';
        if (normalizedStatus === 'RESTRICTED') return 'Cond. techniques';
        return 'Annulée';
    }
    if (key === 'nautique') {
        if (normalizedStatus === 'OPEN') return 'Favorables';
        if (normalizedStatus === 'RESTRICTED') return 'Tech. (Exp.)';
        return 'Déconseillée';
    }
    if (key === 'marche') {
        if (normalizedStatus === 'INACTIVE') return 'Pas de séance';
        if (normalizedStatus === 'OPEN') return 'Confirmée';
        if (normalizedStatus === 'RESTRICTED') return 'Parcours adapté';
        return 'Reportée';
    }
    return '';
};

const getStageLabel = (normalizedStatus: string) => {
    if (normalizedStatus === 'INACTIVE') return 'Hors Période';
    if (normalizedStatus === 'OPEN') return 'Confirmée';
    if (normalizedStatus === 'RESTRICTED') return 'Cond. techniques';
    return 'Annulée';
};

export const StatusDashboard: React.FC = () => {
    const content = useLiveStatus();
    const { stageDefinitions, stageStatuses } = content;

    const fixedItems = [
        { key: 'char', label: 'Char à Voile', statusKey: 'charStatus', msgKey: 'charMessage', icon: <Wind size={14} /> },
        { key: 'nautique', label: 'Sports Nautiques', statusKey: 'nautiqueStatus', msgKey: 'nautiqueMessage', icon: <Navigation size={14} /> },
        { key: 'marche', label: 'Marche Aqa.', statusKey: 'marcheStatus', msgKey: 'marcheMessage', icon: <Waves size={14} /> },
    ];

    return (
        <div className="space-y-4">
            {/* Section 1 : Pratiques & activités (items fixes) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Wind size={12} className="text-turquoise" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-abysse/60">
                        Pratiques & Activités
                    </h3>
                </div>
                <div className="divide-y divide-slate-50">
                    {fixedItems.map(item => {
                        const rawStatus = (content as any)[item.statusKey] as string;
                        const msg = (content as any)[item.msgKey] as string;
                        const normalized = getNormalizedStatus(rawStatus);
                        const styles = STATUS_STYLES[normalized as keyof typeof STATUS_STYLES] || STATUS_STYLES.CLOSED;
                        const label = getFixedLabel(item.key, normalized);

                        return (
                            <div key={item.key} className="px-4 py-3 flex items-center gap-3">
                                <div className="text-slate-400 shrink-0">{item.icon}</div>
                                <span className="text-xs font-semibold text-abysse flex-1 min-w-0">{item.label}</span>
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold shrink-0 ${styles.bg}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                                    {label}
                                </div>
                                {msg && (
                                    <span className="text-[10px] text-slate-400 truncate max-w-30" title={msg}>{msg}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Section 2 : Stages (dynamiques) */}
            {stageDefinitions.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <Anchor size={12} className="text-turquoise" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-abysse/60">
                            Stages École de Voile
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {stageDefinitions.map(stage => {
                            const entry = stageStatuses[stage.key];
                            const rawStatus = (entry?.status as string) || 'OPEN';
                            const msg = entry?.message || '';
                            const normalized = getNormalizedStatus(rawStatus);
                            const styles = STATUS_STYLES[normalized as keyof typeof STATUS_STYLES] || STATUS_STYLES.CLOSED;
                            const label = getStageLabel(normalized);

                            return (
                                <div key={stage.key} className="px-4 py-3 flex items-center gap-3">
                                    <Users size={14} className="text-slate-400 shrink-0" />
                                    <span className="text-xs font-semibold text-abysse flex-1 min-w-0">{stage.label}</span>
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold shrink-0 ${styles.bg}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                                        {label}
                                    </div>
                                    {msg && (
                                        <span className="text-[10px] text-slate-400 truncate max-w-30" title={msg}>{msg}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

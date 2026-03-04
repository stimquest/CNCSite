"use client";

import React from 'react';
import { useContent } from '@/contexts/ContentContext';
import { SpotStatus } from '@/types';

const ACTIVITIES = [
    { key: 'char', label: 'Char à Voile', statusKey: 'charStatus' as const, messageKey: 'charMessage' as const },
    { key: 'nautique', label: 'Sports Nautiques', statusKey: 'nautiqueStatus' as const, messageKey: 'nautiqueMessage' as const },
    { key: 'minimousses', label: 'Mini-Mousses', statusKey: 'stagesMiniMoussesStatus' as const, messageKey: 'stagesMiniMoussesMessage' as const },
    { key: 'moussaillons', label: 'Moussaillons', statusKey: 'stagesMoussaillonsStatus' as const, messageKey: 'stagesMoussaillonsMessage' as const },
    { key: 'initiation', label: 'Initiation', statusKey: 'stagesInitiationStatus' as const, messageKey: 'stagesInitiationMessage' as const },
    { key: 'perf', label: 'Perfectionnement', statusKey: 'stagesPerfStatus' as const, messageKey: 'stagesPerfMessage' as const },
];

type StatusKey = 'OPEN' | 'RESTRICTED' | 'CLOSED';

const STATUS_CONFIG: Record<StatusKey, { label: string; dot: string; text: string; border: string }> = {
    OPEN: { label: 'Maintenu', dot: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200' },
    RESTRICTED: { label: 'Adapté', dot: 'bg-amber-400', text: 'text-amber-700', border: 'border-amber-200' },
    CLOSED: { label: 'Annulé', dot: 'bg-rose-500', text: 'text-rose-700', border: 'border-rose-200' },
};

const getConfig = (status: string) => {
    if (status === 'OPEN' || status === 'IDEAL' || status === 'FAVORABLE') return STATUS_CONFIG.OPEN;
    if (status === 'RESTRICTED' || status === 'VARIABLE') return STATUS_CONFIG.RESTRICTED;
    return STATUS_CONFIG.CLOSED;
};

export const StatusDashboard: React.FC = () => {
    const content = useContent();

    return (
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                    État des activités
                </span>
            </div>

            {/* Lignes */}
            <div className="divide-y divide-slate-100">
                {ACTIVITIES.map((act) => {
                    const rawStatus = content[act.statusKey] as string;
                    const message = content[act.messageKey] as string;
                    const cfg = getConfig(rawStatus);

                    return (
                        <div key={act.key} className="flex items-center gap-4 px-5 py-3.5">
                            {/* Dot */}
                            <span className={`shrink-0 size-2 rounded-full ${cfg.dot}`} />

                            {/* Nom */}
                            <span className="flex-1 text-sm font-bold text-slate-800 truncate">
                                {act.label}
                            </span>

                            {/* Message éventuel */}
                            {message && (
                                <span className="hidden sm:block text-[11px] text-slate-400 italic truncate max-w-[200px]">
                                    {message}
                                </span>
                            )}

                            {/* Badge statut */}
                            <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${cfg.text} ${cfg.border} bg-white`}>
                                {cfg.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatusDashboard;

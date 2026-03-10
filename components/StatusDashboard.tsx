"use client";

import React from 'react';
import { useContent } from '@/contexts/ContentContext';
import { Wind, Waves, Navigation, Anchor, Users, Compass, Activity as ActivityIcon } from 'lucide-react';

const SECTIONS = [
    {
        title: "Pratique Adulte & Libre",
        icon: <ActivityIcon size={12} className="text-turquoise" />,
        items: [
            { key: 'char', label: 'Char à Voile', statusKey: 'charStatus', msgKey: 'charMessage', cat: 'encadree', icon: <Wind size={14} /> },
            { key: 'nautique', label: 'Sports Nautiques', statusKey: 'nautiqueStatus', msgKey: 'nautiqueMessage', cat: 'autonome', icon: <Navigation size={14} /> },
            { key: 'marche', label: 'Marche Aqa.', statusKey: 'marcheStatus', msgKey: 'marcheMessage', cat: 'marche', icon: <Waves size={14} /> },
        ]
    },
    {
        title: "Stages École de Voile",
        icon: <Anchor size={12} className="text-turquoise" />,
        items: [
            { key: 'minimousses', label: 'Mini-Mousses', statusKey: 'stagesMiniMoussesStatus', msgKey: 'stagesMiniMoussesMessage', cat: 'encadree', icon: <Users size={14} /> },
            { key: 'moussaillons', label: 'Moussaillons', statusKey: 'stagesMoussaillonsStatus', msgKey: 'stagesMoussaillonsMessage', cat: 'encadree', icon: <Users size={14} /> },
            { key: 'initiation', label: 'Initiation', statusKey: 'stagesInitiationStatus', msgKey: 'stagesInitiationMessage', cat: 'encadree', icon: <Users size={14} /> },
            { key: 'perf', label: 'Perfectionnement', statusKey: 'stagesPerfStatus', msgKey: 'stagesPerfMessage', cat: 'encadree', icon: <Users size={14} /> },
        ]
    }
];

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

const getLabel = (cat: string, normalizedStatus: string) => {
    if (cat === 'encadree') {
        if (normalizedStatus === 'INACTIVE') return 'Hors Période';
        if (normalizedStatus === 'OPEN') return 'Confirmée';
        if (normalizedStatus === 'RESTRICTED') return 'Cond. techniques';
        return 'Annulée';
    }
    if (cat === 'autonome') {
        if (normalizedStatus === 'OPEN') return 'Favorables';
        if (normalizedStatus === 'RESTRICTED') return 'Tech. (Exp.)';
        return 'Déconseillée';
    }
    if (cat === 'marche') {
        if (normalizedStatus === 'OPEN') return 'Confirmée';
        if (normalizedStatus === 'RESTRICTED') return 'Parcours adapté';
        return 'Reportée';
    }
    return '';
};

export const StatusDashboard: React.FC = () => {
    const content = useContent();

    return (
        <div className="space-y-4">
            {SECTIONS.map((section, sIdx) => (
                <div key={sIdx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* En-tête de section */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        {section.icon}
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-abysse/60">
                            {section.title}
                        </h3>
                    </div>

                    {/* Contenu */}
                    <div className="p-2 space-y-1.5">
                        {section.items.map((item) => {
                            const rawStatus = content[item.statusKey as keyof typeof content] as string;
                            const message = content[item.msgKey as keyof typeof content] as string;
                            const normalized = getNormalizedStatus(rawStatus);
                            const style = STATUS_STYLES[normalized as keyof typeof STATUS_STYLES];
                            const label = getLabel(item.cat, normalized);

                            return (
                                <div key={item.key} className="flex flex-col p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 transition-all group">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5 text-abysse overflow-hidden">
                                            <span className="opacity-40 text-turquoise group-hover:scale-110 transition-transform">{item.icon}</span>
                                            <span className="text-[13px] font-black italic tracking-tight truncate">{item.label}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border shrink-0 ${style.bg}`}>
                                            <span className={`size-1.5 rounded-full ${style.dot} animate-pulse`} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
                                        </div>
                                    </div>
                                    {message && (
                                        <p className="text-[11px] text-slate-500 font-medium leading-snug mt-2 ml-7 border-l-2 border-slate-200 pl-2.5 opacity-90">
                                            {message}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatusDashboard;

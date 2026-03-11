"use client";

import React, { useEffect } from 'react';
import { CalendarDays, Ship } from 'lucide-react';
import { ActivityType } from '@/types';

interface Props {
    type: string;
    idsString?: string;
    plannings: any[];
    charPlannings: any[];
    marchePlannings: any[];
}

const ACTIVITY_OPTIONS: { label: string, value: ActivityType }[] = [
    { label: 'Piscine / Cerf-volant', value: 'piscine' },
    { label: 'Optimist', value: 'optimist' },
    { label: 'Catamaran', value: 'catamaran' },
    { label: 'Paddle / Kayak', value: 'paddle' },
    { label: 'Char à voile', value: 'char' },
];

export default function MultiPrintClient({ type, idsString, plannings, charPlannings, marchePlannings }: Props) {
    const ids = idsString ? idsString.split(',') : [];

    useEffect(() => {
        if (ids.length > 0) {
            const timer = setTimeout(() => {
                window.print();
            }, 800); // slightly longer wait for multiple tables
            return () => clearTimeout(timer);
        }
    }, [ids]);

    if (!type || ids.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest">Aucun planning sélectionné pour l'impression.</p>
            </div>
        );
    }

    // Process each ID based on type
    const renderedPlannings = ids.map((id, index) => {
        let titleLabel = '';
        let selectedStage: any = null;
        let selectedCharPeriod: any = null;
        let selectedMarchePeriod: any = null;

        if (type === 'stages') {
            selectedStage = plannings.find((p) => p._id === id);
            titleLabel = selectedStage?.title || 'Planning Stages';
        } else if (type === 'char') {
            selectedCharPeriod = charPlannings.find((p) => p._id === id);
            titleLabel = selectedCharPeriod?.title || 'Planning Char à Voile';
        } else if (type === 'marche') {
            selectedMarchePeriod = marchePlannings.find((p) => p._id === id);
            titleLabel = selectedMarchePeriod?.title || 'Planning Marche Aquatique';
        }

        if (!selectedStage && !selectedCharPeriod && !selectedMarchePeriod) return null;

        return (
            <div key={id} className={`break-inside-avoid py-4 px-4 md:px-8 font-sans bg-white ${index > 0 && index % 2 === 0 ? 'break-before-page' : ''} ${index % 2 !== 0 ? 'mt-4 mb-2 pb-2 border-t border-slate-300' : 'pb-4 mb-2'}`}>
                <div className="flex flex-col gap-4">
                    {/* Header Print - Minimalist */}
                    <div className="flex justify-between items-end border-b-2 border-abysse pb-2">
                        <div>
                            <h1 className="text-2xl print:text-xl font-black uppercase italic text-abysse tracking-tighter">
                                C.N.C <span className="text-turquoise">COUTAINVILLE</span>
                            </h1>
                        </div>
                        <div className="text-right">
                            <h2 className="text-lg print:text-base font-black uppercase text-abysse leading-none">
                                {titleLabel}
                            </h2>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                Édité le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* DATA DISPLAY: STAGES */}
                    {type === 'stages' && selectedStage && (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-2 print:p-1.5 text-left font-black uppercase text-[10px] text-slate-400 border-r border-slate-200">
                                            Groupe / Jour
                                        </th>
                                        {selectedStage.days?.map((day: any, dIdx: number) => (
                                            <th key={dIdx} className="p-2 print:p-1.5 text-left border-r border-slate-200 last:border-0">
                                                <div className="font-black text-xs uppercase text-abysse">{day.name}</div>
                                                <div className="text-[9px] font-bold text-slate-400">
                                                    {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { id: 'miniMousses', label: 'Mini-Mousses' },
                                        { id: 'mousses', label: 'Moussaillons' },
                                        { id: 'initiation', label: 'Initiation' },
                                        { id: 'perfectionnement', label: 'Perfectionnement' }
                                    ].map((group) => (
                                        <tr key={group.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-2 print:p-1.5 bg-slate-50/50 font-black text-[10px] uppercase text-abysse border-r border-slate-200 tracking-tight leading-tight">
                                                {group.label}
                                            </td>
                                            {selectedStage.days?.map((day: any, dIdx: number) => {
                                                const session = (day as any)[group.id];
                                                const isRaid = day.raidTarget === group.id;

                                                let activity = "";
                                                let time = "";
                                                let desc = "";

                                                if (typeof session === 'object' && session !== null) {
                                                    activity = Array.isArray(session) ? session[0]?.activity : session.activity;
                                                    time = Array.isArray(session) ? session[0]?.time : session.time;
                                                    desc = Array.isArray(session) ? session[0]?.description : session.description;
                                                } else if (typeof session === 'string') {
                                                    time = session;
                                                }

                                                const actLabel = activity ? (ACTIVITY_OPTIONS.find(o => o.value === activity)?.label.split(' / ')[0] || activity) : "";

                                                return (
                                                    <td key={dIdx} className={`p-2 print:p-1.5 border-r border-slate-200 last:border-0 ${isRaid ? 'bg-orange-50' : ''}`}>
                                                        {isRaid ? (
                                                            <div className="flex flex-col items-center justify-center h-full gap-0.5">
                                                                <Ship size={14} className="text-orange-500" />
                                                                <span className="text-[9px] font-black uppercase text-orange-600 tracking-widest">EXPÉDITION</span>
                                                                <span className="text-[9px] font-bold text-abysse">{time}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-0.5">
                                                                <div className="text-[9px] font-black uppercase text-turquoise leading-tight">
                                                                    {actLabel}
                                                                </div>
                                                                <div className="text-[10px] font-black text-abysse">
                                                                    {time}
                                                                </div>
                                                                {desc && (
                                                                    <div className="text-[8px] text-slate-500 font-medium leading-tight italic line-clamp-2">
                                                                        {desc}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* DATA DISPLAY: CHAR / MARCHE */}
                    {(type === 'char' || type === 'marche') && (selectedCharPeriod || selectedMarchePeriod) && (
                        <div className="space-y-8">
                            {((type === 'char' ? selectedCharPeriod : selectedMarchePeriod)?.weeks || []).map((week: any, wIdx: number) => (
                                <div key={wIdx} className="break-inside-avoid">
                                    <div className="flex items-center gap-3 mb-4 bg-abysse text-white px-4 py-2 rounded-lg w-fit">
                                        <CalendarDays size={18} />
                                        <span className="font-black uppercase tracking-widest text-sm">{week.title || `Semaine ${wIdx + 1}`}</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        {week.days?.map((day: any, dIdx: number) => (
                                            <div key={dIdx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                                                    <span className="font-black text-sm uppercase text-abysse">{day.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">
                                                        {new Date(day.date).getDate()}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    {day.sessions?.map((sess: any, sIdx: number) => (
                                                        <div key={sIdx} className="bg-slate-50 p-2 rounded-lg text-center font-black text-xs text-abysse border border-slate-100">
                                                            {sess.time}
                                                        </div>
                                                    ))}
                                                    {(!day.sessions || day.sessions.length === 0) && (
                                                        <div className="text-[10px] text-slate-300 italic text-center py-2">Pas de séance</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    });

    return (
        <div className="bg-white min-h-screen">
            {renderedPlannings}
        </div>
    );
}


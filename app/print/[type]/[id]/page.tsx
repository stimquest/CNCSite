"use client";

import React, { useEffect, use } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { CalendarDays, Ship } from 'lucide-react';
import { ActivityType } from '@/types';

type PrintType = 'stages' | 'char' | 'marche';

interface Props {
    params: Promise<{
        type: PrintType;
        id: string;
    }>;
}

const ACTIVITY_OPTIONS: { label: string, value: ActivityType }[] = [
    { label: 'Piscine / Cerf-volant', value: 'piscine' },
    { label: 'Optimist', value: 'optimist' },
    { label: 'Catamaran', value: 'catamaran' },
    { label: 'Paddle / Kayak', value: 'paddle' },
    { label: 'Char à voile', value: 'char' },
];

export default function PrintPage({ params }: Props) {
    const { type, id } = use(params);
    const { plannings, charPlannings, marchePlannings } = useContent();

    useEffect(() => {
        // Wait a tiny bit for render to finish, then pop print dialog
        const timer = setTimeout(() => {
            window.print();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

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

    // Still loading or not found
    if (!selectedStage && !selectedCharPeriod && !selectedMarchePeriod) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest">Chargement des données...</p>
            </div>
        );
    }

    return (
        <div className="p-8 md:p-12 font-sans bg-white min-h-screen">
            <div className="flex flex-col gap-10">
                {/* Header Print - Minimalist */}
                <div className="flex justify-between items-end border-b-2 border-abysse pb-4">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic text-abysse tracking-tighter">
                            C.N.C <span className="text-turquoise">COUTAINVILLE</span>
                        </h1>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-black uppercase text-abysse leading-none">
                            {titleLabel}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
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
                                    <th className="p-4 text-left font-black uppercase text-xs text-slate-400 border-r border-slate-200">
                                        Groupe / Jour
                                    </th>
                                    {selectedStage.days?.map((day: any, dIdx: number) => (
                                        <th key={dIdx} className="p-4 text-left border-r border-slate-200 last:border-0">
                                            <div className="font-black text-sm uppercase text-abysse">{day.name}</div>
                                            <div className="text-[10px] font-bold text-slate-400">
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
                                        <td className="p-4 bg-slate-50/50 font-black text-xs uppercase text-abysse border-r border-slate-200 tracking-tight leading-tight">
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
                                                <td key={dIdx} className={`p-4 border-r border-slate-200 last:border-0 ${isRaid ? 'bg-orange-50' : ''}`}>
                                                    {isRaid ? (
                                                        <div className="flex flex-col items-center justify-center h-full gap-1">
                                                            <Ship size={16} className="text-orange-500" />
                                                            <span className="text-[10px] font-black uppercase text-orange-600 tracking-widest">EXPÉDITION</span>
                                                            <span className="text-[9px] font-bold text-abysse">{time}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-1">
                                                            <div className="text-[10px] font-black uppercase text-turquoise leading-tight">
                                                                {actLabel}
                                                            </div>
                                                            <div className="text-[11px] font-black text-abysse">
                                                                {time}
                                                            </div>
                                                            {desc && (
                                                                <div className="text-[9px] text-slate-500 font-medium leading-tight italic">
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
}

"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Anchor, Waves, ChevronRight, Calendar } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DayEntry {
  _key: string;
  name: string;
  date: string;
  isRaidDay?: boolean;
  raidTarget?: string;
  miniMousses?: { time?: string; activity?: string; description?: string };
  mousses?: { time?: string; activity?: string; description?: string };
  initiation?: string;
  perfectionnement?: string;
  sessions?: { _key: string; time: string }[];
}
interface WeeklyPlanning { _id: string; title: string; startDate: string; endDate: string; days: DayEntry[]; }
interface CharWeek { _key: string; title: string; startDate: string; endDate: string; days: DayEntry[]; }
interface CharPlanning { _id: string; title: string; startDate: string; endDate: string; weeks: CharWeek[]; }
interface PlanningsData { plannings: WeeklyPlanning[]; charPlannings: CharPlanning[]; marchePlannings: CharPlanning[]; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ACT: Record<string, string> = {
  piscine: 'Piscine', optimist: 'Optimist', catamaran: 'Catamaran', paddle: 'Paddle', char: 'Char',
};
function isCurrentWeek(s: string, e: string) {
  const now = new Date(), end = new Date(e); end.setHours(23, 59, 59);
  return now >= new Date(s) && now <= end;
}
function fmtDate(d: string) { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); }
function isToday(d: string) { return new Date(d).toDateString() === new Date().toDateString(); }

// ─── Stages Voile ─────────────────────────────────────────────────────────────
const StagesGrid: React.FC<{ week: WeeklyPlanning }> = ({ week }) => {
  const groups = [
    { key: 'miniMousses',      label: 'Mini-Mousses',      color: '#a78bfa' },
    { key: 'mousses',          label: 'Moussaillons',      color: '#34d399' },
    { key: 'initiation',       label: 'Initiation',        color: '#60a5fa' },
    { key: 'perfectionnement', label: 'Perfectionnement',  color: '#00A9CE' },
  ];
  const days = week.days.slice(0, 5);

  return (
    <div className="flex flex-col h-full">
      {/* Titre */}
      <div className="flex items-center gap-2 mb-2 shrink-0">
        <div className="size-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(0,169,206,0.15)', border: '1px solid rgba(0,169,206,0.3)' }}>
          <Anchor size={14} className="text-turquoise" />
        </div>
        <span className="text-sm font-black uppercase italic tracking-tight text-white">Stages Voile</span>
        <span className="text-[10px] font-bold text-white/30 ml-1">{fmtDate(week.startDate)} → {fmtDate(week.endDate)}</span>
      </div>

      {/* Grille flex pleine hauteur */}
      <div className="flex-1 min-h-0 flex flex-col rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,169,206,0.2)' }}>
        {/* Header jours */}
        <div className="flex shrink-0" style={{ background: 'rgba(0,169,206,0.1)', borderBottom: '1px solid rgba(0,169,206,0.2)' }}>
          <div className="flex items-center px-4 shrink-0" style={{ width: 160 }}>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/25">Groupe</span>
          </div>
          {days.map(day => (
            <div key={day._key} className="flex-1 flex flex-col items-center justify-center py-2 border-l" style={{ borderColor: 'rgba(255,255,255,0.07)', background: isToday(day.date) ? 'rgba(0,169,206,0.25)' : undefined }}>
              <span className={`text-xs font-black uppercase tracking-wider ${isToday(day.date) ? 'text-turquoise' : 'text-white/60'}`}>{day.name}</span>
              <span className={`text-[9px] font-bold ${isToday(day.date) ? 'text-turquoise/60' : 'text-white/25'}`}>{fmtDate(day.date)}</span>
            </div>
          ))}
        </div>

        {/* Lignes groupes — chacune flex: 1 */}
        {groups.map((g, gi) => (
          <div key={g.key} className="flex flex-1 min-h-0 border-b last:border-b-0" style={{ borderColor: 'rgba(255,255,255,0.07)', background: gi % 2 === 0 ? 'rgba(255,255,255,0.02)' : undefined }}>
            <div className="flex items-center gap-2 px-3 border-r shrink-0" style={{ width: 160, borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="size-2 rounded-full shrink-0" style={{ background: g.color }} />
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: g.color }}>{g.label}</span>
            </div>
            {days.map(day => {
              const raw = (day as any)[g.key];
              let time = '', label = '';
              if (day.isRaidDay && day.raidTarget === g.key) { label = 'RAID'; }
              else if (typeof raw === 'string') { time = raw; }
              else if (raw && typeof raw === 'object') { time = raw.time || ''; label = raw.activity ? (ACT[raw.activity] || raw.activity) : (raw.description || ''); }
              return (
                <div key={day._key} className="flex-1 flex flex-col items-center justify-center border-l" style={{ borderColor: 'rgba(255,255,255,0.07)', background: isToday(day.date) ? 'rgba(0,169,206,0.07)' : undefined }}>
                  {label === 'RAID'
                    ? <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,146,60,0.2)', color: '#fb923c' }}>RAID</span>
                    : (!time && !label) ? <span className="text-white/15 text-xl">—</span>
                    : <>
                        {time  && <span className="text-sm font-black text-white leading-tight">{time}</span>}
                        {label && <span className="text-[9px] text-white/40 leading-tight mt-0.5">{label}</span>}
                      </>
                  }
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Char / Marche ────────────────────────────────────────────────────────────
const SessionGrid: React.FC<{
  label: string; icon: React.ReactNode; color: string;
  week: CharWeek | undefined;
}> = ({ label, icon, color, week }) => {
  if (!week) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 rounded-xl" style={{ border: `1px solid ${color}25` }}>
      <Calendar size={24} style={{ color: `${color}40` }} />
      <span className="text-xs font-black uppercase tracking-widest" style={{ color: `${color}40` }}>Pas de planning {label}</span>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-2 mb-2 shrink-0">
        <div className="size-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
          {icon}
        </div>
        <span className="text-sm font-black uppercase italic tracking-tight text-white">{label}</span>
        <span className="text-[10px] font-bold text-white/30 ml-1">{fmtDate(week.startDate)} → {fmtDate(week.endDate)}</span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col rounded-xl overflow-hidden" style={{ border: `1px solid ${color}25` }}>
        {/* Header jours */}
        <div className="flex shrink-0" style={{ background: `${color}0d`, borderBottom: `1px solid ${color}30` }}>
          <div className="shrink-0 flex items-center justify-center" style={{ width: 44 }} />
          {week.days.map(day => (
            <div key={day._key} className="flex-1 flex flex-col items-center justify-center py-2 border-l" style={{ borderColor: 'rgba(255,255,255,0.07)', background: isToday(day.date) ? `${color}30` : undefined }}>
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: isToday(day.date) ? color : 'rgba(255,255,255,0.5)' }}>{day.name.slice(0, 3)}</span>
              <span className="text-[9px]" style={{ color: isToday(day.date) ? `${color}80` : 'rgba(255,255,255,0.2)' }}>{fmtDate(day.date)}</span>
            </div>
          ))}
        </div>

        {[0, 1].map(si => (
          <div key={si} className="flex flex-1 min-h-0 border-b last:border-b-0" style={{ borderColor: 'rgba(255,255,255,0.07)', background: si % 2 === 0 ? 'rgba(255,255,255,0.02)' : undefined }}>
            <div className="shrink-0 flex items-center justify-center border-r" style={{ width: 44, borderColor: 'rgba(255,255,255,0.07)' }}>
              <span className="text-[10px] font-black" style={{ color: `${color}60` }}>S{si + 1}</span>
            </div>
            {week.days.map(day => {
              const s = day.sessions?.[si];
              return (
                <div key={day._key} className="flex-1 flex items-center justify-center border-l" style={{ borderColor: 'rgba(255,255,255,0.07)', background: isToday(day.date) ? `${color}08` : undefined }}>
                  {s ? <span className="text-sm font-black text-white">{s.time}</span> : <span className="text-white/15 text-xl">—</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Slide principal ──────────────────────────────────────────────────────────
export const SignageAgendaSlide: React.FC = () => {
  const [data, setData] = useState<PlanningsData | null>(null);

  const load = useCallback(async () => {
    try { const r = await fetch(`/api/plannings?t=${Date.now()}`); if (r.ok) setData(await r.json()); } catch {}
  }, []);

  useEffect(() => { load(); const iv = setInterval(load, 60000); return () => clearInterval(iv); }, [load]);

  const { stageWeek, charWeek, marcheWeek } = useMemo(() => {
    if (!data) return { stageWeek: undefined, charWeek: undefined, marcheWeek: undefined };
    const stageWeek = data.plannings.find(p => isCurrentWeek(p.startDate, p.endDate));
    const charPeriod = data.charPlannings.find(p => isCurrentWeek(p.startDate, p.endDate));
    const charWeek = charPeriod?.weeks?.find(w => isCurrentWeek(w.startDate, w.endDate));
    const marchePeriod = data.marchePlannings.find(p => isCurrentWeek(p.startDate, p.endDate));
    const marcheWeek = marchePeriod?.weeks?.find(w => isCurrentWeek(w.startDate, w.endDate));
    return { stageWeek, charWeek, marcheWeek };
  }, [data]);

  if (!data) return (
    <div className="h-full flex items-center justify-center gap-3">
      <div className="size-2 bg-turquoise rounded-full animate-ping" />
      <span className="text-xs font-black uppercase tracking-widest text-turquoise/50">Chargement…</span>
    </div>
  );

  return (
    <div className="h-full flex flex-col px-5 pt-4 pb-4 gap-3 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        <div>
          <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter leading-none">
            Planning <span className="text-turquoise">de la semaine</span>
          </h2>
          {stageWeek && (
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-0.5">
              {fmtDate(stageWeek.startDate)} → {fmtDate(stageWeek.endDate)} · {stageWeek.title}
            </p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(0,169,206,0.1)', border: '1px solid rgba(0,169,206,0.25)' }}>
          <div className="size-1.5 bg-turquoise rounded-full animate-ping" />
          <span className="text-[9px] font-black text-turquoise uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* Stages voile — 55% */}
      <div className="flex flex-col min-h-0" style={{ flex: '0 0 55%' }}>
        {stageWeek
          ? <StagesGrid week={stageWeek} />
          : <div className="h-full flex items-center justify-center rounded-xl" style={{ border: '1px solid rgba(0,169,206,0.15)' }}>
              <span className="text-sm font-black text-white/20 uppercase tracking-widest">Pas de stages voile cette semaine</span>
            </div>
        }
      </div>

      {/* Char + Marche — reste */}
      <div className="flex gap-4 flex-1 min-h-0">
        <SessionGrid label="Char à Voile" icon={<ChevronRight size={14} style={{ color: '#fb923c' }} />} color="#fb923c" week={charWeek} />
        <SessionGrid label="Marche Aquatique" icon={<Waves size={14} style={{ color: '#34d399' }} />} color="#34d399" week={marcheWeek} />
      </div>

    </div>
  );
};

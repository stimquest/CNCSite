"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSignageContent } from '@/contexts/SignageContentContext';
import {
  Wind, Anchor, Waves, Thermometer, MapPin,
  TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown, Sunrise, Sunset,
  X, Calendar, ChevronRight,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface StageSlot { _key: string; stageKey: string; time?: string; activity?: string; description?: string; }
interface DayEntry {
  _key: string;
  name: string;
  date: string;
  isRaidDay?: boolean;
  raidStageKey?: string;
  stageSlots?: StageSlot[];
  sessions?: { time: string }[];
}
interface StageDefinition { _id: string; key: string; label: string; shortLabel?: string; color?: string; }
interface WeeklyPlanning { _id: string; title: string; startDate: string; endDate: string; days: DayEntry[]; }
interface CharSession { _id: string; date: string; heureDebut: string; heureFin: string; }
interface CharWeek { startDate: string; endDate: string; days: DayEntry[]; }
interface MarcheWeek { _key: string; startDate: string; endDate: string; days: DayEntry[]; }
interface MarchePlanning { _id: string; startDate: string; endDate: string; weeks: MarcheWeek[]; }
interface PlanningsData {
  plannings: WeeklyPlanning[];
  charSessions: CharSession[];
  marchePlannings: MarchePlanning[];
  stageDefinitions: StageDefinition[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const ACTIVITY_LABELS: Record<string, string> = {
  piscine: 'Piscine / Cerf-volant',
  optimist: 'Optimist',
  catamaran: 'Catamaran',
  paddle: 'Paddle / Kayak',
  char: 'Char à voile',
};
const STAGE_COLORS: Record<string, string> = {
  yellow: '#fbbf24', turquoise: '#00A9CE', blue: '#60a5fa',
  purple: '#a78bfa', orange: '#fb923c', rose: '#fb7185',
};
function stageColor(color?: string) { return STAGE_COLORS[color || ''] ?? '#94a3b8'; }

const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
function buildCharWeeks(sessions: CharSession[]): CharWeek[] {
  const weekMap: Record<string, CharWeek> = {};
  sessions.forEach(s => {
    const d = new Date(s.date);
    const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
    const ws = new Date(d); ws.setDate(d.getDate() + diff);
    const weekKey = ws.toISOString().split('T')[0];
    if (!weekMap[weekKey]) {
      const we = new Date(ws); we.setDate(ws.getDate() + 6);
      weekMap[weekKey] = {
        startDate: weekKey,
        endDate: we.toISOString().split('T')[0],
        days: Array.from({ length: 7 }, (_, i) => {
          const dd = new Date(ws); dd.setDate(ws.getDate() + i);
          return { _key: `${weekKey}-${i}`, name: DAYS_FR[i], date: dd.toISOString().split('T')[0], sessions: [] };
        }),
      };
    }
    const dayIdx = (new Date(s.date).getDay() + 6) % 7;
    weekMap[weekKey].days[dayIdx].sessions!.push({ time: `${s.heureDebut} — ${s.heureFin}` });
  });
  return Object.keys(weekMap).sort().map(k => weekMap[k]);
}

function isCurrentWeek(startDate: string, endDate: string) {
  const now = new Date();
  const s = new Date(startDate);
  const e = new Date(endDate);
  e.setHours(23, 59, 59);
  return now >= s && now <= e;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function isToday(dateStr: string) {
  return new Date(dateStr).toDateString() === new Date().toDateString();
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar (identique au signage principal)
// ─────────────────────────────────────────────────────────────────────────────
const SignageSidebar: React.FC = () => {
  const { weather } = useSignageContent();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const trendIcon =
    weather.trend === 'rising' ? <TrendingUp size={16} className="text-orange-300" /> :
    weather.trend === 'falling' ? <TrendingDown size={16} className="text-emerald-300" /> :
    <Minus size={16} className="text-white/30" />;

  const trendLabel =
    weather.trend === 'rising' ? <span className="text-orange-300">Hausse</span> :
    weather.trend === 'falling' ? <span className="text-emerald-300">Baisse</span> :
    <span className="text-white/30">Stable</span>;

  return (
    <aside className="col-span-2 h-full flex flex-col overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, #001828 0%, #002B49 60%, #00192F 100%)' }}>
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-turquoise to-transparent opacity-60" />
      <div className="flex flex-col gap-3 p-4 h-full">
        <div className="text-center pt-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin size={11} className="text-turquoise" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-turquoise/80">Agon-Coutainville</span>
            <div className="size-1.5 bg-red-400 rounded-full animate-pulse" />
          </div>
          <p className="text-[2.6rem] font-black text-white tracking-tight tabular-nums leading-none">
            {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-[10px] font-bold text-turquoise/50 uppercase tracking-widest mt-1">
            {now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
        </div>
        <div className="border-t border-turquoise/15" />
        <div className="rounded-xl p-3" style={{ background: 'rgba(0,169,206,0.08)', border: '1px solid rgba(0,169,206,0.2)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Wind size={11} className="text-turquoise" strokeWidth={2.5} />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-turquoise/70">Vent</p>
            <div className="ml-auto">{trendIcon}</div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <div className="px-2 py-0.5 bg-turquoise text-abysse rounded-md font-black text-sm italic uppercase">{weather.windDirection}</div>
            <span className="text-3xl font-black text-white tracking-tighter leading-none">{weather.windSpeed}</span>
            <span className="text-xs font-bold text-white/40">nds</span>
          </div>
          <p className="text-[10px] font-bold text-white/40 mt-1">Rafales <span className="text-white/70 font-black">{weather.gusts ?? '–'}</span> nds · {trendLabel}</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Waves size={11} className="text-blue-300" strokeWidth={2.5} />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-300/70">État de la mer</p>
          </div>
          <div className="flex items-baseline gap-1.5">
            {weather.waveDirection && <div className="px-2 py-0.5 bg-blue-500 text-white rounded-md font-black text-sm italic uppercase">{weather.waveDirection}</div>}
            <span className="text-3xl font-black text-white tracking-tighter leading-none">{weather.waveHeight ?? '–'}</span>
            <span className="text-xs font-bold text-white/40">m</span>
          </div>
        </div>
        <div className="border-t border-turquoise/15" />
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Anchor size={11} className="text-turquoise/60" strokeWidth={2.5} />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-turquoise/60">Marée</p>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-center gap-0.5 mb-0.5"><ArrowUp size={9} className="text-turquoise" /><p className="text-[8px] font-black text-white/40 uppercase tracking-wider">PM</p></div>
              <p className="text-sm font-black text-white">{weather.tideHigh || '–:––'}</p>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-center gap-0.5 mb-0.5"><ArrowDown size={9} className="text-blue-300" /><p className="text-[8px] font-black text-white/40 uppercase tracking-wider">BM</p></div>
              <p className="text-sm font-black text-white">{weather.tideLow || '–:––'}</p>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(0,169,206,0.12)', border: '1px solid rgba(0,169,206,0.25)' }}>
              <p className="text-[8px] font-black text-turquoise/60 uppercase tracking-wider mb-0.5">Coef.</p>
              <p className="text-sm font-black text-turquoise">{weather.coefficient || '–'}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-turquoise/15" />
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-xl p-2.5 flex items-center gap-2" style={{ background: 'rgba(253,224,71,0.06)', border: '1px solid rgba(253,224,71,0.15)' }}>
            <Sunrise size={14} className="text-yellow-300 shrink-0" />
            <div><p className="text-[8px] font-black text-yellow-300/50 uppercase tracking-wider">Lever</p><p className="text-base font-black text-white">{weather.sunrise ?? '–:––'}</p></div>
          </div>
          <div className="rounded-xl p-2.5 flex items-center gap-2" style={{ background: 'rgba(251,146,60,0.07)', border: '1px solid rgba(251,146,60,0.18)' }}>
            <Sunset size={14} className="text-orange-300 shrink-0" />
            <div><p className="text-[8px] font-black text-orange-300/50 uppercase tracking-wider">Coucher</p><p className="text-base font-black text-white">{weather.sunset ?? '–:––'}</p></div>
          </div>
        </div>
        <div className="border-t border-turquoise/15" />
        <div className="grid grid-cols-2 gap-1.5 mt-auto">
          <div className="rounded-xl p-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <Thermometer size={14} className="text-orange-200 shrink-0" />
            <div><p className="text-[8px] font-black text-white/30 uppercase tracking-wider">Air</p><p className="text-lg font-black text-white leading-none">{weather.temp}<span className="text-xs text-white/30">°</span></p></div>
          </div>
          <div className="rounded-xl p-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <Waves size={14} className="text-blue-200 shrink-0" />
            <div><p className="text-[8px] font-black text-white/30 uppercase tracking-wider">Eau</p><p className="text-lg font-black text-white leading-none">{weather.waterTemp ?? '–'}<span className="text-xs text-white/30">°</span></p></div>
          </div>
        </div>
        <div className="text-center pb-1"><p className="text-[9px] font-black text-turquoise/30 uppercase tracking-[0.3em]">CNC • Agon</p></div>
      </div>
    </aside>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Slides de planning
// ─────────────────────────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; color: string }> = ({ icon, title, subtitle, color }) => (
  <div className="flex items-center gap-3 mb-4 shrink-0">
    <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}22`, border: `1px solid ${color}55` }}>
      {icon}
    </div>
    <div>
      <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter leading-none">{title}</h2>
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-0.5">{subtitle}</p>
    </div>
    <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
      <Calendar size={11} style={{ color }} />
      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>Semaine en cours</span>
    </div>
  </div>
);

// Slide Stages Voile
const StagesSlide: React.FC<{ week: WeeklyPlanning; stageDefinitions: StageDefinition[] }> = ({ week, stageDefinitions }) => {
  return (
    <div className="h-full flex flex-col p-6 animate-in fade-in duration-700">
      <SectionHeader
        icon={<Anchor size={18} className="text-turquoise" />}
        title="Stages Voile"
        subtitle={`${formatDate(week.startDate)} → ${formatDate(week.endDate)} · ${week.title}`}
        color="#00A9CE"
      />
      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(0,169,206,0.15)' }}>
        {/* Header jours */}
        <div className="grid h-10 border-b" style={{ gridTemplateColumns: '140px repeat(5, 1fr)', background: 'rgba(0,169,206,0.08)', borderColor: 'rgba(0,169,206,0.2)' }}>
          <div className="flex items-center px-4">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Groupe</span>
          </div>
          {week.days.slice(0, 5).map((day) => (
            <div key={day._key} className="flex flex-col items-center justify-center border-l" style={{ borderColor: 'rgba(255,255,255,0.06)', background: isToday(day.date) ? 'rgba(0,169,206,0.2)' : undefined }}>
              <span className={`text-[10px] font-black uppercase tracking-wider ${isToday(day.date) ? 'text-turquoise' : 'text-white/50'}`}>{day.name}</span>
              <span className={`text-[9px] font-bold ${isToday(day.date) ? 'text-turquoise/70' : 'text-white/25'}`}>{formatDate(day.date)}</span>
            </div>
          ))}
        </div>

        {/* Lignes stages */}
        {stageDefinitions.map((stage, gi) => {
          const color = stageColor(stage.color);
          return (
            <div key={stage.key} className="grid border-b last:border-b-0" style={{ gridTemplateColumns: '140px repeat(5, 1fr)', borderColor: 'rgba(255,255,255,0.06)', background: gi % 2 === 0 ? 'rgba(255,255,255,0.02)' : undefined, flex: 1 }}>
              {/* Label stage */}
              <div className="flex items-center gap-2 px-3 py-2 border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="size-2 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-[10px] font-black uppercase tracking-wider" style={{ color }}>{stage.shortLabel || stage.label}</span>
              </div>
              {/* Cellules jours */}
              {week.days.slice(0, 5).map((day) => {
                const slot = (day.stageSlots || []).find(s => s.stageKey === stage.key);
                const isRaid = day.isRaidDay && (day.raidStageKey || '').split(',').includes(stage.key);
                const time = slot?.time || '';
                const actLabel = slot?.activity ? (ACTIVITY_LABELS[slot.activity] || slot.activity) : (slot?.description || '');
                return (
                  <div key={day._key} className="flex flex-col items-center justify-center p-2 border-l text-center" style={{ borderColor: 'rgba(255,255,255,0.06)', background: isToday(day.date) ? 'rgba(0,169,206,0.08)' : undefined }}>
                    {isRaid ? (
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,146,60,0.2)', color: '#fb923c' }}>RAID</span>
                    ) : (!time && !actLabel) ? (
                      <span className="text-white/15 text-lg">—</span>
                    ) : (
                      <>
                        {time     && <span className="text-sm font-black text-white leading-tight">{time}</span>}
                        {actLabel && <span className="text-[9px] font-bold text-white/40 leading-tight mt-0.5">{actLabel}</span>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Slide Char à voile
const CharSlide: React.FC<{ week: CharWeek }> = ({ week: currentWeek }) => {
  return (
    <div className="h-full flex flex-col p-6 animate-in fade-in duration-700">
      <SectionHeader
        icon={<ChevronRight size={18} className="text-orange-300" />}
        title="Char à Voile"
        subtitle={`${formatDate(currentWeek.startDate)} → ${formatDate(currentWeek.endDate)}`}
        color="#fb923c"
      />
      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(251,146,60,0.2)' }}>
        <div className="grid h-10 border-b" style={{ gridTemplateColumns: '60px repeat(7, 1fr)', background: 'rgba(251,146,60,0.08)', borderColor: 'rgba(251,146,60,0.2)' }}>
          <div className="flex items-center px-3"><span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">#</span></div>
          {currentWeek.days.map((day) => (
            <div key={day._key} className="flex flex-col items-center justify-center border-l" style={{ borderColor: 'rgba(255,255,255,0.06)', background: isToday(day.date) ? 'rgba(251,146,60,0.2)' : undefined }}>
              <span className={`text-[10px] font-black uppercase tracking-wider ${isToday(day.date) ? 'text-orange-300' : 'text-white/50'}`}>{day.name}</span>
              <span className={`text-[9px] font-bold ${isToday(day.date) ? 'text-orange-300/70' : 'text-white/25'}`}>{formatDate(day.date)}</span>
            </div>
          ))}
        </div>
        {/* Sessions (max 2 lignes) */}
        {[0, 1].map((sessionIdx) => (
          <div key={sessionIdx} className="grid border-b last:border-b-0" style={{ gridTemplateColumns: '60px repeat(7, 1fr)', borderColor: 'rgba(255,255,255,0.06)', background: sessionIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : undefined }}>
            <div className="flex items-center justify-center border-r py-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <span className="text-[10px] font-black text-white/30">S{sessionIdx + 1}</span>
            </div>
            {currentWeek.days.map((day) => {
              const session = day.sessions?.[sessionIdx];
              return (
                <div key={day._key} className="flex items-center justify-center border-l py-4" style={{ borderColor: 'rgba(255,255,255,0.06)', background: isToday(day.date) ? 'rgba(251,146,60,0.06)' : undefined }}>
                  {session ? (
                    <span className="text-base font-black text-white">{session.time}</span>
                  ) : (
                    <span className="text-white/15 text-lg">—</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// Slide Marche Aquatique
const MarcheSlide: React.FC<{ week: MarcheWeek }> = ({ week: currentWeek }) => {
  return (
    <div className="h-full flex flex-col p-6 animate-in fade-in duration-700">
      <SectionHeader
        icon={<Waves size={18} className="text-emerald-400" />}
        title="Marche Aquatique"
        subtitle={`${formatDate(currentWeek.startDate)} → ${formatDate(currentWeek.endDate)}`}
        color="#34d399"
      />
      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(52,211,153,0.2)' }}>
        <div className="grid h-10 border-b" style={{ gridTemplateColumns: '60px repeat(7, 1fr)', background: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.2)' }}>
          <div className="flex items-center px-3"><span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">#</span></div>
          {currentWeek.days.map((day) => (
            <div key={day._key} className="flex flex-col items-center justify-center border-l" style={{ borderColor: 'rgba(255,255,255,0.06)', background: isToday(day.date) ? 'rgba(52,211,153,0.2)' : undefined }}>
              <span className={`text-[10px] font-black uppercase tracking-wider ${isToday(day.date) ? 'text-emerald-400' : 'text-white/50'}`}>{day.name}</span>
              <span className={`text-[9px] font-bold ${isToday(day.date) ? 'text-emerald-400/70' : 'text-white/25'}`}>{formatDate(day.date)}</span>
            </div>
          ))}
        </div>
        {[0, 1].map((sessionIdx) => (
          <div key={sessionIdx} className="grid border-b last:border-b-0" style={{ gridTemplateColumns: '60px repeat(7, 1fr)', borderColor: 'rgba(255,255,255,0.06)', background: sessionIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : undefined }}>
            <div className="flex items-center justify-center border-r py-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <span className="text-[10px] font-black text-white/30">S{sessionIdx + 1}</span>
            </div>
            {currentWeek.days.map((day) => {
              const session = day.sessions?.[sessionIdx];
              return (
                <div key={day._key} className="flex items-center justify-center border-l py-4" style={{ borderColor: 'rgba(255,255,255,0.06)', background: isToday(day.date) ? 'rgba(52,211,153,0.06)' : undefined }}>
                  {session ? (
                    <span className="text-base font-black text-white">{session.time}</span>
                  ) : (
                    <span className="text-white/15 text-lg">—</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────────────────────────
export default function AgendaSignagePage() {
  const [data, setData] = useState<PlanningsData | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const DURATION = 20000;

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/plannings?t=${Date.now()}`);
      if (res.ok) setData(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Construire la séquence de slides à partir des données
  const slides = React.useMemo(() => {
    if (!data) return [];
    const result: React.ReactNode[] = [];
    const stageDefinitions = data.stageDefinitions || [];

    // Stages voile - semaine en cours
    const currentStage = data.plannings.find(p => isCurrentWeek(p.startDate, p.endDate));
    if (currentStage) result.push(<StagesSlide key="stages" week={currentStage} stageDefinitions={stageDefinitions} />);

    // Char à voile - semaine en cours reconstituée depuis les sessions individuelles
    const charWeeks = buildCharWeeks(data.charSessions || []);
    const currentChar = charWeeks.find(w => isCurrentWeek(w.startDate, w.endDate));
    if (currentChar) result.push(<CharSlide key="char" week={currentChar} />);

    // Marche aquatique - semaine en cours
    const marchePeriod = data.marchePlannings.find(p => isCurrentWeek(p.startDate, p.endDate));
    const currentMarche = marchePeriod?.weeks?.find(w => isCurrentWeek(w.startDate, w.endDate));
    if (currentMarche) result.push(<MarcheSlide key="marche" week={currentMarche} />);

    return result;
  }, [data]);

  const slidesLengthRef = React.useRef(slides.length);
  useEffect(() => { slidesLengthRef.current = slides.length; }, [slides]);

  // Timer de rotation
  useEffect(() => {
    if (slides.length === 0) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= DURATION) {
        clearInterval(timer);
        setProgress(0);
        setSlideIndex(i => (i + 1) % (slidesLengthRef.current || 1));
      } else {
        setProgress((elapsed / DURATION) * 100);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [slideIndex, slides.length]);

  return (
    <div
      className="fixed inset-0 text-white overflow-hidden font-sans grid grid-cols-12"
      style={{ background: 'linear-gradient(135deg, #001E35 0%, #002B49 50%, #003A5C 100%)' }}
    >
      {/* Ambient glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,169,206,0.1) 0%, transparent 70%)' }} />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-turquoise z-50 transition-all ease-linear shadow-[0_0_12px_rgba(0,169,206,0.8)]"
        style={{ width: `${progress * 0.834}%` }} />

      {/* Bouton retour */}
      <button onClick={() => window.location.href = '/digital-signage'}
        className="absolute bottom-4 left-4 z-50 size-9 rounded-full flex items-center justify-center transition-all"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <X size={14} className="text-white/30 hover:text-white transition-colors" />
      </button>

      {/* Contenu principal */}
      <div className="col-span-10 h-full overflow-hidden relative">
        {slides.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-white/30">
            <Calendar size={48} className="text-turquoise/30" />
            <p className="text-sm font-black uppercase tracking-widest">Aucun planning pour cette semaine</p>
          </div>
        ) : (
          slides[slideIndex % slides.length]
        )}

        {/* Indicateurs de slides */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            {slides.map((_, i) => (
              <div key={i} className="rounded-full transition-all"
                style={{ width: i === slideIndex % slides.length ? 20 : 6, height: 6, background: i === slideIndex % slides.length ? '#00A9CE' : 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <SignageSidebar />
    </div>
  );
}

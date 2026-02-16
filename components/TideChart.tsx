import { startOfDay, addDays, format } from "date-fns";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ReferenceLine,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { useTides } from "../lib/hooks/useTides";
import { ArrowDown, ArrowUp } from "lucide-react";

type TideChartVariant = 'simplified' | 'default' | 'cockpit';

export function TideChart({
  simplified = false,
  variant = 'default'
}: {
  simplified?: boolean;
  variant?: TideChartVariant;
}) {
  const now = Date.now();
  const todayStart = startOfDay(now).getTime();
  const todayEnd = addDays(todayStart, 1).getTime();

  const { data: tides, coefficients } = useTides(todayStart, todayEnd);

  if (!tides || tides.length === 0) {
    return (
      <div className="h-full min-h-[60px] w-full flex items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Sync...</span>
      </div>
    );
  }

  // Extreme Tides (High/Low)
  // We explicitly look for points marked as 'extreme' to get precise official times
  const extremeTides = tides
    .filter((t: any) => t.type === 'extreme')
    .sort((a, b) => a.timestamp - b.timestamp);

  // Filter and sort data for today - reduce density for cockpit look
  // We exclude extremes from the curve to avoid spikes if they are slightly off-grid,
  // but usually they align. We keep them for now or filter if strictly needed.
  // Actually, for the bar chart, we want regular intervals.
  const chartData = tides
    .filter((t: any) => t.type !== 'extreme') // Only use curve points for the graph
    .filter((_, i) => variant === 'cockpit' ? i % 4 === 0 : true) // Lighter density for bars
    .map(t => ({
      time: t.timestamp,
      height: Math.max(0, t.height),
      isCurrent: Math.abs(t.timestamp - now) < (3600000 * 0.5) // Mark current hour range
    }))
    .sort((a, b) => a.time - b.time);

  const currentCoeff = coefficients?.coef_1 || coefficients?.coef_2 || "--";

  // --- RENDER COCKPIT VARIANT ---
  if (variant === 'cockpit' || (simplified && variant === 'default')) {
    return (
      <div className="w-full h-full relative group flex flex-col justify-end">

        {/* EXTREME TIDES LIST OVERLAY */}
        <div className="absolute top-0 right-0 z-20 flex flex-col gap-2 pointer-events-none">
          {extremeTides.map((t: any, idx) => {
            const isPassed = t.timestamp < now;
            return (
              <div key={idx} className={`flex items-center justify-end gap-3 ${isPassed ? 'opacity-30 grayscale' : 'opacity-100'}`}>
                <div className="text-right">
                  <span className={`text-[10px] font-black uppercase tracking-widest block ${t.status === 'high' ? 'text-white' : 'text-turquoise'}`}>
                    {t.status === 'high' ? 'Pleine Mer' : 'Basse Mer'}
                  </span>
                  <span className="text-xl font-display italic text-white leading-none">
                    {format(new Date(t.timestamp), 'HH:mm')}
                  </span>
                </div>
                <div className={`size-8 rounded-lg flex items-center justify-center border ${t.status === 'high' ? 'bg-white/10 border-white/20 text-white' : 'bg-turquoise/10 border-turquoise/20 text-turquoise'}`}>
                  {t.status === 'high' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                </div>
              </div>
            )
          })}
        </div>


        <div className="relative h-32 w-full shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" hide domain={[todayStart, todayEnd]} />
              <YAxis hide domain={[0, 12]} />
              <Bar
                dataKey="height"
                radius={[2, 2, 0, 0]}
                animationDuration={2000}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isCurrent ? '#00A9CE' : 'rgba(255, 255, 255, 0.1)'}
                    className="transition-all duration-500 hover:fill-turquoiseCursor"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Subtle dot overlay for a technical look */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-between opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-full w-px bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER DEFAULT VARIANT ---
  return (
    <div className={`w-full relative group overflow-hidden ${simplified ? 'h-14 mt-4' : 'h-full'}`}>
      <div className="absolute inset-0 z-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FFCC" stopOpacity={simplified ? 0.2 : 0.4} />
                <stop offset="100%" stopColor="#00FFCC" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide domain={[todayStart, todayEnd]} />
            <YAxis hide domain={[0, 12]} />
            <Area
              type="monotone"
              dataKey="height"
              stroke="#00FFCC"
              strokeWidth={simplified ? 1 : 2}
              fill="url(#tideGradient)"
              isAnimationActive={true}
              animationDuration={1500}
            />
            {!simplified && (
              <ReferenceLine
                x={now}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {!simplified && (
        <div className="relative z-10 h-full flex items-center justify-between px-8">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Aujourd'hui</span>
            <h4 className="text-xl font-display font-black text-abysse italic-title uppercase tracking-tighter leading-none">Onde de Marée</h4>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-turquoise uppercase tracking-[0.2em] mb-1">Coefficient</span>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-display font-black text-abysse tracking-tighter leading-none">{currentCoeff}</span>
              <span className="size-2 rounded-full bg-turquoise animate-pulse"></span>
            </div>
            {/* Added Next High/Low for Default Variant too if needed */}
            <div className="mt-2 flex gap-4">
              {extremeTides.filter((t: any) => t.timestamp > now).slice(0, 2).map((t: any, idx) => (
                <span key={idx} className="text-[10px] font-bold text-slate-400">
                  {t.status === 'high' ? 'PM' : 'BM'} {format(new Date(t.timestamp), 'HH:mm')}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
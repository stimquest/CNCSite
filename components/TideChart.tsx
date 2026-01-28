import { startOfDay, addDays, format } from "date-fns";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  ReferenceLine 
} from "recharts";
import { useTides } from "../lib/hooks/useTides";

export function TideChart() {
  const now = Date.now();
  const todayStart = startOfDay(now).getTime();
  const todayEnd = addDays(todayStart, 1).getTime();

  const { data: tides, coefficients } = useTides(todayStart, todayEnd);

  if (!tides || tides.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronisation...</span>
      </div>
    );
  }

  // Filter and sort data for today
  const chartData = tides
    .map(t => ({ time: t.timestamp, height: Math.max(0, t.height) }))
    .sort((a, b) => a.time - b.time);

  const currentCoeff = coefficients?.coef_1 || coefficients?.coef_2 || "--";

  return (
    <div className="h-full w-full relative group overflow-hidden">
      {/* Background Curve - subtle and elegant */}
      <div className="absolute inset-0 z-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FFCC" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#00FFCC" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide domain={[todayStart, todayEnd]} />
            <YAxis hide domain={[0, 12]} />
            <Area 
              type="monotone" 
              dataKey="height" 
              stroke="#00FFCC" 
              strokeWidth={2}
              fill="url(#tideGradient)"
              isAnimationActive={true}
              animationDuration={1500}
            />
            {/* Current time indicator */}
            <ReferenceLine 
              x={now} 
              stroke="rgba(255, 255, 255, 0.4)" 
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hero Stats Overlay */}
      <div className="relative z-10 h-full flex items-center justify-between px-8">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Aujourd'hui</span>
          <h4 className="text-xl font-black text-abysse italic uppercase tracking-tighter">Onde de Marée</h4>
        </div>

        <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-turquoise uppercase tracking-[0.2em] mb-1">Coefficient</span>
            <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-abysse tracking-tighter leading-none">{currentCoeff}</span>
                <span className="size-2 rounded-full bg-turquoise animate-pulse"></span>
            </div>
        </div>
      </div>
    </div>
  );
}
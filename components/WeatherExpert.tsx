"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Clock, Sunrise, Sunset, Wind, Waves, Thermometer } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styles from './SpotConditions.module.css';

type Series = { time: string[]; [key: string]: (number | null)[] | string[] };
interface WeatherExpertData {
    weather: { hourly?: Series; minutely_15?: Series; daily?: { time: string[]; sunrise: string[]; sunset: string[] } };
    currents?: { hourly?: Series };
    waves?: { hourly?: Series };
    updatedAt: string;
}
interface ForecastPoint {
    time: string; label: string;
    wind: number | null; gust: number | null; direction: number | null;
    wave: number | null; waveDirection: number | null; period: number | null;
    air: number | null; sea: number | null; rain: number | null;
}
const bands = [
    { max: 10, label: '< 10', background: '#edf6f8', color: '#24475b' },
    { max: 20, label: '10–19', background: '#c5eaf0', color: '#003e50' },
    { max: 30, label: '20–29', background: '#f6e1b2', color: '#684710' },
    { max: 40, label: '30–39', background: '#f2c4a5', color: '#763715' },
    { max: Infinity, label: '40 et +', background: '#eab8b8', color: '#791f2e' },
];
const valueAt = (series: Series | undefined, key: string, index: number): number | null => {
    const value = series?.[key]?.[index];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
};
const number = (value: number | null | undefined, decimals = 0) => value == null ? '—' : value.toLocaleString('fr-FR', { maximumFractionDigits: decimals });
const timeLabel = (time?: string) => time ? time.slice(11, 16) : '—';
const parisNow = () => {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const part = (type: string) => parts.find(p => p.type === type)?.value;
    return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`;
};

function Direction({ value }: { value: number | null }) {
    if (value == null) return <>—</>;
    const label = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'][Math.round(value / 45) % 8];
    return <span className={styles.direction} title={`Provenance : ${label}, ${Math.round(value)}°`}>
        <ArrowDown size={15} style={{ transform: `rotate(${value}deg)` }} aria-hidden="true" />{label}
    </span>;
}

export const WeatherExpert: React.FC<{ webcam?: React.ReactNode }> = ({ webcam }) => {
    const [data, setData] = useState<WeatherExpertData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selection, setSelection] = useState('next');
    const [details, setDetails] = useState(false);
    const [clock, setClock] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const fetchData = useCallback(async (signal?: AbortSignal) => {
        try {
            const response = await fetch('/api/weather-expert', { signal });
            if (!response.ok) throw new Error('Prévisions indisponibles');
            const json: WeatherExpertData = await response.json();
            if (!json.weather?.hourly?.time?.length && !json.weather?.minutely_15?.time?.length) throw new Error('Prévisions absentes');
            setData(json); setClock(parisNow()); setError(false);
        } catch {
            if (!signal?.aborted) setError(true);
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    }, []);
    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        const timer = setInterval(() => { if (!document.hidden) fetchData(controller.signal); }, 60 * 60 * 1000);
        return () => { controller.abort(); clearInterval(timer); };
    }, [fetchData]);

    const makePoint = (series: Series, index: number): ForecastPoint => {
        const time = series.time[index];
        const hour = `${time.slice(0, 13)}:00`;
        const hourlyIndex = data?.weather.hourly?.time.indexOf(hour) ?? -1;
        const waveIndex = data?.waves?.hourly?.time.indexOf(hour) ?? -1;
        const seaIndex = data?.currents?.hourly?.time.indexOf(hour) ?? -1;
        return {
            time, label: timeLabel(time),
            wind: valueAt(series, 'wind_speed_10m', index),
            gust: valueAt(series, 'wind_gusts_10m', index) ?? valueAt(data?.weather.hourly, 'wind_gusts_10m', hourlyIndex),
            direction: valueAt(series, 'wind_direction_10m', index),
            wave: valueAt(data?.waves?.hourly, 'wave_height', waveIndex),
            waveDirection: valueAt(data?.waves?.hourly, 'wave_direction', waveIndex),
            period: valueAt(data?.waves?.hourly, 'wave_period', waveIndex),
            air: valueAt(series, 'temperature_2m', index),
            sea: valueAt(data?.currents?.hourly, 'sea_surface_temperature', seaIndex),
            rain: valueAt(series, 'precipitation_probability', index) ?? valueAt(data?.weather.hourly, 'precipitation_probability', hourlyIndex),
        };
    };
    const hourly = data?.weather.hourly;
    const short = data?.weather.minutely_15;
    const shortIndices = short?.time.map((_, i) => i).filter(i => short.time[i] >= clock).slice(0, 32) ?? [];
    const nextPoints = short && shortIndices.length
        ? shortIndices.filter((_, i) => i % 2 === 0).map(i => makePoint(short, i))
        : hourly?.time.map((_, i) => i).filter(i => hourly.time[i] >= clock).slice(0, 8).map(i => makePoint(hourly, i)) ?? [];
    const days = Array.from({ length: 3 }, (_, index) => {
        const date = new Date(`${clock.slice(0, 10) || '2000-01-01'}T12:00:00Z`);
        date.setUTCDate(date.getUTCDate() + index);
        return { key: date.toISOString().slice(0, 10), label: ['Aujourd’hui', 'Demain', 'Après-demain'][index], date };
    });
    const dayKey = days[Number(selection)]?.key;
    const points = selection === 'next' ? nextPoints : hourly?.time.map((_, i) => i)
        .filter(i => hourly.time[i].startsWith(dayKey ?? '') && hourly.time[i] >= `${clock.slice(0, 13)}:00`)
        .map(i => makePoint(hourly, i)) ?? [];
    const current = nextPoints[0];
    const dailyIndex = data?.weather.daily?.time?.indexOf(clock.slice(0, 10)) ?? -1;
    const periodLabel = selection === 'next' ? 'Les 8 prochaines heures' : days[Number(selection)].date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Paris' });
    const rows: { key: keyof ForecastPoint; label: string; unit?: string; decimals?: number; direction?: boolean }[] = [
        { key: 'wind', label: 'Vent', unit: 'nds' },
        { key: 'gust', label: 'Rafales', unit: 'nds' },
        { key: 'direction', label: 'Direction', direction: true },
        { key: 'wave', label: 'Vagues', unit: 'm', decimals: 1 },
        ...(details ? [
            { key: 'waveDirection' as const, label: 'Dir. vagues', direction: true },
            { key: 'period' as const, label: 'Période', unit: 's' },
            { key: 'rain' as const, label: 'Pluie', unit: '%' },
            { key: 'air' as const, label: 'Air', unit: '°C' },
            { key: 'sea' as const, label: 'Mer', unit: '°C', decimals: 1 },
        ] : []),
    ];

    return <div className={styles.weather}>
        <div className={webcam ? styles.overview : undefined}>
            {webcam}
            <section className={styles.summary} aria-label="Aperçu des prévisions">
                <div className={styles.eyebrow}><Wind size={15} /> Le temps sur le spot</div>
                <h2 className={styles.summaryTitle}>Un œil sur les conditions.</h2>
                <p className={styles.muted}>{current ? `Prévisions pour ${current.label} · heure de Paris` : 'Vent, mer et températures à Coutainville'}</p>
                {loading ? <div className={styles.skeleton} role="status">Chargement des prévisions…</div> : current ? <>
                    <div className={styles.windReading}>
                        <strong>{number(current.wind)}<span>nds</span></strong>
                        <div><Direction value={current.direction} /><span>Rafales <b>{number(current.gust)} nds</b></span></div>
                    </div>
                    <dl className={styles.metrics}>
                        <div><dt><Waves size={16} /> Vagues</dt><dd>{number(current.wave, 1)} <small>m</small></dd></div>
                        <div><dt><Thermometer size={16} /> Air</dt><dd>{number(current.air)} <small>°C</small></dd></div>
                        <div><dt><Waves size={16} /> Mer</dt><dd>{number(current.sea, 1)} <small>°C</small></dd></div>
                    </dl>
                </> : <p className={styles.message}>L’aperçu météo est momentanément indisponible.</p>}
                <div className={styles.sunTimes}>
                    <span><Sunrise size={17} /> Lever <b>{timeLabel(data?.weather.daily?.sunrise[dailyIndex])}</b></span>
                    <span><Sunset size={17} /> Coucher <b>{timeLabel(data?.weather.daily?.sunset[dailyIndex])}</b></span>
                </div>
                <a className={styles.textLink} href="#previsions-spot">Voir les prévisions détaillées <ArrowRight size={16} /></a>
            </section>
        </div>

        <section id="previsions-spot" className={styles.forecasts} aria-labelledby="forecast-title">
            <header className={styles.sectionHeader}>
                <div><p className={styles.eyebrow}>Pour préparer votre sortie</p><h2 id="forecast-title" className={styles.sectionTitle}>Vent & météo</h2></div>
                <p className={styles.updated}><Clock size={14} />{data ? `Actualisé à ${new Date(data.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' })}` : 'Prévisions locales'}</p>
            </header>
            <div className={styles.forecastPanel}>
                <div className={styles.toolbar} role="group" aria-label="Période des prévisions">
                    {[{ key: 'next', label: 'Prochaines 8 h' }, ...days.map((day, i) => ({ key: String(i), label: day.label }))].map(item =>
                        <button key={item.key} type="button" aria-pressed={selection === item.key} className={selection === item.key ? styles.selected : ''} onClick={() => { setSelection(item.key); scrollRef.current?.scrollTo({ left: 0 }); }}>{item.label}</button>
                    )}
                </div>
                {error && <div className={styles.message} role="status">{data ? 'Actualisation indisponible : les dernières prévisions reçues restent affichées.' : 'Les prévisions sont momentanément indisponibles.'} <button type="button" onClick={() => fetchData()}>Réessayer</button></div>}
                {loading ? <div className={styles.loadingChart} role="status">Chargement du vent et des prévisions…</div> : !points.length ? <p className={styles.message}>Aucune donnée disponible pour cette période.</p> : <>
                    <div className={styles.chartHeading}><h3>{periodLabel}</h3><div><span><i className={styles.windDot} /> Vent</span><span><i className={styles.gustDot} /> Rafales</span><span className={styles.muted}>en nds</span></div></div>
                    <div className={styles.chart} role="img" aria-label={`Évolution du vent et des rafales : ${periodLabel}. Valeurs détaillées dans le tableau ci-dessous.`}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={points} margin={{ top: 12, right: 18, bottom: 0, left: 0 }}>
                                <defs><linearGradient id="spotWindFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00a9ce" stopOpacity={0.18} /><stop offset="100%" stopColor="#00a9ce" stopOpacity={0.01} /></linearGradient></defs>
                                <CartesianGrid vertical={false} stroke="#e5edf1" strokeDasharray="3 4" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} minTickGap={35} tick={{ fill: '#607687', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} width={36} tick={{ fill: '#607687', fontSize: 12 }} domain={[0, 'auto']} />
                                <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 12, color: '#002b49', fontSize: 13 }} formatter={(value, name) => [`${value} nds`, name === 'wind' ? 'Vent' : 'Rafales']} labelFormatter={(label) => `${label} · heure de Paris`} />
                                <Area dataKey="gust" stroke="#d77a37" strokeWidth={2} strokeDasharray="5 4" fill="transparent" isAnimationActive={false} />
                                <Area dataKey="wind" stroke="#009bb8" strokeWidth={2.5} fill="url(#spotWindFill)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.tableTools}>
                        <span>Heure de Paris · {selection === 'next' && shortIndices.length ? 'pas de 30 min' : 'pas de 1 h'}</span>
                        <div><button type="button" aria-label="Voir les heures précédentes" onClick={() => scrollRef.current?.scrollBy({ left: -360 })}><ChevronLeft size={17} /></button><span>Parcourir les heures</span><button type="button" aria-label="Voir les heures suivantes" onClick={() => scrollRef.current?.scrollBy({ left: 360 })}><ChevronRight size={17} /></button></div>
                    </div>
                    <div ref={scrollRef} className={styles.tableScroll} role="region" aria-label="Tableau des prévisions horaires" tabIndex={0}>
                        <table className={styles.table}>
                            <caption className={styles.srOnly}>{periodLabel} — prévisions à Coutainville</caption>
                            <thead><tr><th scope="col">Heure</th>{points.map(point => <th scope="col" key={point.time}>{point.label}</th>)}</tr></thead>
                            <tbody>{rows.map(row => <tr key={row.key}>
                                <th scope="row">{row.label}{row.unit && <small>{row.unit}</small>}</th>
                                {points.map(point => {
                                    const value = point[row.key] as number | null;
                                    const band = value != null && (row.key === 'wind' || row.key === 'gust') ? bands.find(b => Math.round(value) < b.max) : undefined;
                                    return <td key={point.time} style={band ? { backgroundColor: band.background, color: band.color } : undefined}>{row.direction ? <Direction value={value} /> : number(value, row.decimals)}</td>;
                                })}
                            </tr>)}</tbody>
                        </table>
                    </div>
                    <div className={styles.tableFooter}>
                        <button type="button" className={styles.detailsButton} aria-expanded={details} onClick={() => setDetails(value => !value)}>{details ? '− Moins de détails' : '+ Pluie, températures & détails marins'}</button>
                        <div className={styles.scale} aria-label="Intensité du vent en nœuds"><span>nds</span>{bands.map(band => <span key={band.label}><i style={{ backgroundColor: band.background }} />{band.label}</span>)}</div>
                    </div>
                </>}
            </div>
            <p className={styles.sources}>Prévisions Open-Meteo · AROME HD pour les données horaires · données marines Météo-France. Les valeurs absentes sont indiquées par « — ».</p>
        </section>
    </div>;
};

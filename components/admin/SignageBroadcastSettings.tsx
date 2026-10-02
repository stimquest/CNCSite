"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Copy, ExternalLink, GripVertical, Loader2, Monitor, Plus, Save, Trash2, Wind } from 'lucide-react';
import { buildSignageSequence, normalizeSignageSettings, type SignageTimelineItem } from '@/lib/signage';
import styles from './SignageBroadcastSettings.module.css';

interface BroadcastSlide {
  _id?: string;
  title: string;
  type: string;
  duration: number;
  order: number;
  isActive: boolean;
  promoContent?: { image?: string };
}
interface Media {
  id: string;
  title: string;
  source: SignageTimelineItem['source'];
  slideId?: string;
  duration: number;
  image?: string;
  available: boolean;
}
interface Drag {
  media?: Media;
  key?: string;
  startX: number;
  startY: number;
  moved: boolean;
  target: number | null;
}

const stamp = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};
const newKey = () => crypto.randomUUID();

export default function SignageBroadcastSettings({ slides }: { slides: BroadcastSlide[] }) {
  const [timeline, setTimeline] = useState<SignageTimelineItem[]>([]);
  const [saved, setSaved] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [ghost, setGhost] = useState<{ title: string; x: number; y: number } | null>(null);
  const drag = useRef<Drag | null>(null);
  const slidesRef = useRef(slides);
  slidesRef.current = slides;

  const media: Media[] = [
    { id: 'weather', title: 'Météo', source: 'weather', duration: 20000, available: true },
    { id: 'agenda', title: 'Agenda', source: 'agenda', duration: 25000, available: true },
    ...slides.filter(slide => slide._id).map(slide => ({ id: slide._id!, title: slide.title, source: 'slide' as const, slideId: slide._id, duration: slide.duration || 15000, image: slide.promoContent?.image, available: slide.isActive })),
  ];
  const content = (item: SignageTimelineItem) => media.find(entry => entry.id === (item.source === 'slide' ? item.slideId : item.source));
  const activeIndex = timeline.findIndex(item => item._key === selected);
  const active = timeline[activeIndex];
  const dirty = saved !== null && JSON.stringify(timeline) !== saved;
  const valid = timeline.length > 0 && timeline.length <= 100 && timeline.every(item => Number.isInteger(item.duration) && item.duration >= 1000 && item.duration <= 600000 && !!content(item)?.available);
  const total = timeline.reduce((sum, item) => sum + (Number.isFinite(item.duration) ? item.duration : 0), 0);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/signage', { cache: 'no-store' });
      if (!response.ok) throw new Error('Impossible de charger la timeline.');
      const settings = normalizeSignageSettings(await response.json());
      const items = settings.timeline ?? buildSignageSequence(slidesRef.current, settings).map(item => ({
        _key: newKey(), source: item.type === 'WEATHER' ? 'weather' as const : item.type === 'AGENDA' ? 'agenda' as const : 'slide' as const,
        ...(item.data?._id ? { slideId: item.data._id } : {}), duration: item.duration,
      }));
      setTimeline(items);
      setSaved(JSON.stringify(items));
      setSelected(items[0]?._key || null);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Chargement impossible.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  function change(items: SignageTimelineItem[]) {
    setTimeline(items);
    setNotice('');
    setError('');
  }

  function insert(entry: Media, at = timeline.length) {
    if (!entry.available || timeline.length >= 100) return;
    const item: SignageTimelineItem = { _key: newKey(), source: entry.source, ...(entry.slideId ? { slideId: entry.slideId } : {}), duration: Math.max(1000, Math.min(600000, Math.round(entry.duration / 1000) * 1000)) };
    const items = [...timeline]; items.splice(at, 0, item); change(items); setSelected(item._key);
  }

  function move(key: string, target: number) {
    const from = timeline.findIndex(item => item._key === key);
    if (from < 0) return;
    const items = [...timeline]; const [item] = items.splice(from, 1);
    items.splice(target > from ? target - 1 : target, 0, item); change(items); setSelected(key);
  }

  function duplicate() {
    if (!active || timeline.length >= 100) return;
    const copy = { ...active, _key: newKey() }; const items = [...timeline]; items.splice(activeIndex + 1, 0, copy); change(items); setSelected(copy._key);
  }

  function remove() {
    if (!active) return;
    const items = timeline.filter(item => item._key !== active._key); change(items); setSelected(items[Math.min(activeIndex, items.length - 1)]?._key || null);
  }

  function beginDrag(event: PointerEvent<HTMLButtonElement>, entry?: Media, key?: string) {
    if (saving || (entry && !entry.available)) return;
    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    if (key) setSelected(key);
    drag.current = { media: entry, key, startX: event.clientX, startY: event.clientY, moved: false, target: null };
  }

  function dragMove(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    if (!current) return;
    if (!current.moved && Math.hypot(event.clientX - current.startX, event.clientY - current.startY) < 6) return;
    current.moved = true;
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const block = element?.closest<HTMLElement>('[data-timeline-index]');
    const track = element?.closest('[data-timeline-track]');
    let target: number | null = null;
    if (block) {
      const bounds = block.getBoundingClientRect();
      target = Number(block.dataset.timelineIndex) + (event.clientX > bounds.x + bounds.width / 2 ? 1 : 0);
    } else if (track) target = timeline.length;
    current.target = target;
    setDropIndex(target);
    const title = current.media?.title || content(timeline.find(item => item._key === current.key)!)?.title || 'Diapo';
    setGhost({ title, x: Math.max(0, Math.min(event.clientX, window.innerWidth - 244)), y: Math.min(event.clientY, window.innerHeight - 64) });
    if (event.clientY > window.innerHeight - 64) window.scrollBy(0, 12);
    if (event.clientY < 64) window.scrollBy(0, -12);
  }

  function endDrag(cancel = false) {
    const current = drag.current;
    if (!cancel && current?.moved && current.target !== null) {
      if (current.media) insert(current.media, current.target);
      else if (current.key) move(current.key, current.target);
    }
    drag.current = null; setGhost(null); setDropIndex(null);
  }

  const dragProps = {
    onPointerMove: dragMove,
    onPointerUp: () => endDrag(),
    onPointerCancel: () => endDrag(true),
    onLostPointerCapture: () => endDrag(true),
    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => { if (event.key === 'Escape') endDrag(true); },
  };

  async function save() {
    if (!dirty || !valid || saving) return;
    setSaving(true); setError(''); setNotice('');
    try {
      const response = await fetch('/api/cockpit/signage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ timeline }) });
      if (response.redirected) throw new Error('Votre session a expiré. Reconnectez-vous pour enregistrer.');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Enregistrement impossible.');
      const items = normalizeSignageSettings(result).timeline || timeline;
      setTimeline(items); setSaved(JSON.stringify(items));
      setNotice('Timeline enregistrée. Les écrans ouverts la récupèrent sous 30 secondes.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Enregistrement impossible.'); }
    finally { setSaving(false); }
  }

  let elapsed = 0;
  return <section aria-label="Timeline de diffusion" className={`${styles.root} space-y-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6`}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h4 className="text-lg font-black text-abysse">Timeline de diffusion</h4><p className="mt-1 text-xs text-slate-500">Glissez pour ajouter ou déplacer. Cliquez sur un bloc pour régler sa durée.</p></div>
      <a href="/digital-signage" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-abysse"><ExternalLink size={14} /> Ouvrir l’affichage</a>
    </div>
    {loading ? <p role="status" className="flex items-center gap-2 text-sm text-slate-500"><Loader2 size={16} className="animate-spin" /> Chargement de la timeline…</p> : saved !== null && <>
      <fieldset disabled={saving} className="min-w-0">
        <legend className="mb-2 text-xs font-bold text-slate-500">Ajouter un contenu</legend>
        <div className={styles.library}>
          {media.map(entry => <div key={entry.id} className={`${styles.media} ${!entry.available ? styles.unavailable : ''}`}>
            <button type="button" aria-label={`Glisser ${entry.title} depuis la bibliothèque`} disabled={!entry.available || timeline.length >= 100} onPointerDown={event => beginDrag(event, entry)} {...dragProps} className={styles.mediaDrag}>
              {entry.image ? <img src={entry.image} alt="" className={styles.thumbnail} /> : <span className={styles.mediaIcon}>{entry.source === 'weather' ? <Wind size={16} /> : entry.source === 'agenda' ? <CalendarDays size={16} /> : <Monitor size={16} />}</span>}
              <span className="min-w-0 break-words text-xs font-semibold text-abysse">{entry.title}{!entry.available && <span className="block text-[10px] font-normal text-slate-500">Masquée</span>}</span>
            </button>
            <button type="button" disabled={!entry.available || timeline.length >= 100} aria-label={`Ajouter ${entry.title} à la timeline`} onClick={() => insert(entry)} className={styles.add}><Plus size={15} /></button>
          </div>)}
        </div>
      </fieldset>
      <div className="space-y-3">
        <p className="text-xs font-bold text-abysse">{timeline.length} bloc{timeline.length > 1 ? 's' : ''} · {stamp(total)} en boucle ↻</p>
        <ol aria-label="Ordre de diffusion" data-timeline-track className={`${styles.track} ${dropIndex === timeline.length ? styles.dropEnd : ''}`}>
          {timeline.map((item, index) => {
            const entry = content(item);
            const start = elapsed; elapsed += item.duration;
            return <li key={item._key} data-timeline-index={index} className={`${styles.block} ${selected === item._key ? styles.selected : ''} ${dropIndex === index ? styles.dropBefore : ''} ${!entry?.available ? styles.unavailable : ''}`} style={{ flexBasis: `${Math.min(250, 140 + item.duration / 1000)}px` }}>
              <div className={styles.blockTop}><span>{index + 1} · {stamp(start)}</span><button type="button" disabled={saving} aria-label={`Déplacer le bloc ${index + 1} ${entry?.title || 'Diapo indisponible'}`} onPointerDown={event => beginDrag(event, undefined, item._key)} {...dragProps} className={styles.grip}><GripVertical size={16} /></button></div>
              <button type="button" onClick={() => setSelected(item._key)} aria-label={`Sélectionner le bloc ${index + 1} ${entry?.title || 'Diapo indisponible'}`} aria-pressed={selected === item._key} className={styles.selectBlock}>
                <span className="block break-words text-sm font-bold text-abysse">{entry?.title || 'Diapo supprimée'}</span><span className="mt-1 block text-xs text-slate-500">{item.duration / 1000} s{!entry?.available ? ' · indisponible' : ''}</span>
              </button>
            </li>;
          })}
          {!timeline.length && <li className="w-full py-8 text-center text-sm text-slate-500">Glissez un contenu ici, ou utilisez le bouton + de la bibliothèque.</li>}
        </ol>
      </div>
      {active && <fieldset disabled={saving} className={styles.inspector}>
        <legend className="sr-only">Réglages du bloc sélectionné</legend>
        <span className="min-w-0 break-words text-sm font-bold text-abysse">Bloc {activeIndex + 1} · {content(active)?.title || 'Diapo indisponible'}</span>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">Durée (s)<input aria-label="Durée du bloc (secondes)" type="number" min={1} max={600} step={1} value={active.duration / 1000} onChange={event => change(timeline.map(item => item._key === active._key ? { ...item, duration: Number(event.target.value) * 1000 } : item))} className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-abysse" /></label>
        <div className="flex flex-wrap gap-1">
          <button type="button" aria-label="Déplacer le bloc avant" disabled={activeIndex === 0} onClick={() => move(active._key, activeIndex - 1)} className={styles.tool}><ArrowLeft size={15} /></button>
          <button type="button" aria-label="Déplacer le bloc après" disabled={activeIndex === timeline.length - 1} onClick={() => move(active._key, activeIndex + 2)} className={styles.tool}><ArrowRight size={15} /></button>
          <button type="button" disabled={timeline.length >= 100} onClick={duplicate} className={styles.tool}><Copy size={14} /> Dupliquer</button>
          <button type="button" onClick={remove} className={`${styles.tool} text-red-600`}><Trash2 size={14} /> Supprimer</button>
        </div>
      </fieldset>}
      {!valid && <p role="alert" className="text-sm text-amber-700">{!timeline.length ? 'Ajoutez au moins un bloc pour diffuser.' : 'Chaque bloc doit utiliser un contenu disponible et durer de 1 à 600 secondes.'}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p role="status" className="text-xs text-slate-500">{notice || (dirty ? 'Modifications à enregistrer' : 'La timeline se répète sur tous les écrans du club.')}</p>
        <button type="button" disabled={!dirty || !valid || saving} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-lg bg-abysse px-4 py-2.5 text-xs font-bold text-white disabled:opacity-40">{saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Enregistrer la timeline</button>
      </div>
    </>}
    {error && <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}{saved === null && !loading && <button type="button" onClick={() => void load()} className="ml-3 font-bold underline">Réessayer</button>}</div>}
    {ghost && <div className={styles.ghost} style={{ left: ghost.x + 12, top: ghost.y + 12 }}><GripVertical size={15} />{ghost.title}</div>}
  </section>;
}

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { PortableTextBlock } from '@portabletext/editor';
import { ArrowDown, ArrowLeft, ArrowUp, Copy, Eye, EyeOff, Loader2, Plus, RefreshCw, Save, Trash2, Upload, X } from 'lucide-react';

import RichTextField from '@/components/admin/RichTextField';
import { uploadImage } from '@/components/admin/uploadImage';

type PricingTier = { _key?: string; label?: string; value?: string };

type SchoolStage = {
    _key: string;
    id?: string;
    title?: string;
    officialName?: string;
    age?: string;
    price?: string;
    hook?: string;
    description?: PortableTextBlock[];
    longDescription?: PortableTextBlock[];
    logistique?: string[];
    image?: { _type: 'image'; asset: { _type: 'reference'; _ref: string } };
    imageUrl?: string;
    color?: string;
    bgColor?: string;
    pricingTiers?: PricingTier[];
    registrationUrl?: string;
    showOnHome?: boolean;
};

// Teintes proposées : couleur de fond du badge + couleur de texte assortie.
// Les classes sont déjà générées par Tailwind (voir @source inline dans app/globals.css).
const COLORS = [
    { name: 'turquoise', hex: '#00A9CE' },
    { name: 'abysse', hex: '#002B49' },
    { name: 'sky-400', hex: '#38bdf8' },
    { name: 'blue-600', hex: '#2563eb' },
    { name: 'indigo-500', hex: '#6366f1' },
    { name: 'purple-500', hex: '#a855f7' },
    { name: 'pink-500', hex: '#ec4899' },
    { name: 'rose-500', hex: '#f43f5e' },
    { name: 'red-500', hex: '#ef4444' },
    { name: 'orange-500', hex: '#f97316' },
    { name: 'amber-500', hex: '#f59e0b' },
    { name: 'lime-500', hex: '#84cc16' },
    { name: 'green-500', hex: '#22c55e' },
    { name: 'emerald-500', hex: '#10b981' },
    { name: 'teal-500', hex: '#14b8a6' },
    { name: 'sand-400', hex: '#d9a263' },
    { name: 'taupe-500', hex: '#9e8a71' },
];

const colorName = (stage: SchoolStage) => stage.bgColor?.replace(/^bg-/, '') || '';
const hexOf = (stage: SchoolStage) => COLORS.find((c) => c.name === colorName(stage))?.hex || '#94a3b8';

const slugify = (text: string) =>
    text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const newKey = () => Math.random().toString(36).slice(2, 14);

const cloneBlocks = (blocks?: PortableTextBlock[]) =>
    blocks ? (JSON.parse(JSON.stringify(blocks)) as PortableTextBlock[]).map((b) => ({ ...b, _key: newKey() })) : undefined;

const inputClass = 'w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-turquoise font-bold text-sm text-abysse';
const labelClass = 'text-[10px] font-black uppercase text-slate-400 ml-1';

// ─── Interrupteur "Sur l'accueil" (absent = affiché) ────────────────────────
function HomeToggle({ stage, onToggle, compact }: { stage: SchoolStage; onToggle: () => void; compact?: boolean }) {
    const shown = stage.showOnHome !== false;
    return (
        <button type="button" onClick={onToggle} role="switch" aria-checked={shown}
            title={shown ? "Affiché sur l'accueil (cliquer pour masquer)" : "Masqué de l'accueil (cliquer pour afficher)"}
            className={`flex shrink-0 items-center gap-2 rounded-full transition-all ${compact ? "p-2" : "px-3 py-2"} ${shown ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}>
            {shown ? <Eye size={14} /> : <EyeOff size={14} />}
            {!compact && <span className="text-[10px] font-black uppercase tracking-widest">{shown ? "Sur l'accueil" : "Masqué de l'accueil"}</span>}
        </button>
    );
}

// ─── Aperçu de la carte (reprend la carte de la page École) ─────────────────
function CardPreview({ stage }: { stage: SchoolStage }) {
    return (
        <div className="relative w-full aspect-[4/5] max-w-[260px] rounded-3xl overflow-hidden bg-slate-700 shadow-lg">
            {stage.imageUrl && <img src={`${stage.imageUrl}?w=520`} alt="" className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute top-3 left-3 right-3 flex items-stretch h-9 rounded-full overflow-hidden bg-white shadow">
                <div className={`${stage.bgColor || 'bg-slate-400'} text-white text-[9px] font-black px-3 flex items-center uppercase tracking-widest shrink-0`}>{stage.age || 'Âge'}</div>
                <div className={`${stage.color || 'text-slate-500'} text-[10px] font-black px-3 flex items-center uppercase leading-tight line-clamp-2`}>{stage.officialName || 'Nom du stage'}</div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-white font-black italic uppercase text-lg leading-none whitespace-pre-line">{stage.title || 'Titre narratif'}</h4>
                {stage.hook && <p className="text-white/70 text-[11px] italic mt-2 line-clamp-3">{stage.hook}</p>}
            </div>
        </div>
    );
}

// ─── Formulaire d'un stage ──────────────────────────────────────────────────
function StageForm({ stage, onChange }: { stage: SchoolStage; onChange: (patch: Partial<SchoolStage>) => void }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const onImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setUploading(true);
        setUploadError(null);
        try {
            const { assetId, url } = await uploadImage(file);
            onChange({ image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }, imageUrl: url });
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Échec du téléversement');
        } finally {
            setUploading(false);
        }
    };

    const logistique = stage.logistique || [];
    const tiers = stage.pricingTiers || [];

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-3">
                        <div>
                            <label className={labelClass}>Nom officiel du stage</label>
                            <input type="text" value={stage.officialName || ''} onChange={(e) => onChange({ officialName: e.target.value })} className={inputClass} placeholder="Stage Catamaran" />
                        </div>
                        <div>
                            <label className={labelClass}>Âge</label>
                            <input type="text" value={stage.age || ''} onChange={(e) => onChange({ age: e.target.value })} className={inputClass} placeholder="Dès 8 ans" />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Titre narratif (sur la carte)</label>
                        <textarea rows={2} value={stage.title || ''} onChange={(e) => onChange({ title: e.target.value })} className={inputClass} placeholder="Dompter le vent" />
                    </div>
                    <div>
                        <label className={labelClass}>Accroche</label>
                        <textarea rows={2} value={stage.hook || ''} onChange={(e) => onChange({ hook: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-turquoise text-sm text-slate-600" placeholder="Vitesse, équipe et adrénaline salée." />
                    </div>
                    <div>
                        <label className={labelClass}>Couleur</label>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {COLORS.map((c) => (
                                <button key={c.name} type="button" title={c.name} onClick={() => onChange({ bgColor: `bg-${c.name}`, color: `text-${c.name}` })}
                                    className={`size-7 rounded-full border-2 transition-all ${colorName(stage) === c.name ? 'border-abysse scale-110' : 'border-white shadow'}`} style={{ background: c.hex }} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <CardPreview stage={stage} />
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 flex items-center gap-2">
                        {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />} Changer la photo
                    </button>
                    {uploadError && <span className="text-[10px] text-red-500">{uploadError}</span>}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImage} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Description courte</label>
                    <RichTextField resetKey={`${stage._key}-d`} value={stage.description} onChange={(description) => onChange({ description })} placeholder="Ce qu'on fait pendant le stage…" />
                </div>
                <div>
                    <label className={labelClass}>Description longue (détails)</label>
                    <RichTextField resetKey={`${stage._key}-ld`} value={stage.longDescription} onChange={(longDescription) => onChange({ longDescription })} placeholder="Période, déroulé, matériel…" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tarifs */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-widest text-abysse">Tarifs</span>
                    <div className="mt-3">
                        <label className={labelClass}>Prix principal</label>
                        <input type="text" value={stage.price || ''} onChange={(e) => onChange({ price: e.target.value })} className={`${inputClass} bg-white`} placeholder="165 €" />
                    </div>
                    <div className="mt-3 space-y-2">
                        {tiers.map((tier, i) => (
                            <div key={tier._key || i} className="flex gap-2">
                                <input type="text" value={tier.label || ''} onChange={(e) => onChange({ pricingTiers: tiers.map((t, j) => j === i ? { ...t, label: e.target.value } : t) })} className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-turquoise" placeholder="Libellé (ex: Licencié)" />
                                <input type="text" value={tier.value || ''} onChange={(e) => onChange({ pricingTiers: tiers.map((t, j) => j === i ? { ...t, value: e.target.value } : t) })} className="w-24 p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-turquoise" placeholder="150 €" />
                                <button type="button" onClick={() => onChange({ pricingTiers: tiers.filter((_, j) => j !== i) })} className="p-2 text-slate-400 hover:text-red-500"><X size={14} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => onChange({ pricingTiers: [...tiers, { _key: newKey(), label: '', value: '' }] })} className="text-[10px] font-black uppercase tracking-widest text-turquoise flex items-center gap-1 hover:underline"><Plus size={12} /> Ajouter un tarif</button>
                    </div>
                </div>

                {/* Logistique */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-widest text-abysse">Logistique & pratique</span>
                    <div className="mt-3 space-y-2">
                        {logistique.map((item, i) => (
                            <div key={i} className="flex gap-2">
                                <input type="text" value={item} onChange={(e) => onChange({ logistique: logistique.map((l, j) => j === i ? e.target.value : l) })} className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-turquoise" placeholder="Ex: Prévoir une tenue de rechange" />
                                <button type="button" onClick={() => onChange({ logistique: logistique.filter((_, j) => j !== i) })} className="p-2 text-slate-400 hover:text-red-500"><X size={14} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => onChange({ logistique: [...logistique, ''] })} className="text-[10px] font-black uppercase tracking-widest text-turquoise flex items-center gap-1 hover:underline"><Plus size={12} /> Ajouter une ligne</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
                <div>
                    <label className={labelClass}>Lien d&apos;inscription (Axyomes)</label>
                    <input type="url" value={stage.registrationUrl || ''} onChange={(e) => onChange({ registrationUrl: e.target.value })} className={inputClass} placeholder="https://…" />
                </div>
                <div>
                    <label className={labelClass}>Identifiant technique</label>
                    <input type="text" value={stage.id || ''} onChange={(e) => onChange({ id: slugify(e.target.value) })} className={`${inputClass} text-slate-500`} placeholder="stage-catamaran" />
                </div>
            </div>
        </div>
    );
}

// ─── Gestionnaire ────────────────────────────────────────────────────────────
export default function SchoolStagesEditor() {
    const [stages, setStages] = useState<SchoolStage[] | null>(null);
    const [rev, setRev] = useState<string | null>(null);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
    const [loadCount, setLoadCount] = useState(0); // force le rechargement des champs riches

    const load = useCallback(async () => {
        setMessage(null);
        try {
            const data = await fetch('/api/cockpit/school-stages').then((r) => r.json());
            if (data.error) throw new Error(data.error);
            setStages(data.stages);
            setRev(data.rev);
            setDirty(false);
            setLoadCount((n) => n + 1);
        } catch (err) {
            setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Chargement impossible' });
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    // Avertit avant de quitter la page avec des changements non enregistrés
    useEffect(() => {
        if (!dirty) return;
        const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [dirty]);

    const mutate = (next: SchoolStage[]) => { setStages(next); setDirty(true); setMessage(null); };
    const updateStage = (key: string, patch: Partial<SchoolStage>) => mutate((stages || []).map((s) => s._key === key ? { ...s, ...patch } : s));

    const move = (index: number, delta: number) => {
        const list = [...(stages || [])];
        const target = index + delta;
        if (target < 0 || target >= list.length) return;
        [list[index], list[target]] = [list[target], list[index]];
        mutate(list);
    };

    const addStage = () => {
        const stage: SchoolStage = { _key: newKey(), officialName: 'Nouveau stage', bgColor: 'bg-turquoise', color: 'text-turquoise' };
        mutate([...(stages || []), stage]);
        setSelectedKey(stage._key);
    };

    const duplicate = (stage: SchoolStage) => {
        const copy: SchoolStage = {
            ...JSON.parse(JSON.stringify(stage)),
            _key: newKey(),
            id: stage.id ? `${stage.id}-copie` : undefined,
            officialName: `${stage.officialName || ''} (copie)`,
            description: cloneBlocks(stage.description),
            longDescription: cloneBlocks(stage.longDescription),
        };
        const index = (stages || []).findIndex((s) => s._key === stage._key);
        const list = [...(stages || [])];
        list.splice(index + 1, 0, copy);
        mutate(list);
        setSelectedKey(copy._key);
    };

    const remove = (stage: SchoolStage) => {
        if (!window.confirm(`Retirer « ${stage.officialName} » de la page École ?`)) return;
        mutate((stages || []).filter((s) => s._key !== stage._key));
        setSelectedKey(null);
    };

    const save = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/cockpit/school-stages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stages, rev }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur');
            setStages(data.stages);
            setRev(data.rev);
            setDirty(false);
            setMessage({ kind: 'ok', text: 'Stages enregistrés et publiés sur le site' });
        } catch (err) {
            setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Erreur' });
        } finally {
            setSaving(false);
        }
    };

    if (!stages) {
        return (
            <div className="bg-white p-10 rounded-3xl border border-slate-200 flex items-center justify-center text-slate-400">
                {message ? message.text : <Loader2 className="animate-spin" />}
            </div>
        );
    }

    const selected = stages.find((s) => s._key === selectedKey) || null;
    const selectedIndex = selected ? stages.indexOf(selected) : -1;

    const list = (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {stages.length === 0 && <div className="p-6 text-center text-xs text-slate-400">Aucun stage</div>}
            {stages.map((stage, i) => (
                <div key={stage._key} className={`flex items-center border-b border-slate-100 last:border-0 ${selectedKey === stage._key ? 'bg-turquoise/5' : 'hover:bg-slate-50'}`}>
                    <button onClick={() => setSelectedKey(stage._key)} className="flex-1 min-w-0 p-3 flex items-center gap-3 text-left">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative">
                            {stage.imageUrl && <img src={`${stage.imageUrl}?w=100&h=100&fit=crop`} alt="" className="w-full h-full object-cover" />}
                            <span className="absolute bottom-0 inset-x-0 h-1.5" style={{ background: hexOf(stage) }} />
                        </div>
                        <div className="min-w-0">
                            <span className={`block font-black uppercase tracking-tighter line-clamp-1 ${stage.showOnHome === false ? "text-slate-400" : "text-abysse"}`}>{stage.officialName || 'Sans nom'}</span>
                            <span className="block text-[10px] text-slate-400 mt-0.5 italic line-clamp-1">{[stage.age, stage.price].filter(Boolean).join(' · ')}</span>
                        </div>
                    </button>
                    <HomeToggle compact stage={stage} onToggle={() => updateStage(stage._key, { showOnHome: stage.showOnHome === false })} />
                    <div className="flex flex-col pr-2">
                        <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-slate-300 hover:text-abysse disabled:opacity-30" title="Monter"><ArrowUp size={14} /></button>
                        <button onClick={() => move(i, 1)} disabled={i === stages.length - 1} className="p-1 text-slate-300 hover:text-abysse disabled:opacity-30" title="Descendre"><ArrowDown size={14} /></button>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-wrap items-center gap-3 mb-2">
                <div className="flex-1 min-w-[200px]">
                    <h3 className="text-xl font-black uppercase italic text-abysse">Fiches Stages Vacances</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Page École de voile · l'œil choisit ceux mis en avant sur l'accueil</p>
                </div>
                <button onClick={() => { if (!dirty || window.confirm('Abandonner les modifications non enregistrées ?')) load(); }} className="p-2 text-slate-400 hover:text-abysse" title="Recharger"><RefreshCw size={16} /></button>
                <button onClick={addStage} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"><Plus size={14} /> Nouveau stage</button>
                <button onClick={save} disabled={!dirty || saving} className="px-4 py-2 bg-abysse text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-turquoise transition-all flex items-center gap-2 disabled:opacity-40">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer
                </button>
            </div>

            {message && (
                <div className={`px-4 py-2 rounded-xl text-xs font-bold ${message.kind === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{message.text}</div>
            )}
            {dirty && !message && (
                <div className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700">Modifications non enregistrées — cliquez sur « Enregistrer » pour les publier.</div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6 items-start">
                <div className={selected ? 'hidden xl:block' : ''}>{list}</div>
                {selected ? (
                    <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">
                        <div className="flex items-center gap-2 p-4 border-b border-slate-100">
                            <button onClick={() => setSelectedKey(null)} className="p-2 text-slate-400 hover:text-abysse xl:hidden" title="Retour"><ArrowLeft size={18} /></button>
                            <span className="size-3 rounded-full" style={{ background: hexOf(selected) }} />
                            <h4 className="flex-1 font-black text-sm uppercase text-abysse line-clamp-1">{selected.officialName || 'Sans nom'}</h4>
                            <HomeToggle stage={selected} onToggle={() => updateStage(selected._key, { showOnHome: selected.showOnHome === false })} />
                            <button onClick={() => move(selectedIndex, -1)} disabled={selectedIndex === 0} className="p-2 text-slate-400 hover:text-abysse disabled:opacity-30" title="Monter"><ArrowUp size={16} /></button>
                            <button onClick={() => move(selectedIndex, 1)} disabled={selectedIndex === stages.length - 1} className="p-2 text-slate-400 hover:text-abysse disabled:opacity-30" title="Descendre"><ArrowDown size={16} /></button>
                            <button onClick={() => duplicate(selected)} className="p-2 text-slate-400 hover:text-abysse" title="Dupliquer"><Copy size={16} /></button>
                            <button onClick={() => remove(selected)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Supprimer"><Trash2 size={16} /></button>
                        </div>
                        <div className="p-4 md:p-6">
                            <StageForm key={`${selected._key}-${loadCount}`} stage={selected} onChange={(patch) => updateStage(selected._key, patch)} />
                        </div>
                    </div>
                ) : (
                    <div className="hidden xl:flex bg-white/50 rounded-3xl border border-dashed border-slate-300 p-10 items-center justify-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                        Sélectionnez un stage à modifier
                    </div>
                )}
            </div>
        </div>
    );
}

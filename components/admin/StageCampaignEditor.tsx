'use client';

import { useState } from 'react';
import { StageCampaign, selectStageCampaign, campaignDates } from '@/lib/stageCampaigns';
import { uploadImage } from './uploadImage';

const input = 'mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-abysse';

export default function StageCampaignEditor({ campaigns, pinnedKey, stages, onChange }: {
  campaigns: StageCampaign[];
  pinnedKey: string;
  stages: { _key: string; officialName?: string }[];
  onChange: (campaigns: StageCampaign[], pinnedKey: string) => void;
}) {
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const patch = (key: string, changes: Partial<StageCampaign>) => onChange(campaigns.map(c => c._key === key ? { ...c, ...changes } : c), pinnedKey);
  const current = selectStageCampaign(campaigns, pinnedKey);
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 space-y-5">
    <div>
      <h3 className="text-xl font-black uppercase italic text-abysse">Campagnes de vacances</h3>
      <p className="mt-2 text-sm text-slate-500">Préparez les offres de Pâques, d’été et de Toussaint. Les dates choisissent la campagne affichée sur l’accueil ; les fiches gardent leur ordre.</p>
    </div>
    <label className="block text-sm font-bold">Campagne mise en avant
      <select className={input} value={pinnedKey} onChange={e => onChange(campaigns, e.target.value)}>
        <option value="">Automatique selon les dates</option>
        {campaigns.map(c => <option key={c._key} value={c._key}>{c.title || 'Sans titre'}</option>)}
      </select>
    </label>
    <p className="rounded-xl bg-sky-50 p-3 text-sm text-abysse">{current ? `Aujourd’hui : ${current.title} · ${campaignDates(current)}` : 'Aucune campagne en cours de promotion. L’accueil présentera le catalogue des stages.'}</p>
    {campaigns.map(c => <details key={c._key} className="rounded-2xl border border-slate-200 p-4" open={!c.title}>
      <summary className="cursor-pointer font-bold text-abysse">{c.title || 'Nouvelle campagne'} {c.enabled ? '' : '· Brouillon'}</summary>
      <div className="mt-4 space-y-4">
        <label className="block text-sm font-bold">Titre<input className={input} value={c.title} onChange={e => patch(c._key, { title: e.target.value })} placeholder="Stages de la Toussaint 2026" /></label>
        <div className="grid gap-3 sm:grid-cols-3">
          {([['promotionStart', 'Début de mise en avant'], ['startDate', 'Début des stages'], ['endDate', 'Fin des stages']] as const).map(([field, label]) => <label key={field} className="text-sm font-bold">{label}<input type="date" className={input} value={c[field]} onChange={e => patch(c._key, { [field]: e.target.value })} /></label>)}
        </div>
        <label className="block text-sm font-bold">Présentation<textarea className={input} rows={3} value={c.description || ''} onChange={e => patch(c._key, { description: e.target.value })} /></label>
        <label className="block text-sm font-bold">Lien d’inscription<input type="url" className={input} value={c.registrationUrl || ''} onChange={e => patch(c._key, { registrationUrl: e.target.value })} placeholder="https://coutainville.axyomes.com/…" /></label>
        <fieldset><legend className="mb-2 text-sm font-bold">Formules proposées</legend><div className="grid gap-2 sm:grid-cols-2">{stages.map(s => <label key={s._key} className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm"><input type="checkbox" checked={c.stageKeys.includes(s._key)} onChange={e => patch(c._key, { stageKeys: e.target.checked ? [...c.stageKeys, s._key] : c.stageKeys.filter(k => k !== s._key) })} />{s.officialName}</label>)}</div></fieldset>
        <p className="text-xs text-slate-500">Sans formule sélectionnée : annonce du programme à venir. Une formule : grand bloc illustré. Plusieurs : cartes adaptées à l’offre.</p>
        <label className="block text-sm font-bold">Photo de la campagne (facultative)
          <input type="file" accept="image/*" disabled={uploading} className={input} onChange={async e => {
            const file = e.target.files?.[0]; if (!file) return;
            setUploading(true); setError('');
            try { const { assetId, url } = await uploadImage(file); patch(c._key, { image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }, imageUrl: url }); }
            catch { setError('Impossible d’envoyer la photo.'); } finally { setUploading(false); }
          }} />
        </label>
        {c.imageUrl && <div className="flex items-center gap-3"><img src={c.imageUrl} alt="" className="h-24 w-40 rounded-xl object-cover" /><button type="button" onClick={() => patch(c._key, { image: undefined, imageUrl: undefined })}>Retirer la photo</button></div>}
        <div className="flex justify-between gap-4"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={c.enabled} onChange={e => patch(c._key, { enabled: e.target.checked })} />Activer cette campagne</label><button type="button" className="text-sm text-red-600" onClick={() => { if (confirm('Supprimer cette campagne ?')) onChange(campaigns.filter(x => x._key !== c._key), pinnedKey === c._key ? '' : pinnedKey); }}>Supprimer</button></div>
      </div>
    </details>)}
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    <button type="button" className="rounded-xl bg-abysse px-4 py-3 text-sm font-bold text-white" onClick={() => onChange([...campaigns, { _key: crypto.randomUUID(), title: '', startDate: '', endDate: '', promotionStart: '', stageKeys: [], enabled: false }], pinnedKey)}>Ajouter une campagne</button>
    <p className="text-xs text-slate-500">Utilisez « Enregistrer » pour publier les campagnes et les fiches ensemble. Une campagne terminée quitte automatiquement l’accueil, même en sélection manuelle.</p>
  </section>;
}

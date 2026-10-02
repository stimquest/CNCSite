"use client";

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Check, CircleAlert, Euro, Loader2, Plus, RefreshCw, Save, Search, Trash2 } from 'lucide-react';

import styles from './ActivityPricingManager.module.css';

type PricingSection = 'courses' | 'locations' | 'hidden';
type PricingMode = PricingSection | 'mixed';
type PriceLine = { _key?: string; label: string; value: string; pricingSection?: PricingSection; duration?: string; details?: string };
type ActivityPricing = {
    _id: string;
    _rev: string;
    id: string;
    title: string;
    category?: string;
    price?: string;
    duration?: string;
    pricingMode?: PricingMode;
    prices: PriceLine[];
    pricingLastConfirmedAt?: string;
};

const newKey = () => Math.random().toString(36).slice(2, 14);
const pricingModes: PricingMode[] = ['courses', 'locations', 'mixed', 'hidden'];
const inferPricingMode = (activity: ActivityPricing): PricingMode => {
    if (activity.pricingMode && pricingModes.includes(activity.pricingMode)) return activity.pricingMode;
    if (activity.prices.length > 0 && activity.prices.every(line => /location/i.test(line.label))) return 'locations';
    const sections = new Set(activity.prices.map(line => line.pricingSection).filter(Boolean));
    if (sections.size === 1) return Array.from(sections)[0] as PricingSection;
    return 'mixed';
};
const withPricingDefaults = (activity: ActivityPricing): ActivityPricing => {
    const pricingMode = inferPricingMode(activity);
    const prices = pricingMode === 'mixed'
        ? activity.prices
        : activity.prices.map(line => ({ ...line, pricingSection: pricingMode }));
    return { ...activity, pricingMode, prices };
};
const isComplete = (activity: ActivityPricing) => !!activity.price?.trim()
    && !!activity.prices?.length
    && !!activity.pricingMode
    && activity.prices.every(price => price.label?.trim() && price.value?.trim() && ['courses', 'locations', 'hidden'].includes(price.pricingSection || ''));
const verificationLabel = (activity: ActivityPricing) => {
    if (!isComplete(activity)) return 'À compléter';
    if (!activity.pricingLastConfirmedAt) return 'À vérifier';
    return `Vérifié le ${new Date(activity.pricingLastConfirmedAt).toLocaleDateString('fr-FR')}`;
};

export default function ActivityPricingManager() {
    const [activities, setActivities] = useState<ActivityPricing[]>([]);
    const [selectedId, setSelectedId] = useState('');
    const [draft, setDraft] = useState<ActivityPricing | null>(null);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    async function load(preferredId?: string) {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/cockpit/activity-pricing', { cache: 'no-store' });
            const payload = await response.json();
            if (!response.ok) throw new Error(payload.error || 'Chargement impossible');
            const next = ((payload.activities || []) as ActivityPricing[]).map(activity => withPricingDefaults({ ...activity, prices: activity.prices || [] }));
            setActivities(next);
            const id = preferredId && next.some(activity => activity._id === preferredId) ? preferredId : selectedId && next.some(activity => activity._id === selectedId) ? selectedId : next[0]?._id || '';
            setSelectedId(id);
            setDraft(next.find(activity => activity._id === id) || null);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Chargement impossible');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { void load(); }, []);

    const filtered = useMemo(() => {
        const needle = query.trim().toLocaleLowerCase('fr');
        const sorted = [...activities].sort((a, b) => {
            const statusA = isComplete(a) && a.pricingLastConfirmedAt ? 1 : 0;
            const statusB = isComplete(b) && b.pricingLastConfirmedAt ? 1 : 0;
            return statusA - statusB || a.title.localeCompare(b.title, 'fr');
        });
        return needle ? sorted.filter(activity => `${activity.title} ${activity.category || ''}`.toLocaleLowerCase('fr').includes(needle)) : sorted;
    }, [activities, query]);

    const selectActivity = (activity: ActivityPricing) => {
        setSelectedId(activity._id);
        setDraft(structuredClone(activity));
        setError('');
        setNotice('');
    };

    const updateLine = (index: number, patch: Partial<PriceLine>) => setDraft(current => current ? ({ ...current, pricingLastConfirmedAt: undefined, prices: current.prices.map((line, lineIndex) => lineIndex === index ? { ...line, ...patch } : line) }) : current);
    const updatePricingMode = (pricingMode: PricingMode) => setDraft(current => current ? ({
        ...current,
        pricingMode,
        pricingLastConfirmedAt: undefined,
        prices: pricingMode === 'mixed' ? current.prices : current.prices.map(line => ({ ...line, pricingSection: pricingMode })),
    }) : current);

    const save = async () => {
        if (!draft) return;
        setSaving(true);
        setError('');
        setNotice('');
        try {
            const response = await fetch('/api/cockpit/activity-pricing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activity: draft }) });
            const payload = await response.json();
            if (!response.ok) throw new Error(payload.error || 'Enregistrement impossible');
            const saved = { ...(payload.activity as ActivityPricing), prices: (payload.activity as ActivityPricing).prices || [] };
            setActivities(current => current.map(activity => activity._id === saved._id ? saved : activity));
            setDraft(saved);
            setNotice('Tarifs enregistrés et marqués comme vérifiés. Les deux pages publiques utilisent maintenant ces montants.');
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Enregistrement impossible');
        } finally {
            setSaving(false);
        }
    };

    return <section className={styles.root}>
        <header data-admin-page-header>
            <div><h2 data-admin-page-title>Activités & tarifs</h2><p data-admin-page-description>Contrôlez les montants affichés sur les fiches activités et la page Tarifs.</p></div>
            <div className={styles.headerActions}><button type="button" className={styles.secondary} onClick={() => void load(selectedId)} disabled={loading || saving}><RefreshCw size={16} /> Actualiser</button><a href="/studio/structure/activity" target="_blank" rel="noreferrer">Modifier les textes dans Sanity <ArrowUpRight size={15} /></a></div>
        </header>

        {error ? <p role="alert" className={styles.error}>{error}</p> : null}
        {notice ? <p role="status" className={styles.notice}><Check size={17} />{notice}</p> : null}

        <div className={styles.summary}>
            <div><strong>{activities.length}</strong><span>activités</span></div>
            <div><strong>{activities.filter(activity => isComplete(activity) && activity.pricingLastConfirmedAt).length}</strong><span>tarifs vérifiés</span></div>
            <div data-alert={activities.some(activity => !isComplete(activity) || !activity.pricingLastConfirmedAt)}><strong>{activities.filter(activity => !isComplete(activity) || !activity.pricingLastConfirmedAt).length}</strong><span>à revoir</span></div>
        </div>

        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <label className={styles.search}><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Rechercher une activité" /></label>
                <div className={styles.activityList}>
                    {loading ? <p className={styles.loading}><Loader2 size={18} className="animate-spin" /> Chargement…</p> : filtered.map(activity => {
                        const conform = isComplete(activity) && !!activity.pricingLastConfirmedAt;
                        return <button type="button" key={activity._id} data-active={activity._id === selectedId} onClick={() => selectActivity(activity)}>
                            <span className={styles.activityIdentity}><strong>{activity.title}</strong><small>{activity.price || 'Prix principal manquant'}</small></span>
                            <span className={conform ? styles.ok : styles.warning}>{conform ? <Check size={14} /> : <CircleAlert size={14} />}{verificationLabel(activity)}</span>
                        </button>;
                    })}
                </div>
            </aside>

            <div className={styles.editor}>
                {draft ? <>
                    <div className={styles.editorTitle}><div><span>{draft.category || 'Activité'}</span><h3>{draft.title}</h3></div><span className={isComplete(draft) ? styles.ok : styles.warning}>{isComplete(draft) ? <Check size={15} /> : <CircleAlert size={15} />}{isComplete(draft) ? 'Grille complète' : 'Informations manquantes'}</span></div>
                    <div className={styles.pricingControls}>
                        <label className={styles.primaryPrice}><span>Prix principal affiché sur la fiche</span><div><Euro size={18} /><input value={draft.price || ''} onChange={event => setDraft(current => current ? { ...current, price: event.target.value, pricingLastConfirmedAt: undefined } : current)} placeholder="45 €" /></div></label>
                        <label className={styles.modeControl}><span>Mode tarifaire de l’activité</span><select value={draft.pricingMode || 'mixed'} onChange={event => updatePricingMode(event.target.value as PricingMode)}><option value="courses">Séances & cours</option><option value="locations">Locations uniquement</option><option value="mixed">Mixte — choix par ligne</option><option value="hidden">Fiche activité uniquement</option></select><small>{draft.pricingMode === 'mixed' ? 'Chaque tarif peut avoir une destination différente.' : 'Toutes les lignes héritent automatiquement de ce mode.'}</small></label>
                    </div>

                    <div className={styles.linesHeading}><div><h4>Grille tarifaire</h4><p>Chaque ligne alimente la fiche activité et, selon son emplacement, la page Tarifs.</p></div><button type="button" onClick={() => setDraft(current => current ? { ...current, pricingLastConfirmedAt: undefined, prices: [...(current.prices || []), { _key: newKey(), label: '', value: '', pricingSection: current.pricingMode === 'mixed' ? undefined : current.pricingMode || 'hidden', duration: '', details: '' }] } : current)}><Plus size={15} /> Ajouter un tarif</button></div>

                    <div className={styles.priceLines}>
                        {(draft.prices || []).map((line, index) => <article key={line._key || index} className={styles.priceLine}>
                            <div className={styles.lineMain}><label><span>Libellé</span><input value={line.label || ''} onChange={event => updateLine(index, { label: event.target.value })} placeholder="Séance découverte" /></label><label><span>Tarif</span><input value={line.value || ''} onChange={event => updateLine(index, { value: event.target.value })} placeholder="45 €" /></label><button type="button" aria-label={`Supprimer le tarif ${line.label || index + 1}`} onClick={() => setDraft(current => current ? { ...current, pricingLastConfirmedAt: undefined, prices: current.prices.filter((_, lineIndex) => lineIndex !== index) } : current)}><Trash2 size={16} /></button></div>
                            <div className={styles.lineDetails}><label><span>Affichage page Tarifs</span><select disabled={draft.pricingMode !== 'mixed'} value={line.pricingSection || ''} onChange={event => updateLine(index, { pricingSection: event.target.value as PricingSection })}><option value="" disabled>Choisir une destination</option><option value="courses">Séances & cours</option><option value="locations">Locations</option><option value="hidden">Fiche activité uniquement</option></select></label><label><span>Durée</span><input value={line.duration || ''} onChange={event => updateLine(index, { duration: event.target.value })} placeholder={draft.duration || '2 h'} /></label><label><span>Précisions</span><input value={line.details || ''} onChange={event => updateLine(index, { details: event.target.value })} placeholder="Matériel compris…" /></label></div>
                        </article>)}
                        {!draft.prices?.length ? <p className={styles.empty}>Aucun tarif détaillé. Ajoutez au moins une ligne pour rendre la fiche conforme.</p> : null}
                    </div>

                    <footer className={styles.footer}><p>{draft.pricingLastConfirmedAt ? `Dernière vérification : ${new Date(draft.pricingLastConfirmedAt).toLocaleString('fr-FR')}` : 'Ces tarifs doivent être vérifiés.'}</p><button type="button" className={styles.save} disabled={saving} onClick={() => void save()}>{saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />} Enregistrer et confirmer</button></footer>
                </> : <div className={styles.empty}>Sélectionnez une activité pour contrôler ses tarifs.</div>}
            </div>
        </div>
    </section>;
}

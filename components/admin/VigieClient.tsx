"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useLiveStatus } from '@/contexts/LiveStatusContext';
import { Check, Loader2, Pencil, Trash2, EyeOff, Link2, Pin, X, RotateCcw, Plus } from 'lucide-react';
import styles from './VigieClient.module.css';

// ─── Types ────────────────────────────────────────────────────────
export interface VigieMessage {
    _id: string;
    title: string;
    content: string;
    category: string;
    isPinned: boolean;
    targetGroups: string[];
    externalLink?: string;
    publishedAt: string;
    expiresAt?: string;
}

type Form = { title: string; content: string; category: string; targetGroups: string[]; isPinned: boolean; externalLink: string; expiresAt: string };

// Mêmes catégories et mêmes couleurs que le Fil info public
const CATEGORIES = [
    { id: 'alert', label: 'Alerte' },
    { id: 'weather', label: 'Météo' },
    { id: 'info', label: 'Info' },
    { id: 'event', label: 'Événement' },
    { id: 'vibe', label: 'Ambiance' },
];

const TEMPLATES = [
    { label: 'Vent fort', category: 'alert', title: 'Vent fort aujourd’hui', content: 'Rafales attendues : les activités sont adaptées aux conditions. Renseignez-vous à l’accueil avant de partir sur l’eau.' },
    { label: 'Séance annulée', category: 'alert', title: 'Séance annulée', content: 'Les conditions ne permettent pas d’assurer la séance en sécurité. Nous revenons vers vous pour la reporter.' },
    { label: 'Fermeture', category: 'info', title: 'Club fermé exceptionnellement', content: 'L’accueil et les activités sont fermés aujourd’hui. Merci de votre compréhension.' },
];

const EMPTY: Form = { title: '', content: '', category: 'info', targetGroups: ['all'], isPinned: false, externalLink: '', expiresAt: '' };

// ─── Dates ────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, '0');
const toInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const dayAt = (days: number, hour: number) => { const d = new Date(); d.setDate(d.getDate() + days); d.setHours(hour, 0, 0, 0); return d; };
const formatDate = (d: Date) => d.toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const remaining = (d: Date, now: number) => {
    const hours = (d.getTime() - now) / 3600000;
    if (hours < 1) return 'moins d’une heure';
    if (hours < 24) return `${Math.round(hours)} h`;
    return `${Math.round(hours / 24)} j`;
};

function expiryPresets(now: number) {
    const presets: { label: string; date: Date }[] = [];
    const tonight = dayAt(0, 21);
    if (tonight.getTime() > now) presets.push({ label: 'Ce soir', date: tonight });
    presets.push({ label: 'Demain midi', date: dayAt(1, 12) });
    let toSunday = (7 - new Date(now).getDay()) % 7;
    if (toSunday === 0 && tonight.getTime() <= now) toSunday = 7;
    presets.push({ label: 'Fin du week-end', date: dayAt(toSunday, 21) });
    return presets;
}

export default function VigieClient({ messages, onRefresh, initialCompose = false }: { messages: VigieMessage[]; onRefresh: () => void; initialCompose?: boolean }) {
    const { stageDefinitions } = useLiveStatus();
    const [form, setForm] = useState<Form>(EMPTY);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showLink, setShowLink] = useState(false);
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [saving, setSaving] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(timer); }, []);

    const composerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => { if (initialCompose) titleRef.current?.focus({ preventScroll: true }); }, [initialCompose]);

    // Le texte du message s'agrandit avec son contenu, comme sur le Fil info
    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }, [form.content]);

    const groups = [
        { id: 'all', label: 'Tout le monde' },
        { id: 'club-hebdo', label: 'Club Hebdo' },
        { id: 'char-voile', label: 'Char à voile' },
        ...stageDefinitions.map(s => ({ id: s.vigieGroupId, label: s.shortLabel || s.label })),
        { id: 'marche-aquatique', label: 'Marche aquatique' },
        { id: 'pratique-libre', label: 'Pratique libre' },
    ];
    const groupLabel = (id: string) => groups.find(g => g.id === id)?.label ?? id;

    const isExpired = (m: VigieMessage) => !!m.expiresAt && new Date(m.expiresAt).getTime() <= now;
    const live = messages.filter(m => !isExpired(m));
    const expired = messages.filter(isExpired);
    const presets = expiryPresets(now);
    const isDirty = form.title !== '' || form.content !== '' || editingId !== null;

    const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm(previous => ({ ...previous, [key]: value }));

    const notify = (message: string) => { setToast(message); setTimeout(() => setToast(null), 3000); };

    const post = async (body: object) => {
        const res = await fetch('/api/cockpit/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error('HTTP ' + res.status);
    };

    const reset = () => { setForm(EMPTY); setEditingId(null); setShowLink(false); setShowCustomDate(false); setError(null); };

    const loadMessage = (m: VigieMessage, asNew: boolean) => {
        setForm({
            title: m.title, content: m.content, category: m.category,
            targetGroups: m.targetGroups?.length ? m.targetGroups : ['all'],
            isPinned: m.isPinned, externalLink: m.externalLink ?? '',
            expiresAt: !asNew && m.expiresAt ? toInput(new Date(m.expiresAt)) : '',
        });
        setEditingId(asNew ? null : m._id);
        setShowLink(!!m.externalLink);
        setShowCustomDate(false);
        setError(null);
        composerRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
        setTimeout(() => titleRef.current?.focus(), 50);
    };

    const applyTemplate = (template: typeof TEMPLATES[number]) => {
        if ((form.title || form.content) && !window.confirm('Remplacer le texte en cours par ce modèle ?')) return;
        setForm(previous => ({ ...previous, title: template.title, content: template.content, category: template.category }));
        setTimeout(() => contentRef.current?.focus(), 0);
    };

    const toggleGroup = (id: string) => setForm(previous => {
        if (id === 'all') return { ...previous, targetGroups: ['all'] };
        const specific = previous.targetGroups.filter(g => g !== 'all');
        const next = specific.includes(id) ? specific.filter(g => g !== id) : [...specific, id];
        return { ...previous, targetGroups: next.length ? next : ['all'] };
    });

    const submit = async () => {
        if (saving) return;
        if (!form.title.trim()) { setError('Ajoutez un titre.'); titleRef.current?.focus(); return; }
        if (!form.content.trim()) { setError('Écrivez le message.'); contentRef.current?.focus(); return; }
        setSaving(true);
        setError(null);
        const patch: Record<string, unknown> = { title: form.title.trim(), content: form.content.trim(), category: form.category, targetGroups: form.targetGroups, isPinned: form.isPinned };
        const unset: string[] = [];
        if (form.externalLink.trim()) patch.externalLink = form.externalLink.trim(); else unset.push('externalLink');
        if (form.expiresAt) patch.expiresAt = new Date(form.expiresAt).toISOString(); else unset.push('expiresAt');
        try {
            await post(editingId
                ? { type: 'UPDATE_INFO', _id: editingId, patch, unset }
                : { type: 'CREATE_INFO', patch: { ...patch, publishedAt: new Date().toISOString() } });
            notify(editingId ? 'Message mis à jour' : 'Message publié sur le Fil info');
            reset();
            onRefresh();
        } catch {
            setError('La publication a échoué. Votre texte est conservé : réessayez.');
        } finally {
            setSaving(false);
        }
    };

    const withdraw = async (m: VigieMessage) => {
        setBusyId(m._id);
        try {
            await post({ type: 'UPDATE_INFO', _id: m._id, patch: { expiresAt: new Date().toISOString() } });
            if (editingId === m._id) reset();
            notify('Message retiré du site');
            onRefresh();
        } catch {
            setError('Le retrait a échoué. Réessayez.');
        } finally {
            setBusyId(null);
        }
    };

    const remove = async (m: VigieMessage) => {
        if (!window.confirm(`Supprimer définitivement « ${m.title} » ?`)) return;
        setBusyId(m._id);
        try {
            await post({ type: 'DELETE_INFO', _id: m._id });
            if (editingId === m._id) reset();
            notify('Message supprimé');
            onRefresh();
        } catch {
            setError('La suppression a échoué. Réessayez.');
        } finally {
            setBusyId(null);
        }
    };

    const onComposerKey = (event: React.KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); submit(); }
        else if (event.key === 'Escape' && editingId) { event.preventDefault(); reset(); }
    };

    const expiryDate = form.expiresAt ? new Date(form.expiresAt) : null;

    const renderItem = (m: VigieMessage, isOld: boolean) => {
        const targets = (m.targetGroups ?? []).includes('all') || !m.targetGroups?.length ? 'Tout le monde' : m.targetGroups.map(groupLabel).join(', ');
        const end = m.expiresAt ? new Date(m.expiresAt) : null;
        return <li key={m._id} className={`${styles.item} ${styles[m.category] ?? styles.info}`} data-editing={editingId === m._id} data-pinned={m.isPinned && !isOld}>
            <span className={styles.dot} />
            <div className={styles.itemBody}>
                <p className={styles.itemMeta}>
                    {m.isPinned && !isOld && <span className={styles.pinned}>Épinglé ·</span>}
                    <span className={styles.catLabel}>{CATEGORIES.find(c => c.id === m.category)?.label ?? 'Info'}</span>
                    <span>· {targets}</span>
                </p>
                <p className={styles.itemTitle}>{m.title}</p>
                <p className={styles.itemText}>{m.content}</p>
                <p className={styles.itemEnd}>
                    {isOld
                        ? `Retiré le ${end!.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`
                        : end ? `Disparaît dans ${remaining(end, now)} · ${formatDate(end)}` : 'Reste en ligne jusqu’à retrait'}
                </p>
            </div>
            <div className={styles.itemActions}>
                {busyId === m._id
                    ? <Loader2 size={15} className="animate-spin" />
                    : isOld
                        ? <>
                            <button onClick={() => loadMessage(m, true)} title="Republier ce message" aria-label={`Republier ${m.title}`}><RotateCcw size={15} /></button>
                            <button onClick={() => remove(m)} title="Supprimer définitivement" aria-label={`Supprimer ${m.title}`}><Trash2 size={15} /></button>
                        </>
                        : <>
                            <button onClick={() => loadMessage(m, false)} title="Modifier" aria-label={`Modifier ${m.title}`}><Pencil size={15} /></button>
                            <button onClick={() => withdraw(m)} title="Retirer du site (conservé dans les expirés)" aria-label={`Retirer ${m.title}`}><EyeOff size={15} /></button>
                            <button onClick={() => remove(m)} title="Supprimer définitivement" aria-label={`Supprimer ${m.title}`}><Trash2 size={15} /></button>
                        </>}
            </div>
        </li>;
    };

    return <div className={styles.root}>
        {(toast || error) && <div role={error ? 'alert' : 'status'} className={`${styles.feedback} ${error ? styles.error : ''}`}>{error || toast}</div>}
        <header data-admin-page-header className={styles.intro}>
            <div>
                <h2 data-admin-page-title>Vigie</h2>
                <p data-admin-page-description>Messages diffusés sur le Fil info et la page d’accueil</p>
            </div>
            <span className={styles.liveCount} data-empty={live.length === 0}><span className={styles.liveDot} />{live.length} message{live.length > 1 ? 's' : ''} en ligne</span>
        </header>

        <div className={styles.layout}>
            {/* ─── Rédaction ─── */}
            <section ref={composerRef} className={styles.composer} onKeyDown={onComposerKey} aria-label="Rédiger un message">
                <div className={styles.composerHead}>
                    <h3>{editingId ? 'Modifier le message' : 'Nouveau message'}</h3>
                    {editingId
                        ? <button className={styles.ghost} onClick={reset}><X size={14} /> Annuler la modification <kbd>Esc</kbd></button>
                        : <div className={styles.templates}>
                            <span>Modèles</span>
                            {TEMPLATES.map(t => <button key={t.label} className={styles.chip} onClick={() => applyTemplate(t)}>{t.label}</button>)}
                        </div>}
                </div>

                <div className={`${styles.card} ${styles[form.category] ?? styles.info}`} data-pinned={form.isPinned}>
                    <span className={styles.dot} />
                    <div className={styles.cardBody}>
                        <div className={styles.categories} role="radiogroup" aria-label="Catégorie">
                            {form.isPinned && <span className={styles.pinned}>Épinglé ·</span>}
                            {CATEGORIES.map(c => <button key={c.id} role="radio" aria-checked={form.category === c.id}
                                className={`${styles.cat} ${styles[c.id]}`} onClick={() => set('category', c.id)}>
                                <span className={styles.catDot} />{c.label}
                            </button>)}
                            <span className={styles.when}>· à l’instant</span>
                        </div>
                        <input ref={titleRef} className={styles.titleInput} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Titre du message" aria-label="Titre" maxLength={90} />
                        <textarea ref={contentRef} className={styles.contentInput} rows={2} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Ce que les visiteurs doivent savoir…" aria-label="Message" />
                        {showLink
                            ? <div className={styles.linkRow}>
                                <Link2 size={13} />
                                <input type="url" value={form.externalLink} onChange={e => set('externalLink', e.target.value)} placeholder="https://…" aria-label="Lien" autoFocus={!form.externalLink} />
                                <button onClick={() => { set('externalLink', ''); setShowLink(false); }} aria-label="Retirer le lien"><X size={13} /></button>
                            </div>
                            : <button className={styles.addLink} onClick={() => setShowLink(true)}><Plus size={12} /> Ajouter un lien</button>}
                    </div>
                </div>
                <p className={styles.caption}>Tel que les visiteurs le verront sur le Fil info.</p>

                <div className={styles.field}>
                    <span className={styles.fieldLabel}>Pour qui ?</span>
                    <div className={styles.chips}>
                        {groups.map(g => <button key={g.id} className={styles.chip} aria-pressed={form.targetGroups.includes(g.id)} onClick={() => toggleGroup(g.id)}>{g.label}</button>)}
                    </div>
                </div>

                <div className={styles.field}>
                    <span className={styles.fieldLabel}>Jusqu’à quand ?</span>
                    <div className={styles.chips}>
                        {presets.map(p => <button key={p.label} className={styles.chip} aria-pressed={form.expiresAt === toInput(p.date)}
                            onClick={() => { set('expiresAt', toInput(p.date)); setShowCustomDate(false); }}>{p.label}</button>)}
                        <button className={styles.chip} aria-pressed={showCustomDate || (!!form.expiresAt && !presets.some(p => toInput(p.date) === form.expiresAt))}
                            onClick={() => setShowCustomDate(true)}>Date précise…</button>
                        <button className={styles.chip} aria-pressed={!form.expiresAt && !showCustomDate} onClick={() => { set('expiresAt', ''); setShowCustomDate(false); }}>Sans fin</button>
                        {showCustomDate && <input type="datetime-local" className={styles.dateInput} value={form.expiresAt} min={toInput(new Date())} onChange={e => set('expiresAt', e.target.value)} aria-label="Date de fin" />}
                    </div>
                    <p className={styles.fieldHint}>{expiryDate ? `Disparaît du site ${formatDate(expiryDate)}` : 'Reste en ligne jusqu’à ce que vous le retiriez'}</p>
                </div>

                <div className={styles.composerFoot}>
                    <label className={styles.pinToggle}>
                        <input type="checkbox" checked={form.isPinned} onChange={e => set('isPinned', e.target.checked)} />
                        <span className={styles.switch} />
                        <Pin size={14} /> Épingler en haut du fil
                    </label>
                    <div className={styles.footActions}>
                        {isDirty && !editingId && <button className={styles.ghost} onClick={reset}>Effacer</button>}
                        <button className={styles.publish} disabled={saving} onClick={submit}>
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            {saving ? 'Publication…' : editingId ? 'Enregistrer les modifications' : 'Publier'}
                            <kbd>Ctrl ↵</kbd>
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── En ligne ─── */}
            <section className={styles.feed} aria-label="Messages en ligne">
                <h3 className={styles.feedTitle}>En ligne</h3>
                {live.length
                    ? <ul className={styles.list}>{live.map(m => renderItem(m, false))}</ul>
                    : <p className={styles.empty}>Aucun message en ligne : le Fil info est vide.</p>}
                {expired.length > 0 && <details className={styles.archive}>
                    <summary>Expirés ou retirés ({expired.length})</summary>
                    <ul className={styles.list}>{expired.map(m => renderItem(m, true))}</ul>
                </details>}
            </section>
        </div>
    </div>;
}

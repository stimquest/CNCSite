'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    defineSchema,
    EditorProvider,
    PortableTextEditable,
    useEditor,
    useEditorSelector,
} from '@portabletext/editor';
import type {
    PortableTextBlock,
    RenderAnnotationFunction,
    RenderBlockFunction,
    RenderDecoratorFunction,
    RenderListItemFunction,
    RenderStyleFunction,
} from '@portabletext/editor';
import { EventListenerPlugin } from '@portabletext/editor/plugins';
import * as selectors from '@portabletext/editor/selectors';
import {
    Archive, ArchiveRestore, ArrowLeft, Bold, CalendarDays, FileText, ExternalLink, ImagePlus, Italic, Link2, List, ListOrdered,
    Loader2, MousePointerClick, Plus, Save, Search, Send, Trash2, Undo2, Upload,
} from 'lucide-react';
import { editorialDates, editorialKind, parisToday, type EditorialDate, type EditorialKind } from '@/lib/editorial';
import styles from './ArticleEditor.module.css';
import { uploadImage } from '@/components/admin/uploadImage';

// ─── Schéma : miroir de sanity/schemas/article.ts (champ body) ───────────────
const schemaDefinition = defineSchema({
    decorators: [{ name: 'strong' }, { name: 'em' }],
    styles: [
        { name: 'normal' }, { name: 'normal_center' }, { name: 'normal_right' }, { name: 'normal_justify' },
        { name: 'h2' }, { name: 'h2_center' }, { name: 'h3' }, { name: 'h3_center' }, { name: 'blockquote' },
    ],
    annotations: [{ name: 'link', fields: [{ name: 'href', type: 'string' }, { name: 'blank', type: 'boolean' }] }],
    lists: [{ name: 'bullet' }, { name: 'number' }],
    inlineObjects: [],
    blockObjects: [
        {
            name: 'image',
            fields: [
                { name: 'asset', type: 'object' },
                { name: 'caption', type: 'string' },
                { name: 'layout', type: 'string' },
                { name: 'url', type: 'string' },
            ],
        },
        {
            name: 'ctaBlock',
            fields: [
                { name: 'text', type: 'string' },
                { name: 'url', type: 'string' },
                { name: 'style', type: 'string' },
            ],
        },
    ],
});

const STYLE_OPTIONS = [
    { value: 'normal', label: 'Paragraphe' },
    { value: 'normal_center', label: 'Paragraphe centré' },
    { value: 'normal_right', label: 'Paragraphe à droite' },
    { value: 'normal_justify', label: 'Paragraphe justifié' },
    { value: 'h2', label: 'Titre H2' },
    { value: 'h2_center', label: 'Titre H2 centré' },
    { value: 'h3', label: 'Titre H3' },
    { value: 'h3_center', label: 'Titre H3 centré' },
    { value: 'blockquote', label: 'Citation' },
];

const CATEGORIES = [
    { value: 'actualites', label: 'Actualités du Club' },
    { value: 'environnement', label: 'Environnement & Nature' },
    { value: 'navigation', label: 'Navigation & Technique' },
    { value: 'evenements', label: 'Événements & Sorties' },
];

const IMAGE_LAYOUTS = [
    { value: 'center', label: 'Centré' },
    { value: 'full', label: 'Pleine largeur' },
    { value: 'left', label: 'Flottant gauche' },
    { value: 'right', label: 'Flottant droite' },
];

const CTA_STYLES = [
    { value: 'primary', label: 'Primaire' },
    { value: 'secondary', label: 'Secondaire' },
    { value: 'outline', label: 'Contour' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type ImageRef = { _type: 'image'; asset: { _type: 'reference'; _ref: string } };

type ArticleDoc = {
    _id?: string;
    _type?: string;
    contentType?: EditorialKind;
    archived?: boolean;
    agendaDates?: EditorialDate[];
    linkedArticleId?: string;
    title?: string;
    slug?: { _type: 'slug'; current: string };
    category?: string;
    publishedAt?: string;
    coverImage?: ImageRef;
    coverImageUrl?: string;
    excerpt?: string;
    agendaDate?: string;
    agendaTime?: string;
    agendaBadge?: string;
    body?: PortableTextBlock[];
};

type ArticleListItem = {
    _id: string;
    _type?: string;
    contentType?: EditorialKind;
    archived?: boolean;
    agendaDates?: EditorialDate[];
    agendaDate?: string;
    startDate?: string;
    title?: string;
    slug?: string;
    category?: string;
    publishedAt?: string;
    coverImage?: string;
    hasDraft?: boolean;
    isPublished?: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const slugify = (text: string) =>
    text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96);

const today = parisToday;
const displayDate = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const newDate = (): EditorialDate => ({ _key: crypto.randomUUID(), date: today(), time: '', badge: '', archived: false });


const inputClass = 'w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-turquoise font-bold text-sm text-abysse';
const labelClass = 'text-xs font-semibold text-slate-600';

// ─── Rendu dans l'éditeur ─────────────────────────────────────────────────────
const renderStyle: RenderStyleFunction = (props) => {
    const align = props.schemaType.value.endsWith('_center') ? 'text-center'
        : props.schemaType.value.endsWith('_right') ? 'text-right'
            : props.schemaType.value.endsWith('_justify') ? 'text-justify' : '';
    if (props.schemaType.value.startsWith('h2')) return <h2 className={`text-2xl font-black text-abysse mt-4 mb-2 ${align}`}>{props.children}</h2>;
    if (props.schemaType.value.startsWith('h3')) return <h3 className={`text-lg font-black text-abysse mt-3 mb-1 ${align}`}>{props.children}</h3>;
    if (props.schemaType.value === 'blockquote') return <blockquote className="border-l-4 border-turquoise pl-4 italic text-slate-500 my-2">{props.children}</blockquote>;
    return <p className={`my-1.5 leading-relaxed ${align}`}>{props.children}</p>;
};

const renderDecorator: RenderDecoratorFunction = (props) => {
    if (props.value === 'strong') return <strong>{props.children}</strong>;
    if (props.value === 'em') return <em>{props.children}</em>;
    return <>{props.children}</>;
};

const renderAnnotation: RenderAnnotationFunction = (props) => {
    if (props.schemaType.name === 'link') {
        return <span className="text-turquoise underline" title={String(props.value.href || '')}>{props.children}</span>;
    }
    return <>{props.children}</>;
};

const renderListItem: RenderListItemFunction = (props) => (
    <div className="flex gap-2" style={{ marginLeft: `${(props.level - 1) * 1.25}rem` }}>
        <span className="text-turquoise font-black select-none">{props.value === 'number' ? '#' : '•'}</span>
        <div className="flex-1">{props.children}</div>
    </div>
);

function ImageBlock({ value, path }: { value: Record<string, any>; path: Parameters<RenderBlockFunction>[0]['path'] }) {
    const editor = useEditor();
    const set = (props: Record<string, unknown>) => editor.send({ type: 'block.set', at: path, props });
    return (
        <div contentEditable={false} className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            {value.url
                ? <img src={`${value.url}?w=800`} alt={value.caption || ''} className="max-h-72 mx-auto rounded-xl object-contain" />
                : <div className="h-32 flex items-center justify-center text-slate-400 text-xs">Image</div>}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-center">
                <input type="text" value={value.caption || ''} onChange={(e) => set({ caption: e.target.value })} placeholder="Légende (optionnel)" className="p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-turquoise" />
                <select value={value.layout || 'center'} onChange={(e) => set({ layout: e.target.value })} className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-abysse outline-none">
                    {IMAGE_LAYOUTS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
                <button type="button" onClick={() => editor.send({ type: 'delete.block', at: path })} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all justify-self-end"><Trash2 size={14} /></button>
            </div>
        </div>
    );
}

function CtaBlock({ value, path }: { value: Record<string, any>; path: Parameters<RenderBlockFunction>[0]['path'] }) {
    const editor = useEditor();
    const set = (props: Record<string, unknown>) => editor.send({ type: 'block.set', at: path, props });
    return (
        <div contentEditable={false} className="my-3 p-3 bg-turquoise/5 border border-turquoise/30 rounded-2xl">
            <span className="block text-[10px] font-black uppercase tracking-widest text-turquoise mb-2">Bouton d&apos;action</span>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
                <input type="text" value={value.text || ''} onChange={(e) => set({ text: e.target.value })} placeholder="Texte du bouton" className="p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-turquoise" />
                <input type="text" value={value.url || ''} onChange={(e) => set({ url: e.target.value })} placeholder="https://… ou /page" className="p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-turquoise" />
                <select value={value.style || 'primary'} onChange={(e) => set({ style: e.target.value })} className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-abysse outline-none">
                    {CTA_STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <button type="button" onClick={() => editor.send({ type: 'delete.block', at: path })} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all justify-self-end"><Trash2 size={14} /></button>
            </div>
        </div>
    );
}

const renderBlock: RenderBlockFunction = (props) => {
    const value = props.value as Record<string, any>;
    if (value._type === 'image') return <ImageBlock value={value} path={props.path} />;
    if (value._type === 'ctaBlock') return <CtaBlock value={value} path={props.path} />;
    return <div>{props.children}</div>;
};

// ─── Barre d'outils ───────────────────────────────────────────────────────────
function ToolbarButton({ active, onClick, title, children }: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
    return (
        <button type="button" title={title} onMouseDown={(e) => e.preventDefault()} onClick={onClick}
            className={`p-2 rounded-lg transition-all ${active ? 'bg-abysse text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
            {children}
        </button>
    );
}

function Toolbar({ onError }: { onError: (msg: string) => void }) {
    const editor = useEditor();
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const activeStyle = useEditorSelector(editor, selectors.getActiveStyle) || 'normal';
    const isStrong = useEditorSelector(editor, selectors.isActiveDecorator('strong'));
    const isEm = useEditorSelector(editor, selectors.isActiveDecorator('em'));
    const isBullet = useEditorSelector(editor, selectors.isActiveListItem('bullet'));
    const isNumber = useEditorSelector(editor, selectors.isActiveListItem('number'));
    const isLink = useEditorSelector(editor, selectors.isActiveAnnotation('link'));

    const run = (event: Parameters<typeof editor.send>[0]) => {
        editor.send(event);
        editor.send({ type: 'focus' });
    };

    const toggleLink = () => {
        if (isLink) return run({ type: 'annotation.remove', annotation: { name: 'link' } });
        const href = window.prompt('Adresse du lien (https://… ou /page)');
        if (!href) return;
        const blank = /^https?:\/\//.test(href);
        run({ type: 'annotation.add', annotation: { name: 'link', value: { href, blank } } });
    };

    const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setUploading(true);
        try {
            const { assetId, url } = await uploadImage(file);
            run({
                type: 'insert.block object',
                blockObject: { name: 'image', value: { asset: { _type: 'reference', _ref: assetId }, url, layout: 'center' } },
                placement: 'auto',
            });
        } catch (err) {
            onError(err instanceof Error ? err.message : 'Échec du téléversement');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 bg-white border-b border-slate-200 rounded-t-2xl">
            <select value={activeStyle} onChange={(e) => run({ type: 'style.toggle', style: e.target.value })}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-abysse outline-none mr-1">
                {STYLE_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ToolbarButton title="Gras" active={isStrong} onClick={() => run({ type: 'decorator.toggle', decorator: 'strong' })}><Bold size={16} /></ToolbarButton>
            <ToolbarButton title="Italique" active={isEm} onClick={() => run({ type: 'decorator.toggle', decorator: 'em' })}><Italic size={16} /></ToolbarButton>
            <ToolbarButton title="Lien" active={isLink} onClick={toggleLink}><Link2 size={16} /></ToolbarButton>
            <span className="w-px h-6 bg-slate-200 mx-1" />
            <ToolbarButton title="Liste à puces" active={isBullet} onClick={() => run({ type: 'list item.toggle', listItem: 'bullet' })}><List size={16} /></ToolbarButton>
            <ToolbarButton title="Liste numérotée" active={isNumber} onClick={() => run({ type: 'list item.toggle', listItem: 'number' })}><ListOrdered size={16} /></ToolbarButton>
            <span className="w-px h-6 bg-slate-200 mx-1" />
            <ToolbarButton title="Insérer une image" onClick={() => fileRef.current?.click()}>
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            </ToolbarButton>
            <ToolbarButton title="Insérer un bouton" onClick={() => run({ type: 'insert.block object', blockObject: { name: 'ctaBlock', value: { text: 'En savoir plus', url: '', style: 'primary' } }, placement: 'auto' })}>
                <MousePointerClick size={16} />
            </ToolbarButton>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        </div>
    );
}

// ─── Formulaire article ───────────────────────────────────────────────────────
function ArticleForm({ articleId, linkedArticles, onBack, onChanged, initialKind = 'article' }: { articleId: string | null; linkedArticles: ArticleListItem[]; onBack: () => void; onChanged: (id?: string) => void; initialKind?: EditorialKind }) {
    const [doc, setDoc] = useState<ArticleDoc | null>(articleId ? null : { contentType: initialKind, publishedAt: today(), category: 'actualites', body: [], agendaDates: initialKind === 'event' ? [newDate()] : [] });
    const [status, setStatus] = useState({ hasDraft: false, isPublished: false });
    const [slugTouched, setSlugTouched] = useState(!!articleId);
    const [busy, setBusy] = useState<string | null>(null);
    const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
    const [dirty, setDirty] = useState(false);
    const [currentId, setCurrentId] = useState(articleId);
    const coverRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<PortableTextBlock[]>([]);

    useEffect(() => {
        if (!articleId) return;
        fetch(`/api/cockpit/articles?id=${encodeURIComponent(articleId)}`)
            .then(async (r) => { if (r.redirected) throw new Error('Votre session a expiré. Reconnectez-vous.'); const data = await r.json(); if (!r.ok) throw new Error(data.error || 'Chargement impossible'); return data; })
            .then((data) => {
                if (data.error) throw new Error(data.error);
                bodyRef.current = data.article.body || [];
                setDoc(data.article);
                setStatus({ hasDraft: data.hasDraft, isPublished: data.isPublished });
            })
            .catch((err) => setMessage({ kind: 'error', text: err.message }));
    }, [articleId]);

    const update = (patch: Partial<ArticleDoc>) => {
        setDoc((d) => ({ ...d, ...patch }));
        setDirty(true);
    };

    const onTitle = (title: string) => {
        update(slugTouched ? { title } : { title, slug: { _type: 'slug', current: slugify(title) } });
    };

    const onCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setBusy('cover');
        try {
            const { assetId, url } = await uploadImage(file);
            update({ coverImage: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }, coverImageUrl: url });
        } catch (err) {
            setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Échec du téléversement' });
        } finally {
            setBusy(null);
        }
    };

    const post = async (type: string, extra: Record<string, unknown> = {}) => {
        const res = await fetch('/api/cockpit/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, _id: currentId, ...extra }),
        });
        if (res.redirected) throw new Error('Votre session a expiré. Reconnectez-vous.');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur');
        return data;
    };

    const save = async (type: 'SAVE_DRAFT' | 'PUBLISH') => {
        if (!doc) return;
        setBusy(type);
        setMessage(null);
        try {
            const data = await post(type, { article: { ...doc, body: bodyRef.current } });
            setCurrentId(data.id);
            setDirty(false);
            setStatus(type === 'PUBLISH' ? { hasDraft: false, isPublished: true } : { ...status, hasDraft: true });
            setMessage({ kind: 'ok', text: type === 'PUBLISH' ? (doc.contentType === 'event' ? 'Événement publié dans l’agenda' : 'Article publié') : 'Brouillon enregistré' });
            onChanged(data.id);
        } catch (err) {
            setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Erreur' });
        } finally {
            setBusy(null);
        }
    };

    const simpleAction = async (type: 'DISCARD_DRAFT' | 'UNPUBLISH' | 'DELETE', confirmText: string) => {
        if (!currentId || !window.confirm(confirmText)) return;
        setBusy(type);
        try {
            await post(type);
            onChanged();
            if (type === 'DELETE' || (type === 'DISCARD_DRAFT' && !status.isPublished)) return onBack();
            if (type === 'UNPUBLISH') {
                setStatus({ hasDraft: true, isPublished: false });
                setMessage({ kind: 'ok', text: 'Article retiré du site (conservé en brouillon)' });
            } else {
                // Recharge la version publiée
                const data = await fetch(`/api/cockpit/articles?id=${encodeURIComponent(currentId)}`).then((r) => r.json());
                bodyRef.current = data.article.body || [];
                setDoc(data.article);
                setStatus({ hasDraft: data.hasDraft, isPublished: data.isPublished });
                setEditorKey((k) => k + 1);
                setDirty(false);
                setMessage({ kind: 'ok', text: 'Modifications annulées' });
            }
        } catch (err) {
            setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Erreur' });
        } finally {
            setBusy(null);
        }
    };

    const [editorKey, setEditorKey] = useState(0);

    if (!doc) {
        return (
            <div className="bg-white p-10 rounded-3xl border border-slate-200 flex items-center justify-center text-slate-400">
                {message?.kind === 'error' ? <div role="alert">{message.text}<button type="button" onClick={onBack} className="ml-3 font-bold underline">Retour à la liste</button></div> : <Loader2 className="animate-spin" />}
            </div>
        );
    }

    const dates = doc.agendaDates || [];
    const isEvent = doc.contentType === 'event';
    const setDate = (key: string, patch: Partial<EditorialDate>) => update({ agendaDates: dates.map(date => date._key === key ? { ...date, ...patch } : date) });
    const statusLabel = !currentId ? 'Nouveau' : status.isPublished ? (status.hasDraft || dirty ? 'Publié · modifications en cours' : 'Publié') : 'Brouillon';

    return (
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">
            {/* En-tête */}
            <div className="flex flex-wrap items-center gap-2 p-4 md:p-5 border-b border-slate-100">
                <button onClick={onBack} disabled={!!busy} className="p-2 text-slate-400 hover:text-abysse transition-all" title="Retour à la liste"><ArrowLeft size={18} /></button>
                <span className={`text-[9px] px-2 py-1 rounded-md font-black uppercase tracking-widest ${status.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{statusLabel}</span>
                <div className="flex-1" />
                {status.isPublished && !isEvent && doc.slug?.current && (
                    <a href={`/blog/${doc.slug.current}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-abysse" title="Voir sur le site"><ExternalLink size={16} /></a>
                )}
                {currentId && (
                    <a href={`/studio/intent/edit/id=${currentId};type=${doc._type || 'article'}/`} target="_blank" rel="noreferrer" className="px-3 py-2 text-slate-400 hover:text-abysse text-[10px] font-black uppercase tracking-widest">Studio</a>
                )}
                {currentId && <button onClick={() => simpleAction('DELETE', 'Supprimer définitivement ce contenu ?')} disabled={!!busy} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Supprimer"><Trash2 size={16} /></button>}
                <button onClick={() => save('SAVE_DRAFT')} disabled={!!busy} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-50">
                    {busy === 'SAVE_DRAFT' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Brouillon
                </button>
                <button onClick={() => save('PUBLISH')} disabled={!!busy} className="px-4 py-2 bg-abysse text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-turquoise transition-all flex items-center gap-2 disabled:opacity-50">
                    {busy === 'PUBLISH' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Publier
                </button>
            </div>

            {message && (
                <div role={message.kind === 'error' ? 'alert' : 'status'} className={`px-5 py-2 text-sm font-semibold ${message.kind === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{message.text}</div>
            )}
            {currentId && (status.hasDraft && status.isPublished) && (
                <div className="px-5 py-2 text-xs bg-amber-50 text-amber-700 flex flex-wrap items-center gap-3">
                    Des modifications non publiées existent pour ce contenu.
                    <button onClick={() => simpleAction('DISCARD_DRAFT', 'Abandonner les modifications non publiées ?')} className="font-black uppercase text-[10px] tracking-widest flex items-center gap-1 hover:underline"><Undo2 size={12} /> Annuler les modifs</button>
                    <button onClick={() => simpleAction('UNPUBLISH', 'Retirer ce contenu du site ? Il restera en brouillon.')} className="font-black uppercase text-[10px] tracking-widest hover:underline">Dépublier</button>
                </div>
            )}

            <fieldset disabled={!!busy} className="p-4 md:p-6 space-y-5 min-w-0">
                <div className={styles.typeChoice} role="group" aria-label="Type de contenu">
                    <button type="button" aria-pressed={!isEvent} disabled={doc._type === 'agendaEvent'} onClick={() => update({ contentType: 'article' })}><FileText size={18} /><span><strong>Article de blog</strong><small>Un texte complet, avec des dates d’agenda si besoin.</small></span></button>
                    <button type="button" aria-pressed={isEvent} onClick={() => update({ contentType: 'event', agendaDates: dates.length ? dates : [newDate()] })}><CalendarDays size={18} /><span><strong>Événement simple</strong><small>Une description et des dates, sans article à rédiger.</small></span></button>
                </div>
                {doc.archived && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Ce contenu est archivé. Vous pourrez le restaurer depuis le tableau.</p>}

                {/* Titre + couverture */}
                <div>
                    <label className={labelClass}>Titre</label>
                    <input type="text" aria-label="Titre du contenu" value={doc.title || ''} onChange={(e) => onTitle(e.target.value)} className={`${inputClass} text-lg`} placeholder={isEvent ? "Ex. Tests de matériel" : "Titre de l’article"} />
                </div>
                {!isEvent && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Adresse (slug)</label>
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:border-turquoise">
                            <span className="pl-3 text-xs text-slate-400">/blog/</span>
                            <input type="text" aria-label="Adresse de l’article" value={doc.slug?.current || ''} onChange={(e) => { setSlugTouched(true); update({ slug: { _type: 'slug', current: slugify(e.target.value) } }); }} className="min-w-0 flex-1 p-3 bg-transparent outline-none font-bold text-sm text-abysse" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Catégorie</label>
                            <select aria-label="Catégorie" value={doc.category || ''} onChange={(e) => update({ category: e.target.value })} className={inputClass}>
                                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Date de publication</label>
                            <input type="date" aria-label="Date de publication" value={doc.publishedAt || ''} onChange={(e) => update({ publishedAt: e.target.value })} className={inputClass} />
                        </div>
                    </div>
                </div>}

                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
                    <div>
                        <label className={labelClass}>Image de couverture</label>
                        <button type="button" onClick={() => coverRef.current?.click()} className="relative w-full aspect-[4/3] bg-slate-50 border border-dashed border-slate-300 rounded-xl overflow-hidden flex items-center justify-center text-slate-400 hover:border-turquoise transition-all">
                            {doc.coverImageUrl
                                ? <img src={`${doc.coverImageUrl}?w=400`} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                : busy === 'cover' ? <Loader2 className="animate-spin" /> : <span className="flex flex-col items-center gap-1 text-[10px] font-black uppercase"><Upload size={18} /> Choisir</span>}
                        </button>
                        <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={onCover} />
                    </div>
                    <div>
                        <label className={labelClass}>{isEvent ? 'Description de l’événement' : 'Résumé court'} <span className="normal-case font-bold">({(doc.excerpt || '').length}/{isEvent ? 2000 : 200})</span></label>
                        <textarea aria-label={isEvent ? "Description de l’événement" : "Résumé court"} rows={4} maxLength={isEvent ? 2000 : 200} value={doc.excerpt || ''} onChange={(e) => update({ excerpt: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-turquoise text-sm text-slate-600" placeholder={isEvent ? "Informations utiles : matériel, lieu, modalités…" : "1-2 phrases affichées sur la carte du blog et dans l’agenda"} />
                    </div>
                </div>

                <section className={styles.datesEditor} aria-label="Dates dans l’agenda">
                    <div className={styles.datesHeading}>
                        {isEvent ? <h4><CalendarDays size={18} /> Dates de l’événement</h4> : <label><input type="checkbox" aria-label="Afficher aussi dans l’agenda" checked={dates.length > 0} onChange={event => update({ agendaDates: event.target.checked ? [newDate()] : [] })} /><CalendarDays size={18} /> Afficher aussi dans l’agenda</label>}
                        {(isEvent || dates.length > 0) && <button type="button" onClick={() => update({ agendaDates: [...dates, newDate()] })}><Plus size={15} /> Ajouter une date</button>}
                    </div>
                    {(isEvent || dates.length > 0) && <>
                        <p className="text-sm text-slate-600">Chaque date apparaît dans l’agenda. Les dates passées disparaissent de l’affichage public.</p>
                        {dates.map((date, index) => <div key={date._key} className={`${styles.dateRow} ${date.archived ? styles.archivedDate : ''}`}>
                            <label>Date {index + 1}<input type="date" aria-label={`Date d’agenda ${index + 1}`} value={date.date} onChange={event => setDate(date._key, { date: event.target.value })} /></label>
                            <label>Horaire / durée<input type="text" aria-label={`Horaire d’agenda ${index + 1}`} value={date.time || ''} onChange={event => setDate(date._key, { time: event.target.value })} placeholder="14h – 17h" /></label>
                            <label>Badge<input type="text" aria-label={`Badge d’agenda ${index + 1}`} value={date.badge || ''} onChange={event => setDate(date._key, { badge: event.target.value })} placeholder="Tests matériel…" /></label>
                            <div className={styles.dateActions}>
                                <button type="button" aria-label={`${date.archived ? 'Restaurer' : 'Archiver'} la date ${index + 1}`} onClick={() => setDate(date._key, { archived: !date.archived })}>{date.archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}</button>
                                <button type="button" aria-label={`Retirer la date ${index + 1}`} onClick={() => update({ agendaDates: dates.filter(item => item._key !== date._key) })}><Trash2 size={16} /></button>
                            </div>
                            {date.archived && <p className={styles.dateNote}>Date archivée · masquée de l’agenda</p>}
                        </div>)}
                        {dates.length === 0 && <p className="text-sm text-amber-700">Ajoutez au moins une date pour publier cet événement.</p>}
                    </>}
                </section>
                {isEvent && <label className="block text-sm font-semibold text-abysse">Article associé (facultatif)
                    <select aria-label="Article associé" className={`${inputClass} mt-2`} value={doc.linkedArticleId || ''} onChange={event => update({ linkedArticleId: event.target.value })}>
                        <option value="">Aucun article · événement autonome</option>
                        {linkedArticles.filter(article => article._id !== currentId).map(article => <option key={article._id} value={article._id}>{article.title}</option>)}
                    </select>
                    <span className="mt-2 block text-xs font-normal text-slate-500">Le lien « Lire l’article » sera proposé sur les dates de cet événement.</span>
                </label>}

                {/* Contenu */}
                {!isEvent && <div>
                    <label className={labelClass}>Contenu</label>
                    <div className="border border-slate-200 rounded-2xl">
                        <EditorProvider key={`${currentId ?? 'new'}-${editorKey}`} initialConfig={{ schemaDefinition, initialValue: bodyRef.current }}>
                            <EventListenerPlugin on={(event) => {
                                if (event.type === 'mutation') {
                                    bodyRef.current = event.value || [];
                                    setDirty(true);
                                }
                            }} />
                            <Toolbar onError={(text) => setMessage({ kind: 'error', text })} />
                            <PortableTextEditable
                                className="min-h-[320px] p-4 md:p-6 outline-none text-slate-700 text-[15px]"
                                renderStyle={renderStyle}
                                renderDecorator={renderDecorator}
                                renderAnnotation={renderAnnotation}
                                renderListItem={renderListItem}
                                renderBlock={renderBlock}
                                renderPlaceholder={() => <span className="text-slate-300">Écrivez votre article…</span>}
                            />
                        </EditorProvider>
                    </div>
                </div>}
            </fieldset>
        </div>
    );
}

// ─── Gestionnaire : liste + éditeur ───────────────────────────────────────────
export default function ArticleManager({ initialArticles, onEditingChange, initialCreate }: { initialArticles: ArticleListItem[]; onEditingChange?: (editing: boolean) => void; initialCreate?: EditorialKind }) {
    const [articles, setArticles] = useState<ArticleListItem[]>(initialArticles);
    const [selected, setSelected] = useState<string | null | undefined>(initialCreate ? null : undefined);
    const [creationKind, setCreationKind] = useState<EditorialKind>(initialCreate || 'article');
    const [view, setView] = useState<'current' | 'past' | 'archive'>('current');
    const [kindFilter, setKindFilter] = useState<'all' | EditorialKind>('all');
    const [search, setSearch] = useState('');
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState('');
    useEffect(() => { onEditingChange?.(selected !== undefined); }, [selected, onEditingChange]);
    const refresh = useCallback(async () => {
        const response = await fetch('/api/cockpit/articles');
        if (!response.ok || response.redirected) throw new Error('Impossible de charger les contenus. Réessayez.');
        const data = await response.json();
        if (!Array.isArray(data.articles)) throw new Error('Impossible de charger les contenus.');
        setArticles(data.articles); setError('');
    }, []);
    useEffect(() => { void refresh().catch(error => setError(error.message)); }, [refresh]);
    const archive = async (article: ArticleListItem) => {
        setBusy(article._id); setError('');
        try {
            const response = await fetch('/api/cockpit/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: article.archived ? 'RESTORE' : 'ARCHIVE', _id: article._id }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Archivage impossible');
            await refresh();
        } catch (error) { setError(error instanceof Error ? error.message : 'Archivage impossible'); }
        finally { setBusy(null); }
    };
    const today = parisToday();
    const isPast = (article: ArticleListItem) => {
        const dates = editorialDates(article);
        return editorialKind(article) === 'event' && dates.length > 0 && dates.every(date => date.archived || date.date < today);
    };
    const matchesView = (article: ArticleListItem, value: typeof view) => value === 'archive' ? article.archived === true : !article.archived && (value === 'past' ? isPast(article) : !isPast(article));
    const counts = { current: articles.filter(article => matchesView(article, 'current')).length, past: articles.filter(article => matchesView(article, 'past')).length, archive: articles.filter(article => matchesView(article, 'archive')).length };
    const filtered = articles.filter(article => matchesView(article, view) && (kindFilter === 'all' || editorialKind(article) === kindFilter) && (article.title || '').toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr')))
        .sort((a, b) => {
            const activeDate = (article: ArticleListItem) => editorialDates(article).filter(date => !date.archived && date.date >= today).map(date => date.date).sort()[0];
            if (view === 'current') {
                const first = activeDate(a); const second = activeDate(b);
                if (first && second) return first.localeCompare(second);
                if (first || second) return first ? -1 : 1;
            }
            const latestDate = (article: ArticleListItem) => editorialDates(article).map(date => date.date).sort().at(-1) || article.publishedAt || '';
            return latestDate(b).localeCompare(latestDate(a));
        });
    const dateSummary = (article: ArticleListItem) => {
        const dates = editorialDates(article).filter(date => !date.archived).sort((a, b) => a.date.localeCompare(b.date));
        const upcoming = dates.filter(date => date.date >= today);
        const date = upcoming[0] || dates.at(-1);
        return date ? { label: displayDate(date.date), detail: `${upcoming.length > 1 ? `${upcoming.length} dates à venir` : date.time || (date.date < today ? 'Événement passé' : 'Dans l’agenda')}${dates.length > upcoming.length && upcoming.length ? ' · historique conservé' : ''}` } : { label: article.publishedAt ? displayDate(article.publishedAt) : 'Sans date', detail: editorialKind(article) === 'article' ? 'Publication du blog' : editorialDates(article).length ? 'Dates archivées' : 'Aucune date active' };
    };
    return <section className={styles.root}>
        <header data-admin-page-header className={styles.header}>
            <div><h3 data-admin-page-title>Blog & agenda</h3><p data-admin-page-description>Articles et événements, dans un seul outil.</p></div>
            {selected === undefined && <button type="button" onClick={() => setSelected(null)}><Plus size={17} /> Créer un contenu</button>}
        </header>
        {selected !== undefined ? <ArticleForm key={selected ?? 'new'} articleId={selected} initialKind={creationKind} linkedArticles={articles.filter(article => editorialKind(article) === 'article' && article.isPublished !== false)} onBack={() => { setSelected(undefined); setCreationKind('article'); void refresh().catch(error => setError(error.message)); }} onChanged={() => { void refresh().catch(error => setError(error.message)); }} /> : <>
            <div className={styles.filters}>
                <div className={styles.views} role="group" aria-label="État des contenus">
                    {([{ value: 'current', label: 'Courants' }, { value: 'past', label: 'Événements passés' }, { value: 'archive', label: 'Archives' }] as const).map(tab => <button type="button" key={tab.value} aria-pressed={view === tab.value} onClick={() => setView(tab.value)}>{tab.label} <span>{counts[tab.value]}</span></button>)}
                </div>
                <label className={styles.search}><Search size={17} /><input aria-label="Rechercher un contenu" placeholder="Rechercher un titre…" value={search} onChange={event => setSearch(event.target.value)} /></label>
                <select aria-label="Filtrer par type de contenu" value={kindFilter} onChange={event => setKindFilter(event.target.value as typeof kindFilter)}><option value="all">Articles et événements</option><option value="article">Articles de blog</option><option value="event">Événements simples</option></select>
            </div>
            {error && <p role="alert" className={styles.error}>{error} <button type="button" onClick={() => void refresh().catch(error => setError(error.message))}>Réessayer</button></p>}
            {view === 'past' && <p className={styles.hint}>Ces événements ne sont plus affichés dans l’agenda public. Archivez-les pour garder leur historique à part.</p>}
            {view === 'archive' && <p className={styles.hint}>Les archives sont conservées. Restaurer un contenu le remet dans les contenus courants ou passés selon ses dates.</p>}
            <div role="table" aria-label="Articles et événements" className={styles.table}>
                <div role="row" className={styles.tableHeader}><span role="columnheader">Contenu</span><span role="columnheader">Type</span><span role="columnheader">Dates</span><span role="columnheader">Actions</span></div>
                {filtered.map(article => {
                    const date = dateSummary(article); const kind = editorialKind(article);
                    return <div role="row" className={styles.row} key={article._id}>
                        <div role="cell" className={styles.titleCell}><button type="button" onClick={() => setSelected(article._id)} aria-label={`Modifier ${article.title || 'Sans titre'}`}>
                            <span className={`${styles.thumbnail} ${kind === 'event' ? styles.eventThumbnail : ''}`}>{article.coverImage ? <img src={`${article.coverImage}?w=128&h=128&fit=crop`} alt="" /> : kind === 'event' ? <CalendarDays size={22} /> : <FileText size={22} />}</span>
                            <span className={styles.titleText}><strong>{article.title || 'Sans titre'}</strong><span>{article.isPublished === false ? 'Brouillon' : article.hasDraft ? 'Publié · brouillon en cours' : 'Publié'}{kind === 'article' && article.category ? ` · ${CATEGORIES.find(category => category.value === article.category)?.label || article.category}` : ''}</span></span>
                        </button></div>
                        <div role="cell"><span className={`${styles.kind} ${kind === 'event' ? styles.eventKind : ''}`}>{kind === 'event' ? 'Événement' : 'Article'}</span></div>
                        <div role="cell" className={styles.dateCell}><strong>{date.label}</strong><span>{date.detail}</span></div>
                        <div role="cell" className={styles.actions}><button type="button" disabled={!!busy} aria-label={`${article.archived ? 'Restaurer' : 'Archiver'} ${article.title}`} title={article.archived ? 'Restaurer' : 'Archiver'} onClick={() => void archive(article)}>{busy === article._id ? <Loader2 size={17} className="animate-spin" /> : article.archived ? <ArchiveRestore size={17} /> : <Archive size={17} />}{article.archived ? 'Restaurer' : 'Archiver'}</button></div>
                    </div>;
                })}
                {filtered.length === 0 && <p className={styles.empty}>Aucun contenu dans cette vue.</p>}
            </div>
        </>}
    </section>;
}

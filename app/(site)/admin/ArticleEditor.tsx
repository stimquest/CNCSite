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
    ArrowLeft, Bold, CalendarDays, ExternalLink, ImagePlus, Italic, Link2, List, ListOrdered,
    Loader2, MousePointerClick, Plus, Save, Send, Trash2, Undo2, Upload,
} from 'lucide-react';
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

const today = () => new Date().toISOString().slice(0, 10);


const inputClass = 'w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-turquoise font-bold text-sm text-abysse';
const labelClass = 'text-[10px] font-black uppercase text-slate-400 ml-1';

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
function ArticleForm({ articleId, onBack, onChanged }: { articleId: string | null; onBack: () => void; onChanged: (id?: string) => void }) {
    const [doc, setDoc] = useState<ArticleDoc | null>(articleId ? null : { publishedAt: today(), category: 'actualites', body: [] });
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
            .then((r) => r.json())
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
            setMessage({ kind: 'ok', text: type === 'PUBLISH' ? 'Article publié' : 'Brouillon enregistré' });
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
                {message?.kind === 'error' ? message.text : <Loader2 className="animate-spin" />}
            </div>
        );
    }

    const statusLabel = !currentId ? 'Nouveau' : status.isPublished ? (status.hasDraft || dirty ? 'Publié · modifications en cours' : 'Publié') : 'Brouillon';

    return (
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">
            {/* En-tête */}
            <div className="flex flex-wrap items-center gap-2 p-4 md:p-5 border-b border-slate-100">
                <button onClick={onBack} className="p-2 text-slate-400 hover:text-abysse transition-all" title="Retour à la liste"><ArrowLeft size={18} /></button>
                <span className={`text-[9px] px-2 py-1 rounded-md font-black uppercase tracking-widest ${status.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{statusLabel}</span>
                <div className="flex-1" />
                {status.isPublished && doc.slug?.current && (
                    <a href={`/blog/${doc.slug.current}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-abysse" title="Voir sur le site"><ExternalLink size={16} /></a>
                )}
                {currentId && (
                    <a href={`/studio/intent/edit/id=${currentId};type=article/`} target="_blank" rel="noreferrer" className="px-3 py-2 text-slate-400 hover:text-abysse text-[10px] font-black uppercase tracking-widest">Studio</a>
                )}
                {currentId && <button onClick={() => simpleAction('DELETE', 'Supprimer définitivement cet article ?')} disabled={!!busy} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Supprimer"><Trash2 size={16} /></button>}
                <button onClick={() => save('SAVE_DRAFT')} disabled={!!busy} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-50">
                    {busy === 'SAVE_DRAFT' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Brouillon
                </button>
                <button onClick={() => save('PUBLISH')} disabled={!!busy} className="px-4 py-2 bg-abysse text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-turquoise transition-all flex items-center gap-2 disabled:opacity-50">
                    {busy === 'PUBLISH' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Publier
                </button>
            </div>

            {message && (
                <div className={`px-5 py-2 text-xs font-bold ${message.kind === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{message.text}</div>
            )}
            {currentId && (status.hasDraft && status.isPublished) && (
                <div className="px-5 py-2 text-xs bg-amber-50 text-amber-700 flex flex-wrap items-center gap-3">
                    Des modifications non publiées existent pour cet article.
                    <button onClick={() => simpleAction('DISCARD_DRAFT', 'Abandonner les modifications non publiées ?')} className="font-black uppercase text-[10px] tracking-widest flex items-center gap-1 hover:underline"><Undo2 size={12} /> Annuler les modifs</button>
                    <button onClick={() => simpleAction('UNPUBLISH', 'Retirer cet article du site ? Il restera en brouillon.')} className="font-black uppercase text-[10px] tracking-widest hover:underline">Dépublier</button>
                </div>
            )}

            <div className="p-4 md:p-6 space-y-5">
                {/* Titre + couverture */}
                <div>
                    <label className={labelClass}>Titre</label>
                    <input type="text" value={doc.title || ''} onChange={(e) => onTitle(e.target.value)} className={`${inputClass} text-lg`} placeholder="Titre de l'article" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Adresse (slug)</label>
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:border-turquoise">
                            <span className="pl-3 text-xs text-slate-400">/blog/</span>
                            <input type="text" value={doc.slug?.current || ''} onChange={(e) => { setSlugTouched(true); update({ slug: { _type: 'slug', current: slugify(e.target.value) } }); }} className="flex-1 p-3 bg-transparent outline-none font-bold text-sm text-abysse" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Catégorie</label>
                            <select value={doc.category || ''} onChange={(e) => update({ category: e.target.value })} className={inputClass}>
                                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Date de publication</label>
                            <input type="date" value={doc.publishedAt || ''} onChange={(e) => update({ publishedAt: e.target.value })} className={inputClass} />
                        </div>
                    </div>
                </div>

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
                        <label className={labelClass}>Résumé court <span className="normal-case font-bold">({(doc.excerpt || '').length}/200)</span></label>
                        <textarea rows={4} maxLength={200} value={doc.excerpt || ''} onChange={(e) => update({ excerpt: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-turquoise text-sm text-slate-600" placeholder="1-2 phrases affichées sur la carte du blog et dans l'agenda" />
                    </div>
                </div>

                {/* Agenda */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!doc.agendaDate} onChange={(e) => update(e.target.checked ? { agendaDate: doc.publishedAt || today() } : { agendaDate: '', agendaTime: '', agendaBadge: '' })} className="accent-turquoise" />
                        <CalendarDays size={14} className="text-turquoise" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-abysse">Afficher aussi dans l&apos;agenda</span>
                    </label>
                    {doc.agendaDate && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                            <div>
                                <label className={labelClass}>Date de l&apos;événement</label>
                                <input type="date" value={doc.agendaDate} onChange={(e) => update({ agendaDate: e.target.value })} className={`${inputClass} bg-white`} />
                            </div>
                            <div>
                                <label className={labelClass}>Heure / Durée</label>
                                <input type="text" value={doc.agendaTime || ''} onChange={(e) => update({ agendaTime: e.target.value })} className={`${inputClass} bg-white`} placeholder="9h - 12h" />
                            </div>
                            <div>
                                <label className={labelClass}>Badge</label>
                                <input type="text" value={doc.agendaBadge || ''} onChange={(e) => update({ agendaBadge: e.target.value })} className={`${inputClass} bg-white`} placeholder="Régate, AG…" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Contenu */}
                <div>
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
                </div>
            </div>
        </div>
    );
}

// ─── Gestionnaire : liste + éditeur ───────────────────────────────────────────
export default function ArticleManager({ initialArticles, onEditingChange }: { initialArticles: ArticleListItem[]; onEditingChange?: (editing: boolean) => void }) {
    const [articles, setArticles] = useState<ArticleListItem[]>(initialArticles);
    const [selected, setSelected] = useState<string | null | undefined>(undefined); // undefined = aucun, null = nouveau

    useEffect(() => { onEditingChange?.(selected !== undefined); }, [selected, onEditingChange]);

    const refresh = useCallback(async () => {
        try {
            const data = await fetch('/api/cockpit/articles').then((r) => r.json());
            if (Array.isArray(data.articles)) setArticles(data.articles);
        } catch { /* on garde la liste actuelle */ }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    const list = (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {articles.length === 0 && <div className="p-6 text-center text-xs text-slate-400">Aucun article</div>}
            {articles.map((art) => (
                <button key={art._id} onClick={() => setSelected(art._id)}
                    className={`w-full p-4 flex items-center gap-3 text-left border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-all ${selected === art._id ? 'bg-turquoise/5' : ''}`}>
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                        {art.coverImage && <img src={`${art.coverImage}?w=100&h=100&fit=crop`} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="block font-black text-abysse uppercase tracking-tighter line-clamp-1">{art.title || 'Sans titre'}</span>
                        <span className="block text-[10px] text-slate-400 mt-1 italic capitalize">{art.category} · {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : '—'}</span>
                    </div>
                    {art.isPublished === false
                        ? <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-1 rounded-md font-bold uppercase shrink-0">Brouillon</span>
                        : art.hasDraft && <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-bold uppercase shrink-0">Modifié</span>}
                </button>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-xl font-black uppercase italic text-abysse">Blog & Articles</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rédaction directe · Studio pour les réglages avancés</p>
                </div>
                <button onClick={() => setSelected(null)} className="px-4 py-2 bg-abysse text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-turquoise transition-all shadow-md flex items-center gap-2"><Plus size={14} /> Nouvel Article</button>
            </div>

            {selected === undefined ? list : (
                <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6 items-start">
                    <div className="hidden xl:block">{list}</div>
                    <ArticleForm
                        key={selected ?? 'new'}
                        articleId={selected}
                        onBack={() => setSelected(undefined)}
                        onChanged={(id) => { refresh(); if (id && selected === null) setSelected(id); }}
                    />
                </div>
            )}
        </div>
    );
}

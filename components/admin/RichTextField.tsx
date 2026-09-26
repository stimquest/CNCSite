'use client';

import React from 'react';
import { defineSchema, EditorProvider, PortableTextEditable, useEditor, useEditorSelector } from '@portabletext/editor';
import type { PortableTextBlock, RenderAnnotationFunction, RenderDecoratorFunction, RenderListItemFunction } from '@portabletext/editor';
import { EventListenerPlugin } from '@portabletext/editor/plugins';
import * as selectors from '@portabletext/editor/selectors';
import { Bold, Italic, Link2, List } from 'lucide-react';

// Miroir de sanity/schemas/basicRichText.ts
const schemaDefinition = defineSchema({
    decorators: [{ name: 'strong' }, { name: 'em' }],
    styles: [{ name: 'normal' }],
    annotations: [{ name: 'link', fields: [{ name: 'href', type: 'string' }] }],
    lists: [{ name: 'bullet' }],
    inlineObjects: [],
    blockObjects: [],
});

const renderDecorator: RenderDecoratorFunction = (props) =>
    props.value === 'strong' ? <strong>{props.children}</strong> : props.value === 'em' ? <em>{props.children}</em> : <>{props.children}</>;

const renderAnnotation: RenderAnnotationFunction = (props) =>
    <span className="text-turquoise underline" title={String(props.value.href || '')}>{props.children}</span>;

const renderListItem: RenderListItemFunction = (props) => (
    <div className="flex gap-2"><span className="text-turquoise font-black select-none">•</span><div className="flex-1">{props.children}</div></div>
);

function MiniToolbar() {
    const editor = useEditor();
    const isStrong = useEditorSelector(editor, selectors.isActiveDecorator('strong'));
    const isEm = useEditorSelector(editor, selectors.isActiveDecorator('em'));
    const isBullet = useEditorSelector(editor, selectors.isActiveListItem('bullet'));
    const isLink = useEditorSelector(editor, selectors.isActiveAnnotation('link'));
    const run = (event: Parameters<typeof editor.send>[0]) => { editor.send(event); editor.send({ type: 'focus' }); };
    const btn = (active: boolean, title: string, onClick: () => void, icon: React.ReactNode) => (
        <button type="button" title={title} onMouseDown={(e) => e.preventDefault()} onClick={onClick}
            className={`p-1.5 rounded-md transition-all ${active ? 'bg-abysse text-white' : 'text-slate-400 hover:bg-slate-100'}`}>{icon}</button>
    );
    return (
        <div className="flex gap-1 p-1 border-b border-slate-200">
            {btn(isStrong, 'Gras', () => run({ type: 'decorator.toggle', decorator: 'strong' }), <Bold size={13} />)}
            {btn(isEm, 'Italique', () => run({ type: 'decorator.toggle', decorator: 'em' }), <Italic size={13} />)}
            {btn(isBullet, 'Liste', () => run({ type: 'list item.toggle', listItem: 'bullet' }), <List size={13} />)}
            {btn(isLink, 'Lien', () => {
                if (isLink) return run({ type: 'annotation.remove', annotation: { name: 'link' } });
                const href = window.prompt('Adresse du lien');
                if (href) run({ type: 'annotation.add', annotation: { name: 'link', value: { href } } });
            }, <Link2 size={13} />)}
        </div>
    );
}

/**
 * Champ texte enrichi simple (gras, italique, puces, liens) au format Portable Text.
 * Non contrôlé : changer `resetKey` pour recharger `value`.
 */
export default function RichTextField({ value, onChange, resetKey, placeholder, minHeight = 90 }: {
    value?: PortableTextBlock[];
    onChange: (value: PortableTextBlock[]) => void;
    resetKey: string;
    placeholder?: string;
    minHeight?: number;
}) {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl focus-within:border-turquoise">
            <EditorProvider key={resetKey} initialConfig={{ schemaDefinition, initialValue: value }}>
                <EventListenerPlugin on={(event) => { if (event.type === 'mutation') onChange(event.value || []); }} />
                <MiniToolbar />
                <PortableTextEditable
                    className="p-3 outline-none text-sm text-slate-600 leading-relaxed"
                    style={{ minHeight }}
                    renderDecorator={renderDecorator}
                    renderAnnotation={renderAnnotation}
                    renderListItem={renderListItem}
                    renderBlock={(props) => <div className="my-1">{props.children}</div>}
                    renderStyle={(props) => <>{props.children}</>}
                    renderPlaceholder={() => <span className="text-slate-300">{placeholder}</span>}
                />
            </EditorProvider>
        </div>
    );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

type Article = {
    _id: string;
    title: string;
    slug: string;
    category: string;
    publishedAt: string;
    excerpt: string | null;
    coverImage: string | null;
    body: any[] | null;
};

const CATEGORY_LABELS: Record<string, string> = {
    actualites: 'Actualités du Club',
    environnement: 'Environnement & Nature',
    navigation: 'Navigation & Technique',
    evenements: 'Événements & Sorties',
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

const portableTextComponents: PortableTextComponents = {
    block: {
        normal: ({ children }) => <p className="mb-4 text-abysse/80 leading-relaxed text-left">{children}</p>,
        normal_center: ({ children }) => <p className="mb-4 text-abysse/80 leading-relaxed text-center">{children}</p>,
        normal_right: ({ children }) => <p className="mb-4 text-abysse/80 leading-relaxed text-right">{children}</p>,
        normal_justify: ({ children }) => <p className="mb-4 text-abysse/80 leading-relaxed text-justify">{children}</p>,
        
        h2: ({ children }) => (
            <h2 className="font-['Syncopate'] text-xl font-bold uppercase text-abysse mt-10 mb-4 tracking-tight text-left">
                {children}
            </h2>
        ),
        h2_center: ({ children }) => (
            <h2 className="font-['Syncopate'] text-xl font-bold uppercase text-abysse mt-10 mb-4 tracking-tight text-center">
                {children}
            </h2>
        ),
        
        h3: ({ children }) => (
            <h3 className="font-['Syncopate'] text-base font-bold uppercase text-abysse mt-8 mb-3 tracking-tight text-left">
                {children}
            </h3>
        ),
        h3_center: ({ children }) => (
            <h3 className="font-['Syncopate'] text-base font-bold uppercase text-abysse mt-8 mb-3 tracking-tight text-center">
                {children}
            </h3>
        ),
        
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-turquoise pl-5 my-6 text-abysse/70 italic text-lg">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-abysse/80">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-abysse/80">{children}</ol>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold text-abysse">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        link: ({ value, children }) => (
            <a
                href={value?.href}
                target={value?.blank ? '_blank' : undefined}
                rel={value?.blank ? 'noopener noreferrer' : undefined}
                className="text-turquoise underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
                {children}
            </a>
        ),
    },
    types: {
        image: ({ value }) => {
            const layout = value.layout || 'center';
            let wrapperClass = "my-8 clear-both";
            let aspectStyle = { aspectRatio: '16/9' };
            
            if (layout === 'full') {
                wrapperClass = "my-12 -mx-4 md:-mx-16 lg:-mx-24 clear-both relative z-10";
            } else if (layout === 'left') {
                wrapperClass = "my-6 md:float-left md:w-1/2 md:mr-8 md:mb-6";
                aspectStyle = { aspectRatio: '4/3' };
            } else if (layout === 'right') {
                wrapperClass = "my-6 md:float-right md:w-1/2 md:ml-8 md:mb-6";
                aspectStyle = { aspectRatio: '4/3' };
            }

            return (
                <figure className={wrapperClass}>
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm" style={aspectStyle}>
                        <Image
                            src={value.url}
                            alt={value.caption ?? ''}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 1000px"
                        />
                    </div>
                    {value.caption && (
                        <figcaption className="text-center text-xs text-(--color-taupe-500,#8c7e6e) mt-3 italic">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            );
        },
        ctaBlock: ({ value }) => {
            const alignmentClass = value.alignment === 'center' ? 'justify-center' : value.alignment === 'right' ? 'justify-end' : 'justify-start';
            const baseBtnClass = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-sm";
            
            let btnClass = baseBtnClass;
            if (value.style === 'secondary') {
                btnClass += " bg-turquoise text-white hover:bg-abysse hover:shadow-md";
            } else if (value.style === 'outline') {
                btnClass += " border-2 border-abysse text-abysse hover:bg-abysse hover:text-white";
            } else {
                btnClass += " bg-abysse text-white hover:bg-turquoise hover:shadow-md";
            }

            return (
                <div className={`flex w-full my-10 clear-both ${alignmentClass}`}>
                    <Link href={value.url || '#'} className={btnClass}>
                        {value.text}
                    </Link>
                </div>
            );
        }
    },
};

export default function BlogArticleClient({ article }: { article: Article }) {
    return (
        <main className="min-h-screen bg-background-light">
            {/* Cover image header */}
            <div className="relative h-72 md:h-96 bg-abysse">
                {article.coverImage && (
                    <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                        sizes="100vw"
                    />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-abysse via-abysse/40 to-transparent" />

                {/* Back button */}
                <div className="absolute top-6 left-0 right-0 max-w-3xl mx-auto px-4">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors mt-20"
                    >
                        <ArrowLeft size={15} />
                        Retour au blog
                    </Link>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 pb-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-turquoise text-white">
                            <Tag size={10} />
                            {CATEGORY_LABELS[article.category] ?? article.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-white/60 text-xs">
                            <Calendar size={12} />
                            {formatDate(article.publishedAt)}
                        </span>
                    </div>
                    <h1 className="font-['Syncopate'] text-2xl md:text-3xl font-bold italic uppercase text-white tracking-tight leading-tight">
                        {article.title}
                    </h1>
                </div>
            </div>

            {/* Article body */}
            <article className="max-w-3xl mx-auto px-4 py-12">
                <div className="h-4"></div>

                {article.body && (
                    <div className="prose-custom">
                        <PortableText value={article.body} components={portableTextComponents} />
                    </div>
                )}

                {/* Back link footer */}
                <div className="mt-16 pt-8 border-t border-(--color-taupe-200,#e5e0d8)">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-turquoise font-semibold text-sm hover:gap-3 transition-all"
                    >
                        <ArrowLeft size={14} />
                        Tous les articles
                    </Link>
                </div>
            </article>
        </main>
    );
}

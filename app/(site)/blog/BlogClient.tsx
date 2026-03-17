'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

type Article = {
    _id: string;
    title: string;
    slug: string;
    category: string;
    publishedAt: string;
    excerpt: string | null;
    coverImage: string | null;
};

const CATEGORIES: { value: string; label: string }[] = [
    { value: 'all', label: 'Tous les articles' },
    { value: 'actualites', label: 'Actualités du Club' },
    { value: 'environnement', label: 'Environnement & Nature' },
    { value: 'navigation', label: 'Navigation & Technique' },
    { value: 'evenements', label: 'Événements & Sorties' },
];

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function getCategoryLabel(value: string) {
    const cat = CATEGORIES.find((c) => c.value === value);
    return cat ? cat.label : value;
}

export default function BlogClient({ articles }: { articles: Article[] }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const filtered =
        activeCategory === 'all'
            ? articles
            : articles.filter((a) => a.category === activeCategory);

    return (
        <main className="min-h-screen bg-background-light">
            {/* Hero */}
            <section className="bg-abysse pt-32 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <p className="text-turquoise text-sm font-semibold uppercase tracking-widest mb-3">
                        Club Nautique de Coutainville
                    </p>
                    <h1 className="font-['Syncopate'] text-4xl md:text-5xl font-bold italic uppercase text-white tracking-tight leading-tight">
                        Blog &<br />
                        <span className="text-turquoise">Articles</span>
                    </h1>
                    <p className="mt-4 text-white/60 text-lg max-w-2xl">
                        Actualités du club, vie du site, environnement et conseils de navigation.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="sticky top-0 z-10 bg-white border-b border-(--color-taupe-200,#e5e0d8) shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setActiveCategory(cat.value)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                activeCategory === cat.value
                                    ? 'bg-abysse text-white'
                                    : 'bg-(--color-taupe-100,#f5f2ee) text-abysse hover:bg-(--color-taupe-200,#e5e0d8)'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Articles grid */}
            <section className="max-w-5xl mx-auto px-4 py-12">
                {filtered.length === 0 ? (
                    <p className="text-center text-(--color-taupe-500,#8c7e6e) py-20">
                        Aucun article dans cette catégorie pour l&apos;instant.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((article) => (
                            <ArticleCard key={article._id} article={article} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

function ArticleCard({ article }: { article: Article }) {
    return (
        <Link
            href={`/blog/${article.slug}`}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) transition-all duration-300 hover:-translate-y-1"
        >
            {/* Cover image */}
            <div className="relative h-48 bg-abysse/10 overflow-hidden">
                {article.coverImage ? (
                    <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-abysse/20">
                        <span className="text-5xl">⛵</span>
                    </div>
                )}
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-abysse backdrop-blur-sm">
                        <Tag size={10} />
                        {getCategoryLabel(article.category)}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-1.5 text-xs text-(--color-taupe-500,#8c7e6e) mb-2">
                    <Calendar size={12} />
                    <span>{formatDate(article.publishedAt)}</span>
                </div>
                <h2 className="font-['Syncopate'] text-sm font-bold uppercase text-abysse leading-snug mb-2 group-hover:text-turquoise transition-colors">
                    {article.title}
                </h2>
                {article.excerpt && (
                    <p className="text-sm text-(--color-taupe-600,#6b5f52) line-clamp-3 flex-1">
                        {article.excerpt}
                    </p>
                )}
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-turquoise group-hover:gap-2 transition-all">
                    Lire l&apos;article
                    <ArrowRight size={13} />
                </div>
            </div>
        </Link>
    );
}

import React from 'react';
import { client, queries } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import BlogArticleClient from './BlogArticleClient';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await client.fetch(queries.articleBySlug, { slug }).catch(() => null);
    if (!article) return { title: 'Article introuvable' };
    return {
        title: `${article.title} - CNC Coutainville`,
        description: article.excerpt ?? undefined,
    };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await client.fetch(queries.articleBySlug, { slug }).catch(() => null);

    if (!article) notFound();

    return <BlogArticleClient article={article} />;
}

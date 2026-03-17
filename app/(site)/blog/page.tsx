import React from 'react';
import { client, queries } from '@/lib/sanity';
import BlogClient from './BlogClient';

export const metadata = {
    title: 'Blog & Articles - CNC Coutainville',
    description: 'Actualités du club, environnement, navigation et vie du Club Nautique de Coutainville.',
};

export const revalidate = 60;

export default async function BlogPage() {
    const articles = await client.fetch(queries.articles).catch(() => []);

    return <BlogClient articles={articles} />;
}

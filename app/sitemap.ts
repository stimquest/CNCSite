import type { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';

const BASE_URL = 'https://cnccoutainville.fr';

const STATIC_ROUTES: { url: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { url: '/',                        priority: 1.0,  changeFrequency: 'daily' },
    { url: '/le-spot',                 priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/nature',                  priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/activites',               priority: 0.9,  changeFrequency: 'monthly' },
    { url: '/ecole-voile',             priority: 0.9,  changeFrequency: 'monthly' },
    { url: '/groupes-entreprises',     priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/club',                    priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/blog',                    priority: 0.8,  changeFrequency: 'weekly' },
    { url: '/infos-pratiques',         priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/boutique',                priority: 0.6,  changeFrequency: 'weekly' },
    { url: '/fil-info',                priority: 0.5,  changeFrequency: 'daily' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Slugs des articles de blog
    const articles = await client.fetch<{ slug: string; publishedAt: string }[]>(
        `*[_type == "article" && defined(slug.current)] { "slug": slug.current, publishedAt }`
    ).catch(() => []);

    const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${BASE_URL}/blog/${article.slug}`,
        lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ url, priority, changeFrequency }) => ({
        url: `${BASE_URL}${url}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }));

    return [...staticRoutes, ...articleRoutes];
}

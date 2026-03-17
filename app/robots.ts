import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/cockpit', '/login', '/studio'],
            },
        ],
        sitemap: 'https://cnccoutainville.fr/sitemap.xml',
    };
}

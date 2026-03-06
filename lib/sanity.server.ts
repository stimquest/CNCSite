import 'server-only';

import { createClient } from '@sanity/client';

export function getServerWriteClient() {
    const token = process.env.SANITY_WRITE_TOKEN?.trim();

    if (!token) {
        throw new Error('Missing SANITY_WRITE_TOKEN');
    }

    return createClient({
        projectId: 'df7iwkkw',
        dataset: 'production',
        apiVersion: '2024-03-15',
        token,
        useCdn: false,
    });
}
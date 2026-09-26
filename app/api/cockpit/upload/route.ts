import { NextResponse } from 'next/server';

import { getServerWriteClient } from '@/lib/sanity.server';

// Téléversement d'image vers les assets Sanity. Protégé par proxy.ts (/api/cockpit/:path*).
export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const file = form.get('file');
        if (!(file instanceof File) || !file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Image invalide' }, { status: 400 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const asset = await getServerWriteClient().assets.upload('image', buffer, { filename: file.name, contentType: file.type });
        return NextResponse.json({ assetId: asset._id, url: asset.url });
    } catch (error) {
        console.error('Upload error', error);
        return NextResponse.json({ error: 'Échec du téléversement' }, { status: 500 });
    }
}

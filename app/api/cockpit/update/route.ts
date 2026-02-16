import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// We create a server-side client with the write token
const serverClient = createClient({
    projectId: '9v7nk22c',
    dataset: 'production',
    apiVersion: '2024-03-15',
    token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || '',
    useCdn: false,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, patch, _id = 'singleton-spot-settings' } = body;

        if (type === 'PATCH') {
            await serverClient.patch(_id).set(patch).commit();
            return NextResponse.json({ success: true });
        }

        if (type === 'CREATE_INFO') {
            const result = await serverClient.create({
                _type: 'infoMessage',
                ...patch
            });
            return NextResponse.json({ success: true, id: result._id });
        }

        return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 });
    } catch (error: any) {
        console.error('Cockpit API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

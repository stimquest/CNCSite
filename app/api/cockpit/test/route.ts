import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { getServerWriteClient } from '@/lib/sanity.server';

export const dynamic = 'force-dynamic';

const TEST_ID = 'singleton-spot-settings';

export async function GET() {
    const result: Record<string, any> = {};

    // 1. Test WRITE
    try {
        const serverClient = getServerWriteClient();
        await serverClient.createIfNotExists({ _id: TEST_ID, _type: 'spotSettings' });
        await serverClient.patch(TEST_ID).set({ spotStatus: 'OPEN', lastPublishedAt: new Date().toISOString() }).commit();
        result.write = 'OK';
    } catch (e: any) {
        result.write = 'ERREUR';
        result.writeError = e.message;
    }

    // 2. Test READ
    try {
        const data = await client.fetch(
            `*[_type == "spotSettings" && _id == $id][0] { _id, _type, spotStatus, charStatus, lastPublishedAt }`,
            { id: TEST_ID },
            { useCdn: false, cache: 'no-store' as RequestCache }
        );
        result.read = data ? 'OK' : 'DOCUMENT INTROUVABLE';
        result.document = data;
    } catch (e: any) {
        result.read = 'ERREUR';
        result.readError = e.message;
    }

    return NextResponse.json(result);
}

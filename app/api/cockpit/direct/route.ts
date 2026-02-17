import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const revalidate = 60; // Cache on server for 1 minute

const DATA_PATH = path.join(process.cwd(), 'data', 'cockpit.json');

// Helper to read JSON safely
const readData = () => {
    try {
        const content = fs.readFileSync(DATA_PATH, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        return null;
    }
};

// Helper to write JSON safely
const writeData = (data: any) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

export async function GET() {
    const data = readData();
    if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, patch, notify } = body;

        let currentData = readData() || {};

        if (type === 'PATCH') {
            const updatedData = {
                ...currentData,
                ...patch,
                lastUpdated: new Date().toISOString()
            };
            writeData(updatedData);

            // Optional OneSignal Notification
            if (notify) {
                const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
                const ONESIGNAL_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

                if (ONESIGNAL_APP_ID && ONESIGNAL_API_KEY) {
                    const { title, content } = notify;
                    const osRes = await fetch('https://onesignal.com/api/v1/notifications', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Authorization': `Basic ${ONESIGNAL_API_KEY}`,
                        },
                        body: JSON.stringify({
                            app_id: ONESIGNAL_APP_ID,
                            headings: { fr: title },
                            contents: { fr: content },
                            included_segments: ['Total Subscriptions', 'Subscribed Users'],
                        }),
                    });
                    const osResult = await osRes.json();
                    console.log("OneSignal: Direct Push Result:", { status: osRes.status, data: osResult });
                }
            }

            return NextResponse.json({ success: true, data: updatedData });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (error: any) {
        console.error('Direct Cockpit API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

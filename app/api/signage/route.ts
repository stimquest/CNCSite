import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { normalizeSignageSettings, SIGNAGE_SETTINGS_ID } from '@/lib/signage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await client.withConfig({ useCdn: false }).fetch(
      '*[_id == $id][0]{weatherEnabled, agendaEnabled, customEnabled, weatherDuration, agendaDuration, timeline[]{_key, source, slideId, duration}}',
      { id: SIGNAGE_SETTINGS_ID },
      { cache: 'no-store' },
    );
    return NextResponse.json(normalizeSignageSettings(settings), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Impossible de charger les réglages de diffusion.' }, { status: 503 });
  }
}

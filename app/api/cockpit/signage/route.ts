import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { getServerWriteClient } from '@/lib/sanity.server';
import { normalizeSignageSettings, SIGNAGE_SETTINGS_ID } from '@/lib/signage';

// Protégé par proxy.ts (/api/cockpit/:path*).
export async function POST(req: Request) {
  let input;
  try { input = await req.json(); } catch {
    return NextResponse.json({ error: 'Réglages invalides.' }, { status: 400 });
  }
  if (!input || !Array.isArray(input.timeline) || !input.timeline.length || input.timeline.length > 100) {
    return NextResponse.json({ error: 'La timeline doit contenir de 1 à 100 blocs.' }, { status: 400 });
  }
  const keys = new Set<string>();
  for (const item of input.timeline) {
    if (!item || typeof item._key !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(item._key) || keys.has(item._key)
      || !['weather', 'agenda', 'slide'].includes(item.source)
      || !Number.isInteger(item.duration) || item.duration < 1000 || item.duration > 600000 || item.duration % 1000 !== 0
      || (item.source === 'slide' && (typeof item.slideId !== 'string' || !/^[a-zA-Z0-9_.-]{1,200}$/.test(item.slideId)))) {
      return NextResponse.json({ error: 'Un bloc est invalide. Choisissez une durée entière de 1 à 600 secondes.' }, { status: 400 });
    }
    keys.add(item._key);
  }
  try {
    const timeline = input.timeline.map((item: { _key: string; source: string; duration: number; slideId?: string }) => ({
      _key: item._key, source: item.source, duration: item.duration,
      ...(item.source === 'slide' ? { slideId: item.slideId } : {}),
    }));
    const serverClient = getServerWriteClient();
    const slideIds = [...new Set(timeline.filter((item: { source: string }) => item.source === 'slide').map((item: { slideId?: string }) => item.slideId))];
    if (slideIds.length) {
      const available = await serverClient.fetch<string[]>('*[_type == "signageSlide" && isActive == true && _id in $ids]._id', { ids: slideIds });
      if (available.length !== slideIds.length) return NextResponse.json({ error: 'Une diapo a été masquée ou supprimée. Retirez-la de la timeline avant d’enregistrer.' }, { status: 400 });
    }
    const settings = normalizeSignageSettings({ timeline });
    await serverClient.transaction()
      .createIfNotExists({ _id: SIGNAGE_SETTINGS_ID, _type: 'signageSettings' })
      .patch(SIGNAGE_SETTINGS_ID, { set: settings })
      .commit();
    revalidatePath('/digital-signage');
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Impossible d’enregistrer la diffusion.' }, { status: 500 });
  }
}

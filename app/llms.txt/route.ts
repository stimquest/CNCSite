import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

/**
 * Dynamic /llms.txt endpoint
 * Standard: https://llmstxt.org/
 *
 * Generates machine-readable Markdown from live Sanity data.
 * ISR revalidated every 24h, or instantly via Sanity webhook → /api/webhook/sanity.
 */

export const revalidate = 86400; // 24h ISR

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'df7iwkkw',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-03-15',
    useCdn: false,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnccoutainville.fr';

// ── GROQ Queries ──────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

type Activity = {
    title: string;
    category: string;
    description?: string;
    price?: string;
    prices?: { label: string; value: string }[];
    minAge?: number;
    duration?: string;
    isTideDependent?: boolean;
    planningNote?: string;
    bookingUrl?: string;
    actions?: {
        stage?: { isActive: boolean; type: string; url?: string };
        reservation?: { isActive: boolean; type: string; url?: string };
    };
};

type WeeklyPlanning = {
    title: string;
    startDate: string;
    endDate: string;
};

type CharPlanning = {
    title: string;
    startDate: string;
    endDate: string;
    weeks: {
        title: string;
        startDate: string;
        endDate: string;
        days: { name: string; date: string; sessions: { time: string }[] }[];
    }[];
};

type MarchePlanning = {
    title: string;
    startDate: string;
    endDate: string;
    weeks: {
        title: string;
        startDate: string;
        endDate: string;
        days: { name: string; date: string; sessions: { time: string }[] }[];
    }[];
};

type SpotSettings = {
    spotStatus?: string;
    statusMessage?: string;
    charStatus?: string;
    marcheStatus?: string;
};

async function fetchData() {
    const [activities, planningsVoile, planningsChar, planningsMarche, spot] = await Promise.all([
        client.fetch<Activity[]>(`*[_type == "activity" && !(_id in path('drafts.**'))] | order(order asc) {
            title, category, description, price, prices[]{ label, value },
            minAge, duration, isTideDependent, planningNote, bookingUrl,
            "actions": {
                "stage": actions.stage { isActive, type, url },
                "reservation": actions.reservation { isActive, type, url }
            }
        }`),

        client.fetch<WeeklyPlanning[]>(`*[_type == "weeklyPlanning" && endDate >= $today] | order(startDate asc) {
            title, startDate, endDate
        }`, { today }),

        client.fetch<CharPlanning[]>(`*[_type == "planningCharAVoile" && endDate >= $today] | order(startDate asc) {
            title, startDate, endDate,
            weeks[]{ title, startDate, endDate,
                days[]{ name, date, sessions[]{ time } }
            }
        }`, { today }),

        client.fetch<MarchePlanning[]>(`*[_type == "planningMarche" && endDate >= $today] | order(startDate asc) {
            title, startDate, endDate,
            weeks[]{ title, startDate, endDate,
                days[]{ name, date, sessions[]{ time } }
            }
        }`, { today }),

        client.fetch<SpotSettings>(`*[_type == "spotSettings" && !(_id in path('drafts.**'))][0]{
            spotStatus, statusMessage, charStatus, marcheStatus
        }`),
    ]);

    return { activities, planningsVoile, planningsChar, planningsMarche, spot };
}

// ── Markdown Generators ───────────────────────────────────────────────────────

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function generateActivitiesSection(activities: Activity[]): string {
    if (!activities.length) return '';
    const lines: string[] = ['## Activités proposées', ''];

    for (const act of activities) {
        const bookingUrl = act.actions?.stage?.url || act.bookingUrl;
        lines.push(`### ${act.title}`);
        lines.push(`- **Catégorie** : ${act.category}`);
        if (act.minAge) lines.push(`- **Âge minimum** : ${act.minAge} ans`);
        if (act.duration) lines.push(`- **Durée** : ${act.duration}`);
        if (act.price) lines.push(`- **Tarif indicatif** : ${act.price}`);
        if (act.prices?.length) {
            lines.push('- **Grille tarifaire** :');
            act.prices.forEach(p => lines.push(`  - ${p.label} : ${p.value}`));
        }
        if (act.isTideDependent) lines.push('- ⚠️ Activité dépendante des marées — horaires variables');
        if (act.planningNote) lines.push(`- **Créneaux** : ${act.planningNote}`);
        if (act.description) lines.push(`- ${act.description}`);
        if (bookingUrl) lines.push(`- [Vérifier les disponibilités et s'inscrire](${bookingUrl})`);
        lines.push('');
    }

    return lines.join('\n');
}

function generateVoilePlannings(plannings: WeeklyPlanning[], activities: Activity[]): string {
    if (!plannings.length) return '';

    const voileActivity = activities.find(a => a.category === 'Voile' || a.title.toLowerCase().includes('voile'));
    const bookingUrl = voileActivity?.actions?.stage?.url || voileActivity?.bookingUrl;

    const lines: string[] = ['## Stages Voile — Plannings à venir', ''];
    lines.push('Stages encadrés par des moniteurs diplômés. Niveaux : Mini-Mousses, Moussaillons, Initiation, Perfectionnement.', '');

    for (const p of plannings) {
        lines.push(`- **${p.title}** : du ${formatDate(p.startDate)} au ${formatDate(p.endDate)}`);
    }

    lines.push('');
    if (bookingUrl) {
        lines.push(`[Voir les disponibilités et s'inscrire (Axyomes)](${bookingUrl})`);
    } else {
        lines.push(`[Voir les stages voile](${SITE_URL}/activites)`);
    }
    lines.push('');

    return lines.join('\n');
}

function generateCharPlannings(plannings: CharPlanning[], activities: Activity[]): string {
    if (!plannings.length) return '';

    const charActivity = activities.find(a => a.title.toLowerCase().includes('char'));
    const bookingUrl = charActivity?.actions?.stage?.url || charActivity?.bookingUrl;

    const lines: string[] = ['## Char à Voile — Plannings à venir', ''];
    lines.push('Sessions sur la plage d\'Agon-Coutainville. Dépend des conditions météo et de la marée.', '');

    for (const period of plannings) {
        lines.push(`### ${period.title} (${formatDate(period.startDate)} → ${formatDate(period.endDate)})`);
        for (const week of period.weeks) {
            const daysWithSessions = week.days.filter(d => d.sessions?.length > 0);
            if (!daysWithSessions.length) continue;
            lines.push(`**${week.title}** :`);
            for (const day of daysWithSessions) {
                const times = day.sessions.map(s => s.time).join(', ');
                lines.push(`- ${day.name} ${formatDate(day.date)} — ${times}`);
            }
            lines.push('');
        }
    }

    if (bookingUrl) {
        lines.push(`[Réserver une session char à voile (Axyomes)](${bookingUrl})`);
    } else {
        lines.push(`[En savoir plus sur le char à voile](${SITE_URL}/activites)`);
    }
    lines.push('');

    return lines.join('\n');
}

function generateMarchePlannings(plannings: MarchePlanning[], activities: Activity[]): string {
    if (!plannings.length) return '';

    const marcheActivity = activities.find(a => a.title.toLowerCase().includes('marche'));
    const bookingUrl = marcheActivity?.actions?.reservation?.url || marcheActivity?.bookingUrl;

    const lines: string[] = ['## Marche Aquatique — Plannings à venir', ''];
    lines.push('Randonnée aquatique en mer, ouverte à tous. Activité encadrée, accessible sans savoir nager.', '');

    for (const period of plannings) {
        lines.push(`### ${period.title} (${formatDate(period.startDate)} → ${formatDate(period.endDate)})`);
        for (const week of period.weeks) {
            const daysWithSessions = week.days.filter(d => d.sessions?.length > 0);
            if (!daysWithSessions.length) continue;
            for (const day of daysWithSessions) {
                const times = day.sessions.map(s => s.time).join(', ');
                lines.push(`- ${day.name} ${formatDate(day.date)} — ${times}`);
            }
        }
        lines.push('');
    }

    if (bookingUrl) {
        lines.push(`[S'inscrire à la marche aquatique](${bookingUrl})`);
    } else {
        lines.push(`[En savoir plus sur la marche aquatique](${SITE_URL}/activites)`);
    }
    lines.push('');

    return lines.join('\n');
}

// ── Main Route Handler ────────────────────────────────────────────────────────

export async function GET() {
    try {
        const { activities, planningsVoile, planningsChar, planningsMarche, spot } = await fetchData();

        const updatedAt = new Date().toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        const spotStatus = spot?.spotStatus === 'open' ? '✅ Ouvert' : '❌ Fermé';
        const charStatus = spot?.charStatus === 'open' ? '✅ Disponible' : '⚠️ Conditions à vérifier';
        const marcheStatus = spot?.marcheStatus === 'open' ? '✅ Disponible' : '⚠️ Conditions à vérifier';

        const content = `# CNC — Club Nautique de Coutainville

> Club nautique associatif à Agon-Coutainville (Manche, Normandie, France).
> Activités : Voile (école + stages), Char à Voile, Marche Aquatique, Glisse (Wing, Kite, Windsurf), Kayak, Paddle.
> Affilié FFV (Fédération Française de Voile) et FFCV (Fédération Française de Char à Voile).
> Données mises à jour automatiquement — dernière génération : ${updatedAt}.

## Informations générales

- **Adresse** : Plage de Coutainville, Agon-Coutainville, 50230, Manche, Normandie
- **Contact** : [${SITE_URL}/infos-pratiques](${SITE_URL}/infos-pratiques)
- **Boutique** : [${SITE_URL}/boutique](${SITE_URL}/boutique)
- **État du plan d'eau** : ${spotStatus}${spot?.statusMessage ? ` — ${spot.statusMessage}` : ''}
- **Char à voile** : ${charStatus}
- **Marche aquatique** : ${marcheStatus}

## En résumé

Le CNC propose des activités nautiques et de plein air pour tous les âges et tous les niveaux.
L'école de voile accueille les enfants dès 5 ans (Mini-Mousses) et les adultes.
Les stages de char à voile se déroulent sur la vaste plage d'Agon-Coutainville.
La marche aquatique est accessible à tous, sans condition physique particulière.
Les inscriptions et réservations sont gérées via la plateforme Axyomes (liens directs ci-dessous).

${generateActivitiesSection(activities)}
${generateVoilePlannings(planningsVoile, activities)}
${generateCharPlannings(planningsChar, activities)}
${generateMarchePlannings(planningsMarche, activities)}
## Pages utiles

- [Toutes les activités](${SITE_URL}/activites)
- [École de voile](${SITE_URL}/ecole-voile)
- [Le Spot — infos marée et météo](${SITE_URL}/le-spot)
- [Fil Info — actualités du club](${SITE_URL}/fil-info)
- [Infos pratiques — accès, contact](${SITE_URL}/infos-pratiques)

## Optional

- [Galerie photos](${SITE_URL}/le-spot)
- [Groupes & entreprises](${SITE_URL}/groupes-entreprises)
`;

        return new NextResponse(content, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
            },
        });
    } catch (err) {
        console.error('[llms.txt] Error generating:', err);
        return new NextResponse('# CNC — Club Nautique de Coutainville\n\n> Données temporairement indisponibles.', {
            status: 500,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
    }
}

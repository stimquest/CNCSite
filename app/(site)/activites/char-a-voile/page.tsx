import React from 'react';
import { client, queries } from '@/lib/sanity';
import CharPlanningPublic from '@/components/char/CharPlanningPublic';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Planning Char à Voile — CNC Coutainville',
    description: 'Consultez les créneaux de char à voile disponibles à Agon-Coutainville. Sessions liées aux marées, réservation par téléphone.',
};

export const revalidate = 60;

export default async function CharAVoilePlanningPage() {
    const today = new Date().toISOString().split('T')[0];

    const sessions = await client
        .fetch(queries.charSessionsPublic, { today })
        .catch(() => []);

    // Phone from env or fallback
    const phoneNumber = process.env.NEXT_PUBLIC_CLUB_PHONE ?? '02 33 47 XX XX';

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            {/* Hero compact */}
            <section className="relative bg-abysse overflow-hidden py-24">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                />
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <span className="inline-block bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                        🏁 Char à Voile
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic text-white tracking-tighter leading-none mb-4">
                        Planning &amp; Réservations
                    </h1>
                    <p className="text-white/70 text-sm font-medium max-w-xl mx-auto leading-relaxed">
                        Les sessions de char à voile sont planifiées en fonction des marées.
                        Consultez les créneaux disponibles et appelez-nous pour réserver votre place.
                    </p>
                </div>
            </section>

            {/* Contenu */}
            <section className="max-w-4xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
                <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 md:p-10">
                    <CharPlanningPublic sessions={sessions} phoneNumber={phoneNumber} />
                </div>

                {/* Info bloc */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            icon: '🌊',
                            title: 'Lié aux marées',
                            desc: 'Les horaires changent à chaque session selon la fenêtre de basse mer.'
                        },
                        {
                            icon: '📞',
                            title: 'Réservation par téléphone',
                            desc: `Appelez le ${phoneNumber} pour confirmer votre place après consultation du planning.`
                        },
                        {
                            icon: '👨‍👩‍👧',
                            title: 'Tout public',
                            desc: 'Sessions accessibles à tous, encadrées par des moniteurs diplômés.'
                        }
                    ].map(item => (
                        <div key={item.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <span className="text-2xl mb-2 block">{item.icon}</span>
                            <h3 className="font-black text-sm uppercase text-abysse tracking-tight mb-1">{item.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

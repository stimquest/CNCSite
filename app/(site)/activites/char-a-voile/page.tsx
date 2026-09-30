import React from 'react';
import { client, queries } from '@/lib/sanity';
import CharPlanningPublic from '@/components/char/CharPlanningPublic';
import CharStorySlideshow from '@/components/char/CharStorySlideshow';
import { PageHero } from '@/components/PageHero';
import { Metadata } from 'next';
import { User, ShieldCheck, Footprints, Wind } from 'lucide-react';

export const revalidate = 60;

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
    const pageData = await client.fetch(queries.charAVoilePage).catch(() => null);
    
    return {
        title: pageData?.seo?.title || 'Char à Voile Agon-Coutainville | Planning & Réservations | CNC',
        description: pageData?.seo?.description || 'Réservez votre séance de char à voile à Agon-Coutainville. Planning en ligne selon les marées et réservation directe par téléphone.',
    };
}

export default async function CharAVoilePlanningPage() {
    const today = new Date().toISOString().split('T')[0];

    const [sessions, pageData] = await Promise.all([
        client.fetch(queries.charSessionsPublic, { today }).catch(() => []),
        client.fetch(queries.charAVoilePage).catch(() => null)
    ]);

    // Phone from env or fallback
    const phoneNumber = process.env.NEXT_PUBLIC_CLUB_PHONE?.trim() || '02 33 47 14 81';

    // Extraction des données Sanity avec fallbacks robustes
    const heroTag = 'Dès 8 ans · Tous niveaux';

    const practicalInfos = pageData?.practicalInfos || {
        ageMin: 'À partir de 8 ans.',
        equipment: 'Casque de sécurité (obligatoire).',
        toBring: 'Chaussures fermées, coupe-vent, lunettes.'
    };

    const faq = pageData?.faq || [
        { q: "À quel âge peut-on commencer ?", a: "L'activité est accessible dès 8 ans. Les enfants naviguent généralement seuls dans le char." },
        { q: "Quel équipement dois-je apporter ?", a: "Le casque est fourni. Vous devez impérativement venir avec des chaussures fermées (vieilles baskets), un coupe-vent et des lunettes de soleil ou de protection contre le sable." },
        { q: "Pourquoi les horaires changent-ils tous les jours ?", a: "Le char à voile se pratique uniquement sur le sable humide à marée basse. Nos horaires se décalent donc chaque jour pour suivre l'heure de la marée." },
        { q: "Que se passe-t-il s'il pleut ou s'il n'y a pas de vent ?", a: "En cas de conditions défavorables, l'équipe vous contactera pour décaler la séance. Notez qu'une petite averse n'empêche pas de rouler !" },
        { q: "Faut-il être très sportif pour en faire ?", a: "Non, c'est très accessible. C'est un sport de technique plus que de force pure." },
        { q: "Faites-vous des tarifs pour les Groupes ou CE ?", a: "Oui, nous accueillons des comités d'entreprise, scolaires et centres de loisirs. N'hésitez pas à nous contacter." }
    ];

    const weatherNote = pageData?.weatherNote || 'Le char à voile est fortement lié aux conditions de vent et de marée. Consultez les disponibilités ci-dessus, puis appelez-nous pour confirmer la météo.';

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            <PageHero
                image="/images/imgBank/Char001.jpg"
                imagePosition="center bottom"
                imageAlt="Des chars à voile aux voiles rouges sur la plage sous un grand ciel bleu"
                tagIcon={<Wind size={14} />}
                tagText={heroTag}
                title="Char à voile"
                subtitle="sur la plage de Coutainville."
                description="Découvrez les sensations de la glisse sur le sable, accompagné par nos moniteurs. Consultez les créneaux et préparez votre prochaine séance."
                size="default"
                bottomColor="slate"
            />

            {/* Déroulé de la séance, informations et calendrier */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 flex flex-col gap-10">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 lg:gap-10">
                    
                    {/* COLONNE GAUCHE : Diaporama, Infos, FAQ */}
                    <div className="min-w-0 flex flex-col gap-8 order-2 lg:order-1">
                        <CharStorySlideshow />

                        {/* Infos pratiques avec icônes Lucide */}
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-8 space-y-6">
                            <h3 className="text-xl font-black uppercase italic text-abysse tracking-tight">Infos Pratiques</h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                        <User className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs uppercase text-slate-400 tracking-widest">Âge minimum</h4>
                                        <p className="text-abysse font-medium text-sm mt-1">{practicalInfos.ageMin}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs uppercase text-slate-400 tracking-widest">Fourni</h4>
                                        <p className="text-abysse font-medium text-sm mt-1">{practicalInfos.equipment}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                        <Footprints className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs uppercase text-slate-400 tracking-widest">À prévoir</h4>
                                        <p className="text-abysse font-medium text-sm mt-1">{practicalInfos.toBring}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Zone FAQ Accordéon */}
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-8">
                            <h3 className="text-xl font-black uppercase italic text-abysse tracking-tight mb-6">Questions Fréquentes</h3>
                            <div className="flex flex-col gap-3">
                                {faq.map((item: any, idx: number) => (
                                    <details key={item._key || idx} className="group overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 [&_summary::-webkit-details-marker]:hidden">
                                        <summary className="flex items-center justify-between cursor-pointer p-5 font-bold text-sm text-abysse transition-colors hover:bg-slate-100/80">
                                            {item.question || item.q}
                                            <span className="relative shrink-0 ml-4 w-5 h-5 flex items-center justify-center text-slate-400">
                                                <svg className="w-4 h-4 transform transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </span>
                                        </summary>
                                        <div className="p-5 pt-0 text-slate-500 font-medium text-xs sm:text-sm leading-relaxed bg-slate-50/50">
                                            {item.answer || item.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* COLONNE DROITE : Calendrier (Sticky sur Desktop) */}
                    <div id="reservations" className="min-w-0 relative order-1 lg:order-2 scroll-mt-24">
                        <div className="lg:sticky lg:top-8 w-full flex flex-col gap-6">
                            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 w-full">
                                {/* Composant principal (Calendrier) */}
                                <CharPlanningPublic sessions={sessions} phoneNumber={phoneNumber} />
                                
                                {/* Note Météo et Réassurance */}
                                <div className="mt-8 pt-6 border-t border-slate-100 flex items-start gap-4">
                                    <Wind className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                        {weatherNote}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}

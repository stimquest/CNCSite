import React from 'react';
import { client, queries } from '@/lib/sanity';
import CharPlanningPublic from '@/components/char/CharPlanningPublic';
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
    const phoneNumber = process.env.NEXT_PUBLIC_CLUB_PHONE ?? '02 33 47 XX XX';

    // Extraction des données Sanity avec fallbacks robustes
    const hero = pageData?.hero || {
        tag: '🏁 Char à Voile',
        title: 'Sensations de glisse sur le sable',
        description: 'Découvrez le char à voile à Agon-Coutainville, dans la Manche (Cotentin). Activité encadrée par l\'École Française de Char à Voile.'
    };

    const media = pageData?.media || {
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&mute=1&autoplay=1&loop=1'
    };

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
            {/* HERO ORIGINAL CNC */}
            <section className="relative bg-abysse overflow-hidden py-24 pb-32">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
                    <span className="inline-block bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                        {hero.tag}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic text-white tracking-tighter leading-tight mb-4">
                        {hero.title}
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                        {hero.description}
                    </p>
                </div>
            </section>

            {/* Layout Principal : Colonnes Gauche (Médias/Infos) / Droite (Calendrier) */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-10 flex flex-col gap-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    
                    {/* COLONNE GAUCHE (7/12) : Vidéo, Infos, FAQ */}
                    <div className="lg:col-span-1 xl:col-span-7 flex flex-col gap-8 order-2 lg:order-1">
                        
                        {/* Média Bento : Vidéo intégrée depuis Sanity */}
                        {media.videoUrl && (
                            <div className="w-full aspect-video bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative group">
                                <iframe 
                                    className="w-full h-full object-cover" 
                                    src={(() => {
                                        const url = media.videoUrl;
                                        if (!url) return '';
                                        // Parser YouTube
                                        const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
                                        if (ytMatch && ytMatch[1]) return `https://www.youtube.com/embed/${ytMatch[1]}?controls=1&rel=0`;
                                        // Parser Vimeo
                                        const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
                                        if (vimeoMatch && vimeoMatch[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
                                        return url;
                                    })()}
                                    title="Vidéo Char à Voile"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                                {/* Voile assombrissant léger pour l'intégration UX */}
                                <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                            </div>
                        )}

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

                    {/* COLONNE DROITE (5/12) : Calendrier (Sticky sur Desktop) */}
                    <div className="lg:col-span-1 xl:col-span-5 relative order-1 lg:order-2">
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

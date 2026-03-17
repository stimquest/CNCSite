import React from 'react';
import {
    ShoppingBag, ArrowRight,
    Tag, ChevronRight, ExternalLink, Package,
    Trophy, Sparkles, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { client, queries } from '@/lib/sanity';

export const metadata = {
    title: 'Boutique & Occaz - CNC Coutainville',
    description: "Boutique officielle du CNC Coutainville : textile, accessoires nautiques et petites annonces de matériel d'occasion entre membres.",
};

// Helper: extract plain text from Portable Text blocks or return string as-is
function toPlainText(value: any): string {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        return value
            .filter((b: any) => b._type === 'block')
            .map((b: any) => b.children?.map((c: any) => c.text).join('') ?? '')
            .join('\n');
    }
    return '';
}

// Custom Cache configuration for data
export const revalidate = 60;

export default async function BoutiquePage() {
    const [merchItems, occazItems] = await Promise.all([
        client.fetch(queries.merchItems).catch(() => []),
        client.fetch(queries.occazItems).catch(() => [])
    ]);

    const merchToShow = merchItems.length > 0 ? merchItems : [];
    const occazToShow = occazItems.length > 0 ? occazItems : [];

    return (
        <div className="w-full font-sans bg-white pb-24">

            {/* 1. HERO HEADER */}
            <section className="pt-32 pb-16 px-6 bg-abysse text-white overflow-hidden relative">
                <div className="absolute -top-24 -right-24 size-96 bg-yellow-400/10 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-24 -left-24 size-96 bg-turquoise/10 rounded-full blur-[120px]"></div>

                <div className="max-w-350 mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-yellow-400 mb-8">
                        <ShoppingBag size={14} />
                        <span>Showcase & Merchandising</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl text-white leading-[0.85] mb-8">
                        L'Échoppe<br /><span className="text-yellow-400">du Club.</span>
                    </h1>
                    <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
                        Portez fièrement les couleurs du CNC. Une sélection premium d'équipements et d'accessoires disponibles directement au secrétariat du club.
                    </p>
                </div>
            </section>

            {/* 2. VITRINE MERCHANDISING */}
            <section className="py-24 px-6 relative">
                <div className="max-w-350 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <span className="text-turquoise font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Collection Officielle</span>
                            <h2 className="text-4xl md:text-6xl font-black text-abysse uppercase italic tracking-tighter leading-none mb-6">
                                Le Style<br />Coutainville.
                            </h2>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4 max-w-sm">
                            <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-turquoise shadow-sm shrink-0">
                                <Package size={24} />
                            </div>
                            <p className="text-xs font-bold text-slate-500 leading-tight">
                                <span className="text-abysse font-black block mb-1 uppercase">Achat Direct</span>
                                Articles disponibles à la vente au club selon stocks disponibles. Pas de livraison en ligne.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {merchToShow.map((item: any) => (
                            <div key={item._id} className="group flex flex-col h-full bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
                                <div className="relative aspect-square overflow-hidden bg-slate-100">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={`w-full h-full object-cover transition-all duration-1000 ${item.hoverImage ? 'group-hover:opacity-0 group-hover:scale-110' : 'group-hover:scale-110'}`}
                                    />
                                    {item.hoverImage && (
                                        <img
                                            src={item.hoverImage}
                                            alt={`${item.name} alternate view`}
                                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-110 transition-all duration-1000"
                                        />
                                    )}
                                    {item.badge && (
                                        <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-turquoise">{item.badge}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-abysse/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.category}</span>
                                        <span className="text-lg font-black text-turquoise">{item.price}</span>
                                    </div>
                                    <h3 className="text-xl text-abysse mb-4 group-hover:text-turquoise transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                                        {toPlainText(item.description)}
                                    </p>
                                    <button className="w-full bg-slate-50 group-hover:bg-abysse group-hover:text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3">
                                        Voir au club <ArrowRight size={14} className="text-turquoise" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. LES OCCAZ DU CLUB */}
            <section className="py-24 px-6 bg-slate-50 relative overflow-hidden rounded-[4rem] mx-4 sm:mx-8">
                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-turquoise/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-350 mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-turquoise/10 text-turquoise rounded-lg font-black text-[9px] uppercase tracking-widest mb-4">
                                <Tag size={12} /> Bonnes Affaires
                            </div>
                            <h2 className="text-4xl md:text-6xl text-abysse leading-none mb-6">
                                Les Occaz<br /><span className="text-turquoise">du Club.</span>
                            </h2>
                            <p className="text-slate-600 font-medium text-lg max-w-xl">
                                Une sélection éphémère de matériel d'occasion révisé et prêt à naviguer.
                            </p>
                        </div>

                        <div className="bg-yellow-400 p-8 rounded-4xl text-abysse shadow-xl max-w-md relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertCircle size={24} className="animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Événement Annuel</span>
                                </div>
                                <h3 className="text-xl mb-2">Le Marché de l'Occaz Voile</h3>
                                <p className="text-sm font-bold opacity-80 leading-relaxed mb-6">
                                    Ne manquez pas notre grand événement annuel chaque printemps ! Le rendez-vous incontournable pour les passionnés.
                                </p>
                                <Link href="/news" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:translate-x-1 transition-transform">
                                    En savoir plus <ChevronRight size={14} />
                                </Link>
                            </div>
                            <Trophy size={100} className="absolute -right-8 -bottom-8 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {occazToShow.length > 0 ? (
                            occazToShow.map((item: any) => (
                                <div key={item._id} className="bg-white rounded-[3.5rem] border border-slate-200 overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-xl transition-all group">
                                    <div className="md:w-1/2 relative bg-slate-100 overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                        <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/20">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-abysse">{item.condition} • {item.year}</span>
                                        </div>
                                    </div>
                                    <div className="md:w-1/2 p-10 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-2xl text-abysse mb-4">{item.name}</h3>
                                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                                                {toPlainText(item.description)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="text-3xl font-black text-turquoise">{item.price}</div>
                                            <a href="/infos-pratiques" className="w-full bg-abysse text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center hover:bg-turquoise transition-colors">
                                                Contacter le club
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-1 lg:col-span-2 py-20 text-center bg-white rounded-[3.5rem] border border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Aucune occasion disponible actuellement.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 4. AXYOMES CALL TO ACTION (Future Boutique En Ligne) */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-2xl mx-auto bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-turquoise opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <Sparkles className="mx-auto text-turquoise mb-6" size={32} />
                    <h3 className="text-2xl text-abysse mb-4">Besoin d'autre chose ?</h3>
                    <p className="text-slate-500 font-medium mb-10">
                        Pour vos réservations de stages ou adhésion club, passez par notre plateforme officielle de gestion.
                    </p>
                    <a
                        href="https://coutainville.axyomes.com/"
                        target="_blank"
                        className="inline-flex items-center gap-3 bg-abysse text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-turquoise transition-all shadow-xl group/btn"
                    >
                        Accéder à Axyomes <ExternalLink size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                </div>
            </section>

        </div>
    );
}

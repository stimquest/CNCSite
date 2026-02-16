
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useContent } from '@/contexts/ContentContext';
import {
    Calendar, Clock, MapPin, Phone, Mail, Download, Info,
    Anchor, FileText, CheckCircle2, ArrowRight, GraduationCap,
    Search, Filter, Send, ExternalLink, ShieldCheck, Trophy, Sparkles, Compass, Zap, HeartHandshake
} from 'lucide-react';

import { PlanningWidget } from '@/components/PlanningWidget';
import { SecondaryNav } from '@/components/SecondaryNav';

// --- DATA: DOCUMENTS ---
const DOCUMENTS_DATA = [
    {
        id: "grille-tarifaire",
        title: "Grille Tarifaire",
        description: "Tous les tarifs stages, locations et adhésions club.",
        category: "tarifs",
        type: "PDF",
        size: "1.2 Mo",
        url: "#"
    },
    {
        id: "fiche-sanitaire",
        title: "Fiche Sanitaire",
        description: "Obligatoire pour l'inscription des mineurs en stage.",
        category: "stages",
        type: "PDF",
        size: "450 Ko",
        url: "#"
    },
    {
        id: "reglement-interieur",
        title: "Règlement Intérieur",
        description: "Les règles de vie et de sécurité au sein du club.",
        category: "club",
        type: "PDF",
        size: "800 Ko",
        url: "#"
    },
    {
        id: "avis-de-course-type",
        title: "Avis de Course (Modèle)",
        description: "Document de référence pour les compétitions locales.",
        category: "competition",
        type: "PDF",
        size: "1.5 Mo",
        url: "#"
    },
    {
        id: "fiche-inscription-stage",
        title: "Fiche d'Inscription Stage",
        description: "Version papier pour inscription par voie postale.",
        category: "stages",
        type: "PDF",
        size: "600 Ko",
        url: "#"
    },
    {
        id: "statuts-club",
        title: "Statuts de l'Association",
        description: "Documents officiels régissant le CNC.",
        category: "club",
        type: "PDF",
        size: "2.1 Mo",
        url: "#"
    },
    {
        id: "certificat-medical",
        title: "Modèle Certificat Médical",
        description: "Indispensable pour la pratique en compétition.",
        category: "competition",
        type: "PDF",
        size: "300 Ko",
        url: "#"
    },
    {
        id: "autorisation-parentale",
        title: "Autorisation Parentale",
        description: "Droit à l'image et participation aux activités.",
        category: "stages",
        type: "PDF",
        size: "200 Ko",
        url: "#"
    },
    {
        id: "guide-du-nouveau-membre",
        title: "Guide du Nouveau Membre",
        description: "Tout ce qu'il faut savoir quand on rejoint le club.",
        category: "club",
        type: "PDF",
        size: "3.4 Mo",
        url: "#"
    }
];

const CATEGORIES = [
    { id: 'all', label: 'Tous les docs', icon: <FileText size={14} /> },
    { id: 'stages', label: 'Stages & Mineurs', icon: <GraduationCap size={14} /> },
    { id: 'club', label: 'Vie du Club', icon: <ShieldCheck size={14} /> },
    { id: 'competition', label: 'Compétition', icon: <Trophy size={14} /> },
    { id: 'tarifs', label: 'Tarifs', icon: <Clock size={14} /> },
];

// --- NAVIGATION ANCRES ---
const SECTIONS = [
    { id: 'contact', label: 'Contact' },
    { id: 'documents', label: 'Documents' },
    { id: 'map', label: 'Accès' },
    { id: 'pricing', label: 'Tarifs' },
    { id: 'planning', label: 'Plannings' },
];

// --- COMPONENT: PRICING WIDGET ---
const PricingWidget: React.FC = () => {
    const [activePricingTab, setActivePricingTab] = useState<'stages' | 'decouverte' | 'rentals' | 'yearly'>('stages');

    return (
        <section id="pricing" className="py-24 border-t border-slate-100 bg-white">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-turquoise font-black uppercase tracking-widest text-[9px] mb-2 block">Saison en cours</span>
                        <h2 className="text-4xl md:text-5xl text-abysse mb-4">Tarifs & Formules</h2>
                        <p className="text-slate-600 font-medium text-base">Choisissez votre support et votre rythme de pratique.</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mb-12 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit mx-auto">
                    {[
                        { id: 'stages', label: 'Stages Été', icon: <Calendar size={14} /> },
                        { id: 'decouverte', label: 'Découverte', icon: <Zap size={14} /> },
                        { id: 'rentals', label: 'Locations & Cours', icon: <Clock size={14} /> },
                        { id: 'yearly', label: 'Club à l\'Année', icon: <HeartHandshake size={14} /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActivePricingTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${activePricingTab === tab.id
                                ? 'bg-abysse text-white shadow-lg'
                                : 'text-slate-400 hover:text-abysse hover:bg-slate-50'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activePricingTab === 'stages' && (
                        <div className="bg-white rounded-4xl shadow-xl border border-slate-100 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-abysse via-turquoise to-abysse"></div>
                            <div className="p-8 md:p-12">
                                <div className="overflow-x-auto rounded-3xl border border-slate-100">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-xs font-black text-slate-500 uppercase tracking-widest">
                                                <th className="py-6 pl-8 w-1/3">Support</th>
                                                <th className="py-6">Âge</th>
                                                <th className="py-6 text-right">1ère Semaine</th>
                                                <th className="py-6 pr-8 text-right text-turquoise">2ème Semaine (-5%)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-bold text-slate-600">
                                            {[
                                                { name: "Mini Mousses", age: "5-7 ans", p1: "168 €", p2: "129 €" },
                                                { name: "Moussaillons", age: "7-8 ans", p1: "173 €", p2: "134 €" },
                                                { name: "Catamaran 10-12p", age: "8-12 ans", p1: "188 €", p2: "148 €" },
                                                { name: "Catamaran 14p", age: "13-15 ans", p1: "208 €", p2: "167 €" },
                                                { name: "Catamaran 16p", age: "Adultes", p1: "238 €", p2: "196 €" },
                                                { name: "Planche à voile", age: "14 ans +", p1: "188 €", p2: "148 €" },
                                            ].map((row, i) => (
                                                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors group">
                                                    <td className="py-5 pl-8 text-abysse text-base font-black group-hover:text-turquoise transition-colors">{row.name}</td>
                                                    <td className="py-5"><span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-slate-500 shadow-sm">{row.age}</span></td>
                                                    <td className="py-5 text-right text-lg font-black text-abysse">{row.p1}</td>
                                                    <td className="py-5 pr-8 text-right text-lg font-black text-slate-400 group-hover:text-turquoise transition-colors">{row.p2}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Add other tabs content if necessary, simplifying to keep code manageable */}
                    {activePricingTab !== 'stages' && (
                        <div className="bg-slate-50 rounded-4xl p-20 text-center border-2 border-dashed border-slate-200">
                            <h4 className="text-xl text-abysse opacity-30">Détails disponibles dans la grille PDF</h4>
                            <p className="text-sm text-slate-400 font-bold mt-2">Section Documents ci-dessus</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

// --- COMPONENT: DOCUMENT MANAGER ---
const DocumentManager: React.FC = () => {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        // Handle deep linking from URL hash (e.g., #documents-stages)
        if (typeof window !== 'undefined' && window.location.hash) {
            const hash = window.location.hash.replace('#documents-', '');
            if (CATEGORIES.find(c => c.id === hash)) {
                setActiveTab(hash);
            }
        }
    }, []);

    const filteredDocs = DOCUMENTS_DATA.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
            doc.description.toLowerCase().includes(search.toLowerCase());
        const matchesTab = activeTab === "all" || doc.category === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <section id="documents" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-turquoise/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-xl">
                        <span className="text-turquoise font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Espace Ressources</span>
                        <h2 className="text-4xl md:text-6xl text-abysse leading-none mb-6">
                            Tous vos<br />Documents.
                        </h2>
                        <p className="text-slate-600 font-medium text-lg leading-relaxed">
                            Retrouvez facilement tous les formulaires et documents officiels du club. Utilisez les catégories pour filtrer selon votre profil.
                        </p>
                    </div>

                    <div className="w-full md:w-96 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-turquoise transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher par titre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-16 pr-6 font-bold text-sm text-abysse focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-10">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            id={`documents-${cat.id}`}
                            onClick={() => setActiveTab(cat.id)}
                            className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === cat.id
                                ? 'bg-abysse text-white shadow-xl scale-105'
                                : 'bg-white text-slate-500 border border-slate-100 hover:border-turquoise hover:text-turquoise shadow-sm'
                                }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {filteredDocs.length > 0 ? (
                        filteredDocs.map((doc) => (
                            <div key={doc.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between hover:-translate-y-1">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-abysse group-hover:bg-turquoise group-hover:text-white transition-colors duration-500">
                                            <FileText size={24} />
                                        </div>
                                        <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase font-mono">
                                            {doc.type} • {doc.size}
                                        </span>
                                    </div>
                                    <h3 className="text-xl text-abysse mb-3 group-hover:text-turquoise transition-colors">
                                        {doc.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                                        {doc.description}
                                    </p>
                                </div>
                                <a
                                    href={doc.url}
                                    className="flex items-center justify-between px-6 py-4 bg-slate-50 rounded-2xl group-hover:bg-abysse group-hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
                                >
                                    Télécharger
                                    <Download size={16} className="text-turquoise group-hover:text-white transition-colors" />
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center">
                            <h3 className="text-2xl font-black text-abysse uppercase italic opacity-50">Aucun document trouvé</h3>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

// --- COMPONENT: CONTACT FORM ---
const ContactForm: React.FC = () => {
    return (
        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-turquoise opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

            <h2 className="text-3xl text-abysse mb-8 flex items-center gap-4">
                <span className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center text-turquoise shadow-inner"><Mail size={24} /></span>
                Écrivez-nous
            </h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nom Complet</label>
                        <input type="text" placeholder="Jean Dupont" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email</label>
                        <input type="email" placeholder="jean@exemple.fr" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise transition-all" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sujet</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise transition-all appearance-none cursor-pointer">
                        <option>Information générale</option>
                        <option>Inscription Stage</option>
                        <option>Adhésion Club</option>
                        <option>Régate / Compétition</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Message</label>
                    <textarea
                        rows={4}
                        placeholder="Votre demande..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise transition-all resize-none"
                    ></textarea>
                </div>

                <button className="w-full bg-abysse hover:bg-turquoise text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 group">
                    Envoyer <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </form>
        </div>
    );
};

// --- PAGE PRINCIPALE ---
export const InfosPratiquesPage: React.FC = () => {
    // MAP
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        let map: any = null;
        const initMap = async () => {
            if (!mapRef.current || mapInstance.current) return;
            const L = (await import('leaflet')).default;
            // @ts-ignore - CSS import has no type declarations
            await import('leaflet/dist/leaflet.css');
            map = L.map(mapRef.current).setView([49.030384, -1.595904], 17);
            L.tileLayer('https://data.geopf.fr/wmts?&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM&LAYER={ignLayer}&STYLE={style}&FORMAT={format}&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}', {
                ignLayer: 'ORTHOIMAGERY.ORTHOPHOTOS', style: 'normal', format: 'image/jpeg', attribution: '© IGN'
            } as any).addTo(map);
            const icon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                shadowSize: [41, 41]
            });
            L.marker([49.030384, -1.595904], { icon }).addTo(map).bindPopup('<b>CNC Coutainville</b><br/>Plage Nord').openPopup();
            mapInstance.current = map;
        };
        initMap();

        return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
    }, []);

    return (
        <div className="w-full font-sans bg-white">

            {/* 1. HERO HEADER */}
            <section className="pt-32 pb-16 px-6 bg-abysse text-white overflow-hidden relative">
                <div className="absolute -top-24 -right-24 size-96 bg-turquoise/10 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-24 -left-24 size-96 bg-blue-500/10 rounded-full blur-[120px]"></div>

                <div className="max-w-[1400px] mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-turquoise mb-8">
                        <Compass size={14} />
                        <span>Pratique & Contact</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl text-white leading-[0.85] mb-8">
                        L'Escale<br /><span className="text-turquoise">Logistique.</span>
                    </h1>
                    <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
                        Besoin d'un renseignement, d'un document ou de nous trouver sur la côte ? Retrouvez toutes les informations essentielles pour préparer votre sortie en mer.
                    </p>
                </div>
            </section>

            {/* MENU SECONDAIRE STICKY */}
            <SecondaryNav sections={SECTIONS} />

            {/* 2. CONTACT BENTO GRID */}
            <section id="contact" className="py-24 px-6 bg-white">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        <div className="lg:col-span-1 space-y-8 flex flex-col">
                            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm flex-1">
                                <MapPin size={32} className="text-turquoise mb-8" />
                                <h3 className="text-2xl text-abysse mb-4">Où nous trouver ?</h3>
                                <p className="text-slate-500 font-bold leading-relaxed">
                                    104 rue des Dunes<br />50230 Agon-Coutainville
                                </p>
                            </div>
                            <div className="bg-abysse p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex-1">
                                <h3 className="text-2xl mb-8">Contact Direct</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Phone size={20} className="text-turquoise" />
                                        <span className="text-xl font-bold">02 33 47 14 81</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Mail size={20} className="text-turquoise" />
                                        <span className="text-sm font-bold uppercase tracking-tighter">contact@cncoutainville.fr</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. DOCUMENT MANAGER */}
            <DocumentManager />

            {/* 4. MAP SECTION */}
            <section id="map" className="py-24 px-6 bg-white">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="h-[500px] w-full rounded-[4rem] overflow-hidden border border-slate-100 shadow-2xl relative order-2 lg:order-1">
                            <div className="absolute top-10 left-10 z-1000 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-200 shadow-2xl">
                                <span className="text-sm font-black text-abysse uppercase italic">Club Nautique Coutainville</span>
                            </div>
                            <div ref={mapRef} className="w-full h-full"></div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-4xl md:text-6xl text-abysse leading-none mb-8">Situé au Sud de la Digue.</h2>
                            <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10">le Club Nautique de Coutainville bénéficie d’un emplacement privilégié en bord de plage, entre dunes préservées et large baie propice aux sports de glisse.</p>
                            <a href="https://www.google.com/maps/dir/?api=1&destination=49.030384,-1.595904" target="_blank" className="px-10 py-5 bg-abysse text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-turquoise transition-all shadow-xl w-fit">Calculer mon itinéraire <ExternalLink size={18} /></a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. PRICING WIDGET */}
            <PricingWidget />

            {/* 6. PLANNING WIDGET */}
            <section id="planning" className="py-24 px-6 bg-slate-50">
                <div className="max-w-[1400px] mx-auto">
                    <div className="mb-12">
                        <span className="text-turquoise font-black uppercase tracking-widest text-[10px] mb-4 block">Organisation</span>
                        <h2 className="text-4xl md:text-5xl text-abysse mb-4">Plannings</h2>
                        <p className="text-slate-600 font-medium text-base">Consultez le planning des stages et activités.</p>
                    </div>
                    <PlanningWidget />
                </div>
            </section>

            <div className="h-32 bg-white"></div>
        </div>
    );
};

export default InfosPratiquesPage;


"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
    Clock, MapPin, Phone, Mail, Download, 
    FileText, CheckCircle2, GraduationCap,
    Search, Send, ExternalLink, ShieldCheck, Trophy, Compass
} from 'lucide-react';

import { PlanningWidget } from '@/components/PlanningWidget';
import { SecondaryNav } from '@/components/SecondaryNav';
import { sendContactEmail } from '@/app/actions/contact';
import { PortableText } from '@portabletext/react';

// --- TYPES ---
interface InfosData {
    heroTitle: string;
    heroSubtitle: string;
    address: string;
    phone: string;
    email: string;
    documents: Array<{
        title: string;
        description: string;
        category: string;
        url: string;
    }>;
    pricing: {
        eyebrow?: string;
        title: string;
        pdfUrl?: string;
        stages:    { label?: string; note?: string; rows: Array<{ activity: string; ages: string; price1: string; price2: string }> };
        courses:   { label?: string; rows: Array<{ activity: string; duration: string; details: string; price: string }> };
        locations: { label?: string; rows: Array<{ support: string; type: string; duration: string; price: string }> };
        footerNote?: any[];
    };
}

const CATEGORIES = [
    { id: 'all', label: 'Tous les docs', icon: <FileText size={14} /> },
    { id: 'stages', label: 'Stages & Mineurs', icon: <GraduationCap size={14} /> },
    { id: 'club', label: 'Vie du Club', icon: <ShieldCheck size={14} /> },
    { id: 'competition', label: 'Compétition', icon: <Trophy size={14} /> },
    { id: 'tarifs', label: 'Tarifs', icon: <Clock size={14} /> },
];

const SECTIONS = [
    { id: 'contact', label: 'Contact' },
    { id: 'documents', label: 'Documents' },
    { id: 'map', label: 'Accès' },
    { id: 'pricing', label: 'Tarifs' },
    { id: 'planning', label: 'Plannings' },
];

const formatPrice = (price: string) => {
    if (!price) return '';
    const trimmed = price.trim();
    if (trimmed.includes('€') || trimmed.toLowerCase().includes('euro')) return trimmed;
    if (/^\d+([.,]\d+)?$/.test(trimmed)) return `${trimmed} €`;
    return trimmed;
};

// --- HELPERS TABLEAU ───────────────────────────────────────────────────────
type CourseRow = InfosData['pricing']['courses']['rows'][number];

const Th: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <th className={`px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 border-b border-slate-100 ${className}`}>
        {children}
    </th>
);
const Td: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <td className={`px-4 py-5 text-sm align-middle border-b border-slate-100 ${className}`}>
        {children}
    </td>
);

const TableShell: React.FC<{ children: React.ReactNode; icon: React.ReactNode; eyebrow: string; note?: string }> = ({ children, icon, eyebrow, note }) => (
    <div className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(252,250,246,0.92))] shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
        <div className="border-b border-slate-200/70 bg-[linear-gradient(135deg,rgba(250,248,244,0.98),rgba(255,255,255,0.98),rgba(247,247,245,0.95))] px-6 py-6 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-abysse shadow-[0_10px_30px_-24px_rgba(15,23,42,0.5)]">
                        {icon}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-slate-500">{eyebrow}</p>
                        {note && <p className="mt-2 max-w-2xl text-sm italic text-slate-600/90">{note}</p>}
                    </div>
                </div>
            </div>
        </div>
        {children}
    </div>
);

const groupCourseRows = (rows: CourseRow[]) => {
    const groups = new Map<string, CourseRow[]>();

    rows.forEach((row) => {
        const key = row.activity?.trim() || 'Activité';

        if (!groups.has(key)) {
            groups.set(key, []);
        }

        groups.get(key)?.push(row);
    });

    return Array.from(groups.entries()).map(([activity, items]) => ({ activity, items }));
};

// ── Onglet 1 : Stages ──────────────────────────────────────────────────────
const TableStages: React.FC<{ rows: InfosData['pricing']['stages']['rows']; note?: string }> = ({ rows, note }) => (
    <TableShell icon={<GraduationCap size={22} />} eyebrow="Stages nautiques" note={note}>
        <div className="px-4 pb-4 pt-2 md:px-6 md:pb-6">
            <div className="overflow-x-auto">
                <table className="min-w-full border-separate [border-spacing:0_12px]">
                    <thead>
                    <tr>
                            <Th className="border-0 pl-4 text-slate-300">Activité</Th>
                            <Th className="border-0 text-slate-300">Âges</Th>
                            <Th className="border-0 text-right text-slate-300">1ère semaine</Th>
                            <Th className="border-0 pr-4 text-right text-slate-300">2ème semaine&nbsp;(−5%)</Th>
                    </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} className="group">
                                <td className="rounded-l-[24px] border border-r-0 border-slate-100 bg-white px-5 py-5 align-middle shadow-[0_18px_40px_-36px_rgba(15,23,42,0.45)] transition-all group-hover:border-slate-200 group-hover:bg-[#faf7f1]">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-300">Stage</span>
                                        <span className="mt-2 text-base font-black uppercase tracking-[0.08em] text-abysse">
                                            {row.activity}
                                        </span>
                                    </div>
                                </td>
                                <td className="border border-r-0 border-l-0 border-slate-100 bg-white px-4 py-5 align-middle shadow-[0_18px_40px_-36px_rgba(15,23,42,0.45)] transition-all group-hover:border-slate-200 group-hover:bg-[#faf7f1]">
                                    <span className="font-medium text-slate-500">{row.ages}</span>
                                </td>
                                <td className="border border-r-0 border-l-0 border-slate-100 bg-white px-4 py-5 text-right align-middle shadow-[0_18px_40px_-36px_rgba(15,23,42,0.45)] transition-all group-hover:border-slate-200 group-hover:bg-[#faf7f1]">
                                    <span className="inline-flex rounded-2xl bg-[#f7f2ea] px-4 py-3 text-base font-black tabular-nums text-abysse">
                                        {formatPrice(row.price1)}
                                    </span>
                                </td>
                                <td className="rounded-r-[24px] border border-l-0 border-slate-100 bg-white px-5 py-5 text-right align-middle shadow-[0_18px_40px_-36px_rgba(15,23,42,0.45)] transition-all group-hover:border-slate-200 group-hover:bg-[#faf7f1]">
                                    <span className="inline-flex rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-black tabular-nums text-abysse shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                                        {formatPrice(row.price2)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </TableShell>
);

// ── Onglet 2 : Séances & Cours ─────────────────────────────────────────────
const TableCourses: React.FC<{ rows: InfosData['pricing']['courses']['rows'] }> = ({ rows }) => {
    const groupedRows = groupCourseRows(rows);

    return (
        <div className="grid gap-x-10 gap-y-12 xl:grid-cols-2">
            {groupedRows.map((group) => (
                <section key={group.activity} className="min-w-0">
                    <div className="mb-6 flex items-center gap-4">
                        <h3 className="shrink-0 text-[2rem] font-black uppercase italic tracking-[0.01em] text-abysse md:text-[2.3rem]">
                            {group.activity}
                        </h3>
                        <div className="h-2 flex-1 rounded-full bg-[linear-gradient(90deg,rgba(203,213,225,0.85),rgba(226,232,240,0.85),rgba(241,245,249,0.25))]" />
                    </div>

                    <div className="space-y-2.5">
                        {group.items.map((row, index) => {
                            const highlighted = group.items.length > 1 && index === 0;

                            return (
                                <div
                                    key={`${group.activity}-${row.duration}-${row.price}-${index}`}
                                    className={`grid gap-x-4 gap-y-2 px-3 py-2 md:grid-cols-[92px_minmax(0,1fr)_auto] md:items-center ${
                                        highlighted ? 'rounded-xl bg-[#f7f3ec]' : ''
                                    }`}
                                >
                                    <span className={`text-[10px] font-black uppercase tracking-[0.22em] whitespace-nowrap ${highlighted ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {row.duration || 'Tarif'}
                                    </span>
                                    <span className="min-w-0 text-[11px] italic leading-relaxed text-slate-600 md:pr-4">
                                        {row.details || ' '}
                                    </span>
                                    <span className="whitespace-nowrap text-left text-[1.05rem] font-black tabular-nums text-abysse md:text-right">
                                        {formatPrice(row.price)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
};

// ── Onglet 3 : Locations ───────────────────────────────────────────────────
const TableLocations: React.FC<{ rows: InfosData['pricing']['locations']['rows'] }> = ({ rows }) => (
    <TableShell icon={<Clock size={22} />} eyebrow="Locations & supports">
        <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
                <thead className="bg-white">
                    <tr>
                        <Th className="pl-6 md:pl-8">Support</Th>
                        <Th>Type</Th>
                        <Th>Durée</Th>
                        <Th className="pr-6 text-right md:pr-8">Tarif</Th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="transition-colors hover:bg-slate-50/80">
                            <Td className="pl-6 md:pl-8"><span className="font-black text-abysse">{row.support}</span></Td>
                            <Td><span className="font-medium text-slate-500">{row.type}</span></Td>
                            <Td><span className="font-medium text-slate-500">{row.duration}</span></Td>
                            <Td className="pr-6 text-right font-black tabular-nums text-abysse md:pr-8">{formatPrice(row.price)}</Td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </TableShell>
);

// --- COMPONENT: PRICING WIDGET ---
type TabKey = 'stages' | 'courses' | 'locations';

const PricingWidget: React.FC<{ data?: InfosData['pricing'] }> = ({ data }) => {
    const [activeTab, setActiveTab] = useState<TabKey>('stages');

    const tabs: { key: TabKey; label: string }[] = [
        { key: 'stages',    label: data?.stages?.label    || 'Stages nautiques' },
        { key: 'courses',   label: data?.courses?.label   || 'Séances & Cours' },
        { key: 'locations', label: data?.locations?.label || 'Locations' },
    ];

    return (
        <section id="pricing" className="border-t border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(252,249,244,0.86))] py-18">
            <div className="max-w-[1400px] mx-auto px-6 w-full">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-xl">
                        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-turquoise">{data?.eyebrow || 'Informations tarifaires'}</span>
                        <h2 className="text-4xl leading-[0.9] text-abysse md:text-6xl">{data?.title || 'Tarifs & Formules'}</h2>
                    </div>
                    {data?.pdfUrl && (
                        <a
                            href={data.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl hover:bg-turquoise transition-all group shadow-xl"
                        >
                            <FileText size={20} className="text-turquoise group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Voir PDF Complet</span>
                        </a>
                    )}
                </div>

                {/* NAVIGATION */}
                <div className="mb-10 flex w-fit flex-wrap gap-2 rounded-[1.4rem] border border-slate-200/80 bg-white/85 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                                activeTab === tab.key
                                    ? 'scale-[1.02] bg-abysse text-white shadow-[0_18px_35px_-24px_rgba(15,23,42,0.8)]'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-abysse'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* CONTENU */}
                <div className="animate-in fade-in duration-500">
                    {activeTab === 'stages' && (
                        <TableStages rows={data?.stages?.rows ?? []} note={data?.stages?.note} />
                    )}
                    {activeTab === 'courses' && (
                        <TableCourses rows={data?.courses?.rows ?? []} />
                    )}
                    {activeTab === 'locations' && (
                        <TableLocations rows={data?.locations?.rows ?? []} />
                    )}
                </div>

                {/* NOTES DE BAS DE PAGE */}
                {data?.footerNote && (
                    <div className="mt-12 p-8 md:p-12 bg-white/40 backdrop-blur-md rounded-3xl border border-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-turquoise/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-turquoise/10 transition-colors duration-1000"></div>
                        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                            <div className="size-10 bg-turquoise/10 rounded-xl flex items-center justify-center text-turquoise shrink-0">
                                <Clock size={20} />
                            </div>
                            <div className="prose prose-slate prose-sm max-w-none font-medium leading-relaxed text-abysse/60 italic">
                                <PortableText value={data.footerNote} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

// --- COMPONENT: DOCUMENT MANAGER ---
const DocumentManager: React.FC<{ documents?: InfosData['documents'] }> = ({ documents }) => {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const safeDocs = documents || [];

    const filteredDocs = safeDocs.filter(doc => {
        const matchesSearch = (doc.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (doc.description?.toLowerCase() || "").includes(search.toLowerCase());
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

                <div className="flex flex-wrap items-center gap-1 mb-10 p-1 bg-slate-100/50 backdrop-blur-sm rounded-xl w-fit">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                                activeTab === cat.id
                                    ? "bg-white text-abysse shadow-sm scale-[1.02]"
                                    : "text-slate-400 hover:text-abysse hover:bg-white/50"
                            }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {filteredDocs.length > 0 ? (
                        filteredDocs.map((doc, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between hover:-translate-y-1">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-abysse group-hover:bg-turquoise group-hover:text-white transition-colors duration-500">
                                            <FileText size={24} />
                                        </div>
                                        <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase font-mono">
                                            DOC
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
                                    target="_blank"
                                    rel="noopener noreferrer"
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
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');
        
        const formData = new FormData(e.currentTarget);
        const result = await sendContactEmail(formData);
        
        if (result.error) {
            setStatus('error');
            setErrorMessage(result.error);
        } else {
            setStatus('success');
            (e.target as HTMLFormElement).reset();
        }
    };

    return (
        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-turquoise opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

            <h2 className="text-3xl text-abysse mb-8 flex items-center gap-4">
                <span className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center text-turquoise shadow-inner"><Mail size={24} /></span>
                Écrivez-nous
            </h2>

            {status === 'success' ? (
                <div className="bg-slate-50 text-abysse p-8 rounded-3xl text-center border border-slate-100 flex flex-col items-center justify-center h-64 animate-in zoom-in duration-300">
                    <CheckCircle2 size={48} className="mb-4 text-turquoise" />
                    <h3 className="text-xl font-bold mb-2">Message Envoyé !</h3>
                    <p className="text-sm font-medium text-slate-500">Nous vous répondrons dans les plus brefs délais.</p>
                    <button 
                        type="button"
                        onClick={() => setStatus('idle')}
                        className="mt-6 text-xs font-black uppercase tracking-widest text-turquoise hover:text-abysse transition-colors cursor-pointer"
                    >
                        Envoyer un autre message
                    </button>
                </div>
            ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {status === 'error' && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                            {errorMessage || "Une erreur est survenue lors de l'envoi."}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nom Complet</label>
                            <input type="text" id="name" name="name" required placeholder="Jean Dupont" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email</label>
                            <input type="email" id="email" name="email" required placeholder="jean@exemple.fr" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise transition-all" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="subject" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sujet</label>
                        <select id="subject" name="subject" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise transition-all appearance-none cursor-pointer">
                            <option value="Information générale">Information générale</option>
                            <option value="Inscription Stage">Inscription Stage</option>
                            <option value="Adhésion Club">Adhésion Club</option>
                            <option value="Régate / Compétition">Régate / Compétition</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={4}
                            required
                            placeholder="Votre demande..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise transition-all resize-none"
                        ></textarea>
                    </div>

                    <button 
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-abysse hover:bg-turquoise text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center gap-2">Envoi en cours <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></span>
                        ) : (
                            <>Envoyer <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
};

export default function InfosClient({ initialData }: { initialData?: InfosData }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        let map: any = null;
        const initMap = async () => {
            if (!mapRef.current || mapInstance.current) return;
            const L = (await import('leaflet')).default;
            if (!mapRef.current || mapInstance.current) return;
            // @ts-ignore
            await import('leaflet/dist/leaflet.css');
            if (!mapRef.current || mapInstance.current) return;

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
            <section className="pt-32 pb-16 px-6 bg-abysse text-white overflow-hidden relative">
                <div className="absolute -top-24 -right-24 size-96 bg-turquoise/10 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-24 -left-24 size-96 bg-blue-500/10 rounded-full blur-[120px]"></div>

                <div className="max-w-[1400px] mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-turquoise mb-8">
                        <Compass size={14} />
                        <span>Pratique & Contact</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl text-white leading-[0.85] mb-8">
                        {initialData?.heroTitle || "L'Escale Logistique."}
                    </h1>
                    <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
                        {initialData?.heroSubtitle || "Besoin d'un renseignement, d'un document ou de nous trouver sur la côte ?"}
                    </p>
                </div>
            </section>

            <SecondaryNav sections={SECTIONS} />

            <section id="contact" className="py-24 px-6 bg-white">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        <div className="lg:col-span-1 space-y-8 flex flex-col">
                            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm flex-1">
                                <MapPin size={32} className="text-turquoise mb-8" />
                                <h3 className="text-2xl text-abysse mb-4">Où nous trouver ?</h3>
                                <p className="text-slate-500 font-bold leading-relaxed whitespace-pre-line">
                                    {initialData?.address || "104 rue des Dunes\n50230 Agon-Coutainville"}
                                </p>
                            </div>
                            <div className="bg-abysse p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex-1">
                                <h3 className="text-2xl mb-8">Contact Direct</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Phone size={20} className="text-turquoise" />
                                        <span className="text-xl font-bold">{initialData?.phone || "02 33 47 14 81"}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Mail size={20} className="text-turquoise" />
                                        <span className="text-sm font-bold uppercase tracking-tighter">{initialData?.email || "contact@cncoutainville.fr"}</span>
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

            <DocumentManager documents={initialData?.documents} />

            <section id="map" className="py-24 px-6 bg-white">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative z-0 isolate order-2 h-[500px] w-full overflow-hidden rounded-[4rem] border border-slate-100 shadow-2xl lg:order-1">
                            <div className="absolute left-10 top-10 z-10 rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 shadow-2xl backdrop-blur-md">
                                <span className="text-sm font-black text-abysse uppercase italic">Club Nautique Coutainville</span>
                            </div>
                            <div ref={mapRef} className="relative z-0 h-full w-full"></div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-4xl md:text-6xl text-abysse leading-none mb-8">Situé au Sud de la Digue.</h2>
                            <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10">le Club Nautique de Coutainville bénéficie d’un emplacement privilégié en bord de plage, entre dunes préservées et large baie propice aux sports de glisse.</p>
                            <a href="https://www.google.com/maps/dir/?api=1&destination=49.030384,-1.595904" target="_blank" className="px-10 py-5 bg-abysse text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-turquoise transition-all shadow-xl w-fit">Calculer mon itinéraire <ExternalLink size={18} /></a>
                        </div>
                    </div>
                </div>
            </section>

            <PricingWidget data={initialData?.pricing} />

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
}

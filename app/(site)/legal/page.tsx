"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Cookie, ChevronLeft, Building2, UserCircle, Server, FileText } from 'lucide-react';
import Link from 'next/link';

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-abysse font-black uppercase tracking-widest text-[10px] mb-12 hover:text-turquoise transition-colors"
                >
                    <ChevronLeft size={16} /> Retour à l'accueil
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-slate-200"
                >
                    <div className="flex items-center gap-4 mb-12">
                        <div className="size-14 bg-abysse text-turquoise rounded-2xl flex items-center justify-center shadow-lg">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl text-abysse leading-none">
                            Mentions <span className="text-turquoise">Légales.</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                        {/* EDITEUR */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Building2 size={20} className="text-turquoise" />
                                <h2 className="text-xl font-black text-abysse uppercase tracking-tight">Éditeur</h2>
                            </div>
                            <div className="text-slate-600 font-medium space-y-1">
                                <p className="text-abysse font-black">Club Nautique de Coutainville (CNC)</p>
                                <p>104 rue des Dunes</p>
                                <p>50230 Agon-Coutainville</p>
                                <p>France</p>
                                <div className="pt-2 text-sm">
                                    <p>Tél : 02 33 47 14 81</p>
                                    <p>Email : contact@cncoutainville.fr</p>
                                </div>
                            </div>
                        </div>

                        {/* PUBLICATION */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <UserCircle size={20} className="text-turquoise" />
                                <h2 className="text-xl font-black text-abysse uppercase tracking-tight">Publication</h2>
                            </div>
                            <div className="text-slate-600 font-medium">
                                <p className="mb-2 italic">Directeur de la publication :</p>
                                <p className="text-abysse font-black">Monsieur le Président</p>
                                <p>Club Nautique de Coutainville</p>
                            </div>
                        </div>

                        {/* HEBERGEMENT */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Server size={20} className="text-turquoise" />
                                <h2 className="text-xl font-black text-abysse uppercase tracking-tight">Hébergement</h2>
                            </div>
                            <div className="text-slate-600 font-medium">
                                <p className="text-abysse font-black">Vercel Inc.</p>
                                <p>340 S Lemon Ave #1150</p>
                                <p>Walnut, CA 91789</p>
                                <p>USA</p>
                                <p className="pt-2 text-xs text-slate-400 font-bold uppercase tracking-widest hover:text-turquoise transition-colors">
                                    <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">https://vercel.com</a>
                                </p>
                            </div>
                        </div>

                        {/* PROPRIETE */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <FileText size={20} className="text-turquoise" />
                                <h2 className="text-xl font-black text-abysse uppercase tracking-tight">Propriété</h2>
                            </div>
                            <div className="text-slate-600 font-medium text-sm leading-relaxed">
                                <p>
                                    L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-16 mt-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-10 bg-slate-50 text-abysse rounded-xl flex items-center justify-center">
                                <Lock size={20} />
                            </div>
                            <h2 className="text-2xl text-abysse">Confidentialité & Cookies</h2>
                        </div>

                        <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
                            <section>
                                <p>
                                    Au **Club Nautique de Coutainville**, nous respectons votre vie privée. Ce site est conçu pour être minimaliste dans sa collecte de données.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Cookie size={18} className="text-turquoise" />
                                    <h3 className="text-lg text-abysse font-bold">Usage technique des cookies</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <strong className="text-abysse uppercase text-[10px] tracking-wider block mb-2">Sanity (CMS)</strong>
                                        <p className="text-xs">Assure la diffusion du contenu dynamique. Aucun tracking personnel.</p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <strong className="text-abysse uppercase text-[10px] tracking-wider block mb-2">LocalStorage</strong>
                                        <p className="text-xs">Utilisé uniquement pour les préférences de l'espace administration.</p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <strong className="text-abysse uppercase text-[10px] tracking-wider block mb-2">SessionStorage</strong>
                                        <p className="text-xs">Mise en cache temporaire des données météo et horaires de marées.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Eye size={18} className="text-turquoise" />
                                    <h3 className="text-lg text-abysse font-bold">Vos Droits (RGPD)</h3>
                                </div>
                                <p>
                                    Ce site ne collecte aucune donnée personnelle identifiable ou de tracking publicitaire.
                                    Pour toute question relative à vos données, vous pouvez nous contacter directement au club.
                                </p>
                            </section>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Club Nautique de Coutainville - {new Date().getFullYear()}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

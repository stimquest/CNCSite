"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Cookie, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-abysse font-black uppercase tracking-widest text-[10px] mb-12 hover:text-turquoise transition-colors"
                >
                    <ChevronLeft size={16} /> Retour à l'accueil
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-slate-200"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-14 bg-abysse text-turquoise rounded-2xl flex items-center justify-center shadow-lg">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl text-abysse leading-none">
                            Données & <span className="text-turquoise">Confidentialité.</span>
                        </h1>
                    </div>

                    <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
                        {/* SECTION 1 */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Lock size={18} className="text-turquoise" />
                                <h2 className="text-lg text-abysse">Transparence Totale</h2>
                            </div>
                            <p>
                                Au **Club de Voile de Coutainville**, nous respectons votre vie privée comme nous respectons la mer. Nous n'utilisons que le strict nécessaire pour faire fonctionner notre service et vous informer en temps réel via **La Vigie**.
                            </p>
                        </section>

                        {/* SECTION 2 */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Cookie size={18} className="text-turquoise" />
                                <h2 className="text-lg text-abysse">Usage des Cookies</h2>
                            </div>
                            <ul className="space-y-4 list-disc pl-5">
                                <li>
                                    <strong className="text-abysse uppercase text-[11px] tracking-wider">OneSignal (Alertes) :</strong> Utilisé pour gérer votre abonnement aux notifications push. Sans ce cookie, nous ne pouvons pas vous envoyer les alertes de votre groupe.
                                </li>
                                <li>
                                    <strong className="text-abysse uppercase text-[11px] tracking-wider">Sanity (Contenu) :</strong> Permet d'assurer la cohérence du contenu dynamique affiché sur le site.
                                </li>
                                <li>
                                    <strong className="text-abysse uppercase text-[11px] tracking-wider">LocalStorage (Admin) :</strong> Uniquement si vous accédez à l'espace administration du club.
                                </li>
                            </ul>
                        </section>

                        {/* SECTION 3 */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Eye size={18} className="text-turquoise" />
                                <h2 className="text-lg text-abysse">Vos Droits</h2>
                            </div>
                            <p>
                                Conformément au **RGPD**, vous pouvez à tout moment refuser ou supprimer vos abonnements aux notifications directement dans les réglages de votre navigateur ou via la page **La Vigie**.
                                Pour toute question, contactez-nous au club !
                            </p>
                        </section>
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Club de Voile de Coutainville - {new Date().getFullYear()}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

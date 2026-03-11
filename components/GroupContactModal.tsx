"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Waves, Calendar, Users, MapPin, Mail, Phone, User, CalendarDays, Clock, FileText } from 'lucide-react';
import { sendGroupEmail } from '@/app/actions/groupContact';
import { useLenis } from '@/components/SmoothScroll';

interface GroupContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultActivity?: string;
    category?: 'private' | 'school';
}

export const GroupContactModal: React.FC<GroupContactModalProps> = ({ 
    isOpen, 
    onClose,
    defaultActivity = "",
    category = "private"
}) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const { start, stop } = useLenis();

    // Dynamically set theme colors based on the category
    const theme = {
        bg: category === 'school' ? 'bg-sable' : 'bg-abysse',
        text: category === 'school' ? 'text-sable' : 'text-abysse',
        accentBg: category === 'school' ? 'bg-[#D2B48C]' : 'bg-turquoise', // Slightly darker sable for accents
        accentText: category === 'school' ? 'text-[#D2B48C]' : 'text-turquoise',
        hoverBg: category === 'school' ? 'hover:bg-[#D2B48C]' : 'hover:bg-turquoise',
        focusRing: category === 'school' ? 'focus:ring-[#D2B48C]/20' : 'focus:ring-turquoise/20',
        focusBorder: category === 'school' ? 'focus:border-[#D2B48C]' : 'focus:border-turquoise',
        title: category === 'school' ? 'Projet Scolaire' : 'Réservation',
        icon: category === 'school' ? <Users size={24} /> : <Waves size={24} />
    };

    React.useEffect(() => {
        if (isOpen) {
            stop();
            // Prevent body scroll for non-lenis environments as a fallback
            document.body.style.overflow = 'hidden';
        } else {
            start();
            document.body.style.overflow = '';
        }

        return () => {
            start();
            document.body.style.overflow = '';
        };
    }, [isOpen, start, stop]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');
        
        const formData = new FormData(e.currentTarget);
        const result = await sendGroupEmail(formData);
        
        if (result.error) {
            setStatus('error');
            setErrorMessage(result.error);
        } else {
            setStatus('success');
            // Do not reset right away so the user sees the success message
        }
    };

    const handleClose = () => {
        if (status === 'success') {
            setTimeout(() => setStatus('idle'), 300); // reset after closing animation
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-abysse/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto"
                    >
                        {/* Modal */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl relative overflow-hidden my-auto flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className={`${theme.bg} p-8 md:p-10 text-white relative shrink-0 overflow-hidden`}>
                                <div className={`absolute top-0 right-0 w-64 h-64 ${theme.accentBg} opacity-20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2`}></div>
                                
                                <button 
                                    onClick={handleClose}
                                    className="absolute top-6 right-6 size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                                
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`size-12 rounded-2xl bg-white/10 flex items-center justify-center ${theme.accentText} backdrop-blur-md`}>
                                        {theme.icon}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accentText}`}>Formulaire de Demande</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl leading-none">Demande de <span className={`${theme.accentText} italic`}>{theme.title}.</span></h2>
                            </div>

                            {/* Body (Scrollable) */}
                            <div data-lenis-prevent="true" className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1">
                                {status === 'success' ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in zoom-in duration-500">
                                        <div className={`size-24 ${theme.accentBg} opacity-10 rounded-full absolute flex items-center justify-center mb-6`}></div>
                                        <CheckCircle2 size={48} className={`${theme.accentText} relative mb-6`} />
                                        
                                        <h3 className={`text-3xl ${theme.text} mb-4`}>Demande Envoyée !</h3>
                                        <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                                            Merci pour votre demande. Notre équipe va l'étudier et vous recontactera dans les plus brefs délais pour confirmer les disponibilités.
                                        </p>
                                        <button 
                                            onClick={handleClose}
                                            className={`${theme.bg} text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] ${theme.hoverBg} transition-colors`}
                                        >
                                            Fermer la fenêtre
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-10">
                                        {status === 'error' && (
                                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
                                                <X size={18} className="shrink-0" />
                                                <p>{errorMessage}</p>
                                            </div>
                                        )}
                                        
                                        {/* SECTION 1: ACTIVITÉ & DATES */}
                                        <div>
                                            <h3 className={`text-base font-black ${theme.text} uppercase tracking-widest mb-6 border-b border-slate-100 pb-4 flex items-center gap-2`}>
                                                <CalendarDays size={18} className={theme.accentText} /> 1. L'Activité
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2 md:col-span-2">
                                                    <label htmlFor="activity" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Activité souhaitée <span className={theme.accentText}>*</span></label>
                                                    <select id="activity" name="activity" required defaultValue={defaultActivity} className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all cursor-pointer`}>
                                                        <option value="" disabled>Sélectionnez une activité</option>
                                                        <option value="Scolaire / Centre de Loisirs (ACM)">Scolaire / Centre de Loisirs (ACM)</option>
                                                        <option value="Char à voile">Char à voile (Séance 2h)</option>
                                                        <option value="Catamaran">Catamaran (Stage ou Séance)</option>
                                                        <option value="Planche à voile / Wing">Planche à voile / Wingfoil</option>
                                                        <option value="Marche aquatique">Marche aquatique</option>
                                                        <option value="Séminaire Entreprise">Séminaire / Teambuilding (Entreprise)</option>
                                                        <option value="Événement Privé (EVG/EVJF...)">Événement Privé (EVG/EVJF, Anniversaire...)</option>
                                                        <option value="Autre">Autre activité nautique</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label htmlFor="date" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2"><Calendar size={12} /> Date souhaitée</label>
                                                    <input type="text" id="date" name="date" placeholder="JJ/MM/AAAA ou Période" className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all`} />
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label htmlFor="time" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2"><Clock size={12} /> Horaire souhaité</label>
                                                        <input type="text" id="time" name="time" placeholder="Matin, Après-midi, ou Heure précise" className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all`} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label htmlFor="level" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2"><Waves size={12} /> Niveau Pratiquant(s)</label>
                                                        <input type="text" id="level" name="level" placeholder="Débutant, Initié, ou Autonome" className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 2: PARTICIPANTS */}
                                        <div>
                                            <h3 className={`text-base font-black ${theme.text} uppercase tracking-widest mb-6 border-b border-slate-100 pb-4 flex items-center gap-2`}>
                                                <Users size={18} className={theme.accentText} /> 2. Participants
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label htmlFor="adults" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nombre d'adultes / Professeurs</label>
                                                    <input type="number" id="adults" name="adults" min="0" placeholder="0" className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all`} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="children" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nombre d'enfants / Élèves</label>
                                                    <input type="number" id="children" name="children" min="0" placeholder="0" className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all`} />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <label htmlFor="childrenAges" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Classe (si scolaire) ou Précisez l'âge (ACM)</label>
                                                    <input type="text" id="childrenAges" name="childrenAges" placeholder="Ex: CE2/CM1, ou 8 ans, 12 ans..." className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all`} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 3: VOS COORDONNÉES */}
                                        <div>
                                            <h3 className={`text-base font-black ${theme.text} uppercase tracking-widest mb-6 border-b border-slate-100 pb-4 flex items-center gap-2`}>
                                                <User size={18} className={theme.accentText} /> 3. Vos Coordonnées
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className={`space-y-2 ${theme.text}`}>
                                                    <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">École / Structure / Nom <span className={theme.accentText}>*</span></label>
                                                    <input type="text" id="name" name="name" required placeholder="École Victor Hugo / Dupont" className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all`} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="firstName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Prénom du responsable <span className={theme.accentText}>*</span></label>
                                                    <input type="text" id="firstName" name="firstName" required placeholder="Jean" className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all`} />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2"><Mail size={12}/> E-mail <span className={theme.accentText}>*</span></label>
                                                    <input type="email" id="email" name="email" required placeholder="jean.dupont@exemple.fr" className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all`} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2"><Phone size={12}/> Téléphone</label>
                                                    <input type="tel" id="phone" name="phone" placeholder="06 12 34 56 78" className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all`} />
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <label htmlFor="address" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2"><MapPin size={12}/> Adresse Postale (Code Postal, Commune)</label>
                                                    <input type="text" id="address" name="address" placeholder="104 rue des Dunes, 50230 Agon-Coutainville" className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all`} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 4: PRÉCISIONS */}
                                        <div>
                                            <h3 className={`text-base font-black ${theme.text} uppercase tracking-widest mb-6 border-b border-slate-100 pb-4 flex items-center gap-2`}>
                                                <FileText size={18} className={theme.accentText} /> 4. Précisions
                                            </h3>
                                            <div className="space-y-2">
                                                <label htmlFor="message" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Précisez votre projet (Cycle, compétences visées, accompagnants, etc.)</label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    rows={4}
                                                    placeholder="Laissez-nous un message précis pour préparer votre projet pédagogique..."
                                                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all resize-none`}
                                                ></textarea>
                                            </div>
                                        </div>

                                        {/* Submit & Footer */}
                                        <div className="pt-6 border-t border-slate-100">
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                                <p className="text-[10px] font-bold text-slate-400">
                                                    Les champs marqués d'un <span className={theme.accentText}>*</span> sont obligatoires.
                                                </p>
                                                <button 
                                                    type="submit"
                                                    disabled={status === 'loading'}
                                                    className={`w-full md:w-auto ${theme.bg} ${theme.hoverBg} text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer`}
                                                >
                                                    {status === 'loading' ? (
                                                        <span className="flex items-center gap-2">Envoi en cours <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></span>
                                                    ) : (
                                                        <>Envoyer la Demande <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-[9px] text-center text-slate-400 mt-6 font-medium">Notre Politique de confidentialité s'applique. Vos données ne sont utilisées que dans le cadre de cette réservation.</p>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

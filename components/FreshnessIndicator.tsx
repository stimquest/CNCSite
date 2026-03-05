"use client";

import React from 'react';
import { formatDistanceToNow, differenceInHours } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FreshnessIndicatorProps {
    lastPublishedAt: string | null;
    showBanner?: boolean;
}

export const FreshnessIndicator: React.FC<FreshnessIndicatorProps> = ({
    lastPublishedAt,
    showBanner = true,
}) => {
    if (!lastPublishedAt) {
        return showBanner ? (
            <p className="text-[10px] text-slate-400 font-medium text-center py-1">
                Informations non encore publiées aujourd'hui.
            </p>
        ) : null;
    }

    const date = new Date(lastPublishedAt);
    const hoursAgo = differenceInHours(new Date(), date);
    const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const relativeTime = formatDistanceToNow(date, { addSuffix: true, locale: fr });

    // Frais < 4h — discret
    if (hoursAgo < 4) {
        return (
            <p className="text-[10px] text-slate-400 font-medium">
                Vérifié à {formattedTime} <span className="text-slate-300">· {relativeTime}</span>
            </p>
        );
    }

    // Vieilli 4-12h — avertissement visible
    if (hoursAgo < 12) {
        return (
            <div className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${showBanner
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'text-amber-600'
                }`}>
                Données non actualisées depuis {hoursAgo}h
                {showBanner && (
                    <span className="block font-medium normal-case tracking-normal mt-0.5 text-amber-600/80">
                        Dernière mise à jour : {formattedDate} à {formattedTime}
                    </span>
                )}
            </div>
        );
    }

    // Très vieux > 12h — alerte
    return (
        <div className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest ${showBanner
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'text-rose-600'
            }`}>
            Informations non confirmées pour aujourd'hui
            {showBanner && (
                <span className="block font-medium normal-case tracking-normal mt-0.5 text-rose-600/80">
                    Dernière mise à jour : {formattedDate} à {formattedTime}. Appelez le club avant de vous déplacer.
                </span>
            )}
        </div>
    );
};

export default FreshnessIndicator;

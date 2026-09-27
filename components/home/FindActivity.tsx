'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Sailboat, Users, Wind } from 'lucide-react';

type SchoolStage = {
  id?: string;
  officialName?: string;
  age?: string;
  price?: string;
  image?: string;
  bgColor?: string;
  hook?: string;
  showOnHome?: boolean;
};

// Tranches proposées au visiteur : un stage apparaît dans toutes les tranches qu'il recouvre.
const AGE_RANGES = [
  { label: '5-7 ans', min: 5, max: 7 },
  { label: '8-11 ans', min: 8, max: 11 },
  { label: '12-15 ans', min: 12, max: 15 },
  { label: '16 ans et +', min: 16, max: 99 },
];

// "5-7 ans" → [5,7] · "Dès 8 ans" / "14 ans et +" / "16+" → [n,99]
const parseAges = (age?: string): [number, number] | null => {
  const nums = (age || '').match(/\d+/g)?.map(Number) || [];
  if (nums.length === 0) return null;
  return nums.length === 1 ? [nums[0], 99] : [nums[0], nums[1]];
};

const SHORTCUTS = [
  {
    icon: Sailboat,
    title: 'Activités à la séance',
    text: 'Glisse, voile, paddle, kayak, marche aquatique…',
    href: '/activites?format=seance',
    links: [
      { label: 'Glisse', href: '/activites?format=seance&cat=Sensations' },
      { label: 'Voile', href: '/activites?format=seance&cat=Voile' },
      { label: 'Nature', href: '/activites?format=seance&cat=Bien-être' },
    ],
  },
  {
    icon: GraduationCap,
    title: "École à l'année",
    text: 'Chaque semaine, d’octobre à juin.',
    href: '/ecole-voile#ecole-annee',
  },
  {
    icon: Users,
    title: 'Groupes & entreprises',
    text: 'Scolaires, centres de loisirs, séminaires.',
    href: '/groupes-entreprises',
  },
];

export default function FindActivity({ stages: allStages, children }: { stages: SchoolStage[]; children?: React.ReactNode }) {
  // Seuls les stages mis en avant dans l'admin (interrupteur "Sur l'accueil")
  const stages = useMemo(() => allStages.filter((stage) => stage.showOnHome !== false), [allStages]);
  const hiddenCount = allStages.length - stages.length;
  const [range, setRange] = useState<number | null>(null);

  const visibleStages = useMemo(() => {
    if (range === null) return stages;
    const { min, max } = AGE_RANGES[range];
    return stages.filter((stage) => {
      const ages = parseAges(stage.age);
      return !ages || (ages[0] <= max && ages[1] >= min);
    });
  }, [stages, range]);

  return (
    <section id="trouver" className="scroll-mt-20 py-14 md:py-20 bg-slate-50 relative z-10">
      <div className="max-w-400 mx-auto px-5 md:px-6">
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-2 rounded-full bg-orange-500"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Je cherche un stage ou une activité</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-abysse uppercase tracking-tighter italic leading-tight">Trouver mon activité</h2>
        </div>

        {/* STAGES VACANCES : d'abord l'âge, puis les stages correspondants */}
        <div className="rounded-3xl bg-white border border-abysse/10 shadow-sm p-5 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-6">
            <div>
              <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tight text-abysse">Stages vacances</h3>
              <p className="mt-1 text-sm text-slate-500">5 jours sur l’eau, encadrés par les moniteurs du club.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:pt-2">
              <Link href="/ecole-voile#planning" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-turquoise hover:underline">
                Voir les dates <ArrowRight size={13} />
              </Link>
              {hiddenCount > 0 && (
                <Link href="/ecole-voile#stages-vacances" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-turquoise hover:underline">
                  Toute l’offre de l’année <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>

          <div className="mt-5 md:mt-6 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl bg-slate-50 p-3 md:p-4">
            <span className="shrink-0 pl-1 text-[10px] font-black uppercase tracking-[0.2em] text-abysse">Pour quel âge ?</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par âge">
              <button type="button" onClick={() => setRange(null)} aria-pressed={range === null} className={`min-h-10 px-4 rounded-full text-[11px] font-black uppercase tracking-wider transition-colors ${range === null ? 'bg-abysse text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:border-turquoise hover:text-turquoise'}`}>
                Tous
              </button>
              {AGE_RANGES.map((r, i) => (
                <button key={r.label} type="button" onClick={() => setRange(i)} aria-pressed={range === i} className={`min-h-10 px-4 rounded-full text-[11px] font-black uppercase tracking-wider transition-colors ${range === i ? 'bg-abysse text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:border-turquoise hover:text-turquoise'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* La grille est remontée à chaque filtre pour un court fondu */}
          <div key={range ?? 'all'} className="mt-5 md:mt-6 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 fade-in-soft">
            {visibleStages.map((stage, i) => (
              <Link
                key={stage.id || i}
                href={`/ecole-voile${stage.id ? `?stage=${encodeURIComponent(stage.id)}` : ''}#stages-vacances`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquoise"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-abysse">
                  {stage.image && <img src={`${stage.image}?w=600&h=450&fit=crop`} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />}
                  <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow ${stage.bgColor || 'bg-turquoise'}`}>{stage.age}</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-base font-black uppercase italic leading-tight tracking-tight text-abysse">{stage.officialName}</span>
                  {stage.hook && <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">{stage.hook}</p>}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    {stage.price ? <span className="text-sm font-black text-abysse">{stage.price}</span> : <span />}
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-turquoise">
                      Voir le stage <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {visibleStages.length === 0 && (
            <p className="mt-5 rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
              Pas de stage pour cet âge aux prochaines vacances.{" "}
              <Link href="/ecole-voile#stages-vacances" className="font-bold text-turquoise hover:underline">Voir toute l’offre de l’année</Link>
            </p>
          )}
        </div>

        {/* AUTRES BESOINS : le char à voile en grand, puis les raccourcis */}
        <div id="autres-activites" className="scroll-mt-24 mt-4 md:mt-5 grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <Link
            href="/activites/char-a-voile"
            className="group relative min-h-80 lg:row-span-3 lg:col-span-2 overflow-hidden rounded-3xl bg-abysse shadow-lg transition hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquoise"
          >
            <img src="/images/imgBank/charSpeed.jpg" alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-linear-to-t from-abysse via-abysse/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-abysse/45 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur">
                <Wind size={12} /> À la séance · dès 8 ans
              </span>
              <h3 className="mt-3 text-3xl md:text-5xl font-black uppercase italic leading-none tracking-tighter text-white">Char à voile</h3>
              <p className="mt-3 max-w-lg text-sm md:text-base leading-relaxed text-white/80">
                La glisse sur le sable de Coutainville. Les séances suivent les marées : consultez les prochains créneaux et réservez votre place.
              </p>
              <span className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-md transition group-hover:bg-orange-600">
                Voir les séances et réserver <ArrowRight size={13} />
              </span>
            </div>
          </Link>

          {SHORTCUTS.map(({ icon: Icon, title, text, href, links }) => (
            <div key={title} className="group relative flex items-start gap-4 rounded-3xl border border-abysse/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-turquoise/10 text-turquoise"><Icon size={20} /></div>
              <div className="min-w-0 flex-1">
                <Link href={href} className="text-base font-black uppercase italic tracking-tight text-abysse after:absolute after:inset-0 after:content-['']">
                  {title}
                </Link>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{text}</p>
                {links && (
                  <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
                    {links.map((l) => (
                      <Link key={l.label} href={l.href} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:bg-turquoise hover:text-white">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <ArrowRight size={16} className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-turquoise" />
            </div>
          ))}
        </div>

        {children}
      </div>
    </section>
  );
}

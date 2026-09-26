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

        {/* STAGES VACANCES : filtre par âge */}
        <div className="rounded-3xl bg-white border border-abysse/10 shadow-sm p-5 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg md:text-2xl font-black uppercase italic tracking-tight text-abysse">Stages vacances · 5 jours</h3>
              <p className="mt-1 text-sm text-slate-500">Pâques, été, Toussaint. Choisissez un âge pour voir les stages adaptés.</p>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par âge">
              <button
                type="button"
                onClick={() => setRange(null)}
                aria-pressed={range === null}
                className={`min-h-10 px-4 rounded-full text-[11px] font-black uppercase tracking-wider transition ${range === null ? 'bg-abysse text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                Tous
              </button>
              {AGE_RANGES.map((r, i) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setRange(i)}
                  aria-pressed={range === i}
                  className={`min-h-10 px-4 rounded-full text-[11px] font-black uppercase tracking-wider transition ${range === i ? 'bg-abysse text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {visibleStages.map((stage, i) => (
              <Link
                key={stage.id || i}
                href={`/ecole-voile${stage.id ? `?stage=${encodeURIComponent(stage.id)}` : ''}#stages-vacances`}
                className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-2.5 pr-4 transition hover:border-turquoise hover:bg-white hover:shadow-md"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-abysse">
                  {stage.image && <img src={`${stage.image}?w=160&h=160&fit=crop`} alt="" className="h-full w-full object-cover" loading="lazy" />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white ${stage.bgColor || 'bg-turquoise'}`}>{stage.age}</span>
                  <span className="mt-1 block text-sm font-black uppercase leading-tight tracking-tight text-abysse line-clamp-2">{stage.officialName}</span>
                  {stage.price && <span className="block text-[11px] font-bold text-slate-400">{stage.price}</span>}
                </div>
                <ArrowRight size={16} className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-turquoise" />
              </Link>
            ))}
          </div>

          {visibleStages.length === 0 && (
            <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">
              Pas de stage pour cet âge aux prochaines vacances.{" "}
              <Link href="/ecole-voile#stages-vacances" className="font-bold text-turquoise hover:underline">Voir toute l’offre de l’année</Link>
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/ecole-voile#stages-vacances" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-md transition hover:bg-orange-600">
              Voir les stages et s’inscrire <ArrowRight size={13} />
            </Link>
            <Link href="/ecole-voile#planning" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-turquoise hover:underline">
              Voir les dates <ArrowRight size={13} />
            </Link>
            {hiddenCount > 0 && (
              <Link href="/ecole-voile#stages-vacances" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-turquoise hover:underline">
                Toute l’offre de l’année <ArrowRight size={13} />
              </Link>
            )}
          </div>
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

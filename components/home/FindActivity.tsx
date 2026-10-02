'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { StageCampaign, selectStageCampaign, campaignDates } from '@/lib/stageCampaigns';
import { MotionConfig, motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Sailboat, Users, Wind } from 'lucide-react';

type SchoolStage = {
  _key?: string;
  id?: string;
  officialName?: string;
  age?: string;
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

// Boutons du sélecteur : "Tous" + les tranches, avec un libellé court pour la police titre
const AGE_FILTERS = [
  { label: 'Tous les âges', short: 'Tous' },
  ...AGE_RANGES.map((r) => ({ label: r.label, short: r.max >= 99 ? `${r.min}+` : `${r.min}-${r.max}` })),
];

const matchesRange = (age: string | undefined, { min, max }: { min: number; max: number }) => {
  const ages = parseAges(age);
  return !ages || (ages[0] <= max && ages[1] >= min);
};

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

export default function FindActivity({ stages: allStages, campaigns = [], pinnedCampaignKey = '', children }: { stages: SchoolStage[]; campaigns?: StageCampaign[]; pinnedCampaignKey?: string; children?: React.ReactNode }) {
  // Seuls les stages mis en avant dans l'admin (interrupteur "Sur l'accueil")
  const campaign = selectStageCampaign(campaigns, pinnedCampaignKey);
  const stages = useMemo(() => {
    if (campaign) return allStages.filter(s => s._key && campaign.stageKeys.includes(s._key));
    if (campaigns.length) return allStages;
    const featured = allStages.filter(s => s.showOnHome !== false);
    return featured.length ? featured : allStages;
  }, [allStages, campaign, campaigns.length]);
  const [range, setRange] = useState<number | null>(null);

  const visibleStages = useMemo(
    () => (range === null || stages.length <= 2 ? stages : stages.filter((stage) => matchesRange(stage.age, AGE_RANGES[range]))),
    [stages, range],
  );


  // Mobile : changer d'âge ramène la rangée au début (les premiers stages = les prochaines vacances)
  const railRef = useRef<HTMLDivElement>(null);
  const selectRange = (value: number | null) => {
    setRange(value);
    railRef.current?.scrollTo({ left: 0 });
  };

  return (
    <section id="trouver" className="scroll-mt-20 py-14 md:py-20 bg-slate-50 relative z-10">
      <div className="max-w-400 mx-auto px-5 md:px-6">
        {/* STAGES VACANCES : d'abord l'âge, puis les stages correspondants (ordre = celui de l'admin) */}
        <MotionConfig reducedMotion="user">
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 lg:gap-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-black uppercase italic leading-tight tracking-tight text-abysse">{campaign?.title || 'Stages de vacances'}</h2>
              {campaign && <p className="mt-3 text-sm font-bold text-turquoise">{campaignDates(campaign)}</p>}
              {campaign?.description && <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-600">{campaign.description}</p>}
            </div>

            {/* Sélecteur d'âge : un curseur glisse sous la tranche choisie ; le chiffre = nombre de stages */}
            {stages.length > 2 && <div>
              <span className="mb-2 block pl-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pour quel âge ?</span>
              <div className="-mx-5 px-5 md:mx-0 md:px-0 overflow-x-auto no-scrollbar">
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1.5" role="group" aria-label="Filtrer par âge">
                  {AGE_FILTERS.map((f, i) => {
                    const value = i === 0 ? null : i - 1;
                    const active = range === value;
                    return (
                      <button
                        key={f.label}
                        type="button"
                        onClick={() => selectRange(value)}
                        aria-pressed={active}
                        aria-label={f.label}
                        className={`relative shrink-0 h-11 md:h-12 px-3 md:px-5 rounded-full transition-[color,transform] duration-200 ease-out active:scale-[0.97] ${active ? 'text-white' : 'text-abysse/60 hover:text-abysse'}`}
                      >
                        {active && (
                          <motion.span
                            layoutId="age-pill"
                            className="absolute inset-0 rounded-full bg-abysse shadow-sm"
                            transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
                          />
                        )}
                        <span className="relative inline-flex items-baseline gap-1 whitespace-nowrap">
                          <span className="font-display text-base md:text-lg font-black italic uppercase tracking-tight">{f.short}</span>
                          {i > 0 && <span className="text-[10px] font-bold">ans</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>}
          </div>

          {/* Mobile : rangée qui défile au doigt (la carte suivante dépasse) — tablette/desktop : grille, tout est visible */}
          <div className="mt-6 md:mt-8">
            <div
              ref={railRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-start"
            >
              {visibleStages.map((stage, i) => (
                <motion.div
                  key={`${range ?? 'all'}-${stage.id || i}`}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 'some' }}
                  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: Math.min(i, 5) * 0.06 }}
                  className="w-full max-w-[340px] sm:max-w-none min-w-0"
                >
                  <Link
                    href={`/ecole-voile${stage.id ? `?stage=${encodeURIComponent(stage.id)}` : ''}#stages-vacances`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-abysse/10 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquoise"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-abysse">
                      {(stage.image || campaign?.imageUrl) && (
                        <img
                          src={stage.image || campaign?.imageUrl}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                      <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow ${stage.bgColor || 'bg-turquoise'}`}>{stage.age}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-4 md:p-5">
                      <h3 className="text-base md:text-lg font-black uppercase italic leading-tight tracking-tight text-abysse">{stage.officialName}</h3>
                      {stage.hook && <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">{stage.hook}</p>}
                      <div className="pt-5">
                        <span className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl bg-abysse px-4 py-3 text-sm font-bold text-white transition-colors group-hover:bg-turquoise">
                          Découvrir ce stage <ArrowRight size={16} className="shrink-0" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/ecole-voile#stages-vacances"
                className={`group relative isolate flex min-h-64 self-stretch overflow-hidden rounded-2xl bg-cyan-50 p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquoise ${visibleStages.length === 1 ? 'sm:col-span-1 md:col-span-2 lg:col-span-3' : visibleStages.length === 2 ? 'sm:col-span-2 md:col-span-1 lg:col-span-2' : visibleStages.length === 3 ? 'sm:col-span-1 md:col-span-3 lg:col-span-1' : 'col-span-full'}`}
              >
                <div className="relative z-10 flex max-w-sm flex-col items-start">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-abysse/60">Pâques · Été · Toussaint</span>
                  <h3 className="mt-5 text-2xl md:text-3xl font-black uppercase italic leading-tight tracking-tight text-abysse">Vos vacances,<br />côté mer.</h3>
                  <p className="mt-3 max-w-64 text-sm leading-relaxed text-abysse/70">Premiers bords ou nouvelles sensations : trouvez le stage qui vous ressemble.</p>
                  <span className="mt-auto pt-6 inline-flex items-center gap-3 text-sm font-bold text-abysse">
                    Explorer tous les stages
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-abysse text-white transition-colors group-hover:bg-turquoise"><ArrowRight size={18} /></span>
                  </span>
                </div>
                {visibleStages.length !== 3 && <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden lg:block">
                  <img src="/images/imgBank/CataPharePointeAgon.jpg" alt="" className="h-full w-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-linear-to-r from-cyan-50 via-cyan-50/30 to-transparent" />
                </div>}
              </Link>
            </div>
          </div>

          {visibleStages.length === 0 && (
            <p className="mt-5 rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
              {campaign && !stages.length ? 'Le programme de cette période est en préparation.' : 'Aucune formule ne correspond à cet âge dans cette sélection.'}{" "}
              <Link href="/ecole-voile#stages-vacances" className="font-bold text-turquoise hover:underline">Voir toute l’offre de l’année</Link>
            </p>
          )}

          {campaign?.registrationUrl && <a href={campaign.registrationUrl} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-abysse px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-turquoise">Réserver pour cette période <ArrowRight size={16} /></a>}
        </div>
        </MotionConfig>

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

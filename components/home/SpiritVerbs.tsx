"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  MotionValue,
} from "framer-motion";

/* ------------------------------------------------------------------
   L'ESPRIT DU CLUB — bloc "spot publicitaire" piloté au scroll.
   La scène reste épinglée plein écran pendant que l'on scrolle ;
   chaque verbe a exactement le même temps d'antenne et sa propre
   mise en scène qui "joue" le verbe :
     1. DOMPTER    → vitesse : volet diagonal, lettres qui déboulent en biais, traînées de vent
     2. DÉCOUVRIR  → horizon : ouverture en longue-vue, mot révélé par la ligne d'horizon
     3. RESSENTIR  → souffle : fondu lent, lettres qui flottent comme sur la houle
   Puis un "pack shot" final réunit les trois intentions.
------------------------------------------------------------------- */

type SpiritCard = {
  tag?: string;
  title: string;
  description?: string;
  buttonText?: string;
  link?: string;
  image?: string;
  colorTheme?: string;
};

type Spirit = {
  title?: string;
  message?: string;
  description?: string;
  cards?: SpiritCard[];
};

const FALLBACK_CARDS: SpiritCard[] = [
  {
    tag: "Sensation",
    title: "DOMPTER",
    description:
      "Vitesse et adrénaline. Stages de catamaran, char à voile et sports de glisse pour faire le plein de sensations fortes.",
    buttonText: "Voir les activités sensation",
    link: "/activites?cat=Sensations",
    image: "/images/imgBank/Navigation.jpg",
  },
  {
    tag: "Exploration",
    title: "DÉCOUVRIR",
    description:
      "Louez un paddle ou un kayak, longez la côte à votre rythme. La liberté absolue entre dunes et grand large.",
    buttonText: "Louer du matériel",
    link: "/activites",
    image: "/images/imgBank/paddlekayak.jpg",
  },
  {
    tag: "Bien-être",
    title: "RESSENTIR",
    description:
      "Prendre le temps, respirer et bouger au rythme de la mer. Retrouvez les activités bien-être du club pour partager un moment au grand air.",
    buttonText: "Voir les activités bien-être",
    link: "/activites?cat=Bien-être",
    image: "/images/imgBank/Cata001.jpg",
  },
];

// Hauteur totale de la séquence (défilement ≈ hauteur − 100svh + 60svh d'entrée)
const SEQUENCE_HEIGHT = "h-[320svh]";

// Part du scroll consacrée aux verbes ; le reste est pour le pack shot final
const BEATS_END = 0.8;

// Taille des verbes : la plus grande qui tient en largeur (DÉCOUVRIR) et en hauteur
const VERB_SIZE = "text-[min(11.5vw,20svh)]";

export default function SpiritVerbs({ spirit }: { spirit?: Spirit }) {
  const reduce = useReducedMotion();
  const cards = (spirit?.cards?.length ? spirit.cards : FALLBACK_CARDS).slice(0, 3).map(card => {
    // Ressentir désigne le parcours bien-être, quel que soit le contenu fourni par le CMS.
    if (card.title.trim().toLocaleLowerCase('fr') !== 'ressentir') return card;
    return { ...card, link: '/activites?cat=Bien-être', buttonText: 'Voir les activités bien-être' };
  });

  return reduce ? (
    <SpiritStatic spirit={spirit} cards={cards} />
  ) : (
    <SpiritCinema spirit={spirit} cards={cards} />
  );
}

/* ================================================================== */

function SpiritCinema({ spirit, cards }: { spirit?: Spirit; cards: SpiritCard[] }) {
  const ref = useRef<HTMLElement>(null);
  // Démarre pendant l'entrée de la section : arrivé en haut (ancre #decouvrir), DOMPTER est déjà posé
  const { scrollYProgress: progress } = useScroll({ target: ref, offset: ["start 60%", "end end"] });
  const beatLen = BEATS_END / cards.length;

  return (
    <section
      ref={ref}
      id="decouvrir"
      aria-label={spirit?.title || "L'Esprit du Club"}
      className={`relative z-10 bg-abysse ${SEQUENCE_HEIGHT}`}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-abysse text-white">
        {cards.map((card, idx) => (
          <Beat
            key={idx}
            card={card}
            idx={idx}
            progress={progress}
            start={idx * beatLen}
            len={beatLen}
          />
        ))}

        <PackShot spirit={spirit} cards={cards} progress={progress} />

        {/* Habillage fixe : signature en haut, compteur en bas */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-6 md:px-12 pt-24 md:pt-28">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-turquoise animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">
              {spirit?.title || "L'Esprit du Club"}
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-6 md:px-12 pb-6 md:pb-10">
          <div className="flex gap-3 md:gap-6">
            {cards.map((card, idx) => (
              <ProgressSegment
                key={idx}
                label={card.title}
                progress={progress}
                start={idx * beatLen}
                len={beatLen}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Beat({
  card,
  idx,
  progress,
  start,
  len,
}: {
  card: SpiritCard;
  idx: number;
  progress: MotionValue<number>;
  start: number;
  len: number;
}) {
  const mode = (["speed", "horizon", "breath"] as const)[idx % 3];
  const t = useTransform(progress, [start, start + len], [0, 1]);

  // --- Entrée de la scène (clip-path) propre à chaque verbe
  const wipe = useTransform(t, [0, 0.32], [0, 130]); // volet diagonal
  const lens = useTransform(t, [0, 0.32], [0, 80]); // ouverture circulaire
  const speedClip = useMotionTemplate`polygon(0 0, ${wipe}% 0, calc(${wipe}% - 30%) 100%, 0 100%)`;
  const lensClip = useMotionTemplate`circle(${lens}% at 50% 55%)`;
  const fade = useTransform(t, [0, 0.3], [0, 1]);

  // --- Image : léger travelling pendant tout le plan
  const imgScale = useTransform(t, [0, 1], mode === "breath" ? [1.25, 1.05] : [1.2, 1.1]);
  const imgX = useTransform(t, [0, 1], mode === "speed" ? [4, -4] : [0, 0]);
  const imgTransform = useMotionTemplate`translateX(${imgX}%) scale(${imgScale})`;

  // --- Sortie du texte avant le plan suivant
  const textOut = useTransform(t, [0.82, 1], [1, 0]);
  const textOutY = useTransform(t, [0.82, 1], [0, -8]);
  const textOutTransform = useMotionTemplate`translateY(${textOutY}svh)`;

  // --- Sous-titre, description, CTA
  const subIn = useTransform(t, [0.34, 0.48], [0, 1]);
  const subY = useTransform(t, [0.34, 0.48], [24, 0]);
  const subTransform = useMotionTemplate`translateY(${subY}px)`;

  // --- Horizon (DÉCOUVRIR) : le mot se dévoile derrière la ligne
  const horizon = useTransform(t, [0.12, 0.38], [0, 100]);
  const horizonClip = useMotionTemplate`inset(-20% calc(100% - ${horizon}%) -20% 0)`;
  const horizonLine = useTransform(t, [0.1, 0.38], [0, 1]);
  const horizonLineTransform = useMotionTemplate`scaleX(${horizonLine})`;

  // Un plan pas encore entré (ex. fondu à 0) ne doit pas capter les clics du plan visible
  const pointerEvents = useTransform(t, (v) => (v > 0.05 ? "auto" : "none"));

  const letters = Array.from(card.title || "");

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        zIndex: idx + 1,
        pointerEvents,
        clipPath: mode === "speed" ? speedClip : mode === "horizon" ? lensClip : undefined,
        opacity: mode === "breath" ? fade : 1,
      }}
    >
      {/* Image plein cadre */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ transform: imgTransform }}>
        {card.image && (
          <Image
            src={card.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority={idx === 0}
          />
        )}
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-t from-abysse/90 via-abysse/30 to-abysse/40" />

      {/* Ambiance vivante propre au verbe (animations CSS en boucle, hors thread principal) */}
      {mode === "speed" && <WindStreaks />}
      {mode === "breath" && <Swell />}

      {/* Texte */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center px-6 md:px-12"
        style={{ opacity: textOut, transform: textOutTransform }}
      >
        {card.tag && (
          <motion.p
            className="mb-3 md:mb-5 text-[11px] md:text-xs font-black uppercase tracking-[0.35em] text-white"
            style={{ opacity: subIn }}
          >
            <span className="text-turquoise">{String(idx + 1).padStart(2, "0")}</span> — {card.tag}
          </motion.p>
        )}

        <div className="relative">
          <motion.h3
            aria-label={card.title}
            className={`${VERB_SIZE} font-black uppercase italic leading-[0.85] tracking-tighter whitespace-nowrap`}
            style={mode === "horizon" ? { clipPath: horizonClip } : undefined}
          >
            {letters.map((ch, i) => (
              <Letter key={i} ch={ch} i={i} count={letters.length} mode={mode} t={t} />
            ))}
          </motion.h3>
          {mode === "horizon" && (
            <motion.span
              aria-hidden
              className="absolute left-0 right-0 -bottom-2 md:-bottom-4 h-0.5 origin-left bg-turquoise"
              style={{ transform: horizonLineTransform }}
            />
          )}
        </div>

        <motion.div
          className="mt-6 md:mt-10 max-w-lg md:max-w-2xl"
          style={{ opacity: subIn, transform: subTransform }}
        >
          {card.description && (
            <p className="text-lg md:text-2xl leading-relaxed text-white/90 text-pretty">
              {card.description}
            </p>
          )}
          {card.link && card.buttonText && (
            <Link
              href={card.link}
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-[11px] font-black uppercase tracking-widest text-abysse transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              {card.buttonText}
              <ArrowRight
                size={16}
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              />
            </Link>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

function Letter({
  ch,
  i,
  count,
  mode,
  t,
}: {
  ch: string;
  i: number;
  count: number;
  mode: "speed" | "horizon" | "breath";
  t: MotionValue<number>;
}) {
  // Décalage (stagger) réparti sur la longueur du mot
  const d = (i / Math.max(1, count - 1)) * 0.1;

  // DOMPTER : les lettres déboulent de la droite, penchées par la vitesse
  const sx = useTransform(t, [0.08 + d, 0.3 + d], [70, 0]);
  const sk = useTransform(t, [0.08 + d, 0.3 + d], [-35, 0]);
  const speedTransform = useMotionTemplate`translateX(${sx}vw) skewX(${sk}deg)`;

  // DÉCOUVRIR : les lettres montent derrière l'horizon
  const hy = useTransform(t, [0.12 + d, 0.36 + d], [45, 0]);
  const horizonTransform = useMotionTemplate`translateY(${hy}%)`;

  // RESSENTIR : les lettres émergent, flottantes et floues, en vague
  const wave = Math.sin(i * 1.3) * 18;
  const by = useTransform(t, [0.1 + d, 0.4 + d], [60 + wave, 0]);
  const blur = useTransform(t, [0.1 + d, 0.4 + d], [14, 0]);
  const breathTransform = useMotionTemplate`translateY(${by}%)`;
  const breathFilter = useMotionTemplate`blur(${blur}px)`;

  const opacity = useTransform(
    t,
    mode === "speed" ? [0.08 + d, 0.2 + d] : mode === "horizon" ? [0.12 + d, 0.3 + d] : [0.1 + d, 0.35 + d],
    [0, 1],
  );

  const style =
    mode === "speed"
      ? { transform: speedTransform, opacity }
      : mode === "horizon"
        ? { transform: horizonTransform, opacity }
        : { transform: breathTransform, filter: breathFilter, opacity };

  return (
    <motion.span aria-hidden className="inline-block will-change-transform" style={style}>
      {/* RESSENTIR continue de respirer une fois posé */}
      <span
        className={`inline-block ${mode === "breath" ? "animate-[spirit-float_4.5s_ease-in-out_infinite]" : ""}`}
        style={mode === "breath" ? { animationDelay: `${-i * 0.35}s` } : undefined}
      >
        {ch === " " ? " " : ch}
      </span>
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */

function PackShot({
  spirit,
  cards,
  progress,
}: {
  spirit?: Spirit;
  cards: SpiritCard[];
  progress: MotionValue<number>;
}) {
  const bg = useTransform(progress, [BEATS_END, BEATS_END + 0.07], [0, 1]);
  const msg = useTransform(progress, [BEATS_END + 0.1, BEATS_END + 0.16], [0, 1]);
  const pointerEvents = useTransform(progress, (v) => (v > BEATS_END + 0.08 ? "auto" : "none"));

  // Verbe survolé : son texte remplace le message général pour rappeler ce qu'il évoque
  const [active, setActive] = useState<number | null>(null);
  const defaultText = spirit?.message || spirit?.description;
  const text = active !== null ? cards[active]?.description : defaultText;

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12"
      style={{ pointerEvents }}
    >
      <motion.div className="absolute inset-0 bg-abysse" style={{ opacity: bg }} />

      <div className="relative">
        {/* onMouseLeave sur le groupe : passer d'un verbe à l'autre ne fait pas clignoter le texte par défaut */}
        <div onMouseLeave={() => setActive(null)}>
          {cards.map((card, idx) => (
            <PackShotLine
              key={idx}
              card={card}
              idx={idx}
              progress={progress}
              onActivate={() => setActive(idx)}
              onDeactivate={() => setActive(null)}
            />
          ))}
        </div>

        {/* Hauteur réservée (desktop) : le changement de texte ne fait pas bouger les verbes centrés */}
        <motion.div
          className="mt-8 md:mt-12 max-w-2xl md:min-h-[5em] text-lg md:text-2xl leading-relaxed text-white/80 text-pretty"
          style={{ opacity: msg }}
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            {text && (
              <motion.p
                key={active ?? "default"}
                initial={{ opacity: 0, transform: "translateY(8px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={{ opacity: 0, transform: "translateY(-4px)" }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                {text}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

function PackShotLine({
  card,
  idx,
  progress,
  onActivate,
  onDeactivate,
}: {
  card: SpiritCard;
  idx: number;
  progress: MotionValue<number>;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const s = BEATS_END + 0.02 + idx * 0.035;
  // Lignes alternées gauche / droite, comme un générique de fin
  const x = useTransform(progress, [s, s + 0.08], [idx % 2 ? 30 : -30, 0]);
  const opacity = useTransform(progress, [s, s + 0.06], [0, 1]);
  const transform = useMotionTemplate`translateX(${x}vw)`;

  return (
    <motion.div style={{ transform, opacity }}>
      <Link
        href={card.link || "#"}
        className="group flex items-baseline gap-4 md:gap-8 w-fit"
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onBlur={onDeactivate}
      >
        <span
          aria-label={card.title}
          className="font-display text-[min(10.5vw,13svh)] font-black uppercase italic leading-[0.95] tracking-tighter text-white transition-colors duration-200 group-hover:text-turquoise group-focus-visible:text-turquoise"
        >
          {/* Au survol, les lettres ondulent comme la houle de RESSENTIR (vague de gauche à droite) */}
          {Array.from(card.title || "").map((ch, i) => (
            <span
              key={i}
              aria-hidden
              className="inline-block group-hover:animate-[spirit-float_2.4s_ease-in-out_infinite] group-focus-visible:animate-[spirit-float_2.4s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.09}s` }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
          <span aria-hidden className="text-turquoise">.</span>
        </span>
        <ArrowRight
          aria-hidden
          className="hidden md:block size-8 lg:size-12 shrink-0 -translate-x-4 opacity-0 text-turquoise transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100"
        />
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

function ProgressSegment({
  label,
  progress,
  start,
  len,
}: {
  label: string;
  progress: MotionValue<number>;
  start: number;
  len: number;
}) {
  const fill = useTransform(progress, [start, start + len], [0, 1]);
  const transform = useMotionTemplate`scaleX(${fill})`;
  const active = useTransform(progress, (v) => (v >= start && v < start + len ? 1 : 0.45));

  return (
    <motion.div className="flex-1 min-w-0" style={{ opacity: active }}>
      <div className="h-0.5 w-full bg-white/20 overflow-hidden">
        <motion.div className="h-full w-full origin-left bg-turquoise" style={{ transform }} />
      </div>
      <p className="mt-2 truncate text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-white">
        {label}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

// Traînées de vent qui filent à l'horizontale (DOMPTER)
function WindStreaks() {
  const streaks = [
    { top: "18%", w: "35%", dur: 1.4, delay: 0 },
    { top: "31%", w: "22%", dur: 1.1, delay: -0.6 },
    { top: "47%", w: "45%", dur: 1.7, delay: -0.3 },
    { top: "58%", w: "18%", dur: 0.9, delay: -0.8 },
    { top: "72%", w: "30%", dur: 1.3, delay: -1.1 },
    { top: "84%", w: "25%", dur: 1.5, delay: -0.2 },
  ];
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {streaks.map((s, i) => (
        <span
          key={i}
          className="absolute left-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent animate-[spirit-streak_linear_infinite]"
          style={{ top: s.top, width: s.w, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}

// Houle douce en bas d'écran (RESSENTIR)
function Swell() {
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 overflow-hidden pointer-events-none opacity-40">
      {[0, 1].map((i) => (
        <svg
          key={i}
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 h-full w-[200%] animate-[spirit-swell_linear_infinite]"
          style={{ animationDuration: `${14 + i * 6}s`, bottom: `${i * 12}%`, opacity: 1 - i * 0.4 }}
        >
          {/* Période de 720 : la translation de -50% (1440) boucle sans raccord visible */}
          <path
            d="M0 60 Q 180 20 360 60 T 720 60 T 1080 60 T 1440 60 T 1800 60 T 2160 60 T 2520 60 T 2880 60"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  );
}

/* ================================================================== */

// Version sans mouvement (réglage système "réduire les animations")
function SpiritStatic({ spirit, cards }: { spirit?: Spirit; cards: SpiritCard[] }) {
  return (
    <section id="decouvrir" className="relative z-10 bg-abysse text-white">
      {cards.map((card, idx) => (
        <div key={idx} className="relative min-h-svh flex flex-col justify-center px-6 md:px-12 py-24">
          {card.image && (
            <Image src={card.image} alt="" fill sizes="100vw" className="object-cover" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-abysse/90 via-abysse/40 to-abysse/40" />
          <div className="relative">
            {idx === 0 && (
              <p className="mb-6 text-[10px] font-black uppercase tracking-[0.25em] text-white/70">
                {spirit?.title || "L'Esprit du Club"}
              </p>
            )}
            <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-turquoise">
              {String(idx + 1).padStart(2, "0")} — {card.tag}
            </p>
            <h3 className={`${VERB_SIZE} font-black uppercase italic leading-[0.85] tracking-tighter`}>
              {card.title}
            </h3>
            {card.description && (
              <p className="mt-6 max-w-2xl text-lg md:text-2xl leading-relaxed text-white/90">
                {card.description}
              </p>
            )}
            {card.link && card.buttonText && (
              <Link
                href={card.link}
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-[11px] font-black uppercase tracking-widest text-abysse"
              >
                {card.buttonText} <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

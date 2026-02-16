"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

declare global {
    interface Window {
        gsap: any;
    }
}

// === TYPES ===
interface Scenario {
    player: { x: number; y: number; rot: number; amure: string };
    opp: { x: number; y: number; rot: number; amure: string };
    impact: { x: number; y: number };
    priority: boolean;
    rule: string;
    coach: string;
    explanation: string;
}

// === HELPER FUNCTIONS (exact copy from priorité.html) ===
const R = (a: number, b: number) => a + Math.random() * (b - a);
const P = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const cl = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const catL = (c: string) => ({ pres: 'au près', travers: 'au travers', largue: 'au largue', portant: 'au portant' }[c] || '');

const randAllure = () => {
    const c = P(['pres', 'travers', 'largue', 'portant']);
    let ang: number;
    if (c === 'pres') ang = R(42, 58);
    else if (c === 'travers') ang = R(75, 105);
    else if (c === 'largue') ang = R(118, 142);
    else ang = R(152, 172);
    return { cat: c, ang };
};

const startFrom = (ix: number, iy: number, rotDeg: number, dist: number) => {
    const r = rotDeg * Math.PI / 180;
    return { x: cl(ix - Math.sin(r) * dist, 12, 88), y: cl(iy + Math.cos(r) * dist, 12, 88) };
};

// === SCENARIO GENERATORS (exact logic from priorité.html) ===
const genAmures = (): Scenario => {
    const al = randAllure();
    const tb = Math.random() < 0.5;
    const pRot = tb ? -al.ang : al.ang;
    const oRot = tb ? al.ang : -al.ang;
    const ix = R(35, 65), iy = R(30, 70), dist = R(25, 38);
    const pp = startFrom(ix, iy, pRot, dist);
    const op = startFrom(ix, iy, oRot, dist);
    const pri = tb;
    const pa = tb ? 'TRIBORD' : 'BÂBORD';
    const oa = tb ? 'BÂBORD' : 'TRIBORD';
    const al2 = catL(al.cat);
    return {
        player: { x: pp.x, y: pp.y, rot: pRot, amure: pa },
        opp: { x: op.x, y: op.y, rot: oRot, amure: oa },
        impact: { x: ix, y: iy }, priority: pri,
        rule: "Règle 12(a)(i) — Amures opposées",
        coach: pri ? `Croisement ${al2}. Tribord amure, privilégié !` : `Croisement ${al2}. Il est tribord, je m'écarte.`,
        explanation: pri
            ? `Croisement ${al2}, <b>amures différentes</b>. Vous êtes <b>tribord amure</b> : le voilier gris (<b>bâbord amure</b>) doit s'écarter.`
            : `Croisement ${al2}, <b>amures différentes</b>. Vous êtes <b>bâbord amure</b> : c'est à vous de vous écarter du voilier <b>tribord amure</b>.`
    };
};

const genMeme = (): Scenario => {
    const al = randAllure();
    const tb = Math.random() < 0.5;
    const base = tb ? -al.ang : al.ang;
    const slv = Math.random() < 0.5;
    const ix = R(35, 65), iy = R(30, 65), dist = R(22, 35);
    const perp = (base + 90) * Math.PI / 180;
    const off = R(8, 15);
    const pRot = base + R(-2, 2), oRot = base + R(-2, 2);
    let pp, op;
    if (slv) {
        pp = startFrom(ix + Math.sin(perp) * off, iy - Math.cos(perp) * off, pRot, dist);
        op = startFrom(ix - Math.sin(perp) * off, iy + Math.cos(perp) * off, oRot, dist);
    } else {
        pp = startFrom(ix - Math.sin(perp) * off, iy + Math.cos(perp) * off, pRot, dist);
        op = startFrom(ix + Math.sin(perp) * off, iy - Math.cos(perp) * off, oRot, dist);
    }
    const am = tb ? 'tribord' : 'bâbord';
    const al2 = catL(al.cat);
    const amUp = tb ? 'TRIBORD' : 'BÂBORD';
    return {
        player: { x: pp.x, y: pp.y, rot: pRot, amure: amUp },
        opp: { x: op.x, y: op.y, rot: oRot, amure: amUp },
        impact: { x: ix, y: iy }, priority: slv,
        rule: "Règle 12(a)(ii) — Même amure",
        coach: slv ? `Même amure ${am} ${al2}. Sous le vent, il me laisse.` : `Même amure ${am} ${al2}. Au vent, je m'écarte.`,
        explanation: slv
            ? `Même amure <b>${am}</b> ${al2}. Vous êtes <b>sous le vent</b> : le voilier <b>au vent</b> (gris) doit s'écarter.`
            : `Même amure <b>${am}</b> ${al2}. Vous êtes <b>au vent</b> : c'est à vous de vous écarter du voilier <b>sous le vent</b>.`
    };
};

const genRattr = (): Scenario => {
    const al = randAllure();
    const rot = P([-1, 1]) * al.ang;
    const am = rot > 0 ? 'BÂBORD' : 'TRIBORD';
    const rattrapé = Math.random() < 0.5;
    const ix = R(35, 65), iy = R(30, 65);
    const dist1 = R(18, 28), dist2 = R(32, 45);
    const pRot = rot + R(-3, 3), oRot = rot + R(-3, 3);
    let pp, op;
    if (rattrapé) {
        pp = startFrom(ix, iy, pRot, dist1);
        op = startFrom(ix, iy, oRot, dist2);
    } else {
        pp = startFrom(ix, iy, pRot, dist2);
        op = startFrom(ix, iy, oRot, dist1);
    }
    return {
        player: { x: pp.x, y: pp.y, rot: pRot, amure: am },
        opp: { x: op.x, y: op.y, rot: oRot, amure: am },
        impact: { x: ix, y: iy }, priority: rattrapé,
        rule: "Règle 13 — Rattrapage",
        coach: rattrapé ? "Il arrive par mon arrière, c'est le rattrapant !" : "C'est moi le rattrapant, je m'écarte !",
        explanation: rattrapé
            ? "Le <b>rattrapant</b> (par l'arrière) doit <b>toujours</b> s'écarter. Cette règle prime sur les amures."
            : "Vous êtes le <b>rattrapant</b>. Vous devez vous écarter, <b>quelle que soit votre amure</b>."
    };
};

const buildSession = (): Scenario[] => {
    const generators = [genAmures, genAmures, genAmures, genAmures, genMeme, genMeme, genMeme, genRattr, genRattr];
    generators.push(P([genAmures, genMeme, genRattr]));
    // Shuffle
    for (let i = generators.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [generators[i], generators[j]] = [generators[j], generators[i]];
    }
    return generators.map(fn => fn());
};

const TOTAL = 10;

export const PriorityGame: React.FC = () => {
    const oceanRef = useRef<HTMLDivElement>(null);
    const trajRef = useRef<SVGSVGElement>(null);
    const playerBoatRef = useRef<HTMLDivElement>(null);
    const oppBoatRef = useRef<HTMLDivElement>(null);
    const playerSailRef = useRef<SVGPathElement>(null);
    const oppSailRef = useRef<SVGPathElement>(null);

    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [locked, setLocked] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showEnd, setShowEnd] = useState(false);
    const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; scenario: Scenario } | null>(null);

    const curRef = useRef<Scenario | null>(null);

    // Initialize game
    useEffect(() => {
        const session = buildSession();
        setScenarios(session);
        curRef.current = session[0];
    }, []);

    // Load GSAP
    useEffect(() => {
        const loadGsap = async () => {
            if (typeof window !== 'undefined' && !window.gsap) {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
                script.async = true;
                document.body.appendChild(script);
                await new Promise(resolve => { script.onload = resolve; });
            }
        };
        loadGsap();
    }, []);

    // Animate boats and draw trajectories
    const animateScene = useCallback((scenario: Scenario) => {
        if (!oceanRef.current || !window.gsap) return;
        const W = oceanRef.current.clientWidth;
        const H = oceanRef.current.clientHeight;

        // Draw trajectories
        if (trajRef.current) {
            const impPx = { x: scenario.impact.x / 100 * W, y: scenario.impact.y / 100 * H };
            const lines = [scenario.player, scenario.opp].map((d, i) => {
                const bx = d.x / 100 * W, by = d.y / 100 * H;
                const dx = impPx.x - bx, dy = impPx.y - by;
                const len = Math.sqrt(dx * dx + dy * dy);
                if (len < 1) return '';
                const nx = dx / len, ny = dy / len;
                const ext = Math.max(W, H) * 0.4;
                const ex = impPx.x + nx * ext, ey = impPx.y + ny * ext;
                const color = i === 0 ? '#3b82f6' : '#64748b';
                return `<line x1="${bx}" y1="${by}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="1.5" stroke-dasharray="8 6" opacity=".3"/>`;
            }).join('');
            trajRef.current.innerHTML = lines;
        }

        // Animate player boat
        const animateBoat = (isPlayer: boolean) => {
            const data = isPlayer ? scenario.player : scenario.opp;
            const boatRef = isPlayer ? playerBoatRef : oppBoatRef;
            const sailRef = isPlayer ? playerSailRef : oppSailRef;
            if (!boatRef.current) return;

            const bw = 50, bh = 100;
            const startX = data.x / 100 * W;
            const startY = data.y / 100 * H;
            const impX = scenario.impact.x / 100 * W;
            const impY = scenario.impact.y / 100 * H;

            // Animate sail
            if (sailRef.current && window.gsap) {
                const ab = Math.abs(data.rot);
                let sa: number;
                if (ab <= 45) sa = 8;
                else if (ab >= 165) sa = 75;
                else sa = ((ab - 45) / 120) * 67 + 8;
                const side = data.rot > 0 ? 1 : -1;
                const fa = sa * side;
                window.gsap.to(sailRef.current, {
                    attr: { d: `M50 55 Q${50 + fa} 108 ${50 + fa * 0.5} 160` },
                    duration: 0.5,
                    ease: "power2.out"
                });
            }

            window.gsap.killTweensOf(boatRef.current);
            window.gsap.set(boatRef.current, {
                left: startX - bw / 2,
                top: startY - bh / 2,
                rotation: data.rot
            });

            window.gsap.timeline({ repeat: -1 }).to(boatRef.current, {
                duration: 6,
                ease: "none",
                left: impX - bw / 2,
                top: impY - bh / 2
            });

            // Counter-rotate labels to keep them readable
            const labels = boatRef.current.querySelectorAll('.label-readable');
            window.gsap.set(labels, { rotation: -data.rot });
        };

        animateBoat(true);
        animateBoat(false);
    }, []);

    // Update scene when scenario changes
    useEffect(() => {
        if (scenarios.length > 0 && scenarios[idx]) {
            curRef.current = scenarios[idx];
            setLocked(false);
            setTimeout(() => animateScene(scenarios[idx]), 100);
        }
    }, [scenarios, idx, animateScene]);

    const handleAnswer = (answer: boolean) => {
        if (locked || !curRef.current) return;
        setLocked(true);
        const correct = answer === curRef.current.priority;
        if (correct) setScore(s => s + 1);
        setLastAnswer({ correct, scenario: curRef.current });
        setShowFeedback(true);
    };

    const handleNext = () => {
        setShowFeedback(false);
        if (idx + 1 >= TOTAL) {
            setShowEnd(true);
        } else {
            setIdx(i => i + 1);
        }
    };

    const handleRestart = () => {
        const session = buildSession();
        setScenarios(session);
        setIdx(0);
        setScore(0);
        setShowEnd(false);
        curRef.current = session[0];
    };

    const cur = scenarios[idx];

    // Get end game result
    const getEndResult = () => {
        const pct = Math.round(score / TOTAL * 100);
        if (pct >= 90) return { emoji: '🏆', grade: 'Expert RIPAM !', color: 'text-emerald-400' };
        if (pct >= 70) return { emoji: '⛵', grade: 'Bon matelot !', color: 'text-blue-400' };
        if (pct >= 50) return { emoji: '🧭', grade: 'En apprentissage', color: 'text-amber-400' };
        return { emoji: '📚', grade: 'Révisions conseillées', color: 'text-rose-400' };
    };

    return (
        <div className="relative max-w-[1360px] w-full mx-auto bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col lg:flex-row border border-slate-100">

            {/* Ocean Area */}
            <div ref={oceanRef} className="relative w-full lg:w-[55%] min-h-[340px] lg:min-h-[425px] bg-slate-900 overflow-hidden">
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,.15) 1.5px, transparent 1.5px)',
                    backgroundSize: '50px 50px'
                }} />

                {/* Wind indicator */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-800/90 border border-white/10 px-6 py-3 rounded-full flex flex-col items-center shadow-2xl">
                    <span className="text-[10px] font-black tracking-[0.3em] text-rose-500 uppercase">Vent du Nord</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="4">
                        <path d="M12 4v16M18 14l-6 6-6-6" />
                    </svg>
                </div>

                {/* Trajectories */}
                <svg ref={trajRef} className="absolute inset-0 w-full h-full pointer-events-none z-3" />

                {/* Impact point */}
                {cur && (
                    <div
                        className="absolute w-7 h-7 border-2 border-dashed border-rose-500 rounded-full z-4 animate-pulse"
                        style={{
                            left: `${cur.impact.x}%`,
                            top: `${cur.impact.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                )}

                {/* Player boat (blue) */}
                <div ref={playerBoatRef} className="absolute z-10 pointer-events-none" style={{ width: 50, height: 100 }}>
                    <svg viewBox="0 0 100 200" width="100%" height="100%">
                        <path d="M50 5C50 5 88 45 88 128C88 168 70 188 50 188C30 188 12 168 12 128C12 45 50 5 50 5Z" fill="#2563eb" stroke="#1e3a8a" strokeWidth="2" />
                        <path ref={playerSailRef} d="" fill="rgba(255,255,255,.9)" stroke="#1e293b" strokeWidth="2.5" />
                    </svg>
                    {cur && (
                        <>
                            <span className={`label-readable absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-[10px] font-black shadow-lg text-white ${cur.player.amure === 'TRIBORD' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                {cur.player.amure}
                            </span>
                            <span className="label-readable absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-black tracking-widest text-blue-300">MOI</span>
                        </>
                    )}
                </div>

                {/* Opponent boat (gray) */}
                <div ref={oppBoatRef} className="absolute z-10 pointer-events-none" style={{ width: 50, height: 100 }}>
                    <svg viewBox="0 0 100 200" width="100%" height="100%">
                        <path d="M50 5C50 5 88 45 88 128C88 168 70 188 50 188C30 188 12 168 12 128C12 45 50 5 50 5Z" fill="#475569" stroke="#334155" strokeWidth="2" />
                        <path ref={oppSailRef} d="" fill="rgba(255,255,255,.9)" stroke="#1e293b" strokeWidth="2.5" />
                    </svg>
                    {cur && (
                        <>
                            <span className={`label-readable absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-[10px] font-black shadow-lg text-white ${cur.opp.amure === 'TRIBORD' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                {cur.opp.amure}
                            </span>
                            <span className="label-readable absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-black tracking-widest text-slate-400">LUI</span>
                        </>
                    )}
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-[45%] p-8 lg:p-10 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-[10px] font-black tracking-[0.2em] text-blue-500 uppercase">RIPAM / COLREG</span>
                        <p className="text-slate-600 font-bold text-sm mt-1">{cur?.rule || 'Chargement...'}</p>
                    </div>
                    <div className="bg-slate-100 px-4 py-2 rounded-2xl text-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase block">Question</span>
                        <span className="text-2xl font-black text-slate-900">{idx + 1}/{TOTAL}</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
                    <div
                        className="h-full bg-linear-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${(idx / TOTAL) * 100}%` }}
                    />
                </div>

                {/* Question */}
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tight">Suis-je prioritaire ?</h1>
                <p className="text-slate-500 text-lg mb-8">
                    Analysez les <b className="text-slate-700">amures</b>, la <b className="text-slate-700">position relative</b> et les <b className="text-slate-700">voiles</b> par rapport au vent.
                </p>

                {/* Buttons */}
                <div className="space-y-3 mb-8">
                    <button
                        onClick={() => handleAnswer(true)}
                        disabled={locked}
                        className={`w-full py-5 rounded-2xl font-black text-lg text-white transition-all ${locked ? 'opacity-40 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_6px_0_#047857] active:translate-y-1 active:shadow-none'}`}
                    >
                        ✓  OUI, JE SUIS PRIORITAIRE
                    </button>
                    <button
                        onClick={() => handleAnswer(false)}
                        disabled={locked}
                        className={`w-full py-5 rounded-2xl font-black text-lg text-white transition-all ${locked ? 'opacity-40 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-500 shadow-[0_6px_0_#be123c] active:translate-y-1 active:shadow-none'}`}
                    >
                        ✕  NON, JE M'ÉCARTE
                    </button>
                </div>

                {/* Coach */}
                <div className="relative mt-auto bg-slate-50 p-6 pl-16 rounded-[2rem] border border-slate-100 shadow-inner">
                    <div className="absolute -top-6 -left-4 w-24 h-24 rounded-2xl bg-blue-600 shrink-0 overflow-hidden shadow-xl border-4 border-white transform -rotate-6 z-10">
                        <Image src="/images/Games/rayan.png" alt="Coach" width={96} height={96} className="w-full h-full object-cover" quality={100} />
                    </div>
                    <div className="ml-12">
                        <p className="text-xs text-blue-600 uppercase font-black tracking-widest mb-1">Coach nautique :</p>
                        <p className="text-slate-800 font-bold text-base leading-tight italic">&quot;{cur?.coach || 'Prêt à naviguer ?'}&quot;</p>
                    </div>
                </div>
            </div>

            {/* Feedback Overlay */}
            {showFeedback && lastAnswer && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-5 rounded-[3rem]">
                    <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full text-center shadow-2xl">
                        <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl text-white ${lastAnswer.correct ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                            {lastAnswer.correct ? '✓' : '✕'}
                        </div>
                        <span className="inline-block bg-slate-100 px-4 py-2 rounded-xl text-xs font-black text-blue-600 tracking-wider mb-4">
                            {lastAnswer.scenario.rule}
                        </span>
                        <h2 className={`text-3xl font-black mb-4 ${lastAnswer.correct ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {lastAnswer.correct ? "C'est exact !" : "Erreur tactique"}
                        </h2>
                        <p className="text-slate-600 text-base leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: lastAnswer.scenario.explanation }} />
                        <button
                            onClick={handleNext}
                            className="w-full py-5 rounded-2xl font-black text-lg text-white bg-blue-600 hover:bg-blue-500 shadow-lg transition-all"
                        >
                            SUIVANT
                        </button>
                    </div>
                </div>
            )}

            {/* End Overlay */}
            {showEnd && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-5 rounded-[3rem]">
                    <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full text-center shadow-2xl">
                        <div className="text-6xl mb-4">{getEndResult().emoji}</div>
                        <div className={`text-7xl font-black ${getEndResult().color}`}>{score}/{TOTAL}</div>
                        <div className={`text-xl font-black mb-2 ${getEndResult().color}`}>{getEndResult().grade}</div>
                        <p className="text-slate-500 text-base mb-8">
                            {score} bonne{score > 1 ? 's' : ''} réponse{score > 1 ? 's' : ''} sur {TOTAL}.
                        </p>
                        <button
                            onClick={handleRestart}
                            className="w-full py-5 rounded-2xl font-black text-lg text-white bg-blue-600 hover:bg-blue-500 shadow-lg transition-all"
                        >
                            RECOMMENCER
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

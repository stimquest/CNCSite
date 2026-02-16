"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

declare global {
    interface Window {
        gsap: any;
        Draggable: any;
    }
}

// === DATA: Exact copy from jeux.html ===
const goalPool: Record<string, Array<{ amure: number | null; label: string; hint: string }>> = {
    pres: [
        { amure: -1, label: "Tribord", hint: "Le Près est à 45°. Le vent doit venir de Tribord." },
        { amure: 1, label: "Bâbord", hint: "Le Près est à 45°. Le vent doit venir de Bâbord." }
    ],
    travers: [
        { amure: -1, label: "Tribord", hint: "Mets-toi à 90°, vent venant de Tribord." },
        { amure: 1, label: "Bâbord", hint: "Vise les 90° avec le vent venant de Bâbord." }
    ],
    largue: [
        { amure: -1, label: "Tribord", hint: "Le Largue est vers l'arrière Tribord (environ 120°)." },
        { amure: 1, label: "Bâbord", hint: "Direction arrière Bâbord (environ 120°)." }
    ],
    grandLargue: [
        { amure: -1, label: "Tribord", hint: "Direction 150°, vent sur l'arrière Tribord." },
        { amure: 1, label: "Bâbord", hint: "Direction 150°, vent sur l'arrière Bâbord." }
    ],
    ventArriere: [
        { amure: null, label: "Plein Dos", hint: "Vent plein dos à 180°." }
    ]
};

const scenarioBlueprints = [
    [
        { id: "pres", title: "Sortie de Port", context: "On quitte le chenal. Place-toi au Près [AMURE] amure pour t'éloigner de la jetée.", range: [40, 50] },
        { id: "travers", title: "Le Grand Large", context: "On a de l'espace. Passe au Travers [AMURE] amure pour traverser vers l'île.", range: [85, 95] },
        { id: "largue", title: "Le Cap du Sud", context: "Le courant nous dérive. Mets-toi au Largue [AMURE] amure pour compenser.", range: [120, 135] },
        { id: "grandLargue", title: "Descente Côtière", context: "On longe la plage. Passe au Grand Largue [AMURE] amure.", range: [145, 155] },
        { id: "ventArriere", title: "Retour au bercail", context: "Le soleil se couche. Vent Arrière pour rentrer au port.", range: [175, 185] }
    ],
    [
        { id: "travers", title: "Ligne de départ", context: "Top départ ! On lance la régate au Travers [AMURE] amure.", range: [85, 95] },
        { id: "pres", title: "Bouée de dégagement", context: "Il faut virer la bouée au vent. Place-toi au Près [AMURE] amure.", range: [40, 50] },
        { id: "grandLargue", title: "Bord de portant", context: "On attaque la descente. Grand Largue [AMURE] amure !", range: [145, 155] },
        { id: "largue", title: "Option Tactique", context: "Le vent tourne. Ajuste au Largue [AMURE] amure.", range: [120, 135] },
        { id: "ventArriere", title: "Arrivée sous spi", context: "Dernière ligne droite ! Plein Vent Arrière !", range: [175, 185] }
    ],
    [
        { id: "largue", title: "Zone de patrouille", context: "On surveille la zone. Commence par un Largue [AMURE] amure.", range: [120, 135] },
        { id: "pres", title: "Intervention", context: "Un signal au vent ! Remonte vite au Près [AMURE] amure.", range: [40, 50] },
        { id: "travers", title: "Liaison Radio", context: "On garde le cap au Travers [AMURE] amure pendant le rapport.", range: [85, 95] },
        { id: "grandLargue", title: "Relève en vue", context: "La relève arrive par l'arrière. Grand Largue [AMURE] amure.", range: [145, 155] },
        { id: "ventArriere", title: "Fin de service", context: "On rentre à la base plein Vent Arrière.", range: [175, 185] }
    ]
];

const alluresData = [
    { min: 0, max: 35, name: "Face au Vent", desc: "Le bateau est face au vent, dans l'angle mort du marin.", advice: "On ne peut pas avancer ici, les voiles faseyent !" },
    { min: 35, max: 60, name: "Le Près", desc: "Remonter vers le vent au maximum.", advice: "Bordez vos voiles au maximum et gérez la gîte !" },
    { min: 60, max: 110, name: "Le Travers", desc: "Vent de côté, l'allure la plus rapide et simple.", advice: "Choquez un peu vos voiles pour gagner en puissance." },
    { min: 110, max: 160, name: "Le Largue", desc: "On s'éloigne du vent, allure très confortable.", advice: "Choquez largement vos voiles !" },
    { min: 160, max: 180, name: "Vent Arrière", desc: "Le vent souffle directement dans le dos.", advice: "Choquez au maximum, attention aux empannages !" }
];

interface Mission {
    missionTitle: string;
    context: string;
    amure: number | null;
    range: number[];
    hint: string;
}

const MAST_X = 50;
const MAST_Y = 100;
const BOOM_LENGTH = 105;

export const SailingSimulator: React.FC = () => {
    const boatRef = useRef<HTMLDivElement>(null);

    // === Mutable refs (like global variables in jeux.html) ===
    const currentModeRef = useRef<'discovery' | 'challenge'>('discovery');
    const currentMissionIndexRef = useRef(-1);
    const isMissionValidatedRef = useRef(false);
    const currentAngleRef = useRef(0);
    const currentSideRef = useRef(0);
    const activeScenarioRef = useRef<Mission[]>([]);
    const errorCountRef = useRef(0); // Error counter per mission
    const scoreRef = useRef(0); // Successful missions count

    // === React state for UI updates ===
    const [, forceUpdate] = useState(0);
    const rerender = () => forceUpdate(n => n + 1);

    // UI state
    const [angleDisplay, setAngleDisplay] = useState(0);
    const [amureTagText, setAmureTagText] = useState("Amure");
    const [amureTagClass, setAmureTagClass] = useState("bg-slate-100 text-slate-400");
    const [allureName, setAllureName] = useState("Face au Vent");
    const [allureDesc, setAllureDesc] = useState("Le bateau est face au vent.");
    const [coachAdvice, setCoachAdvice] = useState("Le vent vient toujours du haut de l'écran !");
    const [showMissionBadge, setShowMissionBadge] = useState(false);
    const [showVerifyBtn, setShowVerifyBtn] = useState(false);
    const [showNextBtn, setShowNextBtn] = useState(false);
    const [nextBtnText, setNextBtnText] = useState("MISSION SUIVANTE");
    const [adviceCardBg, setAdviceCardBg] = useState("bg-slate-50");
    const [isShaking, setIsShaking] = useState(false);
    const [showSuccessPop, setShowSuccessPop] = useState(false);
    const [showFailPop, setShowFailPop] = useState(false);
    const [errorCount, setErrorCount] = useState(0); // For UI display
    const [progressDotsOpacity, setProgressDotsOpacity] = useState("opacity-0");
    const [progressDots, setProgressDots] = useState<Array<{ active: boolean, completed: boolean, failed: boolean }>>([
        { active: false, completed: false, failed: false },
        { active: false, completed: false, failed: false },
        { active: false, completed: false, failed: false },
        { active: false, completed: false, failed: false },
        { active: false, completed: false, failed: false }
    ]);

    // Sail state
    const [boomEndX, setBoomEndX] = useState(MAST_X);
    const [boomEndY, setBoomEndY] = useState(MAST_Y + BOOM_LENGTH);
    const [sailPath, setSailPath] = useState(`M${MAST_X} ${MAST_Y} Q${MAST_X} ${MAST_Y + 50} ${MAST_X} ${MAST_Y + BOOM_LENGTH}`);
    const [showZoneDanger, setShowZoneDanger] = useState(false);

    // === Initialize GSAP and Draggable ===
    useEffect(() => {
        const loadScripts = async () => {
            if (typeof window !== 'undefined' && !window.gsap) {
                const gsapScript = document.createElement('script');
                gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
                gsapScript.async = true;
                document.body.appendChild(gsapScript);
                await new Promise((resolve) => { gsapScript.onload = resolve; });

                const draggableScript = document.createElement('script');
                draggableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Draggable.min.js';
                draggableScript.async = true;
                document.body.appendChild(draggableScript);
                await new Promise((resolve) => { draggableScript.onload = resolve; });
            }
            initDraggable();
        };
        loadScripts();
    }, []);

    const initDraggable = () => {
        if (typeof window !== 'undefined' && window.gsap && window.Draggable && boatRef.current) {
            window.gsap.registerPlugin(window.Draggable);
            window.Draggable.create(boatRef.current, {
                type: "rotation",
                inertia: true,
                onDrag: function (this: any) { updateUI(this.rotation); },
                onThrowUpdate: function (this: any) { updateUI(this.rotation); }
            });
            updateUI(0);
        }
    };

    // === updateUI - EXACT logic from jeux.html ===
    const updateUI = (rotation: number) => {
        let angle = Math.abs(rotation % 360);
        if (angle > 180) angle = 360 - angle;
        currentAngleRef.current = angle;
        setAngleDisplay(Math.round(angle));

        const normRotation = ((rotation % 360) + 360) % 360;
        const factor = Math.min(1, Math.max(0, (angle - 30) / 140));
        const boomOpeningAngle = factor * 85;

        let side = 0;
        const isFaussePanne = (normRotation > 175 && normRotation < 185);

        // Determine side and update amure tag (ONLY in discovery mode)
        if (normRotation > 5 && normRotation < 180) {
            side = 1; // Bâbord
            if (currentModeRef.current === 'discovery') {
                if (isFaussePanne) {
                    setAmureTagText("⚠️ FAUSSE PANNE");
                    setAmureTagClass("bg-orange-500 text-white animate-pulse");
                } else {
                    setAmureTagText("Bâbord Amure");
                    setAmureTagClass("bg-red-100 text-red-600");
                }
            }
        } else if (normRotation >= 180 && normRotation < 355) {
            side = -1; // Tribord
            if (currentModeRef.current === 'discovery') {
                if (isFaussePanne) {
                    setAmureTagText("⚠️ FAUSSE PANNE");
                    setAmureTagClass("bg-orange-500 text-white animate-pulse");
                } else {
                    setAmureTagText("Tribord Amure");
                    setAmureTagClass("bg-green-100 text-green-600");
                }
            }
        } else {
            side = 0;
            if (currentModeRef.current === 'discovery') {
                setAmureTagText("Dans l'axe");
                setAmureTagClass("bg-slate-100 text-slate-400");
            }
        }

        // In CHALLENGE mode: hide the amure hint, show "AMURE ?"
        if (currentModeRef.current === 'challenge') {
            setAmureTagText("AMURE ?");
            setAmureTagClass("bg-slate-200 text-slate-500");
        }

        currentSideRef.current = side;
        setShowZoneDanger(angle > 170);

        // Calculate boom and sail positions
        const finalBoomAngle = (side * boomOpeningAngle) * (Math.PI / 180);
        const newBoomEndX = MAST_X + Math.sin(finalBoomAngle) * BOOM_LENGTH;
        const newBoomEndY = MAST_Y + Math.cos(finalBoomAngle) * BOOM_LENGTH;
        const bulgeIntensity = (angle < 25) ? 0 : 38;
        const midX = (MAST_X + newBoomEndX) / 2;
        const midY = (MAST_Y + newBoomEndY) / 2;
        const bulgeX = midX + (side * bulgeIntensity * Math.cos(finalBoomAngle));
        const bulgeY = midY - (side * bulgeIntensity * Math.sin(finalBoomAngle));

        setBoomEndX(newBoomEndX);
        setBoomEndY(newBoomEndY);
        setSailPath(`M${MAST_X} ${MAST_Y} Q${bulgeX} ${bulgeY} ${newBoomEndX} ${newBoomEndY} L${MAST_X} ${MAST_Y} Z`);

        // Update allure info ONLY in discovery mode
        if (currentModeRef.current === 'discovery') {
            const allure = alluresData.find(a => angle >= a.min && angle <= a.max);
            if (allure) {
                if (isFaussePanne) {
                    setAllureName("Fausse Panne !");
                    setAllureDesc("Attention, le vent passe du mauvais côté de la voile.");
                    setCoachAdvice("Attention à la bôme, elle va traverser violemment !");
                } else {
                    setAllureName(allure.name);
                    setAllureDesc(allure.desc);
                    setCoachAdvice(allure.advice);
                }
            }
        }
        // In CHALLENGE mode: do NOT update allureName/allureDesc/coachAdvice based on rotation
        // These are set by startMission() instead
    };

    // === verifyChoice - with error management ===
    const verifyChoice = () => {
        if (isMissionValidatedRef.current || currentMissionIndexRef.current === -1) return;

        const mission = activeScenarioRef.current[currentMissionIndexRef.current];
        const isAngleOk = currentAngleRef.current >= mission.range[0] && currentAngleRef.current <= mission.range[1];
        const isSideOk = mission.amure === null || currentSideRef.current === mission.amure;

        if (isAngleOk && isSideOk) {
            validateMission();
        } else {
            // Increment error count
            errorCountRef.current++;
            setErrorCount(errorCountRef.current);

            if (errorCountRef.current >= 2) {
                // 2nd error: fail mission and move to next
                failMission();
            } else {
                // Show hint and shake
                setIsShaking(true);
                setAdviceCardBg("bg-red-50");
                setCoachAdvice(`${mission.hint} (dernier essai !)`);
                setTimeout(() => setIsShaking(false), 500);
            }
        }
    };

    // === validateMission - success ===
    const validateMission = () => {
        isMissionValidatedRef.current = true;
        scoreRef.current++; // Increment score
        setCoachAdvice("Excellent ! Manoeuvre validée.");
        setAdviceCardBg("bg-green-50");
        setShowVerifyBtn(false);
        setShowNextBtn(true);

        // Success pop
        setShowSuccessPop(true);
        setTimeout(() => setShowSuccessPop(false), 2000);

        // Update progress dots to completed
        const idx = currentMissionIndexRef.current;
        setProgressDots(prev => prev.map((dot, i) =>
            i === idx ? { active: false, completed: true, failed: false } : dot
        ));
    };

    // === failMission - 3 errors ===
    const failMission = () => {
        isMissionValidatedRef.current = true; // Mark as done (failed)
        setCoachAdvice("Dommage ! Passons à la suite...");
        setAdviceCardBg("bg-orange-50");
        setShowVerifyBtn(false);
        setShowNextBtn(true);

        // Fail pop
        setShowFailPop(true);
        setTimeout(() => setShowFailPop(false), 2000);

        // Update progress dots to failed
        const idx = currentMissionIndexRef.current;
        setProgressDots(prev => prev.map((dot, i) =>
            i === idx ? { active: false, completed: false, failed: true } : dot
        ));
    };

    // === startMission ===
    const startMission = () => {
        isMissionValidatedRef.current = false;
        errorCountRef.current = 0; // Reset error counter
        setErrorCount(0);
        currentMissionIndexRef.current++;

        if (currentMissionIndexRef.current >= activeScenarioRef.current.length) {
            finishChallenge();
            return;
        }

        const mission = activeScenarioRef.current[currentMissionIndexRef.current];
        setShowNextBtn(false);
        setShowVerifyBtn(true);
        setShowMissionBadge(true);

        setAdviceCardBg("bg-slate-50");
        setCoachAdvice("J'analyse ta manoeuvre...");

        setAllureName(mission.missionTitle);
        setAllureDesc(mission.context);

        // Update progress dots
        const idx = currentMissionIndexRef.current;
        setProgressDots(prev => prev.map((dot, i) => ({
            ...dot,
            active: i === idx
        })));
    };

    // === finishChallenge - show final score ===
    const finishChallenge = () => {
        setShowVerifyBtn(false);
        const score = scoreRef.current;
        const total = 5;

        if (score === total) {
            setAllureName("Parfait ! 5/5");
            setAllureDesc("Félicitations Capitaine ! Tu as réussi toutes les manoeuvres sans faute.");
            setCoachAdvice("Tu es un vrai skipper, prêt pour la haute mer !");
        } else if (score >= 3) {
            setAllureName(`Bien joué ! ${score}/${total}`);
            setAllureDesc("Tu as bien navigué, mais quelques manoeuvres peuvent encore être améliorées.");
            setCoachAdvice("Continue à t'entraîner pour devenir un expert !");
        } else {
            setAllureName(`Score : ${score}/${total}`);
            setAllureDesc("La navigation demande de la pratique. Ne te décourage pas !");
            setCoachAdvice("Reprends le mode Découverte pour réviser les allures.");
        }

        setNextBtnText("AUTRE SCÉNARIO");
        setShowNextBtn(true);
        setShowMissionBadge(false);
    };

    // === setMode - EXACT logic from jeux.html ===
    const setMode = (mode: 'discovery' | 'challenge') => {
        currentModeRef.current = mode;
        rerender(); // Force re-render to update mode buttons

        if (mode === 'challenge') {
            // 1. Random scenario blueprint selection
            const blueprint = scenarioBlueprints[Math.floor(Math.random() * scenarioBlueprints.length)];

            // 2. Generate random goals for each mission
            const scenario: Mission[] = blueprint.map(step => {
                const pools = goalPool[step.id];
                const goal = pools[Math.floor(Math.random() * pools.length)];
                return {
                    missionTitle: step.title,
                    context: step.context.replace("[AMURE]", goal.label),
                    amure: goal.amure,
                    range: step.range,
                    hint: goal.hint
                };
            });

            activeScenarioRef.current = scenario;
            scoreRef.current = 0; // Reset score
            errorCountRef.current = 0; // Reset errors
            setErrorCount(0);

            // Show progress dots
            setProgressDotsOpacity("opacity-100");

            // Reset progress dots
            setProgressDots([
                { active: false, completed: false, failed: false },
                { active: false, completed: false, failed: false },
                { active: false, completed: false, failed: false },
                { active: false, completed: false, failed: false },
                { active: false, completed: false, failed: false }
            ]);

            currentMissionIndexRef.current = -1;
            setNextBtnText("MISSION SUIVANTE");
            startMission();
        } else {
            // Discovery mode
            setProgressDotsOpacity("opacity-0");
            setShowVerifyBtn(false);
            setShowNextBtn(false);
            setShowMissionBadge(false);
            setAdviceCardBg("bg-slate-50");
            setCoachAdvice("Le vent vient toujours du haut de l'écran !");

            // Update UI with current rotation
            if (boatRef.current && window.gsap) {
                updateUI(window.gsap.getProperty(boatRef.current, "rotation") as number);
            }
        }
    };

    // === Handle next button click ===
    const handleNextClick = () => {
        if (nextBtnText === "AUTRE SCÉNARIO") {
            setMode('challenge');
        } else {
            startMission();
        }
    };

    // Compass marks
    const compassMarks = Array.from({ length: 72 }, (_, i) => (
        <div
            key={i}
            className={`absolute left-1/2 top-2 w-px h-[10px] bg-white/10 ${i % 6 === 0 ? 'h-[15px] w-[1.5px] bg-white/25' : ''}`}
            style={{
                transform: `rotate(${i * 5}deg)`,
                transformOrigin: '0 142px'
            }}
        />
    ));

    const currentMode = currentModeRef.current;

    return (
        <div className="max-w-[1360px] w-full mx-auto bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col lg:flex-row border border-slate-100">

            {/* LEFT: Compass Area */}
            <div className="p-8 bg-slate-50 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200 min-h-[425px] relative">

                {/* Progress Dots */}
                <div className={`absolute top-8 flex gap-3 transition-opacity duration-500 ${progressDotsOpacity}`}>
                    {progressDots.map((dot, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${dot.active
                                ? 'bg-blue-500 scale-[1.3] shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                : dot.completed
                                    ? 'bg-green-500'
                                    : dot.failed
                                        ? 'bg-red-500'
                                        : 'bg-slate-300'
                                }`}
                        />
                    ))}
                </div>

                {/* Mode Switch */}
                <div className="mb-14 flex bg-slate-200 p-1 rounded-2xl z-20 relative">
                    <button
                        onClick={() => setMode('discovery')}
                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${currentMode === 'discovery'
                            ? 'bg-[#1e40af] text-white shadow-[0_4px_12px_rgba(30,64,175,0.3)]'
                            : 'text-slate-600'
                            }`}
                    >
                        DÉCOUVERTE
                    </button>
                    <button
                        onClick={() => setMode('challenge')}
                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${currentMode === 'challenge'
                            ? 'bg-[#1e40af] text-white shadow-[0_4px_12px_rgba(30,64,175,0.3)]'
                            : 'text-slate-600'
                            }`}
                    >
                        DÉFI SKIPPER
                    </button>
                </div>

                {/* Compass Container */}
                <div
                    className="relative bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center touch-none"
                    style={{ width: 340, height: 340, border: '12px solid #e0f2fe' }}
                >
                    {/* Success Pop */}
                    <div
                        className={`absolute z-50 bg-green-500 text-white px-8 py-3 rounded-full font-black shadow-2xl text-xl pointer-events-none transition-all duration-500 ${showSuccessPop ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                            }`}
                        style={{ transform: showSuccessPop ? 'translateY(-50px)' : 'translateY(0)' }}
                    >
                        EXCELLENT !
                    </div>

                    {/* Fail Pop */}
                    <div
                        className={`absolute z-50 bg-red-500 text-white px-8 py-3 rounded-full font-black shadow-2xl text-xl pointer-events-none transition-all duration-500 ${showFailPop ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                            }`}
                        style={{ transform: showFailPop ? 'translateY(-50px)' : 'translateY(0)' }}
                    >
                        DOMMAGE !
                    </div>

                    {/* Wind Indicator */}
                    <div className="absolute text-center z-0" style={{ top: -45 }}>
                        <div className="text-xs font-black tracking-widest text-red-500">VENT</div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mx-auto">
                            <path d="M12 5v14M19 12l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* No-Go Zone */}
                    <div
                        className="absolute top-0 z-0"
                        style={{
                            width: 120,
                            height: 190,
                            background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.15), transparent)',
                            clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                        }}
                    />

                    {/* Danger Zone */}
                    <div
                        className="absolute bottom-0 z-0"
                        style={{
                            width: 60,
                            height: 190,
                            background: 'linear-gradient(to top, rgba(239, 68, 68, 0.3), transparent)',
                            clipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
                            display: showZoneDanger ? 'block' : 'none'
                        }}
                    />

                    {/* Boat */}
                    <div ref={boatRef} className="z-10 cursor-grab active:cursor-grabbing">
                        <svg
                            className="drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
                            style={{ width: 190, overflow: 'visible' }}
                            viewBox="-60 -60 220 300"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M50 0C50 0 100 80 100 160C100 200 80 215 50 215C20 215 0 200 0 160C0 80 50 0 50 0Z" fill="#1e40af" />
                            <path d="M50 5C50 5 92 80 92 160C92 195 72 208 50 208C28 208 8 195 8 160C8 80 50 5 50 5Z" fill="#3b82f6" />

                            <g id="sail-group">
                                <path id="sail-shape" d={sailPath} fill="rgba(255,255,255,0.95)" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
                                <line id="boom-line" x1={MAST_X} y1={MAST_Y} x2={boomEndX} y2={boomEndY} stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                            </g>

                            <circle cx={MAST_X} cy={MAST_Y} r="6" fill="#0f172a" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* RIGHT: Info Panel */}
            <div className="p-8 lg:p-10 flex-1 flex flex-col justify-between bg-white relative">
                <div>
                    {/* Status Row */}
                    <div className="flex items-center justify-between mb-8">
                        <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-colors ${amureTagClass}`}>
                            {amureTagText}
                        </span>
                        <span className="text-3xl font-black text-slate-900 tabular-nums tracking-tighter">{angleDisplay}°</span>
                    </div>

                    {/* Mission Badge (Challenge Mode) */}
                    {showMissionBadge && (
                        <div className="mb-2 px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded w-fit">
                            Journal de bord
                        </div>
                    )}

                    {/* Allure Name */}
                    <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
                        {allureName}
                    </h1>

                    {/* Description */}
                    <div className="space-y-8">
                        <p className="text-slate-500 leading-snug text-2xl font-medium tracking-tight">
                            {allureDesc}
                        </p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 space-y-4">
                    {/* Coach Card */}
                    <div className={`relative flex items-center gap-6 ${adviceCardBg} p-6 pl-16 rounded-[2rem] border border-slate-100 shadow-inner transition-all duration-300 ${isShaking ? 'animate-shake' : ''}`}>
                        <div className="absolute -top-6 -left-4 w-24 h-24 rounded-2xl bg-blue-600 shrink-0 overflow-hidden shadow-xl border-4 border-white transform -rotate-6 z-10">
                            <Image src="/images/Games/rayan.png" alt="Coach" width={96} height={96} className="w-full h-full object-cover" quality={100} />
                        </div>
                        <div className="flex-1 ml-12">
                            <div className="h-4 w-px bg-white/20 mx-2"></div>
                            <p className="text-xs text-blue-600 uppercase font-black tracking-widest mb-1">Coach nautique :</p>
                            <p className="text-slate-800 font-bold text-lg leading-tight italic transition-all duration-300">&quot;{coachAdvice}&quot;</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        {showVerifyBtn && (
                            <button
                                onClick={verifyChoice}
                                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all active:scale-95 shadow-xl"
                            >
                                VÉRIFIER LA POSITION
                            </button>
                        )}
                        {showNextBtn && (
                            <button
                                onClick={handleNextClick}
                                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl"
                            >
                                {nextBtnText}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Shake Animation */}
            <style jsx>{`
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
};

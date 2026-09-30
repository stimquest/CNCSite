"use client";

import React from 'react';
import { Activity, Phone } from 'lucide-react';
import { useLiveStatus } from '@/contexts/LiveStatusContext';
import { SpotTideChart } from '@/components/SpotTideChart';
import { AgonNavigationCard } from '@/components/AgonNavigationCard';
import { WeatherExpert } from '@/components/WeatherExpert';
import { PageHero } from '@/components/PageHero';
import styles from './SpotConditions.module.css';

export const SpotPageClient: React.FC<{ leSpotData: any }> = ({ leSpotData }) => {
    const { statusMessage } = useLiveStatus();
    const hero = leSpotData?.hero;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-turquoise selection:text-white">
            <PageHero
                image={hero?.heroImage || 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=2000'}
                imageAlt="La plage et le plan d’eau à Agon-Coutainville"
                tagIcon={<Activity size={14} />}
                tagText="Temps Réel • Agon-Coutainville"
                title={hero?.title || 'Le'}
                subtitle={hero?.subtitle || 'Spot.'}
                description={hero?.description || statusMessage}
                size="compact"
                bottomColor="slate"
            />

            <main className={styles.pageContent}>
                <WeatherExpert webcam={
                    <section className={styles.webcam} aria-labelledby="webcam-title">
                        <header className={styles.webcamHeader}>
                            <h2 id="webcam-title">La plage en direct</h2>
                            <span className={styles.liveLabel}>Webcam</span>
                        </header>
                        <div className={styles.video}>
                            <iframe
                                src="https://www.skaping.com/coutances/agon-coutainville/video"
                                title="Webcam de la plage d’Agon-Coutainville"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                            />
                        </div>
                        <div className={styles.webcamCaption}>
                            <span>Agon-Coutainville · vue sur la plage</span>
                            <a href="https://www.skaping.com/coutances/agon-coutainville/video" target="_blank" rel="noopener noreferrer">Ouvrir la webcam ↗</a>
                        </div>
                    </section>
                } />

                <div className={styles.lowerGrid}>
                    <section className={styles.tides} aria-labelledby="tide-title">
                        <header className={styles.sectionHeader}>
                            <div><p className={styles.eyebrow}>Au rythme de la mer</p><h2 id="tide-title" className={styles.sectionTitle}>Les marées</h2></div>
                        </header>
                        <SpotTideChart />
                    </section>
                    <aside className={styles.navigation} aria-label="Horaires de mise à l’eau à la pointe d’Agon">
                        <AgonNavigationCard />
                    </aside>
                </div>

                <section className={styles.safety} aria-labelledby="safety-title">
                    <header className={styles.safetyHeader}>
                        <h2 id="safety-title">Les repères du spot</h2>
                        <a href="tel:196" className={styles.emergency}><Phone size={16} /> Urgence en mer <strong>196</strong></a>
                    </header>
                    <div className={styles.rules}>
                        <article className={styles.rule}>
                            <span aria-hidden="true">01</span><div><h3>Gilet & équipement</h3><p>Le port du gilet de sauvetage est obligatoire pour toutes les embarcations légères.</p></div>
                        </article>
                        <article className={styles.rule}>
                            <span aria-hidden="true">02</span><div><h3>Chenal traversier</h3><p>Vitesse limitée à 5 nœuds. Priorité absolue aux zones de baignade.</p></div>
                        </article>
                        <article className={styles.rule}>
                            <span aria-hidden="true">03</span><div><h3>Marée & courants</h3><p>Attention au courant de jusant dans le havre, vers le large, particulièrement par gros coefficient.</p></div>
                        </article>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SpotPageClient;

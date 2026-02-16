import { NextResponse } from 'next/server';
import { format } from 'date-fns';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Configuration API WorldTides
// Note: Utilisation de variables d'environnement recommandées pour la clé API en production
const WORLDTIDES_API_KEY = process.env.WORLDTIDES_API_KEY || "0cfc0fea-9de7-43b4-b7cb-a6881c6f8c7e";
const LAT = 49.017;
const LON = -1.55;

// Cache de 5 jours (432 000s) pour optimiser les crédits WorldTides
// On récupère 7 jours de données, donc on a une marge de sécurité de 2 jours.
export const revalidate = 432000;

export async function GET() {
  try {
    const coeffPath = path.join(process.cwd(), 'lib/data/marees_2026.json');

    // 1. Appel API WorldTides avec Cache Next.js
    // Next.js va automatiquement mettre en cache cette réponse pendant 24h (86400s)
    // même si la revalidation de la route est différente, le fetch a sa propre politique si spécifiée.
    // Ici on aligne sur la route.
    const url = `https://www.worldtides.info/api/v3?heights&extremes&lat=${LAT}&lon=${LON}&key=${WORLDTIDES_API_KEY}&days=7&datum=CD&step=900`;


    const response = await fetch(url, {
      next: { revalidate: 86400 } // Force cache 24h
    });

    if (!response.ok) {
      throw new Error(`WorldTides API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error(`WorldTides Error: ${data.error}`);
      // En cas d'erreur API (ex: plus de crédits), on renvoie une liste vide pour ne pas casser le front
      return NextResponse.json({ tides: [], coefficients: null, error: data.error });
    }

    // 2. Traitement des données
    const tasks = [];
    if (data.heights) {
      for (const h of data.heights) {
        tasks.push({
          timestamp: h.dt * 1000,
          type: "height",
          height: h.height,
        });
      }
    }
    if (data.extremes) {
      for (const e of data.extremes) {
        tasks.push({
          timestamp: e.dt * 1000,
          type: "extreme",
          height: e.height,
          status: e.type.toLowerCase(),
        });
      }
    }

    // 3. Récupération des coefficients (Fichier statique - lecture rapide)
    let todayCoeff = null;
    try {
      if (existsSync(coeffPath)) {
        const coeffContent = await fs.readFile(coeffPath, 'utf-8');
        const coeffJson = JSON.parse(coeffContent);
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        todayCoeff = coeffJson.donnees.find((d: any) => d.date === todayStr);
      }
    } catch (e) {
      console.error("Error reading coefficients:", e);
    }

    return NextResponse.json({
      tides: tasks,
      coefficients: todayCoeff || null
    });

  } catch (error: any) {
    console.error("API Error tides:", error);
    return NextResponse.json({ error: "Tide data unavailable" }, { status: 500 });
  }
}

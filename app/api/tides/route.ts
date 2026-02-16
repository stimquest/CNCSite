import { NextResponse } from 'next/server';
import { format } from 'date-fns';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Configuration API WorldTides
// Note: Utilisation de variables d'environnement recommandées pour la clé API en production
const WORLDTIDES_API_KEY = process.env.WORLDTIDES_API_KEY || "4b319f80-cfc7-45e5-a7b5-3c81be0b20bb";
const LAT = 49.017;
const LON = -1.55;

// Cache de 5 jours (432 000s) pour optimiser les crédits WorldTides
export const revalidate = 86400; // Aligné sur 24h pour plus de sécurité

export async function GET() {
  try {
    const coeffPath = path.join(process.cwd(), 'lib/data/marees_2026.json');

    // 1. Appel API WorldTides
    const url = `https://www.worldtides.info/api/v3?heights&extremes&lat=${LAT}&lon=${LON}&key=${WORLDTIDES_API_KEY}&days=7&datum=CD&step=900`;

    const response = await fetch(url, {
      next: { revalidate: 86400 } // Cache 24h même en cas de succès
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`WorldTides API HTTP Error: ${response.status} ${response.statusText}`, errorData);

      // Si l'API est en erreur (ex: crédits), on renvoie une réponse vide gracieuse
      // Cela évite que le front-end re-tente indéfiniment si Next.js ne cache pas le 500
      return NextResponse.json({
        tides: [],
        coefficients: await getStaticCoefficients(coeffPath),
        error: "WorldTides API unavailable (credits or service issue)",
        status: response.status
      }, {
        status: 200 // On renvoie 200 pour que le front ne panique pas
      });
    }

    const data = await response.json();

    if (data.error) {
      console.error(`WorldTides Data Error: ${data.error}`);
      return NextResponse.json({
        tides: [],
        coefficients: await getStaticCoefficients(coeffPath),
        error: data.error
      });
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

    // 3. Récupération des coefficients (Fichier statique)
    const todayCoeff = await getStaticCoefficients(coeffPath);

    return NextResponse.json({
      tides: tasks,
      coefficients: todayCoeff || null
    });

  } catch (error: any) {
    console.error("API Error tides:", error);
    return NextResponse.json({ error: "Tide data unavailable" }, { status: 500 });
  }
}

// Helper pour lire les coefficients statiques
async function getStaticCoefficients(coeffPath: string) {
  try {
    if (existsSync(coeffPath)) {
      const coeffContent = await fs.readFile(coeffPath, 'utf-8');
      const coeffJson = JSON.parse(coeffContent);
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      return coeffJson.donnees.find((d: any) => d.date === todayStr);
    }
  } catch (e) {
    console.error("Error reading coefficients:", e);
  }
  return null;
}

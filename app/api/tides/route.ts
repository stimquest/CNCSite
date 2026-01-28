import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { format } from 'date-fns';

export async function GET() {
  try {
    const tidesPath = path.join(process.cwd(), 'lib/data/tides.json');
    const coeffPath = path.join(process.cwd(), 'lib/data/marees_2026.json');
    
    const [tidesContent, coeffContent] = await Promise.all([
      fs.readFile(tidesPath, 'utf-8'),
      fs.readFile(coeffPath, 'utf-8')
    ]);

    const tidesJson = JSON.parse(tidesContent);
    const coeffJson = JSON.parse(coeffContent);

    // Get today's date in YYYY-MM-DD format for matching
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayCoeff = coeffJson.donnees.find((d: any) => d.date === todayStr);

    return NextResponse.json({
      tides: tidesJson.data,
      coefficients: todayCoeff || null
    });
  } catch (error: any) {
    console.error("API Error reading local data:", error);
    return NextResponse.json({ error: "Local data unavailable" }, { status: 500 });
  }
}

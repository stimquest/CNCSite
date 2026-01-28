import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORLDTIDES_API_KEY = "0cfc0fea-9de7-43b4-b7cb-a6881c6f8c7e";
const LAT = 49.017;
const LON = -1.55;
const OUTPUT_FILE = path.join(__dirname, '../lib/data/tides.json');

async function updateTides() {
  console.log("Fetching tides from WorldTides...");
  try {
    const url = `https://www.worldtides.info/api/v3?heights&extremes&lat=${LAT}&lon=${LON}&key=${WORLDTIDES_API_KEY}&days=7&datum=CD&step=900`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(`WorldTides error: ${data.error}`);
    }

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

    // Ensure directory exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
      updatedAt: Date.now(),
      data: tasks
    }, null, 2));

    console.log(`Successfully updated tides. Saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Failed to update tides:", error);
    process.exit(1);
  }
}

updateTides();

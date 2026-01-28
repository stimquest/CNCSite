import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '9v7nk22c',
  dataset: 'production',
  apiVersion: '2024-03-01',
  token: 'skkRRG7TdeZsapsyDOYBMDR3xitKHTzFw9Xv4o3Sk4CPzMK7LRHKtV8mxRi2768mIEBhJdTzBHry8EwQNuoBT03R5FRg0YOAXhUEXZrUrGtNqHwBZmfnWBITW2C0kSHaSk6FjfJRV4Ov4HlXrX9mzkQkF8jLJ8TFwL4xNPv4Gnpsm9JAymxl',
  useCdn: false,
});

const DEMO_PLANNINGS = [
  {
    title: "Semaine du 7 au 11 Juillet 2025",
    category: "STAGES",
    days: [
      {
        dayName: "Lundi 7",
        activities: [
          { label: "Mini-Mousses", time: "10h - 12h", note: "Piscine / Cerf-volant" },
          { label: "Moussaillons", time: "14h - 16h", note: "Optimist" },
          { label: "Initiation", time: "8h - 11h" },
          { label: "Perfectionnement", time: "13h - 16h" }
        ]
      },
      {
        dayName: "Mardi 8",
        activities: [
          { label: "Mini-Mousses", time: "13h - 15h" },
          { label: "Moussaillons", time: "9h - 11h" },
          { label: "Initiation", time: "8h30 - 11h30" },
          { label: "Perfectionnement", time: "14h15 - 17h15" }
        ]
      }
    ]
  },
  {
    title: "Vacances d'Hiver - Février",
    category: "CHAR",
    days: [
      { dayName: "Lundi 16", activities: [{ label: "Char à Voile", time: "14h00 - 16h00" }] },
      { dayName: "Mardi 17", activities: [{ label: "Char à Voile", time: "14h30 - 16h30" }] },
      { dayName: "Mercredi 18", activities: [{ label: "Char à Voile", time: "14h30 - 16h30" }] }
    ]
  }
];

async function migratePlannings() {
    console.log("📅 Migration des plannings...");
    for (const plan of DEMO_PLANNINGS) {
        await client.create({
            _type: 'weeklyPlanning',
            ...plan,
            isPublished: true
        });
        console.log(`✅ Planning créé : ${plan.title}`);
    }
}

migratePlannings().catch(console.error);

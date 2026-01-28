import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '9v7nk22c',
  dataset: 'production',
  apiVersion: '2024-03-01',
  token: 'skkRRG7TdeZsapsyDOYBMDR3xitKHTzFw9Xv4o3Sk4CPzMK7LRHKtV8mxRi2768mIEBhJdTzBHry8EwQNuoBT03R5FRg0YOAXhUEXZrUrGtNqHwBZmfnWBITW2C0kSHaSk6FjfJRV4Ov4HlXrX9mzkQkF8jLJ8TFwL4xNPv4Gnpsm9JAymxl',
  useCdn: false,
});

async function cleanPlannings() {
    console.log("🧹 Nettoyage des documents Sanity...");
    const plannings = await client.fetch('*[_type == "weeklyPlanning"]');
    
    for (const plan of plannings) {
        console.log(`Fixing: ${plan.title || plan.startDate}`);
        
        // 1. Ajouter des clés manquantes
        const fixedDays = (plan.days || []).map((day, i) => ({
            ...day,
            _key: day._key || `day-${i}-${Math.random().toString(36).substr(2, 5)}`
        }));

        // 2. Supprimer les champs obsolètes
        await client.patch(plan._id)
            .set({ days: fixedDays })
            .unset(['category']) // Supprime le champ category
            .commit();
            
        console.log(`✅ ${plan._id} nettoyé.`);
    }
}

cleanPlannings().catch(console.error);

import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '9v7nk22c',
    dataset: 'production',
    apiVersion: '2024-03-01',
    token: 'skkRRG7TdeZsapsyDOYBMDR3xitKHTzFw9Xv4o3Sk4CPzMK7LRHKtV8mxRi2768mIEBhJdTzBHry8EwQNuoBT03R5FRg0YOAXhUEXZrUrGtNqHwBZmfnWBITW2C0kSHaSk6FjfJRV4Ov4HlXrX9mzkQkF8jLJ8TFwL4xNPv4Gnpsm9JAymxl',
    useCdn: false,
});

async function cleanData() {
    console.log("🧹 Cleaning up naturePage data...");

    // Fetch current document to see what's inside
    const doc = await client.fetch(`*[_type == "naturePage"][0]`);
    if (!doc || !doc.exploration || !doc.exploration.cards) {
        console.log("No exploration cards found to clean.");
        return;
    }

    console.log("Found exploration cards:", doc.exploration.cards.length);

    // Create a new cards array without 'image' or 'cardImage'
    // We only keep 'explorationImage' if it exists, or create it empty
    const cleanCards = doc.exploration.cards.map(card => {
        const { image, cardImage, ...rest } = card; // Destructure to remove bad fields
        return {
            ...rest,
            // Ensure explorationImage is kept if it exists (it might be undefined if migration left it so)
            // But if we want to be safe, we just keep what's not 'image' or 'cardImage'
        };
    });

    // Patch the document
    await client.patch(doc._id)
        .set({
            'exploration.cards': cleanCards
        })
        .commit();

    console.log("✨ consistent data! 'image' and 'cardImage' fields removed.");
}

cleanData().catch(console.error);

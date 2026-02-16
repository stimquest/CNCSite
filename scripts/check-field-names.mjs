import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '9v7nk22c',
    dataset: 'production',
    apiVersion: '2024-03-01',
    token: 'skkRRG7TdeZsapsyDOYBMDR3xitKHTzFw9Xv4o3Sk4CPzMK7LRHKtV8mxRi2768mIEBhJdTzBHry8EwQNuoBT03R5FRg0YOAXhUEXZrUrGtNqHwBZmfnWBITW2C0kSHaSk6FjfJRV4Ov4HlXrX9mzkQkF8jLJ8TFwL4xNPv4Gnpsm9JAymxl',
    useCdn: false,
});

async function check() {
    // Get raw card data to see actual field names
    const cards = await client.fetch(`*[_type == "naturePage"][0].exploration.cards`);

    if (!cards || cards.length === 0) {
        console.log("NO CARDS FOUND");
        return;
    }

    for (const card of cards) {
        console.log("--- Card:", card.title, "---");
        console.log("Fields:", Object.keys(card).join(", "));

        // Check all possible image field names
        if (card.image) console.log("  image:", typeof card.image === 'object' ? JSON.stringify(card.image) : card.image);
        if (card.cardImage) console.log("  cardImage:", typeof card.cardImage === 'object' ? JSON.stringify(card.cardImage) : card.cardImage);
        if (card.explorationImage) console.log("  explorationImage:", typeof card.explorationImage === 'object' ? JSON.stringify(card.explorationImage) : card.explorationImage);
        if (!card.image && !card.cardImage && !card.explorationImage) console.log("  ⚠ NO IMAGE FIELD AT ALL");
    }

    // Now test the actual frontend query
    console.log("\n--- Frontend Query Test ---");
    const result = await client.fetch(`*[_type == "naturePage"][0].exploration.cards[]{"title": title, "imageFromCardImage": cardImage.asset->url, "imageFromImage": image.asset->url, "imageFromExplorationImage": explorationImage.asset->url}`);
    console.log(JSON.stringify(result, null, 2));
}

check().catch(console.error);

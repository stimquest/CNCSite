import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '9v7nk22c',
    dataset: 'production',
    apiVersion: '2024-03-01',
    token: 'skkRRG7TdeZsapsyDOYBMDR3xitKHTzFw9Xv4o3Sk4CPzMK7LRHKtV8mxRi2768mIEBhJdTzBHry8EwQNuoBT03R5FRg0YOAXhUEXZrUrGtNqHwBZmfnWBITW2C0kSHaSk6FjfJRV4Ov4HlXrX9mzkQkF8jLJ8TFwL4xNPv4Gnpsm9JAymxl',
    useCdn: false,
});

async function diagnose() {
    console.log("=== DIAGNOSTIC COMPLET ===\n");

    // 1. Check published document
    const published = await client.fetch(`*[_id == "naturePage"][0].exploration`);
    console.log("📄 PUBLISHED exploration data:");
    console.log(JSON.stringify(published, null, 2));

    // 2. Check draft document
    const draft = await client.fetch(`*[_id == "drafts.naturePage"][0].exploration`);
    console.log("\n📝 DRAFT exploration data:");
    console.log(JSON.stringify(draft, null, 2));

    // 3. Test the ACTUAL GROQ query used by the frontend
    const frontendResult = await client.fetch(`*[_type == "naturePage"][0]{
        "exploration": {
            ...,
            "cards": exploration.cards[]{
                ...,
                "image": cardImage.asset->url
            }
        }
    }.exploration`);
    console.log("\n🖥️  FRONTEND QUERY RESULT:");
    console.log(JSON.stringify(frontendResult, null, 2));

    // 4. If draft has cardImage but published doesn't, tell user to publish
    if (draft && draft.cards) {
        const draftHasImages = draft.cards.some(c => c.cardImage);
        const pubHasImages = published && published.cards ? published.cards.some(c => c.cardImage) : false;

        console.log("\n=== VERDICT ===");
        console.log("Draft has images:", draftHasImages);
        console.log("Published has images:", pubHasImages);

        if (draftHasImages && !pubHasImages) {
            console.log("\n⚠️  PROBLEM FOUND: Images are in DRAFT but NOT PUBLISHED.");
            console.log("   → The user MUST click 'Publish' in the Studio for changes to appear.");
            console.log("   → Publishing the draft now...");

            // Publish by copying draft to published
            const fullDraft = await client.fetch(`*[_id == "drafts.naturePage"][0]`);
            if (fullDraft) {
                const publishedDoc = { ...fullDraft, _id: 'naturePage' };
                delete publishedDoc._rev;
                await client.createOrReplace(publishedDoc);
                // Delete the draft
                await client.delete('drafts.naturePage');
                console.log("   ✅ Published successfully!");
            }
        } else if (!draftHasImages && !pubHasImages) {
            console.log("\n⚠️  NO IMAGES uploaded yet in either draft or published.");
        } else {
            console.log("\n✅ Published document has images. Frontend should display them.");
        }
    }
}

diagnose().catch(console.error);

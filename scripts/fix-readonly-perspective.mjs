import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '9v7nk22c',
    dataset: 'production',
    apiVersion: '2024-03-01',
    token: 'skkRRG7TdeZsapsyDOYBMDR3xitKHTzFw9Xv4o3Sk4CPzMK7LRHKtV8mxRi2768mIEBhJdTzBHry8EwQNuoBT03R5FRg0YOAXhUEXZrUrGtNqHwBZmfnWBITW2C0kSHaSk6FjfJRV4Ov4HlXrX9mzkQkF8jLJ8TFwL4xNPv4Gnpsm9JAymxl',
    useCdn: false,
});

async function checkDraftStatus() {
    console.log("🔍 Checking naturePage document state...\n");

    // Check published version
    const published = await client.fetch(`*[_id == "naturePage"][0]{_id, _rev, _updatedAt}`);
    console.log("📄 Published version:", published ? JSON.stringify(published) : "NOT FOUND");

    // Check draft version
    const draft = await client.fetch(`*[_id == "drafts.naturePage"][0]{_id, _rev, _updatedAt}`);
    console.log("📝 Draft version:", draft ? JSON.stringify(draft) : "NOT FOUND");

    if (!draft) {
        console.log("\n⚠️  NO DRAFT EXISTS! The document is in published-only mode.");
        console.log("   When viewing published perspective, ALL fields are READ ONLY.");
        console.log("   Creating a draft now...\n");

        // Get the full published document
        const fullDoc = await client.fetch(`*[_id == "naturePage"][0]`);
        if (fullDoc) {
            // Create a draft by writing it with the drafts. prefix
            const draftDoc = {
                ...fullDoc,
                _id: 'drafts.naturePage',
            };
            delete draftDoc._rev; // Remove _rev to avoid conflicts

            try {
                await client.createOrReplace(draftDoc);
                console.log("✅ Draft created successfully!");
                console.log("   The user should now be able to edit the document.");
                console.log("   Refresh the Studio page and try again.");
            } catch (err) {
                console.error("❌ Failed to create draft:", err.message);
            }
        }
    } else {
        console.log("\n✅ Draft exists. The issue might be something else.");
        console.log("   Try clicking 'Edit' in the Studio or refreshing the page.");
    }
}

checkDraftStatus().catch(console.error);

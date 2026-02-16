import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '9v7nk22c',
    dataset: 'production',
    apiVersion: '2024-03-01',
    token: 'skkRRG7TdeZsapsyDOYBMDR3xitKHTzFw9Xv4o3Sk4CPzMK7LRHKtV8mxRi2768mIEBhJdTzBHry8EwQNuoBT03R5FRg0YOAXhUEXZrUrGtNqHwBZmfnWBITW2C0kSHaSk6FjfJRV4Ov4HlXrX9mzkQkF8jLJ8TFwL4xNPv4Gnpsm9JAymxl',
    useCdn: false,
});

const EXPLORATION_DATA = {
    tag: "Passer à l'action",
    title: "Explorer le Havre",
    description: "Le CNC vous propose une flotte complète pour découvrir la zone.",
    cards: [
        {
            title: "Canoë",
            subtitle: "Kayak",
            description: "L'approche furtive par excellence. Glissez sans bruit vers les bancs de sable pour observer les phoques sans les déranger.",
            features: ["Solo ou Duo", "Accessible à tous", "Idéal marée haute"],
            buttonText: "Louer un Kayak",
            buttonLink: "/club"
        },
        {
            title: "Stand Up",
            subtitle: "Paddle",
            description: "Une perspective unique sur le havre. Debout sur l'eau, profitez d'une visibilité parfaite sur les fonds marins et la lisière des dunes.",
            features: ["Équilibre & Yoga", "Location 1h/2h", "Paddle Géant dispo"],
            buttonText: "Réserver un Paddle",
            buttonLink: "/club"
        },
        {
            title: "Marche",
            subtitle: "Aquatique",
            description: "Le fitness marin par excellence. Une immersion totale pour tonifier son corps tout en profitant des bienfaits de l'iode normand.",
            features: ["Santé & Cardio", "Toute l'année", "Accompagnement expert"],
            buttonText: "Planning Marche",
            buttonLink: "/infos-pratiques"
        }
    ]
};

async function migrate() {
    console.log("🚀 Starting EXPLORATION CARD TYPE migration...");

    // 1. Prepare cards WITH CORRECT TYPE 'explorationCard'
    const cards = EXPLORATION_DATA.cards.map(cardData => ({
        _type: 'explorationCard', // <--- CRITICAL FIX: Named type instead of 'object'
        _key: Math.random().toString(36).substring(7),
        title: cardData.title,
        subtitle: cardData.subtitle,
        description: cardData.description,
        features: cardData.features,
        buttonText: cardData.buttonText,
        buttonLink: cardData.buttonLink,
        // cardImage will be undefined, ready for upload
    }));

    // 2. Patch the naturePage singleton
    console.log("Patching naturePage singleton with new type...");
    const naturePageId = (await client.fetch(`*[_type == "naturePage"][0]._id`)) || 'naturePage';

    await client.patch(naturePageId)
        .set({
            exploration: {
                tag: EXPLORATION_DATA.tag,
                title: EXPLORATION_DATA.title,
                description: EXPLORATION_DATA.description,
                cards: cards
            }
        })
        .commit();

    console.log("🎉 Migration completed! Data now uses strict 'explorationCard' type.");
}

migrate().catch(console.error);

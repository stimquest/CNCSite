import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '9v7nk22c',
    dataset: 'production',
    apiVersion: '2024-03-01',
    token: 'skkRRG7TdeZsapsyDOYBMDR3xitKHTzFw9Xv4o3Sk4CPzMK7LRHKtV8mxRi2768mIEBhJdTzBHry8EwQNuoBT03R5FRg0YOAXhUEXZrUrGtNqHwBZmfnWBITW2C0kSHaSk6FjfJRV4Ov4HlXrX9mzkQkF8jLJ8TFwL4xNPv4Gnpsm9JAymxl',
    useCdn: false,
});

const MORE_NATURE_DATA = [
    {
        name: "Grand Cormoran",
        scientificName: "Phalacrocorax carbo",
        category: "oiseau",
        description: "Excellent plongeur, on l'observe souvent les ailes déployées pour sécher son plumage perméable au soleil.",
        tags: ["Pêcheur", "Visible marée haute", "Hivernage"],
        tagColor: "text-abysse",
    },
    {
        name: "Goéland Argenté",
        scientificName: "Larus argentatus",
        category: "oiseau",
        description: "L'oiseau roi du littoral. Opportuniste et bruyant, il est reconnaissable à son manteau gris perle et ses pattes roses.",
        tags: ["Omnivore", "Nidification toits", "Protégé"],
        tagColor: "text-blue-400",
    },
    {
        name: "Euphorbe des Dunes",
        scientificName: "Euphorbia paralias",
        category: "flore",
        description: "Plante vivace des hauts de plage. Sa tige contient un latex blanc toxique qui éloigne les herbivores.",
        tags: ["Dune embryonnaire", "Toxique", "Vivace"],
        tagColor: "text-green-500",
    },
    {
        name: "Liseron des Dunes",
        scientificName: "Calystegia soldanella",
        category: "flore",
        description: "Reconnaissable à ses grandes fleurs en entonnoir rose pâle rayé de blanc. Ses racines fixent le sable.",
        tags: ["Fleur d'été", "Dune mobile", "Rampante"],
        tagColor: "text-turquoise",
    },
    {
        name: "Queue de Lièvre",
        scientificName: "Lagurus ovatus",
        category: "flore",
        description: "Petite graminée aux inflorescences douces et soyeuses, évoquant la queue d'un lapin. Emblématique des dunes.",
        tags: ["Lagure Ovale", "Douceur", "Esthétique"],
        tagColor: "text-orange-500",
    },
    {
        name: "Salicorne d'Europe",
        scientificName: "Salicornia europaea",
        category: "flore",
        description: "Plante halophile comestible (le 'haricot de mer'). Elle devient rouge vif à l'automne dans les prés-salés.",
        tags: ["Comestible", "Pré-salé", "Halophile"],
        tagColor: "text-green-500",
    }
];

async function migrate() {
    console.log(`🚀 Starting text-only migration for ${MORE_NATURE_DATA.length} species...`);

    for (const item of MORE_NATURE_DATA) {
        // Deterministic ID based on scientific name
        const deterministicId = `nature-${item.scientificName.toLowerCase().replace(/\s+/g, '-')}`;

        console.log(`Processing: ${item.name} (${deterministicId})`);

        // Check if doc exists to preserve image if already there (optional, but good practice)
        const existing = await client.fetch(`*[_id == $id][0]`, { id: deterministicId });

        const doc = {
            _type: 'natureEntity',
            _id: deterministicId,
            name: item.name,
            scientificName: item.scientificName,
            category: item.category,
            description: item.description,
            tags: item.tags,
            tagColor: item.tagColor,
            // Preserve existing image if it exists, otherwise undefined
            image: existing?.image
        };

        await client.createOrReplace(doc);
        console.log(`✅ Created/Updated: ${item.name}`);
    }

    console.log("🎉 Migration completed!");
}

migrate().catch(console.error);

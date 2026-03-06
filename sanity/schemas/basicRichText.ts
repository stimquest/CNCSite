import { defineType } from 'sanity';

export const basicRichText = defineType({
    name: 'basicRichText',
    title: 'Texte Enrichi',
    type: 'array',
    of: [
        {
            type: 'block',
            styles: [{ title: 'Normal', value: 'normal' }],
            lists: [{ title: 'Puces', value: 'bullet' }],
            marks: {
                decorators: [
                    { title: 'Gras', value: 'strong' },
                    { title: 'Italique', value: 'em' }
                ],
                annotations: [
                    {
                        name: 'link', type: 'object', title: 'Lien',
                        fields: [{ name: 'href', type: 'url', title: 'URL' }]
                    }
                ]
            }
        }
    ]
});

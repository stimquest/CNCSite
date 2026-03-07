import { defineField, defineType } from 'sanity';
import { BookA } from 'lucide-react';

export const dicoWord = defineType({
    name: 'dicoWord',
    title: 'Le Dico des Parents',
    type: 'document',
    icon: BookA,
    fields: [
        defineField({
            name: 'word',
            title: 'Le Mot',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Le mot ou l\'expression marine (ex: "Empanner").'
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'word', maxLength: 96 },
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: 'pronunciation',
            title: 'Prononciation',
            type: 'string',
            description: 'Comment ça se prononce phonétiquement (ex: "Em-pan-ner").'
        }),
        defineField({
            name: 'childQuote',
            title: 'Parole de moussaillon',
            type: 'text',
            validation: (Rule) => Rule.required(),
            description: 'La citation typique de l\'enfant.'
        }),
        defineField({
            name: 'parentFear',
            title: 'La crainte du parent',
            type: 'text',
            validation: (Rule) => Rule.required(),
            description: 'La peur ou la confusion du parent face à ce terme.'
        }),
        defineField({
            name: 'reality',
            title: 'La réalité du ponton',
            type: 'text',
            validation: (Rule) => Rule.required(),
            description: 'La vraie définition expliquée simplement.'
        }),
        defineField({
            name: 'quizAnswers',
            title: 'Propositions de Quiz',
            type: 'array',
            of: [{ type: 'string' }],
            validation: (Rule) => Rule.required().length(3),
            description: '3 phrases proposées dans le mini-jeu (dont 1 vraie et 2 fausses).'
        }),
        defineField({
            name: 'correctAnswerIdx',
            title: 'Index de la bonne réponse',
            type: 'number',
            validation: (Rule) => Rule.required().min(0).max(2),
            description: 'L\'index de la bonne réponse dans la liste ci-dessus (0, 1 ou 2).'
        })
    ],
    preview: {
        select: {
            title: 'word',
            subtitle: 'childQuote'
        }
    }
});

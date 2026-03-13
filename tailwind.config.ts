import type { Config } from "tailwindcss";

const config: any = {
  // En Tailwind v4, la configuration du thème se fait désormais dans app/globals.css via @theme.
  // On ne garde ici que la safelist pour les classes générées dynamiquement par le CMS (Sanity).
  safelist: [
    {
      pattern: /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|abysse|turquoise|taupe|sand)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern: /text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|abysse|turquoise|taupe|sand)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    'text-white',
    'bg-turquoise',
    'bg-abysse',
  ],
};
export default config;

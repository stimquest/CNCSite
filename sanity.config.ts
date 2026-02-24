import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { schemaTypes } from './sanity/schemas';
import { structure } from './sanity/studioStructure';

export default defineConfig({
  name: 'cnc-studio',
  title: 'CNC - Club Nautique Coutainville',

  projectId: 'df7iwkkw',
  dataset: 'production',

  basePath: '/studio',

  plugins: [
    structureTool({ structure }),
  ],

  schema: {
    types: schemaTypes,
  },
});

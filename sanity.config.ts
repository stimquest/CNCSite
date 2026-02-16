import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { schemaTypes } from './sanity/schemas';
import { structure } from './sanity/structure';

export default defineConfig({
  name: 'cnc-studio',
  title: 'CNC - Club Nautique Coutainville',

  projectId: '9v7nk22c',
  dataset: 'production',

  basePath: '/studio',

  plugins: [
    structureTool({ structure }),
  ],

  schema: {
    types: schemaTypes,
  },
});

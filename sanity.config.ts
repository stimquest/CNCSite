import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
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
    visionTool({ defaultApiVersion: '2024-03-01' }),
  ],

  schema: {
    types: schemaTypes,
  },
});

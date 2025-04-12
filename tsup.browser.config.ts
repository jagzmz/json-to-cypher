// tsup.browser.config.ts
import { defineConfig } from 'tsup';
import { replaceNeo4jPlugin } from './replace-neo4j.js';
import { replaceUuidPlugin } from './replace-uuid.js';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['iife'],                     // Only build IIFE for browser
  globalName: 'JSON2Cypher',         // Global variable name for your bundle
  dts: false,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false,
  treeshake: true,
  shims: true,
  keepNames: false,
  external: ['crypto'],
  // Inject our custom plugins
  esbuildPlugins: [
    replaceNeo4jPlugin,
    replaceUuidPlugin,
  ],
});

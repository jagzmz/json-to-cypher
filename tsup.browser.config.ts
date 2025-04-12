// tsup.browser.config.ts
import { defineConfig } from 'tsup';
import { replaceNeo4jPlugin } from './replace-neo4j.js';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['iife'],                     // Only build IIFE for browser
  globalName: 'JSON2Cypher',         // Global variable name for your bundle
  dts: false,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  treeshake: true,
  shims: true,
  keepNames: false,
  // Inject our custom plugin to intercept and replace neo4j imports
  esbuildPlugins: [replaceNeo4jPlugin],
});

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Entry point(s)
  format: ['cjs', 'esm'], // Output formats
  dts: true, // Generate TypeScript declaration files
  splitting: false, // Prevent code splitting into chunks
  sourcemap: true, // Generate sourcemaps
  clean: true, // Clean output directory before build
  minify: true,
  treeshake: true,
  shims: true,
  external: ['crypto']
}); 
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Entry point(s)
  format: ['cjs', 'esm'], // Output formats
  dts: true, // Generate TypeScript declaration files
  splitting: false, // Prevent code splitting into chunks
  sourcemap: process.env.NODE_ENV === 'development', // Generate sourcemaps
  clean: true, // Clean output directory before build
  minify: process.env.NODE_ENV !== 'development',
  treeshake: process.env.NODE_ENV !== 'development',
  shims: true,
  keepNames: false,
}); 
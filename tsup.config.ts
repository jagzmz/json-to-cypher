import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Entry point(s)
  format: ['cjs', 'esm'], // Output formats
  globalName: 'JSON2Cypher',
  dts: true, // Generate TypeScript declaration files
  splitting: false, // Prevent code splitting into chunks
  sourcemap: false, // Generate sourcemaps
  clean: true, // Clean output directory before build
  minify: true,
  treeshake: true,
  shims: true,
  keepNames: false,
  external: ['os'],
  noExternal: ['jsonpath-plus-browser', 'uuid'],
  platform: 'neutral',
  esbuildOptions(options) {
    // Add browser-compatible global shim for process
    options.define = {
      ...options.define,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    };
  }
}); 
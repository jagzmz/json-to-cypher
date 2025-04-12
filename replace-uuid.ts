// replace-uuid.ts
export const replaceUuidPlugin = {
  name: "replace-uuid",
  setup(build) {
    // Intercept imports destined for the 'uuid' module
    build.onResolve({ filter: /^uuid$/ }, (args) => ({
      path: args.path,
      namespace: "uuid-replace", // Use a unique namespace
    }));

    // Provide the replacement content when loading from the 'uuid-replace' namespace
    build.onLoad({ filter: /.*/, namespace: "uuid-replace" }, () => {
      // Provide a custom implementation for uuid.v4 that uses crypto.randomUUID
      return {
        contents: `
            // Replacement for 'uuid' module in browser build
            export function v4() {
              if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
                try {
                  // Directly call the browser's native function
                  return crypto.randomUUID();
                } catch (e) {
                  console.error("Error calling crypto.randomUUID directly in uuid replacement:", e);
                  // Throw an error as UUID generation is likely critical
                  throw new Error("Failed to generate UUID using crypto.randomUUID"); 
                }
              } else {
                console.error("crypto.randomUUID is not available in this environment. Cannot generate UUID.");
                // Throw an error if the required browser API is missing
                throw new Error("UUID generation not supported: crypto.randomUUID missing.");
              }
            }
            // Export v4 as the default export as well, mirroring the uuid library
            export default { v4 }; 
          `,
        loader: "js", // Load the contents as JavaScript
      };
    });
  },
}; 
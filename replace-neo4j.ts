// replace-neo4j.js
export const replaceNeo4jPlugin = {
  name: "replace-neo4j",
  setup(build) {
    // Filter for the module you want to replace (adjust the regex if needed)
    build.onResolve({ filter: /^neo4j-driver$/ }, (args) => ({
      path: args.path,
      namespace: "neo4j-replace",
    }));

    build.onLoad({ filter: /.*/, namespace: "neo4j-replace" }, () => {
      // Only expose the needed exports (adjust as needed)
      return {
        contents: `
            // Redirecting to the global neo4j object provided by the CDN
            export const int = window.neo4j.int;
            export const DateTime = window.neo4j.DateTime;
          `,
        loader: "js",
      };
    });
  },
};

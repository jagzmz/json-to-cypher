# JSON2Cypher Demo

This is a simple web-based demo of the [JSON2Cypher](https://github.com/jagzmz/json-to-cypher) library, which transforms JSON data into Cypher queries for Neo4j.

## How to Use

1. Build the project: `npm run build` or `pnpm run build`
2. The build process will automatically copy the required files to the docs folder
3. Run the demo using: `npm run docs:deploy` or `pnpm run docs:deploy`
4. Alternatively, you can serve the files from the docs folder using any HTTP server:
   - Using Node.js http-server: `npx http-server docs -o`
   - Using Python: `cd docs && python -m http.server`

## Demo Features

- **JSON Input**: Paste your JSON data or use the sample data
- **Schema Definition**: Define the mapping between your JSON and the graph
- **Generated Cypher Queries**: See the Cypher queries that would be executed
- **Graph Visualization**: (Placeholder) Shows what the resulting graph would look like
- **Example Selector**: Choose from different examples showcasing various features of JSON2Cypher:
  - Basic Example: Users and Companies
  - Blog Posts with Comments: Demonstrates nested data structures
  - Products with Categories: Shows reference nodes with many-to-many relationships
  - Orders with Products and Customers: Complex schema with multiple relationship types

## Deploying to GitHub Pages

To deploy this demo to GitHub Pages:

1. Fork or clone this repository
2. Make sure you've built the project (`npm run build`)
3. Commit and push the changes, including the `docs` folder
4. Go to your repository settings on GitHub
5. Under "GitHub Pages", select the source as "Deploy from a branch"
6. Select the "main" branch and "/docs" folder
7. Click "Save"
8. Your site will be published at `https://[your-username].github.io/[repo-name]/`

## Manual Setup

If you're not using the build script, you need to:

1. Make sure the `index.global.js` file is copied from the `dist` folder to the `docs` folder
2. Deploy the entire `docs` folder to your web server or GitHub Pages

## Learn More

For more information about the JSON2Cypher library, visit:
[https://github.com/jagzmz/json-to-cypher](https://github.com/jagzmz/json-to-cypher) 
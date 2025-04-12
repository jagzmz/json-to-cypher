# JSON2Cypher Demo

This is a simple web-based demo of the [JSON2Cypher](https://github.com/jagzmz/json-to-cypher) library, which transforms JSON data into Cypher queries for Neo4j.

## How to Use

1. Build the project: `npm run build` or `pnpm run build`
2. The build process will automatically copy the required files to the playground folder
3. Run the demo using: `npm run playground:deploy` or `pnpm run playground:deploy`
4. Alternatively, you can serve the files from the playground folder using any HTTP server:
   - Using Node.js http-server: `npx http-server playground -o`
   - Using Python: `cd playground && python -m http.server`

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

For more information about the JSON2Cypher library, visit:
[https://github.com/jagzmz/json-to-cypher](https://github.com/jagzmz/json-to-cypher) 
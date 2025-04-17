# JSON-to-Cypher Mapper (JSON2Cypher)

![JSON2Cypher Banner](https://github.com/jagzmz/json-to-cypher/blob/HEAD/assets/banner.png)

## Overview ✨

`JSON2Cypher` is a TypeScript utility designed to transform your JSON data into Cypher queries suitable for Neo4j. Define a mapping schema once, and JSON2Cypher generates the `CREATE` and `MERGE` statements for nodes and relationships based on your data structures.

**Think of it as a JSON2Cypher translator:** It takes your JSON data and schema definition, and outputs the Cypher queries needed to represent that data in a Neo4j graph.

🎮 Play with the [JSON2Cypher Demo](https://jagzmz.github.io/json-to-cypher/) to see it in action!

## Key Features ✅

*   **Declarative Schema:** Define your target graph structure (nodes, properties, relationships) in a configuration object.
*   **JSON2Cypher Generation:** Outputs an array of Cypher query strings and parameter objects.
*   **Flexible Node Identification:** Choose how nodes are identified (UUIDs, data fields, fixed IDs).
*   **Powerful Property Mapping:** Use JSONPath to extract data precisely, convert types, and set defaults.
*   **Relationship Context:** Easily create relationships between nodes created at different levels of your data (e.g., parent-child).
*   **Nested Data Handling:** Recursively map complex hierarchical data structures.
*   **Reference Nodes:** Efficiently `MERGE` common nodes (like Categories, Tags) instead of creating duplicates.
*   **Customizable Transformations:** Extend the mapper with your own data transformation logic.
*   **Neo4j Integration:** Designed to work with Neo4j drivers (like `neo4j-driver`).

## Core Concepts 🧱

### 1. The Schema (`SchemaMapping`)

The heart of JSON2Cypher is the schema. It tells the mapper how to interpret your source data.

```typescript
interface SchemaMapping {
  nodes: NodeDefinition[];          // How to create nodes from data
  relationships: RelationshipDefinition[]; // How to create relationships between nodes
  sourceDataPath?: string;          // Optional JSONPath to locate the data within a larger object
  iterationMode?: 'single' | 'collection'; // Process data as one item or an array
  subMappings?: SchemaMapping[];    // Define rules for nested data
}
```

### 2. Defining Nodes (`NodeDefinition`)

Each `NodeDefinition` specifies how to create nodes of a certain type (label) in Neo4j.

```typescript
interface NodeDefinition {
  type: string;                     // Neo4j node label (e.g., 'User', 'Product')
  idStrategy: 'uuid' | 'fromData' | 'fixed'; // How to determine the node's unique ID
  idField?: string;                 // Required if idStrategy is 'fromData'
  idValue?: string;                 // Required if idStrategy is 'fixed'
  isReference?: boolean;            // Use MERGE instead of CREATE (default: false)
  properties: PropertyDefinition[]; // Map data fields to node properties
}
```

**Node Identification (`idStrategy`)**

This is crucial for how JSON2Cypher finds or creates nodes:

*   `'uuid'`: **Use Case:** When your source data doesn't have a natural unique ID, or you want guaranteed unique graph IDs.
    *   JSON2Cypher generates a unique UUID for each node.
    *   Example: `{ type: 'LogEntry', idStrategy: 'uuid', properties: [...] }`
*   `'fromData'`: **Use Case:** Your source data already contains a unique identifier for this entity.
    *   Requires `idField`: A JSONPath expression pointing to the ID field in your source data (e.g., `'userId'`, `'productSKU'`).
    *   Example: `{ type: 'User', idStrategy: 'fromData', idField: 'userId', properties: [...] }`
*   `'fixed'`: **Use Case:** For creating predefined, singleton-like nodes (often reference nodes).
    *   Requires `idValue`: The fixed string ID this node will always have.
    *   Example: `{ type: 'Status', idStrategy: 'fixed', idValue: 'status-active', isReference: true, properties: [{ name: 'name', default: 'Active' }] }`

**Reference Nodes (`isReference: true`)**

*   When `isReference` is true, JSON2Cypher uses `MERGE` in Cypher instead of `CREATE`.
*   This is ideal for nodes that represent shared concepts (like categories, tags, statuses) where you want to connect to the *same* node instance if it already exists, rather than creating duplicates. Use with `'fixed'` or `'fromData'` if the reference data has a stable ID.

### 3. Defining Properties (`PropertyDefinition`)

Specifies how to map fields from your source data to properties on a Neo4j node.

```typescript
interface PropertyDefinition {
  name: string;                     // Neo4j property name (e.g., 'userName', 'price')
  path?: string;                    // JSONPath to the value in the source data (e.g., 'user.name', 'details.price')
  type?: string;                    // Convert value: 'integer', 'float', 'boolean', 'string', 'date'
  default?: any;                    // Value to use if 'path' finds nothing
  transformerId?: string;           // Apply a registered custom transformer
  transformerParams?: any;          // Optional parameters for the transformer
}
```

### 4. Defining Relationships (`RelationshipDefinition`)

This defines how to create relationships between the nodes generated by the mapper.

```typescript
interface RelationshipDefinition {
  type: string;                     // Neo4j relationship type (e.g., 'WORKS_AT', 'HAS_TAG')
  from: { path: string; /* ... */ }; // Source node reference
  to: { path: string; /* ... */ };   // Target node reference
  mapping?: 'oneToOne' | 'manyToMany'; // Cardinality hint (default: manyToMany)
}
```

**The Power of `from.path` and `to.path`**

These fields use JSONPath expressions to find the **unique ID** of the source and target nodes for the relationship. This is where context variables become essential:

*   `$data`: References the **current piece of data** being processed in an iteration.
    *   Example: `path: '$data.userId'` (if the relationship target ID is directly in the current data item).
*   `$current`: References **nodes created at the current mapping level**. Access nodes by type and ID.
    *   Example: `path: '$current.User.id'` (references the ID of the 'User' node created from the current data item).
*   `$parent`: References **nodes created by the parent mapping level** (used in `subMappings`).
    *   Example: `path: '$parent.Order.id'` (in an 'OrderItem' subMapping, connects back to the parent 'Order' node).
*   `$root`: References **nodes created at the top-level mapping**.
*   `$global`: References **nodes created across all contexts**, especially useful for connecting to globally defined reference nodes.
    *   Example: `path: '$global.Category[?(@.name=="Electronics")].id'` (finds a 'Category' reference node by property).

**Example: Parent-Child Relationship**

```typescript
// In a subMapping for 'comments' under a 'Post'
{
  type: 'HAS_COMMENT',
  from: { path: '$parent.Post.id' }, // ID of the Post node from the level above
  to: { path: '$current.Comment.id' } // ID of the Comment node created here
}
```

## Getting Started 🚀

```typescript
import { JSON2Cypher } from './JSON2Cypher';
// Assume you have a way to handle DB connection and query execution

// 1. Define your Schema
const schema: SchemaMapping = {
  nodes: [
    {
      type: 'User',
      idStrategy: 'fromData',
      idField: 'id', // Use the 'id' field from data as the unique ID
      properties: [
        { name: 'name', path: 'name' }, // Map data 'name' to node property 'name'
        { name: 'email', path: 'email' },
        { name: 'signupDate', path: 'createdAt', type: 'date' } // Convert string/number to Neo4j Date
      ]
    },
    {
      type: 'Company',
      idStrategy: 'fromData',
      idField: 'company.id', // ID is nested in data
      isReference: true, // Use MERGE for Company nodes
      properties: [
        { name: 'name', path: 'company.name' }
      ]
    }
  ],
  relationships: [
    {
      type: 'WORKS_AT',
      // Connect the User node created in this context...
      from: { path: '$current.User.id' },
      // ...to the Company node created in this context (or merged if existing)
      to: { path: '$current.Company.id' }
    }
  ],
  iterationMode: 'collection' // Expect an array of user data
};

// 2. Prepare your Data
const usersData = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com', createdAt: '2023-01-10', company: { id: 'c1', name: 'Innovate Inc.' } },
  { id: 'u2', name: 'Bob', email: 'bob@example.com', createdAt: '2023-02-15', company: { id: 'c2', name: 'Synergy Corp.' } },
  { id: 'u3', name: 'Charlie', email: 'charlie@example.com', createdAt: '2023-03-20', company: { id: 'c1', name: 'Innovate Inc.' } } // Works at the same company as Alice
];

// 3. Setup Neo4j Connection (using your driver wrapper)
// (Connect to your Neo4j instance here)

// 4. Create Mapper and Generate Queries
const mapper = new JSON2Cypher(schema);
const { queries } = await mapper.generateQueries(usersData);

console.log('Generated Queries:');
console.log(JSON.stringify(queries, null, 2));

// Expected result: 'queries' array contains objects with Cypher strings and parameters for
// 3 User CREATEs, 2 Company MERGEs, and 3 WORKS_AT relationships.
// You would then execute these queries using your Neo4j driver.
```

*Note: The primary output of `generateQueries` is an array of objects, each containing a `query` string and a `params` object. You are responsible for executing these queries against your Neo4j database using a driver.*

## Advanced Features 🧠🛠️

### Nested Data Structures (`subMappings`)

Handle hierarchical data naturally. Define a `subMappings` array within a `SchemaMapping`. Use `sourceDataPath` to specify the nested field, and use `$parent` context in relationship paths.

```typescript
// Example: Mapping Orders and their LineItems
const orderSchema = {
  nodes: [{ type: 'Order', idStrategy: 'fromData', idField: 'orderId', properties: [...] }],
  subMappings: [
    {
      sourceDataPath: 'items', // Process the 'items' array within each order
      iterationMode: 'collection',
      nodes: [{ type: 'LineItem', idStrategy: 'uuid', properties: [...] }],
      relationships: [
        {
          type: 'CONTAINS_ITEM',
          from: { path: '$parent.Order.id' }, // Link item to its parent Order
          to: { path: '$current.LineItem.id' }
        }
      ]
    }
  ]
};
```

#### Example: Mapping Posts and Comments

Let's map blog posts, each containing an array of comments. We want `Post` nodes and `Comment` nodes, with a `HAS_COMMENT` relationship from each Post to its Comments.

**Schema Definition (`SchemaMapping`)**

```typescript
const postCommentSchema: SchemaMapping = {
  // Top-level processes each post in the input array
  iterationMode: 'collection',
  nodes: [
    {
      type: 'Post',
      idStrategy: 'fromData',
      idField: 'postId',
      properties: [
        { name: 'title', path: 'title' },
        { name: 'content', path: 'body' }
      ]
    }
  ],
  relationships: [], // No relationships defined at the top level
  subMappings: [
    {
      // For each post, process its 'comments' array
      sourceDataPath: 'comments',
      iterationMode: 'collection',
      nodes: [
        {
          type: 'Comment',
          idStrategy: 'fromData',
          idField: 'commentId',
          properties: [
            { name: 'name', path: 'commentText' },
            { name: 'author', path: 'user' }
          ]
        }
      ],
      relationships: [
        {
          // Link the current Comment back to its parent Post
          type: 'HAS_COMMENT',
          from: { path: '$parent.Post.id' }, // Use $parent context
          to: { path: '$current.Comment.id' } // Use $current context
        }
      ]
    }
  ]
};
```

**Input Data**

```json
[
  {
    "postId": "p1",
    "title": "Intro to Graphs",
    "body": "Graphs are cool...",
    "comments": [
      { "commentId": "c1", "commentText": "Great post!", "user": "Alice" },
      { "commentId": "c2", "commentText": "Very informative.", "user": "Bob" }
    ]
  },
  {
    "postId": "p2",
    "title": "Deep Dive into Cypher",
    "body": "Let's look at MATCH...",
    "comments": [
      { "commentId": "c3", "commentText": "Needs more examples.", "user": "Charlie" }
    ]
  }
]
```

**Generated Queries (Conceptual Output)**

Running `mapper.generateQueries(inputData)` with the `postCommentSchema` would produce an array of query objects conceptually similar to this (variable names and exact parameters will differ):

```cypher
// 1. Create Post p1
CREATE (p:Post {id: 'p1'}) SET p += {title: 'Intro to Graphs', content: 'Graphs are cool...', createdAt: ...}

// 2. Create Comment c1 for Post p1
CREATE (c:Comment {id: 'c1'}) SET c += {text: 'Great post!', author: 'Alice', createdAt: ...}

// 3. Create Relationship p1 -> c1
MATCH (source) WHERE source.id = 'p1' MATCH (target) WHERE target.id = 'c1' CREATE (source)-[:HAS_COMMENT]->(target)

// 4. Create Comment c2 for Post p1
CREATE (c:Comment {id: 'c2'}) SET c += {text: 'Very informative.', author: 'Bob', createdAt: ...}

// 5. Create Relationship p1 -> c2
MATCH (source) WHERE source.id = 'p1' MATCH (target) WHERE target.id = 'c2' CREATE (source)-[:HAS_COMMENT]->(target)

// 6. Create Post p2
CREATE (p:Post {id: 'p2'}) SET p += {title: 'Deep Dive into Cypher', content: 'Let\'s look at MATCH...', createdAt: ...}

// 7. Create Comment c3 for Post p2
CREATE (c:Comment {id: 'c3'}) SET c += {text: 'Needs more examples.', author: 'Charlie', createdAt: ...}

// 8. Create Relationship p2 -> c3
MATCH (source) WHERE source.id = 'p2' MATCH (target) WHERE target.id = 'c3' CREATE (source)-[:HAS_COMMENT]->(target)
```

This demonstrates how `subMappings` combined with `sourceDataPath` and the `$parent`/`$current` contexts enable mapping of nested structures and relationships.

### Custom Value Transformers

Register functions to transform data before it's set as a property.

```typescript
import { TransformerRegistry } from './TransformerRegistry'; // Assuming registry is exported

const registry = new TransformerRegistry();
registry.register('cleanupText', (value) => value.trim().toLowerCase());

// Use in PropertyDefinition:
// { name: 'description', path: 'desc', transformerId: 'cleanupText' }

// Pass registry to constructor:
// const mapper = new JSON2Cypher(schema, registry);
```

**Default Transformers:** `toString`, `toNumber`, `extractText`, `extractQuestionText`, `extractAnswerText`, `parentId`, `jsonpath`.

### Complex JSONPath Usage

JSONPath can be used within transformers or for conditional relationship matching:

```typescript
// Property Transformation using 'jsonpath' transformer
{
  name: 'initials',
  path: 'authorName', // Input is the full name string
  transformerId: 'jsonpath',
  transformerParams: {
    // JSONPath expression applied to the *value* from 'authorName'
    path: '$..split(" ").map(word => word[0]).join("")'
  }
}

// Conditional Relationship (Connect Document to Approver User)
{
  type: 'APPROVED_BY',
  from: { path: '$current.Document.id' },
  // Find the specific user node marked as 'Approver' globally
  to: { path: '$global.User[?(@.role=="Approver")].id' }
}
```

### Example: Linking Repository to Entry Points

This example demonstrates a more complex scenario where a top-level `CodeRepository` node needs to be linked to specific `CodeBlock` nodes (defined in a sub-mapping) that are marked as entry points (`isEntryPoint: true`).

The challenge is ensuring that all `CodeBlock` nodes (including their properties like `isEntryPoint`) are processed and available in the `$global` context *before* attempting to create the `HAS_ENTRYPOINT` relationship.

**Solution:** Use a final `subMapping` with `iterationMode: "single"` and `sourceDataPath: null`. This sub-mapping runs once after all previous nodes and relationships have been processed. Inside this final step, the relationship is defined using `$root` to access the top-level `CodeRepository` and `$global` to access the collection of processed `CodeBlock` nodes, filtering them using a JSONPath expression.

**`mapping.json`:**

```json
{
    "iterationMode": "collection",
    "nodes": [
        {
            "type": "CodeRepository",
            "idStrategy": "fromData",
            "idField": "url",
            "properties": [
                {
                    "name": "url",
                    "path": "url"
                },
                {
                    "name": "commitHash",
                    "path": "commitHash"
                },
                {
                    "name": "branch",
                    "path": "branch"
                }
            ]
        }
    ],
    "relationships": [],
    "subMappings": [
        {
            "iterationMode": "collection",
            "sourceDataPath": "components",
            "nodes": [
                {
                    "type": "CodeBlock",
                    "idStrategy": "fromData",
                    "idField": "file.hash",
                    "isReference": true, // Mark as reference to populate global context
                    "properties": [
                        {
                            "name": "name",
                            "path": "id"
                        },
                        {
                            "name": "lineOfCodes",
                            "path": "file.lineOfCodes",
                            "type": "integer"
                        },
                        {
                            "name": "filePath",
                            "path": "file.path.absoluteFromRootDir"
                        },
                        {
                            "name": "code",
                            "path": "code"
                        },
                        {
                            "name": "hash",
                            "path": "file.hash"
                        },
                        {
                            "name": "isEntryPoint", // Property used for filtering
                            "path": "isEntryPoint"
                        }
                    ]
                }
            ],
            "relationships": [], // Relationships specific to this level (e.g., IMPORTS) can go here
            "subMappings": [
                // Other nested mappings related to CodeBlock...
            ]
        },
        // Final subMapping to create the HAS_ENTRYPOINT relationship
        {
            "iterationMode": "single", // Ensures this runs once after all components are processed
            "sourceDataPath": null, // No specific data item needed here
            "nodes": [],
            "relationships": [
                {
                    "type": "HAS_ENTRYPOINT",
                    "isReference": true, // Use MERGE for relationship creation
                    "from": {
                        "path": "$root.CodeRepository.id" // Get Repository ID from the root context
                    },
                    "to": {
                        // Get IDs of CodeBlocks from global context where isEntryPoint is true
                        "path": "$global.CodeBlock[?(@.isEntryPoint == true)].id"
                    }
                }
            ]
        }
    ]
}
```

This pattern ensures that relationships depending on properties set across different levels or sub-mappings are created reliably after the necessary context is built.

## API Reference 📖

### Constructor

```typescript
constructor(
  schema: SchemaMapping,
  transformerRegistry?: TransformerRegistry // Optional custom transformers
)
```

### Methods

*   `async generateQueries(data: any): Promise<{ queries: Array<{ query: string; params: Record<string, any>; isMerge?: boolean; }> }>`: Processes the data according to the schema and returns an array of Cypher query objects (query string and parameters).
*   `serializeSchema(): string`: Returns the schema as a JSON string.
*   `static fromSerialized(serializedSchema: string, transformerRegistry?: TransformerRegistry): JSON2Cypher`: Creates a mapper instance from a serialized schema string.

## Dive Deeper: Examples in Tests 🔍🎯

**The most comprehensive examples are in the test suite!** Explore `tests/JSON2Cypher.test` to see various scenarios in action, including:

*   Different ID strategies
*   Type conversions
*   Nested mappings
*   Reference nodes
*   JSONPath usage
*   Relationship contexts (`$current`, `$parent`, `$global`)

## Best Practices 👍⭐

1.  **Schema First:** Design your target graph model before writing the schema.
2.  **Start Simple:** Test with basic data and gradually add complexity.
3.  **Choose ID Strategy Wisely:** Use `fromData` for natural keys, `uuid` when needed, `fixed` (+`isReference`) for shared/singleton nodes.
4.  **Use JSONPath Contexts:** Understand `$current`, `$parent`, `$global` for robust relationship mapping.
5.  **Leverage Reference Nodes:** Avoid data duplication for common entities (Tags, Categories, Statuses).
6.  **Test Thoroughly:** Validate mappings with diverse data, especially edge cases and nested structures.
7.  **Error Handling:** The `generateQueries` process primarily focuses on mapping. Errors during query *execution* (database connectivity, constraints) need to be handled separately when you run the generated Cypher.

## Internal Details ⚙️

*   Nodes automatically get a `createdAt` timestamp property.
*   Node IDs (`id` property generated based on `idStrategy`) are expected to be unique within the graph for reliable matching.
*   `CREATE` is used for regular nodes, `MERGE` for nodes with `isReference: true`.
*   Property values are automatically converted to appropriate Neo4j types (`integer`, `float`, `boolean`, `date`) if specified in the schema.
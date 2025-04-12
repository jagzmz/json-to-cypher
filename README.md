# GraphMapper: Map Your Data to Neo4j Effortlessly 🕸️

## Overview ✨

GraphMapper is a TypeScript utility designed to simplify the process of transforming your structured data (like JSON objects or arrays) into a Neo4j graph. Define a mapping schema once, and GraphMapper handles the conversion of your data into nodes and relationships, including nested structures, property type conversions, and custom transformations.

**Think of it as a bridge:** It takes your application data on one side and translates it into the nodes and relationships that form your Neo4j graph on the other.

## Key Features ✅

*   **Declarative Schema:** Define your graph structure (nodes, properties, relationships) in a clear configuration object.
*   **Flexible Node Identification:** Choose how nodes are identified (UUIDs, data fields, fixed IDs).
*   **Powerful Property Mapping:** Use JSONPath to extract data precisely, convert types, and set defaults.
*   **Relationship Context:** Easily create relationships between nodes created at different levels of your data (e.g., parent-child).
*   **Nested Data Handling:** Recursively map complex hierarchical data structures.
*   **Reference Nodes:** Efficiently `MERGE` common nodes (like Categories, Tags) instead of creating duplicates.
*   **Customizable Transformations:** Extend the mapper with your own data transformation logic.
*   **Neo4j Integration:** Designed to work with Neo4j drivers (like `neo4j-driver`) via a simple interface (e.g., `Neo4jQuery` - *you'll need to provide this*).

## Core Concepts 🧱

### 1. The Schema (`SchemaMapping`)

The heart of GraphMapper is the schema. It tells the mapper how to interpret your source data.

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

This is crucial for how GraphMapper finds or creates nodes:

*   `'uuid'`: **Use Case:** When your source data doesn't have a natural unique ID, or you want guaranteed unique graph IDs.
    *   GraphMapper generates a unique UUID for each node.
    *   Example: `{ type: 'LogEntry', idStrategy: 'uuid', properties: [...] }`
*   `'fromData'`: **Use Case:** Your source data already contains a unique identifier for this entity.
    *   Requires `idField`: A JSONPath expression pointing to the ID field in your source data (e.g., `'userId'`, `'productSKU'`).
    *   Example: `{ type: 'User', idStrategy: 'fromData', idField: 'userId', properties: [...] }`
*   `'fixed'`: **Use Case:** For creating predefined, singleton-like nodes (often reference nodes).
    *   Requires `idValue`: The fixed string ID this node will always have.
    *   Example: `{ type: 'Status', idStrategy: 'fixed', idValue: 'status-active', isReference: true, properties: [{ name: 'name', default: 'Active' }] }`

**Reference Nodes (`isReference: true`)**

*   When `isReference` is true, GraphMapper uses `MERGE` in Cypher instead of `CREATE`.
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
import { GraphMapper } from './GraphMapper';
// Assume Neo4jQuery is your class/object that handles DB connection and query execution
// import { Neo4jQuery } from '../neo4jQuery/Neo4jQuery';

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
// const neo4jQuery = new Neo4jQuery(/* connection details */);

// 4. Create Mapper and Ingest Data
// const mapper = new GraphMapper(neo4jQuery, schema);
// await mapper.ingest(usersData);

// console.log('Data ingestion complete!');
// Expected result: 3 User nodes created, 2 Company nodes merged (c1 is reused), 3 WORKS_AT relationships created.
```

*Note: You need to provide an object (`neo4jQuery` in the example) that the `GraphMapper` can use to execute Cypher queries. This object should have methods compatible with the interactions needed (e.g., running transactions, executing queries with parameters).*

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

### Custom Value Transformers

Register functions to transform data before it's set as a property.

```typescript
import { TransformerRegistry } from './TransformerRegistry'; // Assuming registry is exported

const registry = new TransformerRegistry();
registry.register('cleanupText', (value) => value.trim().toLowerCase());

// Use in PropertyDefinition:
// { name: 'description', path: 'desc', transformerId: 'cleanupText' }

// Pass registry to constructor:
// const mapper = new GraphMapper(neo4jQuery, schema, registry);
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

## API Reference 📖

### Constructor

```typescript
constructor(
  neo4jQuery: Neo4jQuery, // Your Neo4j interaction object
  schema: SchemaMapping,
  transformerRegistry?: TransformerRegistry // Optional custom transformers
)
```

### Methods

*   `async ingest(data: any): Promise<void>`: Processes the data according to the schema and executes Cypher queries via `neo4jQuery`.
*   `serializeSchema(): string`: Returns the schema as a JSON string.
*   `static fromSerialized(neo4jQuery: Neo4jQuery, serializedSchema: string, transformerRegistry?: TransformerRegistry): GraphMapper`: Creates a mapper instance from a serialized schema string.

## Dive Deeper: Examples in Tests 🔍🎯

**The most comprehensive examples are in the test suite!** Explore `tests/GraphMapper.test.ts` to see various scenarios in action, including:

*   Different ID strategies
*   Type conversions
*   Nested mappings
*   Reference nodes
*   JSONPath usage
*   Relationship contexts (`$current`, `$parent`)

## Best Practices 👍⭐

1.  **Schema First:** Design your target graph model before writing the schema.
2.  **Start Simple:** Test with basic data and gradually add complexity.
3.  **Choose ID Strategy Wisely:** Use `fromData` for natural keys, `uuid` when needed, `fixed` (+`isReference`) for shared/singleton nodes.
4.  **Use JSONPath Contexts:** Understand `$current`, `$parent`, `$global` for robust relationship mapping.
5.  **Leverage Reference Nodes:** Avoid data duplication for common entities (Tags, Categories, Statuses).
6.  **Test Thoroughly:** Validate mappings with diverse data, especially edge cases and nested structures.
7.  **Error Handling:** The `ingest` process might throw errors (database issues, potentially mapping issues if data is invalid). Implement appropriate try/catch blocks in your application code.

## Internal Details ⚙️

*   Nodes automatically get a `createdAt` timestamp property.
*   Node IDs (`id` property generated based on `idStrategy`) are expected to be unique within the graph for reliable matching.
*   `CREATE` is used for regular nodes, `MERGE` for nodes with `isReference: true`.
*   Property values are automatically converted to appropriate Neo4j types (`integer`, `float`, `boolean`, `date`) if specified in the schema.

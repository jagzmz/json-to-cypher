# GraphMapper Documentation

## Overview

The `GraphMapper` is a flexible utility for mapping structured data to a Neo4j graph database. It transforms object-based data into nodes and relationships according to a configurable schema definition, handling complex nested data structures, property transformations, and relationship mappings.

## Key Features

- **Declarative schema definition** for mapping data to graph elements
- **Support for nested data structures** with recursive mapping
- **JSONPath expressions** for powerful property and relationship mapping
- **Property type conversion** to appropriate Neo4j types
- **Custom value transformation** with an extensible transformer registry
- **Reference node support** with different node creation strategies
- **Configurable relationship mappings** (one-to-one, many-to-many)

## Schema Configuration

The schema defines how data should be mapped to the graph database. It consists of:

### SchemaMapping Structure

```typescript
interface SchemaMapping {
  nodes: NodeDefinition[];          // Node definitions
  relationships: RelationshipDefinition[]; // Relationship definitions
  sourceDataPath?: string;          // Optional path to data within the source object
  iterationMode?: 'single' | 'collection'; // How to process the data
  subMappings?: SchemaMapping[];    // Nested mappings for hierarchical data
}
```

### Node Definition

```typescript
interface NodeDefinition {
  type: string;                     // Neo4j node label
  idStrategy: 'uuid' | 'fromData' | 'fixed'; // How to generate node IDs
  idField?: string;                 // Field containing ID (for 'fromData' strategy)
  idValue?: string;                 // Fixed ID value (for 'fixed' strategy)
  isReference?: boolean;            // Whether to use MERGE instead of CREATE
  properties: PropertyDefinition[]; // Properties to set on the node
}
```

### Property Definition

```typescript
interface PropertyDefinition {
  name: string;                     // Neo4j property name
  path?: string;                    // Path to value in source data
  type?: string;                    // Data type (integer, float, boolean, string, date)
  default?: any;                    // Default value if not found
  transformerId?: string;           // ID of transformer to apply
  transformerParams?: any;          // Parameters for transformer
}
```

### Relationship Definition

```typescript
interface RelationshipDefinition {
  type: string;                     // Neo4j relationship type
  from: {                           // Source node reference
    path: string;                   // JSONPath to node ID
    // Legacy format:
    nodeType?: string;              // Node type for lookup
    selector?: string;              // 'current', 'parent', 'root', or property condition
  };
  to: {                             // Target node reference
    path: string;                   // JSONPath to node ID
    // Legacy format:
    nodeType?: string;              // Node type for lookup
    selector?: string;              // 'current', 'parent', 'root', or property condition
  };
  mapping?: 'oneToOne' | 'manyToMany'; // Relationship cardinality
}
```

## Context in JSONPath Expressions

The GraphMapper supports special context prefixes in JSONPath expressions to access different scopes:

- `$data` - References the current data item
- `$current` - References nodes created at the current level
- `$parent` - References nodes from the parent context
- `$root` - References nodes from the root level
- `$global` - References to reference nodes across all contexts

## Usage Example

```typescript
import { GraphMapper } from './GraphMapper';
import { Neo4jQuery } from '../neo4jQuery/Neo4jQuery';

// Create schema definition
const schema = {
  nodes: [
    {
      type: 'Person',
      idStrategy: 'fromData',
      idField: 'id',
      properties: [
        { name: 'name', path: 'name' },
        { name: 'age', path: 'age', type: 'integer' }
      ]
    },
    {
      type: 'Organization',
      idStrategy: 'fromData',
      idField: 'orgId',
      properties: [
        { name: 'name', path: 'organization.name' }
      ]
    }
  ],
  relationships: [
    {
      type: 'WORKS_AT',
      from: { path: '$current.Person.id' },
      to: { path: '$current.Organization.id' }
    }
  ],
  iterationMode: 'collection'
};

// Sample data
const data = [
  {
    id: 'person1',
    name: 'John Doe',
    age: 30,
    organization: {
      orgId: 'org1',
      name: 'Acme Inc'
    }
  }
];

// Create Neo4jQuery instance (connection to database)
const neo4jQuery = new Neo4jQuery(/* connection details */);

// Create mapper instance
const mapper = new GraphMapper(neo4jQuery, schema);

// Ingest data into the graph
await mapper.ingest(data);
```

## Custom Value Transformers

GraphMapper supports custom value transformers that can transform property values before setting them on nodes:

```typescript
const registry = new TransformerRegistry();

// Register a custom transformer
registry.register('uppercase', (value) => value.toUpperCase());

// Use in schema
const schema = {
  nodes: [
    {
      type: 'Document',
      idStrategy: 'uuid',
      properties: [
        { name: 'title', path: 'title', transformerId: 'uppercase' }
      ]
    }
  ]
};

// Create mapper with custom registry
const mapper = new GraphMapper(neo4jQuery, schema, registry);
```

## Default Transformers

GraphMapper comes with several built-in transformers:

- `toString` - Converts value to string
- `toNumber` - Converts value to number
- `extractText` - Extracts text from an object with a text property
- `extractQuestionText` - Extracts question text from an object
- `extractAnswerText` - Extracts answer text from an object
- `parentId` - Extracts the ID of a parent node
- `jsonpath` - Evaluates a JSONPath expression against the value

## Complex Data Mapping Features

### Nested Data Structures

Use `subMappings` to handle nested structures:

```typescript
{
  nodes: [
    { type: 'Department', properties: [...] }
  ],
  subMappings: [
    {
      sourceDataPath: 'employees',
      iterationMode: 'collection',
      nodes: [
        { type: 'Employee', properties: [...] }
      ],
      relationships: [
        {
          type: 'WORKS_IN',
          from: { path: '$current.Employee.id' },
          to: { path: '$parent.Department.id' }
        }
      ]
    }
  ]
}
```

### Reference Nodes

Reference nodes are created with `MERGE` instead of `CREATE` and can be shared across the graph:

```typescript
{
  type: 'Category',
  idStrategy: 'fixed',
  idValue: 'category-1',
  isReference: true,
  properties: [
    { name: 'name', default: 'Main Category' }
  ]
}
```

## API Reference

### Constructor

```typescript
constructor(
  neo4jQuery: Neo4jQuery,
  schema: SchemaMapping,
  transformerRegistry?: TransformerRegistry
)
```

### Methods

#### ingest

```typescript
async ingest(data: any): Promise<void>
```
Maps the input data to graph structures and persists them to the Neo4j database.

#### serializeSchema

```typescript
serializeSchema(): string
```
Serializes the schema to a JSON string.

#### static fromSerialized

```typescript
static fromSerialized(
  neo4jQuery: Neo4jQuery, 
  serializedSchema: string, 
  transformerRegistry?: TransformerRegistry
): GraphMapper
```
Creates a new GraphMapper instance from a serialized schema.

## Advanced Usage

### Using JSONPath for Complex Property Mapping

```typescript
{
  name: 'fullName',
  path: '$data.name',
  transformerId: 'jsonpath',
  transformerParams: {
    path: '$.firstName + " " + $.lastName'
  }
}
```

### Conditional Relationship Creation

```typescript
{
  type: 'APPROVED_BY',
  from: { path: '$current.Document.id' },
  to: { path: '$global.User[?(@.role=="Approver")]..id' }
}
```

## Best Practices

1. **Start simple** - Build your schema incrementally, testing with simple data first
2. **Use appropriate ID strategies** - UUID for most nodes, fixed IDs for reference nodes
3. **Leverage JSONPath** - For complex property extraction and node references
4. **Define sensible defaults** - To handle missing data gracefully
5. **Create custom transformers** - For complex data transformations
6. **Test thoroughly** - Especially with complex nested data structures

## Internal Details

- All nodes receive a `createdAt` timestamp property
- Node IDs must be unique across the entire graph
- Reference nodes use `MERGE` to avoid duplicates
- Regular nodes use `CREATE`
- Relationships are created after all nodes
- Property values are converted to appropriate Neo4j types

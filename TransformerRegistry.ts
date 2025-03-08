// Core interfaces for serializable graph schema
export interface NodeDefinition {
  type: string;
  isReference?: boolean; // If true, uses MERGE instead of CREATE
  idStrategy: 'fixed' | 'uuid' | 'fromData';
  idField?: string; // Used when idStrategy is 'fromData'
  idValue?: string; // Used when idStrategy is 'fixed'
  properties: PropertyDefinition[];
}

export interface PropertyDefinition {
  name: string;
  path?: string; // Dot notation path to data
  default?: any;
  transformerId?: string; // Reference to a registered transformer
  transformerParams?: Record<string, any>; // Parameters to pass to the transformer
  type?: string; // Data type for conversion (integer, float, boolean, string)
}

export interface RelationshipDefinition {
  type: string;
  from: {
    nodeType?: string;
    selector?: string; // Dot notation path or query selector
    path: string; // JSONPath expression
  };
  to: {
    nodeType?: string;
    selector?: string;
    path: string; // JSONPath expression
  };
  mapping?: 'oneToOne' | 'manyToMany'; // Added mapping type
}

export interface SchemaMapping {
  sourceDataPath?: string; // Root path to data collection
  iterationMode?: 'single' | 'collection'; // Whether to iterate or treat as single entity
  nodes: NodeDefinition[];
  relationships: RelationshipDefinition[];
  subMappings?: SchemaMapping[]; // Nested mappings for hierarchical data
}

// Enhanced TransformerRegistry with parameter support
export class TransformerRegistry {
  private transformers: Record<string, (value: any, context: any, params?: Record<string, any>) => any> = {};

  register(id: string, fn: (value: any, context: any, params?: Record<string, any>) => any): void {
    this.transformers[id] = fn;
  }

  get(id: string): ((value: any, context: any, params?: Record<string, any>) => any) | undefined {
    return this.transformers[id];
  }

  // For serialization support - returns registered transformer IDs
  getRegisteredIds(): string[] {
    return Object.keys(this.transformers);
  }
}

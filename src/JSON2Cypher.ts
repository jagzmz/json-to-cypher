import { JSONPath } from "jsonpath-plus-browser";
import * as neo4j from "neo4j-driver";
import { v4 as uuidv4 } from "uuid";
import { VariableGenerator } from "./VariableGenerator";
import {
  NodeDefinition,
  RelationshipDefinition,
  SchemaMapping,
  TransformerRegistry,
} from "./TransformerRegistry";

export class JSON2Cypher {
  private readonly variableGenerator: VariableGenerator;
  private readonly transformerRegistry: TransformerRegistry;

  constructor(
    private readonly schema: SchemaMapping,
    transformerRegistry?: TransformerRegistry
  ) {
    this.variableGenerator = new VariableGenerator();
    this.transformerRegistry = transformerRegistry || new TransformerRegistry();

    // Register default transformers
    this.registerDefaultTransformers();
  }

  private registerDefaultTransformers(): void {
    this.transformerRegistry.register(
      "toString",
      (value) => value?.toString() || ""
    );
    this.transformerRegistry.register(
      "toNumber",
      (value) => Number(value) || 0
    );
    this.transformerRegistry.register("extractText", (obj) => obj?.text || "");
    this.transformerRegistry.register(
      "extractQuestionText",
      (value) => value?.question || ""
    );
    this.transformerRegistry.register(
      "extractAnswerText",
      (value) => value?.answer || ""
    );

    // Generic parent ID extractor that uses parameters
    this.transformerRegistry.register("parentId", (value, context, params) => {
      const idField = params?.idField || "id"; // Default to 'id'
      const parentType = params?.parentType;

      if (!parentType) {
        return ""; // No parent type specified
      }

      // Look in current context
      if (
        context.parentContext?.[
          `${parentType}${idField.charAt(0).toUpperCase()}${idField.slice(1)}`
        ]
      ) {
        return context.parentContext[
          `${parentType}${idField.charAt(0).toUpperCase()}${idField.slice(1)}`
        ];
      }

      // Look for parent in context
      if (context.parentContext?.[parentType]?.[idField]) {
        return context.parentContext[parentType][idField];
      }

      // Look in parent context chain
      if (context.parentContext?.parentContext) {
        // Recursively search up the context chain
        return this.findParentIdInContext(
          context.parentContext.parentContext,
          parentType,
          idField
        );
      }

      return ""; // Not found
    });

    // Add JSONPath transformer
    this.transformerRegistry.register("jsonpath", (value, context, params) => {
      if (!params?.path || value === undefined || value === null) return undefined;
      try {
        // Attempt to evaluate the path as a JSONPath expression first
        // This allows using paths like `$data.someField` if value is an object
        let result = JSONPath({ path: params.path, json: value, wrap: false });

        // If JSONPath returns undefined or the original value (meaning it might not be a path but an expression)
        // and the path contains JS-like functions, try evaluating it as an expression.
        // Caution: This uses eval-like behavior and should be used carefully.
        if (
          (result === undefined || result === value) &&
          (params.path.includes("(") || params.path.includes("["))
        ) {
          // Clean the path expression, removing the leading $. or $..
          const expression = params.path.replace(/^\$..?/, '');
          // Create a function to evaluate the expression safely with the value as context
          // We use `$` as the variable name representing the input value.
          // The expression should be applied directly to the input value $
          const functionBody = `return $${expression.startsWith('[') ? '' : '.'}${expression};`;
          const evaluator = new Function("$", functionBody);
          result = evaluator(value);
        }
        return result;
      } catch (e) {
        console.error(
          `Error evaluating JSONPath transformer path "${params.path}" on value:`,
          value,
          e
        );
        return undefined; // Return undefined on error
      }
    });
  }

  private findParentIdInContext(
    context: any,
    parentType: string,
    idField: string
  ): string {
    if (!context) return "";

    // Check if this context has the parent
    if (
      context[
        `${parentType}${idField.charAt(0).toUpperCase()}${idField.slice(1)}`
      ]
    ) {
      return context[
        `${parentType}${idField.charAt(0).toUpperCase()}${idField.slice(1)}`
      ];
    }

    if (context[parentType]?.[idField]) {
      return context[parentType][idField];
    }

    // Recursively check parent context
    return this.findParentIdInContext(
      context.parentContext,
      parentType,
      idField
    );
  }

  // Add a method to evaluate context-aware JSONPath expressions
  private evaluateContextPath(
    path: string,
    context: any,
    returnArray: boolean = false
  ): any {
    let result;

    // Handle special context prefixes
    if (path.startsWith("$current.")) {
      result = JSONPath({
        path: path.replace("$current.", "$."),
        json: context.current,
      });
    } else if (path.startsWith("$parent.")) {
      result = JSONPath({
        path: path.replace("$parent.", "$."),
        json: context.parent,
      });
    } else if (path.startsWith("$root.")) {
      result = JSONPath({
        path: path.replace("$root.", "$."),
        json: context.root,
      });
    } else if (path.startsWith("$global.")) {
      result = JSONPath({
        path: path.replace("$global.", "$."),
        json: context.global,
      });
    } else if (path.startsWith("$data.")) {
      result = JSONPath({
        path: path.replace("$data.", "$."),
        json: context.data,
      });
    } else {
      // Default case - treat as regular JSONPath
      result = JSONPath({ path, json: context });
    }

    // If the path ends with ..id or contains a filter, it's likely we want an array
    const wantsArray =
      returnArray || path.endsWith("..id") || path.includes("[?(@");

    // If result is an array
    if (Array.isArray(result)) {
      // Return the array if explicitly requested or if it seems like we want an array
      if (wantsArray) {
        return result;
      }

      // Otherwise, return the first element if it exists
      return result.length > 0 ? result[0] : undefined;
    }

    // If not an array but we want an array, wrap it
    if (wantsArray && result !== undefined) {
      return [result];
    }

    // Otherwise return as is
    return result;
  }

  async generateQueries(data: any): Promise<{
    queries: Array<{
      query: string;
      params: Record<string, any>;
      isMerge?: boolean;
    }>;
  }> {
    const { nodes, relationships } = await this.mapDataToGraph(
      this.schema,
      data
    );

    const nodeQueries = await Promise.all(
      nodes.map((node) => this.createNodeQuery(node))
    );
    const relationshipQueries = await Promise.all(
      relationships.map((rel) => this.createRelationshipQuery(rel))
    );

    return { queries: [...nodeQueries, ...relationshipQueries] };
  }

  private async mapDataToGraph(
    schema: SchemaMapping,
    data: any,
    parentContext: any = {},
    rootNodes: Record<string, any> = {}
  ): Promise<{
    nodes: Array<{ id: string; type: string; [key: string]: any }>;
    relationships: Array<{ from: string; to: string; type: string }>;
  }> {
    const nodes: Array<{ id: string; type: string; [key: string]: any }> = [];
    const relationships: Array<{ from: string; to: string; type: string }> = [];

    // Track created nodes by type for relationship creation
    const createdNodesByType: Record<
      string,
      Array<{ id: string; index: number; properties: Record<string, any> }>
    > = {};

    // Get source data at the specified path
    const sourceData = schema.sourceDataPath
      ? this.getNestedValue(data, schema.sourceDataPath.split("."))
      : data;

    if (!sourceData) return { nodes, relationships };

    // Handle collection vs. single entity
    const dataItems =
      schema.iterationMode === "collection" && Array.isArray(sourceData)
        ? sourceData
        : [sourceData];

    // Process each data item
    for (let i = 0; i < dataItems.length; i++) {
      const item = dataItems[i];

      // Initialize context structure for JSONPath
      const itemContext = {
        data: item,
        index: i,
        parent: parentContext.current || {},
        root: rootNodes.nodes || {},
        global: parentContext.global || {},
        current: {} as Record<string, any>,
      };

      // Track nodes created at this level by type
      const currentLevelNodes: Record<string, string> = {};

      // Pre-generate all node IDs first
      const nodeIds: Record<string, string> = {};
      for (const nodeDef of schema.nodes) {
        nodeIds[nodeDef.type] = this.generateNodeId(nodeDef, item);
      }

      // Create nodes from node definitions
      for (const nodeDef of schema.nodes) {
        const nodeId = nodeIds[nodeDef.type];

        // Store the node ID in context BEFORE extracting properties
        currentLevelNodes[nodeDef.type] = nodeId;

        // Enhanced context with current level nodes for property extraction
        const nodeProps = this.extractNodeProperties(nodeDef, item, {
          ...itemContext,
          nodeIds,
        });

        const node = {
          id: nodeId,
          type: nodeDef.type,
          ...nodeProps,
        };

        // Add node to current context for JSONPath access
        itemContext.current[nodeDef.type] = {
          id: nodeId,
          ...nodeProps,
        };

        // Add node to nodes array if it hasn't been added yet
        if (!nodes.some((n) => n.id === nodeId)) {
          nodes.push(node);
        }

        // Track this node by type for relationship creation
        if (!createdNodesByType[nodeDef.type]) {
          createdNodesByType[nodeDef.type] = [];
        }

        const existingNodeIndex = createdNodesByType[nodeDef.type].findIndex(
          (n) => n.id === nodeId
        );
        if (existingNodeIndex === -1) {
          createdNodesByType[nodeDef.type].push({
            id: nodeId,
            index: i,
            properties: nodeProps,
          });
        } else {
          createdNodesByType[nodeDef.type][existingNodeIndex].properties =
            nodeProps;
        }

        // If this is a root level node, track it globally
        if (Object.keys(parentContext).length === 0) {
          if (!rootNodes.nodes) rootNodes.nodes = {} as Record<string, any>;
          rootNodes.nodes[nodeDef.type] = {
            id: nodeId,
            ...nodeProps,
          };
        }

        // Add to global context if it's a reference node
        if (nodeDef.isReference) {
          if (!itemContext.global[nodeDef.type]) {
            itemContext.global[nodeDef.type] = [];
          }
          itemContext.global[nodeDef.type].push({
            id: nodeId,
            ...nodeProps,
          });
        }
      }

      // Create relationships at this level
      this.createRelationshipsWithJSONPath(
        schema.relationships,
        itemContext,
        relationships
      );

      // Process sub-mappings with enhanced context
      if (schema.subMappings) {
        for (const subMapping of schema.subMappings) {
          const { nodes: childNodes, relationships: childRels } =
            await this.mapDataToGraph(subMapping, item, itemContext, rootNodes);

          nodes.push(...childNodes);
          relationships.push(...childRels);
        }
      }
    }

    return { nodes, relationships };
  }

  private createRelationshipsWithJSONPath(
    relationshipDefs: RelationshipDefinition[],
    context: any,
    relationships: Array<{ from: string; to: string; type: string }>
  ): void {
    for (const relDef of relationshipDefs) {
      // Get source and target node IDs using JSONPath
      let fromIds: string[] = [];
      let toIds: string[] = [];

      // Handle legacy selector format
      if (relDef.from.selector && relDef.from.nodeType) {
        fromIds = this.resolveNodeIds(
          relDef.from.nodeType,
          relDef.from.selector,
          context
        );
      }
      // Handle JSONPath format
      else if (relDef.from.path) {
        // Determine if we need an array based on the relationship mapping
        const needsArray = relDef.mapping !== "oneToOne";
        const result = this.evaluateContextPath(
          relDef.from.path,
          context,
          needsArray
        );

        if (Array.isArray(result)) {
          // Extract IDs from objects or use values directly if they're already IDs
          fromIds = result
            .map((r) => (typeof r === "object" && r !== null ? r.id : r))
            .filter((id) => id != null);
        } else if (result != null) {
          // Single value - either extract ID or use directly
          const id =
            typeof result === "object" && result !== null ? result.id : result;
          if (id != null) {
            fromIds = [id];
          }
        }
      }

      // Handle legacy selector format for target
      if (relDef.to.selector && relDef.to.nodeType) {
        toIds = this.resolveNodeIds(
          relDef.to.nodeType,
          relDef.to.selector,
          context
        );
      }
      // Handle JSONPath format for target
      else if (relDef.to.path) {
        // Determine if we need an array based on the relationship mapping
        const needsArray = relDef.mapping !== "oneToOne";
        const result = this.evaluateContextPath(
          relDef.to.path,
          context,
          needsArray
        );

        if (Array.isArray(result)) {
          // Extract IDs from objects or use values directly if they're already IDs
          toIds = result
            .map((r) => (typeof r === "object" && r !== null ? r.id : r))
            .filter((id) => id != null);
        } else if (result != null) {
          // Single value - either extract ID or use directly
          const id =
            typeof result === "object" && result !== null ? result.id : result;
          if (id != null) {
            toIds = [id];
          }
        }
      }

      if (fromIds.length === 0 || toIds.length === 0) {
        console.log(`No nodes found for relationship ${relDef.type}`);
        continue;
      }

      // Handle different mapping types
      if (relDef.mapping === "oneToOne") {
        // Create one-to-one relationships based on array index
        const maxLength = Math.min(fromIds.length, toIds.length);
        for (let i = 0; i < maxLength; i++) {
          relationships.push({
            from: fromIds[i],
            to: toIds[i],
            type: relDef.type,
          });
        }
      } else {
        // Default: Create many-to-many relationships
        for (const fromId of fromIds) {
          for (const toId of toIds) {
            relationships.push({
              from: fromId,
              to: toId,
              type: relDef.type,
            });
          }
        }
      }
    }
  }

  // Legacy method - keep for backward compatibility
  private resolveNodeIds(
    nodeType: string,
    selector: string,
    context: any
  ): string[] {
    // Simple case: direct reference to a node at current level
    if (selector === "current" && context.current?.[nodeType]) {
      return [context.current[nodeType].id];
    }

    // Reference to parent node
    if (selector === "parent" && context.parent?.[nodeType]) {
      return [context.parent[nodeType].id];
    }

    // Reference to root node
    if (selector === "root" && context.root?.[nodeType]) {
      return [context.root[nodeType].id];
    }

    // Enhanced: Reference nodes by property condition
    if (selector.includes("=")) {
      const [propName, propValue] = selector.split("=");

      // Check in global context for reference nodes
      if (context.global?.[nodeType]) {
        const matchingNodes = context.global[nodeType].filter(
          (n: { [x: string]: string }) => n[propName] === propValue
        );
        return matchingNodes.map((n: { id: any }) => n.id);
      }
    }

    return [];
  }

  private generateNodeId(nodeDef: NodeDefinition, data: any): string {
    const idField = nodeDef.idField || "id"; // Default to 'id'
    switch (nodeDef.idStrategy) {
      case "fixed":
        if (!nodeDef.idValue) {
          throw new Error(
            `Fixed ID strategy requires an idValue for node type ${nodeDef.type}`
          );
        }
        return nodeDef.idValue;
      case "fromData":
        // Use getNestedValue to handle potentially nested idFields
        const idValue = this.getNestedValue(data, idField.split('.'));
        if (idValue === null || idValue === undefined) {
          // Throw error if ID is missing for fromData strategy
          throw new Error(
            `ID field '${idField}' not found in data for node type ${nodeDef.type} using 'fromData' strategy.`
          );
        }
        return String(idValue); // Ensure ID is a string
      case "uuid":
      default:
        return uuidv4();
    }
  }

  private extractNodeProperties(
    nodeDef: NodeDefinition,
    data: any,
    context: any
  ): Record<string, any> {
    const result: Record<string, any> = {};

    // Add createdAt timestamp to all nodes
    result.createdAt = neo4j.DateTime.fromStandardDate(new Date());

    for (const propDef of nodeDef.properties) {
      let value;

      // If propDef.path is provided and starts with $, treat as JSONPath
      if (propDef.path && propDef.path.startsWith("$")) {
        // For properties, we typically want a single value, not an array
        value = this.evaluateContextPath(propDef.path, context, false);
      }
      // Otherwise get value from data using dot notation
      else if (propDef.path) {
        value = this.getNestedValue(data, propDef.path.split("."));
      }

      // Apply transformer if specified
      if (propDef.transformerId) {
        const transformer = this.transformerRegistry.get(propDef.transformerId);
        if (transformer) {
          value = transformer(value, context, propDef.transformerParams);
        }
      }

      // Use default if value is undefined
      if (value === undefined && propDef.default !== undefined) {
        value = propDef.default;
      }

      // Apply type conversion if specified
      if (propDef.type) {
        value = this.convertValueToType(value, propDef.type);
      }

      result[propDef.name] = value;
    }

    return result;
  }

  private convertValueToType(value: any, type: string): any {
    if (value === null || value === undefined) {
      return value;
    }

    switch (type.toLowerCase()) {
      case "integer":
      case "int":
        // return Number.isFinite(value) ? Math.floor(value) : parseInt(value, 10);
        return neo4j.int(value);
      case "float":
      case "double":
        return Number.isFinite(value) ? value : parseFloat(value);
      case "boolean":
      case "bool":
        return Boolean(value);
      case "string":
        return String(value);
      case "date":
        return new Date(value);
      default:
        return value;
    }
  }

  private getNestedValue(obj: any, path: string[]): any {
    return path.reduce(
      (prev, curr) =>
        prev && prev[curr] !== undefined ? prev[curr] : undefined,
      obj
    );
  }

  private async createNodeQuery(node: {
    id: string;
    type: string;
    [key: string]: any;
  }) {
    const { id, type, ...properties } = node;
    const varName = this.variableGenerator.getNext();

    // Determine if this is a reference node (using MERGE)
    const nodeDefinition = this.findNodeDefinition(type);
    const isMerge = nodeDefinition?.isReference === true;
    const operation = isMerge ? "MERGE" : "CREATE";

    const query = `
      ${operation} (${varName}:${type} {id: $id_${varName}}) 
      SET ${varName} += $props_${varName}
    `;

    const params = {
      [`id_${varName}`]: id,
      [`props_${varName}`]: properties,
    };

    return { query, params, isMerge };
  }

  private findNodeDefinition(type: string): NodeDefinition | undefined {
    const findInMapping = (
      mapping: SchemaMapping
    ): NodeDefinition | undefined => {
      const direct = mapping.nodes.find((n) => n.type === type);
      if (direct) return direct;

      if (mapping.subMappings) {
        for (const subMapping of mapping.subMappings) {
          const inSub = findInMapping(subMapping);
          if (inSub) return inSub;
        }
      }

      return undefined;
    };

    return findInMapping(this.schema);
  }

  private async createRelationshipQuery(relationship: {
    from: string;
    to: string;
    type: string;
  }) {
    const { from, to, type } = relationship;
    const relVar = this.variableGenerator.getNext();

    const query = `
      MATCH (source) WHERE source.id = $fromId
      MATCH (target) WHERE target.id = $toId
      CREATE (source)-[${relVar}:${type}]->(target)
    `;

    const params = {
      fromId: from,
      toId: to,
    };

    return { query, params };
  }

  serializeSchema(): string {
    return JSON.stringify(this.schema, null, 2);
  }

  static fromSerialized(
    serializedSchema: string,
    transformerRegistry?: TransformerRegistry
  ): JSON2Cypher {
    const schema = JSON.parse(serializedSchema);
    return new JSON2Cypher(schema, transformerRegistry);
  }
}

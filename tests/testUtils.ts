import { isDateTime, isInt, int } from "neo4j-driver-lite";

// Helper to check common node properties including createdAt
export const expectNodeProps = (
  node: any,
  expectedProps: Record<string, any>,
  checkCreatedAt: boolean = true
) => {
  for (const key in expectedProps) {
    expect(node).toHaveProperty(key);
    const expectedValue = expectedProps[key];
    const actualValue = node[key];

    if (isInt(expectedValue) && isInt(actualValue)) {
      expect(actualValue.toNumber()).toBe(expectedValue.toNumber());
    } else if (typeof expectedValue === 'number' && expectedValue % 1 !== 0) {
       // Handle potential float comparison issues
       expect(actualValue).toBeCloseTo(expectedValue);
    } else {
      expect(actualValue).toBe(expectedValue);
    }
  }

  if (checkCreatedAt) {
    expect(node).toHaveProperty("createdAt");
    expect(isDateTime(node.createdAt)).toBeTruthy();
  }
};

// Helper to check relationship properties
export const expectRelationshipProps = (
  rel: any,
  expectedProps: { from: string; to: string; type: string }
) => {
  expect(rel).toHaveProperty("from", expectedProps.from);
  expect(rel).toHaveProperty("to", expectedProps.to);
  expect(rel).toHaveProperty("type", expectedProps.type);
};

// Helper to check Cypher Query structure and params
interface QueryCheckArgs {
  queryData: { query: string; params: Record<string, any> };
  expectedQuerySubstrings?: string[];
  exactParams?: Record<string, any>;
  paramSubChecks?: Record<string, any>; // Check specific props within a param object
}

const checkQuery = ({ queryData, expectedQuerySubstrings, exactParams, paramSubChecks }: QueryCheckArgs) => {
    if (expectedQuerySubstrings) {
        expectedQuerySubstrings.forEach(sub => expect(queryData.query).toContain(sub));
    }
    if (exactParams) {
        expect(queryData.params).toEqual(exactParams);
    }
    if(paramSubChecks){
        for (const paramKey in paramSubChecks) {
            expect(queryData.params).toHaveProperty(paramKey);
            const propsToCheck = paramSubChecks[paramKey];
            expectNodeProps(queryData.params[paramKey], propsToCheck);
        }
    }
}

// Check CREATE node query
export const expectCreateNodeQuery = (
    queryData: { query: string; params: Record<string, any> },
    nodeLabel: string,
    expectedId: string,
    expectedProps: Record<string, any>
) => {
    // Use simpler toContain checks
    expect(queryData.query).toContain('CREATE');
    expect(queryData.query).toContain(`:${nodeLabel}`);
    expect(queryData.query).toContain(`{id: $`); // Check that ID is set via parameter
    expect(queryData.query).toContain('SET');
    expect(queryData.query).toContain(`+= $`); // Check that props are added via parameter

    // Find the actual props key (e.g., 'props_c1', 'props_c2')
    const actualPropsKey = Object.keys(queryData.params).find(
        (key) => key.startsWith("props_")
    );
    expect(actualPropsKey).toBeDefined(); // Ensure we found a props key

    // Check props param object using the found key
    if (actualPropsKey) {
        expect(queryData.params).toHaveProperty(actualPropsKey);
        expectNodeProps(queryData.params[actualPropsKey], expectedProps);
    }

    // Find the actual id key (e.g., 'id_c1')
    const actualIdKey = Object.keys(queryData.params).find(
        (key) => key.startsWith("id_")
    );
    expect(actualIdKey).toBeDefined(); // Ensure we found an id key

    // Check id param value using the found key
    if (actualIdKey) {
        expect(queryData.params).toHaveProperty(actualIdKey, expectedId);
    }
};

// Check MERGE node query (assumes MERGE on id, then SET props)
export const expectMergeNodeQuery = (
    queryData: { query: string; params: Record<string, any> },
    nodeLabel: string,
    idParamKey: string, // e.g., 'id_org1'
    propsParamKey: string, // e.g., 'props_org1'
    expectedId: string,
    expectedProps: Record<string, any>
) => {
    // Use simpler toContain checks
    expect(queryData.query).toContain('MERGE');
    expect(queryData.query).toContain(`:${nodeLabel}`);
    expect(queryData.query).toContain(`{id: $`); // Check that ID is matched via parameter
    expect(queryData.query).toContain('SET');
    expect(queryData.query).toMatch(/SET\s+\w+\s*\+=\s*\$\w+/); // Keep regex for SET pattern

    // Find the actual props key
    const actualPropsKey = Object.keys(queryData.params).find(
        (key) => key.startsWith("props_")
    );
    expect(actualPropsKey).toBeDefined();

    // Find the actual id key
    const actualIdKey = Object.keys(queryData.params).find(
        (key) => key.startsWith("id_")
    );
    expect(actualIdKey).toBeDefined();

    // Check props param object using the found key
    if (actualPropsKey) {
        expect(queryData.params).toHaveProperty(actualPropsKey);
        expectNodeProps(queryData.params[actualPropsKey], expectedProps);
    }

    // Check id param value using the found key
    if (actualIdKey) {
        expect(queryData.params).toHaveProperty(actualIdKey, expectedId);
    }
};

// Check Relationship MERGE query (assumes MATCH on id)
export const expectRelationshipQuery = (
    queryData: { query: string; params: Record<string, any> },
    relType: string,
    expectedIdValues: { from: string; to: string } // Expecting actual ID values
) => {
    // Check structural patterns
    expect(queryData.query).toMatch(/MATCH\s+\(\w+\)\s+WHERE\s+\w+\.id\s*=\s*\$fromId/i);
    expect(queryData.query).toMatch(/MATCH\s+\(\w+\)\s+WHERE\s+\w+\.id\s*=\s*\$toId/i);
    // Check for the relationship type pattern simply
    expect(queryData.query).toContain(`:${relType}]->`); // e.g., :WORKS_AT]->

    // Check parameter values directly
    expect(queryData.params).toHaveProperty("fromId", expectedIdValues.from);
    expect(queryData.params).toHaveProperty("toId", expectedIdValues.to);
};

// Helper to check createdAt directly on props object
export const hasValidCreatedAt = (props: any) => {
  expect(props).toHaveProperty("createdAt");
  expect(isDateTime(props.createdAt)).toBeTruthy();
}; 
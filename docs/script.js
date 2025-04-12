document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cypherOutput = document.getElementById('cypher-output');
    const graphVis = document.getElementById('graph-vis');
    const queriesHeading = document.getElementById('queries-heading');
    const generateBtn = document.getElementById('generate-queries');
    const loadSampleDataBtn = document.getElementById('load-sample-data');
    const loadSampleSchemaBtn = document.getElementById('load-sample-schema');
    const exampleSelect = document.getElementById('example-select');
    const loadExampleBtn = document.getElementById('load-example');
    
    // Initialize JSON editors
    const jsonEditor = new JSONEditor(document.getElementById('json-editor'), {
        mode: 'code',
        modes: ['tree', 'code'],
        mainMenuBar: true,
        navigationBar: true,
        search: true
    });
    
    const schemaEditor = new JSONEditor(document.getElementById('schema-editor'), {
        mode: 'code',
        modes: ['tree', 'code'],
        mainMenuBar: true,
        navigationBar: true,
        search: true
    });

    // Sample data for demo
    const sampleData = [
        { 
            id: 'u1', 
            name: 'Alice', 
            email: 'alice@example.com', 
            createdAt: '2023-01-10', 
            company: { 
                id: 'c1', 
                name: 'Innovate Inc.' 
            },
            friends: ['u2'] // Alice is friends with Bob
        },
        { 
            id: 'u2', 
            name: 'Bob', 
            email: 'bob@example.com', 
            createdAt: '2023-02-15', 
            company: { 
                id: 'c2', 
                name: 'Synergy Corp.' 
            } 
        },
        { 
            id: 'u3', 
            name: 'Charlie', 
            email: 'charlie@example.com', 
            createdAt: '2023-03-20', 
            company: { 
                id: 'c1', 
                name: 'Innovate Inc.' 
            } 
        }
    ];

    // Sample schema for demo
    const sampleSchema = {
        nodes: [
            {
                type: 'User',
                idStrategy: 'fromData',
                idField: 'id',
                properties: [
                    { name: 'name', path: 'name' },
                    { name: 'email', path: 'email' },
                    { name: 'signupDate', path: 'createdAt', type: 'date' }
                ]
            },
            {
                type: 'Company',
                idStrategy: 'fromData',
                idField: 'company.id',
                isReference: true,
                properties: [
                    { name: 'name', path: 'company.name' }
                ]
            }
        ],
        relationships: [
            {
                type: 'WORKS_AT',
                from: { path: '$current.User.id' },
                to: { path: '$current.Company.id' }
            },
            {
                type: 'FRIEND_OF',
                from: { path: '$current.User.id' },
                to: { path: '$data.friends[*]' },
                mapping: 'oneToMany'
            }
        ],
        iterationMode: 'collection'
    };

    // Load sample data
    loadSampleDataBtn.addEventListener('click', function() {
        jsonEditor.set(sampleData);
        // jsonEditor.expandAll();
        // Also load the corresponding sample schema for the basic example -- KEEP THE REVERTED STATE
        // schemaEditor.set(sampleSchema);
        // schemaEditor.expandAll();
    });

    // Load sample schema
    loadSampleSchemaBtn.addEventListener('click', function() {
        schemaEditor.set(sampleSchema);
        // schemaEditor.expandAll();
    });

    // Load example based on selection
    loadExampleBtn.addEventListener('click', function() {
        const selectedExample = exampleSelect.value;
        
        if (selectedExample === 'basic') {
            jsonEditor.set(sampleData);
            // jsonEditor.expandAll();
            schemaEditor.set(sampleSchema);
            // schemaEditor.expandAll();
            return;
        }
        
        // Check if advanced examples are loaded
        if (window.advancedExamples && window.advancedExamples[selectedExample]) {
            const example = window.advancedExamples[selectedExample];
            jsonEditor.set(example.data);
            // jsonEditor.expandAll();
            schemaEditor.set(example.schema);
            // schemaEditor.expandAll();
        } else {
            showError('Selected example not found. Make sure advanced-examples.js is loaded.');
        }
    });

    // Generate Cypher queries
    generateBtn.addEventListener('click', async function() {
        cypherOutput.innerHTML = '';
        graphVis.innerHTML = '';
        queriesHeading.textContent = 'Generated Cypher Queries';

        try {
            // Get JSON data from editors
            const data = jsonEditor.get();
            const schema = schemaEditor.get();
            
            // Check if JSON2Cypher is available
            if (typeof JSON2Cypher === 'undefined') {
                showError('JSON2Cypher library not loaded. Make sure index.global.js is present in the docs folder.');
                return;
            }
            
            // Create mapper instance
            const mapper = new JSON2Cypher.JSON2Cypher(schema);
            
            // Generate queries
            const result = await mapper.generateQueries(data);
            
            // Update heading with count
            queriesHeading.textContent = `Generated Cypher Queries (${result.queries.length})`;
            
            // Display queries
            displayQueries(result.queries);
            
            // Visualize the graph
            visualizeGraph(result.queries);
            
            // Scroll to the graph visualization after a short delay
            setTimeout(() => {
                graphVis.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100); // 100ms delay
            
        } catch (error) {
            showError(`Error: ${error.message}`);
        }
    });

    // Display Cypher queries in the output area
    function displayQueries(queries) {
        if (queries.length === 0) {
            cypherOutput.innerHTML = '<div class="error">No queries generated</div>';
            return;
        }

        // Clear previous output
        cypherOutput.innerHTML = '';

        const fragment = document.createDocumentFragment();
        
        // Group queries by type for better organization
        const nodeQueries = queries.filter(q => !q.params.fromId && !q.params.toId);
        const relationshipQueries = queries.filter(q => q.params.fromId && q.params.toId);
        
        // Add tabs for navigation
        const tabContainer = document.createElement('div');
        tabContainer.className = 'query-tabs';
        
        const tabAll = document.createElement('button');
        tabAll.className = 'query-tab-btn active';
        tabAll.textContent = `All (${queries.length})`;
        tabAll.dataset.target = 'all';
        
        const tabNodes = document.createElement('button');
        tabNodes.className = 'query-tab-btn';
        tabNodes.textContent = `Nodes (${nodeQueries.length})`;
        tabNodes.dataset.target = 'nodes';
        
        const tabRels = document.createElement('button');
        tabRels.className = 'query-tab-btn';
        tabRels.textContent = `Relationships (${relationshipQueries.length})`;
        tabRels.dataset.target = 'relationships';
        
        tabContainer.appendChild(tabAll);
        tabContainer.appendChild(tabNodes);
        tabContainer.appendChild(tabRels);
        
        fragment.appendChild(tabContainer);
        
        // Create container for query sections
        const querySections = document.createElement('div');
        querySections.className = 'query-sections';
        
        // All queries section
        const allSection = document.createElement('div');
        allSection.className = 'query-section active';
        allSection.dataset.section = 'all';
        
        // Nodes section
        const nodesSection = document.createElement('div');
        nodesSection.className = 'query-section';
        nodesSection.dataset.section = 'nodes';
        
        // Relationships section
        const relsSection = document.createElement('div');
        relsSection.className = 'query-section';
        relsSection.dataset.section = 'relationships';
        
        // Add queries to their respective sections
        queries.forEach((queryObj, index) => {
            const queryItem = createQueryItem(queryObj, index);
            allSection.appendChild(queryItem.cloneNode(true));
        });
        
        nodeQueries.forEach((queryObj, index) => {
            const queryItem = createQueryItem(queryObj, index);
            nodesSection.appendChild(queryItem);
        });
        
        relationshipQueries.forEach((queryObj, index) => {
            const queryItem = createQueryItem(queryObj, index);
            relsSection.appendChild(queryItem);
        });
        
        querySections.appendChild(allSection);
        querySections.appendChild(nodesSection);
        querySections.appendChild(relsSection);
        
        fragment.appendChild(querySections);
        
        // Add tab switching functionality
        tabContainer.addEventListener('click', event => {
            if (event.target.classList.contains('query-tab-btn')) {
                // Remove active class from all tabs
                tabContainer.querySelectorAll('.query-tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked tab
                event.target.classList.add('active');
                
                // Show corresponding section
                const targetSection = event.target.dataset.target;
                querySections.querySelectorAll('.query-section').forEach(section => {
                    section.classList.remove('active');
                    if (section.dataset.section === targetSection) {
                        section.classList.add('active');
                    }
                });
            }
        });
        
        cypherOutput.appendChild(fragment);
        
        // Add click handlers to all params toggles
        document.querySelectorAll('.params-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const paramsPre = this.nextElementSibling;
                paramsPre.classList.toggle('hidden');
                this.textContent = paramsPre.classList.contains('hidden') ? 
                    'Show Parameters' : 'Hide Parameters';
            });
        });
    }

    // Helper function to create a query item
    function createQueryItem(queryObj, index) {
            const queryItem = document.createElement('div');
            queryItem.className = 'query-item';
            
            // Query content
            const pre = document.createElement('pre');
            pre.textContent = queryObj.query.trim();
            queryItem.appendChild(pre);
            
            // Add parameters if they exist
            if (queryObj.params && Object.keys(queryObj.params).length > 0) {
            const paramsToggle = document.createElement('button');
            paramsToggle.className = 'params-toggle';
            paramsToggle.textContent = 'Show Parameters';
            queryItem.appendChild(paramsToggle);
                
                const paramsPre = document.createElement('pre');
            paramsPre.className = 'params-pre hidden';
                paramsPre.textContent = JSON.stringify(queryObj.params, null, 2);
                queryItem.appendChild(paramsPre);
            }
            
        return queryItem;
    }

    // Graph visualization using Cytoscape.js
    function visualizeGraph(queries) {
        // Clear previous content
        graphVis.innerHTML = '';
        
        if (!queries || queries.length === 0) {
            const message = document.createElement('div');
            message.textContent = 'No queries generated to visualize.';
            message.style.textAlign = 'center';
            message.style.padding = '2rem';
            message.style.color = '#78909c';
            graphVis.appendChild(message);
            return;
        }
        
        // Original (simpler) Node and Edge Extraction
        const nodes = [];
        const edges = [];
        const nodeMap = new Map(); // Track nodes we've already added
        const nodeTypes = new Set(); // Track node types for coloring
        
        queries.forEach((queryObj) => {
            const query = queryObj.query;
            
            // Extract node information from CREATE or MERGE statements
            if (query.includes('CREATE (') || query.includes('MERGE (')) {
                const match = query.match(/(?:CREATE|MERGE) \((\w+):(\w+)/);
                if (match) {
                    const [, varName, nodeType] = match;
                    const nodeId = queryObj.params[`id_${varName}`];
                    
                    // Only add node if we haven't seen it before
                    if (!nodeMap.has(nodeId) && nodeId) {
                        const properties = queryObj.params[`props_${varName}`] || {};
                        let label = properties.name || properties.title || nodeType;
                        if (label.length > 20) {
                            label = label.substring(0, 17) + '...';
                        }
                        
                        nodeTypes.add(nodeType);
                        
                        nodes.push({
                            data: {
                                id: nodeId,
                                label: label,
                                type: nodeType,
                                isMerge: queryObj.isMerge,
                                ...properties
                            }
                        });
                        
                        nodeMap.set(nodeId, true);
                    }
                }
            }
            
            // Extract relationship information
            if (query.includes('CREATE (source)-[') && queryObj.params.fromId && queryObj.params.toId) {
                const relTypeMatch = query.match(/CREATE \(source\)-\[\w+:(\w+)\]->/);
                // Basic check: Add edge if type is found
                if (relTypeMatch) {
                    const relType = relTypeMatch[1];
                    edges.push({
                        data: {
                            id: `${queryObj.params.fromId}-${relType}-${queryObj.params.toId}-${Math.random().toString(16).slice(2)}`,
                            source: queryObj.params.fromId,
                            target: queryObj.params.toId,
                            label: relType
                        }
                    });
                }
            }
        });

        if (nodes.length === 0 && edges.length === 0 && queries.length > 0) {
            const message = document.createElement('div');
            message.textContent = 'Could not extract visual elements from queries.';
            message.style.textAlign = 'center';
            message.style.padding = '2rem';
            message.style.color = '#78909c';
            graphVis.appendChild(message);
            return;
        }

        // --- Cytoscape Initialization and Configuration (Using simple cose layout) ---
        // Create cytoscape container first
        const cyContainer = document.createElement('div');
        cyContainer.className = 'cy-container';
        // Explicitly set style to ensure dimensions are recognized
        cyContainer.style.width = '100%';
        cyContainer.style.height = '100%'; 
        graphVis.appendChild(cyContainer);
        
        // Create container for graph controls
        const graphControls = document.createElement('div');
        graphControls.className = 'graph-controls';
        
        // Control buttons with icon-only design
        const zoomInBtn = document.createElement('button');
        zoomInBtn.className = 'graph-control-btn';
        zoomInBtn.innerHTML = '+';
        zoomInBtn.title = 'Zoom In';
        
        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.className = 'graph-control-btn';
        zoomOutBtn.innerHTML = '−';
        zoomOutBtn.title = 'Zoom Out';
        
        const fitBtn = document.createElement('button');
        fitBtn.className = 'graph-control-btn';
        fitBtn.innerHTML = '⤢';
        fitBtn.title = 'Fit Graph';
        
        const centerBtn = document.createElement('button');
        centerBtn.className = 'graph-control-btn';
        centerBtn.innerHTML = '⦿';
        centerBtn.title = 'Center View';
        
        graphControls.appendChild(zoomInBtn);
        graphControls.appendChild(zoomOutBtn);
        graphControls.appendChild(fitBtn);
        graphControls.appendChild(centerBtn);
        
        graphVis.appendChild(graphControls);
        
        // Node colors based on node type - using Google Material palette 
        const nodeTypeColors = {
            'User': '#4285F4',       // Google Blue
            'Company': '#34A853',    // Google Green
            'Post': '#FBBC05',       // Google Yellow
            'Comment': '#EA4335',    // Google Red
            'Product': '#8E24AA',    // Purple
            'Category': '#D81B60',   // Pink
            'Order': '#00ACC1',      // Cyan
            'Customer': '#6D4C41',   // Brown
            'Tag': '#5C6BC0',        // Indigo
            'default': '#9E9E9E'     // Gray for unknown types
        };

        // Initialize Cytoscape with simple settings
        const cy = cytoscape({
            container: cyContainer,
            elements: { nodes, edges },
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': (ele) => {
                            const nodeType = ele.data('type');
                            return nodeTypeColors[nodeType] || nodeTypeColors.default;
                        },
                        'border-width': (ele) => ele.data('isMerge') ? 3 : 0,
                        'border-color': '#37474f',
                        'label': 'data(label)',
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'color': '#37474f',
                        'font-size': '12px',
                        'text-background-color': 'white',
                        'text-background-opacity': 0.8,
                        'text-background-padding': '2px'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#999',
                        'target-arrow-color': '#999',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'label': 'data(label)',
                        'font-size': '11px',
                        'text-rotation': 'autorotate',
                        'text-background-color': 'white',
                        'text-background-opacity': 0.8,
                        'text-background-padding': '2px'
                    }
                }
            ],
            layout: {
                name: 'cose', // Back to default cose
                padding: 60,
                animate: false,
                componentSpacing: 100,
                nodeRepulsion: function(node) { return 600000; },
                edgeElasticity: function(edge) { return 80; }, 
                idealEdgeLength: function(edge) { return 120; },
                gravity: 100,
                fit: true
            }
        });
        
        // Force resize and fit after a short delay
        cy.ready(() => {
            setTimeout(() => {
                console.log("Forcing resize and fit...");
                cy.resize(); // Force cytoscape to recalculate container size
                // Add a check to see if nodes are actually positioned
                if (cy.nodes().length > 0) {
                    console.log("Node 0 position:", cy.nodes()[0].position());
                }
            }, 200); // Increased delay slightly
        });
        
        // Add event handlers for controls
        zoomInBtn.addEventListener('click', () => {
            cy.zoom({
                level: cy.zoom() * 1.2,
                renderedPosition: { x: cyContainer.clientWidth / 2, y: cyContainer.clientHeight / 2 }
            });
        });
        
        zoomOutBtn.addEventListener('click', () => {
            cy.zoom({
                level: cy.zoom() * 0.8,
                renderedPosition: { x: cyContainer.clientWidth / 2, y: cyContainer.clientHeight / 2 }
            });
        });
        
        centerBtn.addEventListener('click', () => {
            cy.center();
            cy.zoom(1);
        });
        
        fitBtn.addEventListener('click', () => {
            cy.fit(60);
        });
        
        // Add stats
        const stats = document.createElement('div');
        stats.className = 'graph-stats';
        stats.innerHTML = `<strong>${nodes.length}</strong> nodes, <strong>${edges.length}</strong> relationships`;
        graphVis.appendChild(stats);
        
        // Add legend for node types
        const legend = document.createElement('div');
        legend.className = 'graph-legend';
        
        // Add legend items for each node type
        Array.from(nodeTypes).sort().forEach(nodeType => {
            const legendItem = document.createElement('div');
            legendItem.className = 'graph-legend-item';
            
            const colorBox = document.createElement('span');
            colorBox.className = 'graph-legend-color';
            colorBox.style.backgroundColor = nodeTypeColors[nodeType] || nodeTypeColors.default;
            
            const label = document.createElement('span');
            // Truncate long type names
            let displayType = nodeType;
            if (displayType.length > 12) {
                displayType = displayType.substring(0, 10) + '...';
                legendItem.title = nodeType; // Add tooltip with full name
            }
            label.textContent = displayType;
            
            legendItem.appendChild(colorBox);
            legendItem.appendChild(label);
            legend.appendChild(legendItem);
        });
        
        // Add merge node indicator to legend if needed
        if (nodes.some(node => node.data.isMerge)) {
            const mergeLegendItem = document.createElement('div');
            mergeLegendItem.className = 'graph-legend-item';
            
            const colorBox = document.createElement('span');
            colorBox.className = 'graph-legend-color';
            colorBox.style.backgroundColor = 'white';
            colorBox.style.border = '3px solid #37474f';
            
            const label = document.createElement('span');
            label.textContent = 'MERGE (Ref)';
            
            mergeLegendItem.appendChild(colorBox);
            mergeLegendItem.appendChild(label);
            legend.appendChild(mergeLegendItem);
        }
        
        graphVis.appendChild(legend);
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        cypherOutput.appendChild(errorDiv);
    }

    // Initialize the editors with sample data
    loadSampleDataBtn.click();
    loadSampleSchemaBtn.click();
}); 
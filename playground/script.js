document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cypherOutput = document.getElementById('cypher-output');
    const graphVis = document.getElementById('graph-vis');
    const graphVisContainer = document.getElementById('graph-vis-container');
    const queriesHeading = document.getElementById('queries-heading');
    const generateBtn = document.getElementById('generate-queries');
    const loadSampleDataBtn = document.getElementById('load-sample-data');
    const loadSampleSchemaBtn = document.getElementById('load-sample-schema');
    const exampleSelect = document.getElementById('example-select');
    const loadExampleBtn = document.getElementById('load-example');
    const shareBtnContainer = document.createElement('div'); // Create a container for the share button
    shareBtnContainer.style.display = 'inline-block'; // Keep it next to generate button
    shareBtnContainer.style.marginLeft = '10px';
    const shareBtn = document.createElement('button');
    shareBtn.id = 'share-btn';
    shareBtn.textContent = 'Share';
    shareBtn.className = 'btn btn-secondary'; // Use similar styling
    shareBtnContainer.appendChild(shareBtn);
    generateBtn.parentNode.insertBefore(shareBtnContainer, generateBtn.nextSibling);
    
    // --- Add \"Hide All Initially\" Checkbox ---
    const graphOptionsContainer = document.createElement('div');
    graphOptionsContainer.className = 'form-group mt-2'; // Add some margin top
    
    const hideAllContainer = document.createElement('div');
    hideAllContainer.className = 'form-check'; // Bootstrap styling

    const hideAllCheckbox = document.createElement('input');
    hideAllCheckbox.type = 'checkbox';
    hideAllCheckbox.className = 'form-check-input'; // Bootstrap styling
    hideAllCheckbox.id = 'hide-all-checkbox';

    const hideAllLabel = document.createElement('label');
    hideAllLabel.className = 'form-check-label'; // Bootstrap styling
    hideAllLabel.htmlFor = 'hide-all-checkbox';
    hideAllLabel.textContent = 'Hide All Initially';
    
    hideAllContainer.appendChild(hideAllCheckbox);
    hideAllContainer.appendChild(hideAllLabel);
    graphOptionsContainer.appendChild(hideAllContainer);

    // Insert the checkbox container after the example loader section
    const actionsDiv = document.querySelector('.actions'); // Find the actions div
    if (actionsDiv && actionsDiv.parentNode) {
        actionsDiv.parentNode.insertBefore(graphOptionsContainer, actionsDiv); // Insert before actions div
    } else {
        // Fallback if structure is unexpected, append to main container
        document.querySelector('main.app-container')?.appendChild(graphOptionsContainer);
        console.warn('Could not find .actions div, appended checkbox to main container as fallback.');
    }
    // --- End Add Checkbox ---

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

    // Generate Cypher queries (Refactored Core Logic)
    async function generateGraphAndQueries() {
        cypherOutput.innerHTML = '';
        graphVis.innerHTML = '';
        queriesHeading.textContent = 'Generated Cypher Queries';

        try {
            // Get JSON data from editors
            const data = jsonEditor.get();
            const schema = schemaEditor.get();
            
            // Check if JSON2Cypher is available
            if (typeof JSON2Cypher === 'undefined') {
                showError('JSON2Cypher library not loaded. Make sure index.global.js is present in the playground folder.');
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
                graphVisContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100); // 100ms delay
            
        } catch (error) {
            showError(`Error: ${error.message}`);
        }
    }

    // Event listener for the generate button
    generateBtn.addEventListener('click', generateGraphAndQueries);

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

    // Graph visualization using D3.js
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

        // Extract nodes and edges
        const nodes = [];
        const edges = [];
        const nodeMap = new Map();
        const nodeTypes = new Set();
        queries.forEach(queryObj => {
            const q = queryObj.query;
            const nodeMatch = q.match(/\b(?:CREATE|MERGE) \((\w+):(\w+)/);
            if (nodeMatch) {
                const varName = nodeMatch[1], nt = nodeMatch[2];
                const id = queryObj.params[`id_${varName}`];
                if (id && !nodeMap.has(id)) {
                    const props = queryObj.params[`props_${varName}`] || {};
                    const lbl = props.name || props.title || nt;
                    nodes.push({ id, type: nt, label: lbl, isMerge: queryObj.isMerge });
                    nodeMap.set(id, true);
                    nodeTypes.add(nt);
                }
            }
            const relMatch = q.match(/\b(?:CREATE|MERGE) \([^)]+\)-\[\w+:(\w+)\]->/);
            if (relMatch && queryObj.params.fromId && queryObj.params.toId) {
                edges.push({ source: queryObj.params.fromId, target: queryObj.params.toId, type: relMatch[1] });
            }
        });

        // Set up SVG
        const width = graphVis.clientWidth, height = graphVis.clientHeight;
        const svg = d3.select(graphVis).append('svg').attr('width', width).attr('height', height);
        const g = svg.append('g');
        const zoom = d3.zoom().scaleExtent([0.1, 8]).on('zoom', event => g.attr('transform', event.transform));
        svg.call(zoom);
        // Create graph controls
        const graphControls = document.createElement('div');
        graphControls.className = 'graph-controls';
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

        // Arrow marker
        const defs = svg.append('defs');
        defs.append('marker').attr('id', 'arrow').attr('viewBox', '0 -5 10 10')
            .attr('refX', 18).attr('refY', 0).attr('markerWidth', 6).attr('markerHeight', 6)
            .attr('orient', 'auto')
          .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', '#999');

        // Color mapping
        const baseColors = { default: '#9E9E9E' };
        const nodeTypeColors = { User: '#4285F4', Company: '#34A853', Post: '#FBBC05', Comment: '#EA4335', Product: '#8E24AA', Category: '#D81B60', Order: '#00ACC1', Customer: '#6D4C41', Tag: '#5C6BC0' };
        const assignedColors = { ...baseColors };
        nodeTypes.forEach(t => assignedColors[t] = nodeTypeColors[t] || stringToColor(t));

        // Initialize simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(edges).id(d => d.id).distance(120).strength(1))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));

        // Draw links
        const link = g.append('g').attr('class', 'links').selectAll('path')
            .data(edges).enter().append('path').attr('class', 'link')
            .attr('stroke', '#999').attr('stroke-width', 2).attr('fill', 'none')
            .attr('marker-end', 'url(#arrow)');

        // Draw nodes
        const node = g.append('g').attr('class', 'nodes').selectAll('g')
            .data(nodes).enter().append('g').attr('class', 'node')
            .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))
            .on('mouseover', function (event, d) {
                d3.select(this).select('circle').transition().duration(150).attr('r', 22);
            })
            .on('mouseout', function (event, d) {
                d3.select(this).select('circle').transition().duration(150).attr('r', 17);
            });
        node.append('circle').attr('r', 17).attr('fill', d => assignedColors[d.type] || assignedColors.default)
            .attr('stroke', d => d.isMerge ? '#37474f' : 'none').attr('stroke-width', d => d.isMerge ? 3 : 0);
        node.append('text').text(d => d.label)
            .attr('x', 0).attr('y', 4).attr('text-anchor', 'middle')
            .attr('font-size', '10px').attr('fill', 'white') // Adjusted font size slightly for better fit
            .style('pointer-events', 'none'); // Ensure text doesn't interfere with mouse events on circle

        simulation.on('tick', () => {
            link.attr('d', d => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`);
            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });
        // Hide all initially if checkbox checked
        const hideAllInitially = document.getElementById('hide-all-checkbox')?.checked ?? false;
        if (hideAllInitially) {
            node.attr('display', 'none');
            link.attr('display', 'none');
        }

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
        }
        function dragged(event, d) {
            d.fx = event.x; d.fy = event.y;
        }
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
        }

        // Controls
        zoomInBtn.addEventListener('click', () => svg.transition().call(zoom.scaleBy, 1.2));
        zoomOutBtn.addEventListener('click', () => svg.transition().call(zoom.scaleBy, 0.8));
        fitBtn.addEventListener('click', () => svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity));
        centerBtn.addEventListener('click', () => svg.transition().duration(500).call(zoom.translateTo, width / 2, height / 2));

        // Stats
        const stats = document.createElement('div');
        stats.className = 'graph-stats';
        stats.innerHTML = `<strong>${nodes.length}</strong> nodes, <strong>${edges.length}</strong> relationships`;
        graphVis.appendChild(stats);

        // Legend
        const legend = document.createElement('div');
        legend.className = 'graph-legend';
        nodeTypes.forEach(type => {
            const item = document.createElement('div');
            item.className = 'graph-legend-item';
            const cb = document.createElement('span');
            cb.className = 'graph-legend-color';
            cb.style.backgroundColor = assignedColors[type];
            const lbl = document.createElement('span');
            lbl.textContent = type;
            item.appendChild(cb); item.appendChild(lbl);
            item.addEventListener('click', () => {
                const hidden = item.classList.toggle('hidden-legend');
                node.filter(d => d.type === type).attr('display', hidden ? 'none' : null);
                link.filter(d => d.source.type === type || d.target.type === type)
                    .attr('display', hidden ? 'none' : null);
            });
            legend.appendChild(item);
        });
        if (nodes.some(d => d.isMerge)) {
            const mi = document.createElement('div'); mi.className = 'graph-legend-item';
            const cb = document.createElement('span'); cb.className = 'graph-legend-color'; cb.style.backgroundColor = 'white'; cb.style.border = '3px solid #37474f';
            const lbl = document.createElement('span'); lbl.textContent = 'MERGE (Ref)';
            mi.appendChild(cb); mi.appendChild(lbl);
            mi.addEventListener('click', () => {
                const hidden = mi.classList.toggle('hidden-legend');
                node.filter(d => d.isMerge).attr('display', hidden ? 'none' : null);
                link.filter(d => d.source.isMerge || d.target.isMerge)
                    .attr('display', hidden ? 'none' : null);
            });
            legend.appendChild(mi);
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

    // Helper function to generate a simple hash from a string
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    // Helper function to generate a color based on a string hash
    function stringToColor(str) {
        const hash = simpleHash(str);
        const hue = hash % 360; // Hue out of 360
        const saturation = 60 + (hash % 20); // Saturation between 60-80%
        const lightness = 45 + (hash % 10);  // Lightness between 45-55%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    // --- Share Functionality ---

    const shareApiEndpoint = 'https://digest.mithya.workers.dev/';

    // Simple Toast Notification Function
    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : 'success'}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => { 
            toast.style.opacity = '1';
        }, 10); 

        // Automatically remove after a few seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { 
                if (toast.parentNode) { // Check if it still exists
                    document.body.removeChild(toast);
                }
            }, 300); // Wait for fade out animation
        }, 3500); // Toast visible for 3.5 seconds
    }

    // Handle Share Button Click
    async function handleShare() {
        shareBtn.textContent = 'Sharing...';
        shareBtn.disabled = true;

        try {
            const data = jsonEditor.get();
            const schema = schemaEditor.get();

            const payload = { data, schema };

            const response = await fetch(shareApiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result && result.key) {
                const shareUrl = `${window.location.origin}${window.location.pathname}?shared=${result.key}`;
                
                // Copy to clipboard
                navigator.clipboard.writeText(shareUrl).then(() => {
                    showToast('Share link copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    showToast('Copied link to console (clipboard failed). URL: ' + shareUrl); // Fallback
                    console.log("Share URL:", shareUrl);
                });
            } else {
                throw new Error('Invalid response from share API.');
            }

        } catch (error) {
            console.error('Sharing failed:', error);
            showError(`Sharing failed: ${error.message}`); // Show in query output area
            showToast('Failed to share state.', true);
        } finally {
            shareBtn.textContent = 'Share';
            shareBtn.disabled = false;
        }
    }

    shareBtn.addEventListener('click', handleShare);

    // --- Load Shared State on Page Load ---
    async function loadSharedState() {
        const urlParams = new URLSearchParams(window.location.search);
        const shareKey = urlParams.get('shared');

        if (shareKey) {
            console.log('Found shared key:', shareKey);
            showToast('Loading shared state...');
            // Disable buttons while loading
            generateBtn.disabled = true;
            shareBtn.disabled = true;
            loadSampleDataBtn.disabled = true;
            loadSampleSchemaBtn.disabled = true;
            loadExampleBtn.disabled = true;
            
            try {
                const response = await fetch(`${shareApiEndpoint}${shareKey}`);
                if (!response.ok) {
                     if (response.status === 404) {
                        throw new Error('Shared state not found (404).');
                    } else {
                        throw new Error(`Failed to fetch shared state. Status: ${response.status}`);
                    }
                }

                const sharedState = await response.json();

                if (sharedState && sharedState.data && sharedState.schema) {
                    jsonEditor.set(sharedState.data);
                    schemaEditor.set(sharedState.schema);
                    showToast('Shared state loaded successfully!');
                    
                    // Automatically generate the graph
                    await generateGraphAndQueries(); 
                    // Remove the share param from URL without reload to avoid re-fetching on refresh
                    history.replaceState(null, '', window.location.pathname); 
                } else {
                    throw new Error('Invalid data received for shared state.');
                }
            } catch (error) {
                console.error('Failed to load shared state:', error);
                showError(`Failed to load shared state: ${error.message}. Loading default examples.`);
                showToast(`Failed to load shared state: ${error.message}`, true);
                // Load default sample if loading fails
                loadSampleDataBtn.click();
                loadSampleSchemaBtn.click();
            } finally {
                 // Re-enable buttons
                 generateBtn.disabled = false;
                 shareBtn.disabled = false;
                 loadSampleDataBtn.disabled = false;
                 loadSampleSchemaBtn.disabled = false;
                 loadExampleBtn.disabled = false;
            }
        } else {
            // No shared key, load default sample data/schema
            loadSampleDataBtn.click();
            loadSampleSchemaBtn.click();
        }
    }

    // Modify the end of the script to call loadSharedState instead of direct sample loading
    // Initialize the editors with sample data OR shared state
    // loadSampleDataBtn.click(); // Remove these lines
    // loadSampleSchemaBtn.click(); // Remove these lines
    loadSharedState(); // Call the new function
}); 

## Plan for Updating Graph Rendering to D3.js

### 1. Review Current Implementation
- [ ] Identify where `visualizeGraph` extracts nodes and edges from queries.
- [ ] Locate Cytoscape initialization, configuration, and styling code in `script.js`.
- [ ] Note existing controls (zoom, fit, center), stats, and legend logic tied to Cytoscape.

### 2. Research D3.js Force-Directed Graph
- [ ] Find D3.js v7 documentation for `d3.forceSimulation`, `d3.forceLink`, `d3.forceManyBody`, and `d3.forceCenter`.
- [ ] Review examples for SVG-based force-directed graphs (e.g., Mike Bostock’s block 4062045).
- [ ] Understand D3 drag behavior (`d3.drag`) and zoom/pan (`d3.zoom`).
- [ ] Explore patterns for adding arrow markers, link labels, node labels, and interactive legend toggles.

### 3. Prepare Code Changes
- [ ] **Index.html**: Replace Cytoscape script tag with D3.js v7 import.
- [ ] **Style.css**: Ensure `.graph-container` supports SVG; optionally remove or update Cytoscape-specific `.cy-container` styles.
- [ ] **script.js**:
  - [ ] Remove Cytoscape initialization block and related event handlers.
  - [ ] Insert D3-based rendering code inside `visualizeGraph`:
    - [ ] Clear `#graph-vis` container and append an `<svg>` element with width/height.
    - [ ] Define arrow markers via `<defs>`.
    - [ ] Bind `nodes` and `edges` data to SVG `<g>` elements, creating `<line>` and `<circle>` + `<text>`.
    - [ ] Configure `d3.forceSimulation` with link, charge, and center forces.
    - [ ] Add tick handler to update positions of links and nodes.
    - [ ] Implement drag-and-drop for nodes (`d3.drag`).
    - [ ] Enable zoom/pan on the SVG (`d3.zoom`) and hook up zoom controls.
    - [ ] Recreate controls (zoom in/out, fit, center) using DOM buttons and hook them to D3 zoom functions.
    - [ ] Generate stats and legend DOM elements; update legend event handlers to show/hide elements via D3 selections.

### 4. Testing & Validation
- [ ] Test with each example (Users & Companies, Blogs, Products, Orders).
- [ ] Verify node colors and labels match previous behavior.
- [ ] Check merge nodes have correct border.
- [ ] Validate arrow markers on edges and edge labels display.
- [ ] Confirm zoom controls and panning work as expected.
- [ ] Ensure legend toggles node types and stats update correctly.

### 5. Cleanup & Documentation
- [ ] Remove unused Cytoscape script imports and CSS rules.
- [ ] Update README(s) to mention D3-based graph rendering.
- [ ] Run and verify any pre-commit checks.
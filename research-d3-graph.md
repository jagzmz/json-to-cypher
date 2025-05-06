<!--
  research-d3-graph.md
  Research document on building interactive D3.js graphs (v7)
-->
# Research: Building an Interactive D3 Graph with D3.js v7

This document summarizes how to build an interactive, animated network visualization (graph) using the latest version of D3.js (v7.x). It covers key features and techniques:
- Nodes and edges
- Labels
- Colors
- Sizes
- Positions and movements
- Animations and transitions
- Interactions and events
- Data binding

---

## 1. Setup

### 1.1 Include D3.js
- **CDN**:
  ```html
  <script src="https://d3js.org/d3.v7.min.js"></script>
  ```
- **npm**:
  ```bash
  npm install d3
  ```
- **ES Module** (unpkg/jsdelivr):
  ```js
  import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7?module";
  ```

### 1.2 HTML Skeleton
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>D3 Force-Directed Graph</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    svg { border: 1px solid #ccc; }
    .link { stroke: #999; stroke-opacity: 0.6; }
    .node { stroke: #fff; stroke-width: 1.5px; }
  </style>
</head>
<body>
  <svg width="800" height="600"></svg>
  <script type="module" src="app.js"></script>
</body>
</html>
```

---

## 2. Data Binding

- **Data shape**: JSON with `nodes` and `links` arrays.
  ```json
  {
    "nodes": [ { "id": "A", "group": 1, "size": 10, "name": "Node A" }, ... ],
    "links": [ { "source": "A", "target": "B", "value": 1 }, ... ]
  }
  ```
- **Bind data to SVG elements** using the join pattern:
  ```js
  const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("class", "link");

  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("class", "node")
      .attr("r", d => d.size)
      .attr("fill", d => color(d.group));
  ```

---

## 3. Force Simulation (Nodes & Edges)

- **Create a simulation** and register forces:
  ```js
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links)
                         .id(d => d.id)
                         .distance(d => 50 + d.value * 10))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));
  ```
- **Update positions on each tick**:
  ```js
  simulation.on("tick", () => {
    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node.attr("cx", d => d.x)
        .attr("cy", d => d.y);

    labels.attr("x", d => d.x)
          .attr("y", d => d.y);
  });
  ```

---

## 4. Labels

- **Add text elements** for node labels:
  ```js
  const labels = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .join("text")
      .text(d => d.name)
      .attr("font-size", 12)
      .attr("dx", 8)
      .attr("dy", ".35em");
  ```
---

## 5. Colors & Sizes

- **Color scale**:
  ```js
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  ```
- **Variable node size** based on data:
  ```js
  .attr("r", d => Math.sqrt(d.size) * 2);
  ```
---

## 6. Positions & Movements

- **Simulation forces** handle positioning and movement.
- **Fix/release nodes** to allow dragging:
  ```js
  function drag(sim) {
    return d3.drag()
      .on("start", event => {
        if (!event.active) sim.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on("drag", event => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on("end", event => {
        if (!event.active) sim.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      });
  }
  ```
---

## 7. Animations & Transitions

- **D3 transitions** on selection:
  ```js
  node.transition()
    .duration(500)
    .attr("r", d => d.size * 1.2);

  link.transition()
    .duration(500)
    .attr("stroke-width", d => d.value);
  ```
---

## 8. Interactions & Events

- **Drag**: see `drag(...)` above.
- **Zoom and pan**:
  ```js
  const zoom = d3.zoom()
    .on("zoom", event => svg.selectAll('g').attr("transform", event.transform));
  svg.call(zoom);
  ```
- **Mouse events** on nodes:
  ```js
  node.on("mouseover", (event, d) => {
      // show tooltip
    })
    .on("mouseout", () => {
      // hide tooltip
    })
    .on("click", (event, d) => {
      console.log(d);
    });
  ```
---

## 9. Events

- **Simulation events**:
  ```js
  simulation.on("end", () => console.log('Simulation finished'));
  ```
- **Dispatch custom events** via `d3.dispatch`.
---

## 10. Imports & Modules

- **Core modules**: d3-selection, d3-scale, d3-force, d3-drag, d3-zoom, d3-transition
- **ES modules import**:
  ```js
  import { select, scaleOrdinal } from "d3";
  import { forceSimulation, forceLink, forceManyBody, forceCenter } from "d3-force";
  ```
---

## References
- D3.js v7: https://d3js.org/d3.v7
- d3-force API: https://d3js.org/d3-force
- Force-Directed Graph example: https://observablehq.com/@d3/force-directed-graph
- Tutorial (Dev.to): https://dev.to/nigelsilonero/how-to-implement-a-d3js-force-directed-graph-in-2025-5cl1
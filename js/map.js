(function () {
  const svg = d3.select("#graph-svg-full");
  let g = svg.append('g').attr('class', 'graph-root');
  g = drawGraph(g);
  const zoom = d3.zoom()
    .scaleExtent([0.1, 10])
    .on('zoom', function() {
      g.attr('transform', d3.event.transform);
    });
  svg.call(zoom);

    // Helper buttons
  document.getElementById('zoom-in').addEventListener('click', () => {
    svg.transition().call(zoom.scaleBy, 1.5);
  });
  document.getElementById('zoom-out').addEventListener('click', () => {
    svg.transition().call(zoom.scaleBy, 0.67);
  });
  document.getElementById('zoom-reset').addEventListener('click', () => {
    svg.transition().call(zoom.transform, d3.zoomIdentity);
  });

  const keysHeld = {};
  let panInterval = null;
  document.addEventListener('keydown', (e) => {    
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          svg.transition().call(zoom.scaleBy, 1.5);
        } else if (e.key === '-') {
          e.preventDefault();
          svg.transition().call(zoom.scaleBy, 0.67);
        } else if (e.key === '0') {
          e.preventDefault();
          svg.transition().call(zoom.transform, d3.zoomIdentity);
        }
      } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        if (!keysHeld[e.key]) {
          keysHeld[e.key] = true;
          if (!panInterval) {
            panInterval = setInterval(() => {
              const panAmount = 10;
              if (keysHeld['ArrowLeft'])  svg.call(zoom.translateBy,  -panAmount, 0);
              if (keysHeld['ArrowRight']) svg.call(zoom.translateBy, panAmount, 0);
              if (keysHeld['ArrowUp'])    svg.call(zoom.translateBy, 0,  -panAmount);
              if (keysHeld['ArrowDown'])  svg.call(zoom.translateBy, 0, panAmount);
            }, 16); // ~60fps
          }
        }
      }
    });
  document.addEventListener('keyup', (e) => {
    delete keysHeld[e.key];
    if (!Object.keys(keysHeld).some(k => ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(k))) {
      clearInterval(panInterval);
      panInterval = null;
    }
  });

function drawGraph(g) {
  // Read dimensions from the parent SVG element, with a sensible fallback
  const svgNode = g.node().ownerSVGElement;
  let width = svgNode.clientWidth || svgNode.getBoundingClientRect().width;
  let height = svgNode.clientHeight || svgNode.getBoundingClientRect().height;
  const padding = 80; // Padding around graph content

  const gravity = 0.05
  //let forceX = d3.forceX(width / 2).strength(gravity + 0.02) -- Add this back in whebn fitting on screen
  let forceY = d3.forceY(height / 2).strength(gravity)

  // Set the size of each node depending on how many descendents it has
  // and the label length depending on the number of characters (label length is used when constraining nodes to the container).
  nodes.forEach(function(node) {
    node.radius = 10 + 1.2 * node.field_descendents_value; 
    node.labelLength = decodeEntities(node.name).length * 4
  })

  // set up the force simulation parameters 
  var linkForce = d3
    .forceLink()
    .id(function (link) { return link.id })

.strength(function(link) { return link.relation === 'parent' ? 0.2 : 0.1; })
.distance(function(link) { return Math.max(link.source.radius + link.target.radius + 40, 100); })
  var simulation = d3
    .forceSimulation()
    .alpha(0.1) // lower alpha for less movement
    .force('link', linkForce)
   .force('center', d3.forceCenter(width / 2, height / 2))

simulation.force('parentPull', parentPullForce(0.3))
 .force('collide', d3.forceCollide(d => Math.max(d.radius + 60, d.radius *2)).strength(0.5).iterations(5))


  // Add the links, nodes and text elements (labels)

  var linkElements = g.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("class", getLinkClass)
  var nodeElements = g.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", function(node) {return node.radius})
      .attr("class", getNodeClass)
      .on('click', function(node) {location.href = '/taxonomy/term/' + node.id})
      .on("mouseover", hover)
      .on("mouseout", unhover)
  var textElements = g.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
      .text(function (node) { return decodeEntities(node.name)})
      .attr("class", getNodeClass)
      .attr("font-size", 14)
      .attr("text-anchor", "middle")  // Add this line
      .attr("dy", function(node) {return 15 + node.radius}) // distance of text below node
      .on('click', function(node) {location.href = '/taxonomy/term/' + node.id})
      .on("mouseover", hover)
      .on("mouseout", unhover)

  let hoverApplied = false;

simulation.nodes(nodes).on('tick', () => {
  updateElementPositions(nodeElements, linkElements, textElements);

  if (!hoverApplied && simulation.alpha() < 0.02) { // When the simulation is almost stable, apply hover to central node
    hoverApplied = true;
    hoverCentralNode();
  }
});

  function hoverCentralNode() {
    const bounds = getNodeBounds();
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    // Find the nearest large node to the center
    let minDist = Infinity;
    nodes.forEach(function(node) {
      if (node.field_descendents_value < 10) return; 
      const dist = Math.hypot(node.x - centerX, node.y - centerY);
      if (dist < minDist) {
        minDist = dist;
        centralNode = node;
      }
    });

    if (centralNode) hover(centralNode);
  }

  simulation.force("link").links(links)
  return g
}

})();

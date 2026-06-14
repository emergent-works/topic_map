(function () {
  const svg = d3.select("#graph-svg-full");
  const width = svg.node().clientWidth;
const height = svg.node().clientHeight;
  let g = svg.append('g')
  .attr('class', 'graph-root')
  .attr('transform', `translate(${width / 2}, ${height / 2})`);
  g = drawGraph(g);
  const zoom = d3.zoom()
    .scaleExtent([0.1, 10])
    .on('zoom', function() {
      g.attr('transform', d3.event.transform);
    });
  svg.call(zoom);
  svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2));

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

// Set the size of each node depending on how many descendents it has
// and the label length depending on the number of characters (label length is used when constraining nodes to the container).
nodes.forEach(function(node) {
    node.radius = 10 + 1 * node.field_descendents_value; 
    node.labelLength = decodeEntities(node.name).length * 4
  })



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
      .on('click', highlight)

  var textElements = g.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
      .text(function (node) { return decodeEntities(node.name)})
      .attr("class", getNodeClass)
      .attr("font-size", 14)
      .attr("text-anchor", "middle") 
      .attr("dy", function(node) {return 15 + node.radius}) 
      .on("click", highlight)

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force('collide', d3.forceCollide(d => Math.max(d.radius, d.labelLength)).strength(1).iterations(3))

    simulation.on("tick", () => {
    linkElements
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    nodeElements
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
    textElements
        .attr("x", d => d.x)
        .attr("y", d => d.y);
  });
  return g
}

})();

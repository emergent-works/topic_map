const svg = d3.select('svg') // the container element #map_container
let width = svg.attr('width');  
let height = svg.attr('height');
const padding = 80; // Padding around graph content

// These are d3 force-related graph parameters
const gravity = 0.05
let forceX = d3.forceX(width / 2).strength(gravity + 0.02)
let forceY = d3.forceY(height / 2).strength(gravity)

// Set the size of each node depending on how many descendents it has
// and the label length depending on the number of characters (label length is used when constraining nodes to the container).
nodes.forEach(function(node) {
  node.radius = 10 + 1.2 * node.field_descendents_value; 
  node.labelLength = decodeEntities(node.name).length * 4
})

// Calculate actual bounding box of all nodes and labels
function getNodeBounds() {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  nodes.forEach(function(node) {
    // Node circle bounds
    minX = Math.min(minX, node.x - node.radius);
    maxX = Math.max(maxX, node.x + node.radius);
    minY = Math.min(minY, node.y - node.radius);
    maxY = Math.max(maxY, node.y + node.radius);
    
    // Text label bounds (labels go left and below)
    minX = Math.min(minX, node.x - node.labelLength);
    maxX = Math.max(maxX, node.x);
    minY = Math.min(minY, node.y - node.radius - 10);
    maxY = Math.max(maxY, node.y + 20 + node.radius);
  });
  
  return {minX, maxX, minY, maxY};
}

// Resize SVG container and update forces to match new dimensions
function resizeContainerToFitContent() {
  const bounds = getNodeBounds();
  const contentWidth = bounds.maxX - bounds.minX;
  const contentHeight = bounds.maxY - bounds.minY;
  
  // New SVG dimensions with padding
  const newWidth = contentWidth + (padding * 2);
  const newHeight = contentHeight + (padding * 2);
  
  svg.attr('width', newWidth).attr('height', newHeight);
  width = newWidth;
  height = newHeight;
  
  // Calculate offset to center content with padding
  const offsetX = padding - bounds.minX;
  const offsetY = padding - bounds.minY;
  
  // Move all nodes to new centered position
  nodes.forEach(function(node) {
    node.x += offsetX;
    node.y += offsetY;
  });
  
  // Update forces to use new dimensions
  const centerX = width / 2;
  const centerY = height / 2;
  
  forceX = d3.forceX(centerX).strength(gravity + 0.02);
  forceY = d3.forceY(centerY).strength(gravity);
  
  simulation
    .force('center', d3.forceCenter(centerX, centerY))
    .force('x', forceX)
    .force('y', forceY);
  
  // Refresh positions on screen
  updateElementPositions();
}

// Update all element positions on screen
function updateElementPositions() {
  nodeElements
    .attr('cx', function(node) { return node.x; })
    .attr('cy', function(node) { return node.y; });
  
  linkElements
    .attr('x1', function (link) { return link.source.x; })
    .attr('y1', function (link) { return link.source.y; })
    .attr('x2', function (link) { return link.target.x; })
    .attr('y2', function (link) { return link.target.y; });
  
  textElements
    .attr('x', function (node) { return node.x; })
    .attr('y', function (node) { return node.y; });
}

// set up the force simulation parameters 
var linkForce = d3
  .forceLink()
  .id(function (link) { return link.id })
  .strength(function (link) { return link.relation == "parent" ? 0.7 : 0.1 })
  .distance(function (link) { return link.relation == "parent" ? 100 : 300 })
var simulation = d3
  .forceSimulation()
  .force('link', linkForce)
 // .force('charge',function(node) {return Math.pow(node.radius, 100.0)})
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('x', forceX)
  .force('y',  forceY)
  .force('collide', d3.forceCollide(d => Math.max(d.labelLength + 30, 40, d.radius * 1.5)).strength(1))

// Add the links, nodes and text elements (labels)
var linkElements = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(links)
  .enter().append("line")
    .attr("class", getLinkClass)
var nodeElements = svg.append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(nodes)
  .enter().append("circle")
    .attr("r", function(node) {return node.radius})
    .attr("class", getNodeClass)
    .on('click', function(node) {location.href = '/taxonomy/term/' + node.id})
    .on("mouseover", hover)
    .on("mouseout", unhover)
var textElements = svg.append("g")
  .attr("class", "texts")
  .selectAll("text")
  .data(nodes)
  .enter().append("text")
    .text(function (node) { return decodeEntities(node.name)})
    .attr("class", getNodeClass)
    .attr("font-size", 14)
    .attr("dx", function(node) {return 0 - node.labelLength})
    .attr("dy", function(node) {return 15 + node.radius}) // distance of text below node
    .on('click', function(node) {location.href = '/taxonomy/term/' + node.id})
    .on("mouseover", hover)
    .on("mouseout", unhover)

// This runs in a loop moving things around until it settles down.
simulation.nodes(nodes).on('tick', () => {
  // Let nodes move freely without constraining them - this allows proper layout
  positionLinksAndTextRelativeToNodes();
  
  // Once simulation has mostly settled (low alpha), resize container to fit
  if (simulation.alpha() < 0.01) {
    resizeContainerToFitContent();
    // Now apply constraints to keep nodes in the resized container
    constrainNodesToSVGContainer();
    updateElementPositions();
  }
})

simulation.force("link").links(links)

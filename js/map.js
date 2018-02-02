const svg = d3.select('svg') // the container element #map_container
const width = svg.attr('width');  
const height = svg.attr('height');

// These are d3 force-related graph parameters
const gravity = 0.05
const forceX = d3.forceX(width / 2).strength(gravity + 0.02)
const forceY = d3.forceY(height / 2).strength(gravity)

var dragging; // state variable to indicated whether dragging is in progress

// Set the size of each node depending on how many children it has
// and the label length depending on the number of characters (label length is used when constraining nodes to the container).
nodes.forEach(function(node) {
  node.childCount = 0;
  links.forEach(function(link) {
    if (link.relation == "parent" && link.target == node.id) {
      node.childCount ++
    }
  })
  node.radius = 10 + 2 * node.childCount; 
  node.labelLength = decodeEntities(node.name).length * 4
})

// set up the force simulation parameters 
var linkForce = d3
  .forceLink()
  .id(function (link) { return link.id })
  .strength(function (link) { return link.relation == "parent" ? 0.7 : 0.1 })
  .distance(function (link) { return link.relation == "parent" ? 100 : 300 })
var simulation = d3
  .forceSimulation()
  .force('link', linkForce)
  .force('charge', d3.forceManyBody().strength(-600))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('x', forceX)
  .force('y',  forceY)
  .force('collide', d3.forceCollide(d => d.labelLength).strength(1))

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
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
var textElements = svg.append("g")
  .attr("class", "texts")
  .selectAll("text")
  .data(nodes)
  .enter().append("text")
    .text(function (node) { return decodeEntities(node.name)})
    .attr("class", getNodeClass)
    .attr("font-size", 14)
    .attr("dx", function(node) {return 0 - node.labelLength})
    .attr("dy", function(node) {return 15 + node.radius})
    .on('click', function(node) {location.href = '/taxonomy/term/' + node.id})
    .on("mouseover", hover)
    .on("mouseout", unhover)

// This runs in a loop moving things around until it settles down.
// It starts again if you drag and drop a node.
// It puts parent nodes above their children as much as it can, keeps everything in the container and fitting together properly.
simulation.nodes(nodes).on('tick', () => {
  if (!dragging) tryToPutParentsAboveChildren(); 
  constrainNodesToSVGContainer();
  positionLinksAndTextRelativeToNodes();
})

simulation.force("link").links(links)

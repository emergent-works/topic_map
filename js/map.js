var svg = d3.select('svg')
var width = svg.attr('width'); 
var height = svg.attr('height');
var node_radius = 15;
var dragging;

const gravity = 0.05
const forceX = d3.forceX(width / 2).strength(gravity + 0.02)
const forceY = d3.forceY(height / 2).strength(gravity)

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


// simulation setup with all forces
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

simulation.nodes(nodes).on('tick', () => {
  if (!dragging) doVerticality();
  constrainNodesToSVGContainer();
  positionLinksAndTextRelativeToNodes();
})

simulation.force("link").links(links)

function decodeEntities(encodedString) {
      var textArea = document.createElement('textarea');
          textArea.innerHTML = encodedString;
              return textArea.value;
}

function constrainNodesToSVGContainer() {
  nodeElements
    .attr('cx', function(node) {return node.x = Math.max(node.labelLength + 10, Math.min(width - node.labelLength + 10, node.x));})
    .attr('cy', function(node) {return node.y = Math.max(node_radius + 20, Math.min(height - node_radius - 20, node.y))})   
}

function positionLinksAndTextRelativeToNodes() {
  linkElements
    .attr('x1', function (link) { return link.source.x })
    .attr('y1', function (link) { return link.source.y })
    .attr('x2', function (link) { return link.target.x })
    .attr('y2', function (link) { return link.target.y })
  textElements
    .attr('x', function (node) { return node.x })
    .attr('y', function (node) { return node.y })
}

function getNodeClass(node) {
  return "node_" + node.id
}

function showRelationships(node) {
  d3.selectAll('.nodes circle').classed("unrelated", true)
  d3.selectAll('.links line').classed("unrelated", true)
  d3.selectAll('.texts text').classed("unrelated", true)
  d3.selectAll('.node_' + node.id).classed("unrelated", false)
  links.forEach(function(link) {
    if (link.target == node) {
      if (link.relation == "parent") {
        d3.selectAll('.node_' + link.source.id).classed("related_child", true)
        d3.selectAll('.link_' + link.id).classed("related_child", true)
      } else {
        d3.selectAll('.node_' + link.source.id).classed("related_neighbour", true)
      }
      d3.selectAll('.node_' + link.source.id).classed("unrelated", false)
      d3.selectAll('.link_' + link.id).classed("unrelated", false)
    } else if (link.source == node) {
      if (link.relation == "parent") {
        d3.selectAll('.node_' + link.target.id).classed("related_parent", true)
        d3.selectAll('.link_' + link.id).classed("related_parent", true)
      } else {
        d3.selectAll('.node_' + link.target.id).classed("related_neighbour", true)
      }
      d3.selectAll('.node_' + link.target.id).classed("unrelated", false)
      d3.selectAll('.link_' + link.id).classed("unrelated", false)
    }
  })
}

function getLinkClass(link) {
  return "link_" + link.relation + " link_" + link.id
}

function dragstarted(d) {
  dragging = true;
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null
  d3.event.subject.fy = null
  dragging = false;
}

function doVerticality() {
  linkElements.each(function(d) {
    if (d.relation == "parent")  {
      if (d.source.y < d.target.y) {
        targy = d.target.y
        d.target.y = d.source.y
        d.source.y = targy
      }
      while (d.source.y < d.target.y + 30) {
        d.source.y += 1
        d.target.y -= 1
      }
    }
 })
}

function hover(d) {
    d3.selectAll('.node_' + d.id).classed("hovering", true);
    showRelationships(d);
}

function unhover(d) {
    d3.selectAll('.hovering').classed("hovering", false);
    d3.selectAll('.related_parent').classed("related_parent", false)    
    d3.selectAll('.related_child').classed("related_child", false)    
    d3.selectAll('.related_neighbour').classed("related_neighbour", false)    
    d3.selectAll('.unrelated').classed("unrelated", false)    
}


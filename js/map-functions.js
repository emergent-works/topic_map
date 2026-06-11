/* Behaviour when hovering over a node or not */

// When hovering over a node, highlight it, the nodes it is related to and the links between them.
// The related nodes and links get css classes based on their relationship to the hovered node.
// The unrelated ones get the "unrelated" class which will make them even fainter than when nothing is hovered over.
function hover(node) {
  d3.selectAll('.node_' + node.id).classed("hovering", true);
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
        d3.selectAll('.link_' + link.id).classed("related_neighbour", true)
      }
      d3.selectAll('.node_' + link.source.id).classed("unrelated", false)
      d3.selectAll('.link_' + link.id).classed("unrelated", false)
    } else if (link.source == node) {
      if (link.relation == "parent") {
        d3.selectAll('.node_' + link.target.id).classed("related_parent", true)
        d3.selectAll('.link_' + link.id).classed("related_parent", true)
      } else {
        d3.selectAll('.node_' + link.target.id).classed("related_neighbour", true)
        d3.selectAll('.link_' + link.id).classed("related_neighbour", true)
      }
      d3.selectAll('.node_' + link.target.id).classed("unrelated", false)
      d3.selectAll('.link_' + link.id).classed("unrelated", false)
    }
  })
}

// When nothing is hovered over, remove all highlighting and fading classes
function unhover() {
    d3.selectAll('.hovering').classed("hovering", false);
    d3.selectAll('.related_parent').classed("related_parent", false)    
    d3.selectAll('.related_child').classed("related_child", false)    
    d3.selectAll('.related_neighbour').classed("related_neighbour", false)    
    d3.selectAll('.unrelated').classed("unrelated", false)    
}

/*  Positioning functions; run on every "tick" */
function constrainNodesToSVGContainer(nodeElements, width, height) {
  nodeElements
    .attr('cx', function(node) {return node.x = Math.max(node.labelLength + 10, Math.min(width - node.labelLength + 10, node.x));})
    .attr('cy', function(node) {return node.y = Math.max(node.radius + 20, Math.min(height - node.radius - 20, node.y))})   
}

function updateElementPositions(nodeElements, linkElements, textElements) {
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


/* misc */

// deals with special characters in label text
function decodeEntities(encodedString) {
      var textArea = document.createElement('textarea');
          textArea.innerHTML = encodedString;
              return textArea.value;
}

// gives each link a distict css class
function getLinkClass(link) {
  return "link_" + link.relation + " link_" + link.id
}

// gives each node a distinct css class
function getNodeClass(node) {
  return "node_" + node.id + " " + node.field_type_of_topic_value;
}

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



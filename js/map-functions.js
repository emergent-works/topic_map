

// When a node is selected, highlight it, the nodes it is related to and the links between them.
// The related nodes and links get css classes based on their relationship to the selected node.
// The unrelated ones get the "unrelated" class which will make them even fainter than when nothing is selected.
function highlight(node) {
  // Reset all highlight-related classes first
  d3.selectAll('.nodes circle, .texts text, .links line')
    .classed("highlight", false)
    .classed("related_child", false)
    .classed("related_parent", false)
    .classed("related_neighbour", false)

  // Set the highlight class on the selected node and the unrelated class on all nodes, links and labels
  d3.selectAll('.node_' + node.id).classed("highlight", true);
  d3.selectAll('.nodes circle').classed("unrelated", true)
  d3.selectAll('.links line').classed("unrelated", true)
  d3.selectAll('.texts text').classed("unrelated", true)
  d3.selectAll('.node_' + node.id).classed("unrelated", false)

  // Set the related classes on the nodes and links that are related to the selected node, based on the relationship type
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


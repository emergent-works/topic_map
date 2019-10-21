<?php


namespace Drupal\topic_map\Plugin\Block;
use Drupal\Core\Block\BlockBase;

/**
 * Provides a Custom block.
 *
 * @Block(
     id = "topic_map_block",
     admin_label =  "Topic Map Block",
 *   category = @Translation("Topic Map"),
 *   deriver = "Drupal\topic_map\Plugin\Derivative\TopicMapBlock"
 * )
 */

class TopicMapBlock extends BlockBase {

  public function build() {
    $output = ['#type' => 'inline_template'];
    $block_id = $this->getDerivativeId();
    $query = db_select('taxonomy_term_field_data', 't');
    $query->addField('t', 'tid', 'id');
    $query->addField('t', 'name');
    $query->join("taxonomy_term__field_topics", "f", "f.field_topics_target_id = t.tid");    
    $query->join("taxonomy_term__field_type_of_topic", "ty", "ty.entity_id = t.tid");    
    $query->addField('ty', 'field_type_of_topic_value');
    $query->condition("f.entity_id", $block_id);

    $topics = $query->execute()->fetchAll();

    if (empty($topics)) {
      $output['#template'] = '<h1>There are no topics in this topic map yet. Edit it to add some.</h1>';
      return $output;
    }
    // Get a list of topic ids to plug into the query to get the links between them
    foreach($topics as $topic) {
      $tids[] = $topic->id;
    }
    $tids = join($tids, ',');

    // The links are parent-to-child and neighbour-to-neighbour. 
    // In the table, if a and b are neighbours there will be two rows - one in each direction. So we filter on source > target (as they cannot be the same node; this is ensured by the topic relations code.
    $sql = "select concat(p.entity_id,'p',field_topicmap_parents_target_id) AS id,p.entity_id AS source,field_topicmap_parents_target_id AS target,'parent' AS relation from taxonomy_term__field_topicmap_parents p where p.entity_id in ($tids) and field_topicmap_parents_target_id in ($tids) union select concat(n.entity_id,'n', field_topicmap_neighbours_target_id) AS id, n.entity_id AS source, field_topicmap_neighbours_target_id AS target,'neighbour' AS relation from taxonomy_term__field_topicmap_neighbours n where n.entity_id in ($tids) and field_topicmap_neighbours_target_id in ($tids) and n.entity_id > field_topicmap_neighbours_target_id";
    $links = db_query($sql)->fetchAll();
    $container_size = sqrt(sizeof($topics)) * 170;
    $output['#template'] = '<div id="legend" class="panel-default panel">
                          <div class="panel-heading">Visual representation of the topic space</div>
                          <p>Hover over a topic to see its relationships to other topics: </p>
                            <ul>
                              <li class="parents">topics that contain it</li> 
                              <li class="children">topics that are parts of it</li>  
                              <li class="neighbours">related topics</li>
                            </ul>
                          <p>Click on a topic to see information about it.</p>
                        </div>
                        <svg id="map_container" width="' . $container_size . '" height="' . $container_size . '"></svg>';
    $output[]['#attached']['library'][] = 'topic_map/d3';
    $output[]['#attached']['library'][] = 'topic_map/map';
    $output[]['#attached']['html_head'][] = [[
      '#type'  => 'html_tag' ,
      '#tag'   => 'script',
      '#value' => 'var nodes = ' . json_encode($topics),

    ], 'the_nodes'];
    $output[]['#attached']['html_head'][] = [[
      '#type'  => 'html_tag' ,
      '#tag'   => 'script',
      '#value' => 'var links = ' . json_encode($links),

    ], 'the_links'];
    return $output;
  }
}

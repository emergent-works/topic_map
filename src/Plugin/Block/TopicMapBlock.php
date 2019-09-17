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
    $block_id = $this->getDerivativeId();
    $query = db_select('taxonomy_term_field_data', 't');
    $query->addField('t', 'tid', 'id');
    $query->addField('t', 'name');
    $query->join("taxonomy_term__field_topics", "f", "f.field_topics_target_id = t.tid");    
    $query->condition("f.entity_id", $block_id);

    $nodes = $query->execute()->fetchAll();
    // The links are parent-to-child and sibling-to-sibling. 
    // In the table, if a and b are siblings there will be two rows - one in each direction. So we filter on source > target (as they cannot be the same node; this is ensured by the topic relations code.
    $sql = "select concat(p.entity_id,'p',field_topicmap_parents_target_id) AS id,p.entity_id AS source,field_topicmap_parents_target_id AS target,'parent' AS relation from taxonomy_term__field_topicmap_parents p join taxonomy_term__field_topics t on (p.entity_id = t.field_topics_target_id or p.field_topicmap_parents_target_id = t.field_topics_target_id) where t.entity_id =  '" . $block_id . "' union select concat(n.entity_id,'n', field_topicmap_siblings_target_id) AS id, n.entity_id AS source, field_topicmap_siblings_target_id AS target,'sibling' AS relation from taxonomy_term__field_topicmap_siblings n join taxonomy_term__field_topics t on (n.entity_id = t.field_topics_target_id or n.field_topicmap_siblings_target_id = t.field_topics_target_id) where t.entity_id  = '" . $block_id . "' and n.entity_id > field_topicmap_siblings_target_id";
    $links = db_query($sql)->fetchAll();
    $container_size = sqrt(sizeof($nodes)) * 170;
    $output =  array (
        '#type' => 'inline_template',
        '#template' => '<div id="legend" class="panel-default panel">
                          <div class="panel-heading">Visual representation of the topic space</div>
                          <p>Hover over a topic to see its relationships to other topics: </p>
                            <ul>
                              <li class="parents">topics that contain it</li> 
                              <li class="children">topics that are parts of it</li>  
                              <li class="neighbours">related topics</li>
                            </ul>
                          <p>Click on a topic to see information about it.</p>
                        </div>
                        <svg id="map_container" width="' . $container_size . '" height="' . $container_size . '"></svg>'
    );
    $output[]['#attached']['library'][] = 'topic_map/d3';
    $output[]['#attached']['library'][] = 'topic_map/map';
    $output[]['#attached']['html_head'][] = [[
      '#type'  => 'html_tag' ,
      '#tag'   => 'script',
      '#value' => 'var nodes = ' . json_encode($nodes),

    ], 'the_nodes'];
    $output[]['#attached']['html_head'][] = [[
      '#type'  => 'html_tag' ,
      '#tag'   => 'script',
      '#value' => 'var links = ' . json_encode($links),

    ], 'the_links'];
    return $output;
  }
}

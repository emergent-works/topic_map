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
    error_log($block_id);
    $query = db_select('taxonomy_term_field_data', 't');
    $query->addField('t', 'tid', 'id');
    $query->addField('t', 'name');
    $query->condition('vid', $block_id);

    $nodes = $query->execute()->fetchAll();

    // The links are parent-to-child and neighbour-to-neighbour. 
    // In the table, if a and b are neighbours there will be two rows - one in each direction. So we filter on source > target (as they cannot be the same node; this is ensured by the topic relations code.
    $sql = "select concat(`entity_id`,'p',`field_parents_target_id`) AS `id`,`entity_id` AS `source`,`field_parents_target_id` AS `target`,'parent' AS `relation` from `taxonomy_term__field_parents` where bundle = '" . $block_id . "' union select concat(`taxonomy_term__field_siblings`.`entity_id`,'n',`taxonomy_term__field_siblings`.`field_siblings_target_id`) AS `id`, `entity_id` AS `source`, `field_siblings_target_id` AS `target`,'neighbour' AS `relation` from `taxonomy_term__field_siblings` where entity_id > field_siblings_target_id and bundle = '" . $block_id . "'";
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

<?php

/**
 * @file
 */
namespace Drupal\topic_map\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Creates a 'Topic Map' Block
 * @Block(
 * id = "block_topicmapblk",
 * admin_label = @Translation("Topic Map block"),
 * )
 */
class TopicMapBlock extends BlockBase {

    /**
     * {@inheritdoc}
     */
    public function build() {
        $query = db_select('taxonomy_term_field_data', 't');
        $query->addField('t', 'tid', 'id');
        $query->addField('t', 'name');
        $query->condition('vid', 'topic');

        $nodes = $query->execute()->fetchAll();

        // The links are parent-to-child and neighbour-to-neighbour. 
        // In the table, if a and b are neighbours there will be two rows - one in each direction. So we filter on source > target (as they cannot be the same node; this is ensured by the topic relations code.
        $sql = "select concat(`entity_id`,'p',`field_parents_target_id`) AS `id`,`entity_id` AS `source`,`field_parents_target_id` AS `target`,'parent' AS `relation` from `taxonomy_term__field_parents` union select concat(`taxonomy_term__field_neighbours`.`entity_id`,'n',`taxonomy_term__field_neighbours`.`field_neighbours_target_id`) AS `id`, `entity_id` AS `source`, `field_neighbours_target_id` AS `target`,'neighbour' AS `relation` from `taxonomy_term__field_neighbours` where entity_id > field_neighbours_target_id";
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

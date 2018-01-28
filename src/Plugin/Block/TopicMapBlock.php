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

        $query = db_select('topic_map', 'l');
        $query->fields('l', array('id', 'source', 'target', 'relation'));
        $links = $query->execute()->fetchAll();

        $output =  array (
            '#type' => 'inline_template',
            '#template' => '<div id="legend" class="panel-default panel">
                              <div class="panel-heading">Visual representation of the topic space</div>
                              <p>Hover over a topic to see its relationships to other topics: </p>
                                <ul>
                                  <li class="parents">its parents</li> 
                                  <li class="children">its children</li>  
                                  <li class="neighbours">its neighbours</li>
                                </ul>
                              <p>Click on a topic to view a list of content and resources pertaining to it.</p>
                            </div>
                            <svg id="map_container"></svg>'
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

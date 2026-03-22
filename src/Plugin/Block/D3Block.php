<?php 


namespace Drupal\topic_map\Plugin\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\taxonomy\Entity\Term;

abstract class D3Block extends BlockBase {

  abstract protected function getTopics(string $block_id): array;

  protected string $extraInformation= '';

  public function build() {
    $output = ['#type' => 'inline_template'];
    $block_id = $this->getDerivativeId();
    $topics = $this->getTopics($block_id);

    if (empty($topics)) {
      $output['#template'] = '<h1>There are no topics in this topic map yet. Edit it to add some.</h1>';
      return $output;
    }
    // Get a list of topic ids to plug into the query to get the links between them
    foreach($topics as $topic) {
      $tids[] = $topic->id;
    }
    $tids = join(',', $tids);

    // The links are parent-to-child and neighbour-to-neighbour. 
    // In the table, if a and b are neighbours there will be two rows - one in each direction. So we filter on source > target (as they cannot be the same node; 
    // this is ensured by the topic relations code.
    $sql = <<<SQL
      select concat(p.entity_id,'p',field_topicmap_parents_target_id) AS id,
      p.entity_id AS source,
      field_topicmap_parents_target_id AS target,
      'parent' AS relation 
      from taxonomy_term__field_topicmap_parents p 
      where p.entity_id in ($tids) and 
      field_topicmap_parents_target_id in ($tids) 
      union 
      select concat(n.entity_id,'n', field_topicmap_neighbours_target_id) AS id, 
      n.entity_id AS source, 
      field_topicmap_neighbours_target_id AS target,
      'neighbour' AS relation 
      from taxonomy_term__field_topicmap_neighbours n where n.entity_id in ($tids) and 
      field_topicmap_neighbours_target_id in ($tids) and n.entity_id > field_topicmap_neighbours_target_id
    SQL;
    $links = \Drupal::database()->query($sql)->fetchAll();
    $container_height = sqrt(sizeof($topics)) * 170;
    $container_width = sqrt(sizeof($topics)) * 240 - 6 * sizeof($topics);
    $output['#template'] = Term::load($block_id)->getDescription() . '<div id="legend" class="panel-default panel">
                          <div class="panel-heading">Visual representation of the topic space</div>
                          <p>Hover over a topic to see its relationships to other topics: </p>
                            <ul>
                              <li class="parents">topics that contain it</li> 
                              <li class="children">topics that are parts of it</li>  
                              <li class="neighbours">related topics</li>
                            </ul>'
                            . $this->extraInformation .
                          '<p>Click on a topic to see information about it.</p>
                        </div>
                        <svg id="map_container" width="' . $container_width . '" height="' . $container_height . '"></svg>';
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

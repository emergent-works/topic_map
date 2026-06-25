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
    $description = Term::load($block_id)->getDescription();

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
    $container_width = sqrt(sizeof($topics)) * 200;
    $output['#template'] = '
                        <div id="container">
                          <div id = "graph">
                            <svg id="graph-svg-full"></svg>
                            <div id="sidebar">
                              <h3>REAL2 - Knowledge Graph</h3>
                              <div id = legend><p><strong>Navigate:</strong> Click on a keyword to see: </p>
                                <ul>
                                  <li class="parents">keywords that contain it</li> 
                                  <li class="children">keywords that are parts of it</li>  
                                  <li class="neighbours">related keywords</li>
                                </ul>
                                <p><strong>Explore the project:</strong> Double-click a keyword to open a list of relevant studies and supporting materials in a new tab.</p>
                                <p><strong>Pan:</strong> Arrow keys, or click and drag</p>
                                <p><strong>Zoom:</strong> Mouse wheel, two-finger swipe or Ctrl+/-</p>
                              </div>
                              <div id="description">
                                ' . $description . '
                              </div>                           
                            <div id="logo">
                                <a href="/" target="_blank"><img src="/themes/ikm/logo.png"></a>
                              </div>
                          </div>   
                        </div>
                        <button id="sidebar-toggle" title="Close sidebar">&#x276F;</button>
                        <button id="sidebar-toggle-open" title="Open sidebar">&#x276E;</button>
              ';
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

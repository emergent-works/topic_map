<?php


namespace Drupal\topic_map\Plugin\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\taxonomy\Entity\Term;

/**
 * Provides a Custom block.
 *
 * @Block(
     id = "knowledge_graph_block",
     admin_label =  "Knowledge Graph Block",
 *   category = @Translation("Topic Map"),
 *   deriver = "Drupal\topic_map\Plugin\Derivative\KnowledgeGraphBlock"
 * )
 */

class KnowledgeGraphBlock extends D3Block {

  protected function getTopics(string $block_id) :array {
    $query = \Drupal::database()->select('taxonomy_term_field_data', 't');
    $query->join('taxonomy_term__field_vocabulary', 'v', 't.vid = v.field_vocabulary_value');
    $query->addField('t', 'tid', 'id');
    $query->addField('t', 'name');
   // $query->addField('td', 'field_descendents_value');
    $query->addField('tl', 'field_level_value');
   // $query->leftJoin("taxonomy_term__field_descendents", "td", "td.entity_id = t.tid");   
    $query->leftJoin("taxonomy_term__field_level", "tl", "tl.entity_id = t.tid");     
    $query->condition("v.entity_id", $block_id);   
    return $query->execute()->fetchAll();
  }


  protected function renderTeasers() :string {
    return $this->renderTeaser(3267) . $this->renderTeaser(3266); // about real2 and about the graph
  }

  protected function renderTeaser($nid): string {
    $node = \Drupal\node\Entity\Node::load($nid);
  $summary = $node->get('body')->first()->summary;

    return '<div class="teaser"><h3>' . $node->getTitle() . '</h3><p>' . $summary . '&nbsp;<a href="' . $node->toUrl()->toString() . '" target="_blank">Read more</a></p></div>';
  } 
}

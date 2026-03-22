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
    $query->leftJoin("taxonomy_term__field_descendents", "td", "td.entity_id = t.tid");    
    $query->condition("v.entity_id", $block_id);   
    return $query->execute()->fetchAll();
  }
}

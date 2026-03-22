<?php


namespace Drupal\topic_map\Plugin\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\taxonomy\Entity\Term;

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

class TopicMapBlock extends D3Block {

protected string $extraInformation = '
                          <p>There are three types of topics: </p>
                            <ul>
                              <li><span class="Subject">Subjects</span></li> 
                              <li><span class="Process">Processes</span></li>  
                              <li><span class="Relationship">Relationships</span></li>
                            </ul>';

  protected function getTopics(string $block_id) :array {
    $query = \Drupal::database()->select('taxonomy_term_field_data', 't');
    $query->addField('t', 'tid', 'id');
    $query->addField('t', 'name');
    $query->join("taxonomy_term__field_topics", "f", "f.field_topics_target_id = t.tid");    
    $query->leftJoin("taxonomy_term__field_type_of_topic", "ty", "ty.entity_id = t.tid");        
    $query->leftJoin("taxonomy_term__field_descendents", "td", "td.entity_id = t.tid");    
    $query->addField('ty', 'field_type_of_topic_value');
    $query->addField('td', 'field_descendents_value');
    $query->condition("f.entity_id", $block_id);   
    return $query->execute()->fetchAll();
  }

}

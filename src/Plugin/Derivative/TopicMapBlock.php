<?php

/**
 * @file
 */
namespace Drupal\topic_map\Plugin\Derivative;

use Drupal\Component\Plugin\Derivative\DeriverBase;
use Drupal\Component\Plugin\Derivative\DeriverInterface;

class TopicMapBlock extends DeriverBase implements DeriverInterface {

    /**
     * {@inheritdoc}
     */
  public function getDerivativeDefinitions($base_plugin_definition) {
    $vocabularies = \Drupal\taxonomy\Entity\Vocabulary::loadMultiple();
    foreach($vocabularies as $id => $vocab) {
      $field_topicmap_definitions = \Drupal::entityManager()->getFieldDefinitions('taxonomy_term', $id);
      $field_topicmap_names = array();
      foreach($field_topicmap_definitions as $def) {
        $field_topicmap_names[] = $def->getName();
      }   
      // If these fields are present on the vocabulary definition then it is a topic map vocabulary.
      if (in_array('field_topicmap_children', $field_topicmap_names) && in_array('field_topicmap_parents', $field_topicmap_names) && in_array('field_topicmap_neighbours', $field_topicmap_names)) {
        $this->derivatives[$id] = $base_plugin_definition;
        $this->derivatives[$id]['admin_label'] = "Topic Map: $id";
      }   
    }
    return $this->derivatives;
  }
}

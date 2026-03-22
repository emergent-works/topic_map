<?php

/**
 * @file
 */
namespace Drupal\topic_map\Plugin\Derivative;

use Drupal\Component\Plugin\Derivative\DeriverBase;
use Drupal\Component\Plugin\Derivative\DeriverInterface;

class KnowledgeGraphBlock extends DeriverBase implements DeriverInterface {

  public function getDerivativeDefinitions($base_plugin_definition) {
    $knowledge_graphs = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree("knowledge_graphs");
    foreach($knowledge_graphs as $id => $term) {
        $this->derivatives[$term->tid] = $base_plugin_definition;
        $this->derivatives[$term->tid]['admin_label'] = "Knowledge Graph: " . $term->name;
    }
    return $this->derivatives;
  }
}

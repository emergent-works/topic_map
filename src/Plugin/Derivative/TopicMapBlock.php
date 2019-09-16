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
    $topic_maps =\Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree("topic_maps");
    foreach($topic_maps as $id => $term) {
        $this->derivatives[$id] = $base_plugin_definition;
        $this->derivatives[$id]['admin_label'] = "Topic Map: $id";
    }
    return $this->derivatives;
  }
}

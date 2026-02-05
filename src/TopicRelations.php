<?php

namespace Drupal\topic_map;

class TopicRelations {

  public static function validate($form, $form_state) {
    // Stops the user from relating a term to itself
    $term_id = $form_state->getFormObject()->getEntity()->id();
    if (!$term_id) return; // this is empty when creating a new term
    $children = $form_state->getValue('field_topicmap_children');
    for($i = 0; $i < sizeof($children); $i++) {
      if(isset($children[$i]) && is_array($children[$i]) && $children[$i]['target_id'] == $term_id) {
        $form_state->setErrorByName("field_topicmap_children][$i", t('A term cannot be its own child'));
      }
    }
    $parents = $form_state->getValue('field_topicmap_parents');
    for($i = 0; $i < sizeof($parents); $i++) {
      if(isset($parents[$i]) && is_array($parents[$i]) && $parents[$i]['target_id'] == $term_id) {
        $form_state->setErrorByName("field_topicmap_parents][$i", t('A term cannot be its own parent'));
      }
    }
    $neighbours = $form_state->getValue('field_topicmap_neighbours');
    for($i = 0; $i < sizeof($neighbours); $i++) {
      if(isset($neighbours[$i]) && is_array($neighbours[$i]) && $neighbours[$i]['target_id'] == $term_id) {
        $form_state->setErrorByName("field_topicmap_neighbours][$i", t('A term cannot be its own neighbour'));
      }
    }
  }

  private $relationshipTypes = array(
    array("base"=> "field_topicmap_neighbours", "opposite"=>"field_topicmap_neighbours"),
    array("base"=> "field_topicmap_parents", "opposite"=>"field_topicmap_children"),
    array("base"=> "field_topicmap_children", "opposite"=>"field_topicmap_parents"),
  );

  public function onInsert($term) {
    foreach($this->relationshipTypes as $relationshipType) {
      // Get the other terms that the term being created is related to in one direction
      $target_ids = $this->getTargetIds($term, $relationshipType["base"]); 
      if ($target_ids) {
        // And give those terms relationships to it, in the other direction
        $this->addRelationships($target_ids, $relationshipType["opposite"], $term->id());
      }
    }
  }

  public function onUpdate($term) {
    foreach($this->relationshipTypes as $relationshipType) {
      // Get the terms to which the term in question is related to now, in one direction
      $new_target_ids = $this->getTargetIds($term, $relationshipType["base"]); 
      // and the ones it was related to before and is no longer
      $old_target_ids = $this->getTargetIds($term->original, $relationshipType["base"]);
      // add and remove the opposite relationships on those terms accordingly
      $added_target_ids = array_diff($new_target_ids, $old_target_ids);
      $removed_target_ids = array_diff($old_target_ids, $new_target_ids);
      if ($added_target_ids) {
        $this->addRelationships($added_target_ids, $relationshipType["opposite"], $term->id());
      }
      if ($removed_target_ids) {
        $this->removeRelationships($removed_target_ids, $relationshipType["opposite"], $term->id());
      }
    }
  }

  private function getTargetIds($base_term, $relationship_field_name) {
    $target_ids = array();
    foreach($base_term->$relationship_field_name as $fieldItem) {
      // sometimes entity is null
      if ($fieldItem->entity) {
        $target_ids[] = $fieldItem->entity->id();
      }
    }
    return $target_ids;
  }

  // Gives each base term a relationship of the specified kind, to the term with the
  // specified target id
  private function addRelationships($base_ids, $relationship_field_name, $target_id) {
    foreach($base_ids as $base_id) {
      $base_term = \Drupal\taxonomy\Entity\Term::load($base_id);
      // check that the relationship does not exist already. This stops recursion
      // and goes some way towards dealing with duplicates (since Drupal doesn't check).
      if (!in_array($target_id, $this->getTargetIds($base_term, $relationship_field_name))) {
        $base_term->$relationship_field_name->appendItem($target_id);  
        $base_term->save();
      }
    }
  }

  // Removes from base terms any relationships of the specified kind to the term with the
  // specified target id
  private function removeRelationships($base_ids, $relationship_field_name, $target_id) {
    foreach($base_ids as $base_id) {
      $base_term = \Drupal\taxonomy\Entity\Term::load($base_id);
      foreach($base_term->$relationship_field_name->getValue() as $delta=>$value) {
        if ($value['target_id'] == $target_id) {
          $base_term->$relationship_field_name->removeItem($delta);
          $base_term->save();
          break;
        }
      }
    }
  }
}

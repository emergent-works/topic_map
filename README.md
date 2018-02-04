# Topic Map

## Installation
* Install as you would any Drupal module.

## Configuration
### Vocabularies
* The module provides 3 fields - `field_topicmap_parents`, `field_topicmap_children` and `field_topicmap_neighbours`.
* Any vocabulary containing all 3 of these fields will be treated as a topic map vocabulary. You can have as many topic map vocabularies as you like. You can make new vocabularies for this purpose or use existing ones.
* Add the fields by using the "Reuse an existing field" dropdown. You can change the field labels to whatever you like. **Under "Available Vocabularies", tick only the vocabulary itself.** The topic map does not support relationships between terms of different vocabularies.  
* If you are adding them to an existing vocabulary, **remove any existing hierarchical structure from the vocabulary first**. The topic map does hierarchy in its own way and will give unintended results if you attempt to use it alongside another.
* After adding all the fields, go to _Configuration -> Performance_ to clear the Drupal cache. 

### Terms
* To create relationships between terms simply fill in the relevant fields when creating or editing the terms.
* After adding, deleting or editing any relationships go to _Configuration -> Performance_ to clear the Drupal cache. 

### Map blocks
* Decide where you want to place topic maps on your site. **You cannot put more than one topic map on the same page**, as they will interfere and give unintended results.
* Go to  _Structure -> Block Layout_ and place the blocks. You should see topic maps for all enabled vocabularies in the list of available blocks. If you don't, ensure that you have cleared the Drupal cache since creating the vocabularies.
* The blocks should now appear on the relevant pages, looking like the illustration above. If you don't see all the terms and links that you expect, ensure you have cleared the Drupal cache since you last added or edited any terms.

# Important note:
**If you have created vocabularies with the fields on but then you delete them, the fields will no longer be available in the "Reuse existing field" dropdown.** If this happens, simply disable and re-enable the module, and the fields will reappear.

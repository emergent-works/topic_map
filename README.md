# Topic Map
# A Drupal module for creating and visualising relationships between taxonomy terms
## What it does
Three basic relationships for any categorisation project are **parent**, **child** and **neighbour** (or to use the [Dublin Core](https://en.wikipedia.org/wiki/Dublin_Core) terminology, [hasPart](http://dublincore.org/documents/2008/01/14/dcmi-terms/#terms-hasPart), [isPartOf](http://dublincore.org/documents/2008/01/14/dcmi-terms/#terms-isPartOf) and [relation](http://dublincore.org/documents/2008/01/14/dcmi-terms/#terms-relation)).
This module makes it easy for you to create these relationships between taxonomy terms, and it makes visual maps of them available as blocks to be used anywhere on your site.
### Relations
Out of the box, Drupal allows you to create hierarchies of taxonomy terms within a vocabulary, but it only provides "parent-child" relationships. You can use entity reference fields to create other relationships, but there is no way to make these symmetrical (i.e. if A is B's neighbour, then B is A's neighbour). 
This module solves these problems by disabling the standard parent-child hierarchy, providing entity reference fields for all three relationships (thus providing a consistent GUI) and automatically creating the inverse and symmetrical relationships as you would intuitively expect.
### Visualisation
The purpose of this module is not just to create the relationships but to provide a visual overview of them in the form of blocks containing interactive maps. Each vocabulary that you enable will automatically yield a block looking like the example below (the two images are the same map shown in different hover states).

![Map with "Apple" selected](https://github.com/hoegrammer/topic_map/blob/master/docs/apple.png)

![Map with "Colour" selected](https://github.com/hoegrammer/topic_map/blob/master/docs/colour.png)

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

## Important note:
**If you have created vocabularies with the fields on but then you delete them, the fields will no longer be available in the "Reuse existing field" dropdown.** If this happens, simply disable and re-enable the module, and the fields will reappear.

## Feedback and further development
IKM are very happy to listen to any feedback you may have about this module and and suggestions for further development. You can contact us via our website, [IKM Emergent](https://www.ikmemergent.net)

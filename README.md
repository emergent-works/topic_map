# Topic Map
### A *Drupal 8* module for creating and visualising relationships between taxonomy terms
## What it does
Three basic relationships for any categorisation project are **parent**, **child** and **neighbour** (or to use the [Dublin Core](https://en.wikipedia.org/wiki/Dublin_Core) terminology, [hasPart](http://dublincore.org/documents/2008/01/14/dcmi-terms/#terms-hasPart), [isPartOf](http://dublincore.org/documents/2008/01/14/dcmi-terms/#terms-isPartOf) and [relation](http://dublincore.org/documents/2008/01/14/dcmi-terms/#terms-relation)).
This module makes it easy for you to create these relationships between taxonomy terms, and it makes visual maps of them available as blocks to be used anywhere on your site.
### Relations
Out of the box, Drupal allows you to create hierarchies of taxonomy terms within a vocabulary, but it only provides "parent-child" relationships. You can use entity reference fields to create other relationships, but there is no way to make these symmetrical (i.e. if A is B's neighbour, then B is A's neighbour). 
This module solves these problems by disabling the standard parent-child hierarchy, providing entity reference fields for all three relationships (thus providing a consistent GUI) and automatically creating the inverse and symmetrical relationships as you would intuitively expect.
### Visualisation
The purpose of this module is not just to create the relationships but to provide a visual overview of them in the form of blocks containing interactive maps. Each vocabulary that you enable will automatically yield a block looking like the example below (the two images are the same map shown in different hover states).
____
![Map with "Apple" selected](https://github.com/hoegrammer/topic_map/blob/master/docs/apple.png)
____
![Map with "Colour" selected](https://github.com/hoegrammer/topic_map/blob/master/docs/colour.png)
____
## Installation
* Install as you would any Drupal module.

## Configuration
### Vocabularies
* Each topic map is bound to a vocabulary. In Drupal, a vocabulary is a list of terms that are related to each other. The terms that will be shown on the topic map have to all belong to the same vocabulary.
* You can create a topic map from an existing vocabulary or you can add a new one. (If you are using an existing vocabulary, **remove any existing hierarchical structure from the vocabulary first**. The topic map does hierarchy in its own way and will give unintended results if you attempt to use it alongside another.)

* To add a new vocabulary, go **Structure->Taxonomy->Vocabulary** and click **Add Vocabulary**. 
____

![Add Vocabulary](https://github.com/hoegrammer/topic_map/blob/master/docs/addvocab.png)
____

* Give the vocabulary a name and description, and save it.
____

![New vocabulary name and descri](https://github.com/hoegrammer/topic_map/blob/master/docs/cheese.png)
____


### Fields


* Next you need to add the fields. If you have just created a new vocabulary, there will be a tab on the page to **Manage Fields**. Click this. 
____

![Manage fields](https://github.com/hoegrammer/topic_map/blob/master/docs/managefields1.png)
____

* Otherwise if you are using an existing vocabulary, you can find **Manage Fields** in the dropdown next to each vocabulary on the overview page
____

![New vocabulary name and descri](https://github.com/hoegrammer/topic_map/blob/master/docs/managedropdown.png)
____

* Click **Add field**.
____

![add field](https://github.com/hoegrammer/topic_map/blob/master/docs/addfield.png)
____


* Add the fields by using the "Reuse an existing field" dropdown. The fields you need to add are `field_topicmap_parents`, `field_topicmap_children` and `field_topicmap_neighbours`.

____

![Reuse existing field](https://github.com/hoegrammer/topic_map/blob/master/docs/reuse.png)

____



* When you add each field it will give you an option to change the field label. You can change it to whatever you like, or use the default labels which are the Dublin Core relationships.

* After clicking **save and continue**, you will see a config page. Scroll down to the *REFERENCE TYPE* section. Under *Available Vocabularies*, make sure that you tick the name of the same vocabulary that you are currently configuring.

____


![Adding the fields](https://github.com/hoegrammer/topic_map/blob/master/docs/reftype.png)

____


* After adding all the fields, go to **Configuration -> Performance** to clear the Drupal cache. 

### Adding topics (terms)
* The topics are called "terms" in Drupal. To add terms to a vocabulary, go to **List Terms** from the vocabulary overview page or click the **List** tab on the page for the vocabulary.

____


![List terms - tab](https://github.com/hoegrammer/topic_map/blob/master/docs/list.png)

____


![List terms - dropdown](https://github.com/hoegrammer/topic_map/blob/master/docs/listdropdown.png)


____


* When you add terms you will have the option to fill in which terms are related to them as parents, children or neigbours. (Obviously not for the first term you add, as no others will exist to link to). E.g. here I have already added a term "Cheddar", so when I now add the term "English Cheese" I can fill in "Cheddar" as a child topic:

____


![Creating a term with relationships](https://github.com/hoegrammer/topic_map/blob/master/docs/cheddar.png)

____


* You can add, remove and change relationships at a later date, by editing the term.
____


![Edit term](https://github.com/hoegrammer/topic_map/blob/master/docs/editterm.png)

____


* After adding, deleting or editing any relationships go to **Configuration -> Performance** to clear the Drupal cache, so that they appear on the topic map.

____


![Clear the cache](https://github.com/hoegrammer/topic_map/blob/master/docs/cache.png)

____


### Map blocks
* Decide where you want to place topic maps on your site. **You cannot put more than one topic map on the same page**, as they will interfere and give unintended results. 
* Go to **Structure -> Block Layout** and place the blocks. Suppose you want to place the "Varieties of Cheese" topic map in the secondary (right-hand) sidebar on the "About Us" page. You would find the secondary sidebar section and click **Place Block**

____


![Place block in secondary sidebar](https://github.com/hoegrammer/topic_map/blob/master/docs/secondary.png)


____


* You should see topic maps for all enabled vocabularies in the list of available blocks. If you don't, ensure that you have cleared the Drupal cache since creating the vocabularies.

____


![Block menu](https://github.com/hoegrammer/topic_map/blob/master/docs/blockmenu.png)

____


* Select the block you want, click **Place Block** and then you can say which page you want it to appear on by clicking the **pages** tab and filling it in:

____


![Block page config](https://github.com/hoegrammer/topic_map/blob/master/docs/pages.png)

____


* Click **Save Block** and now you will see the topic map on the page in the area you selected. If you don't see all the terms and links that you expect, ensure you have cleared the Drupal cache since you last added or edited any terms.

## Important note:
**If you have created vocabularies with the fields on but then you delete all of them, the fields will no longer be available in the "Reuse existing field" dropdown.** If this happens, simply uninstall and reinstall the module (just via the GUI), and the fields will reappear.

## Feedback and further development
Emergent Works are very happy to listen to any feedback you may have about this module and suggestions for further development. You can contact us via [our website](https://www.emergentworks.net/) (or log an issue on here of course).

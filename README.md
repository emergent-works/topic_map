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

## Creating and displaying topic maps

### Adding topics
* The first thing you need to do is create some topics, and relate those topics to one another. To add topics, go to **Structure->Taxonomy**, and click **List Terms** against the vocabulary called "Topics".
____

* When you add terms you will have the option to fill in which terms are related to them as parents, children or neigbours. (Obviously not for the first term you add, as no others will exist to link to). E.g. here I have already added a term "Cheddar", so when I now add the term "English Cheese" I can fill in "Cheddar" as a topic which forms part of that category.

____


![Creating a term with relationships](https://github.com/hoegrammer/topic_map/blob/master/docs/cheddar.png)

____


### Creating maps

* Now that you have some topics to map, you can create a topic map. Go to **Structure->Taxonomy**, and click **List Terms** against the vocabulary called "Topic Maps". Then click **Add Term** and enter the name of your map. 

![Creating a topic map](https://github.com/hoegrammer/topic_map/blob/master/docs/create-map.png)
____


Scroll down to the "Topics" field to add topics to your map. 
____

![Adding topics to a map](https://github.com/hoegrammer/topic_map/blob/master/docs/add-topics-to-map.png)
____


### Displaying the map

* After creating a new map, go to **Configuration -> Performance** to clear the Drupal cache. Otherwise your changes will not take effect immediately and it will appear not to have worked.
____


![Clear the cache](https://github.com/hoegrammer/topic_map/blob/master/docs/cache.png)


* Decide where you want to place topic maps on your site. **You cannot put more than one topic map on the same page**, as they will interfere and give unintended results. 
* Go to **Structure -> Block Layout** and place the blocks. Suppose you want to place the "Varieties of Cheese" topic map in the secondary (right-hand) sidebar on the "About Us" page. You would find the secondary sidebar section and click **Place Block**

____


![Place block in secondary sidebar](https://github.com/hoegrammer/topic_map/blob/master/docs/secondary1.png)


____


![Block menu](https://github.com/hoegrammer/topic_map/blob/master/docs/blockmenu1.png)

____


* Select the block you want, click **Place Block** and then you can say which page you want it to appear on by clicking the **pages** tab and filling it in:

____


![Block page config](https://github.com/hoegrammer/topic_map/blob/master/docs/pages.png)

____


* Click **Save Block** and now you will see the topic map on the page in the area you selected. If you don't see all the terms and links that you expect, ensure you have cleared the Drupal cache since you last added or edited any terms.

## Making changes to existing maps

* You can edit topic maps or topics themselves and the relations between them at any time. Just load the **Topics** or **Topic Maps** vocabularies and click **Edit** next to the topic or topic map that you wish to edit. 
____


![Edit term](https://github.com/hoegrammer/topic_map/blob/master/docs/editterm.png)

____

* After adding, deleting or editing any relationships go to **Configuration -> Performance** to clear the Drupal cache. Otherwise you will not see your changes appear and it will seem not to have worked.


## Deleting topics and topic maps
* If you no longer want to show a block, go to **Structure->Block Layout** and disable it. 
* If you actually want to delete a map, you can do that on the edit screen for the map. 
* If you want to delete some topics you can do that on the edit screens for the topics.

## Feedback and further development
Emergent Works are very happy to listen to any feedback you may have about this module and suggestions for further development. You can contact us via [our website](https://www.emergentworks.net/) (or log an issue on here of course).

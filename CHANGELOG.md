## [1.1.0] - 2025-03-03
  
Added knowledge graph capability as well as topic map. A knowledge graph references a vocabulary and pulls all the keywords from there, whereas a topic map, which is legacy, requires manually entering all the topics (keywords) you want to appear on it. The new way is preferable because keywords only need entering once.

It is backwards compatible, so the old topic maps still work and you can add new topic maps using the legacy method.
 
### Added
  
- Knowledge graphs vocabulary
- REAL2 keywords vocabulary
- Code to render knowledge graphs (currently buggy)
 


## [1.0.2] - 2025-03-09

### Fixed
  
- Removed some debug code that was showing the numbers of descendents on the graph nodes



## [1.0.1] - 2025-03-09

Made D11-compatible

### Changed
  
- Added Drupal 11 to core version requirement
 


## [1.0.0] - 2025-03-03
  
Start of the version developed for REAL2
 
### Changed
  
- Node size now varies with the number of descendents of the node, not just its immediate children.
- A warning is shown after saving a topic if it has introduced a cycle.
 
### Fixed
 
- Nodes wiggling around when you click on them

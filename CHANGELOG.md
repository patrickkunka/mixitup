MixItUp ChangeLog
=================

## 2.1.7
- Fixed removeStyle jQuery method to account for camel-cased style properties in firefox, affecting animateResizeTargets.
- Replaced all == with ===
- Ensure there are targets before before calling nextElementSibling in _printSort method
- Removed some messy whitespace

## 2.1.6
- Replaced occurences of .nodeValue with .value to remove deprecation warning in latest Chrome
- Removed miscellaneous trailing whitespace characters

## 2.1.5
- Fixed mis-naming issue preventing user-defined staggerSequence function from being called.
- Fixed issue where filter-in animations broke if 'fade' effect was not present

## 2.1.4
- Made new sorting order available to futureState object during mixStart event
- Made new display value available to futureState object during mixStart event

## 2.1.3
- Fixed scrolling issues when container height reduces document height past current scroll positiong
- Added _isElement() helper for IE8 to test HTMLElement, fixing _parseInsertArgs bug in IE8

## 2.1.2
- Added `forceRefresh` method enabling on-demand re-synthesis of HTML5 data attributes to dataset properties for IE10 and below.

## 2.1.1
- Fixed issue from 2.0.5 preventing _buildState action hook from modifying state object, affected pagination extension.

## 2.1.0
- Fixed issue preventing clickable controls from controlling multiple instantiations simultaneously.
- Fixed issue when using insert/append/prepend method on an empty container
- Added new static API methods for extending $.MixItUp prototype, and hooking actions and filters.

## 2.0.6
- Retain scroll position if container height change decreases document height while filtering out targets. 
- Fixed animation bug when sorting by 'default:desc'.

## 2.0.5
- Added a 'futureState' object as the second parameter for the `onMixStart` callback and `'mixStart'` event.

## 2.0.4
- Fixed issue with `controls.toggleFilterButtons` where `'none'` was included in toggleArray. Various toggle logic related improvements.

## 2.0.3
- Fixed `_updateControls()` bug when `controls.toggleFilterButtons` is set to `true`

## 2.0.2
- Fixed `controls.toggleFilterButtons` config option

## 2.0.1
- Fixed some IE8 issues.

## 2.0.0
- Complete rewrite. See [Version 1 Migration Guide](docs/version-1-migration.md) for more information.






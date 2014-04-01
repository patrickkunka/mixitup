MixItUp ChangeLog
=================

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






Change Log
==========

## 3.1.10

- Fixes an issue where the `activeContainerClass` did not persist between non-layout-change operations (e.g. sort, filter).

## 3.1.9

- Fixes an issue relating to `animation.clampHeight` where the height was not correctly applied causing scroll jumping in certain situations.

## 3.1.8

- Adds ability to bind live controls where multiple parents exist. Required for Pagination 3.2.0.

## 3.1.7

- Fixed duplicate hook `beforeCacheDom` in `Target#cacheDom`. Now renamed to `afterCacheDom`.

## 3.1.6

- Added composer.json

## 3.1.5

- Fixed several issues relating to the Dataset API and multimix-like operations (i.e. simultaneous insertion/removal/sorting/dirty-checking)

## 3.1.4

- Added ability to extend static factory methods (such as `mixitup.use`) with hooks.
- Added ability to return a single DOM element from `render.target` instead of an HTML string
- Moved target rendering functionality into `Target` class, so that targets can render themselves
- Force disable controls if dataset API is in use (if `data.uidKey` is set)

## 3.1.3

- Exposed `.toggleOn()` and `.toggleOff()` API methods publicly via the mixer facade, as were accidently missed out previously.

## 3.1.2

- Improved `compareVersions` util function to handle semver notation correctly (e.g. `'^'`, `'~'`, `'-beta'`, etc).
- Fixed issue with "Filtering by URL" demo that added a `#mix` segment to the URL for filter "all"

## 3.1.1

- Fixed issue where `transitionend` event handlers were not rebound to re-rendered targets during dirtyCheck updates.
- Fixed issue where dataset operation objects where created on push to queue, resulting in corrupted target data.

## 3.1.0

- Added `selectors.controls` configuration option to allow for further specificity of control querying
in addition to the mandatory data attributes.
- Fixed package.json issues.

## 3.0.1

- Fixed issue where `layout.containerClassName` is not reflected in state object after instantiation.

## 3.0.0

- Release
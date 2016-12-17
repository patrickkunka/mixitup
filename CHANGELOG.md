Change Log
==========

## 3.0.0

- Release

## 3.0.1

- Fixed issue where `layout.containerClassName` is not reflected in state object after instantiation.

## 3.1.0

- Added `selectors.controls` configuration option to allow for further specificity of control querying
in addition to the mandatory data attributes.
- Fixed package.json issues.

## 3.1.1

- Fixed issue where `transitionend` event handlers were not rebound to re-rendered targets during dirtyCheck updates.
- Fixed issue where dataset operation objects where created on push to queue, resulting in corrupted target data.

## 3.1.2

- Improved `compareVersions` util function to handle semver notation correctly (e.g. `'^'`, `'~'`, `'-beta'`, etc).
- Fixed issue with "Filtering by URL" demo that added a `#mix` segment to the URL for filter "all"
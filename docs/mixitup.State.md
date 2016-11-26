# mixitup.State

## Overview

`mixitup.State` objects expose various pieces of data detailing the state of
a MixItUp instance. They are provided at the start and end of any operation via
callbacks and events, with the most recent state stored between operations
for retrieval at any time via the API.

### Contents

- [id](#id)
- [activeFilter](#activeFilter)
- [activeSort](#activeSort)
- [activeContainerClassName](#activeContainerClassName)
- [container](#container)
- [targets](#targets)
- [hide](#hide)
- [show](#show)
- [matching](#matching)
- [totalTargets](#totalTargets)
- [totalShow](#totalShow)
- [totalHide](#totalHide)
- [totalMatching](#totalMatching)
- [hasFailed](#hasFailed)
- [triggerElement](#triggerElement)
- [activeDataset](#activeDataset)


<h3 id="id">id</h3>




The ID of the mixer instance.


|Type | Default
|---  | ---
|`string`| `''`


<h3 id="activeFilter">activeFilter</h3>




The currently active filter command as set by a control click or API call.


|Type | Default
|---  | ---
|`mixitup.CommandFilter`| `null`


<h3 id="activeSort">activeSort</h3>




The currently active sort command as set by a control click or API call.


|Type | Default
|---  | ---
|`mixitup.CommandSort`| `null`


<h3 id="activeContainerClassName">activeContainerClassName</h3>




The current layout-specific container class name, if applied.


|Type | Default
|---  | ---
|`string`| `''`


<h3 id="container">container</h3>




A reference to the container element that the mixer is instantiated on.


|Type | Default
|---  | ---
|`Element`| `null`


<h3 id="targets">targets</h3>




An array of all target elements indexed by the mixer.


|Type | Default
|---  | ---
|`Array.<Element>`| `[]`


<h3 id="hide">hide</h3>




An array of all target elements not matching the current filter.


|Type | Default
|---  | ---
|`Array.<Element>`| `[]`


<h3 id="show">show</h3>




An array of all target elements matching the current filter and any additional
limits applied such as pagination.


|Type | Default
|---  | ---
|`Array.<Element>`| `[]`


<h3 id="matching">matching</h3>




An array of all target elements matching the current filter irrespective of
any additional limits applied such as pagination.


|Type | Default
|---  | ---
|`Array.<Element>`| `[]`


<h3 id="totalTargets">totalTargets</h3>




An integer representing the total number of target elements indexed by the
mixer. Equivalent to `state.targets.length`.


|Type | Default
|---  | ---
|`number`| `-1`


<h3 id="totalShow">totalShow</h3>




An integer representing the total number of target elements matching the
current filter and any additional limits applied such as pagination.
Equivalent to `state.show.length`.


|Type | Default
|---  | ---
|`number`| `-1`


<h3 id="totalHide">totalHide</h3>




An integer representing the total number of target elements not matching
the current filter. Equivalent to `state.hide.length`.


|Type | Default
|---  | ---
|`number`| `-1`


<h3 id="totalMatching">totalMatching</h3>




An integer representing the total number of target elements matching the
current filter irrespective of any other limits applied such as pagination.
Equivalent to `state.matching.length`.


|Type | Default
|---  | ---
|`number`| `-1`


<h3 id="hasFailed">hasFailed</h3>




A boolean indicating whether the last operation "failed", i.e. no targets
could be found matching the filter.


|Type | Default
|---  | ---
|`boolean`| `false`


<h3 id="triggerElement">triggerElement</h3>




The DOM element that was clicked if the last operation was triggered by the
clicking of a control and not an API call.


|Type | Default
|---  | ---
|`Elementnull`| `null`


<h3 id="activeDataset">activeDataset</h3>




The currently active dataset underlying the rendered targets, if the
dataset API is in use.


|Type | Default
|---  | ---
|`Array.<object>`| `null`



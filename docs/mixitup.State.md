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


## Members

### id




The ID of the mixer instance.


|Type | Default
|---  | ---
|`string`| `''`


### activeFilter




The currently active filter command as set by a control click or API call
call.


|Type | Default
|---  | ---
|`mixitup.CommandFilter`| `null`


### activeSort




The currently active sort command as set by a control click or API call.


|Type | Default
|---  | ---
|`mixitup.CommandSort`| `null`


### activeContainerClassName




The current layout-specific container class name, if applied.


|Type | Default
|---  | ---
|`string`| `''`


### container




A reference to the container element that the mixer is instantiated on.


|Type | Default
|---  | ---
|`Element`| `null`


### targets




An array of all target elements indexed by the mixer.


|Type | Default
|---  | ---
|`Array.<Element>`| `[]`


### hide




An array of all target elements not matching the current filter.


|Type | Default
|---  | ---
|`Array.<Element>`| `[]`


### show




An array of all target elements matching the current filter and any additional
limits applied such as pagination.


|Type | Default
|---  | ---
|`Array.<Element>`| `[]`


### matching




An array of all target elements matching the current filter irrespective of
any additional limits applied such as pagination.


|Type | Default
|---  | ---
|`Array.<Element>`| `[]`


### totalTargets




An integer representing the total number of target elements indexed by the
mixer. Equivalent to `state.targets.length`.


|Type | Default
|---  | ---
|`number`| `-1`


### totalShow




An integer representing the total number of target elements matching the
current filter and any additional limits applied such as pagination.
Equivalent to `state.show.length`.


|Type | Default
|---  | ---
|`number`| `-1`


### totalHide




An integer representing the total number of target elements not matching
the current filter. Equivalent to `state.hide.length`.


|Type | Default
|---  | ---
|`number`| `-1`


### totalMatching




An integer representing the total number of target elements matching the
current filter irrespective of any other limits applied such as pagination.
Equivalent to `state.matching.length`.


|Type | Default
|---  | ---
|`number`| `-1`


### hasFailed




A boolean indicating whether the last operation "failed", i.e. no targets
could be found matching the filter.


|Type | Default
|---  | ---
|`boolean`| `false`


### triggerElement




The DOM element that was clicked if the last oepration was triggered by the
clicking of a control and not an API call.


|Type | Default
|---  | ---
|`Elementnull`| `null`


### activeDataset




The currently active dataset underlying the rendered targets, if the
dataset API is in use.


|Type | Default
|---  | ---
|`Array.<object>`| `null`



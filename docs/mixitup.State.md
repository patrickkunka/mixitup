# mixitup.State

## Overview

`mixitup.State` objects expose various pieces of data detailing the state of
a MixItUp instance. They are provided at the start and end of any operation via
callbacks and events, with the most recent state stored between operations
for retrieval at any time via the API.


## Members

### <a id="mixitup.State#id">id</a>




The ID of the mixer instance.


|Type | Default
|---  | ---
|`string`| `''`


### <a id="mixitup.State#activeFilter">activeFilter</a>




The currently active filter command as set by a control click or API call
call.


|Type | Default
|---  | ---
|`mixitup.CommandFilter`| `null`


### <a id="mixitup.State#activeSort">activeSort</a>




The currently active sort command as set by a control click or API call.


|Type | Default
|---  | ---
|`mixitup.CommandSort`| `null`


### <a id="mixitup.State#activeContainerClassName">activeContainerClassName</a>




The current layout-specific container class name, if applied.


|Type | Default
|---  | ---
|`string`| `''`


### <a id="mixitup.State#container">container</a>




A reference to the container element that the mixer is instantiated on.


|Type | Default
|---  | ---
|`Element`| `null`


### <a id="mixitup.State#targets">targets</a>




An array of all target elements indexed by the mixer.


|Type | Default
|---  | ---
|`Array.<Element>`| `[]`


### <a id="mixitup.State#hide">hide</a>




An array of all target elements not matching the current filter.


|Type | Default
|---  | ---
|`Array.<Element>`| `[]`


### <a id="mixitup.State#show">show</a>




An array of all target elements matching the current filter and any additional
limits applied such as pagination.


|Type | Default
|---  | ---
|`Array.<Element>`| `[]`


### <a id="mixitup.State#matching">matching</a>




An array of all target elements matching the current filter irrespective of
any additional limits applied such as pagination.


|Type | Default
|---  | ---
|`Array.<Element>`| `[]`


### <a id="mixitup.State#totalTargets">totalTargets</a>




An integer representing the total number of target elements indexed by the
mixer. Equivalent to `state.targets.length`.


|Type | Default
|---  | ---
|`number`| `-1`


### <a id="mixitup.State#totalShow">totalShow</a>




An integer representing the total number of target elements matching the
current filter and any additional limits applied such as pagination.
Equivalent to `state.show.length`.


|Type | Default
|---  | ---
|`number`| `-1`


### <a id="mixitup.State#totalHide">totalHide</a>




An integer representing the total number of target elements not matching
the current filter. Equivalent to `state.hide.length`.


|Type | Default
|---  | ---
|`number`| `-1`


### <a id="mixitup.State#totalMatching">totalMatching</a>




An integer representing the total number of target elements matching the
current filter irrespective of any other limits applied such as pagination.
Equivalent to `state.matching.length`.


|Type | Default
|---  | ---
|`number`| `-1`


### <a id="mixitup.State#hasFailed">hasFailed</a>




A boolean indicating whether the last operation "failed", i.e. no targets
could be found matching the filter.


|Type | Default
|---  | ---
|`boolean`| `false`


### <a id="mixitup.State#triggerElement">triggerElement</a>




The DOM element that was clicked if the last oepration was triggered by the
clicking of a control and not an API call.


|Type | Default
|---  | ---
|`Elementnull`| `null`


### <a id="mixitup.State#activeDataset">activeDataset</a>




The currently active dataset underlying the rendered targets, if the
dataset API is in use.


|Type | Default
|---  | ---
|`Array.<object>`| `null`



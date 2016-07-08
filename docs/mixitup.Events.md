# mixitup.Events

## Overview

The `mixitup.Events` class contains all custom events dispatched by MixItUp.
Each event is analogous to the callback function of the same name defined in
the `callbacks` configuration object, and is triggered immediately before it.

Events are always triggered from the container element on which MixItUp is instantiated
upon.

As with any event, registered event handlers receive the event object as a parameter
which includes a `detail` property containting references to the current `state`,
the `mixer` instance, and other event-specific properties described below.

## Members

### <a id="mixitup.Events.mixStart">mixitup.Events.mixStart</a>



A custom event triggered immediately after any MixItUp operation is requested
and before animations have begun.

The `mixStart` event also exposes a `futureState` property via the
`event.detail` object, which represents the final state of the mixer once
the requested operation has completed.


|Type
|---
|`CustomEvent`

### <a id="mixitup.Events.mixBusy">mixitup.Events.mixBusy</a>



A custom event triggered when a MixItUp operation is requested while another
operation is in progress, and the animation queue is full, or queueing
is disabled.


|Type
|---
|`CustomEvent`

### <a id="mixitup.Events.mixEnd">mixitup.Events.mixEnd</a>



A custom event triggered after any MixItUp operation has completed, and the
state has been updated.


|Type
|---
|`CustomEvent`

### <a id="mixitup.Events.mixFail">mixitup.Events.mixFail</a>



A custom event triggered whenever a filter operation "fails", i.e. no targets
could be found matching the filter.


|Type
|---
|`CustomEvent`

### <a id="mixitup.Events.mixClick">mixitup.Events.mixClick</a>



A custom event triggered whenever a MixItUp control is clicked, and before its
respective operation is requested.

This event also exposes an `originalEvent` property via the `event.detail`
object, which holds a reference to the original click event.


|Type
|---
|`CustomEvent`


Events
=========

1. [Overview](#overview)
1. [Event Details](#events)
1. [Binding](#binding)

## Overview

MixItUp containers trigger the following events which may be bound with custom event handlers:

## Event Details

- `mixLoad` - Triggered when MixItUp first loads and any loading animation has completed.
- `mixStart` - Triggered immediately after any MixItUp operation is requested and before animations have begun.
- `mixEnd` – Triggered after any MixItUp operation has completed, and the state object has been updated.
- `mixFail` - Triggered after a filter operation when no target elements match the requested filter command.
- `mixBusy` - Triggered if animation queuing is disabled and a MixItUp operation is requested while another operation is in progress.

## Binding

Binding events may be preferable to setting single callback functions via the configuration object if conditional behaviour is required or you wish to add and remove event handlers dynamically.

MixItUp events may be bound as follows using jQuery. The state object is passed as the second parameter after the event object. For `mixStart`, a futureState object is passed as the third parameter.

```
$('#Container').on('mixEnd', function(e, state){
	console.log(state.totalShow+' elements match the current filter');
});
```
> Binding a the "mixEnd" event using jQuery's .on() method

<br/>

-------
*&copy; 2014 KunkaLabs Limited*
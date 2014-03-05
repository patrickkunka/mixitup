State Object
=========

1. [Overview](#overview)
1. [Properties](#properties)
1. [Retrieval](#retrieval)

## Overview

The state object is returned as the first argument of all callback functions, and is also available via the ‘getState’ API method. It contains useful information about the current filter and sort state.

## Properties

The State object contains the following properties:

- `state.activeFilter` – the active filter string, object or function
- `state.activeSort` – the active sort string
- `state.fail` – a boolean indicating if no targets matching the filter were found
- `state.$targets` – a jQuery object collection of target elements
- `state.$show` – a jQuery object collection of currently shown target elements
- `state.$hide` – a jQuery object collection of currently hidden target elements
- `state.totalTargets` – the total number of target elements in the container
- `state.totalShow` – the total number of target elements currently shown
- `state.totalHide` – the total number of target elements currently hidden

### Retrieval

The State object can be retrieved as follows:

```
$('#Container').mixItUp({
	callbacks: {
		onMixEnd: function(state){
			console.log(state)
		}	
	}
});
```
> The state object is available as the first parameter of all callback functions

<br/>

```
$('#Container').on('mixEnd', function(e, state){
	console.log(state);
});
```
> Any event handlers bound to MixItUp events with jQuery's `.on()` or `.bind()` methods, receive the state object as the second parameter of the callback function.

<br/>

```
var state = $('#Container').mixItUp('getState');

console.log(state);
```
> The state object is also available via the "getState" API method at any time.

<br/>

-------
*&copy; 2014 KunkaLabs Limited*
# mixitup.Config.callbacks

## Overview




## Members

### <a id="mixitup.Config.callbacks#onMixStart">mixitup.Config.callbacks.onMixStart</a>




A callback function invoked at the start of all operations, before animation
has ocurred. Both the current state and the "future state" are passed to the
function as arguments.


|Type | Default
|---  | ---
|`function`| `null`

> Example: Adding an `onMixStart` callback function

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixStart: function(state, futureState) {
             console.log('Starting operation...');
        }
    }
});
```

### <a id="mixitup.Config.callbacks#onMixBusy">mixitup.Config.callbacks.onMixBusy</a>




A callback function invoked if an operation is requested while queueing is disabled
or the queue is full.


|Type | Default
|---  | ---
|`function`| `null`

> Example: Adding an `onMixBusy` callback function

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixBusy: function(state) {
             console.log('Mixer busy');
        }
    }
});
```

### <a id="mixitup.Config.callbacks#onMixEnd">mixitup.Config.callbacks.onMixEnd</a>




A callback function invoked whenever an operation completes.


|Type | Default
|---  | ---
|`function`| `null`

> Example: Adding an `onMixEnd` callback function

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixBusy: function(state) {
             console.log('Operation complete');
        }
    }
});
```

### <a id="mixitup.Config.callbacks#onMixFail">mixitup.Config.callbacks.onMixFail</a>




A callback function invoked whenever an operation "fails", meaning no targets
were found matching the requested filter.


|Type | Default
|---  | ---
|`function`| `null`

> Example: Adding an `onMixFail` callback function

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixFail: function(state) {
             console.log('No items could be found matching the requested filter');
        }
    }
});
```

### <a id="mixitup.Config.callbacks#onMixClick">mixitup.Config.callbacks.onMixClick</a>




A callback function invoked whenever a control is clicked. The clicked element is
assigned to the `this` keyword within the function. The original click event is
passed to the function as the second argument, which can be useful if using `<a>`
tags as controls where the default behavior needs to be prevented.


|Type | Default
|---  | ---
|`function`| `null`

> Example 1: Adding an `onMixClick` callback function

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixClick: function(state, originalEvent) {
             console.log('The control "' + this.innerText + '" was clicked');
        }
    }
});
```
> Example 2: Using `onMixClick` to manipulate the original click event

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixClick: function(state, originalEvent) {
             // Prevent original click event from bubbling up:
             originalEvent.stopPropagation();

             // Prevent default behavior of clicked element:
             originalEvent.preventDefault();
        }
    }
});
```


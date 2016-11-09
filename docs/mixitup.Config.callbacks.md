# mixitup.Config.callbacks

## Overview




## Members

### <a id="mixitup.Config.callbacks#enable">mixitup.Config.callbacks.enable</a>




A callback function invoked at the start of all operations, before animation has ocurred.
Both the current state and the "future state" are passed to the function as arguments.


|Type | Default
|---  | ---
|`function`| `null`

> Example: Adding an `onMixStart` callback function

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixStart: function(state, futureState) {
             console.log('starting operation...');
        }
    }
});
```


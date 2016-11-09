# mixitup.Config.callbacks

## Overview




## Members

### <a id="mixitup.Config.callbacks#onMixStart">mixitup.Config.callbacks.onMixStart</a>




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

### <a id="mixitup.Config.callbacks#onMixBusy">mixitup.Config.callbacks.onMixBusy</a>







|Type | Default
|---  | ---
|`function`| `null`


### <a id="mixitup.Config.callbacks#onMixEnd">mixitup.Config.callbacks.onMixEnd</a>







|Type | Default
|---  | ---
|`function`| `null`


### <a id="mixitup.Config.callbacks#onMixFail">mixitup.Config.callbacks.onMixFail</a>







|Type | Default
|---  | ---
|`function`| `null`


### <a id="mixitup.Config.callbacks#onMixClick">mixitup.Config.callbacks.onMixClick</a>







|Type | Default
|---  | ---
|`function`| `null`



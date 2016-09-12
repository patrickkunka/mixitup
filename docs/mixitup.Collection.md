# mixitup.Collection

## Overview

A jQuery-collection-like wrapper around one or more `mixitup.Mixer` instances
allowing simultaneous control of said instances similar to the MixItUp 2 API.


## Members

### <a id="mixitup.Collection#mixitup">mixitup.Collection.mixitup</a>

**Version added: 3.0.0**

```js
.mixitup(methodName[,arg1][,arg2..]);
```

Calls a method on all instances in the collection by passing the method
name as a string followed by any applicable parameters to be curried into
to the method.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `methodName` | 
|Returns |`Promise.<Array.<mixitup.State>>` | 


> 

```js
var collection = new Collection([mixer1, mixer2]);

return collection.mixer('filter', '.cat-1')
    .then(function(states) {
        console.log('all instances filtered');
    });
```


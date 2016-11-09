# mixitup.Config.data

## Overview

A group of properties relating to MixItUp's dataset API.


## Members

### <a id="mixitup.Config.data#uid">mixitup.Config.data.uid</a>




A string specifying the name of the key containing your data model's unique
identifier (UID). To use the dataset API, a UID key must be specified and
be present and unique on all objects in the dataset you provide to MixItUp.

For example, if your dataset is made up of MongoDB documents, the UID
key would be `'id'` or `_id`.


|Type | Default
|---  | ---
|`string`| `''`

> Example: Setting the UID to `'id'`

```js
var mixer = mixitup(containerEl, {
    data: {
        uid: 'id'
    }
});
```

### <a id="mixitup.Config.data#dirtyCheck">mixitup.Config.data.dirtyCheck</a>




A boolean dictating whether or not MixItUp should "dirty check" each object in
your dataset for changes whenever `.dataset()` is called, and re-render any targets
for which a change is found.

Depending on the complexity of your data model, dirty checking can be expensive
and is therefore disabled by default.

NB: For changes to be detected, a new immutable instance of your model must be
provided to mixitup, rather than manipulating properties on the existing instance.
This is because mixitup caches each object in the dataset (by its UID) on each
dataset call, and compares each object in the provided dataset to its predecessor.
Therefore, any property manipulation will result in the the cached reference also
being updated and no change will be detected.


|Type | Default
|---  | ---
|`boolean`| `false`

> Example: Enabling dirty checking

```js

var myDataset = [
   {
      id: 0,
      title: "Blog Post 1"
      ...
   },
   {
      id: 1,
      title: "Blog Post 2"
      ...
   }
]

// Instantiate a mixer with a pre-loaded dataset, and a target renderer function defined

var mixer = mixitup(containerEl, {
    data: {
        uid: 'id',
        dirtyCheck: true
    },
    load: {
        dataset: myDataset
    },
    render: {
        target: function() { ... }
    }
});

// For illustration, clone and edit the second object in the dataset
// NB: this would typically be done server-side in response to a DB update

myDataset[1] = Object.assign({}, myDataset[1]);

myDataset[1].title = 'Blog Post 22';

mixer.dataset(myDataset)
   .then(function() {
       // the target with ID "1", will be re-rendered reflecting its new title
   });
```


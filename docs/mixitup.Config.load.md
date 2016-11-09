# mixitup.Config.load

## Overview

A group of properties relating to the initial state of the mixer on load (instantiation).


## Members

### <a id="mixitup.Config.load#filter">mixitup.Config.load.filter</a>




A string defining any filtering to be statically applied to the mixer on load.
As per the `.filter()` API, this can be any valid selector string, or the
values `'all''` or `'none'`.


|Type | Default
|---  | ---
|`string`| `'all'`

> Example 1: Defining an initial filter selector to be applied on load

```js

// The mixer will show only those targets matching '.category-a' on load.

var mixer = mixitup(containerEl, {
    load: {
        filter: '.category-a'
    }
});
```
> Example 2: Hiding all targets on load

```js

// The mixer will show hide all targets on load.

var mixer = mixitup(containerEl, {
    load: {
        filter: 'none'
    }
});
```

### <a id="mixitup.Config.load#sort">mixitup.Config.load.sort</a>




A string defining any sorting to be statically applied to the mixer on load.
As per the `.sort()` API, this should be a valid "sort string" made up of
an attribute to sort by (or `'default'`) followed by an optional sorting
order, or the value `'random'`;


|Type | Default
|---  | ---
|`string`| `'default:asc'`

> Example: Defining sorting to be applied on load

```js

// The mixer will sort the container by the value of the `data-published-date`
// attribute, in descending order.

var mixer = mixitup(containerEl, {
    load: {
        sort: 'published-date:desc'
    }
});
```

### <a id="mixitup.Config.load#dataset">mixitup.Config.load.dataset</a>




An array of objects representing the underlying data of any pre-rendered targets,
if using the `.dataset()` API. If targets are pre-rendered when the mixer is
instantiated, this must be set.


|Type | Default
|---  | ---
|`Array.<object>`| `null`

> Example: Defining the initial underyling dataset

```js

var myDataset = [
    {
        id: 0,
        title: "Blog Post Title 0",
        ...
    },
    {
        id: 1,
        title: "Blog Post Title 1",
        ...
    }
];

var mixer = mixitup(containerEl, {
    data: {
        uid: 'id'
    },
    load: {
        dataset: myDataset
    }
});
```


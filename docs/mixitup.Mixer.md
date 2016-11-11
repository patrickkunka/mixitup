# mixitup.Mixer

## Overview

The `mixitup.Mixer` class is used to hold discreet, user-configured
instances of MixItUp on a provided container element.

Mixer instances are returned whenever the `mixitup()` factory function is called,
which expose a range of methods enabling API-based filtering, sorting,
insertion, removal and more.


## Members

### <a id="mixitup.Mixer#show">mixitup.Mixer.show</a>

**Version added: 3.0.0**

```js
.show()
```

A shorthand method for `.filter('all')`. Shows all targets in the container.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


> Example: Showing all targets

```js

mixer.show()
    .then(function(state) {
        console.log(state.totalShow + ' targets were shown');
    });
```

### <a id="mixitup.Mixer#hide">mixitup.Mixer.hide</a>

**Version added: 3.0.0**

```js
.hide()
```

A shorthand method for `.filter('none')`. Hides all targets in the container.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


> Example: Hiding all targets

```js

mixer.hide()
    .then(function(state) {
        console.log(state.totalHide + ' targets were hidden');
    });
```

### <a id="mixitup.Mixer#isMixing">mixitup.Mixer.isMixing</a>

**Version added: 2.0.0**

```js
.isMixing()
```

Returns a boolean indicating whether or not a MixItUp operation is
currently in progress.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`boolean` | 


> Example: Checking the status of a mixer

```js

var isMixing = mixer.isMixing();

if (isMixing) {
    console.log('An operation is in progress');
} else {
    console.log('The mixer is idle');
}
```

### <a id="mixitup.Mixer#filter">mixitup.Mixer.filter</a>

**Version added: 2.0.0**

```js
.filter(selector [, animate] [, callback])
```

Filters all targets in the container by a provided selector string, or the values `'all'`
or `'none'`. Only targets matching the selector will be shown.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `selector` | Any valid CSS selector (i.e. `'.category-a'`), or the values `'all'` or `'none'`.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether or not the filter operation should animate.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example 1: Filtering targets by a class selector

```js

mixer.filter('.category-a')
    .then(function(state) {
        console.log(state.totalShow + ' targets were found matching ' + state.activeFilter.selector);
    });
```
> Example 2: Filtering targets by an attribute selector

```js

mixer.filter('[data-category~="a"]')
    .then(function(state) {
        console.log(state.totalShow + ' targets were found matching ' + state.activeFilter.selector);
    });
```
> Example 3: Filtering targets by a compound selector

```js

// Show only those targets with the classes 'category-a' AND 'category-b'

mixer.filter('.category-a.category-c')
    .then(function(state) {
        console.log(state.totalShow + ' targets were found matching ' + state.activeFilter.selector);
    });
```

### <a id="mixitup.Mixer#toggleOn">mixitup.Mixer.toggleOn</a>

**Version added: 3.0.0**

```js
.toggleOn(selector [, animate] [, callback])
```

Adds an additional selector to the currently active filter selector, concatenating
as per the logic defined in `controls.toggleLogic`.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `selector` | Any valid CSS selector (i.e. `'.category-a'`)
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether or not the filter operation should animate.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example: Toggling on a filter selector

```js

console.log(mixer.getState().activeFilter.selector); // '.category-a'

mixer.toggleOn('.category-b')
    .then(function(state) {
        console.log(state.activeFilter.selector); // '.category-a, .category-b'
    });
```

### <a id="mixitup.Mixer#toggleOff">mixitup.Mixer.toggleOff</a>

**Version added: 3.0.0**

```js
.toggleOff(selector [, animate] [, callback])
```

Removes a selector from the active filter selector.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `selector` | Any valid CSS selector (i.e. `'.category-a'`)
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether or not the filter operation should animate.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example: Toggling off a filter selector

```js

console.log(mixer.getState().activeFilter.selector); // '.category-a, .category-b'

mixer.toggleOff('.category-b')
    .then(function(state) {
        console.log(state.activeFilter.selector); // '.category-a'
    });
```

### <a id="mixitup.Mixer#sort">mixitup.Mixer.sort</a>

**Version added: 2.0.0**

```js
.sort(sortString [, animate] [, callback])
```

Sorts all targets in the container according to a provided sort string.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `sortString` | A valid sort string (e.g. `'default'`, `'published-date:asc'`, or `'random'`).
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether or not the filter operation should animate.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example 1: Sorting by the default DOM order

```js

// Reverse the default order of the targets

mixer.sort('default:desc')
    .then(function(state) {
        console.log('Targets sorted by ' + state.activeSort.attribute + ' in ' + state.activeSort.order + ' order');
    });
```
> Example 2: Sorting by a custom data-attribute

```js

// Sort the targets by the value of a `data-published-date` attribute

mixer.sort('published-date:asc')
    .then(function(state) {
        console.log('Targets sorted by ' + state.activeSort.attribute + ' in ' + state.activeSort.order + ' order');
    });
```
> Example 3: Sorting by multiple attributes

```js

// Sort the targets by the value of a `data-published-date` attribute, then by `data-title`

mixer.sort('published-date:desc data-title:asc')
    .then(function(state) {
        console.log('Targets sorted by ' + state.activeSort.attribute + ' then by ' + state.activeSort.next.attribute);
    });
```
> Example 4: Sorting by random

```js

mixer.sort('random')
    .then(function(state) {
        console.log('Targets shuffled');
    });
```

### <a id="mixitup.Mixer#changeLayout">mixitup.Mixer.changeLayout</a>

**Version added: 2.0.0**

```js
.changeLayout(containerClassName [, animate] [, callback])
```

Changes the layout of the container by adding, removing or updating a
layout-specific class name. If `animation.animateResizetargets` is
enabled, MixItUp will attempt to gracefully animate the width, height,
and position of targets between layout states.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `containerClassName` | A layout-specific class name to add to the container.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether or not the filter operation should animate.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example 1: Adding a new class name to the container

```js

mixer.changeLayout('container-list')
     .then(function(state) {
         console.log('the class name + ' state.activeContainerClassName + ' was added to the container');
     });
```
> Example 2: Removing a previously added class name from the container

```js

mixer.changeLayout('')
     .then(function(state) {
         console.log('Class name removed from container');
     });
```

### <a id="mixitup.Mixer#dataset">mixitup.Mixer.dataset</a>

**Version added: 3.0.0**

```js
.dataset(dataset [, animate] [, callback])
```

Updates the contents and order of the container to reflect the provided dataset,
if the dataset API is in use.

The dataset API is designed for use in API-driven JavaScript applications, and
should be used instead of DOM-based methods such as `.filter()`, `.sort()`,
`.insert()`, etc. When used, insertion, removal, sorting and pagination can be
achieved purely via changes to your data model, without the uglyness of having
to interact with or query the DOM directory.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`Array.<object>` | `dataset` | An array of objects, each one representing the underlying data model of a target to be rendered.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether or not the filter operation should animate.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example 1: Rendering a dataset

```js

var myDataset = [
    {id: 1, ...},
    {id: 2, ...},
    {id: 3, ...}
];

mixer.dataset(myDataset)
    .then(function(state) {
        console.log(state.totalShow + ' target were rendered');
    });
```
> Example 2: Sorting a dataset

```js

// Create a new dataset in reverse order

var newDataset = myDataset.slice().reverse();

mixer.dataset(newDataset)
    .then(function(state) {
        console.log('order of targets reversed');
    });
```
> Example 3: Removing an item from the dataset

```js

console.log(myDataset.length); // 3

// Create a new dataset with the last item removed.

var newDataset = myDataset.slice().pop();

mixer.dataset(newDataset)
    .then(function(state) {
        console.log(state.totalShow); // 2
    });
```

### <a id="mixitup.Mixer#multimix">mixitup.Mixer.multimix</a>

**Version added: 2.0.0**

```js
.multimix(multimixCommand [, animate] [, callback])
```

Performs simultaneous `filter`, `sort`, `insert`, `remove` and `changeLayout`
operations as requested.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `multimixCommand` | An object containing one or more things to do
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether or not the filter operation should animate.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example 1: Performing simultaneous filtering and sorting

```js

mixer.multimix({
    filter: '.category-b',
    sort: 'published-date:desc'
})
    .then(function(state) {
        console.log(state.activeFilter.selector); // '.category-b'
        console.log(state.activeSort.attribute); // 'published-date'
    });
```
> Example 2: Performing simultaneous sorting, insertion, and removal

```js

console.log(mixer.getState().totalShow); // 6

// NB: When inserting via `multimix()`, an object should be provided as the value
// for the `insert` portion of the command, allowing for a collection of elements
// and an insertion index to be specified.

mixer.multimix({
    sort: 'published-date:desc', // Sort the container, including any new elements
    insert: {
        collection: [newElementReferenceA, newElementReferenceB], // Add 2 new elements at index 5
        index: 5
    },
    remove: existingElementReference // Remove 1 existing element
})
    .then(function(state) {
        console.log(state.activeSort.attribute); // 'published-date'
        console.log(state.totalShow); // 7
    });
```

### <a id="mixitup.Mixer#insert">mixitup.Mixer.insert</a>

**Version added: 2.0.0**

```js
.insert(newElements [, index] [, animate], [, callback])
```

Inserts one or more new target elements into the container at a specified
index. To be indexed as targets, new elements must match the `selectors.target`
selector (`'.mix'` by default).

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`HTMLElement, Array.<HTMLElement>, string` | `newElements` | A reference to a single element to insert, an array-like collection of elements,
     or an HTML string representing a single element.
|Param   |`number` | `index` | The index at which to insert the new element(s). 0 by default.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example 1: Inserting a single element via reference

```js

console.log(mixer.getState().totalShow); // 0

// Create a new element

var newElement = document.createElement('div');
newElement.classList.add('mix');

mixer.insert(newElement)
    .then(function(state) {
        console.log(state.totalShow); // 1
    });
```
> Example 2: Inserting a single element via HTML string

```js

console.log(mixer.getState().totalShow); // 1

// Create a new element via reference

var newElementHtml = '&lt;div class="mix"&gt;&lt/div&gt;';

// Create and insert the new element at index 1

mixer.insert(newElementHtml, 1)
    .then(function(state) {
        console.log(state.totalShow); // 2
        console.log(state.show[1].outerHTML === newElementHtml); // true
    });
```
> Example 3: Inserting multiple elements via reference

```js

console.log(mixer.getState().totalShow); // 2

// Create an array of new elements to insert.

var newElement1 = document.createElement('div');
var newElement2 = document.createElement('div');

newElement1.classList.add('mix');
newElement2.classList.add('mix');

var newElementsCollection = [newElement1, newElement2];

// Insert the new elements starting at index 1

mixer.insert(newElementsCollection, 1)
    .then(function(state) {
        console.log(state.totalShow); // 4
        console.log(state.show[1] === newElement1); // true
        console.log(state.show[2] === newElement2); // true
    });
```
> Example 4: Inserting a jQuery collection object containing one or more elements

```js

console.log(mixer.getState().totalShow); // 4

var $newElement = $('&lt;div class="mix"&gt;&lt/div&gt;');

// Insert the new elements starting at index 3

mixer.insert(newElementsCollection, 3)
    .then(function(state) {
        console.log(state.totalShow); // 5
        console.log(state.show[3] === $newElement[0]); // true
    });
```

### <a id="mixitup.Mixer#insertBefore">mixitup.Mixer.insertBefore</a>

**Version added: 3.0.0**

```js
.insertBefore(newElements, referenceElement [, animate] [, callback])
```

Inserts one or more new elements before a provided reference element.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`HTMLElement, Array.<HTMLElement>, string` | `newElements` | A reference to a single element to insert, an array-like collection of elements,
     or an HTML string representing a single element.
|Param   |`HTMLElement` | `referenceElement` | A reference to an existing target element to insert new elements before.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example: Inserting a new element before a reference element

```js

// An existing reference element is chosen at index 2

var referenceElement = mixer.getState().show[2];

// Create a new element

var newElement = document.createElement('div');
newElement.classList.add('mix');

mixer.insertBefore(newElement, referenceElement)
    .then(function(state) {
        // The new element is inserted into the container at index 2, before the reference element

        console.log(state.show[2] === newElement); // true

        // The reference element is now at index 3

        console.log(state.show[3] === referenceElement); // true
    });
```

### <a id="mixitup.Mixer#insertAfter">mixitup.Mixer.insertAfter</a>

**Version added: 3.0.0**

```js
.insertAfter(newElements, referenceElement [, animate] [, callback])
```

Inserts one or more new elements after a provided reference element.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`HTMLElement, Array.<HTMLElement>, string` | `newElements` | A reference to a single element to insert, an array-like collection of elements,
     or an HTML string representing a single element.
|Param   |`HTMLElement` | `referenceElement` | A reference to an existing target element to insert new elements after.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example: Inserting a new element after a reference element

```js

// An existing reference element is chosen at index 2

var referenceElement = mixer.getState().show[2];

// Create a new element

var newElement = document.createElement('div');
newElement.classList.add('mix');

mixer.insertAfter(newElement, referenceElement)
    .then(function(state) {
        // The new element is inserted into the container at index 3, after the reference element

        console.log(state.show[3] === newElement); // true
    });
```

### <a id="mixitup.Mixer#prepend">mixitup.Mixer.prepend</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#append">mixitup.Mixer.append</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#remove">mixitup.Mixer.remove</a>

**Version added: 3.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#getConfig">mixitup.Mixer.getConfig</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `[stringKey]` | 
|Returns |`*` | 



### <a id="mixitup.Mixer#configure">mixitup.Mixer.configure</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `config` | 
|Returns |`void` | 



### <a id="mixitup.Mixer#getState">mixitup.Mixer.getState</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`mixitup.State` | 



### <a id="mixitup.Mixer#forceRefresh">mixitup.Mixer.forceRefresh</a>

**Version added: 2.1.2**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`void` | 



### <a id="mixitup.Mixer#destroy">mixitup.Mixer.destroy</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`boolean` | `hideAll` | 
|Returns |`void` | 




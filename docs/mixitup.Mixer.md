# mixitup.Mixer

## Overview

The `mixitup.Mixer` class is used to hold discreet, user-configured
instances of MixItUp on a provided container element.

Mixer instances are returned whenever the `mixitup()` factory function is called,
which expose a range of methods enabling API-based filtering, sorting,
insertion, removal and more.

### Contents

- [show()](#show)
- [hide()](#hide)
- [isMixing()](#isMixing)
- [filter()](#filter)
- [toggleOn()](#toggleOn)
- [toggleOff()](#toggleOff)
- [sort()](#sort)
- [changeLayout()](#changeLayout)
- [dataset()](#dataset)
- [multimix()](#multimix)
- [insert()](#insert)
- [insertBefore()](#insertBefore)
- [insertAfter()](#insertAfter)
- [prepend()](#prepend)
- [append()](#append)
- [remove()](#remove)
- [getConfig()](#getConfig)
- [configure()](#configure)
- [getState()](#getState)
- [forceRefresh()](#forceRefresh)
- [forceRender()](#forceRender)
- [destroy()](#destroy)


<h3 id="show">show()</h3>

*Version added: 3.0.0*

`.show()`

A shorthand method for `.filter('all')`. Shows all targets in the container.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


###### Example: Showing all targets

```js

mixer.show()
    .then(function(state) {
        console.log(state.totalShow === state.totalTargets); // true
    });
```

<h3 id="hide">hide()</h3>

*Version added: 3.0.0*

`.hide()`

A shorthand method for `.filter('none')`. Hides all targets in the container.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


###### Example: Hiding all targets

```js

mixer.hide()
    .then(function(state) {
        console.log(state.totalShow === 0); // true
        console.log(state.totalHide === state.totalTargets); // true
    });
```

<h3 id="isMixing">isMixing()</h3>

*Version added: 2.0.0*

`.isMixing()`

Returns a boolean indicating whether or not a MixItUp operation is
currently in progress.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`boolean` | 


###### Example: Checking the status of a mixer

```js

mixer.sort('random', function() {
    console.log(mixer.isMixing()) // false
});

console.log(mixer.isMixing()) // true
```

<h3 id="filter">filter()</h3>

*Version added: 2.0.0*

`.filter(selector [, animate] [, callback])`

Filters all targets in the container by a provided selector string, or the values `'all'`
or `'none'`. Only targets matching the selector will be shown.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string, HTMLElement, Array.<HTMLElement>` | `selector` | Any valid CSS selector (i.e. `'.category-a'`), or the values `'all'` or `'none'`. The filter method also accepts a reference to single target element or a collection of target elements to show.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example 1: Filtering targets by a class selector

```js

mixer.filter('.category-a')
    .then(function(state) {
        console.log(state.totalShow === containerEl.querySelectorAll('.category-a').length); // true
    });
```
###### Example 2: Filtering targets by an attribute selector

```js

mixer.filter('[data-category~="a"]')
    .then(function(state) {
        console.log(state.totalShow === containerEl.querySelectorAll('[data-category~="a"]').length); // true
    });
```
###### Example 3: Filtering targets by a compound selector

```js

// Show only those targets with the classes 'category-a' AND 'category-b'

mixer.filter('.category-a.category-c')
    .then(function(state) {
        console.log(state.totalShow === containerEl.querySelectorAll('.category-a.category-c').length); // true
    });
```
###### Example 4: Filtering via an element collection

```js

var collection = Array.from(container.querySelectorAll('.mix'));

console.log(collection.length); // 34

// Filter the collection manually using Array.prototype.filter

var filtered = collection.filter(function(target) {
   return parseInt(target.getAttribute('data-price')) > 10;
});

console.log(filtered.length); // 22

// Pass the filtered collection to MixItUp

mixer.filter(filtered)
   .then(function(state) {
       console.log(state.activeFilter.collection.length === 22); // true
   });
```

<h3 id="toggleOn">toggleOn()</h3>

*Version added: 3.0.0*

`.toggleOn(selector [, animate] [, callback])`

Adds an additional selector to the currently active filter selector, concatenating
as per the logic defined in `controls.toggleLogic`.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `selector` | Any valid CSS selector (i.e. `'.category-a'`)
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example: Toggling on a filter selector

```js

console.log(mixer.getState().activeFilter.selector); // '.category-a'

mixer.toggleOn('.category-b')
    .then(function(state) {
        console.log(state.activeFilter.selector); // '.category-a, .category-b'
    });
```

<h3 id="toggleOff">toggleOff()</h3>

*Version added: 3.0.0*

`.toggleOff(selector [, animate] [, callback])`

Removes a selector from the active filter selector.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `selector` | Any valid CSS selector (i.e. `'.category-a'`)
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example: Toggling off a filter selector

```js

console.log(mixer.getState().activeFilter.selector); // '.category-a, .category-b'

mixer.toggleOff('.category-b')
    .then(function(state) {
        console.log(state.activeFilter.selector); // '.category-a'
    });
```

<h3 id="sort">sort()</h3>

*Version added: 2.0.0*

`.sort(sortString [, animate] [, callback])`

Sorts all targets in the container according to a provided sort string.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string, Array.<HTMLElement>` | `sortString` | A valid sort string (e.g. `'default'`, `'published-date:asc'`, or `'random'`). The sort method also accepts an array of all target elements in a user-defined order.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example 1: Sorting by the default DOM order

```js

// Reverse the default order of the targets

mixer.sort('default:desc')
    .then(function(state) {
        console.log(state.activeSort.attribute === 'default'); // true
        console.log(state.activeSort.order === 'desc'); // true
    });
```
###### Example 2: Sorting by a custom data-attribute

```js

// Sort the targets by the value of a `data-published-date` attribute

mixer.sort('published-date:asc')
    .then(function(state) {
        console.log(state.activeSort.attribute === 'published-date'); // true
        console.log(state.activeSort.order === 'asc'); // true
    });
```
###### Example 3: Sorting by multiple attributes

```js

// Sort the targets by the value of a `data-published-date` attribute, then by `data-title`

mixer.sort('published-date:desc data-title:asc')
    .then(function(state) {
        console.log(state.activeSort.attribute === 'published-date'); // true
        console.log(state.activeSort.order === 'desc'); // true

        console.log(state.activeSort.next.attribute === 'title'); // true
        console.log(state.activeSort.next.order === 'asc'); // true
    });
```
###### Example 4: Sorting by random

```js

mixer.sort('random')
    .then(function(state) {
        console.log(state.activeSort.order === 'random') // true
    });
```
###### Example 5: Sorting via an element collection

```js

var collection = Array.from(container.querySelectorAll('.mix'));

// Swap the position of two elements in the collection:

var temp = collection[1];

collection[1] = collection[0];
collection[0] = temp;

// Pass the sorted collection to MixItUp

mixer.sort(collection)
    .then(function(state) {
        console.log(state.targets[0] === collection[0]); // true
    });
```

<h3 id="changeLayout">changeLayout()</h3>

*Version added: 2.0.0*

`.changeLayout(containerClassName [, animate] [, callback])`

Changes the layout of the container by adding, removing or updating a
layout-specific class name. If `animation.animateResizetargets` is
enabled, MixItUp will attempt to gracefully animate the width, height,
and position of targets between layout states.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `containerClassName` | A layout-specific class name to add to the container.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example 1: Adding a new class name to the container

```js

mixer.changeLayout('container-list')
     .then(function(state) {
         console.log(state.activeContainerClass === 'container-list'); // true
     });
```
###### Example 2: Removing a previously added class name from the container

```js

mixer.changeLayout('')
     .then(function(state) {
         console.log(state.activeContainerClass === ''); // true
     });
```

<h3 id="dataset">dataset()</h3>

*Version added: 3.0.0*

`.dataset(dataset [, animate] [, callback])`

Updates the contents and order of the container to reflect the provided dataset,
if the dataset API is in use.

The dataset API is designed for use in API-driven JavaScript applications, and
can be used instead of DOM-based methods such as `.filter()`, `.sort()`,
`.insert()`, etc. When used, insertion, removal, sorting and pagination can be
achieved purely via changes to your data model, without the uglyness of having
to interact with or query the DOM directly.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`Array.<object>` | `dataset` | An array of objects, each one representing the underlying data model of a target to be rendered.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example 1: Rendering a dataset

```js

var myDataset = [
    {id: 1, ...},
    {id: 2, ...},
    {id: 3, ...}
];

mixer.dataset(myDataset)
    .then(function(state) {
        console.log(state.totalShow === 3); // true
    });
```
###### Example 2: Sorting a dataset

```js

// Create a new dataset in reverse order

var newDataset = myDataset.slice().reverse();

mixer.dataset(newDataset)
    .then(function(state) {
        console.log(state.activeDataset[0] === myDataset[2]); // true
    });
```
###### Example 3: Removing an item from the dataset

```js

console.log(myDataset.length); // 3

// Create a new dataset with the last item removed.

var newDataset = myDataset.slice().pop();

mixer.dataset(newDataset)
    .then(function(state) {
        console.log(state.totalShow === 2); // true
    });
```

<h3 id="multimix">multimix()</h3>

*Version added: 2.0.0*

`.multimix(multimixCommand [, animate] [, callback])`

Performs simultaneous `filter`, `sort`, `insert`, `remove` and `changeLayout`
operations as requested.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `multimixCommand` | An object containing one or more things to do
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example 1: Performing simultaneous filtering and sorting

```js

mixer.multimix({
    filter: '.category-b',
    sort: 'published-date:desc'
})
    .then(function(state) {
        console.log(state.activeFilter.selector === '.category-b'); // true
        console.log(state.activeSort.attribute === 'published-date'); // true
    });
```
###### Example 2: Performing simultaneous sorting, insertion, and removal

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
        console.log(state.activeSort.attribute === 'published-date'); // true
        console.log(state.totalShow === 7); // true
    });
```

<h3 id="insert">insert()</h3>

*Version added: 2.0.0*

`.insert(newElements [, index] [, animate], [, callback])`

Inserts one or more new target elements into the container at a specified
index.

To be indexed as targets, new elements must match the `selectors.target`
selector (`'.mix'` by default).

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`HTMLElement, Array.<HTMLElement>, string` | `newElements` | A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
|Param   |`number` | `index` | The index at which to insert the new element(s). `0` by default.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example 1: Inserting a single element via reference

```js

console.log(mixer.getState().totalShow); // 0

// Create a new element

var newElement = document.createElement('div');
newElement.classList.add('mix');

mixer.insert(newElement)
    .then(function(state) {
        console.log(state.totalShow === 1); // true
    });
```
###### Example 2: Inserting a single element via HTML string

```js

console.log(mixer.getState().totalShow); // 1

// Create a new element via reference

var newElementHtml = '<div class="mix"></div>';

// Create and insert the new element at index 1

mixer.insert(newElementHtml, 1)
    .then(function(state) {
        console.log(state.totalShow === 2); // true
        console.log(state.show[1].outerHTML === newElementHtml); // true
    });
```
###### Example 3: Inserting multiple elements via reference

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
        console.log(state.totalShow === 4); // true
        console.log(state.show[1] === newElement1); // true
        console.log(state.show[2] === newElement2); // true
    });
```
###### Example 4: Inserting a jQuery collection object containing one or more elements

```js

console.log(mixer.getState().totalShow); // 4

var $newElement = $('<div class="mix"></div>');

// Insert the new elements starting at index 3

mixer.insert($newElement, 3)
    .then(function(state) {
        console.log(state.totalShow === 5); // true
        console.log(state.show[3] === $newElement[0]); // true
    });
```

<h3 id="insertBefore">insertBefore()</h3>

*Version added: 3.0.0*

`.insertBefore(newElements, referenceElement [, animate] [, callback])`

Inserts one or more new elements before a provided reference element.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`HTMLElement, Array.<HTMLElement>, string` | `newElements` | A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
|Param   |`HTMLElement` | `referenceElement` | A reference to an existing element in the container to insert new elements before.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example: Inserting a new element before a reference element

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

<h3 id="insertAfter">insertAfter()</h3>

*Version added: 3.0.0*

`.insertAfter(newElements, referenceElement [, animate] [, callback])`

Inserts one or more new elements after a provided reference element.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`HTMLElement, Array.<HTMLElement>, string` | `newElements` | A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
|Param   |`HTMLElement` | `referenceElement` | A reference to an existing element in the container to insert new elements after.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example: Inserting a new element after a reference element

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

<h3 id="prepend">prepend()</h3>

*Version added: 3.0.0*

`.prepend(newElements [,animate] [,callback])`

Inserts one or more new elements into the container before all existing targets.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`HTMLElement, Array.<HTMLElement>, string` | `newElements` | A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example: Prepending a new element

```js

// Create a new element

var newElement = document.createElement('div');
newElement.classList.add('mix');

// Insert the element into the container

mixer.prepend(newElement)
    .then(function(state) {
        console.log(state.show[0] === newElement); // true
    });
```

<h3 id="append">append()</h3>

*Version added: 3.0.0*

`.append(newElements [,animate] [,callback])`

Inserts one or more new elements into the container after all existing targets.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`HTMLElement, Array.<HTMLElement>, string` | `newElements` | A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example: Appending a new element

```js

// Create a new element

var newElement = document.createElement('div');
newElement.classList.add('mix');

// Insert the element into the container

mixer.append(newElement)
    .then(function(state) {
        console.log(state.show[state.show.length - 1] === newElement); // true
    });
```

<h3 id="remove">remove()</h3>

*Version added: 3.0.0*

`.remove(elements [, animate] [, callback])`

Removes one or more existing target elements from the container.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`HTMLElement, Array.<HTMLElement>, string, number` | `elements` | A reference to a single element to remove, an array-like collection of elements, a selector string, or the index of an element to remove.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example 1: Removing an element by reference

```js

var elementToRemove = containerEl.firstElementChild;

mixer.remove(elementToRemove)
     .then(function(state) {
         console.log(state.targets.indexOf(elementToRemove) === -1); // true
     });
```
###### Example 2: Removing a collection of elements by reference

```js

var elementsToRemove = containerEl.querySelectorAll('.category-a');

console.log(elementsToRemove.length) // 3

mixer.remove(elementsToRemove)
     .then(function() {
         console.log(containerEl.querySelectorAll('.category-a').length); // 0
     });
```
###### Example 3: Removing one or more elements by selector

```js

mixer.remove('.category-a')
     .then(function() {
         console.log(containerEl.querySelectorAll('.category-a').length); // 0
     });
```
###### Example 4: Removing an element by index

```js

console.log(mixer.getState.totalShow); // 4

// Remove the element at index 3

mixer.remove(3)
     .then(function(state) {
         console.log(state.totalShow); // 3
         console.log(state.show[3]); // undefined
     });
```

<h3 id="getConfig">getConfig()</h3>

*Version added: 2.0.0*

`.getConfig([stringKey])`

Retrieves the the value of any property or sub-object within the current
mixitup configuration, or the whole configuration object.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `[stringKey]` | A "dot-notation" string key
|Returns |`*` | 


###### Example 1: retrieve the entire configuration object

```js

var config = mixer.getConfig(); // Config { ... }
```
###### Example 2: retrieve a named sub-object of configuration object

```js

var animation = mixer.getConfig('animation'); // ConfigAnimation { ... }
```
###### Example 3: retrieve a value of configuration object via a dot-notation string key

```js

var effects = mixer.getConfig('animation.effects'); // 'fade scale'
```

<h3 id="configure">configure()</h3>

*Version added: 3.0.0*

`.configure(config)`

Updates the configuration of the mixer, after it has been instantiated.

See the Configuration Object documentation for a full list of avilable
configuration options.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `config` | An object containing one of more configuration options.
|Returns |`void` | 


###### Example 1: Updating animation options

```js

mixer.configure({
    animation: {
        effects: 'fade translateX(-100%)',
        duration: 300
    }
});
```
###### Example 2: Removing a callback after it has been set

```js

var mixer;

function handleMixEndOnce() {
    // Do something ..

    // Then nullify the callback

    mixer.configure({
        callbacks: {
            onMixEnd: null
        }
    });
};

// Instantiate a mixer with a callback defined

mixer = mixitup(containerEl, {
    callbacks: {
        onMixEnd: handleMixEndOnce
    }
});
```

<h3 id="getState">getState()</h3>

*Version added: 2.0.0*

`.getState();`

Returns an object containing information about the current state of the
mixer. See the State Object documentation for more information.

NB: State objects are immutable and should therefore be regenerated
after any operation.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`mixitup.State` | An object reflecting the current state of the mixer.


###### Example: Retrieving a state object

```js

var state = mixer.getState();

console.log(state.totalShow + 'targets are currently shown');
```

<h3 id="forceRefresh">forceRefresh()</h3>

*Version added: 2.1.2*

`.forceRefresh()`

Forces the re-indexing all targets within the container.

This should only be used if some other piece of code in your application
has manipulated the contents of your container, which should be avoided.

If you need to add or remove target elements from the container, use
the built-in `.insert()` or `.remove()` methods, and MixItUp will keep
itself up to date.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`void` | 


###### Example: Force refreshing the mixer after external DOM manipulation

```js

console.log(mixer.getState().totalShow); // 3

// An element is removed from the container via some external DOM manipulation code:

containerEl.removeChild(containerEl.firstElementChild);

// The mixer does not know that the number of targets has changed:

console.log(mixer.getState().totalShow); // 3

mixer.forceRefresh();

// After forceRefresh, the mixer is in sync again:

console.log(mixer.getState().totalShow); // 2
```

<h3 id="forceRender">forceRender()</h3>

*Version added: 3.2.1*

`.forceRender()`

Forces the re-rendering of all targets when using the Dataset API.

By default, targets are only re-rendered when `data.dirtyCheck` is
enabled, and an item's data has changed when `dataset()` is called.

The `forceRender()` method allows for the re-rendering of all targets
in response to some arbitrary event, such as the changing of the target
render function.

Targets are rendered against their existing data.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`void` | 


###### Example: Force render targets after changing the target render function

```js

console.log(container.innerHTML); // ... <span class="mix">Foo</span> ...

mixer.configure({
    render: {
        target: (item) => `<a href="/${item.slug}/" class="mix">${item.title}</a>`
    }
});

mixer.forceRender();

console.log(container.innerHTML); // ... <a href="/foo/" class="mix">Foo</a> ...
```

<h3 id="destroy">destroy()</h3>

*Version added: 2.0.0*

`.destroy([cleanUp])`

Removes mixitup functionality from the container, unbinds all control
event handlers, and deletes the mixer instance from MixItUp's internal
cache.

This should be performed whenever a mixer's container is removed from
the DOM, such as during a page change in a single page application,
or React's `componentWillUnmount()`.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`boolean` | `[cleanUp]` | An optional boolean dictating whether or not to clean up any inline `display: none;` styling applied to hidden targets.
|Returns |`void` | 


###### Example: Destroying the mixer before removing its container element

```js

mixer.destroy();

containerEl.parentElement.removeChild(containerEl);
```


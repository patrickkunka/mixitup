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
        console.log(state.totalShow === state.totalTargets); // true
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
        console.log(state.totalShow === 0); // true
        console.log(state.totalHide === state.totalTargets); // true
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

mixer.sort('random', function() {
    console.log(mixer.isMixing()) // false
});

console.log(mixer.isMixing()) // true
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
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example 1: Filtering targets by a class selector

```js

mixer.filter('.category-a')
    .then(function(state) {
        console.log(state.totalShow === containerEl.querySelectorAll('.category-a').length); // true
    });
```
> Example 2: Filtering targets by an attribute selector

```js

mixer.filter('[data-category~="a"]')
    .then(function(state) {
        console.log(state.totalShow === containerEl.querySelectorAll('[data-category~="a"]').length); // true
    });
```
> Example 3: Filtering targets by a compound selector

```js

// Show only those targets with the classes 'category-a' AND 'category-b'

mixer.filter('.category-a.category-c')
    .then(function(state) {
        console.log(state.totalShow === containerEl.querySelectorAll('.category-a.category-c').length); // true
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
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
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
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
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
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example 1: Sorting by the default DOM order

```js

// Reverse the default order of the targets

mixer.sort('default:desc')
    .then(function(state) {
        console.log(state.activeSort.attribute === 'default'); // true
        console.log(state.activeSort.order === 'desc'); // true
    });
```
> Example 2: Sorting by a custom data-attribute

```js

// Sort the targets by the value of a `data-published-date` attribute

mixer.sort('published-date:asc')
    .then(function(state) {
        console.log(state.activeSort.attribute === 'published-date'); // true
        console.log(state.activeSort.order === 'asc'); // true
    });
```
> Example 3: Sorting by multiple attributes

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
> Example 4: Sorting by random

```js

mixer.sort('random')
    .then(function(state) {
        console.log(state.activeSort.order === 'random') // true
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
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example 1: Adding a new class name to the container

```js

mixer.changeLayout('container-list')
     .then(function(state) {
         console.log(state.activeContainerClass === 'container-list'); // true
     });
```
> Example 2: Removing a previously added class name from the container

```js

mixer.changeLayout('')
     .then(function(state) {
         console.log(state.activeContainerClass === ''); // true
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


> Example 1: Rendering a dataset

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
> Example 2: Sorting a dataset

```js

// Create a new dataset in reverse order

var newDataset = myDataset.slice().reverse();

mixer.dataset(newDataset)
    .then(function(state) {
        console.log(state.activeDataset[0] === myDataset[2]); // true
    });
```
> Example 3: Removing an item from the dataset

```js

console.log(myDataset.length); // 3

// Create a new dataset with the last item removed.

var newDataset = myDataset.slice().pop();

mixer.dataset(newDataset)
    .then(function(state) {
        console.log(state.totalShow === 2); // true
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
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example 1: Performing simultaneous filtering and sorting

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
        console.log(state.activeSort.attribute === 'published-date'); // true
        console.log(state.totalShow === 7); // true
    });
```

### <a id="mixitup.Mixer#insert">mixitup.Mixer.insert</a>

**Version added: 2.0.0**

```js
.insert(newElements [, index] [, animate], [, callback])
```

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


> Example 1: Inserting a single element via reference

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
> Example 2: Inserting a single element via HTML string

```js

console.log(mixer.getState().totalShow); // 1

// Create a new element via reference

var newElementHtml = '&lt;div class="mix"&gt;&lt/div&gt;';

// Create and insert the new element at index 1

mixer.insert(newElementHtml, 1)
    .then(function(state) {
        console.log(state.totalShow === 2); // true
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
        console.log(state.totalShow === 4); // true
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
        console.log(state.totalShow === 5); // true
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
|Param   |`HTMLElement` | `referenceElement` | A reference to an existing element in the container to insert new elements before.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
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
|Param   |`HTMLElement, Array.<HTMLElement>, string` | `newElements` | A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
|Param   |`HTMLElement` | `referenceElement` | A reference to an existing element in the container to insert new elements after.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
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

**Version added: 3.0.0**

```js
.prepend(newElements [,animate] [,callback])
```

Inserts one or more new elements into the container before all existing targets.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`HTMLElement, Array.<HTMLElement>, string` | `newElements` | A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example: Prepending a new element

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

### <a id="mixitup.Mixer#append">mixitup.Mixer.append</a>

**Version added: 3.0.0**

```js
.append(newElements [,animate] [,callback])
```

Inserts one or more new elements into the container after all existing targets.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`HTMLElement, Array.<HTMLElement>, string` | `newElements` | A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example: Appending a new element

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

### <a id="mixitup.Mixer#remove">mixitup.Mixer.remove</a>

**Version added: 3.0.0**

```js
.remove(elements [, animate] [, callback])
```

Removes one or more existing target elements from the container.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`HTMLElement, Array.<HTMLElement>, string, number` | `elements` | A reference to a single element to remove, an array-like collection of elements, a selector string, or the index of an element to remove.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


> Example 1: Removing an element by reference

```js

var elementToRemove = containerEl.firstElementChild;

mixer.remove(elementToRemove)
     .then(function(state) {
         console.log(state.targets.indexOf(elementToRemove) === -1); // true
     });
```
> Example 2: Removing a collection of elements by reference

```js

var elementsToRemove = containerEl.querySelectorAll('.category-a');

console.log(elementsToRemove.length) // 3

mixer.remove(elementsToRemove)
     .then(function() {
         console.log(containerEl.querySelectorAll('.category-a').length); // 0
     });
```
> Example 3: Removing one or more elements by selector

```js

mixer.remove('.category-a')
     .then(function() {
         console.log(containerEl.querySelectorAll('.category-a').length); // 0
     });
```
> Example 4: Removing an element by index

```js

console.log(mixer.getState.totalShow); // 4

// Remove the element at index 3

mixer.remove(3)
     .then(function(state) {
         console.log(state.totalShow); // 3
         console.log(state.show[3]); // undefined
     });
```

### <a id="mixitup.Mixer#getConfig">mixitup.Mixer.getConfig</a>

**Version added: 2.0.0**

```js
.getConfig([stringKey])
```

Retrieves the the value of any property or sub-object within the current
mixitup configuration, or the whole configuration object.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `[stringKey]` | A "dot-notation" string key
|Returns |`*` | 


> Example 1: retrieve the entire configuration object

```js

var config = mixer.getConfig(); // Config { ... }
```
> Example 2: retrieve a named sub-object of configuration object

```js

var animation = mixer.getConfig('animation'); // ConfigAnimation { ... }
```
> Example 3: retrieve a value of configuration object via a dot-notation string key

```js

var effects = mixer.getConfig('animation.effects'); // 'fade scale'
```

### <a id="mixitup.Mixer#configure">mixitup.Mixer.configure</a>

**Version added: 3.0.0**

```js
.configure(config)
```

Updates the configuration of the mixer, after it has been instantiated.

See the Configuration Object documentation for a full list of avilable
configuration options.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `config` | An object containing one of more configuration options.
|Returns |`void` | 


> Example 1: Updating animation options

```js

mixer.configure({
    animation: {
        effects: 'fade translateX(-100%)',
        duration: 300
    }
});
```
> Example 2: Removing a callback after it has been set

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

### <a id="mixitup.Mixer#getState">mixitup.Mixer.getState</a>

**Version added: 2.0.0**

```js
.getState();
```

Returns an object containing information about the current state of the
mixer. See the State Object documentation for more information.

NB: State objects are immutable and should therefore be regenerated
after any operation.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`mixitup.State` | An object reflecting the current state of the mixer.


> Example: Retrieving a state object

```js

var state = mixer.getState();

console.log(state.totalShow + 'targets are currently shown');
```

### <a id="mixitup.Mixer#forceRefresh">mixitup.Mixer.forceRefresh</a>

**Version added: 2.1.2**

```js
.forceRefresh()
```

Forces the re-indexing all targets within the container.

This should only be used if some other piece of code in your application
has manipulated the contents of your container, which should be avoided.

If you need to add or remove target elements from the container, use
the built-in `.insert()` or `.remove()` methods, and MixItUp will keep
itself up to date.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`void` | 


> Example: Force refreshing the mixer after external DOM manipulation

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

### <a id="mixitup.Mixer#destroy">mixitup.Mixer.destroy</a>

**Version added: 2.0.0**

```js
.destroy([cleanUp])
```

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


> Example: Destroying the mixer before removing its container element

```js

mixer.destroy();

containerEl.parentElement.removeChild(containerEl);
```


API Methods
=========

1. [Overview](#overview)
1. [Methods Details](#method-details)

<h2 name="overview">Overview</h2>

MixItUp’s API provides an extensive list of methods for advanced interactivity, feedback and real time configuration.

The MixItUp API uses a jQueryUI-inspired syntax.

<h2 name="method-details">Method Details</h2>

*Optional parameters are shown in square-brackets.*

1. [instantiate](#instantiate)
1. [filter](#filter)
1. [sort](#sort)
1. [changeLayout](#changelayout)
1. [multiMix](#multimix)
1. [prepend](#prepend)
1. [append](#append)
1. [insert](#insert)
1. [isMixing](#ismixing)
1. [isLoaded](#isloaded)
1. [setOptions](#setoptions)
1. [getOption](#getoption)
1. [destroy](#destroy)

<h3 name="method-instantiate">instantiate</h3>

```
.mixItUp([configurationObject])
```

Instantiate MixItUp via a jQuery object.

Parameters | configurationObject
--- | --- 
Type | Object
Default | `null`
Description | See Configuration Object

This is the first and most important method of any MixItUp project and allows us to turn a DOM element into a MixItUp container.

With no parameters, MixItUp will be instantiated with the default configuration options. For advanced configuration, any number of options may be passed as an object literal. See Configuration Object.

```
$('#Container').mixItUp();
```
> Instantiate MixItUp on the element with ID "Container", with its default configuration options

<br/>

```
$('#Container').mixItUp({
	animation: {
		effects: 'fade translateZ(500px)',
		duration: 300
	},
	selectors: {
		target: 'li'
	}
});
```
> Instantiate MixItUp with customized configuration options

<h3 name="method-filter">filter</h3>

```
.mixItUp('filter', filterCommand [,animate] [,callback])
```

Filter the container to show or hide target elements.

Parameters | filterCommand | animate | callback
--- | --- | --- | ---
Type | String/Object/Function | Boolean | Function
Default | - | `true` | `null`
Description | A selector string, function or object against which to match desired target elements. | A boolean indicating whether to animate the filtering operation (asynchronously), or perform it instantly (synchronously). | An optional callback function to be called after the filter operation has completed.

The filter command most commonly takes the form of a CSS selector string targeting the desired elements to show.

It may also take the form of a jQuery object, DOM element, or function. See jQuery’s .filter() documentation for more information.

```
$('#Container').mixItUp('filter', '.category-1');
```
> Show target elements with the class "category-1"

<br/>

```
$('#Container').mixItUp('filter', '.category-2', false);
```
> Show target elements with the class "category-2", with no animation.

<br/>

```
$('#Container').mixItUp('filter', $myCollection, function(state){
	// callback function
});
```
> Show target elements matching a jQuery object, and call a callback function on completion.

<br/>

This method is a short-hand for `.mixItUp('multiMix', {filter: filterCommand})`

<h3 name="method-sort">sort</h3>

Sort the target elements by one or more arbitrary attributes or their order in the DOM.

```
.mixItUp('sort', sortCommand [,animate] [,callback])
```

Parameters | sortCommand | animate | callback
--- | --- | --- | ---
Type | String | Boolean | Function
Default | - | `true` | `null`
Description | A sort string made up of two colon-separated parts as follows: `'attribute-name:order'` | A boolean indicating whether to animate the filtering operation (asynchronously), or perform it instantly (synchronously). | An optional callback function to be called after the filter operation has completed.

The sort command is a space-separated string of colon-separated pairs. The first part of each pair is the name of the data attribute to sort by, and the second part of the pair is the order to sort by (asc or desc).

Commonly only one pair is passed to sort by a single attribute. However, any number of pairs may be passed to sort by multiple attributes in order of priority.

The second part of each pair is optional as ascending order is assumed.

The values `random` and `default` (the elements’ original order in the DOM) are also accepted.

```
$('#Container').mixItUp('sort', 'name:asc');
```
> Sort target elements by the value of their "data-name" attributes, in ascending order.

<br/>

```
$('#Container').mixItUp('sort', 'random', false);
```
> Sort target elements by a random order, with no animation.

<br/>

```
$('#Container').mixItUp('sort', 'age:desc name:asc', function(state){
	// callback function
});
```
> Sort target elements first by their "data-age" attribute, and then by "data-name". Call a callback function when complete.

<br/>

This method is a short-hand for `.mixItUp('multiMix', {sort: sortCommand})`

<h3 name="method-changeLayout">changeLayout</h3>

```
.mixItUp('changeLayout', layoutCommand [,animate] [,callback])
```

Change the layout of the container by changing the value of the CSS “display” property for target elements (e.g. block or inline-block), and/or applying a class to the container.

Parameters | layoutCommand | animate | callback
--- | --- | --- | ---
Type | String/Object | Boolean | Function
Default | - | `true` | `null`
Description | A string containing the desired display value for target elements, and (as an object) also an optional class to be applied to the container. | A boolean indicating whether to animate the filtering operation (asynchronously), or perform it instantly (synchronously). | An optional callback function to be called after the filter operation has completed.

When passed as a string, the layout command sets the value of the CSS “display” property  for target elements:

```
$('#Container').mixItUp('layoutChange', 'block');
```
> Change the layout by changing target elements to "display: block"

<br/>

```
$('#Container').mixItUp('layoutChange', {
	display: 'block',
	containerClass: 'list'
}, function(state){
	// callback function
});
```
> Change the target display value, add the class "list" to the container, and call a callback function when complete.

<br/>

This method is a short-hand for `.mixItUp('multiMix', {layoutChange: layoutCommand})`

<h3 name="method-multiMix">multiMix</h3>

```
.mixItUp('multiMix', multiMixObject [,animate] [,callback])
```

Perform simultaneous filter, sort, and layoutChange operations.

Parameters | multiMixObject | animate | callback
--- | --- | --- | ---
Type | Object | Boolean | Function
Default | - | `true` | `null`
Description | The multiMixObject contains individual properties for the filter, sort and layoutChange methods and their respective commands. Any or all of these properties may be passed with the same syntax as the individual method. | A boolean indicating whether to animate the filtering operation (asynchronously), or perform it instantly (synchronously). | An optional callback function to be called after the filter operation has completed.

```
$('#Container').mixItUp('multiMix', {
	filter: '.category-1, .category-2',
	sort: 'name:asc',
	changeLayout: {
		containerClass: 'flex'
	}
});
```
> Perform filter, sort and layoutChange operations in a single animation.

<h3 name="method-prepend">prepend</h3>

```
.mixItUp('prepend', elements [,multiMixObject] [,callback])
```

Insert an element or collection of elements into the container, before all existing target elements.

Parameters | elements | multiMixObject | callback
--- | --- | --- | ---
Type | Object | Object | Function
Default | - | `null` | `null`
Description | A jQuery object collection of one or more elements to insert, or a single DOM element. | A multiMix object containing instructions about what to do after the insertion of elements. | An optional callback function to be called after elements have been inserted, or if applicable, after the multiMix operation has completed.

If no multiMix object is passed, elements are inserted and MixItUp is refreshed. However, elements remain hidden until a subsequent filter operation is performed.

This method is recommended over prepending elements into the container manually (via native DOM methods) as it prompts a “refresh”, updating MixItUp’s sorting and filtering arrays. It also ensures that white space is maintained between inserted elements, which is vital for inline-block grids.

```
$('#Container').mixItUp('prepend', $myElement, {filter: '.category-1'})
```
> Prepend an element into the container via a jQuery object, and show all elements with the class "category-1"

<br/>

This method is a short-hand for `.mixItUp('insert', 0, elements)`

<h3 name="method-append">append</h3>

```
.mixItUp('append', elements, [,multiMixObject] [,callback])
```

Insert an element or collection of elements into the container, after all existing target elements.

Parameters | elements | multiMixObject | callback
--- | --- | --- | ---
Type | Object | Object | Function
Default | - | `null` | `null`
Description | A jQuery object collection of one or more elements to insert, or a single DOM element. | A multiMix object containing instructions about what to do after the insertion of elements. | An optional callback function to be called after elements have been inserted, or if applicable, after the multiMix operation has completed.

If no multiMix object is passed, elements are inserted and MixItUp is refreshed. However, elements remain hidden until a subsequent filter operation is performed.

This method is recommended over appending elements into the container manually (via native DOM methods) as it prompts a “refresh”, updating MixItUp’s sorting and filtering arrays. It also ensures that white space is maintained between inserted elements, which is vital for inline-block grids.

```
$('#Container').mixItUp('append', $newObject, {filter: '#NewObject'})
```
> Append an element into the container via a jQuery object, and show it via its ID.

<br/>

This method is a short-hand for: `.mixItUp('insert', self._state.totalTargets, elements)`

<h3 name="method-insert">insert</h3>

```
.mixItUp('insert', index, elements, [,multiMixObject] [,callback])
```

Insert an element or collection of elements into the container at an arbitrary index.

Parameters | index | elements | multiMixObject | callback
--- | --- | --- | ---
Type | Number | Object | Object | Function
Default | - | - | `null` | `null`
Description | The index of the target element before which to insert elements. | A jQuery object collection of one or more elements to insert, or a single DOM element. | A multiMix object containing instructions about what to do after the insertion of elements. | An optional callback function to be called after elements have been inserted, or if applicable, after the multiMix operation has completed.

If no multiMix object is passed, elements are inserted and MixItUp is refreshed. However, elements remain hidden until a subsequent filter operation is performed.

This method is recommended over appending elements into the container manually (via native DOM methods) as it prompts a “refresh”, updating MixItUp’s sorting and filtering arrays. It also ensures that white space is maintained between inserted elements, which is vital for inline-block grids.

```
$('#Container').mixItUp('insert', 5, $('<div class="mix category-1"></div>'), {filter: 'all'})
```
> Create and insert a new object into the container before the 5th target element, and show all elements.

<h3 name="method-isMixing">isMixing</h3>

```
.mixItUp('isMixing')
```

This is method returns a boolean and is used to find out if a filter, sort, or layoutChange operation is in progress. It can be useful for custom user-interfaces where queuing is not enabled.

```
if(!$('#Container').mixItUp('isMixing')){
	// If container is not busy
}
```
> Do something only if an operation is not currently in progress.

<h3 name="method-isLoaded">isLoaded</h3>

```
.mixItUp('isLoaded')
```

This method returns a boolean and is used to find out if MixItUp has been instantiated on a particular jQuery object. It is useful for debugging and also for ajax situations where MixItUp containers may be created dynamically.

```
var $container = $('#Container');

if(!$container.mixItUp('isLoaded')){
	$container.mixItUp();
}
```
> Instantiate MixItUp on the container, only if it has not already been instantiated.


<h3 name="method-setOptions">setOptions</h3>

```
.mixItUp('setOptions', configurationObject)
```

Set or change configuration option in real time, after MixItUp has instantiated.

Parameters | configurationObject
--- | --- 
Type | Object
Default | `null`
Description | See Configuration Object

Any options changed will be reflected when the next operation is performed.

```
$('#Container').mixItUp('setOptions', {
	animation: {
		effects: 'fade scale translateX stagger'
	},
	callbacks: {
		onMixEnd: function(){
			// do something 
		}
	}
});
```
> Change the animation effects, and add a callback function.

<br/>

```
$('#Container').mixItUp('setOptions', {
	animation: {
		enable: false
	},
	callbacks: {
		onMixEnd: null
	}
});
```
> Disable effects, and remove any existing callback function

<h3 name="method-getOption">getOption</h3>

```
.mixItUp('getOption', stringKey)
```

Retrieve the value of any configuration option via its key.

Parameters | stringKey
--- | --- 
Type | String
Description | The key of the configuration option you wish to retrieve the value for. Since all configuration options are nested properties of the configuration object, the string must take the form `'parentObject.propertyName'`.

```
var duration = $('#Container').mixItUp('getOption', 'animation.duration');

alert(duration);

// alerts 600
```
> Retrieve the value of the "duration" animation option.

<h3 name="method-getState">getState</h3>

```
.mixItUp('getState')
```

Retrieve the State Object.

```
var state = $('#Container').mixItUp('getState');

alert(state.activeFilter);

// alerts '.category-1'
```
> Save the state object to a variable and find the active filter

<h3 name="method-destroy">destroy</h3>

```
mixItUp('destroy', hideAll)
```

Unbind all handlers, and delete the instance of MixItUp from the memory.

Parameters | hideAll
--- | --- 
Type | Boolean
Default | `false`
Description | A boolean indicating whether to also remove the inline “display” style from all target elements added by MixItUp, thus hiding any elements currently shown.

```
$('#Container').mixItUp('destroy');
```
> Destroy the instance of MixItUp

<br/>

```
$('#Container').mixItUp('destroy', true);
```
> Destroy MixItUp, and reset all target elements to "display: none"

<br/>

-------
*&copy; 2014 KunkaLabs Limited*
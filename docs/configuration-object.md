Configuration Object
=========

1. [Overview](#overview)
1. [Object Defaults](#object-defaults)
1. [Options by Group](#options-by-group)
1. [Option Details](#option-details)

<h2 name='overview'>Overview</h2>

MixItUp will run straight out of the box with default settings but can also be customised via an extensive configuration object passed during instantiation or at any time using the `setOptions` API method.

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
> MixItUp can be instantiated with custom configuration options by passing the configuration object during instantiation

<br/>

```
$('#Container').mixItUp('setOptions', {
	animation: {
		enable: false
	}
});
```
> MixItUp may also be re-configured after instantiation via the `setOptions` API method

<h2 name='object-defaults'>Object Defaults</h2>

The configuration object is organized into several nested object literals of related properties. The entire object with all default values is listed below.

```
{
	animation: {
		enable: true,
		effects: 'fade scale',
		duration: 600,
		easing: 'ease',
		perspectiveDistance: '3000',
		perspectiveOrigin: '50% 50%',
		queue: false,
		queueLimit: 1,
		animateChangeLayout: false,
		animateResizeContainer: true,
		animateResizeTargets: false,
		staggerSequence: false,
		reverseOut: false
	},
	
	callbacks: {
		onMixLoad: false,
		onMixStart: false,
		onMixEnd: false,
		onMixFail: false,
		onMixBusy: false
	},
	
	controls: {
		enable: true,
		live: false,
		toggleFilterButtons: false,
		toggleLogic: 'or',
		activeClass: 'active'
	},
	
	layout: {
		display: 'inline-block',
		containerClass: '',
		containerClassFail: 'fail'
	},

	load: {
		filter: 'all',
		sort: false
	},
	
	selectors: {
		target: '.mix',
		filter: '.filter',
		sort: '.sort'
	}
}
```

<h2 name='options-by-group'>Options by Group</h2>

### animation

This group contains properties related to MixItUp's animation and effects options.

1. [enable](#animationenable)
1. [effects](#animationeffects)
1. [duration](#animationduration)
1. [easing](#animation-easing)
1. [perspectiveDistance](#animationperspectivedistance)
1. [perspectiveOrigin](#animationperspectiveorigin)
1. [queue](#animationqueue)
1. [queueLimit](#animationqueuelimit)
1. [animateChangeLayout](#animationanimatechangelayout)
1. [animateResizeContainer](#animationanimateresizecontainer)
1. [animateResizeTargets](#animationanimateresizetargets)
1. [staggerSequence](#animationstaggersequence)
1. [reverseOut](#animationreverseout)

### callbacks

This group allows the creation of custom callback functions to be executed on specific events.

1. [onMixLoad](#callbacksonmixload)
1. [onMixStart](#callbackonmixstart)
1. [onMixEnd](#callbacksonmixend)
1. [onMixFail](#callbacksonmixfail)
1. [onMixBusy](#callbacksonmixbusy)

### controls

This group contains properties related to MixItUp's clickable (non-api) user-interface.

1. [enable](#controlsenable)
1. [live](#controlslive)
1. [toggleFilterButtons](#controlstogglefilterbuttons)
1. [toggleLogic](#controlstogglelogic)
1. [activeClass](#controlsactiveclass)

### layout

This group contains properties related to the layout and styling of items within your MixItUp container.

1. [display](#layoutdisplay)
1. [containerClass](#layoutcontainerclass)
1. [containerClassFail](#layoutcontainerclassfail)

### load

This group defines MixItUp's initial filter and sort behaviour on first load.

1. [filter](#loadfilter)
1. [sort](#loadsort)

### selectors

This group allows the customisation of the default selector strings used for target elements, and clickable user-interface elements.

1. [target](#selectorstarget)
1. [filter](#selectorsfilter)
1. [sort](#selectorssort)

<h2 name='option-details'>Option Details</h2>

<h3 name='animation-enable'>animation.enable</h3>

type: **Boolean** / default: `true`

Enable or disable MixItUp animations. If false, all operations will happen instantly and synchronously.

```
$('#Container').mixItUp({
	animation: {
		enable: false		
	}
});
```
> Disable animations

<br/>

```
$('#Container').mixItUp({
	animation: {
		enable: false		
	},
	callbacks: {
		onMixLoad: function(){
			$(this).mixItUp('setOptions', {
				animation: {
					enable: true	
				},
			});
		}
	}
});
```
> Disable animations for loading, and then enable for subsequent operations

<h3 name='animation-effects'>animation.effects</h3>

type: **String** / default: `'fade scale'`

The effects for all filter operations as a space-separated string. The available effects are:

- fade
- scale
- translateX
- translateY
- translateZ
- rotateX
- rotateY
- rotateZ
- stagger

Each effect may also take an optional parameter dictating its starting/ending value. Experiment with the home page sandbox to find the perfect combination of effects for your project.

The stagger effect adds an incremental transition-delay to each target element in the order it is processed, and is also applied to sort operations. The order may be manipulated via the `animation.staggerFunction` option.

```
$('#Container').mixItUp({
	animation: {
		effects: 'fade rotateY(-10deg)'
	}
});
```
> Set fade and rotateY animations

<h3 name='animation-duration'>animation.duration</h3>

type: **Number** / default: `600`

The duration of the animation in milliseconds, including easing, but not any delays added via the stagger effect.

```
$('#Container').mixItUp({
	animation: {
		duration: 1000
	}
});
```
> Set an animation duration of 1 second

<h3 name='animation-easing'>animation.easing</h3>

type: **String** / default: `'ease'`

A valid CSS3 transition-timing function or shorthand. For a full list of accepted values, check out easings.net.

```
$('#Container').mixItUp({
	animation: {
		easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
	}
});
```
> Set 'ease-out-back' easing.

<h3 name='animation-perspectiveDistance'>animation.perspectiveDistance</h3>

type: **String** / default: `'3000px'`

The perspective value in CSS units applied to the container during animations, affecting any 3d transform-based effects.

```
$('#Container').mixItUp({
	animation: {
		perspectiveDistance: '1000px'
	}
});
```
> Set a perspective distance of 1000px

<h3 name='animation-perspectiveOrigin'>animation.perspectiveOrigin</h3>

type: **String** / default: `'50% 50%'`

The perspective-origin value applied to the container during animations, affecting any 3d transform based effects.

```
$('#Container').mixItUp({
	animation: {
		perspectiveOrigin: '0 50%'
	}
});
```
> Set a perspective-origin equivalent to 'left center'

<h3 name='animation-queue'>animation.queue</h3>

type: **Boolean** / default: `true`

Enable queuing for all operations received while an another operation is in progress. If false, MixItUp's API methods will return 'busy' instead of a chain-able DOM element.

```
$('#Container').mixItUp({
	animation: {
		queue: false		
	}
});
```
> Disable queueing

<h3 name='animation-queueLimit'>animation.queueLimit</h3>

type: **Number** / default: `1`

The maximum number of operations allowed in the queue at any time.

```
$('#Container').mixItUp({
	animation: {
		queueLimit: 4
	}
});
```
> Allow a maximum of 4 operations in the queue

<h3 name='animation-animateChangeLayout'>animation.animateChangeLayout</h3>

type: **Boolean** / default: `false`

A boolean indicating whether or not to attempt transitioning of target elements during layout change operations.

Depending on the differences in styling between layouts this may produce undesirable results and is therefore disabled by default. 

```
$('#Container').mixItUp({
	animation: {
		animateChangeLayout: true
	}
});
```
> Enable animation for layout change operations

<h3 name='animation-animateResizeContainer'>animation.animateResizeContainer</h3>

type: **Boolean** / default: `true`

A boolean indicating whether or not to transition the height of the container as elements are filtered in and out. If disabled, the container height will change abruptly.

This may be desirable for mobile devices where the CSS height property does not receive GPU-acceleration.

```
$('#Container').mixItUp({
	animation: {
		animateResizeContainer: false
	}
});
```
> Disable container height animation

A fixed height, min-height, or max-height may also be applied to the container in your style sheet to prevent the container from changing height.

<h3 name='animation-animateResizeTargets'>animation.animateResizeTargets</h3>

type: **Boolean** / default: `false`

This is an experimental feature aimed at flex box or layout change situations where the width and height of target elements may change from the start to end of the animation.

If true, MixItUp will attempt to transition the height and width of target elements as they change.

```
$('#Container').mixItUp({
	animation: {
		animateResizeTargets: true
	}
});
```
> Animate changes to the width and height of target elements

As the flex-box specification is not yet fully implemented across all browsers, this feature should be considered experimental. 

This feature requires additional calculations which may adversely affect performance on slower devices and is therefore disabled by default.

<h3 name='animation-staggerSequence'>animation.staggerSequence</h3>

type: **Function** / default: `null`

When using the 'stagger' effect, the delay applied to each target element is incremented based on its index. You may create a custom function to manipulate the order in which the delay is incremented.

This can be used to create engaging visuals when MixItUp first loads. You may wish to disable the function after load using the onMixLoad callback.

The function receives the index of the target element as a parameter, and must return an integer which serves as the multiplier for the stagger delay.

```
$('#Container').mixItUp({
	animation: {
		effects: 'fade stagger(100ms)',
		staggerSequence: function(i){
			return i % 3;
		}
	}
});
```
> Stagger target elements by column in a 3-column grid

<br/>

```
$('#Container').mixItUp({
	animation: {
		effects: 'fade stagger(50ms)',
		staggerSequence: function(i){
			return (2*i) - (5*((i/3) - ((1/3) * (i%3))));
		}
	}
});
```
> This function uses an algorithm to produce a more complex sequence

<h3 name='animation-reverseOut'>animation.reverseOut</h3>

type: **Boolean** / default: `false`

Reverse the direction of “translate” and “rotate” transforms for elements being filtered out.

```
$('#Container').mixItUp({
	animation: {
		effects: 'fade translateX(100%)',
		reverseOut: true
	}
});
```
> Elements being filtered in will be translated to '100%' while elements being filtered out will be translated to '-100%'

<br/>
<hr/>

<h3 name='callbacks-onMixLoad'>callbacks.onMixLoad</h3>

type: **Function** / default: `null`

This callback function is called after MixItUp first loads and any loading animation has completed.

The state object is passed as the first parameter, and the container element is assigned to the “this” keyword.

```
$('#Container').mixItUp({
	callbacks: {
		onMixLoad: function(state){
			alert('MixItUp ready!');
		}
	}
});
```

<h3 name='callbacks-onMixStart'>callbacks.onMixStart</h3>

type: **Function** / default: `null`

This callback function is called immediately after any MixItUp operation is requested and before animations have begun.

The state object is passed as the first parameter, and the container element is assigned to the “this” keyword.

A futureState object is passed as the second parameter, reflecting the state once the operation as completed.
 
```
$('#Container').mixItUp({
	callbacks: {
		onMixStart: function(state, futureState){
			alert('Animation starting');
		}
	}
});
```

<h3 name='callbacks-onMixEnd'>callbacks.onMixEnd</h3>

type: **Function** / default: `null`

This callback function is called after any MixItUp operation has completed and the state object has been updated.

The state object is passed as the first parameter, and the container element is assigned to the “this” keyword.

```
$('#Container').mixItUp({
	callbacks: {
		onMixEnd: function(state){
			alert('Operation ended');
		}
	}
});
```

<h3 name='callbacks-onMixFail'>callbacks.onMixFail</h3>

type: **Function** / default: `null`

This callback function is called when no target elements match the requested filter command.

The state object is passed as the first parameter, and the container element is assigned to the “this” keyword.

```
$('#Container').mixItUp({
	callbacks: {
		onMixFail: function(state){
			alert('No elements found matching '+state.activeFilter);
		}
	}
});
```

<h3 name='callbacks-onMixBusy'>callbacks.onMixBusy</h3>

type: **Function** / default: `null`

type: Function / default: null
This callback function is called if animation queuing is disabled and a MixItUp operation is requested while another operation is in progress.

The state object is passed as the first parameter, and the container element is assigned to the “this” keyword.

```
$('#Container').mixItUp({
	callbacks: {
		onMixBusy: function(state){
			alert('MixItUp busy');
		}
	}
});
```

<br/>
<hr/>

<h3 name='controls-enable'>controls.enable</h3>

type: **Boolean** / default: `true`

Enable or disable physical controls for filter and sort operations.

If disabled, MixItUp will not look for filter and sort buttons to bind on instantiation which may marginally increase loading speed.

Controls can be disabled if you are interacting with MixItUp via its API exclusively. This may also be useful in preventing requests from other MixItUp instances in the document that are using controls.

```
$('#Container').mixItUp({
	controls: {
		enable: false
	}
});
```
> Disable the binding of physical filter and sort controls

<h3 name='controls-live'>controls.live</h3>

type: **Boolean** / default: `false`

By default MixItUp will apply click handlers to individual filter and sort buttons. This is the fastest way to bind on load, but may not be suitable for situations where controls are added and removed dynamically after MixItUp has loaded.

If set to true, MixItUp will delegate filter and sort click events from the body down, enabling the binding of controls that may not exist when  MixItUp first loads.

```
$('#Container').mixItUp({
	controls: {
		live: true
	}
});
```
> Delegate control button click events from the body down

<h3 name='controls-toggleFilterButtons'>controls.toggleFilterButtons</h3>

type: **Boolean** / default: `false`

Enable or disable the toggling of multiple filter buttons.

By default, MixItUp allows only one filter button to be active at any one time. If set to true, multiple filter buttons may be toggled on or off simultaneously and their data-filter values concatenated into a single filter command, as per the logic defined via the toggleLogic property.

This is a fairly simple way to achieve more “advanced” filtering without having to construct custom API-based concatenation functions.

```
$('#Container').mixItUp({
	controls: {
		toggleFilterButtons: true
	}
});
```
> Allow the toggling of multiple filter buttons

<h3 name='controls-toggleLogic'>controls.toggleLogic</h3>

type: **String** / default: `'or'`

Define the logic by which the data-filter value of filter buttons are concatenated, when the toggleFilterButtons property is enabled.

The available options are 'or' and 'and'.

```
'.category-1, .category-2'
```
> With "or" logic, selectors are concatenated into a single comma-separated selector

<br/>

```
'.category-1.category-2'
```
> With "and" logic, selectors are joined into a single compound selector

<br/>

```
$('#Container').mixItUp({
	controls: {
		toggleFilterButtons: true,
		toggleLogic: 'and'
	}
});
```
> Enable "and" logic for filter button toggling.

<h3 name='controls-activeClass'>controls.activeClass</h3>

type: **String** / default: `'active'`

The class applied to individual MixItUp control elements when their filter or sort state is active.

```
$('#Container').mixItUp({
	controls: {
		activeClass: 'on'
	}
});
```
> Change the active class to 'on'

<br/>
<hr/>

<h3 name='layout-display'>layout.display</h3>

type: **String** / default: `'inline-block'`

Set the inline "display" property of target elements.

As all target elements should be hidden by default via the project stylesheet, the display property is set as an inline style for elements that match the current filter and are therefore shown.

This is set to “inline-block” by default which is most suited to multi-column grid situations, but may be set to “block” for a single column list styling.

If using flex box, the display property is ignored, unless set to "none".

```
$('#Container').mixItUp({
	layout: {
		display: 'block'
	}
});
```
> Set shown target elements to "display: block;"

<h3 name='layout-containerClass'>layout.containerClass</h3>

type: **String** / default: `''`

An optional class added to the container on load, which may be used to affect the styling of target elements.

This class can be changed via the changeLayout API method.

```
$('#Container').mixItUp({
	layout: {
		containerClass: 'list'
	}
});
```
> Add the class "list" to the container on load

<h3 name='layout-containerClassFail'>layout.containerClassFail</h3>

type: **String** / default: `'fail'`

A class added to the container when no target elements are found that match the filter selector, which may be used to show or style a feedback message for the user.

```
$('#Container').mixItUp({
	layout: {
		containerClassFail: 'none-found'
	}
});
```
> Change the fail class to "none-found"

<br/>
<hr/>

<h3 name='load-filter'>load.filter</h3>

type: **String** or **Object** / default: `'all'`

Define which target elements to show on load. All target elements are shown by default.

Consistent with the filter API method, and jQuery’s .filter() method, this property accepts a selector string or jQuery object.

The values ‘all’ and ‘none’ are also valid.

```
$('#Container').mixItUp({
	load: {
		filter: '.category-1'
	}
});
```
> Show elements with the class ".category-1" on load.

<h3 name='load-sort'>load.sort</h3>

type: **String** / default: `'default:asc'`

Define the order that target elements are sorted on load.

By default, elements are not sorted and appear in the order of their position in the DOM (“default” order).

The sort string is made up of two colon-separated parts as follows: attribute-name:order

The first part of the string is the name of the data attribute to sort by (excluding the word data), and the second part is the order (asc/desc). The second part is optional as ascending order is assumed.

```
$('#Container').mixItUp({
	load: {
		sort: 'age:desc'
	}
});
```
> Sort target elements by the value of their "data-age" attributes, in descending order

<br/>

Multiple space-separated sort strings may be joined together in order of priority:

```
$('#Container').mixItUp({
	load: {
		sort: 'age:desc name:asc'
	}
});
```
> Sort target elements first by their "data-age" attribute, and then by "data-name"

<br/>
<hr/>

<h3 name='selectors-target'>selectors.target</h3>

type: **String** / default: `'.mix'`

A selector defining which elements within the container should be treated as “target” elements, and are therefore included in filter and sort elements.

By default only elements with the class “mix” are treated as target elements.

```
$('#Container').mixItUp({
	selectors: {
		target: 'li'
	}
});
```
> Set the target selector to "li"

<h3 name='selectors-filter'>selectors.filter</h3>

type: **String** / default: `'.filter'`

A selector used to bind filter buttons.

By default, any element with the class “filter” will have a click event-handler bound to it, for the triggering of filter operations.

```
$('#Container').mixItUp({
	selectors: {
		filter: '.filter-btn'
	}
});
```
> Change the filter button selector to ".filter-btn"

<h3 name='selectors-sort'>selectors.sort</h3>

type: **String** / default: `'.sort'`

A selector used to bind sort buttons.

By default, any element with the class “sort” will have a click event-handler bound to it, for the triggering of  sort operations.

```
$('#Container').mixItUp({
	selectors: {
		filter: '.sort-btn'
	}
});
```
> Change the sort button selector to ".sort-btn"

<br/>

-------
*&copy; 2014 KunkaLabs Limited*

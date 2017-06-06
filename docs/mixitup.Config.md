# mixitup.Config

## Overview

`mixitup.Config` is an interface used for customising the functionality of a
mixer instance. It is organised into several semantically distinct sub-objects,
each one pertaining to a particular aspect of MixItUp functionality.

An object literal containing any or all of the available properies,
known as the "configuration object", can be passed as the second parameter to
the `mixitup` factory function when creating a mixer instance to customise its
functionality as needed.

If no configuration object is passed, the mixer instance will take on the default
configuration values detailed below.

### Contents

- [animation](#animation)
- [behavior](#behavior)
- [callbacks](#callbacks)
- [controls](#controls)
- [classNames](#classNames)
- [data](#data)
- [debug](#debug)
- [layout](#layout)
- [load](#load)
- [selectors](#selectors)
- [render](#render)


<h2 id="animation">animation</h2>

A group of properties defining the mixer's animation and effects settings.

### enable




A boolean dictating whether or not animation should be enabled for the MixItUp instance.
If `false`, all operations will occur instantly and syncronously, although callback
functions and any returned promises will still be fulfilled.


|Type | Default
|---  | ---
|`boolean`| `true`

###### Example: Create a mixer with all animations disabled

```js
var mixer = mixitup(containerEl, {
    animation: {
        enable: false
    }
});
```
### effects




A string of one or more space-seperated properties to which transitions will be
applied for all filtering animations.

Properties can be listed any order or combination, although they will be applied in a specific
predefined order to produce consistent results.

To learn more about available effects, experiment with our <a href="https://www.kunkalabs.com/mixitup/">
sandbox demo</a> and try out the "Export config" button in the Animation options drop down.


|Type | Default
|---  | ---
|`string`| `'fade scale'`

###### Example: Apply "fade" and "translateZ" effects to all animations

```js
// As targets are filtered in and out, they will fade between
// opacity 1 and 0 and transform between translateZ(-100px) and
// translateZ(0).

var mixer = mixitup(containerEl, {
    animation: {
        effects: 'fade translateZ(-100px)'
    }
});
```
### effectsIn




A string of one or more space-seperated effects to be applied only to filter-in
animations, overriding `config.animation.effects` if set.


|Type | Default
|---  | ---
|`string`| `''`

###### Example: Apply downwards vertical translate to targets being filtered in

```js

var mixer = mixitup(containerEl, {
    animation: {
        effectsIn: 'fade translateY(-100%)'
    }
});
```
### effectsOut




A string of one or more space-seperated effects to be applied only to filter-out
animations, overriding `config.animation.effects` if set.


|Type | Default
|---  | ---
|`string`| `''`

###### Example: Apply upwards vertical translate to targets being filtered out

```js

var mixer = mixitup(containerEl, {
    animation: {
        effectsOut: 'fade translateY(-100%)'
    }
});
```
### duration




An integer dictating the duration of all MixItUp animations in milliseconds, not
including any additional delay apllied via the `'stagger'` effect.


|Type | Default
|---  | ---
|`number`| `600`

###### Example: Apply an animation duration of 200ms to all mixitup animations

```js

var mixer = mixitup(containerEl, {
    animation: {
        duration: 200
    }
});
```
### easing




A valid CSS3 transition-timing function or shorthand. For a full list of accepted
values, visit <a href="http://easings.net" target="_blank">easings.net</a>.


|Type | Default
|---  | ---
|`string`| `'ease'`

###### Example 1: Apply "ease-in-out" easing to all animations

```js

var mixer = mixitup(containerEl, {
    animation: {
        easing: 'ease-in-out'
    }
});
```
###### Example 2: Apply a custom "cubic-bezier" easing function to all animations

```js
var mixer = mixitup(containerEl, {
    animation: {
        easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
    }
});
```
### applyPerspective




A boolean dictating whether or not to apply perspective to the MixItUp container
during animations. By default, perspective is always applied and creates the
illusion of three-dimensional space for effects such as `translateZ`, `rotateX`,
and `rotateY`.

You may wish to disable this and define your own perspective settings via CSS.


|Type | Default
|---  | ---
|`bolean`| `true`

###### Example: Prevent perspective from being applied to any 3D transforms

```js
var mixer = mixitup(containerEl, {
    animation: {
        applyPerspective: false
    }
});
```
### perspectiveDistance




The perspective distance value to be applied to the container during animations,
affecting any 3D-transform-based effects.


|Type | Default
|---  | ---
|`string`| `'3000px'`

###### Example: Set a perspective distance of 2000px

```js
var mixer = mixitup(containerEl, {
    animation: {
        effects: 'rotateY(-25deg)',
        perspectiveDistance: '2000px'
    }
});
```
### perspectiveOrigin




The perspective-origin value to be applied to the container during animations,
affecting any 3D-transform-based effects.


|Type | Default
|---  | ---
|`string`| `'50% 50%'`

###### Example: Set a perspective origin in the top-right of the container

```js
var mixer = mixitup(containerEl, {
    animation: {
        effects: 'transateZ(-200px)',
        perspectiveOrigin: '100% 0'
    }
});
```
### queue




A boolean dictating whether or not to enable the queuing of operations.

If `true` (default), and a control is clicked or an API call is made while another
operation is progress, the operation will go into the queue and will be automatically exectuted
when the previous operaitons is finished.

If `false`, any requested operations will be ignored, and the `onMixBusy` callback and `mixBusy`
event will be fired. If `debug.showWarnings` is enabled, a console warning will also occur.


|Type | Default
|---  | ---
|`boolean`| `true`

###### Example: Disable queuing

```js
var mixer = mixitup(containerEl, {
    animation: {
        queue: false
    }
});
```
### queueLimit




An integer dictacting the maximum number of operations allowed in the queue at
any time, when queuing is enabled.


|Type | Default
|---  | ---
|`number`| `3`

###### Example: Allow a maximum of 5 operations in the queue at any time

```js
var mixer = mixitup(containerEl, {
    animation: {
        queueLimit: 5
    }
});
```
### animateResizeContainer




A boolean dictating whether or not to transition the height and width of the
container as elements are filtered in and out. If disabled, the container height
will change abruptly.

It may be desirable to disable this on mobile devices as the CSS `height` and
`width` properties do not receive GPU-acceleration and can therefore cause stuttering.


|Type | Default
|---  | ---
|`boolean`| `true`

###### Example 1: Disable the transitioning of the container height and/or width

```js
var mixer = mixitup(containerEl, {
    animation: {
        animateResizeContainer: false
    }
});
```
###### Example 2: Disable the transitioning of the container height and/or width for mobile devices only

```js
var mixer = mixitup(containerEl, {
    animation: {
        animateResizeContainer: myFeatureTests.isMobile ? false : true
    }
});
```
### animateResizeTargets




A boolean dictating whether or not to transition the height and width of target
elements as they change throughout the course of an animation.

This is often a must for flex-box grid layouts where the size of target elements may change
depending on final their position in relation to their siblings, or for `.changeLayout()`
operations where the size of targets change between layouts.

NB: This feature requires additional calculations and manipulation to non-hardware-accelerated
properties which may adversely affect performance on slower devices, and is therefore
disabled by default.


|Type | Default
|---  | ---
|`boolean`| `false`

###### Example: Enable the transitioning of target widths and heights

```js
var mixer = mixitup(containerEl, {
    animation: {
        animateResizeTargets: true
    }
});
```
### staggerSequence




A custom function used to manipulate the order in which the stagger delay is
incremented when using the ‘stagger’ effect.

When using the 'stagger' effect, the delay applied to each target element is incremented
based on its index. You may create a custom function to manipulate the order in which the
delay is incremented and create engaging non-linear stagger effects.

The function receives the index of the target element as a parameter, and must
return an integer which serves as the multiplier for the stagger delay.


|Type | Default
|---  | ---
|`function`| `null`

###### Example 1: Stagger target elements by column in a 3-column grid

```js
var mixer = mixitup(containerEl, {
    animation: {
        effects: 'fade stagger(100ms)',
        staggerSequence: function(i) {
            return i % 3;
        }
    }
});
```
###### Example 2: Using an algorithm to produce a more complex sequence

```js
var mixer = mixitup(containerEl, {
    animation: {
        effects: 'fade stagger(100ms)',
        staggerSequence: function(i) {
            return (2*i) - (5*((i/3) - ((1/3) * (i%3))));
        }
    }
});
```
### reverseOut




A boolean dictating whether or not to reverse the direction of `translate`
and `rotate` transforms for elements being filtered out.

It can be used to create carousel-like animations where elements enter and exit
from opposite directions. If enabled, the effect `translateX(-100%)` for elements
being filtered in would become `translateX(100%)` for targets being filtered out.

This functionality can also be achieved by providing seperate effects
strings for `config.animation.effectsIn` and `config.animation.effectsOut`.


|Type | Default
|---  | ---
|`boolean`| `false`

###### Example: Reverse the desired direction on any translate/rotate effect for targets being filtered out

```js
// Elements being filtered in will be translated from '100%' to '0' while
// elements being filtered out will be translated from 0 to '-100%'

var mixer = mixitup(containerEl, {
    animation: {
        effects: 'fade translateX(100%)',
        reverseOut: true,
        nudge: false // Disable nudging to create a carousel-like effect
    }
});
```
### nudge




A boolean dictating whether or not to "nudge" the animation path of targets
when they are being filtered in and out simulatenously.

This has been the default behavior of MixItUp since version 1, but it
may be desirable to disable this effect when filtering directly from
one exclusive set of targets to a different exclusive set of targets,
to create a carousel-like effect, or a generally more subtle animation.


|Type | Default
|---  | ---
|`boolean`| `true`

###### Example: Disable the "nudging" of targets being filtered in and out simulatenously

```js

var mixer = mixitup(containerEl, {
    animation: {
        nudge: false
    }
});
```
### clampHeight




A boolean dictating whether or not to clamp the height of the container while MixItUp's
geometry tests are carried out before an operation.

To prevent scroll-bar flicker, clamping is turned on by default. But in the case where the
height of the container might affect its vertical positioning in the viewport
(e.g. a vertically-centered container), this should be turned off to ensure accurate
test results and a smooth animation.


|Type | Default
|---  | ---
|`boolean`| `true`

###### Example: Disable container height-clamping

```js

var mixer = mixitup(containerEl, {
    animation: {
        clampHeight: false
    }
});
```
### clampWidth




A boolean dictating whether or not to clamp the width of the container while MixItUp's
geometry tests are carried out before an operation.

To prevent scroll-bar flicker, clamping is turned on by default. But in the case where the
width of the container might affect its horitzontal positioning in the viewport
(e.g. a horizontall-centered container), this should be turned off to ensure accurate
test results and a smooth animation.


|Type | Default
|---  | ---
|`boolean`| `true`

###### Example: Disable container width-clamping

```js

var mixer = mixitup(containerEl, {
    animation: {
        clampWidth: false
    }
});
```

<h2 id="behavior">behavior</h2>

A group of properties relating to the behavior of the Mixer.

### liveSort




A boolean dictating whether to allow "live" sorting of the mixer.

Because of the expensive nature of sorting, MixItUp makes use of several
internal optimizations to skip redundant sorting operations, such as when
the newly requested sort command is the same as the active one. The caveat
to this optimization is that "live" edits to the value of a target's sorting
attribute will be ignored when requesting a re-sort by the same attribute.

By setting to `behavior.liveSort` to `true`, the mixer will always re-sort
regardless of whether or not the sorting attribute and order have changed.


|Type | Default
|---  | ---
|`boolean`| `false`

###### Example: Enabling `liveSort` to allow for re-sorting

```js

var mixer = mixitup(containerEl, {
    behavior: {
        liveSort: true
    },
    load: {
        sort: 'edited:desc'
    }
});

var target = containerEl.children[3];

console.log(target.getAttribute('data-edited')); // '2015-04-24'

target.setAttribute('data-edited', '2017-08-10'); // Update the target's edited date

mixer.sort('edited:desc')
    .then(function(state) {
        // The target is now at the top of the list

        console.log(state.targets[0] === target); // true
    });
```

<h2 id="callbacks">callbacks</h2>

A group of optional callback functions to be invoked at various
points within the lifecycle of a mixer operation.

Each function is analogous to an event of the same name triggered from the
container element, and is invoked immediately after it.

All callback functions receive the current `state` object as their first
argument, as well as other more specific arguments described below.

### onMixStart




A callback function invoked immediately after any MixItUp operation is requested
and before animations have begun.

A second `futureState` argument is passed to the function which represents the final
state of the mixer once the requested operation has completed.


|Type | Default
|---  | ---
|`function`| `null`

###### Example: Adding an `onMixStart` callback function

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixStart: function(state, futureState) {
             console.log('Starting operation...');
        }
    }
});
```
### onMixBusy




A callback function invoked when a MixItUp operation is requested while another
operation is in progress, and the animation queue is full, or queueing
is disabled.


|Type | Default
|---  | ---
|`function`| `null`

###### Example: Adding an `onMixBusy` callback function

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixBusy: function(state) {
             console.log('Mixer busy');
        }
    }
});
```
### onMixEnd




A callback function invoked after any MixItUp operation has completed, and the
state has been updated.


|Type | Default
|---  | ---
|`function`| `null`

###### Example: Adding an `onMixEnd` callback function

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixEnd: function(state) {
             console.log('Operation complete');
        }
    }
});
```
### onMixFail




A callback function invoked whenever an operation "fails", i.e. no targets
could be found matching the requested filter.


|Type | Default
|---  | ---
|`function`| `null`

###### Example: Adding an `onMixFail` callback function

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixFail: function(state) {
             console.log('No items could be found matching the requested filter');
        }
    }
});
```
### onMixClick




A callback function invoked whenever a MixItUp control is clicked, and before its
respective operation is requested.

The clicked element is assigned to the `this` keyword within the function. The original
click event is passed to the function as the second argument, which can be useful if
using `<a>` tags as controls where the default behavior needs to be prevented.

Returning `false` from the callback will prevent the control click from triggering
an operation.


|Type | Default
|---  | ---
|`function`| `null`

###### Example 1: Adding an `onMixClick` callback function

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixClick: function(state, originalEvent) {
             console.log('The control "' + this.innerText + '" was clicked');
        }
    }
});
```
###### Example 2: Using `onMixClick` to manipulate the original click event

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixClick: function(state, originalEvent) {
             // Prevent original click event from bubbling up:
             originalEvent.stopPropagation();

             // Prevent default behavior of clicked element:
             originalEvent.preventDefault();
        }
    }
});
```
###### Example 3: Using `onMixClick` to conditionally cancel operations

```js
var mixer = mixitup(containerEl, {
    callbacks: {
        onMixClick: function(state, originalEvent) {
             // Perform some conditional check:

             if (myApp.isLoading) {
                 // By returning false, we can prevent the control click from triggering an operation.

                 return false;
             }
        }
    }
});
```

<h2 id="controls">controls</h2>

A group of properties relating to clickable control elements.

### enable




A boolean dictating whether or not controls should be enabled for the mixer instance.

If `true` (default behavior), MixItUp will search the DOM for any clickable elements with
`data-filter`, `data-sort` or `data-toggle` attributes, and bind them for click events.

If `false`, no click handlers will be bound, and all functionality must therefore be performed
via the mixer's API methods.

If you do not intend to use the default controls, setting this property to `false` will
marginally improve the startup time of your mixer instance, and will also prevent any other active
mixer instances in the DOM which are bound to controls from controlling the instance.


|Type | Default
|---  | ---
|`boolean`| `true`

###### Example: Disabling controls

```js
var mixer = mixitup(containerEl, {
    controls: {
        enable: false
    }
});

// With the default controls disabled, we can only control
// the mixer via its API methods, e.g.:

mixer.filter('.cat-1');
```
### live




A boolean dictating whether or not to use event delegation when binding click events
to the default controls.

If `false` (default behavior), each control button in the DOM will be found and
individually bound when a mixer is instantiated, with their corresponding actions
cached for performance.

If `true`, a single click handler will be applied to the `window` (or container element - see
`config.controls.scope`), and any click events triggered by elements with `data-filter`,
`data-sort` or `data-toggle` attributes present will be handled as they propagate upwards.

If you require a user interface where control buttons may be added, removed, or changed during the
lifetime of a mixer, `controls.live` should be set to `true`. There is a marginal but unavoidable
performance deficit when using live controls, as the value of each control button must be read
from the DOM in real time once the click event has propagated.


|Type | Default
|---  | ---
|`boolean`| `true`

###### Example: Setting live controls

```js
var mixer = mixitup(containerEl, {
    controls: {
        live: true
    }
});

// Control buttons can now be added, remove and changed without breaking
// the mixer's UI
```
### scope




A string dictating the "scope" to use when binding or querying the default controls. The available
values are `'global'` or `'local'`.

When set to `'global'` (default behavior), MixItUp will query the entire document for control buttons
to bind, or delegate click events from (see `config.controls.live`).

When set to `'local'`, MixItUp will only query (or bind click events to) its own container element.
This may be desireable if you require multiple active mixer instances within the same document, with
controls that would otherwise intefere with each other if scoped globally.

Conversely, if you wish to control multiple instances with a single UI, you would create one
set of controls and keep the controls scope of each mixer set to `global`.


|Type | Default
|---  | ---
|`string`| `'global'`

###### Example: Setting 'local' scoped controls

```js
var mixerOne = mixitup(containerOne, {
    controls: {
        scope: 'local'
    }
});

var mixerTwo = mixitup(containerTwo, {
    controls: {
        scope: 'local'
    }
});

// Both mixers can now exist within the same document with
// isolated controls placed within their container elements.
```
### toggleLogic




A string dictating the type of logic to apply when concatenating the filter selectors of
active toggle buttons (i.e. any clickable element with a `data-toggle` attribute).

If set to `'or'` (default behavior), selectors will be concatenated together as
a comma-seperated list. For example:

`'.cat-1, .cat-2'` (shows any elements matching `'.cat-1'` OR `'.cat-2'`)

If set to `'and'`, selectors will be directly concatenated together. For example:

`'.cat-1.cat-2'` (shows any elements which match both `'.cat-1'` AND `'.cat-2'`)


|Type | Default
|---  | ---
|`string`| `'or'`

###### Example: Setting "and" toggle logic

```js
var mixer = mixitup(containerEl, {
    controls: {
        toggleLogic: 'and'
    }
});
```
### toggleDefault




A string dictating the filter behavior when all toggles are inactive.

When set to `'all'` (default behavior), *all* targets will be shown by default
when no toggles are active, or at the moment all active toggles are toggled off.

When set to `'none'`, no targets will be shown by default when no toggles are
active, or at the moment all active toggles are toggled off.


|Type | Default
|---  | ---
|`string`| `'all'`

###### Example 1: Setting the default toggle behavior to `'all'`

```js
var mixer = mixitup(containerEl, {
    controls: {
        toggleDefault: 'all'
    }
});

mixer.toggleOn('.cat-2')
    .then(function() {
        // Deactivate all active toggles

        return mixer.toggleOff('.cat-2')
    })
    .then(function(state) {
         console.log(state.activeFilter.selector); // 'all'
         console.log(state.totalShow); // 12
    });
```
###### Example 2: Setting the default toggle behavior to `'none'`

```js
var mixer = mixitup(containerEl, {
    controls: {
        toggleDefault: 'none'
    }
});

mixer.toggleOn('.cat-2')
    .then(function() {
        // Deactivate all active toggles

        return mixer.toggleOff('.cat-2')
    })
    .then(function(state) {
         console.log(state.activeFilter.selector); // 'none'
         console.log(state.totalShow); // 0
    });
```

<h2 id="classNames">classNames</h2>

A group of properties defining the output and structure of class names programmatically
added to controls and containers to reflect the state of the mixer.

Most commonly, class names are added to controls by MixItUp to indicate that
the control is active so that it can be styled accordingly - `'mixitup-control-active'` by default.

Using a "BEM" like structure, each classname is broken into the three parts:
a block namespace (`'mixitup'`), an element name (e.g. `'control'`), and an optional modifier
name (e.g. `'active'`) reflecting the state of the element.

By default, each part of the classname is concatenated together using single hyphens as
delineators, but this can be easily customised to match the naming convention and style of
your project.

### block




The "block" portion, or top-level namespace added to the start of any class names created by MixItUp.


|Type | Default
|---  | ---
|`string`| `'mixitup'`

###### Example 1: changing the `config.classNames.block` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio'
    }
});

// Active control output: "portfolio-control-active"
```
###### Example 2: Removing `config.classNames.block`

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: ''
    }
});

// Active control output: "control-active"
```
### elementContainer




The "element" portion of the class name added to container.


|Type | Default
|---  | ---
|`string`| `'container'`

### elementFilter




The "element" portion of the class name added to filter controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classNames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

###### Example 1: changing the `config.classNames.elementFilter` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        elementFilter: 'filter'
    }
});

// Active filter output: "mixitup-filter-active"
```
###### Example 2: changing the `config.classNames.block` and `config.classNames.elementFilter` values

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio',
        elementFilter: 'filter'
    }
});

// Active filter output: "portfolio-filter-active"
```
### elementSort




The "element" portion of the class name added to sort controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classNames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

###### Example 1: changing the `config.classNames.elementSort` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        elementSort: 'sort'
    }
});

// Active sort output: "mixitup-sort-active"
```
###### Example 2: changing the `config.classNames.block` and `config.classNames.elementSort` values

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio',
        elementSort: 'sort'
    }
});

// Active sort output: "portfolio-sort-active"
```
### elementMultimix




The "element" portion of the class name added to multimix controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classNames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

###### Example 1: changing the `config.classNames.elementMultimix` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        elementMultimix: 'multimix'
    }
});

// Active multimix output: "mixitup-multimix-active"
```
###### Example 2: changing the `config.classNames.block` and `config.classNames.elementMultimix` values

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio',
        elementSort: 'multimix'
    }
});

// Active multimix output: "portfolio-multimix-active"
```
### elementToggle




The "element" portion of the class name added to toggle controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classNames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

###### Example 1: changing the `config.classNames.elementToggle` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        elementToggle: 'toggle'
    }
});

// Active toggle output: "mixitup-toggle-active"
```
###### Example 2: changing the `config.classNames.block` and `config.classNames.elementToggle` values

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio',
        elementToggle: 'toggle'
    }
});

// Active toggle output: "portfolio-toggle-active"
```
### modifierActive




The "modifier" portion of the class name added to active controls.


|Type | Default
|---  | ---
|`string`| `'active'`

### modifierDisabled




The "modifier" portion of the class name added to disabled controls.


|Type | Default
|---  | ---
|`string`| `'disabled'`

### modifierFailed




The "modifier" portion of the class name added to the container when in a "failed" state.


|Type | Default
|---  | ---
|`string`| `'failed'`

### delineatorElement




The delineator used between the "block" and "element" portions of any class name added by MixItUp.

If the block portion is ommited by setting it to an empty string, no delineator will be added.


|Type | Default
|---  | ---
|`string`| `'-'`

###### Example: changing the delineator to match BEM convention

```js
var mixer = mixitup(containerEl, {
    classNames: {
        delineatorElement: '__'
    }
});

// example active control output: "mixitup__control-active"
```
### delineatorModifier




The delineator used between the "element" and "modifier" portions of any class name added by MixItUp.

If the element portion is ommited by setting it to an empty string, no delineator will be added.


|Type | Default
|---  | ---
|`string`| `'-'`

###### Example: changing both delineators to match BEM convention

```js
var mixer = mixitup(containerEl, {
    classNames: {
        delineatorElement: '__'
        delineatorModifier: '--'
    }
});

// Active control output: "mixitup__control--active"
```

<h2 id="data">data</h2>

A group of properties relating to MixItUp's dataset API.

### uidKey




A string specifying the name of the key containing your data model's unique
identifier (UID). To use the dataset API, a UID key must be specified and
be present and unique on all objects in the dataset you provide to MixItUp.

For example, if your dataset is made up of MongoDB documents, the UID
key would be `'id'` or `'_id'`.


|Type | Default
|---  | ---
|`string`| `''`

###### Example: Setting the UID to `'id'`

```js
var mixer = mixitup(containerEl, {
    data: {
        uidKey: 'id'
    }
});
```
### dirtyCheck




A boolean dictating whether or not MixItUp should "dirty check" each object in
your dataset for changes whenever `.dataset()` is called, and re-render any targets
for which a change is found.

Depending on the complexity of your data model, dirty checking can be expensive
and is therefore disabled by default.

NB: For changes to be detected, a new immutable instance of the edited model must be
provided to mixitup, rather than manipulating properties on the existing instance.
If your changes are a result of a DB write and read, you will most likely be calling
`.dataset()` with a clean set of objects each time, so this will not be an issue.


|Type | Default
|---  | ---
|`boolean`| `false`

###### Example: Enabling dirty checking

```js

var myDataset = [
    {
        id: 0,
        title: "Blog Post Title 0"
        ...
    },
    {
        id: 1,
        title: "Blog Post Title 1"
        ...
    }
];

// Instantiate a mixer with a pre-loaded dataset, and a target renderer
// function defined

var mixer = mixitup(containerEl, {
    data: {
        uidKey: 'id',
        dirtyCheck: true
    },
    load: {
        dataset: myDataset
    },
    render: {
        target: function() { ... }
    }
});

// For illustration, we will clone and edit the second object in the dataset.
// NB: this would typically be done server-side in response to a DB update,
and then re-queried via an API.

myDataset[1] = Object.assign({}, myDataset[1]);

myDataset[1].title = 'Blog Post Title 11';

mixer.dataset(myDataset)
   .then(function() {
       // the target with ID "1", will be re-rendered reflecting its new title
   });
```

<h2 id="debug">debug</h2>

A group of properties allowing the toggling of various debug features.

### enable




A boolean dictating whether or not the mixer instance returned by the
`mixitup()` factory function should expose private properties and methods.

By default, mixer instances only expose their public API, but enabling
debug mode will give you access to various mixer internals which may aid
in debugging, or the authoring of extensions.


|Type | Default
|---  | ---
|`boolean`| `false`

###### Example: Enabling debug mode

```js

var mixer = mixitup(containerEl, {
    debug: {
        enable: true
    }
});

// Private properties and methods will now be visible on the mixer instance:

console.log(mixer);
```
### showWarnings




A boolean dictating whether or not warnings should be shown when various
common gotchas occur.

Warnings are intended to provide insights during development when something
occurs that is not a fatal, but may indicate an issue with your integration,
and are therefore turned on by default. However, you may wish to disable
them in production.


|Type | Default
|---  | ---
|`boolean`| `true`

###### Example 1: Disabling warnings

```js

var mixer = mixitup(containerEl, {
    debug: {
        showWarnings: false
    }
});
```
###### Example 2: Disabling warnings based on environment

```js

var showWarnings = myAppConfig.environment === 'development' ? true : false;

var mixer = mixitup(containerEl, {
    debug: {
        showWarnings: showWarnings
    }
});
```

<h2 id="layout">layout</h2>

A group of properties relating to the layout of the container.

### allowNestedTargets




A boolean dictating whether or not mixitup should query all descendants
of the container for targets, or only immediate children.

By default, mixitup will query all descendants matching the
`selectors.target` selector when indexing targets upon instantiation.
This allows for targets to be nested inside a sub-container which is
useful when ring-fencing targets from locally scoped controls in your
markup (see `controls.scope`).

However, if you are building a more complex UI requiring the nesting
of mixers within mixers, you will most likely want to limit targets to
immediate children of the container by setting this property to `false`.


|Type | Default
|---  | ---
|`boolean`| `true`

###### Example: Restricting targets to immediate children

```js

var mixer = mixitup(containerEl, {
    layout: {
        allowNestedTargets: false
    }
});
```
### containerClassName




A string specifying an optional class name to apply to the container when in
its default state.

By changing this class name or adding a class name to the container via the
`.changeLayout()` API method, the CSS layout of the container can be changed,
and MixItUp will attemp to gracefully animate the container and its targets
between states.


|Type | Default
|---  | ---
|`string`| `''`

###### Example 1: Specifying a container class name

```js

var mixer = mixitup(containerEl, {
    layout: {
        containerClassName: 'grid'
    }
});
```
###### Example 2: Changing the default class name with `.changeLayout()`

```js

var mixer = mixitup(containerEl, {
    layout: {
        containerClassName: 'grid'
    }
});

mixer.changeLayout('list')
    .then(function(state) {
         console.log(state.activeContainerClass); // "list"
    });
```
### siblingBefore




A reference to a non-target sibling element after which to insert targets
when there are no targets in the container.


|Type | Default
|---  | ---
|`HTMLElement`| `null`

###### Example: Setting a `siblingBefore` reference element

```js

var addButton = containerEl.querySelector('button');

var mixer = mixitup(containerEl, {
    layout: {
        siblingBefore: addButton
    }
});
```
### siblingAfter




A reference to a non-target sibling element before which to insert targets
when there are no targets in the container.


|Type | Default
|---  | ---
|`HTMLElement`| `null`

###### Example: Setting an `siblingAfter` reference element

```js

var gap = containerEl.querySelector('.gap');

var mixer = mixitup(containerEl, {
    layout: {
        siblingAfter: gap
    }
});
```

<h2 id="load">load</h2>

A group of properties defining the initial state of the mixer on load (instantiation).

### filter




A string defining any filtering to be statically applied to the mixer on load.
As per the `.filter()` API, this can be any valid selector string, or the
values `'all'` or `'none'`.


|Type | Default
|---  | ---
|`string`| `'all'`

###### Example 1: Defining an initial filter selector to be applied on load

```js

// The mixer will show only those targets matching '.category-a' on load.

var mixer = mixitup(containerEl, {
    load: {
        filter: '.category-a'
    }
});
```
###### Example 2: Hiding all targets on load

```js

// The mixer will show hide all targets on load.

var mixer = mixitup(containerEl, {
    load: {
        filter: 'none'
    }
});
```
### sort




A string defining any sorting to be statically applied to the mixer on load.
As per the `.sort()` API, this should be a valid "sort string" made up of
an attribute to sort by (or `'default'`) followed by an optional sorting
order, or the value `'random'`;


|Type | Default
|---  | ---
|`string`| `'default:asc'`

###### Example: Defining sorting to be applied on load

```js

// The mixer will sort the container by the value of the `data-published-date`
// attribute, in descending order.

var mixer = mixitup(containerEl, {
    load: {
        sort: 'published-date:desc'
    }
});
```
### dataset




An array of objects representing the underlying data of any pre-rendered targets,
when using the `.dataset()` API.

NB: If targets are pre-rendered when the mixer is instantiated, this must be set.


|Type | Default
|---  | ---
|`Array.<object>`| `null`

###### Example: Defining the initial underyling dataset

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
        uidKey: 'id'
    },
    load: {
        dataset: myDataset
    }
});
```

<h2 id="selectors">selectors</h2>

A group of properties defining the selectors used to query elements within a mixitup container.

### target




A selector string used to query and index target elements within the container.

By default, the class selector `'.mix'` is used, but this can be changed to an
attribute or element selector to match the style of your project.


|Type | Default
|---  | ---
|`string`| `'.mix'`

###### Example 1: Changing the target selector

```js

var mixer = mixitup(containerEl, {
    selectors: {
        target: '.portfolio-item'
    }
});
```
###### Example 2: Using an attribute selector as a target selector

```js

// The mixer will search for any children with the attribute `data-ref="mix"`

var mixer = mixitup(containerEl, {
    selectors: {
        target: '[data-ref="mix"]'
    }
});
```
### control




A optional selector string used to add further specificity to the querying of control elements,
in addition to their mandatory data attribute (e.g. `data-filter`, `data-toggle`, `data-sort`).

This can be used if other elements in your document must contain the above attributes
(e.g. for use in third-party scripts), and would otherwise interfere with MixItUp. Adding
an additional `control` selector of your choice allows MixItUp to restrict event handling
to only those elements matching the defined selector.


|Type | Default
|---  | ---
|`string`| `''`

###### Example 1: Adding a `selectors.control` selector

```js

var mixer = mixitup(containerEl, {
    selectors: {
        control: '.mixitup-control'
    }
});

// Will not be handled:
// <button data-filter=".category-a"></button>

// Will be handled:
// <button class="mixitup-control" data-filter=".category-a"></button>
```

<h2 id="render">render</h2>

A group of optional render functions for creating and updating elements.

All render functions receive a data object, and should return a valid HTML string.

### target




A function returning an HTML string representing a target element, or a reference to a
single DOM element.

The function is invoked as part of the `.dataset()` API, whenever a new item is added
to the dataset, or an item in the dataset changes (if `dataset.dirtyCheck` is enabled).

The function receives the relevant dataset item as its first parameter.


|Type | Default
|---  | ---
|`function`| `'null'`

###### Example 1: Using string concatenation

```js

var mixer = mixitup(containerEl, {
    render: {
        target: function(item) {
            return (
                '<div class="mix">' +
                    '<h2>' + item.title + '</h2>' +
                '</div>'
            );
        }
    }
});
```
###### Example 2: Using an ES2015 template literal

```js

var mixer = mixitup(containerEl, {
    render: {
        target: function(item) {
            return (
                `<div class="mix">
                    <h2>${item.title}</h2>
                 </div>`
            );
        }
    }
});
```
###### Example 3: Using a Handlebars template

```js

var targetTemplate = Handlebars.compile('<div class="mix"><h2>{{title}}</h2></div>');

var mixer = mixitup(containerEl, {
    render: {
        target: targetTemplate
    }
});
```
###### Example 4: Returning a DOM element

```js

var mixer = mixitup(containerEl, {
    render: {
        target: function(item) {
             // Create a single element using your framework's built-in renderer

             var el = ...

             return el;
        }
    }
});
```


# mixitup.Config.animation

## Overview

A group of configurable properties relating to MixItUp's animation and effects options.


## Members

### <a id="mixitup.Config.animation#enable">mixitup.Config.animation.enable</a>




A boolean dictating whether or not animation should be enabled for the MixItUp instance.
If `false`, all operations will occur instantly and syncronously, although callback
functions and any returned promises will still be fulfilled.


|Type | Default
|---  | ---
|`boolean`| `true`

> Example: Create a mixer with all animations disabled

```js
var mixer = mixitup(containerEl, {
    animation: {
        enable: false
    }
});
```

### <a id="mixitup.Config.animation#effects">mixitup.Config.animation.effects</a>




A string of one or more space-seperated properties to which transitions will be
applied for all filtering animations.

properties can be listed any order or combination, although they will be applied in a specific
predefined order to produce consistent results.

For more information about the available effects, please see our tutorial on customising
MixItUp's animation options, or experiment with our sandbox demo.


|Type | Default
|---  | ---
|`string`| `'fade scale'`

> Example: Apply "fade" and "translateZ" effects to all animations

```js
// As targets are filtered in and out, they will fade between opacity 1 and 0 and
// transform between translateZ(-100px) and translateZ(0).

var mixer = mixitup(containerEl, {
    animation: {
        effects: 'fade translateZ(-100px)'
    }
});
```

### <a id="mixitup.Config.animation#effectsIn">mixitup.Config.animation.effectsIn</a>




A string of one or more space-seperated effects to be applied only to filter-in
animations, overriding `config.animation.effects` if set.


|Type | Default
|---  | ---
|`string`| `''`

> Example: Apply downwards vertical translate to targets being filtered in

```js

var mixer = mixitup(containerEl, {
    animation: {
        effectsIn: 'fade translateY(-100%)'
    }
});
```

### <a id="mixitup.Config.animation#effectsOut">mixitup.Config.animation.effectsOut</a>




A string of one or more space-seperated effects to be applied only to filter-out
animations, overriding `config.animation.effects` if set.


|Type | Default
|---  | ---
|`string`| `''`

> Example: Apply upwards vertical translate to targets being filtered out

```js

var mixer = mixitup(containerEl, {
    animation: {
        effectsIn: 'fade translateY(-100%)'
    }
});
```

### <a id="mixitup.Config.animation#duration">mixitup.Config.animation.duration</a>




An integer dictating the duration of all MixItUp animations in milliseconds, not
including any additional delay apllied via the `'stagger'` effect.


|Type | Default
|---  | ---
|`number`| `600`

> Example: Apply an animation duration of 200ms to all mixitup animations

```js

var mixer = mixitup(containerEl, {
    animation: {
        duration: 200
    }
});
```

### <a id="mixitup.Config.animation#easing">mixitup.Config.animation.easing</a>




A valid CSS3 transition-timing function or shorthand. For a full list of accepted
values, visit <a href="http://easings.net" target="_blank">easings.net</a>.


|Type | Default
|---  | ---
|`string`| `'ease'`

> Example 1: Apply "ease-in-out" easing to all animations

```js

var mixer = mixitup(containerEl, {
    animation: {
        easing: 'ease-in-out'
    }
});
```
> Example 2: Apply a custom "cubic-bezier" easing function to all animations

```js
var mixer = mixitup(containerEl, {
    animation: {
        easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
    }
});
```

### <a id="mixitup.Config.animation#applyPerspective">mixitup.Config.animation.applyPerspective</a>




A boolean dictating whether or not to apply perspective to the MixItUp container
during animations. By default, perspective is always applied and creates the
illusion of three-dimensional space for effects such as `translateZ`, `rotateX`,
and `rotateY`.

You may wish to disable this and define your own perspective settings via CSS.


|Type | Default
|---  | ---
|`bolean`| `true`

> Example: Prevent perspective from being applied to any 3D transforms

```js
var mixer = mixitup(containerEl, {
    animation: {
        applyPerspective: false
    }
});
```

### <a id="mixitup.Config.animation#perspectiveDistance">mixitup.Config.animation.perspectiveDistance</a>




The perspective distance value to be applied to the container during animations,
affecting any 3D-transform-based effects.


|Type | Default
|---  | ---
|`string`| `'3000px'`

> Example: Set a perspective distance of 2000px

```js
var mixer = mixitup(containerEl, {
    animation: {
        effects: 'rotateY(-25deg)',
        perspectiveDistance: '2000px'
    }
});
```

### <a id="mixitup.Config.animation#perspectiveOrigin">mixitup.Config.animation.perspectiveOrigin</a>




The perspective-origin value to be applied to the container during animations,
affecting any 3D-transform-based effects.


|Type | Default
|---  | ---
|`string`| `'50% 50%'`

> Example: Set a perspective origin in the top-right of the container

```js
var mixer = mixitup(containerEl, {
    animation: {
        effects: 'transateZ(-200px)',
        perspectiveOrigin: '100% 0'
    }
});
```

### <a id="mixitup.Config.animation#queue">mixitup.Config.animation.queue</a>




A boolean dictating whether or not to enable the queuing of operations.

If `true` (default), and a control is clicked or an API call is made while another
operation is progress, the operation will go into the queue and will be automatically exectuted
when the previous operaitons is finished.

If `false`, any requested operations will be ignored, and the `onMixBusy` callback and `mixBusy`
event will be fired. If `debug.showWarnings` is enabled, a console warning will also occur.


|Type | Default
|---  | ---
|`boolean`| `true`

> Example: Disable queuing

```js
var mixer = mixitup(containerEl, {
    animation: {
        queue: false
    }
});
```

### <a id="mixitup.Config.animation#queueLimit">mixitup.Config.animation.queueLimit</a>




An integer dictacting the maximum number of operations allowed in the queue at
any time, when queuing is enabled.


|Type | Default
|---  | ---
|`number`| `3`

> Example: Allow a maximum of 5 operations in the queue at any time

```js
var mixer = mixitup(containerEl, {
    animation: {
        queueLimit: 5
    }
});
```

### <a id="mixitup.Config.animation#animateResizeContainer">mixitup.Config.animation.animateResizeContainer</a>




A boolean dictating whether or not to transition the height and width of the
container as elements are filtered in and out. If disabled, the container height
will change abruptly.

It may be desirable to disable this on mobile devices as the CSS `height` and
`width` properties do not receive GPU-acceleration and can therefore cause stuttering.


|Type | Default
|---  | ---
|`boolean`| `true`

> Example 1: Disable the transitioning of the container height and/or width

```js
var mixer = mixitup(containerEl, {
    animation: {
        animateResizeContainer: false
    }
});
```
> Example 2: Disable the transitioning of the container height and/or width for mobile devices only

```js
var mixer = mixitup(containerEl, {
    animation: {
        animateResizeContainer: myFeatureTests.isMobile ? false : true
    }
});
```

### <a id="mixitup.Config.animation#animateResizeTargets">mixitup.Config.animation.animateResizeTargets</a>




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

> Example: Enable the transitioning of target widths and heights

```js
var mixer = mixitup(containerEl, {
    animation: {
        animateResizeTargets: true
    }
});
```

### <a id="mixitup.Config.animation#staggerSequence">mixitup.Config.animation.staggerSequence</a>




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

> Example 1: Stagger target elements by column in a 3-column grid

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
> Example 2: Using an algorithm to produce a more complex sequence

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

### <a id="mixitup.Config.animation#reverseOut">mixitup.Config.animation.reverseOut</a>




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

> Example: Reverse the desired direction on any translate/rotate effect for targets being filtered out

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

### <a id="mixitup.Config.animation#nudge">mixitup.Config.animation.nudge</a>




A boolean dictating whether or not to "nudge" the animation path of targets
when they are being filtered in and out simulatenously.

This has been the default behavior of MixItUp since version 1, but it
may be desirable to disable this effect when filtering directly from
one exclusive set of targets to a different exclusive set of targets,
to create a carousel-like effect, or a generally more subtle animation.


|Type | Default
|---  | ---
|`boolean`| `true`

> Example: Disable the "nudging" of targets being filtered in and out simulatenously

```js

var mixer = mixitup(containerEl, {
    animation: {
        nudge: false
    }
});
```


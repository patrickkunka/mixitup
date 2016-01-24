# mixitup.Config.animation

## Overview

A group of configurable properties related to MixItUp's animation and effects options.

## Members

### <a id="mixitup.Config.animation#enable">mixitup.Config.animation.enable</a>



A boolean dictating whether or not animation should be enabled for the MixItUp instance.
If `false`, all operations will occur instantly and syncronously, although callback
functions and any returned promises will still be fulfilled.





### <a id="mixitup.Config.animation#effects">mixitup.Config.animation.effects</a>



A string of one or more space-seperated effects to which transitions will be
applied for all filtering animations.

The available properties are `'fade'`,
`'scale'`, `'translateX'`, `'translateY'`, `'translateZ'`, `'rotateX'`, `'rotateY'`,
`'rotateZ'` and `'stagger'`, and can be listed any order or combination, although
they will be applied in a specific predefined order to produce consistent results.

Each effect maps directly to the CSS transform of the same name with the exception
of `'fade'` which maps to `'opacity'`, and `'stagger'` which maps to an incremental
'`transition-delay'` value based on the index of the target in the filter
or sort animation.

Effects may be followed by an optional value in parenthesis dictating the maximum
tween value of the effect in the appropriate units (e.g. `'fade(0.5) translateX(-10%) stagger(40ms)'`).
Experiment with the home page sandbox to find the perfect combination of
effects for your project.





### <a id="mixitup.Config.animation#effectsIn">mixitup.Config.animation.effectsIn</a>



A string of one or more space-seperated effects to be applied only to filter-in
animations, overriding `config.animation.effects` if set.





### <a id="mixitup.Config.animation#effectsIn">mixitup.Config.animation.effectsIn</a>



A string of one or more space-seperated effects to be applied only to filter-out
animations, overriding `config.animation.effects` if set.





### <a id="mixitup.Config.animation#duration">mixitup.Config.animation.duration</a>



An integer dictating the duration of all MixItUp animations in milliseconds, not
including any additional delay apllied via the `'stagger'` effect.





### <a id="mixitup.Config.animation#easing">mixitup.Config.animation.easing</a>



A valid CSS3 transition-timing function or shorthand. For a full list of accepted
values, check out easings.net.





### <a id="mixitup.Config.animation#perspectiveDistance">mixitup.Config.animation.perspectiveDistance</a>



The perspective value in CSS units applied to the container during animations,
affecting any 3D-transform-based effects.





### <a id="mixitup.Config.animation#perspectiveOrigin">mixitup.Config.animation.perspectiveOrigin</a>



The perspective-origin value applied to the container during animations,
affecting any 3D-transform-based effects.





### <a id="mixitup.Config.animation#queue">mixitup.Config.animation.queue</a>



A boolean dictating whether or not to enable queuing for all operations received
while an another operation is in progress. If `false`, any requested operations will
be ignored, and the `onMixBusy` callback and `mixBusy` event will be fired. If
debugging is enabled, a console warning will also occur.





### <a id="mixitup.Config.animation#queueLimit">mixitup.Config.animation.queueLimit</a>



An integer dictacting the maximum number of operations allowed in the queue at
any time, when queuing is enabled.





### <a id="mixitup.Config.animation#animateChangeLayout">mixitup.Config.animation.animateChangeLayout</a>



A boolean dictating whether or not to attempt transitioning of target elements
during layout change operations. Depending on the differences in styling between
layouts this may produce undesirable results and is therefore disabled by default.





### <a id="mixitup.Config.animation#animateResizeContainer">mixitup.Config.animation.animateResizeContainer</a>



A boolean dictating whether or not to transition the height and width of the
container as elements are filtered in and out. If disabled, the container height
will change abruptly.

It may be desirable to disable this on mobile devices where the CSS `height` and
`width` properties do not receive GPU-acceleration.





### <a id="mixitup.Config.animation#animateResizeTargets">mixitup.Config.animation.animateResizeTargets</a>



A boolean dictating whether or not to transition the height and width of target
elements as they change throughout the course of an animation.

This is specifically aimed at flex-box layouts where the size of target elements
may change depending on final their position in relation to their siblings, and
is therefore disabled by default.

This feature requires additional calculations and DOM manipulation which may
adversely affect performance on slower devices.





### <a id="mixitup.Config.animation#staggerSequence">mixitup.Config.animation.staggerSequence</a>



A custom function used to manipulate the order in which the stagger delay is
incremented when using the ‘stagger’ effect. It can be used to create engaging
non-linear staggering.

The function receives the index of the target element as a parameter, and must
return an integer which serves as the multiplier for the stagger delay.





### <a id="mixitup.Config.animation#reverseOut">mixitup.Config.animation.reverseOut</a>



A boolean dictating whether or not to reverse the direction of `translate`
and `rotate` transforms for elements being filtered out.

It can be used to create engaging carousel-like animations
where elements enter and exit from opposite directions. If enabled, the
effect `translateX(-100%)` for elements being filtered in would become
`translateX(100%)` for targets being filtered out.

This functionality can also be achieved by providing seperate effects
strings for `config.animation.effectsIn` and `config.animation.effectsOut`.





### <a id="mixitup.Config.animation#nudgeOut">mixitup.Config.animation.nudgeOut</a>



A boolean dictating whether or not to "nudge" the animation path of target
elements depending on their intermediate position in the layout.

This has been the default behavior of MixItUp since version 1, but it
may be desirable to disable this effect when filtering directly from
one exclusive set of targets to a different exclusive set of targets,
to create a carousel-like effect.





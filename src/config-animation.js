/* global mixitup, h */

/**
 * A group of properties defining the mixer's animation and effects settings.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        animation
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigAnimation = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /**
     * A boolean dictating whether or not animation should be enabled for the MixItUp instance.
     * If `false`, all operations will occur instantly and syncronously, although callback
     * functions and any returned promises will still be fulfilled.
     *
     * @example <caption>Example: Create a mixer with all animations disabled</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         enable: false
     *     }
     * });
     *
     * @name        enable
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.enable = true;

    /**
     * A string of one or more space-seperated properties to which transitions will be
     * applied for all filtering animations.
     *
     * Properties can be listed any order or combination, although they will be applied in a specific
     * predefined order to produce consistent results.
     *
     * To learn more about available effects, experiment with our <a href="https://www.kunkalabs.com/mixitup/">
     * sandbox demo</a> and try out the "Export config" button in the Animation options drop down.
     *
     * @example <caption>Example: Apply "fade" and "translateZ" effects to all animations</caption>
     * // As targets are filtered in and out, they will fade between
     * // opacity 1 and 0 and transform between translateZ(-100px) and
     * // translateZ(0).
     *
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         effects: 'fade translateZ(-100px)'
     *     }
     * });
     *
     * @name        effects
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {string}
     * @default     'fade scale'
     */

    this.effects = 'fade scale';

    /**
     * A string of one or more space-seperated effects to be applied only to filter-in
     * animations, overriding `config.animation.effects` if set.
     *
     * @example <caption>Example: Apply downwards vertical translate to targets being filtered in</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         effectsIn: 'fade translateY(-100%)'
     *     }
     * });
     *
     * @name        effectsIn
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {string}
     * @default     ''
     */

    this.effectsIn = '';

    /**
     * A string of one or more space-seperated effects to be applied only to filter-out
     * animations, overriding `config.animation.effects` if set.
     *
     * @example <caption>Example: Apply upwards vertical translate to targets being filtered out</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         effectsOut: 'fade translateY(-100%)'
     *     }
     * });
     *
     * @name        effectsOut
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {string}
     * @default     ''
     */

    this.effectsOut = '';

    /**
     * An integer dictating the duration of all MixItUp animations in milliseconds, not
     * including any additional delay apllied via the `'stagger'` effect.
     *
     * @example <caption>Example: Apply an animation duration of 200ms to all mixitup animations</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         duration: 200
     *     }
     * });
     *
     * @name        duration
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {number}
     * @default     600
     */

    this.duration = 600;

    /**
     * A valid CSS3 transition-timing function or shorthand. For a full list of accepted
     * values, visit <a href="http://easings.net" target="_blank">easings.net</a>.
     *
     * @example <caption>Example 1: Apply "ease-in-out" easing to all animations</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         easing: 'ease-in-out'
     *     }
     * });
     *
     * @example <caption>Example 2: Apply a custom "cubic-bezier" easing function to all animations</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
     *     }
     * });
     *
     * @name        easing
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {string}
     * @default     'ease'
     */

    this.easing = 'ease';

    /**
     * A boolean dictating whether or not to apply perspective to the MixItUp container
     * during animations. By default, perspective is always applied and creates the
     * illusion of three-dimensional space for effects such as `translateZ`, `rotateX`,
     * and `rotateY`.
     *
     * You may wish to disable this and define your own perspective settings via CSS.
     *
     * @example <caption>Example: Prevent perspective from being applied to any 3D transforms</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         applyPerspective: false
     *     }
     * });
     *
     * @name        applyPerspective
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {bolean}
     * @default     true
     */

    this.applyPerspective = true;

    /**
     * The perspective distance value to be applied to the container during animations,
     * affecting any 3D-transform-based effects.
     *
     * @example <caption>Example: Set a perspective distance of 2000px</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         effects: 'rotateY(-25deg)',
     *         perspectiveDistance: '2000px'
     *     }
     * });
     *
     * @name        perspectiveDistance
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {string}
     * @default     '3000px'
     */

    this.perspectiveDistance = '3000px';

    /**
     * The perspective-origin value to be applied to the container during animations,
     * affecting any 3D-transform-based effects.
     *
     * @example <caption>Example: Set a perspective origin in the top-right of the container</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         effects: 'transateZ(-200px)',
     *         perspectiveOrigin: '100% 0'
     *     }
     * });
     *
     * @name        perspectiveOrigin
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {string}
     * @default     '50% 50%'
     */

    this.perspectiveOrigin = '50% 50%';

    /**
     * A boolean dictating whether or not to enable the queuing of operations.
     *
     * If `true` (default), and a control is clicked or an API call is made while another
     * operation is progress, the operation will go into the queue and will be automatically exectuted
     * when the previous operaitons is finished.
     *
     * If `false`, any requested operations will be ignored, and the `onMixBusy` callback and `mixBusy`
     * event will be fired. If `debug.showWarnings` is enabled, a console warning will also occur.
     *
     * @example <caption>Example: Disable queuing</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         queue: false
     *     }
     * });
     *
     * @name        queue
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.queue = true;

    /**
     * An integer dictacting the maximum number of operations allowed in the queue at
     * any time, when queuing is enabled.
     *
     * @example <caption>Example: Allow a maximum of 5 operations in the queue at any time</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         queueLimit: 5
     *     }
     * });
     *
     * @name        queueLimit
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {number}
     * @default     3
     */

    this.queueLimit = 3;

    /**
     * A boolean dictating whether or not to transition the height and width of the
     * container as elements are filtered in and out. If disabled, the container height
     * will change abruptly.
     *
     * It may be desirable to disable this on mobile devices as the CSS `height` and
     * `width` properties do not receive GPU-acceleration and can therefore cause stuttering.
     *
     * @example <caption>Example 1: Disable the transitioning of the container height and/or width</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         animateResizeContainer: false
     *     }
     * });
     *
     * @example <caption>Example 2: Disable the transitioning of the container height and/or width for mobile devices only</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         animateResizeContainer: myFeatureTests.isMobile ? false : true
     *     }
     * });
     *
     * @name        animateResizeContainer
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.animateResizeContainer = true;

    /**
     * A boolean dictating whether or not to transition the height and width of target
     * elements as they change throughout the course of an animation.
     *
     * This is often a must for flex-box grid layouts where the size of target elements may change
     * depending on final their position in relation to their siblings, or for `.changeLayout()`
     * operations where the size of targets change between layouts.
     *
     * NB: This feature requires additional calculations and manipulation to non-hardware-accelerated
     * properties which may adversely affect performance on slower devices, and is therefore
     * disabled by default.
     *
     * @example <caption>Example: Enable the transitioning of target widths and heights</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         animateResizeTargets: true
     *     }
     * });
     *
     * @name        animateResizeTargets
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.animateResizeTargets = false;

    /**
     * A custom function used to manipulate the order in which the stagger delay is
     * incremented when using the ‘stagger’ effect.
     *
     * When using the 'stagger' effect, the delay applied to each target element is incremented
     * based on its index. You may create a custom function to manipulate the order in which the
     * delay is incremented and create engaging non-linear stagger effects.
     *
     * The function receives the index of the target element as a parameter, and must
     * return an integer which serves as the multiplier for the stagger delay.
     *
     * @example <caption>Example 1: Stagger target elements by column in a 3-column grid</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         effects: 'fade stagger(100ms)',
     *         staggerSequence: function(i) {
     *             return i % 3;
     *         }
     *     }
     * });
     *
     * @example <caption>Example 2: Using an algorithm to produce a more complex sequence</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         effects: 'fade stagger(100ms)',
     *         staggerSequence: function(i) {
     *             return (2*i) - (5*((i/3) - ((1/3) * (i%3))));
     *         }
     *     }
     * });
     *
     * @name        staggerSequence
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {function}
     * @default     null
     */

    this.staggerSequence = null;

    /**
     * A boolean dictating whether or not to reverse the direction of `translate`
     * and `rotate` transforms for elements being filtered out.
     *
     * It can be used to create carousel-like animations where elements enter and exit
     * from opposite directions. If enabled, the effect `translateX(-100%)` for elements
     * being filtered in would become `translateX(100%)` for targets being filtered out.
     *
     * This functionality can also be achieved by providing seperate effects
     * strings for `config.animation.effectsIn` and `config.animation.effectsOut`.
     *
     * @example <caption>Example: Reverse the desired direction on any translate/rotate effect for targets being filtered out</caption>
     * // Elements being filtered in will be translated from '100%' to '0' while
     * // elements being filtered out will be translated from 0 to '-100%'
     *
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         effects: 'fade translateX(100%)',
     *         reverseOut: true,
     *         nudge: false // Disable nudging to create a carousel-like effect
     *     }
     * });
     *
     * @name        reverseOut
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.reverseOut = false;

    /**
     * A boolean dictating whether or not to "nudge" the animation path of targets
     * when they are being filtered in and out simulatenously.
     *
     * This has been the default behavior of MixItUp since version 1, but it
     * may be desirable to disable this effect when filtering directly from
     * one exclusive set of targets to a different exclusive set of targets,
     * to create a carousel-like effect, or a generally more subtle animation.
     *
     * @example <caption>Example: Disable the "nudging" of targets being filtered in and out simulatenously</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         nudge: false
     *     }
     * });
     *
     * @name        nudge
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.nudge = true;

    /**
     * A boolean dictating whether or not to clamp the height of the container while MixItUp's
     * geometry tests are carried out before an operation.
     *
     * To prevent scroll-bar flicker, clamping is turned on by default. But in the case where the
     * height of the container might affect its vertical positioning in the viewport
     * (e.g. a vertically-centered container), this should be turned off to ensure accurate
     * test results and a smooth animation.
     *
     * @example <caption>Example: Disable container height-clamping</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         clampHeight: false
     *     }
     * });
     *
     * @name        clampHeight
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.clampHeight = true;

    /**
     * A boolean dictating whether or not to clamp the width of the container while MixItUp's
     * geometry tests are carried out before an operation.
     *
     * To prevent scroll-bar flicker, clamping is turned on by default. But in the case where the
     * width of the container might affect its horitzontal positioning in the viewport
     * (e.g. a horizontall-centered container), this should be turned off to ensure accurate
     * test results and a smooth animation.
     *
     * @example <caption>Example: Disable container width-clamping</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         clampWidth: false
     *     }
     * });
     *
     * @name        clampWidth
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.clampWidth = true;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigAnimation);

mixitup.ConfigAnimation.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigAnimation.prototype.constructor = mixitup.ConfigAnimation;
/* global mixitup, h */

/**
 * A group of configurable properties related to MixItUp's animation and effects options.
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
     * @name        enable
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.enable = true;

    /**
     * A string of one or more space-seperated effects to which transitions will be
     * applied for all filtering animations.
     *
     * The available properties are `'fade'`, `'scale'`, `'translateX'`, `'translateY'`,
     * `'translateZ'`, `'rotateX'`, `'rotateY'`, `'rotateZ'` and `'stagger'`, and can
     * be listed any order or combination, although they will be applied in a specific
     * predefined order to produce consistent results.
     *
     * Each effect maps directly to the CSS transform of the same name with the exception
     * of `'fade'` which maps to `'opacity'`, and `'stagger'` which maps to an incremental
     * '`transition-delay'` value based on the index of the target in the filter
     * or sort animation.
     *
     * Effects may be followed by an optional value in parenthesis dictating the maximum
     * tween value of the effect in the appropriate units (e.g. `'fade(0.5) translateX(-10%) stagger(40ms)'`).
     * Experiment with the home page sandbox to find the perfect combination of
     * effects for your project.
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
     * @name        duration
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {number}
     * @default     600
     */

    this.duration = 600;

    /**
     * A valid CSS3 transition-timing function or shorthand. For a full list of accepted
     * values, check out easings.net.
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
     * @name        applyPerspective
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {bolean}
     * @default     true
     */

    this.applyPerspective = true;

    /**
     * The perspective distance value applied to the container during animations,
     * affecting any 3D-transform-based effects.
     *
     * @name        perspectiveDistance
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {string}
     * @default     '3000px'
     */

    this.perspectiveDistance = '3000px';

    /**
     * The perspective-origin value applied to the container during animations,
     * affecting any 3D-transform-based effects.
     *
     * @name        perspectiveOrigin
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {string}
     * @default     '50% 50%'
     */

    this.perspectiveOrigin = '50% 50%';

    /**
     * A boolean dictating whether or not to enable queuing for all operations received
     * while an another operation is in progress. If `false`, any requested operations will
     * be ignored, and the `onMixBusy` callback and `mixBusy` event will be fired. If
     * debugging is enabled, a console warning will also occur.
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
     * @name        queueLimit
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {number}
     * @default     3
     */

    this.queueLimit = 3;

    /**
     * A boolean dictating whether or not to attempt transitioning of target elements
     * during layout change operations. Depending on the differences in styling between
     * layouts this may produce undesirable results and is therefore disabled by default.
     *
     * @name        animateChangeLayout
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.animateChangeLayout = false;

    /**
     * A boolean dictating whether or not to transition the height and width of the
     * container as elements are filtered in and out. If disabled, the container height
     * will change abruptly.
     *
     * It may be desirable to disable this on mobile devices where the CSS `height` and
     * `width` properties do not receive GPU-acceleration.
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
     * This is specifically aimed at flex-box layouts where the size of target elements
     * may change depending on final their position in relation to their siblings, and
     * is therefore disabled by default.
     *
     * This feature requires additional calculations and DOM manipulation which may
     * adversely affect performance on slower devices.
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
     * incremented when using the ‘stagger’ effect. It can be used to create engaging
     * non-linear staggering.
     *
     * The function receives the index of the target element as a parameter, and must
     * return an integer which serves as the multiplier for the stagger delay.
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
     * It can be used to create engaging carousel-like animations
     * where elements enter and exit from opposite directions. If enabled, the
     * effect `translateX(-100%)` for elements being filtered in would become
     * `translateX(100%)` for targets being filtered out.
     *
     * This functionality can also be achieved by providing seperate effects
     * strings for `config.animation.effectsIn` and `config.animation.effectsOut`.
     *
     * @name        reverseOut
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.reverseOut = false;

    /**
     * A boolean dictating whether or not to "nudge" the animation path of target
     * elements depending on their intermediate position in the layout.
     *
     * This has been the default behavior of MixItUp since version 1, but it
     * may be desirable to disable this effect when filtering directly from
     * one exclusive set of targets to a different exclusive set of targets,
     * to create a carousel-like effect.
     *
     * @name        nudge
     * @memberof    mixitup.Config.animation
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.nudge = true;

    /**
     * A boolean dictating whether or not to account of a shift in position of the
     * container due a change in height or width.
     *
     * For example, if a vertically centered element changes height throughout the
     * course of an operation, its vertical position will change, and animation
     * calculations will be affected. Setting this property to `true` will attempt
     * to counteract these changs and maintain the desired animation.
     */

    this.balanceContainerShift = false;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigAnimation);

mixitup.ConfigAnimation.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigAnimation.prototype.constructor = mixitup.ConfigAnimation;
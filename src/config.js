/* global mixitup, h */

/**
 * `mixitup.Config` is an interface implemented by MixItUp as a means of customising
 * the functionality of an instance. It is organised into several semantically
 * distinct sub-objects, each one pertaining to a particular aspect of MixItUp functionality.
 *
 * An object literal containing any or all of the available properies,
 * known as the "configuration object", can be passed as the second parameter to
 * the `mixitup` factory function when creating a mixer instance to customise its
 * functionality as needed.
 *
 * If no configuration object is passed, the mixer instance will take on the default
 * configuration values detailed below.
 *
 * @example <caption>Example 1: Creating and passing the configuration object</caption>
 * // Firstly we create a configuration object with our desired values
 *
 * var config = {
 *     animation: {
 *         enable: false
 *     },
 *     selectors: {
 *         target: '.item'
 *     }
 * };
 *
 * // The configuration object is then passed to the mixitup factory function
 *
 * var mixer = mixitup(containerEl, config);
 *
 * @example <caption>Example 2: Passing the configuration object inline</caption>
 * // Typically, the configuration object is passed inline for terseness.
 *
 * var mixer = mixitup(containerEl, {
 *     controls: {
 *         live: true,
 *         toggleLogic: 'and'
 *     }
 * });
 *
 *
 * @constructor
 * @memberof    mixitup
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.Config = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.animation          = new mixitup.ConfigAnimation();
    this.callbacks          = new mixitup.ConfigCallbacks();
    this.controls           = new mixitup.ConfigControls();
    this.classnames         = new mixitup.ConfigClassnames();
    this.data               = new mixitup.ConfigData();
    this.debug              = new mixitup.ConfigDebug();
    this.layout             = new mixitup.ConfigLayout();
    this.load               = new mixitup.ConfigLoad();
    this.selectors          = new mixitup.ConfigSelectors();
    this.templates          = new mixitup.ConfigTemplates();

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.Config);

mixitup.Config.prototype = Object.create(mixitup.Base.prototype);

mixitup.Config.prototype.constructor = mixitup.Config;
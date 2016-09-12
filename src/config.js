/* global mixitup, h */

/**
 * The `mixitup.Config` class encompasses the full set of user-configurable
 * options for each MixItUp instance, and is organised into to several
 * semantically distinct sub-objects.
 *
 * An optional object literal containing any or all of these properies,
 * known as the "configuration object", can be passed as the second parameter to
 * the `mixitup` factory function when creating a mixer instance to customise its
 * functionality as desired.
 *
 * @example
 * // Create a configuration object with any custom values
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
 * // Pass the configuration object to the mixitup factory function to customise
 * // the functionality of your mixer.
 *
 * var mixer = mixitup(containerEl, config);
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
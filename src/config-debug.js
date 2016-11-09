/* global mixitup, h */

/**
 * A group of properties allowing the toggling of various debug features.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        debug
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigDebug = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /**
     * A boolean dictating whether or not the mixer instance returned by the
     * `mixitup()` factory function should expose private properties and methods.
     *
     * By default, mixer instances only expose their public API, but enabling
     * debug mode will give you access to various mixer internals which may aid
     * in debugging, or the authoring of extensions.
     *
     * @example <caption>Example: Enabling debug mode</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     debug: {
     *         enable: true
     *     }
     * });
     *
     * // Private properties and methods will now be visible on the mixer instance:
     *
     * console.log(mixer);
     *
     * @name        enable
     * @memberof    mixitup.Config.debug
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.enable = false;

    /**
     * A boolean dictating whether or not warnings should be shown when various
     * common gotchas occur.
     *
     * Warnings are intended to provide insights during development when something
     * occurs that is not a fatal, but may indicate an issue with your integration,
     * and are therefore turned on by default. However, you may wish to disable
     * them in production.
     *
     * @example <caption>Example 1: Disabling warnings</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     debug: {
     *         showWarnings: false
     *     }
     * });
     *
     * @example <caption>Example 2: Disabling warnings based on environment</caption>
     *
     * var showWarnings = myAppConfig.environment === 'development' ? true : false;
     *
     * var mixer = mixitup(containerEl, {
     *     debug: {
     *         showWarnings: showWarnings
     *     }
     * });
     *
     * @name        showWarnings
     * @memberof    mixitup.Config.debug
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.showWarnings = true;

    /**
     * Used for server-side testing only.
     *
     * @private
     * @name        fauxAsync
     * @memberof    mixitup.Config.debug
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.fauxAsync = false;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigDebug);

mixitup.ConfigDebug.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigDebug.prototype.constructor = mixitup.ConfigDebug;
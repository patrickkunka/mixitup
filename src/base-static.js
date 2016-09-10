/* global mixitup, h */

/**
 * The BaseStatic class exposes a set of static methods which all other MixItUp
 * classes inherit as a means of integrating extensions via the addition of new
 * methods and/or actions and hooks.
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @public
 * @since       3.0.0
 */

mixitup.BaseStatic = function() {
    this.actions = {};
    this.filters = {};

    /**
     * Performs a shallow extend on the class's prototype, enabling the addition of
     * multiple new members to the class in a single operation.
     *
     * @memberof    mixitup.BaseStatic
     * @public
     * @static
     * @since       2.1.0
     * @param       {object} extension
     * @return      {void}
     */

    this.extend = function(extension) {
        h.extend(this.prototype, extension);
    };

    /**
     * Registers an action function to be executed at a predefined hook.
     *
     * @memberof    mixitup.BaseStatic
     * @public
     * @static
     * @since       2.1.0
     * @param       {string}    hookName
     * @param       {string}    extensionName
     * @param       {function}  func
     * @return      {void}
     */

    this.registerAction = function(hookName, extensionName, func) {
        (this.actions[hookName] = this.actions[hookName] || {})[extensionName] = func;
    };

    /**
     * Registers a filter function to be executed at a predefined hook.
     *
     * @memberof    mixitup.BaseStatic
     * @public
     * @static
     * @since       2.1.0
     * @param       {string}    hookName
     * @param       {string}    extensionName
     * @param       {function}  func
     * @return      {void}
     */

    this.registerFilter = function(hookName, extensionName, func) {
        (this.filters[hookName] = this.filters[hookName] || {})[extensionName] = func;
    };
};
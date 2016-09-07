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
     * @param       {string}    hook
     * @param       {string}    name
     * @param       {function}  func
     * @param       {number}    priority
     * @return      {void}
     */

    this.addAction = function(hook, name, func, priority) {
        this.addHook('actions', hook, name, func, priority);
    };

    /**
     * Registers a filter function to be executed at a predefined hook.
     *
     * @memberof    mixitup.BaseStatic
     * @public
     * @static
     * @since       2.1.0
     * @param       {string}    hook
     * @param       {string}    name
     * @param       {function}  func
     * @return      {void}
     */

    this.addFilter = function(hook, name, func) {
        this.addHook('filters', hook, name, func);
    };

    /**
     * Registers a filter or action to be executed at a predefined hook. The
     * lower-level call used by `addAction` and `addFiler`.
     *
     * @memberof    mixitup.BaseStatic
     * @private
     * @static
     * @since       2.1.0
     * @param       {string}    type
     * @param       {string}    hook
     * @param       {string}    name
     * @param       {function}  func
     * @param       {number}    priority
     * @return      {void}
     */

    this.addHook = function(type, hook, name, func, priority) {
        var collection = this[type];

        priority = (priority === 1 || priority === 'post') ? 'post' : 'pre';

        collection[hook]                   = collection[hook] || {};
        collection[hook][priority]         = collection[hook][priority] || {};
        collection[hook][priority][name]   = func;
    };
};
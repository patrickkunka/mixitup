/* global mixitup, h */

/**
 * The BasePrototype class exposes a set of static methods which all other MixItUp
 * classes inherit as a means of integrating extensions via the addition of new
 * methods and/or actions and hooks.
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @public
 * @since       3.0.0
 */

mixitup.BasePrototype = function() {
    this._actions = {};
    this._filters = {};
};

mixitup.BasePrototype.prototype =
/** @lends mixitup.BasePrototype */
{
    constructor: mixitup.BasePrototype,

    /**
     * Performs a shallow extend on the class's prototype, enabling the addition of
     * multiple new members to the class in a single operation.
     *
     * @memberof    mixitup.BasePrototype
     * @public
     * @static
     * @since       2.1.0
     * @param       {object} extension
     * @return      {void}
     */

    extend: function(extension) {
        var key = '';

        // TODO: make the h extend helper method more robust with deep/shallow flag,
        // and call here as shallow

        for (key in extension) {
            if (extension[key]) {
                this[key] = extension[key];
            }
        }
    },

    /**
     * Registers an action function to be executed at a predefined hook.
     *
     * @memberof    mixitup.BasePrototype
     * @public
     * @static
     * @since       2.1.0
     * @param       {string}    hook
     * @param       {string}    name
     * @param       {function}  func
     * @param       {number}    priority
     * @return      {void}
     */

    addAction: function(hook, name, func, priority) {
        this._addHook('_actions', hook, name, func, priority);
    },

    /**
     * Registers a filter function to be executed at a predefined hook.
     *
     * @memberof    mixitup.BasePrototype
     * @public
     * @static
     * @since       2.1.0
     * @param       {string}    hook
     * @param       {string}    name
     * @param       {function}  func
     * @return      {void}
     */

    addFilter: function(hook, name, func) {
        this._addHook('_filters', hook, name, func);
    },

    /**
     * Registers a filter or action to be executed at a predefined hook. The
     * lower-level call used by `addAction` and `addFiler`.
     *
     * @memberof    mixitup.BasePrototype
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

    _addHook: function(type, hook, name, func, priority) {
        var collection  = this[type],
            obj         = {};

        priority = (priority === 1 || priority === 'post') ? 'post' : 'pre';

        obj[hook]                   = {};
        obj[hook][priority]         = {};
        obj[hook][priority][name]   = func;

        h.extend(collection, obj);
    },

    /**
     * Executes any registered actions for the respective hook.
     *
     * @memberof    mixitup.BasePrototype
     * @private
     * @static
     * @since       2.0.0
     * @param       {string}    methodName
     * @param       {boolean}   isPost
     * @param       {Array<*>}  args
     * @return      {void}
     */

    _execAction: function(methodName, isPost, args) {
        var self    = this,
            key     = '',
            context = isPost ? 'post' : 'pre';

        if (!self._actions.isEmptyObject && self._actions.hasOwnProperty(methodName)) {
            for (key in self._actions[methodName][context]) {
                self._actions[methodName][context][key].call(self, args);
            }
        }
    },

    /**
     * Executes any registered filters for the respective hook.
     *
     * @memberof    mixitup.BasePrototype
     * @private
     * @static
     * @since       2.0.0
     * @param       {string}    methodName
     * @param       {*}         value
     * @param       {Array<*>}  args
     * @return      {*}
     */

    _execFilter: function(methodName, value, args) {
        var self    = this,
            key     = '';

        if (!self._filters.isEmptyObject && self._filters.hasOwnProperty(methodName)) {
            for (key in self._filters[methodName].pre) {
                return self._filters[methodName].pre[key].call(self, value, args);
            }
        } else {
            return value;
        }
    }
};
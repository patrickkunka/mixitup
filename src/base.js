/* global mixitup, h */

/**
 * The Base class adds instance methods to all other extensible MixItUp classes,
 * enabling the execution of previously registered hooks.
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @public
 * @since       3.0.0
 */

mixitup.Base = function() {};

mixitup.Base.prototype = {
    constructor: mixitup.Base,

    /**
     * Executes any registered actions for the respective hook.
     *
     * @memberof    mixitup.Base
     * @private
     * @instance
     * @since       2.0.0
     * @param       {string}    methodName
     * @param       {boolean}   isPost
     * @param       {Array<*>}  args
     * @return      {void}
     */

    execAction: function(methodName, isPost, args) {
        var self    = this,
            key     = '',
            context = isPost ? 'post' : 'pre';

        if (!h.isEmptyObject(self.constructor._actions) && self.constructor._actions.hasOwnProperty(methodName)) {
            for (key in self.constructor._actions[methodName][context]) {
                self.constructor._actions[methodName][context][key].apply(self, args);
            }
        }
    },

    /**
     * Executes any registered filters for the respective hook.
     *
     * @memberof    mixitup.Base
     * @private
     * @instance
     * @since       2.0.0
     * @param       {string}    methodName
     * @param       {*}         value
     * @param       {Array<*>}  args
     * @return      {*}
     */

    execFilter: function(methodName, value, args) {
        var self    = this,
            key     = '';

        if (!h.isEmptyObject(self.constructor._filters) && self.constructor._filters.hasOwnProperty(methodName)) {
            for (key in self.constructor._filters[methodName].pre) {
                args = Array.prototype.slice.call(args);

                args.unshift(value);

                return self.constructor._filters[methodName].pre[key].apply(self, args);
            }
        } else {
            return value;
        }
    }
};
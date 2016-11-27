/* global mixitup, h */

/**
 * The Base class adds instance methods to all other extensible MixItUp classes,
 * enabling the calling of any registered hooks.
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.Base = function() {};

mixitup.Base.prototype = {
    constructor: mixitup.Base,

    /**
     * Calls any registered hooks for the provided action.
     *
     * @memberof    mixitup.Base
     * @private
     * @instance
     * @since       2.0.0
     * @param       {string}    actionName
     * @param       {Array<*>}  args
     * @return      {void}
     */

    callActions: function(actionName, args) {
        var self            = this,
            hooks           = self.constructor.actions[actionName],
            extensionName   = '';

        if (!hooks || h.isEmptyObject(hooks)) return;

        for (extensionName in hooks) {
            hooks[extensionName].apply(self, args);
        }
    },

    /**
     * Calls any registered hooks for the provided filter.
     *
     * @memberof    mixitup.Base
     * @private
     * @instance
     * @since       2.0.0
     * @param       {string}    filterName
     * @param       {*}         input
     * @param       {Array<*>}  args
     * @return      {*}
     */

    callFilters: function(filterName, input, args) {
        var self            = this,
            hooks           = self.constructor.filters[filterName],
            output          = input,
            extensionName   = '';

        if (!hooks || h.isEmptyObject(hooks)) return output;

        args = args || [];

        for (extensionName in hooks) {
            args = h.arrayFromList(args);

            args.unshift(output);

            output = hooks[extensionName].apply(self, args);
        }

        return output;
    }
};
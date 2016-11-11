/* global mixitup, h */

/**
 * A jQuery-collection-like wrapper around one or more `mixitup.Mixer` instances
 * allowing simultaneous control of said instances similar to the MixItUp 2 API.
 *
 * @example
 * new mixitup.Collection(instances)
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 * @param       {mixitup.Mixer[]}   instances
 */

mixitup.Collection = function(instances) {
    var instance    = null,
        i           = -1;

    this.callActions('beforeConstruct');

    for (i = 0; instance = instances[i]; i++) {
        this[i] = instance;
    }

    this.length = instances.length;

    this.callActions('afterConstruct');

    h.freeze(this);
};

mixitup.BaseStatic.call(mixitup.Collection);

mixitup.Collection.prototype = Object.create(mixitup.Base.prototype);

h.extend(mixitup.Collection.prototype,
/** @lends mixitup.Collection */
{
    constructor: mixitup.Collection,

    /**
     * Calls a method on all instances in the collection by passing the method
     * name as a string followed by any applicable parameters to be curried into
     * to the method.
     *
     * @example
     * .mixitup(methodName[,arg1][,arg2..]);
     *
     * @example
     * var collection = new Collection([mixer1, mixer2]);
     *
     * return collection.mixitup('filter', '.category-a')
     *     .then(function(states) {
     *         state.forEach(function(state) {
     *             console.log(state.activeFilter.selector); // .category-a
     *         });
     *     });
     *
     * @public
     * @instance
     * @since       3.0.0
     * @param       {string}  methodName
     * @return      {Promise<Array<mixitup.State>>}
     */

    mixitup: function(methodName) {
        var self        = this,
            instance    = null,
            args        = Array.prototype.slice.call(arguments),
            tasks       = [],
            i           = -1;

        this.callActions('beforeMixitup');

        args.shift();

        for (i = 0; instance = self[i]; i++) {
            tasks.push(instance[methodName].apply(instance, args));
        }

        return self.callFilters('promiseMixitup', h.all(tasks, mixitup.libraries), arguments);
    }
});
/* global mixitup, h */

/**
 * A jQuery collection-like wrapper around one or more `mixitup.Mixer` instances
 * allowing simultaneous control of said instances similar to the MixItUp 2 API.
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @public
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
/** @lends mixitup.Mixer */
{
    constructor: mixitup.Collection,

    /**
     * Calls a public method on all instances in the collection by passing the method
     * name as a string followed by any applicable parameters.
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
            libraries   = self[0].config.libraries,
            tasks       = [],
            i           = -1;

        this.callActions('beforeMixitup');

        args.shift();

        for (i = 0; instance = self[i]; i++) {
            tasks.push(instance[methodName].apply(instance, args));
        }

        return self.callFilters('promiseMixitup', h.all(libraries, tasks), arguments);
    }
});
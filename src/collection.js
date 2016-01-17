/* global mixitup, h */

/**
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

    for (i = 0; instance = instances[i]; i++) {
        this[i] = instance;
    }

    this.length = instances.length;
};

/**
 * Provides a jQueryUI-like API for controlling one or more MixItUp instances.
 *
 * @memberof    mixitup.Collection
 * @public
 * @instance
 * @since       3.0.0
 * @param       {string}            methodName
 * @return      {Promise}
 */

mixitup.Collection.prototype.do = function(methodName) {
    var self        = this,
        instance    = null,
        args        = Array.prototype.slice.call(arguments),
        tasks       = [],
        q           = null,
        i           = -1;

    args.shift();

    for (i = 0; instance = self[i]; i++) {
        if (!q && instance.libraries.q) {
            q = instance.libraries.q;
        }

        tasks.push(instance[methodName].apply(instance, args));
    }

    if (q) {
        return q.all(tasks);
    } else if (mixitup.Mixer.prototype._has._promises) {
        return Promise.all(tasks);
    }
};
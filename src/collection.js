/* global mixitup */

/**
 * A jQuery-like wrapper object for one or more `mixitup.Mixer` instances
 * allowing simultaneous control of multiple instances.
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

    for (i = 0; instance = instances[i]; i++) {
        this[i] = instance;
    }

    this.length = instances.length;
};

/**
 * A jQueryUI-like API for calling a method on all instances in the collection
 * by passing the method name as a string followed by an neccessary parameters.
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
        i           = -1;

    args.shift();

    for (i = 0; instance = self[i]; i++) {
        tasks.push(instance[methodName].apply(instance, args));
    }

    if (mixitup.features.has.promises) {
        return Promise.all(tasks);
    }
};
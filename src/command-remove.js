/* global mixitup, h */

/**
 * An object into which all arbitrary arguments sent to '.remove()' are mapped.
 *
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.CommandRemove = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.targets    = [];
    this.collection = [];

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.CommandRemove);

mixitup.CommandRemove.prototype = Object.create(mixitup.Base.prototype);

mixitup.CommandRemove.prototype.constructor = mixitup.CommandRemove;
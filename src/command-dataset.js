/* global mixitup, h */

/**
 * An object into which all arbitrary arguments sent to '.dataset()' are mapped.
 *
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.CommandDataset = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.dataset = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.CommandDataset);

mixitup.CommandDataset.prototype = Object.create(mixitup.Base.prototype);

mixitup.CommandDataset.prototype.constructor = mixitup.CommandDataset;
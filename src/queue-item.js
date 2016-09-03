/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.QueueItem = function() {
    mixitup.Base.call(this);

    this.execAction('construct', 0);

    this.args           = [];
    this.instruction    = null;
    this.trigger        = null;
    this.deferred       = null;
    this.isToggling     = false;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.QueueItem);

mixitup.QueueItem.prototype = Object.create(mixitup.Base.prototype);

mixitup.QueueItem.prototype.constructor = mixitup.QueueItem;
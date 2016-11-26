/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.QueueItem = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.args           = [];
    this.instruction    = null;
    this.triggerElement = null;
    this.deferred       = null;
    this.isToggling     = false;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.QueueItem);

mixitup.QueueItem.prototype = Object.create(mixitup.Base.prototype);

mixitup.QueueItem.prototype.constructor = mixitup.QueueItem;
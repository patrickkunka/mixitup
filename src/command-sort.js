/* global mixitup, h */

/**
 * An object into which all arbitrary arguments sent to '.sort()' are mapped.
 *
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.CommandSort = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.sortString = '';
    this.attribute  = '';
    this.order      = 'asc';
    this.collection = null;
    this.next       = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.CommandSort);

mixitup.CommandSort.prototype = Object.create(mixitup.Base.prototype);

mixitup.CommandSort.prototype.constructor = mixitup.CommandSort;
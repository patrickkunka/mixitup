/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigSelectors = function() {
    this._execAction('constructor', 0);

    this.target         = '.mix';
    this.filter         = '.filter';
    this.filterToggle   = '.filter-toggle';
    this.multiMix       = '.multi-mix';
    this.sort           = '.sort';

    this._execAction('constructor', 1);

    h.seal(this);
};

mixitup.ConfigSelectors.prototype = new mixitup.BasePrototype();
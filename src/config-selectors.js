/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @memberof    mixitup.Config
 * @name        selectors
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigSelectors = function() {
    this.execAction('construct', 0);

    this.target         = '.mix';
    this.control        = '.mixitup-control';

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.ConfigSelectors.prototype = Object.create(new mixitup.BasePrototype());

mixitup.ConfigSelectors.prototype.constructor = mixitup.ConfigSelectors;
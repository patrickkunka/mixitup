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
    mixitup.Base.call(this);

    this.execAction('construct', 0);

    this.target         = '.mix';
    this.control        = '.mixitup-control';

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigSelectors);

mixitup.ConfigSelectors.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigSelectors.prototype.constructor = mixitup.ConfigSelectors;
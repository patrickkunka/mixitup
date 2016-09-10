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

    this.callActions('beforeConstruct');

    this.target = '.mix';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigSelectors);

mixitup.ConfigSelectors.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigSelectors.prototype.constructor = mixitup.ConfigSelectors;
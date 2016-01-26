/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @memberof    mixitup.Config
 * @name        libraries
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigLibraries = function() {
    this.execAction('construct', 0);

    this.q          = null;
    this.jQuery     = null;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.ConfigLibraries.prototype = Object.create(new mixitup.BasePrototype());

mixitup.ConfigLibraries.prototype.constructor = mixitup.ConfigLibraries;
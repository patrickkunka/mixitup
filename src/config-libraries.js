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
    mixitup.Base.call(this);

    this.execAction('construct', 0);

    this.q          = null;
    this.jQuery     = null;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigLibraries);

mixitup.ConfigLibraries.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigLibraries.prototype.constructor = mixitup.ConfigLibraries;
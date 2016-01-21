/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigLibraries = function() {
    this.execAction('constructor', 0);

    this.q          = null;
    this.jQuery     = null;

    this.execAction('constructor', 1);

    h.seal(this);
};

mixitup.ConfigLibraries.prototype = new mixitup.BasePrototype();
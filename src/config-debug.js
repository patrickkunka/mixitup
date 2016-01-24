/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup.Config
 * @name        debug
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigDebug = function() {
    this.execAction('constructor', 0);

    this.enable = true;

    this.execAction('constructor', 1);

    h.seal(this);
};

mixitup.ConfigDebug.prototype = Object.create(new mixitup.BasePrototype());

mixitup.ConfigDebug.prototype.constructor = mixitup.ConfigDebug;
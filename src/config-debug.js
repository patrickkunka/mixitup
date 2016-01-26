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
    this.execAction('construct', 0);

    this.enable = true;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.ConfigDebug.prototype = Object.create(new mixitup.BasePrototype());

mixitup.ConfigDebug.prototype.constructor = mixitup.ConfigDebug;
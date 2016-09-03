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
    mixitup.Base.call(this);

    this.execAction('construct', 0);

    this.enable = true;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigDebug);

mixitup.ConfigDebug.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigDebug.prototype.constructor = mixitup.ConfigDebug;
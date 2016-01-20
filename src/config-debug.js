/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigDebug = function() {
    this._execAction('constructor', 0);

    this.enable = true;

    this._execAction('constructor', 1);

    h.seal(this);
};

mixitup.ConfigDebug.prototype = new mixitup.BasePrototype();
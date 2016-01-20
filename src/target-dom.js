/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.TargetDom = function() {
    this._execAction('constructor', 0);

    this.el = null;

    this._execAction('constructor', 1);

    h.seal(this);
};

mixitup.TargetDom.prototype = new mixitup.BasePrototype();
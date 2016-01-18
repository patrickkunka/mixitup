/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.TransformData = function() {
    this._execAction('constructor', 0);

    this.value  = 0;
    this.unit   = '';

    this._execAction('cconstructor', 1);

    h.seal(this);
};

mixitup.TransformData.prototype = new mixitup.BasePrototype();
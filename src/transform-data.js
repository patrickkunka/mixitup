/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.TransformData = function() {
    this.execAction('construct', 0);

    this.value  = 0;
    this.unit   = '';

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.TransformData.prototype = Object.create(new mixitup.BasePrototype());

mixitup.TransformData.prototype.constructor = mixitup.TransformData;
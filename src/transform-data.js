/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.TransformData = function() {
    mixitup.BasePrototype.call(this);

    this.execAction('construct', 0);

    this.value  = 0;
    this.unit   = '';

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.TransformData);

mixitup.TransformData.prototype = Object.create(mixitup.BasePrototype.prototype);

mixitup.TransformData.prototype.constructor = mixitup.TransformData;
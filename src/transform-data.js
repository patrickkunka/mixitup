/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.TransformData = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.value  = 0;
    this.unit   = '';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.TransformData);

mixitup.TransformData.prototype = Object.create(mixitup.Base.prototype);

mixitup.TransformData.prototype.constructor = mixitup.TransformData;
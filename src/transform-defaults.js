/* global mixitup */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.TransformDefaults = function() {
    this.execAction('constructor', 0);

    mixitup.StyleData.apply(this);

    this.scale.value        = 0.01;
    this.scale.unit         = '';

    this.translateX.value   = 20;
    this.translateX.unit    = 'px';

    this.translateY.value   = 20;
    this.translateY.unit    = 'px';

    this.translateZ.value   = 20;
    this.translateZ.unit    = 'px';

    this.rotateX.value      = 90;
    this.rotateX.unit       = 'deg';

    this.rotateY.value      = 90;
    this.rotateY.unit       = 'deg';

    this.rotateX.value      = 90;
    this.rotateX.unit       = 'deg';

    this.rotateZ.value      = 180;
    this.rotateZ.unit       = 'deg';

    this.execAction('constructor', 1);
};

mixitup.TransformDefaults.prototype = Object.create(new mixitup.BasePrototype());

mixitup.TransformDefaults.prototype.constructor = mixitup.TransformDefaults;
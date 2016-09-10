/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.StyleData = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.x              = 0;
    this.y              = 0;
    this.top            = 0;
    this.right          = 0;
    this.bottom         = 0;
    this.left           = 0;
    this.width          = 0;
    this.height         = 0;
    this.marginRight    = 0;
    this.marginBottom   = 0;
    this.opacity        = 0;
    this.scale          = new mixitup.TransformData();
    this.translateX     = new mixitup.TransformData();
    this.translateY     = new mixitup.TransformData();
    this.translateZ     = new mixitup.TransformData();
    this.rotateX        = new mixitup.TransformData();
    this.rotateY        = new mixitup.TransformData();
    this.rotateZ        = new mixitup.TransformData();

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.StyleData);

mixitup.StyleData.prototype = Object.create(mixitup.Base.prototype);

mixitup.StyleData.prototype.constructor = mixitup.StyleData;
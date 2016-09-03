/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.TargetDom = function() {
    mixitup.Base.call(this);

    this.execAction('construct', 0);

    this.el = null;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.TargetDom);

mixitup.TargetDom.prototype = Object.create(mixitup.Base.prototype);

mixitup.TargetDom.prototype.constructor = mixitup.TargetDom;
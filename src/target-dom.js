/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.TargetDom = function() {
    this.execAction('construct', 0);

    this.el = null;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.TargetDom.prototype = Object.create(new mixitup.BasePrototype());

mixitup.TargetDom.prototype.constructor = mixitup.TargetDom;
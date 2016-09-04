/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.CommandMultimix = function() {
    mixitup.Base.call(this);

    this.execAction('construct', 0);

    this.filter = null;
    this.sort   = null;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.CommandMultimix);

mixitup.CommandMultimix.prototype = Object.create(mixitup.Base.prototype);

mixitup.CommandMultimix.prototype.constructor = mixitup.CommandMultimix;
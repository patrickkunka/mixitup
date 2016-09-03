/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.UserInstruction = function() {
    mixitup.Base.call(this);

    this.execAction('construct', 0);

    this.command    = {};
    this.animate    = false;
    this.callback   = null;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.UserInstruction);

mixitup.UserInstruction.prototype = Object.create(mixitup.Base.prototype);

mixitup.UserInstruction.prototype.constructor = mixitup.UserInstruction;
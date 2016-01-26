/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.UserInstruction = function() {
    this.execAction('construct', 0);

    this.command    = {};
    this.animate    = false;
    this.callback   = null;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.UserInstruction.prototype = Object.create(new mixitup.BasePrototype());

mixitup.UserInstruction.prototype.constructor = mixitup.UserInstruction;
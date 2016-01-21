/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.UserInstruction = function() {
    this.execAction('constructor', 0);

    this.command    = {};
    this.animate    = false;
    this.callback   = null;

    this.execAction('constructor', 1);

    h.seal(this);
};

mixitup.UserInstruction.prototype = new mixitup.BasePrototype();
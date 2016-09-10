/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.UserInstruction = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.command    = {};
    this.animate    = false;
    this.callback   = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.UserInstruction);

mixitup.UserInstruction.prototype = Object.create(mixitup.Base.prototype);

mixitup.UserInstruction.prototype.constructor = mixitup.UserInstruction;
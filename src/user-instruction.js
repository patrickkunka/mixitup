/* global UserInstruction *
/* global h */

/**
 * mixitup.UserInstruction
 * @since       3.0.0
 * @constructor
 */

mixitup.UserInstruction = function() {
    this._execAction('_constructor', 0);

    this.command    = {};
    this.animate    = false;
    this.callback   = null;

    this._execAction('_constructor', 1);

    h.seal(this);
};

/**
 * mixitup.UserInstruction.prototype
 * @since       3.0.0
 * @prototype
 * @extends     {mixitup.basePrototype}
 */

mixitup.UserInstruction.prototype = Object.create(mixitup.basePrototype);

h.extend(mixitup.UserInstruction.prototype, {
    _actions: {},
    _filters: {}
});
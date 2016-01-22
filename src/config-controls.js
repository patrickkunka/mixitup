/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigControls = function() {
    this.execAction('constructor', 0);

    this.enable         = true;
    this.live           = false;
    this.toggleLogic    = 'or';
    this.toggleDefault  = 'all';
    this.activeClass    = 'active';

    this.execAction('constructor', 1);

    h.seal(this);
};

mixitup.ConfigControls.prototype = Object.create(new mixitup.BasePrototype());

mixitup.ConfigControls.prototype.constructor = mixitup.ConfigControls;
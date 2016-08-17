/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup.Config
 * @name        controls
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigControls = function() {
    mixitup.BasePrototype.call(this);

    this.execAction('construct', 0);

    this.enable         = true;
    this.live           = false;
    this.toggleLogic    = 'or';
    this.toggleDefault  = 'all';
    this.activeClass    = 'active';

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigControls);

mixitup.ConfigControls.prototype = Object.create(mixitup.BasePrototype.prototype);

mixitup.ConfigControls.prototype.constructor = mixitup.ConfigControls;
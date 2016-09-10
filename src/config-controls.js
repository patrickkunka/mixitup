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
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.enable         = true;
    this.live           = false;
    this.scope          = 'local'; // enum: ['local' ,'global']
    this.toggleLogic    = 'or';
    this.toggleDefault  = 'all';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigControls);

mixitup.ConfigControls.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigControls.prototype.constructor = mixitup.ConfigControls;
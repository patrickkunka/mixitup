/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup.Config
 * @name        debug
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigDebug = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.enable         = false;
    this.showWarnings   = true;
    this.fauxAsync      = false;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigDebug);

mixitup.ConfigDebug.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigDebug.prototype.constructor = mixitup.ConfigDebug;
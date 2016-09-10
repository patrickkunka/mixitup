/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup.Config
 * @name        callbacks
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigCallbacks = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.onMixStart = null;
    this.onMixBusy  = null;
    this.onMixEnd   = null;
    this.onMixFail  = null;
    this.onMixClick = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigCallbacks);

mixitup.ConfigCallbacks.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigCallbacks.prototype.constructor = mixitup.ConfigCallbacks;
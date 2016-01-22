/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigCallbacks = function() {
    this.execAction('constructor', 0);

    this.onMixLoad  = null;
    this.onMixStart = null;
    this.onMixBusy  = null;
    this.onMixEnd   = null;
    this.onMixFail  = null;
    this.onMixClick = null;

    this.execAction('constructor', 1);

    h.seal(this);
};

mixitup.ConfigCallbacks.prototype = Object.create(new mixitup.BasePrototype());

mixitup.ConfigCallbacks.prototype.constructor = mixitup.ConfigCallbacks;
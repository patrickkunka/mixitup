/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.MixerDom = function() {
    this._execAction('constructor', 0);

    this.document               = null;
    this.body                   = null;
    this.container              = null;
    this.parent                 = null;
    this.targets                = [];
    this.sortButtons            = [];
    this.filterButtons          = [];
    this.filterToggleButtons    = [];
    this.multiMixButtons        = [];
    this.allButtons             = [];

    this._execAction('constructor', 1);

    h.seal(this);
};

mixitup.MixerDom.prototype = new mixitup.BasePrototype();
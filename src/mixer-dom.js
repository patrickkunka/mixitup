/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.MixerDom = function() {
    this.execAction('construct', 0);

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

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.MixerDom.prototype = Object.create(new mixitup.BasePrototype());

mixitup.MixerDom.prototype.constructor = mixitup.MixerDom;
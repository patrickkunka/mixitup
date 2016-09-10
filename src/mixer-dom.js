/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.MixerDom = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.document               = null;
    this.body                   = null;
    this.container              = null;
    this.parent                 = null;
    this.targets                = [];

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.MixerDom);

mixitup.MixerDom.prototype = Object.create(mixitup.Base.prototype);

mixitup.MixerDom.prototype.constructor = mixitup.MixerDom;
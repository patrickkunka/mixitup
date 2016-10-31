/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.ConfigRender = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.target = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigRender);

mixitup.ConfigRender.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigRender.prototype.constructor = mixitup.ConfigRender;
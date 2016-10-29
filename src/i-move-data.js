/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.IMoveData = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.posIn          = null;
    this.posOut         = null;
    this.operation      = null;
    this.callback       = null;
    this.statusChange   = '';
    this.duration       = -1;
    this.staggerIndex   = -1;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.IMoveData);

mixitup.IMoveData.prototype = Object.create(mixitup.Base.prototype);

mixitup.IMoveData.prototype.constructor = mixitup.IMoveData;
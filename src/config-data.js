/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup.Config
 * @name        data
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigData = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.uid        = '';
    this.dirtyCheck = false;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigData);

mixitup.ConfigData.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigData.prototype.constructor = mixitup.ConfigData;
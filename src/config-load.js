/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup.Config
 * @name        load
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigLoad = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.filter     = 'all';
    this.sort       = 'default:asc';
    this.animate    = false;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigLoad);

mixitup.ConfigLoad.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigLoad.prototype.constructor = mixitup.ConfigLoad;
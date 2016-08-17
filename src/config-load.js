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
    mixitup.BasePrototype.call(this);

    this.execAction('construct', 0);

    this.filter = 'all';
    this.sort   = 'default:asc';

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigLoad);

mixitup.ConfigLoad.prototype = Object.create(mixitup.BasePrototype.prototype);

mixitup.ConfigLoad.prototype.constructor = mixitup.ConfigLoad;
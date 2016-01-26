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
    this.execAction('construct', 0);

    this.filter = 'all';
    this.sort   = 'default:asc';

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.ConfigLoad.prototype = Object.create(new mixitup.BasePrototype());

mixitup.ConfigLoad.prototype.constructor = mixitup.ConfigLoad;
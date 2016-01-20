/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigLoad = function() {
    this._execAction('constructor', 0);

    this.filter = 'all';
    this.sort   = 'default:asc';

    this._execAction('constructor', 1);

    h.seal(this);
};

mixitup.ConfigLoad.prototype = new mixitup.BasePrototype();
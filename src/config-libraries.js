/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @memberof    mixitup.Config
 * @name        libraries
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigLibraries = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.jQuery = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigLibraries);

mixitup.ConfigLibraries.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigLibraries.prototype.constructor = mixitup.ConfigLibraries;
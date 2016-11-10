/* global mixitup, h */

/**
 * A group of optional render functions for creating and updating elements.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        render
 * @namespace
 * @public
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
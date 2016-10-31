/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.ConfigTemplates = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigTemplates);

mixitup.ConfigTemplates.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigTemplates.prototype.constructor = mixitup.ConfigTemplates;
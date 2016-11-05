/* global mixitup, h */

/**
 * An object into which all arbitrary arguments sent to '.changeLayout()' are mapped.
 *
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.CommandChangeLayout = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.containerClassName = '';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.CommandChangeLayout);

mixitup.CommandChangeLayout.prototype = Object.create(mixitup.Base.prototype);

mixitup.CommandChangeLayout.prototype.constructor = mixitup.CommandChangeLayout;
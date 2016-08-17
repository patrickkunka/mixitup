/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup.Config
 * @name        layout
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigLayout = function() {
    mixitup.BasePrototype.call(this);

    this.execAction('construct', 0);

    this.allowNestedTargets = false;
    this.containerClass     = '';
    this.containerClassFail = 'mixitup-container-fail';

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigLayout);

mixitup.ConfigLayout.prototype = Object.create(mixitup.BasePrototype.prototype);

mixitup.ConfigLayout.prototype.constructor = mixitup.ConfigLayout;
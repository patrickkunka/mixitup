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
    this.execAction('construct', 0);

    this.allowNestedTargets = false;
    this.containerClass     = '';
    this.containerClassFail = 'mixitup-container-fail';

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.ConfigLayout.prototype = Object.create(new mixitup.BasePrototype());

mixitup.ConfigLayout.prototype.constructor = mixitup.ConfigLayout;
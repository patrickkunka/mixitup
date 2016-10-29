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
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.allowNestedTargets = true;
    this.containerClass     = '';
    this.containerClassFail = 'mixitup-container-fail';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigLayout);

mixitup.ConfigLayout.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigLayout.prototype.constructor = mixitup.ConfigLayout;
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
    this.execAction('constructor', 0);

    this.allowNestedTargets = false;
    this.display            = 'inline-block';
    this.containerClass     = '';
    this.containerClassFail = 'fail';

    this.execAction('constructor', 1);

    h.seal(this);
};

mixitup.ConfigLayout.prototype = Object.create(new mixitup.BasePrototype());

mixitup.ConfigLayout.prototype.constructor = mixitup.ConfigLayout;
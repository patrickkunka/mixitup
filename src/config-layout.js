/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigLayout = function() {
    this._execAction('constructor', 0);

    this.allowNestedTargets = false;
    this.display            = 'inline-block';
    this.containerClass     = '';
    this.containerClassFail = 'fail';

    this._execAction('constructor', 1);

    h.seal(this);
};

mixitup.ConfigLayout.prototype = new mixitup.BasePrototype();
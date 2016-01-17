/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.TransformData = function() {
    this._execAction('_constructor', 0);

    this.value  = 0;
    this.unit   = '';

    this._execAction('_constructor', 1);

    h.seal(this);
};

mixitup.TransformData.prototype = Object.create(mixitup.basePrototype);

h.extend(mixitup.TransformData.prototype, {
    _actions: {},
    _filters: {}
});
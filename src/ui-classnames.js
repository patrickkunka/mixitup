/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.UiClassnames = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.base       = '';
    this.active     = '';
    this.disabled   = '';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.UiClassnames);

mixitup.UiClassnames.prototype = Object.create(mixitup.Base.prototype);

mixitup.UiClassnames.prototype.constructor = mixitup.UiClassnames;
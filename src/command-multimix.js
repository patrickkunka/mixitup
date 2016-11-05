/* global mixitup, h */

/**
 * An object into which all arbitrary arguments sent to '.multimix()' are mapped.
 *
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.CommandMultimix = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.filter       = null;
    this.sort         = null;
    this.insert       = null;
    this.remove       = null;
    this.changeLayout = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.CommandMultimix);

mixitup.CommandMultimix.prototype = Object.create(mixitup.Base.prototype);

mixitup.CommandMultimix.prototype.constructor = mixitup.CommandMultimix;
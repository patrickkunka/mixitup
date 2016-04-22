/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       2.0.0
 */

mixitup.ClickTracker = function() {
    this.execAction('construct', 0);

    this.filterToggle   = -1;
    this.multiMix       = -1;
    this.filter         = -1;
    this.sort           = -1;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.ClickTracker.prototype = Object.create(new mixitup.BasePrototype());

mixitup.ClickTracker.prototype.constructor = mixitup.ClickTracker;

/**
 * @private
 * @static
 * @since   2.0.0
 * @type    {mixitup.ClickTracker}
 */

mixitup.handled = new mixitup.ClickTracker();

/**
 * @private
 * @static
 * @since   2.0.0
 * @type    {mixitup.ClickTracker}
 */

mixitup.bound = new mixitup.ClickTracker();
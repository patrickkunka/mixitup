/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.ControlTypes = function() {
    mixitup.Base.call(this);

    this.execAction('construct', 0);

    this.FILTER         = new mixitup.ControlTypes.ControlDefinition('[data-filter]');
    this.FILTER_TOGGLE  = new mixitup.ControlTypes.ControlDefinition('[data-toggle]');
    this.SORT           = new mixitup.ControlTypes.ControlDefinition('[data-sort]');
    this.MULTIMIX       = new mixitup.ControlTypes.ControlDefinition('[data-filter][data-sort]');

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigControls);

mixitup.ConfigControls.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigControls.prototype.constructor = mixitup.ConfigControls;

/**
 * @constructor
 * @memberof    mixitup.ControlTypes
 * @private
 * @since       3.0.0
 * @param       {boolean}            [isDefaultLive]
 */

mixitup.ControlTypes.ControlDefinition = function(selector, isDefaultLive) {
    this.selector      = '';
    this.isDefaultLive = isDefaultLive || false;

    h.freeze(this);
    h.seal(this);
};

mixitup.controlTypes = new mixitup.ControlTypes();
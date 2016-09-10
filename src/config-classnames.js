/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup.Config
 * @name        classnames
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigClassnames = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.block              = 'mixitup';
    this.elementFilter      = 'control';
    this.elementSort        = 'control';
    this.elementMultimix    = 'control';
    this.elementToggle      = 'control';
    this.modifierActive     = 'active';
    this.modifierDisabled   = 'disabled';
    this.delineatorElement  = '-';
    this.delineatorModifier = '-';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigClassnames);

mixitup.ConfigClassnames.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigClassnames.prototype.constructor = mixitup.ConfigClassnames;
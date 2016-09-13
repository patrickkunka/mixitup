/* global mixitup, h */

/**
 * A group of properties defining the output and structure of classnames programmatically
 * added to controls and containers to reflect the state of the mixer.
 *
 * Using a "BEM" like structure, each classname is broken into the three parts by default:
 * a block namespace ("mixitup"), an element name (e.g. "control"), and an optional modifier
 * name (e.g. "active") reflecting the state of the element.
 *
 * By default, each part of the classname is concatenated together using single hyphens as
 * delineators, but this can be easily customised to match the naming convention and style of
 * your proejct.
 *
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

    /**
     * @name        block
     * @memberof    mixitup.Config.classnames
     * @instance
     * @type        {string}
     * @default     'mixitup'
     */

    this.block = 'mixitup';

    /**
     * @name        elementFilter
     * @memberof    mixitup.Config.classnames
     * @instance
     * @type        {string}
     * @default     'control'
     */

    this.elementFilter = 'control';

    /**
     * @name        elementSort
     * @memberof    mixitup.Config.classnames
     * @instance
     * @type        {string}
     * @default     'control'
     */

    this.elementSort = 'control';

    /**
     * @name        elementMultimix
     * @memberof    mixitup.Config.classnames
     * @instance
     * @type        {string}
     * @default     'control'
     */

    this.elementMultimix = 'control';

    /**
     * @name        elementToggle
     * @memberof    mixitup.Config.classnames
     * @instance
     * @type        {string}
     * @default     'control'
     */

    this.elementToggle = 'control';

    /**
     * @name        modifierActive
     * @memberof    mixitup.Config.classnames
     * @instance
     * @type        {string}
     * @default     'active'
     */

    this.modifierActive = 'active';

    /**
     * @name        modifierDisabled
     * @memberof    mixitup.Config.classnames
     * @instance
     * @type        {string}
     * @default     'disabled'
     */

    this.modifierDisabled = 'disabled';

    /**
     * @name        delineatorElement
     * @memberof    mixitup.Config.classnames
     * @instance
     * @type        {string}
     * @default     '-'
     */

    this.delineatorElement = '-';

    /**
     * @name        delineatorModifier
     * @memberof    mixitup.Config.classnames
     * @instance
     * @type        {string}
     * @default     '-'
     */

    this.delineatorModifier = '-';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigClassnames);

mixitup.ConfigClassnames.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigClassnames.prototype.constructor = mixitup.ConfigClassnames;
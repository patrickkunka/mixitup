/* global mixitup, h */

/**
 * A group of properties defining the output and structure of classnames programmatically
 * added to controls and containers to reflect the state of the mixer.
 *
 * Most commonly, classnames are added to control buttons by MixItUp to indicate that
 * the control is active so that it can be styled accordingly - `'mixitup-control-active'` by default.
 *
 * Using a "BEM" like structure, each classname is broken into the three parts:
 * a block namespace (`'mixitup'`), an element name (e.g. `'control'`), and an optional modifier
 * name (e.g. `'active'`) reflecting the state of the element.
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
     * The "block" portion, or top-level namespace added to the start of all classnames created by MixItUp.
     *
     * @example <caption>Example 1: changing the `config.classnames.block` value</caption>
     * var mixer = mixitup(containerEl, {
     *     classnames: {
     *         block: 'portfolio'
     *     }
     * });
     *
     * // example active control output: "portfolio-control-active"
     *
     * @example <caption>Example 2: Removing `config.classnames.block`</caption>
     * var mixer = mixitup(containerEl, {
     *     classnames: {
     *         block: ''
     *     }
     * });
     *
     * // example active control output: "control-active"
     *
     * @name        block
     * @memberof    mixitup.Config.classnames
     * @instance
     * @type        {string}
     * @default     'mixitup'
     */

    this.block = 'mixitup';

    /**
     * The "element" portion for a filter control button.
     *
     * By default, all filter, sort, multimix and toggle buttons take the same element value of `'control'`, but
     * each type's element value can be individually overwritten to match the UI classnames of your project as needed.
     *
     * @example <caption>Example 1: changing the `config.classnames.elementFilter` value</caption>
     * var mixer = mixitup(containerEl, {
     *     classnames: {
     *         elementFilter: 'filter'
     *     }
     * });
     *
     * // example active control output: "mixitup-filter-active"
     *
     * @example <caption>Example 2: changing the `config.classnames.block` and `config.classnames.elementFilter` values</caption>
     * var mixer = mixitup(containerEl, {
     *     classnames: {
     *         block: 'portfolio',
     *         elementFilter: 'filter'
     *     }
     * });
     *
     * // example active control output: "portfolio-filter-active"
     *
     * @name        elementFilter
     * @memberof    mixitup.Config.classnames
     * @instance
     * @type        {string}
     * @default     'control'
     */

    this.elementFilter = 'control';

    /**
     * The "element" portion for a sort control button.
     *
     * By default, all filter, sort, multimix and toggle buttons take the same element value of `'control'`, but
     * each type's element value can be individually overwritten to match the UI classnames of your project as needed.
     *
     * @example <caption>Example 1: changing the `config.classnames.elementSort` value</caption>
     * var mixer = mixitup(containerEl, {
     *     classnames: {
     *         elementSort: 'sort'
     *     }
     * });
     *
     * // example active control output: "mixitup-sort-active"
     *
     * @example <caption>Example 2: changing the `config.classnames.block` and `config.classnames.elementSort` values</caption>
     * var mixer = mixitup(containerEl, {
     *     classnames: {
     *         block: 'portfolio',
     *         elementSort: 'sort'
     *     }
     * });
     *
     * // example active control output: "portfolio-sort-active"
     *
     * @name        elementSort
     * @memberof    mixitup.Config.classnames
     * @instance
     * @type        {string}
     * @default     'control'
     */

    this.elementSort = 'control';

    /**
     * The "element" portion for a multimix control button.
     *
     * By default, all filter, sort, multimix and toggle buttons take the same element value of `'control'`, but
     * each type's element value can be individually overwritten to match the UI classnames of your project as needed.
     *
     * @example <caption>Example 1: changing the `config.classnames.elementMultimix` value</caption>
     * var mixer = mixitup(containerEl, {
     *     classnames: {
     *         elementMultimix: 'multimix'
     *     }
     * });
     *
     * // example active control output: "mixitup-multimix-active"
     *
     * @example <caption>Example 2: changing the `config.classnames.block` and `config.classnames.elementMultimix` values</caption>
     * var mixer = mixitup(containerEl, {
     *     classnames: {
     *         block: 'portfolio',
     *         elementSort: 'multimix'
     *     }
     * });
     *
     * // example active control output: "portfolio-multimix-active"
     *
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
/* global mixitup, h */

/**
 * A group of properties defining the output and structure of class names programmatically
 * added to controls and containers to reflect the state of the mixer.
 *
 * Most commonly, class names are added to controls by MixItUp to indicate that
 * the control is active so that it can be styled accordingly - `'mixitup-control-active'` by default.
 *
 * Using a "BEM" like structure, each classname is broken into the three parts:
 * a block namespace (`'mixitup'`), an element name (e.g. `'control'`), and an optional modifier
 * name (e.g. `'active'`) reflecting the state of the element.
 *
 * By default, each part of the classname is concatenated together using single hyphens as
 * delineators, but this can be easily customised to match the naming convention and style of
 * your project.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        classNames
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigClassNames = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /**
     * The "block" portion, or top-level namespace added to the start of any class names created by MixItUp.
     *
     * @example <caption>Example 1: changing the `config.classNames.block` value</caption>
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         block: 'portfolio'
     *     }
     * });
     *
     * // Active control output: "portfolio-control-active"
     *
     * @example <caption>Example 2: Removing `config.classNames.block`</caption>
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         block: ''
     *     }
     * });
     *
     * // Active control output: "control-active"
     *
     * @name        block
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'mixitup'
     */

    this.block = 'mixitup';

    /**
     * The "element" portion of the class name added to container.
     *
     * @name        elementContainer
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'container'
     */

    this.elementContainer = 'container';

    /**
     * The "element" portion of the class name added to filter controls.
     *
     * By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
     * each type's element value can be individually overwritten to match the unique classNames of your controls as needed.
     *
     * @example <caption>Example 1: changing the `config.classNames.elementFilter` value</caption>
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         elementFilter: 'filter'
     *     }
     * });
     *
     * // Active filter output: "mixitup-filter-active"
     *
     * @example <caption>Example 2: changing the `config.classNames.block` and `config.classNames.elementFilter` values</caption>
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         block: 'portfolio',
     *         elementFilter: 'filter'
     *     }
     * });
     *
     * // Active filter output: "portfolio-filter-active"
     *
     * @name        elementFilter
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'control'
     */

    this.elementFilter = 'control';

    /**
     * The "element" portion of the class name added to sort controls.
     *
     * By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
     * each type's element value can be individually overwritten to match the unique classNames of your controls as needed.
     *
     * @example <caption>Example 1: changing the `config.classNames.elementSort` value</caption>
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         elementSort: 'sort'
     *     }
     * });
     *
     * // Active sort output: "mixitup-sort-active"
     *
     * @example <caption>Example 2: changing the `config.classNames.block` and `config.classNames.elementSort` values</caption>
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         block: 'portfolio',
     *         elementSort: 'sort'
     *     }
     * });
     *
     * // Active sort output: "portfolio-sort-active"
     *
     * @name        elementSort
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'control'
     */

    this.elementSort = 'control';

    /**
     * The "element" portion of the class name added to multimix controls.
     *
     * By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
     * each type's element value can be individually overwritten to match the unique classNames of your controls as needed.
     *
     * @example <caption>Example 1: changing the `config.classNames.elementMultimix` value</caption>
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         elementMultimix: 'multimix'
     *     }
     * });
     *
     * // Active multimix output: "mixitup-multimix-active"
     *
     * @example <caption>Example 2: changing the `config.classNames.block` and `config.classNames.elementMultimix` values</caption>
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         block: 'portfolio',
     *         elementSort: 'multimix'
     *     }
     * });
     *
     * // Active multimix output: "portfolio-multimix-active"
     *
     * @name        elementMultimix
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'control'
     */

    this.elementMultimix = 'control';

    /**
     * The "element" portion of the class name added to toggle controls.
     *
     * By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
     * each type's element value can be individually overwritten to match the unique classNames of your controls as needed.
     *
     * @example <caption>Example 1: changing the `config.classNames.elementToggle` value</caption>
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         elementToggle: 'toggle'
     *     }
     * });
     *
     * // Active toggle output: "mixitup-toggle-active"
     *
     * @example <caption>Example 2: changing the `config.classNames.block` and `config.classNames.elementToggle` values</caption>
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         block: 'portfolio',
     *         elementToggle: 'toggle'
     *     }
     * });
     *
     * // Active toggle output: "portfolio-toggle-active"
     *
     * @name        elementToggle
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'control'
     */

    this.elementToggle = 'control';

    /**
     * The "modifier" portion of the class name added to active controls.
     * @name        modifierActive
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'active'
     */

    this.modifierActive = 'active';

    /**
     * The "modifier" portion of the class name added to disabled controls.
     *
     * @name        modifierDisabled
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'disabled'
     */

    this.modifierDisabled = 'disabled';

    /**
     * The "modifier" portion of the class name added to the container when in a "failed" state.
     *
     * @name        modifierFailed
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'failed'
     */

    this.modifierFailed = 'failed';

    /**
     * The delineator used between the "block" and "element" portions of any class name added by MixItUp.
     *
     * If the block portion is ommited by setting it to an empty string, no delineator will be added.
     *
     * @example <caption>Example: changing the delineator to match BEM convention</caption>
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         delineatorElement: '__'
     *     }
     * });
     *
     * // example active control output: "mixitup__control-active"
     *
     * @name        delineatorElement
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     '-'
     */

    this.delineatorElement = '-';

    /**
     * The delineator used between the "element" and "modifier" portions of any class name added by MixItUp.
     *
     * If the element portion is ommited by setting it to an empty string, no delineator will be added.
     *
     * @example <caption>Example: changing both delineators to match BEM convention</caption>
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         delineatorElement: '__'
     *         delineatorModifier: '--'
     *     }
     * });
     *
     * // Active control output: "mixitup__control--active"
     *
     * @name        delineatorModifier
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     '-'
     */

    this.delineatorModifier = '-';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigClassNames);

mixitup.ConfigClassNames.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigClassNames.prototype.constructor = mixitup.ConfigClassNames;
/* global mixitup, h */

/**
 * A group of properties defining the selectors used to query elements within a mixitup container.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        selectors
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigSelectors = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /**
     * A selector string used to query and index target elements within the container.
     *
     * By default, the class selector `'.mix'` is used, but this can be changed to an
     * attribute or element selector to match the style of your project.
     *
     * @example <caption>Example 1: Changing the target selector</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     selectors: {
     *         target: '.portfolio-item'
     *     }
     * });
     *
     * @example <caption>Example 2: Using an attribute selector as a target selector</caption>
     *
     * // The mixer will search for any children with the attribute `data-ref="mix"`
     *
     * var mixer = mixitup(containerEl, {
     *     selectors: {
     *         target: '[data-ref="mix"]'
     *     }
     * });
     *
     * @name        target
     * @memberof    mixitup.Config.selectors
     * @instance
     * @type        {string}
     * @default     '.mix'
     */

    this.target = '.mix';

    /**
     * A optional selector string used to add further specificity to the querying of control elements,
     * in addition to their mandatory data attribute (e.g. `data-filter`, `data-toggle`, `data-sort`).
     *
     * This can be used if other elements in your document must contain the above attributes
     * (e.g. for use in third-party scripts), and would otherwise interfere with MixItUp. Adding
     * an additional `control` selector of your choice allows MixItUp to restrict event handling
     * to only those elements matching the defined selector.
     *
     * @name        control
     * @memberof    mixitup.Config.selectors
     * @instance
     * @type        {string}
     * @default     ''
     *
     * @example <caption>Example 1: Adding a `selectors.control` selector</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     selectors: {
     *         control: '.mixitup-control'
     *     }
     * });
     *
     * // Will not be handled:
     * // <button data-filter=".category-a"></button>
     *
     * // Will be handled:
     * // <button class="mixitup-control" data-filter=".category-a"></button>
     */

    this.control = '';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigSelectors);

mixitup.ConfigSelectors.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigSelectors.prototype.constructor = mixitup.ConfigSelectors;
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

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigSelectors);

mixitup.ConfigSelectors.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigSelectors.prototype.constructor = mixitup.ConfigSelectors;
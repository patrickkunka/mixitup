/* global mixitup, h */

/**
 * A group of properties defining the initial state of the mixer on load (instantiation).
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        load
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigLoad = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /**
     * A string defining any filtering to be statically applied to the mixer on load.
     * As per the `.filter()` API, this can be any valid selector string, or the
     * values `'all'` or `'none'`.
     *
     * @example <caption>Example 1: Defining an initial filter selector to be applied on load</caption>
     *
     * // The mixer will show only those targets matching '.category-a' on load.
     *
     * var mixer = mixitup(containerEl, {
     *     load: {
     *         filter: '.category-a'
     *     }
     * });
     *
     * @example <caption>Example 2: Hiding all targets on load</caption>
     *
     * // The mixer will show hide all targets on load.
     *
     * var mixer = mixitup(containerEl, {
     *     load: {
     *         filter: 'none'
     *     }
     * });
     *
     * @name        filter
     * @memberof    mixitup.Config.load
     * @instance
     * @type        {string}
     * @default     'all'
     */

    this.filter = 'all';

    /**
     * A string defining any sorting to be statically applied to the mixer on load.
     * As per the `.sort()` API, this should be a valid "sort string" made up of
     * an attribute to sort by (or `'default'`) followed by an optional sorting
     * order, or the value `'random'`;
     *
     * @example <caption>Example: Defining sorting to be applied on load</caption>
     *
     * // The mixer will sort the container by the value of the `data-published-date`
     * // attribute, in descending order.
     *
     * var mixer = mixitup(containerEl, {
     *     load: {
     *         sort: 'published-date:desc'
     *     }
     * });
     *
     * @name        sort
     * @memberof    mixitup.Config.load
     * @instance
     * @type        {string}
     * @default     'default:asc'
     */

    this.sort = 'default:asc';

    /**
     * An array of objects representing the underlying data of any pre-rendered targets,
     * when using the `.dataset()` API.
     *
     * NB: If targets are pre-rendered when the mixer is instantiated, this must be set.
     *
     * @example <caption>Example: Defining the initial underyling dataset</caption>
     *
     * var myDataset = [
     *     {
     *         id: 0,
     *         title: "Blog Post Title 0",
     *         ...
     *     },
     *     {
     *         id: 1,
     *         title: "Blog Post Title 1",
     *         ...
     *     }
     * ];
     *
     * var mixer = mixitup(containerEl, {
     *     data: {
     *         uidKey: 'id'
     *     },
     *     load: {
     *         dataset: myDataset
     *     }
     * });
     *
     * @name        dataset
     * @memberof    mixitup.Config.load
     * @instance
     * @type        {Array.<object>}
     * @default     null
     */

    this.dataset = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigLoad);

mixitup.ConfigLoad.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigLoad.prototype.constructor = mixitup.ConfigLoad;
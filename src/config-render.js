/* global mixitup, h */

/**
 * A group of optional render functions for creating and updating elements.
 *
 * All render functions receive a data object, and should return a valid HTML string.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        render
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigRender = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /**
     * A function returning an HTML string representing a target element, or a reference to a
     * single DOM element.
     *
     * The function is invoked as part of the `.dataset()` API, whenever a new item is added
     * to the dataset, or an item in the dataset changes (if `dataset.dirtyCheck` is enabled).
     *
     * The function receives the relevant dataset item as its first parameter.
     *
     * @example <caption>Example 1: Using string concatenation</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     render: {
     *         target: function(item) {
     *             return (
     *                 '&lt;div class="mix"&gt;' +
     *                     '&lt;h2&gt;' + item.title + '&lt;/h2&gt;' +
     *                 '&lt;/div&gt;'
     *             );
     *         }
     *     }
     * });
     *
     * @example <caption>Example 2: Using an ES2015 template literal</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     render: {
     *         target: function(item) {
     *             return (
     *                 `&lt;div class="mix"&gt;
     *                     &lt;h2&gt;${item.title}&lt;/h2&gt;
     *                  &lt;/div&gt;`
     *             );
     *         }
     *     }
     * });
     *
     * @example <caption>Example 3: Using a Handlebars template</caption>
     * {{{{raw}}}}
     * var targetTemplate = Handlebars.compile('&lt;div class="mix"&gt;&lt;h2&gt;{{title}}&lt;/h2&gt;&lt;/div&gt;');
     * {{{{/raw}}}}
     * var mixer = mixitup(containerEl, {
     *     render: {
     *         target: targetTemplate
     *     }
     * });
     *
     * @example <caption>Example 4: Returning a DOM element</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     render: {
     *         target: function(item) {
     *              // Create a single element using your framework's built-in renderer
     *
     *              var el = ...
     *
     *              return el;
     *         }
     *     }
     * });
     *
     * @name        target
     * @memberof    mixitup.Config.render
     * @instance
     * @type        {function}
     * @default     'null'
     */

    this.target = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigRender);

mixitup.ConfigRender.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigRender.prototype.constructor = mixitup.ConfigRender;
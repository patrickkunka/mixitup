/* global mixitup, h */

/**
 * A group of properties relating to the layout of the container.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        layout
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigLayout = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /**
     * A boolean dictating whether or not mixitup should query all descendants
     * of the container for targets, or only immediate children.
     *
     * By default, mixitup will query all descendants matching the
     * `selectors.target` selector when indexing targets upon instantiation.
     * This allows for targets to be nested inside a sub-container which is
     * useful when ring-fencing targets from locally scoped controls in your
     * markup (see `controls.scope`).
     *
     * However, if you are building a more complex UI requiring the nesting
     * of mixers within mixers, you will most likely want to limit targets to
     * immediate children of the container by setting this property to `false`.
     *
     * @example <caption>Example: Restricting targets to immediate children</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     layout: {
     *         allowNestedTargets: false
     *     }
     * });
     *
     * @name        allowNestedTargets
     * @memberof    mixitup.Config.layout
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.allowNestedTargets = true;

    /**
     * A string specifying an optional class name to apply to the container when in
     * its default state.
     *
     * By changing this class name or adding a class name to the container via the
     * `.changeLayout()` API method, the CSS layout of the container can be changed,
     * and MixItUp will attemp to gracefully animate the container and its targets
     * between states.
     *
     * @example <caption>Example 1: Specifying a container class name</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     layout: {
     *         containerClassName: 'grid'
     *     }
     * });
     *
     * @example <caption>Example 2: Changing the default class name with `.changeLayout()`</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     layout: {
     *         containerClassName: 'grid'
     *     }
     * });
     *
     * mixer.changeLayout('list')
     *     .then(function(state) {
     *          console.log(state.activeContainerClass); // "list"
     *     });
     *
     * @name        containerClassName
     * @memberof    mixitup.Config.layout
     * @instance
     * @type        {string}
     * @default     ''
     */

    this.containerClassName = '';

    /**
     * A reference to a non-target sibling element after which to insert targets
     * when there are no targets in the container.
     *
     * @example <caption>Example: Setting a `siblingBefore` reference element</caption>
     *
     * var addButton = containerEl.querySelector('button');
     *
     * var mixer = mixitup(containerEl, {
     *     layout: {
     *         siblingBefore: addButton
     *     }
     * });
     *
     * @name        siblingBefore
     * @memberof    mixitup.Config.layout
     * @instance
     * @type        {HTMLElement}
     * @default     null
     */

    this.siblingBefore = null;

    /**
     * A reference to a non-target sibling element before which to insert targets
     * when there are no targets in the container.
     *
     * @example <caption>Example: Setting an `siblingAfter` reference element</caption>
     *
     * var gap = containerEl.querySelector('.gap');
     *
     * var mixer = mixitup(containerEl, {
     *     layout: {
     *         siblingAfter: gap
     *     }
     * });
     *
     * @name        siblingAfter
     * @memberof    mixitup.Config.layout
     * @instance
     * @type        {HTMLElement}
     * @default     null
     */

    this.siblingAfter = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigLayout);

mixitup.ConfigLayout.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigLayout.prototype.constructor = mixitup.ConfigLayout;
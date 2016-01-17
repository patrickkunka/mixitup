/* global mixitup, h */

/**
 * State objects form part of the public API and are provided at the start and
 * end of any operation. The most recent state  object is stored between
 * operations and can also be retrieved via the API.
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @public
 * @since       3.0.0
 */

mixitup.State = function() {
    this._execAction('_constructor', 0);

    /**
     * The currently active filter selector as set by a control click or the API
     * call.
     *
     * @name        activeFilter
     * @memberof    mixitup.State
     * @instance
     * @type        {string}
     * @default     ''
     */

    this.activeFilter = '';

    /**
     * The currently active sort as set by a control click or API call.
     *
     * @name        activeSort
     * @memberof    mixitup.State
     * @instance
     * @type        {string}
     * @default     ''
     */

    this.activeSort = '';

    /**
     * The currently active CSS display value for target elements as defined in the
     * configuration object.
     *
     * @name        activeDisplay
     * @memberof    mixitup.State
     * @instance
     * @type        {string}
     * @default     ''
     */

    this.activeDisplay = '';

    /**
     * The currently active containerClass, if applied.
     *
     * @name        activeContainerClass
     * @memberof    mixitup.State
     * @instance
     * @type        {string}
     * @default     ''
     */

    this.activeContainerClass = '';

    /**
     * An array of all target elements indexed by the mixer.
     *
     * @name        targets
     * @memberof    mixitup.State
     * @instance
     * @type        {Array.<Element>}
     * @default     []
     */

    this.targets = [];

    /**
     * An array of all target elements not matching the current filter.
     *
     * @name        hide
     * @memberof    mixitup.State
     * @instance
     * @type        {Array.<Element>}
     * @default     []
     */

    this.hide = [];

    /**
     * An array of all target elements matching the current filter and any additional
     * limits applied such as pagination.
     *
     * @name        show
     * @memberof    mixitup.State
     * @instance
     * @type        {Array.<Element>}
     * @default     []
     */

    this.show = [];

    /**
     * An array of all target elements matching the current filter irrespective of
     * any additional limits applied such as pagination.
     *
     * @name        matching
     * @memberof    mixitup.State
     * @instance
     * @type        {Array.<Element>}
     * @default     []
     */

    this.matching = [];

    /**
     * An integer representing the total number of target elements indexed by the
     * mixer. Equivalent to `state.targets.length`.
     *
     * @name        totalTargets
     * @memberof    mixitup.State
     * @instance
     * @type        {number}
     * @default     -1
     */

    this.totalTargets = -1;

    /**
     * An integer representing the total number of target elements matching the
     * current filter and any additional limits applied such as pagination.
     * Equivalent to `state.show.length`.
     *
     * @name        totalShow
     * @memberof    mixitup.State
     * @instance
     * @type        {number}
     * @default     -1
     */

    this.totalShow = -1;

    /**
     * An integer representing the total number of target elements not matching
     * the current filter. Equivalent to `state.hide.length`.
     *
     * @name        totalHide
     * @memberof    mixitup.State
     * @instance
     * @type        {number}
     * @default     -1
     */

    this.totalHide = -1;

    /**
     * An integer representing the total number of target elements matching the
     * current filter irrespective of any other limits applied such as pagination.
     * Equivalent to `state.matching.length`.
     *
     * @name        totalMatching
     * @memberof    mixitup.State
     * @instance
     * @type        {number}
     * @default     -1
     */

    this.totalMatching = -1;

    /**
     * A boolean indicating whether the last operation "failed", i.e. no targets
     * could be found matching the filter.
     *
     * @name        hasFailed
     * @memberof    mixitup.State
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.hasFailed = false;

    /**
     * The DOM element that was clicked if the last oepration was triggered by the
     * clicking of a control and not an API call.
     *
     * @name        triggerElement
     * @memberof    mixitup.State
     * @instance
     * @type        {Element|null}
     * @default     null
     */

    this.triggerElement = null;

    this._execAction('_constructor', 1);

    h.seal(this);
};

mixitup.State.prototype = Object.create(mixitup.basePrototype);

h.extend(mixitup.State.prototype, {
    _actions: {},
    _filters: {}
});
/* global mixitup, h */

/**
 * `mixitup.State` objects expose various pieces of data detailing the state of
 * a MixItUp instance. They are provided at the start and end of any operation via
 * callbacks and events, with the most recent state stored between operations
 * for retrieval at any time via the API.
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @public
 * @since       3.0.0
 */

mixitup.State = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /**
     * The ID of the mixer instance.
     *
     * @name        id
     * @memberof    mixitup.State
     * @instance
     * @type        {string}
     * @default     ''
     */

    this.id = '';

    /**
     * The currently active filter command as set by a control click or API call.
     *
     * @name        activeFilter
     * @memberof    mixitup.State
     * @instance
     * @type        {mixitup.CommandFilter}
     * @default     null
     */

    this.activeFilter = null;

    /**
     * The currently active sort command as set by a control click or API call.
     *
     * @name        activeSort
     * @memberof    mixitup.State
     * @instance
     * @type        {mixitup.CommandSort}
     * @default     null
     */

    this.activeSort = null;

    /**
     * The current layout-specific container class name, if applied.
     *
     * @name        activeContainerClassName
     * @memberof    mixitup.State
     * @instance
     * @type        {string}
     * @default     ''
     */

    this.activeContainerClassName = '';

    /**
     * A reference to the container element that the mixer is instantiated on.
     *
     * @name        container
     * @memberof    mixitup.State
     * @instance
     * @type        {Element}
     * @default     null
     */

    this.container = null;

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
     * The DOM element that was clicked if the last operation was triggered by the
     * clicking of a control and not an API call.
     *
     * @name        triggerElement
     * @memberof    mixitup.State
     * @instance
     * @type        {Element|null}
     * @default     null
     */

    this.triggerElement = null;

    /**
     * The currently active dataset underlying the rendered targets, if the
     * dataset API is in use.
     *
     * @name        activeDataset
     * @memberof    mixitup.State
     * @instance
     * @type        {Array.<object>}
     * @default     null
     */

    this.activeDataset = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.State);

mixitup.State.prototype = Object.create(mixitup.Base.prototype);

mixitup.State.prototype.constructor = mixitup.State;
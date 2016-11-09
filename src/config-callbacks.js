/* global mixitup, h */

/**
 * A group of optional callback functions to be invoked at various
 * points within the lifecycle of a mixer operation.
 *
 * Each function is analogous to an event of the same name triggered from the
 * container element, and is invoked immediately after it.
 *
 * All callback functions receive the current `state` object as their first
 * argument, as well as other more specific arguments described below.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        callbacks
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigCallbacks = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /**
     * A callback function invoked immediately after any MixItUp operation is requested
     * and before animations have begun.
     *
     * A second `futureState` argument is passed to the function which represents the final
     * state of the mixer once the requested operation has completed.
     *
     * @example <caption>Example: Adding an `onMixStart` callback function</caption>
     * var mixer = mixitup(containerEl, {
     *     callbacks: {
     *         onMixStart: function(state, futureState) {
     *              console.log('Starting operation...');
     *         }
     *     }
     * });
     *
     * @name        onMixStart
     * @memberof    mixitup.Config.callbacks
     * @instance
     * @type        {function}
     * @default     null
     */

    this.onMixStart = null;

    /**
     * A callback function invoked when a MixItUp operation is requested while another
     * operation is in progress, and the animation queue is full, or queueing
     * is disabled.
     *
     * @example <caption>Example: Adding an `onMixBusy` callback function</caption>
     * var mixer = mixitup(containerEl, {
     *     callbacks: {
     *         onMixBusy: function(state) {
     *              console.log('Mixer busy');
     *         }
     *     }
     * });
     *
     * @name        onMixBusy
     * @memberof    mixitup.Config.callbacks
     * @instance
     * @type        {function}
     * @default     null
     */

    this.onMixBusy  = null;

    /**
     * A callback function invoked after any MixItUp operation has completed, and the
     * state has been updated.
     *
     * @example <caption>Example: Adding an `onMixEnd` callback function</caption>
     * var mixer = mixitup(containerEl, {
     *     callbacks: {
     *         onMixEnd: function(state) {
     *              console.log('Operation complete');
     *         }
     *     }
     * });
     *
     * @name        onMixEnd
     * @memberof    mixitup.Config.callbacks
     * @instance
     * @type        {function}
     * @default     null
     */

    this.onMixEnd   = null;

    /**
     * A callback function invoked whenever an operation "fails", i.e. no targets
     * could be found matching the requested filter.
     *
     * @example <caption>Example: Adding an `onMixFail` callback function</caption>
     * var mixer = mixitup(containerEl, {
     *     callbacks: {
     *         onMixFail: function(state) {
     *              console.log('No items could be found matching the requested filter');
     *         }
     *     }
     * });
     *
     * @name        onMixFail
     * @memberof    mixitup.Config.callbacks
     * @instance
     * @type        {function}
     * @default     null
     */

    this.onMixFail  = null;

    /**
     * A callback function invoked whenever a MixItUp control is clicked, and before its
     * respective operation is requested.
     *
     * The clicked element is assigned to the `this` keyword within the function. The original
     * click event is passed to the function as the second argument, which can be useful if
     * using `<a>` tags as controls where the default behavior needs to be prevented.
     *
     * Returning `false` from the callback will prevent the control click from triggering
     * an operation.
     *
     * @example <caption>Example 1: Adding an `onMixClick` callback function</caption>
     * var mixer = mixitup(containerEl, {
     *     callbacks: {
     *         onMixClick: function(state, originalEvent) {
     *              console.log('The control "' + this.innerText + '" was clicked');
     *         }
     *     }
     * });
     *
     * @example <caption>Example 2: Using `onMixClick` to manipulate the original click event</caption>
     * var mixer = mixitup(containerEl, {
     *     callbacks: {
     *         onMixClick: function(state, originalEvent) {
     *              // Prevent original click event from bubbling up:
     *              originalEvent.stopPropagation();
     *
     *              // Prevent default behavior of clicked element:
     *              originalEvent.preventDefault();
     *         }
     *     }
     * });
     *
     * @example <caption>Example 3: Using `onMixClick` to conditionally cancel operations</caption>
     * var mixer = mixitup(containerEl, {
     *     callbacks: {
     *         onMixClick: function(state, originalEvent) {
     *              // Perform some conditional check:
     *
     *              if (myApp.isLoading) {
     *                  // By returning false, we can prevent the control click from triggering an operation.
     *
     *                  return false;
     *              }
     *         }
     *     }
     * });
     *
     * @name        onMixClick
     * @memberof    mixitup.Config.callbacks
     * @instance
     * @type        {function}
     * @default     null
     */

    this.onMixClick = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigCallbacks);

mixitup.ConfigCallbacks.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigCallbacks.prototype.constructor = mixitup.ConfigCallbacks;
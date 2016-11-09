/* global mixitup, h */

/**
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
     * A callback function invoked at the start of all operations, before animation has ocurred.
     * Both the current state and the "future state" are passed to the function as arguments.
     *
     * @example <caption>Example: Adding an `onMixStart` callback function</caption>
     * var mixer = mixitup(containerEl, {
     *     callbacks: {
     *         onMixStart: function(state, futureState) {
     *              console.log('starting operation...');
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
     * @name        onMixBusy
     * @memberof    mixitup.Config.callbacks
     * @instance
     * @type        {function}
     * @default     null
     */

    this.onMixBusy  = null;

    /**
     * @name        onMixEnd
     * @memberof    mixitup.Config.callbacks
     * @instance
     * @type        {function}
     * @default     null
     */

    this.onMixEnd   = null;

    /**
     * @name        onMixFail
     * @memberof    mixitup.Config.callbacks
     * @instance
     * @type        {function}
     * @default     null
     */

    this.onMixFail  = null;

    /**
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
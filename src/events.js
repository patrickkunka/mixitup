/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.EventDetail = function() {
    this.state          = null;
    this.futureState    = null;
    this.instance       = null;
    this.originalEvent  = null;
};

/**
 * The `mixitup.Events` class contains all custom events dispatched by MixItUp at various
 * points within the lifecycle of a mixer operation.
 *
 * Each event is analogous to the callback function of the same name defined in
 * the `callbacks` configuration object, and is triggered immediately before it.
 *
 * Events are always triggered from the container element on which MixItUp is instantiated
 * upon.
 *
 * As with any event, registered event handlers receive the event object as a parameter
 * which includes a `detail` property containting references to the current `state`,
 * the `mixer` instance, and other event-specific properties described below.
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @public
 * @since       3.0.0
 */

mixitup.Events = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /**
     * A custom event triggered immediately after any MixItUp operation is requested
     * and before animations have begun.
     *
     * The `mixStart` event also exposes a `futureState` property via the
     * `event.detail` object, which represents the final state of the mixer once
     * the requested operation has completed.
     *
     * @name        mixStart
     * @memberof    mixitup.Events
     * @static
     * @type        {CustomEvent}
     */

    this.mixStart = null;

    /**
     * A custom event triggered when a MixItUp operation is requested while another
     * operation is in progress, and the animation queue is full, or queueing
     * is disabled.
     *
     * @name        mixBusy
     * @memberof    mixitup.Events
     * @static
     * @type        {CustomEvent}
     */

    this.mixBusy = null;

    /**
     * A custom event triggered after any MixItUp operation has completed, and the
     * state has been updated.
     *
     * @name        mixEnd
     * @memberof    mixitup.Events
     * @static
     * @type        {CustomEvent}
     */

    this.mixEnd = null;

    /**
     * A custom event triggered whenever a filter operation "fails", i.e. no targets
     * could be found matching the requested filter.
     *
     * @name        mixFail
     * @memberof    mixitup.Events
     * @static
     * @type        {CustomEvent}
     */

    this.mixFail = null;

    /**
     * A custom event triggered whenever a MixItUp control is clicked, and before its
     * respective operation is requested.
     *
     * This event also exposes an `originalEvent` property via the `event.detail`
     * object, which holds a reference to the original click event.
     *
     * @name        mixClick
     * @memberof    mixitup.Events
     * @static
     * @type        {CustomEvent}
     */

    this.mixClick = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.Events);

mixitup.Events.prototype = Object.create(mixitup.Base.prototype);

mixitup.Events.prototype.constructor = mixitup.Events;

/**
 * @private
 * @param   {string}      eventType
 * @param   {Element}     el
 * @param   {object}      detail
 * @param   {Document}    [doc]
 */

mixitup.Events.prototype.fire = function(eventType, el, detail, doc) {
    var self        = this,
        event       = null,
        eventDetail = new mixitup.EventDetail();

    self.callActions('beforeFire', arguments);

    if (typeof self[eventType] === 'undefined') {
        throw new Error('Event type "' + eventType + '" not found.');
    }

    eventDetail.state = new mixitup.State();

    h.extend(eventDetail.state, detail.state);

    if (detail.futureState) {
        eventDetail.futureState = new mixitup.State();

        h.extend(eventDetail.futureState, detail.futureState);
    }

    eventDetail.instance = detail.instance;

    if (detail.originalEvent) {
        eventDetail.originalEvent = detail.originalEvent;
    }

    event = h.getCustomEvent(eventType, eventDetail, doc);

    self.callFilters('eventFire', event, arguments);

    el.dispatchEvent(event);
};

// Asign a singleton instance to `mixitup.events`:

mixitup.events = new mixitup.Events();
/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.Messages = function() {
    mixitup.BasePrototype.call(this);

    this.execAction('construct', 0);

    /* 100 - 149: General errors
    ----------------------------------------------------------------------------- */

    this[100] = '[MixItUp] 100 ERROR: An invalid selector or element was passed to ' +
                'the mixitup factory function.';

    this[101] = '[MixItUp] 101 ERROR: Invalid effects string';

    /* 150-199: Public API method-specific errors
    ----------------------------------------------------------------------------- */

    this[150] = '[MixItUp] 150 ERROR: No elements were passed to "insert"';

    this[151] = '[MixItUp] 151 ERROR: An element to be inserted already exists in ' +
                'the container';

    /* 200-249: General warnings
    ----------------------------------------------------------------------------- */

    this[200] = '[MixItUp] 200 WARNING: This element already has an active MixItUp ' +
                'instance. The provided configuration object will be ignored. If you ' +
                'wish to perform additional methods on this instance, please create ' +
                'a reference.';

    this[201] = '[MixItUp] 201 WARNING: An operation was requested but the MixItUp ' +
                'instance was busy. The operation was rejected because queueing is ' +
                'disabled or the queue is full.';

    this[202] = '[MixItUp] 202 WARNING: Operations cannot be requested while MixItUp ' +
                'is busy.';

    this[203] = '[MixItUp] 203 WARNING: No available Promise implementations were found. ' +
                'Please provide a promise library to the configuration object.';

    /* 250-299: Public API method-specific warnings
    ----------------------------------------------------------------------------- */

    this[250] = '[MixItUp] 250 WARNING: The requested sorting data attribute was not ' +
                'present on one or more target elements which may product unexpected ' +
                'sort output';

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.Messages);

mixitup.Messages.prototype = Object.create(mixitup.BasePrototype.prototype);

mixitup.Messages.prototype.constructor = mixitup.Messages;

// Asign a singleton instance to `mixitup.messages`:

mixitup.messages = new mixitup.Messages();
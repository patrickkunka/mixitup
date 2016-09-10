/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.Messages = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /* 100 - 199: Instantiation/init/config errors
    ----------------------------------------------------------------------------- */

    this[100] = '[MixItUp] ERROR 100: An invalid selector or element was passed to ' +
                'the mixitup factory function.';

    this[101] = '[MixItUp] ERROR 101: Invalid value for `config.animation.effects`';

    this[102] = '[MixItUp] ERROR 102: Invalid value for `config.controls.scope`';

    /* 200-299: API/runtime errors
    ----------------------------------------------------------------------------- */

    this[200] = '[MixItUp] ERROR 200: No elements were passed to "insert"';

    this[201] = '[MixItUp] ERROR 201: An element to be inserted already exists in ' +
                'the container';

    /* 300-399: Warnings
    ----------------------------------------------------------------------------- */

    this[300] = '[MixItUp] WARNING 300: This element already has an active MixItUp ' +
                'instance. The provided configuration object will be ignored. If you ' +
                'wish to perform additional methods on this instance, please create ' +
                'a reference.';

    this[301] = '[MixItUp] WARNING 301: An operation was requested but the MixItUp ' +
                'instance was busy. The operation was rejected because queueing is ' +
                'disabled or the queue is full.';

    this[302] = '[MixItUp] WARNING 302: Operations cannot be requested while MixItUp ' +
                'is busy.';

    this[303] = '[MixItUp] WARNING 303: No available Promise implementations were found. ' +
                'Please provide a promise library to the configuration object.';

    this[304] = '[MixItUp] WARNING 304: The requested sorting data attribute was not ' +
                'present on one or more target elements which may product unexpected ' +
                'sort output';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.Messages);

mixitup.Messages.prototype = Object.create(mixitup.Base.prototype);

mixitup.Messages.prototype.constructor = mixitup.Messages;

// Asign a singleton instance to `mixitup.messages`:

mixitup.messages = new mixitup.Messages();
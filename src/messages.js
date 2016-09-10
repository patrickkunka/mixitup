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

    /* Errors
    ----------------------------------------------------------------------------- */

    this.ERROR_FACTORY_INVALID_CONTAINER = '[MixItUp] An invalid selector or element reference was passed to the mixitup factory function';

    this.ERROR_CONFIG_INVALID_ANIMATION_EFFECTS = '[MixItUp] Invalid value for `config.animation.effects`';

    this.ERROR_CONFIG_INVALID_CONTROLS_SCOPE = '[MixItUp] Invalid value for `config.controls.scope`';

    this.ERROR_INSERT_PREEXISTING_ELEMENT = '[MixItUp] An element to be inserted already exists in the container';

    /* Warnings
    ----------------------------------------------------------------------------- */

    this.WARNING_FACTORY_PREEXISTING_INSTANCE =
        '[MixItUp] WARNING: This element already has an active MixItUp instance. The provided configuration object will be ignored.' +
        ' If you wish to perform additional methods on this instance, please create a reference.';

    this.WARNING_INSERT_NO_ELEMENTS = '[MixItUp] WARNING: No element were passed to `.insert()`';

    this.WARNING_MULTIMIX_INSTANCE_QUEUE_FULL =
        '[MixItUp] WARNING: An operation was requested but the MixItUp instance was busy. The operation was rejected because the ' +
        ' queue is full or queuing is disabled.';

    this.WARNING_GET_OPERATION_INSTANCE_BUSY =
        '[MixItUp] WARNING: Operations can be be created while the MixItUp instance is busy.';

    this.WARNING_NO_PROMISE_IMPLEMENTATION =
        '[MixItUp] WARNING: No Promise implementations could be found. If you wish to use promises with MixItUp please install' +
        ' an ES6 Promise polyfill.';

    this.WARNING_INCONSISTENT_SORTING_ATTRIBUTES =
        '[MixItUp] WARNING: The requested sorting data attribute was not present on one or more target elements which may product' +
        ' unexpected sort output';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.Messages);

mixitup.Messages.prototype = Object.create(mixitup.Base.prototype);

mixitup.Messages.prototype.constructor = mixitup.Messages;

mixitup.messages = new mixitup.Messages();
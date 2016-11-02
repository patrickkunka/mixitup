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

    this.ERROR_FACTORY_INVALID_CONTAINER = h.template(
        '[MixItUp] An invalid selector or element reference was passed to the mixitup factory function'
    );

    this.ERROR_FACTORY_CONTAINER_NOT_FOUND = h.template(
        '[MixItUp] The provided selector yielded no container element'
    );

    this.ERROR_CONFIG_INVALID_ANIMATION_EFFECTS = h.template(
        '[MixItUp] Invalid value for `config.animation.effects`'
    );

    this.ERROR_CONFIG_INVALID_CONTROLS_SCOPE = h.template(
        '[MixItUp] Invalid value for `config.controls.scope`'
    );

    this.ERROR_CONFIG_INVALID_PROPERTY = h.template(
        '[MixitUp] Invalid configuration object property "${erroneous}"${suggestion}'
    );

    this.ERROR_CONFIG_INVALID_PROPERTY_SUGGESTION = h.template(
        '. Did you mean "${probableMatch}"?'
    );

    this.ERROR_CONFIG_DATA_UID_NOT_SET = h.template(
        '[MixItUp] To use the dataset API, a UID key must be specified using `config.data.uid`'
    );

    this.ERROR_DATASET_INVALID_UID = h.template(
        '[MixItUp] The specified UID key "${uid}" is not present on one or more dataset items'
    );

    this.ERROR_DATASET_DUPLICATE_UID = h.template(
        '[MixItUp] The UID "${uid}" was found on two or more dataset items. UIDs must be unique.'
    );

    this.ERROR_INSERT_PREEXISTING_ELEMENT = h.template(
        '[MixItUp] An element to be inserted already exists in the container'
    );

    this.ERROR_FILTER_INVALID_ARGUMENTS = h.template(
        '[MixItUp] Please provide either a selector or collection `.filter()`, not both'
    );

    this.ERROR_DATASET_NOT_SET = h.template(
        '[MixItUp] To use the dataset API, a starting dataset must be set using `config.load.dataset`'
    );

    this.ERROR_DATASET_PRERENDERED_MISMATCH = h.template(
        '[MixItUp] `config.load.dataset` does not match pre-rendered targets'
    );

    this.ERROR_DATASET_RENDERER_NOT_SET = h.template(
        '[MixItUp] To insert an element via the dataset API, a target renderer function must be provided to `config.render.target`'
    );

    /* Warnings
    ----------------------------------------------------------------------------- */

    this.WARNING_FACTORY_PREEXISTING_INSTANCE = h.template(
        '[MixItUp] WARNING: This element already has an active MixItUp instance. The provided configuration object will be ignored.' +
        ' If you wish to perform additional methods on this instance, please create a reference.'
    );

    this.WARNING_INSERT_NO_ELEMENTS = h.template(
        '[MixItUp] WARNING: No element were passed to `.insert()`'
    );

    this.WARNING_MULTIMIX_INSTANCE_QUEUE_FULL = h.template(
        '[MixItUp] WARNING: An operation was requested but the MixItUp instance was busy. The operation was rejected because the ' +
        ' queue is full or queuing is disabled.'
    );

    this.WARNING_GET_OPERATION_INSTANCE_BUSY = h.template(
        '[MixItUp] WARNING: Operations can be be created while the MixItUp instance is busy.'
    );

    this.WARNING_NO_PROMISE_IMPLEMENTATION = h.template(
        '[MixItUp] WARNING: No Promise implementations could be found. If you wish to use promises with MixItUp please install' +
        ' an ES6 Promise polyfill.'
    );

    this.WARNING_INCONSISTENT_SORTING_ATTRIBUTES = h.template(
        '[MixItUp] WARNING: The requested sorting data attribute was not present on one or more target elements which may product' +
        ' unexpected sort output'
    );

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.Messages);

mixitup.Messages.prototype = Object.create(mixitup.Base.prototype);

mixitup.Messages.prototype.constructor = mixitup.Messages;

mixitup.messages = new mixitup.Messages();
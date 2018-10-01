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

    this.ERROR_FACTORY_INVALID_CONTAINER =
        '[MixItUp] An invalid selector or element reference was passed to the mixitup factory function';

    this.ERROR_FACTORY_CONTAINER_NOT_FOUND =
        '[MixItUp] The provided selector yielded no container element';

    this.ERROR_CONFIG_INVALID_ANIMATION_EFFECTS =
        '[MixItUp] Invalid value for `animation.effects`';

    this.ERROR_CONFIG_INVALID_CONTROLS_SCOPE =
        '[MixItUp] Invalid value for `controls.scope`';

    this.ERROR_CONFIG_INVALID_PROPERTY =
        '[MixitUp] Invalid configuration object property "${erroneous}"${suggestion}';

    this.ERROR_CONFIG_INVALID_PROPERTY_SUGGESTION =
        '. Did you mean "${probableMatch}"?';

    this.ERROR_CONFIG_DATA_UID_KEY_NOT_SET =
        '[MixItUp] To use the dataset API, a UID key must be specified using `data.uidKey`';

    this.ERROR_DATASET_INVALID_UID_KEY =
        '[MixItUp] The specified UID key "${uidKey}" is not present on one or more dataset items';

    this.ERROR_DATASET_DUPLICATE_UID =
        '[MixItUp] The UID "${uid}" was found on two or more dataset items. UIDs must be unique.';

    this.ERROR_INSERT_INVALID_ARGUMENTS =
        '[MixItUp] Please provider either an index or a sibling and position to insert, not both';

    this.ERROR_INSERT_PREEXISTING_ELEMENT =
        '[MixItUp] An element to be inserted already exists in the container';

    this.ERROR_FILTER_INVALID_ARGUMENTS =
        '[MixItUp] Please provide either a selector or collection `.filter()`, not both';

    this.ERROR_DATASET_NOT_SET =
        '[MixItUp] To use the dataset API with pre-rendered targets, a starting dataset must be set using `load.dataset`';

    this.ERROR_DATASET_PRERENDERED_MISMATCH =
        '[MixItUp] `load.dataset` does not match pre-rendered targets';

    this.ERROR_DATASET_RENDERER_NOT_SET =
        '[MixItUp] To insert an element via the dataset API, a target renderer function must be provided to `render.target`';

    this.ERROR_SORT_NON_EXISTENT_ELEMENT =
        '[MixItUp] An element to be sorted does not already exist in the container';

    /* Warnings
    ----------------------------------------------------------------------------- */

    this.WARNING_FACTORY_PREEXISTING_INSTANCE =
        '[MixItUp] WARNING: This element already has an active MixItUp instance. The provided configuration object will be ignored.' +
        ' If you wish to perform additional methods on this instance, please create a reference.';

    this.WARNING_INSERT_NO_ELEMENTS =
        '[MixItUp] WARNING: No valid elements were passed to `.insert()`';

    this.WARNING_REMOVE_NO_ELEMENTS =
        '[MixItUp] WARNING: No valid elements were passed to `.remove()`';

    this.WARNING_MULTIMIX_INSTANCE_QUEUE_FULL =
        '[MixItUp] WARNING: An operation was requested but the MixItUp instance was busy. The operation was rejected because the ' +
        'queue is full or queuing is disabled.';

    this.WARNING_GET_OPERATION_INSTANCE_BUSY =
        '[MixItUp] WARNING: Operations can be be created while the MixItUp instance is busy.';

    this.WARNING_NO_PROMISE_IMPLEMENTATION =
        '[MixItUp] WARNING: No Promise implementations could be found. If you wish to use promises with MixItUp please install' +
        ' an ES6 Promise polyfill.';

    this.WARNING_INCONSISTENT_SORTING_ATTRIBUTES =
        '[MixItUp] WARNING: The requested sorting data attribute "${attribute}" was not present on one or more target elements' +
        ' which may product unexpected sort output';

    this.callActions('afterConstruct');

    this.compileTemplates();

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.Messages);

mixitup.Messages.prototype = Object.create(mixitup.Base.prototype);

mixitup.Messages.prototype.constructor = mixitup.Messages;

/**
 * @return {void}
 */

mixitup.Messages.prototype.compileTemplates = function() {
    var errorKey        = '';
    var errorMessage    = '';

    for (errorKey in this) {
        if (typeof (errorMessage = this[errorKey]) !== 'string') continue;

        this[h.camelCase(errorKey)] = h.template(errorMessage);
    }
};

mixitup.messages = new mixitup.Messages();
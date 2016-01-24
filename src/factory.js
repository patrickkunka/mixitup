/* global mixitup:true, h */

/**
 * The `mixitup` factory function is used to create discreet instances
 * of MixItUp, also known as "Mixers" in v3.
 *
 * It is the first entry point for the v3 API, and abstracts away the
 * functionality of instantiating `Mixer` objects directly.
 *
 * @example
 * mixitup(container [,config] [,foreignDoc])
 *
 * @global
 * @namespace
 * @public
 * @kind        function
 * @since       3.0.0
 * @param       {(Element|Element[]|string)}        container
 * An element, collection, or selector string representing the container(s) on which to instantiate MixItUp.
 * @param       {object}                            [config]
 *      An optional "configuration object" used to customize the behavior of the MixItUp instance.
 * @param       {object}                            [foreignDoc]
 *      An optional reference to a `document`, which can be used to control a MixItUp instance in an iframe.
 * @param       {boolean}                           [returnCollection]
 *
 * @return      {mixitup.Mixer|mixitup.Collection}
 *      A "mixer" object representing the instance of MixItUp, or a collection of
 * mixers if instantiating on multiple containers.
 */

mixitup = function(container, config, foreignDoc, returnCollection) {
    var el          = null,
        instance    = null,
        doc         = null,
        instances   = [],
        id          = '',
        name        = '',
        elements    = [],
        i           = -1;

    doc = foreignDoc || window.document;

    if (config && typeof config.extensions === 'object') {
        for (name in config.extensions) {
            // Call the extension's factory function, passing
            // the mixitup factory as a paramater

            config.extensions[name](mixitup);
        }
    }

    if (
        (
            !container ||
            (typeof container !== 'string' && typeof container !== 'object')
        ) &&
        h.canReportErrors(config)
    ) {
        throw new Error(mixitup.messages[100]);
    }

    switch (typeof container) {
        case 'string':
            elements = doc.querySelectorAll(container);

            break;
        case 'object':
            if (h.isElement(container, doc)) {
                elements = [container];
            } else if (container.length) {
                elements = container;
            }

            break;
    }

    for (i = 0; el = elements[i]; i++) {
        if (!el.id) {
            id = 'MixItUp' + h.randomHexKey();

            el.id = id;
        } else {
            id = el.id;
        }

        if (typeof mixitup.instances[id] === 'undefined') {
            instance = new mixitup.Mixer();

            instance._id            = id;
            instance._dom.document  = foreignDoc || window.document;

            instance._init(el, config);

            mixitup.instances[id] = instance;
        } else if (mixitup.instances[id] instanceof mixitup.Mixer) {
            instance = mixitup.instances[id];

            if (config && h.canReportErrors(config)) {
                console.warn(mixitup.messages[200]);
            }
        }

        instances.push(instance);
    }

    if (returnCollection) {
        return new mixitup.Collection(instances);
    } else {
        return instances[0];
    }
};

/**
 * Returns a mixitup.Collection of one or more instances
 * that can be operated on simultaneously, similar to a jQuery collection.
 * If the user specifically wants to control a collection, they should use this.
 *
 * @memberof    mixitup
 * @public
 * @since       3.0.0
 * @param       {(Element|Element[]|string)}  container
 * @param       {object}                      [config]
 * @param       {object}                      [foreignDoc]
 * @return      {mixitup.Collection}
 */

mixitup.all = function(container, config, foreignDoc) {
    var self = this;

    return self(container, config, foreignDoc, true);
};

/**
 * Stores all current instances of MixItUp in the current session, using their IDs as keys.
 *
 * @private
 * @static
 * @since   2.0.0
 * @type    {object}
 */

mixitup.instances = {};
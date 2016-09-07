/* global mixitup:true, h */

/**
 * The `mixitup` "factory" function is used to create discreet instances
 * of MixItUp, or "mixers". When loading MixItUp via a `<script>` tag, the
 * factory function is accessed as the global variable `mixitup`. When using
 * a module loader such as Browserify or RequireJS however, the factory
 * function is exported directly into your module when you require
 * the MixItUp library.
 *
 * It is the first entry point for the v3 API, and abstracts away the
 * functionality of instantiating mixer objects directly.
 *
 * The factory function also checks whether or not a MixItUp instance is
 * already active on specified element, and if so, returns that instance
 * rather than creating a duplicate.
 *
 * @example
 * mixitup(container [,config] [,foreignDoc])
 *
 * @global
 * @namespace
 * @public
 * @kind        function
 * @since       3.0.0
 * @param       {(Element|string)}  container
 *      A DOM element or selector string representing the container(s) on which to instantiate MixItUp.
 * @param       {object}            [config]
 *      An optional "configuration object" used to customize the behavior of the MixItUp instance.
 * @param       {object}            [foreignDoc]
 *      An optional reference to a `document`, which can be used to control a MixItUp instance in an iframe.
 * @return      {mixitup.Mixer}
 *      A "mixer" object representing the instance of MixItUp
 */

mixitup = function(container, config, foreignDoc) {
    var el                  = null,
        returnCollection    = false,
        instance            = null,
        doc                 = null,
        output              = null,
        instances           = [],
        id                  = '',
        elements            = [],
        i                   = -1;

    doc = foreignDoc || window.document;

    if (returnCollection = arguments[3]) {
        // A non-documented 4th paramater set only if the V2 API is in-use via a jQuery shim

        returnCollection = typeof returnCollection === 'boolean';
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
                // Although not documented, the container may also be an array-like list of
                // elements such as a NodeList or jQuery collection. In the case if using the
                // V2 API via a jQuery shim, the container will typically be passed in this form.

                elements = container;
            }

            break;
    }

    for (i = 0; el = elements[i]; i++) {
        if (i > 0 && !returnCollection) break;

        if (!el.id) {
            id = 'MixItUp' + h.randomHexKey();

            el.id = id;
        } else {
            id = el.id;
        }

        if (typeof mixitup.instances[id] === 'undefined') {
            instance = new mixitup.Mixer();

            instance.attach(el, doc, id, config);

            mixitup.instances[id] = instance;
        } else if (mixitup.instances[id] instanceof mixitup.Mixer) {
            instance = mixitup.instances[id];

            if (config && h.canReportErrors(config)) {
                console.warn(mixitup.messages[300]);
            }
        }

        instances.push(instance);
    }

    if (returnCollection) {
        output = new mixitup.Collection(instances);
    } else {
        // Return the first instance regardless

        output = instances[0];
    }

    return output;
};

/**
 * The `.use()` static method is used to register compatible MixItUp extensions, thus
 * extending the functionality of MixItUp.
 *
 * @example
 * mixitup.use(extension)
 *
 * @public
 * @static
 * @since   3.0.0
 * @param   {function}  extension   A reference to the extension to be used.
 * @return  {void}
 */

mixitup.use = function(extension) {
    // Call the extension's factory function, passing
    // the mixitup factory as a paramater

    extension(mixitup);
};

/**
 * Stores all instances of MixItUp in the current session, using their IDs as keys.
 *
 * @private
 * @static
 * @since   2.0.0
 * @type    {object}
 */

mixitup.instances = {};
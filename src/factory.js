/* global mixitup:true, h */

/**
 * The `mixitup()` "factory" function creates and returns individual instances
 * of MixItUp, known as "mixers", on which API methods can be called.
 *
 * When loading MixItUp via a script tag, the factory function is accessed
 * via the global variable `mixitup`. When using a module loading
 * system (e.g. ES2015, CommonJS, RequireJS), the factory function is
 * exported into your module when you require the MixItUp library.
 *
 * @example
 * mixitup(container [,config] [,foreignDoc])
 *
 * @example <caption>Example 1: Creating a mixer instance with an element reference</caption>
 * var containerEl = document.querySelector('.container');
 *
 * var mixer = mixitup(containerEl);
 *
 * @example <caption>Example 2: Creating a mixer instance with a selector string</caption>
 * var mixer = mixitup('.container');
 *
 * @example <caption>Example 3: Passing a configuration object</caption>
 * var mixer = mixitup(containerEl, {
 *     animation: {
 *         effects: 'fade scale(0.5)'
 *     }
 * });
 *
 * @example <caption>Example 4: Passing an iframe reference</caption>
 * var mixer = mixitup(containerEl, config, foreignDocument);
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
 *      A "mixer" object holding the MixItUp instance.
 */

mixitup = function(container, config, foreignDoc) {
    var el                  = null,
        returnCollection    = false,
        instance            = null,
        facade              = null,
        doc                 = null,
        output              = null,
        instances           = [],
        id                  = '',
        elements            = [],
        i                   = -1;

    doc = foreignDoc || window.document;

    if (returnCollection = arguments[3]) {
        // A non-documented 4th paramater enabling control of multiple instances

        returnCollection = typeof returnCollection === 'boolean';
    }

    if (typeof container === 'string') {
        elements = doc.querySelectorAll(container);
    } else if (container && typeof container === 'object' && h.isElement(container, doc)) {
        elements = [container];
    } else if (container && typeof container === 'object' && container.length) {
        // Although not documented, the container may also be an array-like list of
        // elements such as a NodeList or jQuery collection, is returnCollection is true

        elements = container;
    } else {
        throw new Error(mixitup.messages.errorFactoryInvalidContainer());
    }

    if (elements.length < 1) {
        throw new Error(mixitup.messages.errorFactoryContainerNotFound());
    }

    for (i = 0; el = elements[i]; i++) {
        if (i > 0 && !returnCollection) break;

        if (!el.id) {
            id = 'MixItUp' + h.randomHex();

            el.id = id;
        } else {
            id = el.id;
        }

        if (mixitup.instances[id] instanceof mixitup.Mixer) {
            instance = mixitup.instances[id];

            if (!config || (config && config.debug && config.debug.showWarnings !== false)) {
                console.warn(mixitup.messages.warningFactoryPreexistingInstance());
            }
        } else {
            instance = new mixitup.Mixer();

            instance.attach(el, doc, id, config);

            mixitup.instances[id] = instance;
        }

        facade = new mixitup.Facade(instance);

        if (config && config.debug && config.debug.enable) {
            instances.push(instance);
        } else {
            instances.push(facade);
        }
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
 * The `.use()` static method is used to extend the functionality of mixitup with compatible
 * extensions and libraries in an environment with modular scoping e.g. ES2015, CommonJS, or RequireJS.
 *
 * You need only call the `.use()` function once per project, per extension, as module loaders
 * will cache a single reference to MixItUp inclusive of all changes made.
 *
 * @example
 * mixitup.use(extension)
 *
 * @example <caption>Example 1: Extending MixItUp with the Pagination Extension</caption>
 *
 * import mixitup from 'mixitup';
 * import mixitupPagination from 'mixitup-pagination';
 *
 * mixitup.use(mixitupPagination);
 *
 * // All mixers created by the factory function in all modules will now
 * // have pagination functionality
 *
 * var mixer = mixitup('.container');
 *
 * @public
 * @name     use
 * @memberof mixitup
 * @kind     function
 * @static
 * @since    3.0.0
 * @param    {*}  extension   A reference to the extension or library to be used.
 * @return   {void}
 */

mixitup.use = function(extension) {
    mixitup.Base.prototype.callActions.call(mixitup, 'beforeUse', arguments);

    // Call the extension's factory function, passing
    // the mixitup factory as a paramater

    if (typeof extension === 'function' && extension.TYPE === 'mixitup-extension') {
        // Mixitup extension

        if (typeof mixitup.extensions[extension.NAME] === 'undefined') {
            extension(mixitup);

            mixitup.extensions[extension.NAME] = extension;
        }
    } else if (extension.fn && extension.fn.jquery) {
        // jQuery

        mixitup.libraries.$ = extension;
    }

    mixitup.Base.prototype.callActions.call(mixitup, 'afterUse', arguments);
};

mixitup.instances   = {};
mixitup.extensions  = {};
mixitup.libraries   = {};
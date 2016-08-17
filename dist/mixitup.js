/**!
 * MixItUp v3.0.0-beta
 * Build 796b6c76-2a02-4d23-ac86-13558567810f
 *
 * @copyright Copyright 2014-2016 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://kunkalabs.com/mixitup/
 *
 * @license   Commercial use requires a commercial license.
 *            https://kunkalabs.com/mixitup/licenses
 *
 *            Non-commercial use permitted under same terms as  license.
 *            http://creativecommons.org/licenses/by-nc/3.0/
 */

(function(window) {
    'use strict';

    var mixitup         = null,
        h               = null;

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
            initialState        = null,
            doc                 = null,
            output              = null,
            instances           = [],
            id                  = '',
            name                = '',
            elements            = [],
            i                   = -1;

        doc = foreignDoc || window.document;

        if (returnCollection = arguments[3]) {
            // A non-documented 4th paramater set only if the V2 API is in-use via a jQuery shim

            returnCollection = typeof returnCollection === 'boolean';
        }

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

                instance._id            = id;
                instance._dom.document  = foreignDoc || window.document;

                initialState = instance._init(el, config);

                instance._state = initialState;

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
            output = new mixitup.Collection(instances);
        } else {
            // Return the first instance regardless

            output = instances[0];
        }

        return output;
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

    /**
     * A small library of commonly-used helper functions. This is just a subset of
     * the complete "h" library, with some additional functions added specifically
     * for MixItUp.
     *
     * @author      Kunkalabs Limited
     * @global
     * @namespace
     * @private
     */

    h = {

        /**
         * @private
         * @param   {Element}   el
         * @param   {string}    cls
         * @return  {boolean}
         */

        hasClass: function(el, cls) {
            return el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },

        /**
         * @private
         * @param   {Element}   el
         * @param   {string}    cls
         * @return  {void}
         */

        addClass: function(el, cls) {
            if (!this.hasClass(el, cls)) el.className += el.className ? ' ' + cls : cls;
        },

        /**
         * @private
         * @param   {Element}   el
         * @param   {string}    cls
         * @return  {void}
         */

        removeClass: function(el, cls) {
            if (this.hasClass(el, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');

                el.className = el.className.replace(reg, ' ').trim();
            }
        },

        /**
         * Merges the properties of the source object onto the
         * target object. Alters the target object.
         *
         * @private
         * @param   {object}    target
         * @param   {object}    source
         * @param   {boolean}   [deep]
         * @return  {void}
         */

        extend: function(target, source, deep) {
            var self        = this,
                getter      = null,
                setter      = null,
                sourceKeys  = [],
                key         = '',
                i           = -1;

            if (target === null) {
                throw new Error('Cannot extend into null');
            }

            if (source === null) {
                throw new Error('Cannot extend null into object');
            }

            if (Array.isArray(source)) {
                for (i = 0; i < source.length; i++) {
                    sourceKeys.push(i);
                }
            } else if (source) {
                sourceKeys = Object.keys(source);
            }

            for (i = 0; i < sourceKeys.length; i++) {
                key = sourceKeys[i];
                getter = source.__lookupGetter__(key);
                setter = source.__lookupSetter__(key);

                if (getter) {
                    // Getters

                    target.__defineGetter__(key, getter);
                } else if (setter) {
                    // Setters

                    target.__defineSetter__(key, setter);
                } else if (
                    deep &&
                    typeof source[key] === 'object' &&
                    source[key] !== null &&
                    !Array.isArray(source[key]) &&
                    !h.isElement(source[key])
                ) {
                    // Objects

                    if (
                        typeof target[key] === 'undefined' ||
                        target[key] === null
                    ) {
                        target[key] = {};
                    }

                    self.extend(target[key], source[key]);
                } else if (deep && Array.isArray(source[key])) {
                    // Arrays

                    if (typeof target[key] === 'undefined') {
                        target[key] = [];
                    }

                    self.extend(target[key], source[key]);
                } else {
                    // Strings, booleans, numbers, functions, and object references

                    target[key] = source[key];
                }
            }

            return target;
        },

        /**
         * @private
         * @param   {Element}   el
         * @param   {string}    type
         * @param   {function}  fn
         * @param   {boolean}   useCapture
         * @return  {void}
         */

        on: function(el, type, fn, useCapture) {
            if (!el) return;

            if (el.attachEvent) {
                el['e' + type + fn] = fn;

                el[type + fn] = function() {
                    el['e' + type + fn](window.event);
                };

                el.attachEvent('on' + type, el[type + fn]);
            } else {
                el.addEventListener(type, fn, useCapture);
            }
        },

        /**
         * @private
         * @param   {Element}   el
         * @param   {string}    type
         * @param   {function}  fn
         * @return  {void}
         */

        off: function(el, type, fn) {
            if (!el) return;

            if (el.detachEvent) {
                el.detachEvent('on' + type, el[type + fn]);
                el[type + fn] = null;
            } else {
                el.removeEventListener(type, fn, false);
            }
        },

        /**
         * @private
         * @param   {string}      eventType
         * @param   {object}      detail
         * @param   {Document}    [doc]
         * @return  {CustomEvent}
         */

        getCustomEvent: function(eventType, detail, doc) {
            var event = null;

            doc = doc || window.document;

            if (typeof window.CustomEvent === 'function') {
                event = new CustomEvent(eventType, {
                    detail: detail,
                    bubbles: true,
                    cancelable: true
                });
            } else {
                event = doc.createEvent('CustomEvent');
                event.initCustomEvent(eventType, true, true, detail);
            }

            return event;
        },

        /**
         * @private
         * @param {Event} e
         * @return {Event}
         */

        getOriginalEvent: function(e) {
            if (e.touches && e.touches.length) {
                return e.touches[0];
            } else if (e.changedTouches && e.changedTouches.length) {
                return e.changedTouches[0];
            } else {
                return e;
            }
        },

        /**
         * @private
         * @param   {Element}   el
         * @param   {string}    selector
         * @return  {Number}
         */

        index: function(el, selector) {
            var i = 0;

            while ((el = el.previousElementSibling) !== null) {
                if (!selector || el.matches(selector)) {
                    ++i;
                }
            }

            return i;
        },

        /**
         * @private
         * @param   {string}    str
         * @param   {boolean}   [isPascal]
         * @return  {string}
         */

        camelCase: function(str, isPascal) {
            var output = str.replace(/-([a-z])/g, function(g) {
                return g[1].toUpperCase();
            });

            if (isPascal) {
                return output.charAt(0).toUpperCase() + output.slice(1);
            } else {
                return output;
            }
        },

        /**
         * @private
         * @param   {string}    str
         * @return  {string}
         */

        dashCase: function(str) {
            return str.replace(/\W+/g, '-')
                .replace(/([a-z\d])([A-Z])/g, '$1-$2')
                .toLowerCase();
        },

        /**
         * @private
         * @param   {Element}   el
         * @param   {Document}  [doc]
         * @return  {boolean}
         */

        isElement: function(el, doc) {
            doc = doc || window.document;

            if (
                window.HTMLElement &&
                el instanceof HTMLElement
            ) {
                return true;
            } else if (
                doc.defaultView &&
                doc.defaultView.HTMLElement &&
                el instanceof doc.defaultView.HTMLElement
            ) {
                return true;
            } else {
                return (
                    el !== null &&
                    el.nodeType === 1 &&
                    el.nodeName === 'string'
                );
            }
        },

        /**
         * @private
         * @param   {string}            htmlString
         * @param   {Document}          [doc]
         * @return  {DocumentFragment}
         */

        createElement: function(htmlString, doc) {
            var frag = null,
                temp = null;

            doc = doc || window.document;

            frag = doc.createDocumentFragment();
            temp = doc.createElement('div');

            temp.innerHTML = htmlString;

            while (temp.firstChild) {
                frag.appendChild(temp.firstChild);
            }

            return frag;
        },

        /**
         * @private
         * @param   {Element}   el
         * @return  {void}
         */

        deleteElement: function(el) {
            if (el.parentElement) {
                el.parentElement.removeChild(el);
            }
        },

        /**
         * @private
         * @param   {Array<*>}  a
         * @param   {Array<*>}  b
         * @return  {boolean}
         */

        isEqualArray: function(a, b) {
            var i = a.length;

            if (i !== b.length) return false;

            while (i--) {
                if (a[i] !== b[i]) return false;
            }

            return true;
        },

        /**
         * @private
         * @param   {Array<*>}  oldArray
         * @return  {Array<*>}
         */

        arrayShuffle: function(oldArray) {
            var newArray    = oldArray.slice(),
                len         = newArray.length,
                i           = len,
                p           = -1,
                t           = [];

            while (i--) {
                p = ~~(Math.random() * len);
                t = newArray[i];

                newArray[i] = newArray[p];
                newArray[p] = t;
            }

            return newArray;
        },

        /**
         * @private
         * @param   {function}  func
         * @param   {Number}    wait
         * @param   {boolean}   immediate
         * @return  {function}
         */

        debounce: function(func, wait, immediate) {
            var timeout;

            return function() {
                var self     = this,
                    args     = arguments,
                    callNow  = immediate && !timeout,
                    later    = null;

                later = function() {
                    timeout  = null;

                    if (!immediate) {
                        func.apply(self, args);
                    }
                };

                clearTimeout(timeout);

                timeout = setTimeout(later, wait);

                if (callNow) func.apply(self, args);
            };
        },

        /**
         * @private
         * @param   {Element}   element
         * @return  {object}
         */

        position: function(element) {
            var xPosition       = 0,
                yPosition       = 0,
                offsetParent    = element;

            while (element) {
                xPosition -= element.scrollLeft;
                yPosition -= element.scrollTop;

                if (element === offsetParent) {
                    xPosition += element.offsetLeft;
                    yPosition += element.offsetTop;

                    offsetParent = element.offsetParent;
                }

                element = element.parentElement;
            }

            return {
                x: xPosition,
                y: yPosition
            };
        },

        /**
         * @private
         * @param   {object}    node1
         * @param   {object}    node2
         * @return  {Number}
         */

        getHypotenuse: function(node1, node2) {
            var distanceX = node1.x - node2.x,
                distanceY = node1.y - node2.y;

            distanceX = distanceX < 0 ? distanceX * -1 : distanceX,
            distanceY = distanceY < 0 ? distanceY * -1 : distanceY;

            return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        },

        /**
         * Calcuates the area of intersection between two rectangles and expresses it as
         * a ratio in comparison to the area of the first rectangle.
         *
         * @private
         * @param   {Rect}  box1
         * @param   {Rect}  box2
         * @return  {number}
         */

        getIntersectionRatio: function(box1, box2) {
            var controlArea         = box1.width * box1.height,
                intersectionX       = -1,
                intersectionY       = -1,
                intersectionArea    = -1,
                ratio               = -1;

            intersectionX =
                Math.max(0, Math.min(box1.left + box1.width, box2.left + box2.width) - Math.max(box1.left, box2.left));

            intersectionY =
                Math.max(0, Math.min(box1.top + box1.height, box2.top + box2.height) - Math.max(box1.top, box2.top));

            intersectionArea = intersectionY * intersectionX;

            ratio = intersectionArea / controlArea;

            return ratio;
        },

        /**
         * @private
         * @param   {object}        el
         * @param   {string}        selector
         * @param   {boolean}       [includeSelf]
         * @param   {Number}        [range]
         * @param   {Document}      [doc]
         * @return  {Element|null}
         */

        closestParent: function(el, selector, includeSelf, range, doc) {
            var parent  = el.parentNode,
                depth   = -1;

            doc     = doc || window.document;
            depth   = range || Infinity;

            if (includeSelf && el.matches(selector)) {
                return el;
            }

            while (depth && parent && parent != doc.body) {
                if (parent.matches && parent.matches(selector)) {
                    return parent;
                } else if (parent.parentNode) {
                    parent = parent.parentNode;
                } else {
                    return null;
                }

                if (range) {
                    depth--;
                }
            }

            return null;
        },

        /**
         * @private
         * @param   {Element}   el
         * @param   {string}    selector
         * @param   {Document}  [doc]
         * @return  {NodeList}
         */

        children: function(el, selector, doc) {
            var children    = [],
                tempId      = '';

            doc = doc || window.doc;

            if (el) {
                if (!el.id) {
                    tempId = 'Temp' + this.randomHexKey();

                    el.id = tempId;
                }

                children = doc.querySelectorAll('#' + el.id + ' > ' + selector);

                if (tempId) {
                    el.removeAttribute('id');
                }
            }

            return children;
        },

        /**
         * @private
         * @param   {Array<*>} originalArray
         * @return  {Array<*>}
         */

        clean: function(originalArray) {
            var cleanArray = [],
                i = -1;

            for (i = 0; i < originalArray.length; i++) {
                if (originalArray[i] !== '') {
                    cleanArray.push(originalArray[i]);
                }
            }

            return cleanArray;
        },

        /**
         * Abstracts various promise implementations into a Q-like "defered promise" interface.
         *
         * @private
         * @param  {object} libraries
         * @return {mixitup.PromiseWrapper|null}
         */

        getPromise: function(libraries) {
            var deferred         = null,
                promiseWrapper  = null,
                $               = null;

            promiseWrapper = new this.PromiseWrapper();

            if (mixitup.features.has.promises) {
                // ES6 native promise or polyfill (bluebird etc)

                promiseWrapper.promise = new Promise(function(resolve, reject) {
                    promiseWrapper.resolve = resolve;
                    promiseWrapper.reject  = reject;
                });
            } else if (libraries.q && typeof libraries.q === 'function') {
                // Q

                deferred = libraries.q.defer();

                promiseWrapper.promise = deferred.promise;
                promiseWrapper.resolve = deferred.resolve;
                promiseWrapper.reject  = deferred.reject;
            } else if (
                ($ = window.jQuery || libraries.jQuery) &&
                typeof $.Deferred === 'function'
            ) {
                // jQuery

                deferred = $.Deferred();

                promiseWrapper.promise = deferred.promise();
                promiseWrapper.resolve = deferred.resolve;
                promiseWrapper.reject  = deferred.reject;
            } else {
                // No implementation

                console.warn(mixitup.messages[203]);

                return null;
            }

            return promiseWrapper;
        },

        /**
         * @private
         * @param   {object}  [config]
         * @return  {boolean}
         */

        canReportErrors: function(config) {
            if (!config || !config.debug) {
                return true;
            } else {
                return config.debug.enable;
            }
        },

        /**
         * @private
         * @param   {Element}   el
         * @param   {string}    property
         * @param   {String[]}  vendors
         * @return  {string}
         */

        getPrefix: function(el, property, vendors) {
            var i       = -1,
                prefix  = '';

            if (h.dashCase(property) in el.style) return '';

            for (i = 0; prefix = vendors[i]; i++) {
                if (prefix + property in el.style) {
                    return prefix.toLowerCase();
                }
            }

            return 'unsupported';
        },

        /**
         * @private
         * @return  {string}
         */

        randomHexKey: function() {
            return (
                '00000' +
                (Math.random() * 16777216 << 0).toString(16)
            )
                .substr(-6)
                .toUpperCase();
        },

        /**
         * @private
         * @param   {Document}  [doc]
         * @return  {object}
         */

        getDocumentState: function(doc) {
            doc = doc || window.document;

            return {
                scrollTop: window.pageYOffset,
                scrollLeft: window.pageXOffset,
                docHeight: doc.documentElement.scrollHeight
            };
        },

        /**
         * @private
         * @param   {object}    obj
         * @param   {function}  fn
         * @return  {function}
         */

        bind: function(obj, fn) {
            return function() {
                return fn.apply(obj, arguments);
            };
        },

        /**
         * @private
         * @param   {Element}   el
         * @return  {boolean}
         */

        isVisible: function(el) {
            var styles = null;

            if (el.offsetParent) return true;

            styles = window.getComputedStyle(el);

            if (
                styles.position === 'fixed' &&
                styles.visibility !== 'hidden' &&
                styles.opacity !== '0'
            ) {
                // Fixed elements report no offsetParent,
                // but may still be invisible

                return true;
            }

            return false;
        },

        /**
         * @private
         * @param   {object}    obj
         */

        seal: function(obj) {
            if (typeof Object.seal === 'function') {
                Object.seal(obj);
            }
        },

        /**
         * @private
         * @param   {string}    control
         * @param   {string}    specimen
         * @return  {boolean}
         */

        compareVersions: function(control, specimen) {
            var controlParts    = control.split('.'),
                specimenParts   = specimen.split('.'),
                controlPart     = -1,
                specimenPart    = -1,
                i               = -1;

            for (i = 0; i < controlParts.length; i++) {
                controlPart     = parseInt(controlParts[i]);
                specimenPart    = parseInt(specimenParts[i] || 0);

                if (specimenPart < controlPart) {
                    return false;
                } else if (specimenPart > controlPart) {
                    return true;
                }
            }

            return true;
        },

        /**
         * @private
         * @constructor
         */

        PromiseWrapper: function() {
            this.promise    = null;
            this.resolve    = null;
            this.reject     = null;
            this.isResolved = false;
        },

        /**
         * @private
         * @param   {object}  obj
         * @return  {boolean}
         */

        isEmptyObject: function(obj) {
            var key = '';

            if (typeof Object.keys === 'function') {
                return Object.keys(obj).length === 0;
            }

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    return false;
                }
            }

            return true;
        }
    };

    mixitup.h = h;

    /**
     * The BasePrototype adds instance methods to all other extensible MixItUp classes,
     * enabling the execution of previously registered hooks.
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @public
     * @since       3.0.0
     */

    mixitup.BasePrototype = function() {};

    mixitup.BasePrototype.prototype = {
        constructor: mixitup.BasePrototype,

        /**
         * Executes any registered actions for the respective hook.
         *
         * @memberof    mixitup.BasePrototype
         * @private
         * @instance
         * @since       2.0.0
         * @param       {string}    methodName
         * @param       {boolean}   isPost
         * @param       {Array<*>}  args
         * @return      {void}
         */

        execAction: function(methodName, isPost, args) {
            var self    = this,
                key     = '',
                context = isPost ? 'post' : 'pre';

            if (!h.isEmptyObject(self.constructor._actions) && self.constructor._actions.hasOwnProperty(methodName)) {
                for (key in self.constructor._actions[methodName][context]) {
                    self.constructor._actions[methodName][context][key].call(self, args);
                }
            }
        },

        /**
         * Executes any registered filters for the respective hook.
         *
         * @memberof    mixitup.BasePrototype
         * @private
         * @instance
         * @since       2.0.0
         * @param       {string}    methodName
         * @param       {*}         value
         * @param       {Array<*>}  args
         * @return      {*}
         */

        execFilter: function(methodName, value, args) {
            var self    = this,
                key     = '';

            if (!h.isEmptyObject(self.constructor._filters) && self.constructor._filters.hasOwnProperty(methodName)) {
                for (key in self.constructor._filters[methodName].pre) {
                    return self.constructor._filters[methodName].pre[key].call(self, value, args);
                }
            } else {
                return value;
            }
        }
    };

    /**
     * The BaseStatic class exposes a set of static methods which all other MixItUp
     * classes inherit as a means of integrating extensions via the addition of new
     * methods and/or actions and hooks.
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @public
     * @since       3.0.0
     */

    mixitup.BaseStatic = function() {
        this._actions = {};
        this._filters = {};

        /**
         * Performs a shallow extend on the class's prototype, enabling the addition of
         * multiple new members to the class in a single operation.
         *
         * @memberof    mixitup.BaseStatic
         * @public
         * @static
         * @since       2.1.0
         * @param       {object} extension
         * @return      {void}
         */

        this.extend = function(extension) {
            h.extend(this.prototype, extension);
        };

        /**
         * Registers an action function to be executed at a predefined hook.
         *
         * @memberof    mixitup.BaseStatic
         * @public
         * @static
         * @since       2.1.0
         * @param       {string}    hook
         * @param       {string}    name
         * @param       {function}  func
         * @param       {number}    priority
         * @return      {void}
         */

        this.addAction = function(hook, name, func, priority) {
            this._addHook('_actions', hook, name, func, priority);
        };

        /**
         * Registers a filter function to be executed at a predefined hook.
         *
         * @memberof    mixitup.BaseStatic
         * @public
         * @static
         * @since       2.1.0
         * @param       {string}    hook
         * @param       {string}    name
         * @param       {function}  func
         * @return      {void}
         */

        this.addFilter = function(hook, name, func) {
            this._addHook('_filters', hook, name, func);
        };

        /**
         * Registers a filter or action to be executed at a predefined hook. The
         * lower-level call used by `addAction` and `addFiler`.
         *
         * @memberof    mixitup.BaseStatic
         * @private
         * @static
         * @since       2.1.0
         * @param       {string}    type
         * @param       {string}    hook
         * @param       {string}    name
         * @param       {function}  func
         * @param       {number}    priority
         * @return      {void}
         */

        this._addHook = function(type, hook, name, func, priority) {
            var collection = this[type];

            priority = (priority === 1 || priority === 'post') ? 'post' : 'pre';

            collection[hook]                   = collection[hook] || {};
            collection[hook][priority]         = collection[hook][priority] || {};
            collection[hook][priority][name]   = func;
        };
    };

    /**
     * A group of configurable properties related to MixItUp's animation and effects options.
     *
     * @constructor
     * @memberof    mixitup.Config
     * @name        animation
     * @namespace
     * @public
     * @since       2.0.0
     */

    mixitup.ConfigAnimation = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        /**
         * A boolean dictating whether or not animation should be enabled for the MixItUp instance.
         * If `false`, all operations will occur instantly and syncronously, although callback
         * functions and any returned promises will still be fulfilled.
         *
         * @name        enable
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.enable = true;

        /**
         * A string of one or more space-seperated effects to which transitions will be
         * applied for all filtering animations.
         *
         * The available properties are `'fade'`, `'scale'`, `'translateX'`, `'translateY'`,
         * `'translateZ'`, `'rotateX'`, `'rotateY'`, `'rotateZ'` and `'stagger'`, and can
         * be listed any order or combination, although they will be applied in a specific
         * predefined order to produce consistent results.
         *
         * Each effect maps directly to the CSS transform of the same name with the exception
         * of `'fade'` which maps to `'opacity'`, and `'stagger'` which maps to an incremental
         * '`transition-delay'` value based on the index of the target in the filter
         * or sort animation.
         *
         * Effects may be followed by an optional value in parenthesis dictating the maximum
         * tween value of the effect in the appropriate units (e.g. `'fade(0.5) translateX(-10%) stagger(40ms)'`).
         * Experiment with the home page sandbox to find the perfect combination of
         * effects for your project.
         *
         * @name        effects
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {string}
         * @default     'fade scale'
         */

        this.effects = 'fade scale';

        /**
         * A string of one or more space-seperated effects to be applied only to filter-in
         * animations, overriding `config.animation.effects` if set.
         *
         * @name        effectsIn
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {string}
         * @default     ''
         */

        this.effectsIn = '';

        /**
         * A string of one or more space-seperated effects to be applied only to filter-out
         * animations, overriding `config.animation.effects` if set.
         *
         * @name        effectsOut
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {string}
         * @default     ''
         */

        this.effectsOut = '';

        /**
         * An integer dictating the duration of all MixItUp animations in milliseconds, not
         * including any additional delay apllied via the `'stagger'` effect.
         *
         * @name        duration
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {number}
         * @default     600
         */

        this.duration = 600;

        /**
         * A valid CSS3 transition-timing function or shorthand. For a full list of accepted
         * values, check out easings.net.
         *
         * @name        easing
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {string}
         * @default     'ease'
         */

        this.easing = 'ease';

        /**
         * A boolean dictating whether or not to apply perspective to the MixItUp container
         * during animations. By default, perspective is always applied and creates the
         * illusion of three-dimensional space for effects such as `translateZ`, `rotateX`,
         * and `rotateY`.
         *
         * You may wish to disable this and define your own perspective settings via CSS.
         *
         * @name        applyPerspective
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {bolean}
         * @default     true
         */

        this.applyPerspective = true;

        /**
         * The perspective distance value applied to the container during animations,
         * affecting any 3D-transform-based effects.
         *
         * @name        perspectiveDistance
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {string}
         * @default     '3000px'
         */

        this.perspectiveDistance = '3000px';

        /**
         * The perspective-origin value applied to the container during animations,
         * affecting any 3D-transform-based effects.
         *
         * @name        perspectiveOrigin
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {string}
         * @default     '50% 50%'
         */

        this.perspectiveOrigin = '50% 50%';

        /**
         * A boolean dictating whether or not to enable queuing for all operations received
         * while an another operation is in progress. If `false`, any requested operations will
         * be ignored, and the `onMixBusy` callback and `mixBusy` event will be fired. If
         * debugging is enabled, a console warning will also occur.
         *
         * @name        queue
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.queue = true;

        /**
         * An integer dictacting the maximum number of operations allowed in the queue at
         * any time, when queuing is enabled.
         *
         * @name        queueLimit
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {number}
         * @default     3
         */

        this.queueLimit = 3;

        /**
         * A boolean dictating whether or not to attempt transitioning of target elements
         * during layout change operations. Depending on the differences in styling between
         * layouts this may produce undesirable results and is therefore disabled by default.
         *
         * @name        animateChangeLayout
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     false
         */

        this.animateChangeLayout = false;

        /**
         * A boolean dictating whether or not to transition the height and width of the
         * container as elements are filtered in and out. If disabled, the container height
         * will change abruptly.
         *
         * It may be desirable to disable this on mobile devices where the CSS `height` and
         * `width` properties do not receive GPU-acceleration.
         *
         * @name        animateResizeContainer
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.animateResizeContainer = true;

        /**
         * A boolean dictating whether or not to transition the height and width of target
         * elements as they change throughout the course of an animation.
         *
         * This is specifically aimed at flex-box layouts where the size of target elements
         * may change depending on final their position in relation to their siblings, and
         * is therefore disabled by default.
         *
         * This feature requires additional calculations and DOM manipulation which may
         * adversely affect performance on slower devices.
         *
         * @name        animateResizeTargets
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     false
         */

        this.animateResizeTargets = false;

        /**
         * A custom function used to manipulate the order in which the stagger delay is
         * incremented when using the ‘stagger’ effect. It can be used to create engaging
         * non-linear staggering.
         *
         * The function receives the index of the target element as a parameter, and must
         * return an integer which serves as the multiplier for the stagger delay.
         *
         * @name        staggerSequence
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {function}
         * @default     null
         */

        this.staggerSequence = null;

        /**
         * A boolean dictating whether or not to reverse the direction of `translate`
         * and `rotate` transforms for elements being filtered out.
         *
         * It can be used to create engaging carousel-like animations
         * where elements enter and exit from opposite directions. If enabled, the
         * effect `translateX(-100%)` for elements being filtered in would become
         * `translateX(100%)` for targets being filtered out.
         *
         * This functionality can also be achieved by providing seperate effects
         * strings for `config.animation.effectsIn` and `config.animation.effectsOut`.
         *
         * @name        reverseOut
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     false
         */

        this.reverseOut = false;

        /**
         * A boolean dictating whether or not to "nudge" the animation path of target
         * elements depending on their intermediate position in the layout.
         *
         * This has been the default behavior of MixItUp since version 1, but it
         * may be desirable to disable this effect when filtering directly from
         * one exclusive set of targets to a different exclusive set of targets,
         * to create a carousel-like effect.
         *
         * @name        nudge
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.nudge = true;

        /**
         * A boolean dictating whether or not to account of a shift in position of the
         * container due a change in height or width.
         *
         * For example, if a vertically centered element changes height throughout the
         * course of an operation, its vertical position will change, and animation
         * calculations will be affected. Setting this property to `true` will attempt
         * to counteract these changs and maintain the desired animation.
         */

        this.balanceContainerShift = false;

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigAnimation);

    mixitup.ConfigAnimation.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.ConfigAnimation.prototype.constructor = mixitup.ConfigAnimation;

    /**
     * @constructor
     * @memberof    mixitup.Config
     * @name        callbacks
     * @namespace
     * @public
     * @since       2.0.0
     */

    mixitup.ConfigCallbacks = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.onMixStart = null;
        this.onMixBusy  = null;
        this.onMixEnd   = null;
        this.onMixFail  = null;
        this.onMixClick = null;

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigCallbacks);

    mixitup.ConfigCallbacks.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.ConfigCallbacks.prototype.constructor = mixitup.ConfigCallbacks;

    /**
     * @constructor
     * @memberof    mixitup.Config
     * @name        controls
     * @namespace
     * @public
     * @since       2.0.0
     */

    mixitup.ConfigControls = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.enable         = true;
        this.live           = false;
        this.toggleLogic    = 'or';
        this.toggleDefault  = 'all';
        this.activeClass    = 'active';

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigControls);

    mixitup.ConfigControls.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.ConfigControls.prototype.constructor = mixitup.ConfigControls;

    /**
     * @constructor
     * @memberof    mixitup.Config
     * @name        debug
     * @namespace
     * @public
     * @since       3.0.0
     */

    mixitup.ConfigDebug = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.enable = true;

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigDebug);

    mixitup.ConfigDebug.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.ConfigDebug.prototype.constructor = mixitup.ConfigDebug;

    /**
     * An group of references to any mixitup extensions to be applied to the
     * instance. This is only neccessary when loading mixitup via a module
     * loader such as Browserify or RequireJS, where a reference to the
     * extension cannot be accessed from the global `window` scope.
     *
     * @constructor
     * @memberof    mixitup
     * @memberof    mixitup.Config
     * @name        extensions
     * @namespace
     * @public
     * @since       3.0.0
     */

    mixitup.ConfigExtensions = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.pagination     = null;
        this.dragndrop      = null;
        this.multiFilter    = null;

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigExtensions);

    mixitup.ConfigExtensions.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.ConfigExtensions.prototype.constructor = mixitup.ConfigExtensions;

    /**
     * @constructor
     * @memberof    mixitup.Config
     * @name        layout
     * @namespace
     * @public
     * @since       3.0.0
     */

    mixitup.ConfigLayout = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.allowNestedTargets = false;
        this.containerClass     = '';
        this.containerClassFail = 'mixitup-container-fail';

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigLayout);

    mixitup.ConfigLayout.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.ConfigLayout.prototype.constructor = mixitup.ConfigLayout;

    /**
     * @constructor
     * @memberof    mixitup
     * @memberof    mixitup.Config
     * @name        libraries
     * @namespace
     * @public
     * @since       3.0.0
     */

    mixitup.ConfigLibraries = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.q          = null;
        this.jQuery     = null;

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigLibraries);

    mixitup.ConfigLibraries.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.ConfigLibraries.prototype.constructor = mixitup.ConfigLibraries;

    /**
     * @constructor
     * @memberof    mixitup.Config
     * @name        load
     * @namespace
     * @public
     * @since       2.0.0
     */

    mixitup.ConfigLoad = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.filter = 'all';
        this.sort   = 'default:asc';

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigLoad);

    mixitup.ConfigLoad.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.ConfigLoad.prototype.constructor = mixitup.ConfigLoad;

    /**
     * @constructor
     * @memberof    mixitup
     * @memberof    mixitup.Config
     * @name        selectors
     * @namespace
     * @public
     * @since       3.0.0
     */

    mixitup.ConfigSelectors = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.target         = '.mix';
        this.control        = '.mixitup-control';

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigSelectors);

    mixitup.ConfigSelectors.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.ConfigSelectors.prototype.constructor = mixitup.ConfigSelectors;

    /**
     * The `mixitup.Config` class encompasses the full set of user-configurable
     * options for each MixItUp instance, and is organised into to several
     * semantically distinct sub-objects.
     *
     * An optional object literal containing any combination of these properies,
     * known as the "configuration object", can be passed as the second parameter to
     * the `mixitup` factory function to customise the functionality of the MixItUp
     * instance as needed.
     *
     * @constructor
     * @memberof    mixitup
     * @namespace
     * @public
     * @since       2.0.0
     */

    mixitup.Config = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.animation          = new mixitup.ConfigAnimation();
        this.callbacks          = new mixitup.ConfigCallbacks();
        this.controls           = new mixitup.ConfigControls();
        this.debug              = new mixitup.ConfigDebug();
        this.layout             = new mixitup.ConfigLayout();
        this.libraries          = new mixitup.ConfigLibraries();
        this.load               = new mixitup.ConfigLoad();
        this.selectors          = new mixitup.ConfigSelectors();
        this.extensions         = new mixitup.ConfigExtensions();

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Config);

    mixitup.Config.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.Config.prototype.constructor = mixitup.Config;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.MixerDom = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.document               = null;
        this.body                   = null;
        this.container              = null;
        this.parent                 = null;
        this.targets                = [];
        this.sortButtons            = [];
        this.filterButtons          = [];
        this.filterToggleButtons    = [];
        this.multiMixButtons        = [];
        this.allButtons             = [];

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.MixerDom);

    mixitup.MixerDom.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.MixerDom.prototype.constructor = mixitup.MixerDom;
    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       2.0.0
     */

    mixitup.ClickTracker = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.filterToggle   = -1;
        this.multiMix       = -1;
        this.filter         = -1;
        this.sort           = -1;

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ClickTracker);

    mixitup.ClickTracker.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.ClickTracker.prototype.constructor = mixitup.ClickTracker;

    /**
     * @private
     * @static
     * @since   2.0.0
     * @type    {mixitup.ClickTracker}
     */

    mixitup.handled = new mixitup.ClickTracker();

    /**
     * @private
     * @static
     * @since   2.0.0
     * @type    {mixitup.ClickTracker}
     */

    mixitup.bound = new mixitup.ClickTracker();

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.StyleData = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.x              = 0;
        this.y              = 0;
        this.top            = 0;
        this.right          = 0;
        this.bottom         = 0;
        this.left           = 0;
        this.width          = 0;
        this.height         = 0;
        this.marginRight    = 0;
        this.marginBottom   = 0;
        this.opacity        = 0;
        this.scale          = new mixitup.TransformData();
        this.translateX     = new mixitup.TransformData();
        this.translateY     = new mixitup.TransformData();
        this.translateZ     = new mixitup.TransformData();
        this.rotateX        = new mixitup.TransformData();
        this.rotateY        = new mixitup.TransformData();
        this.rotateZ        = new mixitup.TransformData();

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.StyleData);

    mixitup.StyleData.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.StyleData.prototype.constructor = mixitup.StyleData;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.TransformData = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.value  = 0;
        this.unit   = '';

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.TransformData);

    mixitup.TransformData.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.TransformData.prototype.constructor = mixitup.TransformData;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.TransformDefaults = function() {
        mixitup.StyleData.apply(this);

        this.execAction('construct', 0);

        this.scale.value        = 0.01;
        this.scale.unit         = '';

        this.translateX.value   = 20;
        this.translateX.unit    = 'px';

        this.translateY.value   = 20;
        this.translateY.unit    = 'px';

        this.translateZ.value   = 20;
        this.translateZ.unit    = 'px';

        this.rotateX.value      = 90;
        this.rotateX.unit       = 'deg';

        this.rotateY.value      = 90;
        this.rotateY.unit       = 'deg';

        this.rotateX.value      = 90;
        this.rotateX.unit       = 'deg';

        this.rotateZ.value      = 180;
        this.rotateZ.unit       = 'deg';

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.TransformDefaults);

    mixitup.TransformDefaults.prototype = Object.create(mixitup.StyleData.prototype);

    mixitup.TransformDefaults.prototype.constructor = mixitup.TransformDefaults;

    /**
     * @private
     * @static
     * @since   3.0.0
     * @type    {mixitup.TransformDefaults}
     */

    mixitup.transformDefaults = new mixitup.TransformDefaults();

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
     * The `mixitup.Events` class contains all custom events dispatched by MixItUp.
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
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

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

        this.mixStart   = null;

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

        this.mixBusy    = null;

        /**
         * A custom event triggered after any MixItUp operation has completed, and the
         * state has been updated.
         *
         * @name        mixEnd
         * @memberof    mixitup.Events
         * @static
         * @type        {CustomEvent}
         */

        this.mixEnd     = null;

        /**
         * A custom event triggered whenever a filter operation "fails", i.e. no targets
         * could be found matching the filter.
         *
         * @name        mixFail
         * @memberof    mixitup.Events
         * @static
         * @type        {CustomEvent}
         */

        this.mixFail    = null;

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

        this.mixClick   = null;

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Events);

    mixitup.Events.prototype = Object.create(mixitup.BasePrototype.prototype);

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

        el.dispatchEvent(event);
    };

    // Asign a singleton instance to `mixitup.events`:

    mixitup.events = new mixitup.Events();

    /**
     * The `mixitup.Mixer` class is used to construct discreet user-configured
     * instances of MixItUp around the provided container element(s). Other
     * than the intial `mixitup()` factory function call, which returns an
     * instance of a mixer, all other public API functionality is performed
     * on mixer instances.
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @public
     * @since       3.0.0
     */

    mixitup.Mixer = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.animation          = new mixitup.ConfigAnimation();
        this.callbacks          = new mixitup.ConfigCallbacks();
        this.controls           = new mixitup.ConfigControls();
        this.debug              = new mixitup.ConfigDebug();
        this.extensions         = new mixitup.ConfigExtensions();
        this.layout             = new mixitup.ConfigLayout();
        this.libraries          = new mixitup.ConfigLibraries();
        this.load               = new mixitup.ConfigLoad();
        this.selectors          = new mixitup.ConfigSelectors();

        this._id                = '';

        this._isMixing          = false;
        this._isClicking        = false;
        this._isToggling        = false;
        this._incPadding        = true;

        this._targets           = [];
        this._origOrder         = [];

        this._toggleArray       = [];
        this._toggleString      = '';

        this._targetsMoved      = 0;
        this._targetsImmovable  = 0;
        this._targetsBound      = 0;
        this._targetsDone       = 0;

        this._staggerDuration   = 0;
        this._effectsIn         = null;
        this._effectsOut        = null;
        this._transformIn       = [];
        this._transformOut      = [];
        this._queue             = [];

        this._handler           = null;
        this._state             = null;
        this._lastOperation     = null;
        this._lastClicked       = null;
        this._userCallback      = null;
        this._userPromise       = null;

        this._dom               = new mixitup.MixerDom();

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Mixer);

    mixitup.Mixer.prototype = Object.create(mixitup.BasePrototype.prototype);

    h.extend(mixitup.Mixer.prototype,
    /** @lends mixitup.Mixer */
    {
        constructor: mixitup.Mixer,

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Element}       el
         * @param   {object}        config
         * @return  {mixitup.State}
         */

        _init: function(el, config) {
            var self        = this,
                state       = new mixitup.State(),
                operation   = new mixitup.Operation();

            self.execAction('_init', 0, arguments);

            config && h.extend(self, config, true);

            self._cacheDom(el);

            self.layout.containerClass && h.addClass(el, self.layout.containerClass);

            self.animation.enable = self.animation.enable && mixitup.features.has.transitions;

            self._indexTargets();

            // Map in whatever state values we can

            state.activeFilter = self.load.filter === 'all' ?
                self.selectors.target :
                self.load.filter === 'none' ?
                    '' :
                    self.load.filter;

            state.activeSort            = self.load.sort;
            state.activeContainerClass  = self.layout.containerClass;
            state.totalTargets          = self._targets.length;

            if (state.activeSort) {
                // Perform a syncronous sort without an operation

                operation.startSortString   = 'default:asc';
                operation.startOrder        = self._targets;
                operation.newSort           = self._parseSort(state.activeSort);
                operation.newSortString     = state.activeSort;

                self._sort(operation);

                self._printSort(false, operation);

                self._targets = operation.newOrder;
            }

            // TODO: the initial state should be fully mapped, but as the operation is fake we don't have this data

            // state.totalShow         = operation.show.length
            // state.totalHide         = operation.hide.length
            // state.totalMatching     = operation.matching.length;

            self._updateControls({
                filter: state.activeFilter,
                sort: state.activeSort
            });

            self._parseEffects();

            self._bindEvents();

            self._buildToggleArray(null, state);

            return self.execFilter('_init', state, arguments);
        },

        /**
         * Caches references of DOM elements neccessary for the mixer's functionality.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Element} el
         * @return  {void}
         */

        _cacheDom: function(el) {
            var self    = this,
                button  = null,
                i       = -1;

            self.execAction('_cacheDom', 0, arguments);

            self._dom.body      = self._dom.document.getElementsByTagName('body')[0];
            self._dom.container = el;
            self._dom.parent    = el;

            self._dom.allButtons =
                Array.prototype.slice.call(self._dom.document.querySelectorAll(self.selectors.control));

            for (i = 0; button = self._dom.allButtons[i]; i++) {
                if (button.matches('[data-filter][data-sort]')) {
                    self._dom.multiMixButtons.push(button);
                } else if (button.matches('[data-filter]')) {
                    self._dom.filterButtons.push(button);
                } else if (button.matches('[data-sort]')) {
                    self._dom.sortButtons.push(button);
                } else if (button.matches('[data-toggle]')) {
                    self._dom.filterToggleButtons.push(button);
                }
            }

            self.execAction('_cacheDom', 1, arguments);
        },

        /**
         * Indexes all child elements of the mixer matching the `selectors.target`
         * selector, instantiating a mixitup.Target for each one.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */

        _indexTargets: function() {
            var self    = this,
                target  = null,
                el      = null,
                i       = -1;

            self.execAction('_indexTargets', 0, arguments);

            self._dom.targets = self.layout.allowNestedTargets ?
                self._dom.container.querySelectorAll(self.selectors.target) :
                h.children(self._dom.container, self.selectors.target, self._dom.document);

            self._dom.targets = Array.prototype.slice.call(self._dom.targets);

            self._targets = [];

            if (self._dom.targets.length) {
                for (i = 0; el = self._dom.targets[i]; i++) {
                    target = new mixitup.Target();

                    target.init(el, self);

                    self._targets.push(target);
                }

                self._dom.parent = self._dom.targets[0].parentElement.isEqualNode(self._dom.container) ?
                    self._dom.container :
                    self._dom.targets[0].parentElement;
            }

            self._origOrder = self._targets;

            self.execAction('_indexTargets', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */

        _bindEvents: function() {
            var self            = this,
                controlTypes    = ['filterToggle', 'multiMix', 'filter', 'sort'],
                button          = null,
                type            = '',
                i               = -1;

            self.execAction('_bindEvents', 0);

            self._handler = function(e) {
                return self._eventBus(e);
            };

            // TODO: it only makes sense for multiple instances to count towards the
            // "bound" total, if a) they have controls enabled, and b) they share the
            // same controls selector. Do we need seperate counters per selector?

            if (!self.controls.enable) {
                self.execAction('_bindEvents', 1);

                return;
            }

            if (self.controls.live) {
                h.on(window, 'click', self._handler);
            } else {
                for (i = 0; button = self._dom.allButtons[i]; i++) {
                    h.on(button, 'click', self._handler);
                }
            }

            // For each mixitup.Mixer instance, increment the total number of bound
            // instances. When a button is clicked, all instances must be handled
            // before a button is changed to its active state.

            for (i = 0; type = controlTypes[i]; i++) {
                if (mixitup.bound[type] < 0) {
                    mixitup.bound[type] = 1;
                } else {
                    mixitup.bound[type]++;
                }
            }

            self.execAction('_bindEvents', 1);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */

        _unbindEvents: function() {
            var self            = this,
                controlTypes    = ['filterToggle', 'multiMix', 'filter', 'sort'],
                button          = null,
                type            = '',
                i               = -1;

            self.execAction('_unbindEvents', 0);

            h.off(window, 'click', self._handler);

            for (i = 0; button = self._dom.allButtons[i]; i++) {
                h.off(button, 'click', self._handler);
            }

            // Do the opposite of `_bindEvents`

            for (i = 0; type = controlTypes[i]; i++) {
                mixitup.bound[type]--;

                if (mixitup.bound[type] === 0) {
                    // Reset to -1 to indicate inactive state

                    mixitup.bound[type] = -1;
                }
            }

            self.execAction('_unbindEvents', 1);
        },

        /**
         * @private
         * @instance
         * @param   {Event}            e
         * @return  {(Boolean|void)}
         */

        _eventBus: function(e) {
            var self = this;

            self.execAction('_eventBus', 0);

            switch(e.type) {
                case 'click':
                    return self._handleClick(e);
            }

            self.execAction('_eventBus', 1);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Event}  e
         * @return  {void}
         *
         * Determines the type of operation needed and the
         * appropriate parameters when a button is clicked
         */

        _handleClick: function(e) {
            var self            = this,
                command         = null,
                returnValue     = null,
                method          = '',
                isTogglingOff   = false,
                button          = null;

            self.execAction('_handleClick', 0, arguments);

            if (
                self._isMixing &&
                (!self.animation.queue || self._queue.length >= self.animation.queueLimit)
            ) {
                if (h.canReportErrors(self)) {
                    console.warn(mixitup.messages[201]);
                }

                mixitup.events.fire('mixBusy', self._dom.container, {
                    state: self._state,
                    instance: self
                }, self._dom.document);

                if (typeof self.callbacks.onMixBusy === 'function') {
                    self.callbacks.onMixBusy.call(self._dom.container, self._state, self);
                }

                self.execAction('_handleClickBusy', 1, arguments);

                return;
            }

            button = h.closestParent(
                e.target,
                self.selectors.control,
                true,
                Infinity,
                self._dom.document
            );

            if (!button) {
                self.execAction('_handleClick', 1, arguments);

                return;
            }

            self._isClicking = true;

            // This will be automatically mapped into the new operation's future
            // state, but that has not been generated at this point, so we manually
            // add it to the previous state for the following callbacks/events:

            self._state.triggerElement = button;

            // Expose the original event to callbacks and events so that any default
            // behavior can be cancelled (e.g. an <a> being used as a control as a
            // progressive enhancement):

            mixitup.events.fire('mixClick', self._dom.container, {
                state: self._state,
                instance: self,
                originalEvent: e
            }, self._dom.document);

            if (typeof self.callbacks.onMixClick === 'function') {
                returnValue = self.callbacks.onMixClick.call(button, self._state, self, e);

                if (returnValue === false) {
                    // The callback has returned false, so do not execute the default action

                    return;
                }
            }

            method = self._determineButtonMethod(button);

            switch (method) {
                case 'sort':
                    command = self._handleSortClick(button);

                    break;
                case 'filter':
                    command = self._handleFilterClick(button);

                    break;
                case 'filterToggle':
                    if (h.hasClass(button, self.controls.activeClass)) {
                        isTogglingOff = true;
                    }

                    command = self._handleFilterToggleClick(button);

                    break;
                case 'multiMix':
                    command = self._handleMultiMixClick(button);

                    break;
            }

            if (method && command) {
                self._trackClick(button, method, isTogglingOff);

                self.multiMix(command);
            }

            self.execAction('_handleClick', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Element} button
         * @return  {string}
         */

        _determineButtonMethod: function(button) {
            var self        = this,
                method      = '';

            self.execAction('_determineButtonMethod', 0, arguments);

            if (button.matches('[data-filter][data-sort]')) {
                method = 'multiMix';
            } else if (button.matches('[data-filter]')) {
                method = 'filter';
            } else if (button.matches('[data-sort]')) {
                method = 'sort';
            } else if (button.matches('[data-toggle]')) {
                method = 'filterToggle';
            }

            return self.execFilter('_determineButtonMethod', method, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Element}   button
         * @return  {object|null}
         */

        _handleSortClick: function(button) {
            var self        = this,
                returnValue = null,
                sortString  = '',
                el          = null,
                i           = -1;

            self.execAction('_handleSortClick', 0, arguments);

            sortString = button.getAttribute('data-sort');

            if (
                !h.hasClass(button, self.controls.activeClass) ||
                sortString.indexOf('random') > -1
            ) {
                for (i = 0; el = self._dom.sortButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                returnValue = {
                    sort: sortString
                };
            }

            return self.execFilter('_handleSortClick', returnValue, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Element}   button
         * @return  {object|null}
         */

        _handleFilterClick: function(button) {
            var self    = this,
                command = null,
                el      = null,
                i       = -1;

            self.execAction('_handleFilterClick', 0, arguments);

            if (!h.hasClass(button, self.controls.activeClass)) {
                for (i = 0; el = self._dom.filterButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                for (i = 0; el = self._dom.filterToggleButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                if (self._isToggling) {
                    // If we were previously toggling, we are not now,
                    // so remove any selectors from the toggle array

                    self._isToggling = false;
                }

                // Reset any active toggles regardless of whether we were toggling or not,
                // as an API method could have caused toggle buttons to become active

                self._toggleArray.length = 0;

                command = {
                    filter: button.getAttribute('data-filter')
                };
            }

            return self.execFilter('_handleFilterClick', command, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Element}   button
         * @return  {object|null}
         */

        _handleFilterToggleClick: function(button) {
            var self            = this,
                toggleSeperator = '',
                filterString    = '',
                command         = null,
                el              = null,
                i               = -1;

            self.execAction('_handleFilterToggleClick', 0, arguments);

            toggleSeperator = self.controls.toggleLogic === 'or' ? ',' : '';

            if (!self._isToggling) {
                // There were no toggles active previously active

                for (i = 0; el = self._dom.filterToggleButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                self._toggleArray.length    = 0; // Reset any previously active toggles
                self._isToggling            = true;
            }

            filterString = button.getAttribute('data-toggle');

            for (i = 0; el = self._dom.filterButtons[i]; i++) {
                h.removeClass(el, self.controls.activeClass);
            }

            for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
                h.removeClass(el, self.controls.activeClass);
            }

            // Add or remove filters as needed

            if (!h.hasClass(button, self.controls.activeClass)) {
                self._toggleArray.push(filterString);
            } else {
                self._toggleArray.splice(self._toggleArray.indexOf(filterString), 1);
            }

            self._toggleArray = h.clean(self._toggleArray);

            self._toggleString = self._toggleArray.join(toggleSeperator);

            if (self._toggleString === '') {
                self._toggleString = self.controls.toggleDefault;

                command = {
                    filter: self._toggleString
                };

                self._updateControls(command);
            } else {
                command =  {
                    filter: self._toggleString
                };
            }

            return self.execFilter('_handleFilterToggleClick', command, arguments);
        },

        /**
         * @private
         * @instance
         * @since 3.0.0
         * @param   {Element}   button
         * @return  {object|null}
         */

        _handleMultiMixClick: function(button) {
            var self     = this,
                command  = null,
                el       = null,
                i        = -1;

            self.execAction('_handleMultiMixClick', 0, arguments);

            if (!h.hasClass(button, self.controls.activeClass)) {
                for (i = 0; el = self._dom.filterButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                for (i = 0; el = self._dom.filterToggleButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                for (i = 0; el = self._dom.sortButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                command = {
                    sort: button.getAttribute('data-sort'),
                    filter: button.getAttribute('data-filter')
                };

                if (self._isToggling) {
                    // If we were previously toggling, we are not now,
                    // so remove any selectors from the toggle array

                    self._isToggling            = false;
                    self._toggleArray.length    = 0;
                }

                // Update any matching individual filter and sort
                // controls to reflect the multiMix

                self._updateControls(command);
            }

            return self.execFilter('_handleMultiMixClick', command, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Element}   button
         * @param   {string}    method
         * @param   {boolean}   isTogglingOff
         * @return  {void}
         */

        _trackClick: function(button, method, isTogglingOff) {
            var self = this;

            self._lastClicked = button;

            // Add the active class to a button only once
            // all mixitup.Mixer instances have handled the click

            mixitup.handled[method] =
                (mixitup.handled[method] < 0) ?
                    1 : mixitup.handled[method] + 1;

            if (mixitup.handled[method] === mixitup.bound[method]) {
                if (isTogglingOff) {
                    h.removeClass(button, self.controls.activeClass);
                } else {
                    h.addClass(button, self.controls.activeClass);
                }

                mixitup.handled[method] = -1;
            }
        },

        /**
         * Breaks compound selector strings in an array of discreet selectors,
         * as per the active `controls.toggleLogic` configuration option. Accepts
         * either a dynamic command object, or a state object.
         *
         * @private
         * @instance
         * @since   2.0.0
         * @param   {object}        [command]
         * @param   {mixitup.State} [state]
         * @return  {void}
         */

        _buildToggleArray: function(command, state) {
            var self            = this,
                activeFilter    = '',
                filter          = '',
                i               = -1;

            self.execAction('_buildToggleArray', 0, arguments);

            if (command && typeof command.filter === 'string') {
                activeFilter = command.filter.replace(/\s/g, '');
            } else if (state) {
                activeFilter = state.activeFilter.replace(/\s/g, '');
            } else {
                return;
            }

            activeFilter = activeFilter === self.selectors.target ? '' : activeFilter;

            if (self.controls.toggleLogic === 'or') {
                self._toggleArray = activeFilter.split(',');
            } else {
                self._toggleArray = activeFilter.split('.');

                !self._toggleArray[0] && self._toggleArray.shift();

                for (i = 0; filter = self._toggleArray[i]; i++) {
                    self._toggleArray[i] = '.' + filter;
                }
            }

            self._toggleArray = h.clean(self._toggleArray);

            self.execAction('_buildToggleArray', 1, arguments);
        },

        /**
         * Updates controls to their active/inactive state based on the command or
         * current state of the mixer.
         *
         * @private
         * @instance
         * @since   2.0.0
         * @param   {object} command
         * @return  {void}
         */

        _updateControls: function(command) {
            var self                = this,
                filterToggleButton  = null,
                activeButton        = null,
                output              = null,
                button              = null,
                selector            = '',
                i                   = -1,
                j                   = -1;

            output = {
                filter: command && command.filter,
                sort: command && command.sort
            };

            self.execAction('_updateControls', 0, arguments);

            (typeof output.filter === 'undefined') && (output.filter = self._state.activeFilter);
            (typeof output.sort === 'undefined') && (output.sort = self._state.activeSort);
            (output.filter === self.selectors.target) && (output.filter = 'all');

            for (i = 0; button = self._dom.sortButtons[i]; i++) {
                h.removeClass(button, self.controls.activeClass);

                if (button.matches('[data-sort="' + output.sort + '"]')) {
                    h.addClass(button, self.controls.activeClass);
                }
            }

            for (i = 0; button = self._dom.filterButtons[i]; i++) {
                h.removeClass(button, self.controls.activeClass);

                if (button.matches('[data-filter="' + output.filter + '"]')) {
                    h.addClass(button, self.controls.activeClass);
                }
            }

            for (i = 0; button = self._dom.multiMixButtons[i]; i++) {
                h.removeClass(button, self.controls.activeClass);

                if (
                    button.matches('[data-sort="' + output.sort + '"]') &&
                    button.matches('[data-filter="' + output.filter + '"]')
                ) {
                    h.addClass(button, self.controls.activeClass);
                }
            }

            if (self._dom.filterToggleButtons.length) {
                for (i = 0; button = self._dom.filterToggleButtons[i]; i++) {
                    h.removeClass(button, self.controls.activeClass);

                    if (button.matches('[data-filter="' + output.filter + '"]')) {
                        h.addClass(button, self.controls.activeClass);
                    }
                }

                for (i = 0; selector = self._toggleArray[i]; i++) {
                    activeButton = null;

                    if (self.controls.live) {
                        activeButton = self._dom.document
                            .querySelector(self.selectors.filterToggle + '[data-filter="' + selector + '"]');
                    } else {
                        for (j = 0; filterToggleButton = self._dom.filterToggleButtons[j]; j++) {
                            if (filterToggleButton.matches('[data-filter="' + selector + '"]')) {
                                activeButton = filterToggleButton;
                            }
                        }
                    }

                    if (activeButton) {
                        h.addClass(activeButton, self.controls.activeClass);
                    }
                }
            }

            self.execAction('_updateControls', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {object}        command
         * @param   {Operation}     operation
         * @return  {Promise.<mixitup.State>}
         */

        _insert: function(command, operation) {
            var self        = this,
                nextSibling = null,
                frag        = null,
                target      = null,
                el          = null,
                i           = -1;

            self.execAction('insert', 0, arguments);

            if (typeof command.index === 'undefined') command.index = 0;

            nextSibling = self._getNextSibling(command.index, command.sibling, command.position);
            frag        = self._dom.document.createDocumentFragment();

            if (command.collection) {
                for (i = 0; el = command.collection[i]; i++) {
                    if (self._dom.targets.indexOf(el) > -1) {
                        throw new Error(mixitup.messages[151]);
                    }

                    // Ensure elements are hidden when they are added to the DOM, so they can
                    // be animated in gracefully

                    el.style.display = 'none';

                    frag.appendChild(el);
                    frag.appendChild(self._dom.document.createTextNode(' '));

                    if (!h.isElement(el, self._dom.document) || !el.matches(self.selectors.target)) continue;

                    target = new mixitup.Target();

                    target.init(el, self);

                    self._targets.splice(command.index, 0, target);

                    command.index++;
                }

                self._dom.parent.insertBefore(frag, nextSibling);
            }

            // Since targets have been added, the original order must be updated

            operation.startOrder = self._origOrder = self._targets;

            self.execAction('insert', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Number}      [index]
         * @param   {Element}     [sibling]
         * @param   {string}      [position]
         * @return  {Element}
         */

        _getNextSibling: function(index, sibling, position) {
            var self = this;

            if (sibling) {
                if (position === 'before') {
                    return sibling;
                } else if (position === 'after') {
                    return sibling.nextElementSibling || null;
                }
            }

            if (self._targets.length && typeof index !== 'undefined') {
                return (index < self._targets.length || !self._targets.length) ?
                    self._targets[index].dom.el :
                    self._targets[self._targets.length - 1].dom.el.nextElementSibling;
            } else {
                return self._dom.parent.children.length ? self._dom.parent.children[0] : null;
            }
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        _filter: function(operation) {
            var self        = this,
                condition   = false,
                index       = -1,
                target      = null,
                i           = -1;

            self.execAction('_filter', 0, arguments);

            for (i = 0; target = operation.newOrder[i]; i++) {
                if (typeof operation.newFilter === 'string') {
                    // show via selector

                    condition = operation.newFilter === '' ?
                        false : target.dom.el.matches(operation.newFilter);

                    self._evaluateHideShow(
                        condition,
                        target,
                        false,
                        operation
                    );
                } else if (
                    typeof operation.newFilter === 'object' &&
                    h.isElement(operation.newFilter, self._dom.document)
                ) {
                    // show via element

                    self._evaluateHideShow(
                        target.dom.el === operation.newFilter,
                        target,
                        false,
                        operation
                    );
                } else if (
                    typeof operation.newFilter === 'object' &&
                    operation.newFilter.length
                ) {
                    // show via collection

                    self._evaluateHideShow(
                        operation.newFilter.indexOf(target.dom.el) > -1,
                        target,
                        false,
                        operation
                    );
                }
            }

            if (operation.toRemove.length) {
                for (i = 0; target = operation.show[i]; i++) {
                    if (operation.toRemove.indexOf(target) > -1) {
                        // If any shown targets should be removed, move them into the toHide array

                        operation.show.splice(i, 1);

                        if ((index = operation.toShow.indexOf(target)) > -1) {
                            operation.toShow.splice(index, 1);
                        }

                        operation.toHide.push(target);
                        operation.hide.push(target);

                        i--;
                    }
                }
            }

            operation.matching = operation.show.slice();

            if (operation.show.length === 0 && operation.newFilter !== '' && self._targets.length !== 0) {
                operation.hasFailed = true;
            }

            self.execAction('_filter', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {boolean}   condition
         * @param   {Element}   target
         * @param   {boolean}   isRemoving
         * @param   {Operation} operation
         * @return  {void}
         */

        _evaluateHideShow: function(condition, target, isRemoving, operation) {
            var self = this;

            if (condition) {
                if (isRemoving && typeof operation.startFilter === 'string') {
                    self._evaluateHideShow(
                        target.dom.el.matches(operation.startFilter),
                        target,
                        false,
                        operation
                    );
                } else {
                    operation.show.push(target);

                    !target.isShown && operation.toShow.push(target);
                }
            } else {
                operation.hide.push(target);

                target.isShown && operation.toHide.push(target);
            }
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        _sort: function(operation) {
            var self = this;

            self.execAction('_sort', 0, arguments);

            operation.startOrder = self._targets;

            switch (operation.newSort[0].sortBy) {
                case 'default':
                    operation.newOrder = self._origOrder.slice();

                    if (operation.newSort[0].order === 'desc') {
                        operation.newOrder.reverse();
                    }

                    break;
                case 'random':
                    operation.newOrder = h.arrayShuffle(operation.startOrder);

                    break;
                case 'custom':
                    operation.newOrder = operation.newSort[0].order;

                    break;
                default:
                    operation.newOrder = operation.startOrder
                        .slice()
                        .sort(function(a, b) {
                            return self._compare(a, b, 0, operation.newSort);
                        });
            }

            if (h.isEqualArray(operation.newOrder, operation.startOrder)) {
                operation.willSort = false;
            }

            self.execAction('_sort', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {mixitup.Target}    a
         * @param   {mixitup.Target}    b
         * @param   {Number}            depth
         * @param   {ParsedSort}        sort
         * @return  {Number}
         */

        _compare: function(a, b, depth, sort) {
            depth = depth ? depth : 0;

            var self        = this,
                order       = sort[depth].order,
                attrA       = self._getAttributeValue(a, depth, sort),
                attrB       = self._getAttributeValue(b, depth, sort);

            if (isNaN(attrA * 1) || isNaN(attrB * 1)) {
                attrA = attrA.toLowerCase();
                attrB = attrB.toLowerCase();
            } else {
                attrA = attrA * 1;
                attrB = attrB * 1;
            }

            if (attrA < attrB) {
                return order === 'asc' ? -1 : 1;
            }

            if (attrA > attrB) {
                return order === 'asc' ? 1 : -1;
            }

            if (attrA === attrB && sort.length > depth + 1) {
                return self._compare(a, b, depth + 1, sort);
            }

            return 0;
        },

        /**
         * Reads the values of any data attributes present the provided target element
         * which match the current sort command.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Element}           target
         * @param   {number}            depth
         * @param   {ParsedSort}        [sort]
         * @return  {(String|Number)}
         */

        _getAttributeValue: function(target, depth, sort) {
            var self    = this,
                value   = '';

            sort = sort ? sort : self._newSort;

            value = target.dom.el.getAttribute('data-' + sort[depth].sortBy);

            if (value === null) {
                if (h.canReportErrors(self)) {
                    // Encourage users to assign values to all
                    // targets to avoid erroneous sorting when
                    // types are mixed

                    console.warn(mixitup.messages[250]);
                }
            }

            // If an attribute is not present, return 0 as a safety value

            return value || 0;
        },

        /**
         * Inserts elements into the DOM in the appropriate
         * order using a document fragment for minimal
         * DOM thrashing
         *
         * @private
         * @instance
         * @since   2.0.0
         * @param   {boolean}   isResetting
         * @param   {Operation} operation
         * @return  {void}
         */

        _printSort: function(isResetting, operation) {
            var self        = this,
                order       = isResetting ? operation.startOrder : operation.newOrder,
                targets     = h.children(self._dom.parent, self.selectors.target, self._dom.document),
                nextSibling = targets.length ? targets[targets.length - 1].nextElementSibling : null,
                frag        = self._dom.document.createDocumentFragment(),
                target      = null,
                whiteSpace  = null,
                el          = null,
                i           = -1;

            self.execAction('_printSort', 0, arguments);

            for (i = 0; el = targets[i]; i++) {
                // Empty the container

                whiteSpace = el.nextSibling;

                if (el.style.position === 'absolute') continue;

                if (whiteSpace && whiteSpace.nodeName === '#text') {
                    self._dom.parent.removeChild(whiteSpace);
                }

                self._dom.parent.removeChild(el);
            }

            for (i = 0; target = order[i]; i++) {
                // Add targets into a document fragment

                el = target.dom.el;

                frag.appendChild(el);
                frag.appendChild(self._dom.document.createTextNode(' '));
            }

            // Insert the document fragment into the container
            // before any other non-target elements

            nextSibling ?
                self._dom.parent.insertBefore(frag, nextSibling) :
                self._dom.parent.appendChild(frag);

            self.execAction('_printSort', 1, arguments);
        },

        /**
         * Parses user-defined sort commands (i.e. `default:asc`) into useable "rules".
         *
         * @private
         * @instance
         * @since   2.0.0
         * @param   {string}    sortString
         * @return  {String[]}
         */

        _parseSort: function(sortString) {
            var self        = this,
                rules       = typeof sortString === 'string' ? sortString.split(' ') : [sortString],
                newSort     = [],
                ruleObj     = null,
                rule        = [],
                i           = -1;

            for (i = 0; i < rules.length; i++) {
                rule = typeof sortString === 'string' ? rules[i].split(':') : ['custom', rules[i]];
                ruleObj = {
                    sortBy: h.camelCase(rule[0]),
                    order: rule[1] || 'asc'
                };

                newSort.push(ruleObj);

                if (ruleObj.sortBy === 'default' || ruleObj.sortBy === 'random') break;
            }

            return self.execFilter('_parseSort', newSort, arguments);
        },

        /**
         * Parses all effects out of the user-defined `animation.effects` string into
         * their respective properties and units.
         *
         * @private
         * @instance
         * @since   2.0.0
         * @return  {void}
         */

        _parseEffects: function() {
            var self            = this,
                transformName   = '',
                effectsIn       = self.animation.effectsIn || self.animation.effects,
                effectsOut      = self.animation.effectsOut || self.animation.effects;

            self._effectsIn      = new mixitup.StyleData();
            self._effectsOut     = new mixitup.StyleData();
            self._transformIn    = [];
            self._transformOut   = [];

            self._effectsIn.opacity = self._effectsOut.opacity = 1;

            self._parseEffect('fade', effectsIn, self._effectsIn, self._transformIn);
            self._parseEffect('fade', effectsOut, self._effectsOut, self._transformOut, true);

            for (transformName in mixitup.transformDefaults) {
                if (!(mixitup.transformDefaults[transformName] instanceof mixitup.TransformData)) {
                    continue;
                }

                self._parseEffect(transformName, effectsIn, self._effectsIn, self._transformIn);
                self._parseEffect(transformName, effectsOut, self._effectsOut, self._transformOut, true);
            }

            self._parseEffect('stagger', effectsIn, self._effectsIn, self._transformIn);
            self._parseEffect('stagger', effectsOut, self._effectsOut, self._transformOut, true);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {string}    effectName
         * @param   {string}    effectString
         * @param   {StyleData} effects
         * @param   {String[]}  transform
         * @param   {boolean}   [isOut]
         */

        _parseEffect: function(effectName, effectString, effects, transform, isOut) {
            var self        = this,
                re          = /\(([^)]+)\)/,
                propIndex   = -1,
                str         = '',
                match       = [],
                val         = '',
                units       = ['%', 'px', 'em', 'rem', 'vh', 'vw', 'deg'],
                unit        = '',
                i           = -1;

            if (!effectString || typeof effectString !== 'string') {
                throw new Error(mixitup.messages[101]);
            }

            if (effectString.indexOf(effectName) < 0) {
                // The effect is not present in the effects string

                if (effectName === 'stagger') {
                    // Reset stagger to 0

                    self._staggerDuration = 0;
                }

                return;
            }

            // The effect is present

            propIndex = effectString.indexOf(effectName + '(');

            if (propIndex > -1) {
                // The effect has a user defined value in parentheses

                // Extract from the first parenthesis to the end of string

                str = effectString.substring(propIndex);

                // Match any number of characters between "(" and ")"

                match = re.exec(str);

                val = match[1];
            }

            switch (effectName) {
                case 'fade':
                    effects.opacity = val ? parseFloat(val) : 0;

                    break;
                case 'stagger':
                    self._staggerDuration = val ? parseFloat(val) : 100;

                    // TODO: Currently stagger must be applied globally, but
                    // if seperate values are specified for in/out, this should
                    // be respected

                    break;
                default:
                    // All other effects are transforms following the same structure

                    if (isOut && self.animation.reverseOut && effectName !== 'scale') {
                        effects[effectName].value =
                            (val ? parseFloat(val) : mixitup.transformDefaults[effectName].value) * -1;
                    } else {
                        effects[effectName].value =
                            (val ? parseFloat(val) : mixitup.transformDefaults[effectName].value);
                    }

                    if (val) {
                        for (i = 0; unit = units[i]; i++) {
                            if (val.indexOf(unit) > -1) {
                                effects[effectName].unit = unit;

                                break;
                            }
                        }
                    } else {
                        effects[effectName].unit = mixitup.transformDefaults[effectName].unit;
                    }

                    transform.push(
                        effectName +
                        '(' +
                        effects[effectName].value +
                        effects[effectName].unit +
                        ')'
                    );
            }
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {State}
         */

        _buildState: function(operation) {
            var self        = this,
                state       = new mixitup.State(),
                target      = null,
                i           = -1;

            self.execAction('_buildState', 0);

            // Map target elements into state arrays.
            // the real target objects should never be exposed

            for (i = 0; target = self._targets[i]; i++) {
                if (!operation.toRemove.length || operation.toRemove.indexOf(target) < 0) {
                    state.targets.push(target.dom.el);
                }
            }

            for (i = 0; target = operation.matching[i]; i++) {
                state.matching.push(target.dom.el);
            }

            for (i = 0; target = operation.show[i]; i++) {
                state.show.push(target.dom.el);
            }

            for (i = 0; target = operation.hide[i]; i++) {
                if (!operation.toRemove.length || operation.toRemove.indexOf(target) < 0) {
                    state.hide.push(target.dom.el);
                }
            }

            state.activeFilter         = operation.newFilter;
            state.activeSort           = operation.newSortString;
            state.activeContainerClass = operation.newContainerClass;
            state.hasFailed            = operation.hasFailed;
            state.totalTargets         = self._targets.length;
            state.totalShow            = operation.show.length;
            state.totalHide            = operation.hide.length;
            state.totalMatching        = operation.matching.length;
            state.triggerElement       = self._lastClicked;

            return self.execFilter('_buildState', state, arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {boolean}   shouldAnimate
         * @param   {Operation} operation
         * @return  {void}
         */

        _goMix: function(shouldAnimate, operation) {
            var self            = this;

            self.execAction('_goMix', 0, arguments);

            // If the animation duration is set to 0ms,
            // Or the container is hidden
            // then abort animation

            if (
                !self.animation.duration ||
                !h.isVisible(self._dom.container)
            ) {
                shouldAnimate = false;
            }

            if (
                !operation.toShow.length &&
                !operation.toHide.length &&
                !operation.willSort &&
                !operation.willChangeLayout
            ) {
                // If nothing to show or hide, and not sorting or
                // changing layout

                shouldAnimate = false;
            }

            if (
                !operation.startState.show.length &&
                !operation.show.length
            ) {
                // If nothing currently shown, nothing to show

                shouldAnimate = false;
            }

            if (
                !self._userPromise ||
                self._userPromise.isResolved
            ) {
                // If no promise exists, then assign one

                self._userPromise = h.getPromise(self.libraries);
            }

            mixitup.events.fire('mixStart', self._dom.container, {
                state: operation.startState,
                futureState: operation.newState,
                instance: self
            }, self._dom.document);

            if (typeof self.callbacks.onMixStart === 'function') {
                self.callbacks.onMixStart.call(
                    self._dom.container,
                    operation.startState,
                    operation.newState,
                    self
                );
            }

            h.removeClass(self._dom.container, self.layout.containerClassFail);

            if (shouldAnimate && mixitup.features.has.transitions) {
                // If we should animate and the platform supports
                // transitions, go for it

                self._isMixing = true;

                if (window.pageYOffset !== operation.docState.scrollTop) {
                    window.scrollTo(operation.docState.scrollLeft, operation.docState.scrollTop);
                }

                if (self.animation.applyPerspective) {
                    self._dom.parent.style[mixitup.features.perspectiveProp] =
                        self.animation.perspectiveDistance;

                    self._dom.parent.style[mixitup.features.perspectiveOriginProp] =
                        self.animation.perspectiveOrigin;
                }

                if (self.animation.animateResizeContainer || operation.startHeight === operation.newHeight) {
                    self._dom.parent.style.height = operation.startHeight + 'px';
                }

                if (self.animation.animateResizeContainer || operation.startWidth === operation.newWidth) {
                    self._dom.parent.style.width = operation.startWidth + 'px';
                }

                requestAnimationFrame(function() {
                    self._moveTargets(operation);
                });
            } else {
                // Abort

                self._cleanUp(operation);
            }

            self.execAction('_goMix', 1, arguments);

            return self._userPromise.promise;
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        _getStartMixData: function(operation) {
            var self        = this,
                parentStyle = window.getComputedStyle(self._dom.parent),
                parentRect  = self._dom.parent.getBoundingClientRect(),
                target      = null,
                data        = {},
                i           = -1,
                boxSizing   = parentStyle[mixitup.features.boxSizingProp];

            self._incPadding = (boxSizing === 'border-box');

            self.execAction('_getStartMixData', 0);

            for (i = 0; target = operation.show[i]; i++) {
                data = target.getPosData();

                operation.showPosData[i] = {
                    startPosData: data
                };
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                data = target.getPosData();

                operation.toHidePosData[i] = {
                    startPosData: data
                };
            }

            operation.startX = parentRect.left;
            operation.startY = parentRect.top;

            operation.startHeight = self._incPadding ?
                parentRect.height :
                parentRect.height -
                    parseFloat(parentStyle.paddingTop) -
                    parseFloat(parentStyle.paddingBottom) -
                    parseFloat(parentStyle.borderTop) -
                    parseFloat(parentStyle.borderBottom);

            operation.startWidth = self._incPadding ?
                parentRect.width :
                parentRect.width -
                    parseFloat(parentStyle.paddingLeft) -
                    parseFloat(parentStyle.paddingRight) -
                    parseFloat(parentStyle.borderLeft) -
                    parseFloat(parentStyle.borderRight);

            self.execAction('_getStartMixData', 1);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        _setInter: function(operation) {
            var self    = this,
                target  = null,
                i       = -1;

            self.execAction('_setInter', 0);

            for (i = 0; target = operation.toShow[i]; i++) {
                target.show();
            }

            if (operation.willChangeLayout) {
                h.removeClass(self._dom.container, operation.startContainerClass);
                h.addClass(self._dom.container, operation.newContainerClass);
            }

            self.execAction('_setInter', 1);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        _getInterMixData: function(operation) {
            var self    = this,
                target  = null,
                i       = -1;

            self.execAction('_getInterMixData', 0);

            for (i = 0; target = operation.show[i]; i++) {
                operation.showPosData[i].interPosData = target.getPosData();
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                operation.toHidePosData[i].interPosData = target.getPosData();
            }

            self.execAction('_getInterMixData', 1);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        _setFinal: function(operation) {
            var self    = this,
                target  = null,
                i       = -1;

            self.execAction('_setFinal', 0);

            operation.willSort && self._printSort(false, operation);

            for (i = 0; target = operation.toHide[i]; i++) {
                target.hide();
            }

            self.execAction('_setFinal', 1);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        _getFinalMixData: function(operation) {
            var self        = this,
                parentStyle = null,
                parentRect  = self._dom.parent.getBoundingClientRect(),
                target      = null,
                i           = -1;

            if (!self._incPadding) {
                parentStyle = window.getComputedStyle(self._dom.parent);
            }

            self.execAction('_getFinalMixData', 0, arguments);

            for (i = 0; target = operation.show[i]; i++) {
                operation.showPosData[i].finalPosData = target.getPosData();
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                operation.toHidePosData[i].finalPosData = target.getPosData();
            }

            operation.newX = parentRect.left;
            operation.newY = parentRect.top;

            operation.newHeight = self._incPadding ?
                parentRect.height :
                parentRect.height -
                    parseFloat(parentStyle.paddingTop) -
                    parseFloat(parentStyle.paddingBottom) -
                    parseFloat(parentStyle.borderTop) -
                    parseFloat(parentStyle.borderBottom);

            operation.newWidth = self._incPadding ?
                parentRect.width :
                parentRect.width -
                    parseFloat(parentStyle.paddingLeft) -
                    parseFloat(parentStyle.paddingRight) -
                    parseFloat(parentStyle.borderLeft) -
                    parseFloat(parentStyle.borderRight);

            if (operation.willSort) {
                self._printSort(true, operation);
            }

            for (i = 0; target = operation.toShow[i]; i++) {
                target.hide();
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                target.show();
            }

            if (operation.willChangeLayout && self.animation.animateChangeLayout) {
                h.removeClass(self._dom.container, operation.newContainerClass);
                h.addClass(self._dom.container, self.layout.containerClass);
            }

            self.execAction('_getFinalMixData', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since    3.0.0
         * @param    {Operation}     operation
         */

        _getTweenData: function(operation) {
            var self        = this,
                target      = null,
                posData     = null,
                effectNames = Object.getOwnPropertyNames(self._effectsIn),
                effectName  = '',
                effect      = null,
                i           = -1,
                j           = -1;

            for (i = 0; target = operation.show[i]; i++) {
                posData             = operation.showPosData[i];
                posData.posIn       = new mixitup.StyleData();
                posData.posOut      = new mixitup.StyleData();
                posData.tweenData   = new mixitup.StyleData();

                // Process x and y

                posData.posIn.x     = target.isShown ? posData.startPosData.x - posData.interPosData.x : 0;
                posData.posIn.y     = target.isShown ? posData.startPosData.y - posData.interPosData.y : 0;

                posData.posOut.x = posData.finalPosData.x - posData.interPosData.x;
                posData.posOut.y = posData.finalPosData.y - posData.interPosData.y;

                if (self.animation.balanceContainerShift) {
                    // TODO: Needs further testing/investigation

                    posData.posOut.x += (operation.startX - operation.newX);
                    posData.posOut.y += (operation.startY - operation.newY);
                }

                // Process opacity

                posData.posIn.opacity       = target.isShown ? 1 : self._effectsIn.opacity;
                posData.posOut.opacity      = 1;
                posData.tweenData.opacity   = posData.posOut.opacity - posData.posIn.opacity;

                // Adjust x and y if not nudging

                if (!target.isShown && !self.animation.nudge) {
                    posData.posIn.x = posData.posOut.x;
                    posData.posIn.y = posData.posOut.y;
                }

                posData.tweenData.x = posData.posOut.x - posData.posIn.x;
                posData.tweenData.y = posData.posOut.y - posData.posIn.y;

                // Process width, height, and margins

                if (self.animation.animateResizeTargets) {
                    posData.posIn.width     = posData.startPosData.width;
                    posData.posIn.height    = posData.startPosData.height;

                    if (posData.startPosData.width - posData.finalPosData.width) {
                        posData.posIn.marginRight =
                            -(posData.startPosData.width - posData.interPosData.width) +
                            (posData.startPosData.marginRight * 1);
                    } else {
                        posData.posIn.marginRight = posData.startPosData.marginRight;
                    }

                    if (posData.startPosData.height - posData.finalPosData.height) {
                        posData.posIn.marginBottom =
                            -(posData.startPosData.height - posData.interPosData.height) +
                            (posData.startPosData.marginBottom * 1);
                    } else {
                        posData.posIn.marginBottom = posData.startPosData.marginBottom;
                    }

                    posData.posOut.width    = posData.finalPosData.width;
                    posData.posOut.height   = posData.finalPosData.height;

                    posData.posOut.marginRight =
                        -(posData.finalPosData.width - posData.interPosData.width) +
                        (posData.finalPosData.marginRight * 1);

                    posData.posOut.marginBottom =
                        -(posData.finalPosData.height - posData.interPosData.height) +
                        (posData.finalPosData.marginBottom * 1);

                    posData.tweenData.width         = posData.posOut.width - posData.posIn.width;
                    posData.tweenData.height        = posData.posOut.height - posData.posIn.height;
                    posData.tweenData.marginRight   = posData.posOut.marginRight - posData.posIn.marginRight;
                    posData.tweenData.marginBottom  = posData.posOut.marginBottom - posData.posIn.marginBottom;
                }

                // Process transforms

                for (j = 0; effectName = effectNames[j]; j++) {
                    effect = self._effectsIn[effectName];

                    if (!(effect instanceof mixitup.TransformData) || !effect.value) continue;

                    posData.posIn[effectName].value     = effect.value;
                    posData.posOut[effectName].value    = 0;

                    posData.tweenData[effectName].value =
                        posData.posOut[effectName].value - posData.posIn[effectName].value;

                    posData.posIn[effectName].unit =
                        posData.posOut[effectName].unit =
                        posData.tweenData[effectName].unit =
                        effect.unit;
                }
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                posData             = operation.toHidePosData[i];
                posData.posIn       = new mixitup.StyleData();
                posData.posOut      = new mixitup.StyleData();
                posData.tweenData   = new mixitup.StyleData();

                // Process x and y

                posData.posIn.x     = target.isShown ? posData.startPosData.x - posData.interPosData.x : 0;
                posData.posIn.y     = target.isShown ? posData.startPosData.y - posData.interPosData.y : 0;
                posData.posOut.x    = self.animation.nudge ? 0 : posData.posIn.x;
                posData.posOut.y    = self.animation.nudge ? 0 : posData.posIn.y;
                posData.tweenData.x = posData.posOut.x - posData.posIn.x;
                posData.tweenData.y = posData.posOut.y - posData.posIn.y;

                // Process width, height, and margins

                if (self.animation.animateResizeTargets) {
                    posData.posIn.width         = posData.startPosData.width;
                    posData.posIn.height        = posData.startPosData.height;
                    posData.posIn.marginRight   = posData.startPosData.marginRight;
                    posData.posIn.marginBottom  = posData.startPosData.marginBottom;
                }

                // Process opacity

                posData.posIn.opacity       = 1;
                posData.posOut.opacity      = self._effectsOut.opacity;
                posData.tweenData.opacity   = posData.posOut.opacity - posData.posIn.opacity;

                // Process transforms

                for (j = 0; effectName = effectNames[j]; j++) {
                    effect = self._effectsOut[effectName];

                    if (!(effect instanceof mixitup.TransformData) || !effect.value) continue;

                    posData.posIn[effectName].value     = 0;
                    posData.posOut[effectName].value    = effect.value;

                    posData.tweenData[effectName].value =
                        posData.posOut[effectName].value - posData.posIn[effectName].value;

                    posData.posIn[effectName].unit =
                        posData.posOut[effectName].unit =
                        posData.tweenData[effectName].unit =
                        effect.unit;
                }
            }
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        _moveTargets: function(operation) {
            var self            = this,
                target          = null,
                posData         = null,
                hideOrShow      = '',
                willTransition  = false,
                staggerIndex    = -1,
                i               = -1,
                checkProgress   = h.bind(self, self._checkProgress);

            // TODO: this is an extra loop in addition to the calcs
            // done in getOperation, can we get around somehow?

            for (i = 0; target = operation.show[i]; i++) {
                posData = operation.showPosData[i];

                hideOrShow = target.isShown ? false : 'show'; // TODO: can we not mix types here?

                willTransition = self._willTransition(
                    hideOrShow,
                    operation.hasEffect,
                    posData.posIn,
                    posData.posOut
                );

                if (willTransition) {
                    // Prevent non-transitioning targets from incrementing the staggerIndex

                    staggerIndex++;
                }

                target.show();

                target.move({
                    posIn: posData.posIn,
                    posOut: posData.posOut,
                    hideOrShow: hideOrShow,
                    staggerIndex: staggerIndex,
                    operation: operation,
                    callback: willTransition ? checkProgress : null
                });
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                posData = operation.toHidePosData[i];

                hideOrShow = 'hide';

                willTransition = self._willTransition(hideOrShow, posData.posIn, posData.posOut);

                target.move({
                    posIn: posData.posIn,
                    posOut: posData.posOut,
                    hideOrShow: hideOrShow,
                    staggerIndex: i,
                    operation: operation,
                    callback: willTransition ? checkProgress : null
                });
            }

            if (self.animation.animateResizeContainer) {
                self._dom.parent.style[mixitup.features.transitionProp] =
                    'height ' + self.animation.duration + 'ms ease, ' +
                    'width ' + self.animation.duration + 'ms ease ';

                requestAnimationFrame(function() {
                    self._dom.parent.style.height = operation.newHeight + 'px';
                    self._dom.parent.style.width = operation.newWidth + 'px';
                });
            }

            if (operation.willChangeLayout) {
                h.removeClass(self._dom.container, self.layout.containerClass);
                h.addClass(self._dom.container, operation.newContainerClass);
            }
        },

        /**
         * @private
         * @instance
         * @return  {boolean}
         */

        hasEffect: function() {
            var self        = this,
                effectables = [
                    'scale',
                    'translateX', 'translateY', 'translateZ',
                    'rotateX', 'rotateY', 'rotateZ'
                ],
                effectName  = '',
                effect      = null,
                value       = -1,
                i           = -1;

            if (self._effectsIn.opacity !== 1) {
                return true;
            }

            for (i = 0; effectName = effectables[i]; i++) {
                effect  = self._effectsIn[effectName];
                value   = (typeof effect && effect.value !== 'undefined') ?
                    effect.value : effect;

                if (value !== 0) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Determines if a target element will transition in
         * some fasion and therefore requires binding of
         * transitionEnd
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string}        hideOrShow
         * @param   {boolean}       hasEffect
         * @param   {StyleData}     posIn
         * @param   {StyleData}     posOut
         * @return  {boolean}
         */

        _willTransition: function(hideOrShow, hasEffect, posIn, posOut) {
            var self = this;

            if (!h.isVisible(self._dom.container)) {
                // If the container is not visible, the transitionEnd
                // event will not occur and MixItUp will hang

                return false;
            }

            // Check if opacity and/or translate will change

            if (
                (hideOrShow && hasEffect) ||
                posIn.x !== posOut.x ||
                posIn.y !== posOut.y
            ) {
                return true;
            } else if (self.animation.animateResizeTargets) {
                // Check if width, height or margins will change

                return (
                    posIn.width !== posOut.width ||
                    posIn.height !== posOut.height ||
                    posIn.marginRight !== posOut.marginRight ||
                    posIn.marginTop !== posOut.marginTop
                );
            } else {
                return false;
            }
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        _checkProgress: function(operation) {
            var self = this;

            self._targetsDone++;

            if (self._targetsBound === self._targetsDone) {
                self._cleanUp(operation);
            }
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        _cleanUp: function(operation) {
            var self        = this,
                target      = null,
                nextInQueue = null,
                i           = -1;

            self._isMixing = false;

            self.execAction('_cleanUp', 0);

            self._targetsMoved          =
                self._targetsImmovable  =
                self._targetsBound      =
                self._targetsDone       = 0;

            for (i = 0; target = operation.show[i]; i++) {
                target.cleanUp();

                target.show();
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                target.cleanUp();

                target.hide();
            }

            if (operation.willSort) {
                self._printSort(false, operation);

                self._targets = operation.newOrder;
            }

            // Remove any styles applied to the parent container

            self._dom.parent.style[mixitup.features.transitionProp]             =
                self._dom.parent.style.height                                   =
                self._dom.parent.style.width                                    =
                self._dom.parent.style[mixitup.features.perspectiveProp]        =
                self._dom.parent.style[mixitup.features.perspectiveOriginProp]  = '';

            if (operation.willChangeLayout) {
                h.removeClass(self._dom.container, operation.startContainerClass);
                h.addClass(self._dom.container, operation.newContainerClass);
            }

            if (operation.toRemove.length) {
                for (i = 0; target = self._targets[i]; i++) {
                    if (operation.toRemove.indexOf(target) > -1) {

                        h.deleteElement(target.dom.el);

                        self._targets.splice(i, 1);

                        i--;
                    }
                }

                // Since targets have been removed, the original order must be updated

                self._origOrder = self._targets;
            }

            self._state = operation.newState;
            self._lastOperation = operation;

            self._dom.targets = self._state.targets;

            // mixEnd

            mixitup.events.fire('mixEnd', self._dom.container, {
                state: self._state,
                instance: self
            }, self._dom.document);

            if (typeof self.callbacks.onMixEnd === 'function') {
                self.callbacks.onMixEnd.call(self._dom.container, self._state, self);
            }

            if (operation.hasFailed) {
                // mixFail

                mixitup.events.fire('mixFail', self._dom.container, {
                    state: self._state,
                    instance: self
                }, self._dom.document);

                if (typeof self.callbacks.onMixFail === 'function') {
                    self.callbacks.onMixFail.call(self._dom.container, self._state, self);
                }

                h.addClass(self._dom.container, self.layout.containerClassFail);
            }

            // User-defined callback function

            if (typeof self._userCallback === 'function') {
                self._userCallback.call(self._dom.container, self._state, self);
            }

            self._userPromise.resolve(self._state);

            self._userPromise.isResolved = true;

            if (self._queue.length) {
                self.execAction('_queue', 0);

                nextInQueue = self._queue.shift();

                self._userPromise = nextInQueue[3];

                self.multiMix.apply(self, nextInQueue);
            }

            self.execAction('_cleanUp', 1);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Array<*>}  args
         * @return  {object}
         */

        _parseMultiMixArgs: function(args) {
            var self        = this,
                instruction = new mixitup.UserInstruction(),
                arg         = null,
                i           = -1;

            instruction.animate = self.animation.enable;

            for (i = 0; i < args.length; i++) {
                arg = args[i];

                if (arg !== null) {
                    if (typeof arg === 'object' || typeof arg === 'string') {
                        instruction.command = arg;
                    } else if (typeof arg === 'boolean') {
                        instruction.animate = arg;
                    } else if (typeof arg === 'function') {
                        instruction.callback = arg;
                    }
                }
            }

            return self.execFilter('_parseMultiMixArgs', instruction, arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Array<*>}  args
         * @return  {object}
         */

        _parseInsertArgs: function(args) {
            var self        = this,
                instruction = new mixitup.UserInstruction(),
                arg         = null,
                i           = -1;

            instruction.animate = self.animation.enable;

            instruction.command = {
                index: 0, // Index to insert at
                collection: [], // Element(s) to insert
                position: 'before', // Position relative to a sibling if passed
                sibling: null // A sibling element as a reference
            };

            for (i = 0; i < args.length; i++) {
                arg = args[i];

                if (typeof arg === 'number') {
                    // Insert index

                    instruction.command.index = arg;
                } else if (typeof arg === 'string' && ['before', 'after'].indexOf(arg) > -1) {
                    // 'before'/'after'

                    instruction.command.position = arg;
                } else if (typeof arg === 'string') {
                    // Markup

                    instruction.command.collection =
                        Array.prototype.slice.call(h.createElement(arg).children);
                } else if (typeof arg === 'object' && h.isElement(arg, self._dom.document)) {
                    // Single element

                    !instruction.command.collection.length ?
                        (instruction.command.collection = [arg]) :
                        (instruction.command.sibling = arg);
                } else if (typeof arg === 'object' && arg !== null && arg.length) {
                    // Multiple elements in array or jQuery collection

                    !instruction.command.collection.length ?
                        (instruction.command.collection = arg) :
                        instruction.command.sibling = arg[0];
                } else if (
                    typeof arg === 'object' &&
                    arg !== null &&
                    arg.childNodes &&
                    arg.childNodes.length
                ) {
                    // Document fragment

                    !instruction.command.collection.length ?
                        instruction.command.collection = Array.prototype.slice.call(arg.childNodes) :
                        instruction.command.sibling = arg.childNodes[0];
                } else if (typeof arg === 'boolean') {
                    instruction.animate = arg;
                } else if (typeof arg === 'function') {
                    instruction.callback = arg;
                }
            }

            if (!instruction.command.collection.length && h.canReportErrors(self)) {
                throw new Error(mixitup.messages[102]);
            }

            return self.execFilter('_parseInsertArgs', instruction, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Array<*>}  args
         * @return  {object}
         */

        _parseRemoveArgs: function(args) {
            var self        = this,
                instruction = new mixitup.UserInstruction(),
                collection  = [],
                target      = null,
                arg         = null,
                i           = -1;

            instruction.animate = self.animation.enable;

            instruction.command = {
                targets: []
            };

            for (i = 0; i < args.length; i++) {
                arg = args[i];

                switch (typeof arg) {
                    case 'number':
                        if (self._targets[arg]) {
                            instruction.command.targets[0] = self._targets[arg];
                        }

                        break;
                    case 'string':
                        collection = Array.prototype.slice.call(self._dom.parent.querySelectorAll(arg));

                        break;
                    case 'object':
                        if (arg && arg.length) {
                            collection = arg;
                        } else if (h.isElement(arg, self._dom.document)) {
                            collection = [arg];
                        }

                        break;
                    case 'boolean':
                        instruction.animate = arg;

                        break;
                    case 'function':
                        instruction.callback = arg;

                        break;
                }
            }

            if (collection.length) {
                for (i = 0; target = self._targets[i]; i++) {
                    if (collection.indexOf(target.dom.el) > -1) {
                        instruction.command.targets.push(target);
                    }
                }
            }

            return self.execFilter('_parseRemoveArgs', instruction, arguments);
        },

        /**
         * @private
         * @instance
         * @since       3.0.0
         * @param       {Array<*>}                  args
         * @param       {mixitup.UserInstruction}   instruction
         * @return      {Promise.<mixitup.State>}
         */

        _deferMix: function(args, instruction) {
            var self    = this,
                promise = null;

            promise = h.getPromise(self.libraries);

            if (self.animation.queue && self._queue.length < self.animation.queueLimit) {
                args[3] = promise;

                self._queue.push(args);

                (self.controls.enable && !self._isClicking) && self._updateControls(instruction.command);

                self.execAction('multiMixQueue', 1, args);
            } else {
                if (h.canReportErrors(self)) {
                    console.warn(mixitup.messages[201]);
                }

                promise.resolve(self._state);
                promise.isResolved = true;

                mixitup.events.fire('mixBusy', self._dom.container, {
                    state: self._state,
                    instance: self
                }, self._dom.document);

                if (typeof self.callbacks.onMixBusy === 'function') {
                    self.callbacks.onMixBusy.call(self._dom.container, self._state, self);
                }

                self.execAction('multiMixBusy', 1, args);
            }

            return promise.promise;
        },

        /**
         * Initialises a newly instantiated mixer by filtering in all targets, or those
         * specified via the `load.filter` configuration option.
         *
         * @example
         * .init([startFromHidden])
         *
         * @example <caption>Example 1: Running init after mixer instantiation</caption>
         * var container = document.querySelector('.mixitup-container');
         * var mixer = mixitup(container);
         *
         * mixer.init();
         *
         * @example
         * var mixer = mixitup(.mixitup-container, {
         *     selectors: {
         *         target: '.item'
         *     }
         * });
         *
         * mixer.init();
         *
         * @public
         * @instance
         * @since       3.0.0
         * @param       {boolean}   [startFromHidden]
         *      An optional boolean dictating whether targets should start from a hidden or non-hidden state.
         * @return      {Promise.<mixitup.State>}
         */

        init: function(startFromHidden) {
            var self    = this,
                target  = null,
                i       = -1;

            if (startFromHidden) {
                for (i = 0; target = self._targets[i]; i++) {
                    target.hide();
                }
            }

            return self.multiMix({
                filter: self._state.activeFilter
            });
        },

        /**
         * A shorthand method for `.filter('all')`.
         *
         * @example
         * .show()
         *
         * @public
         * @instance
         * @since       3.0.0
         * @return      {Promise.<mixitup.State>}
         */

        show: function() {
            var self = this;

            return self.filter('all');
        },

        /**
         * A shorthand method for `.filter('none')`.
         *
         * @example
         * .hide()
         *
         * @public
         * @instance
         * @since       3.0.0
         * @return      {Promise.<mixitup.State>}
         */

        hide: function() {
            var self = this;

            return self.filter('none');
        },

        /**
         * Returns a boolean indicating whether or not a MixItUp operation is
         * currently in progress.
         *
         * @example
         * .isMixing()
         *
         * @public
         * @instance
         * @since   2.0.0
         * @return  {boolean}
         */

        isMixing: function() {
            var self = this;

            return self._isMixing;
        },

        /**
         * Filters the mixer according to the specified filter command.
         *
         * @example
         * .filter(filterCommand [,animate] [,callback])
         *
         * @public
         * @instance
         * @since       2.0.0
         * @param       {string}    filterCommand
         *      Any valid CSS selector (i.e. `'.category-2'`), or the strings `'all'` or `'none'`.
         * @param       {boolean}   [animate]
         * @param       {function}  [callback]
         * @return      {Promise.<mixitup.State>}
         */

        filter: function(filterCommand) {
            var self = this,
                args = self._parseMultiMixArgs(arguments);

            self._isClicking && (self._toggleString = '');

            return self.multiMix({
                filter: args.command
            }, args.animate, args.callback);
        },

        /**
         * Sorts the mixer according to the specified sort command.
         *
         * @example
         * .sort(sortCommand [,animate] [,callback])
         *
         * @public
         * @instance
         * @since       2.0.0
         * @param       {string}    sortCommand
         *      A colon-seperated "sorting pair" (e.g. `'published:asc'`, or `'random'`.
         * @param       {boolean}   [animate]
         * @param       {function}  [callback]
         * @return      {Promise.<mixitup.State>}
         */

        sort: function(sortCommand) {
            var self = this,
                args = self._parseMultiMixArgs(arguments);

            return self.multiMix({
                sort: args.command
            }, args.animate, args.callback);
        },

        /**
         * @public
         * @instance
         * @since       2.0.0
         * @return      {Promise.<mixitup.State>}
         */

        changeLayout: function() {
            // TODO: parse arguments, and map to multiMix
        },

        /**
         * @public
         * @instance
         * @since   3.0.0
         * @param   {Command}           command
         * @param   {boolean}           [isPreFetch]
         *      An optional boolean indicating that the operation is being pre-fetched for execution at a later time.
         * @return  {Operation|null}
         */

        getOperation: function(command, isPreFetch) {
            var self                = this,
                sortCommand         = command.sort,
                filterCommand       = command.filter,
                changeLayoutCommand = command.changeLayout,
                removeCommand       = command.remove,
                insertCommand       = command.insert,
                operation           = new mixitup.Operation();

            operation.command       = command;
            operation.startState    = self._state;
            operation.id            = h.randomHexKey();

            self.execAction('getOperation', 0, operation);

            // TODO: passing the operation rather than arguments
            // to the action is non-standard here but essential as
            // we require a reference to original. Perhaps a "pre"
            // filter is the best alternative, but as we already use
            // a filter at the end of this function, we would need a
            // new syntax

            if (self._isMixing) {
                if (h.canReportErrors(self)) {
                    console.warn(mixitup.messages[201]);
                }

                return null;
            }

            // If the commands are passed directly to multiMix, they need additional parsing:

            if (insertCommand) {
                if (typeof insertCommand.collection === 'undefined') {
                    insertCommand = self._parseInsertArgs([insertCommand]).command;
                }

                self._insert(insertCommand, operation);
            }

            if (removeCommand) {
                if (typeof removeCommand.targets === 'undefined' && removeCommand.collection.length) {
                    removeCommand = self._parseRemoveArgs([removeCommand.collection]).command;
                }

                operation.toRemove = removeCommand.targets;
            }

            if (sortCommand) {
                operation.startSortString   = operation.startState.activeSort;
                operation.newSort           = self._parseSort(sortCommand);
                operation.newSortString     = sortCommand;

                if (sortCommand !== operation.startState.activeSortString || sortCommand === 'random') {
                    operation.willSort = true;

                    self._sort(operation);
                }
            } else {
                operation.startSortString = operation.newSortString = operation.startState.activeSort;
                operation.startOrder = operation.newOrder = self._targets;
            }

            operation.startFilter = operation.startState.activeFilter;

            if (filterCommand) {
                operation.newFilter = filterCommand === 'all' ?
                    self.selectors.target :
                    filterCommand === 'none' ?
                        '' :
                        filterCommand;
            } else {
                operation.newFilter = operation.startState.activeFilter;
            }

            self._filter(operation);

            // TODO: we need a definitve object for filter operations,
            // which accomodates selectors, elements, hide vs show etc.

            if (typeof changeLayoutCommand !== 'undefined') {
                operation.startContainerClass = operation.startState.activeContainerClass;

                operation.newContainerClass   =
                    changeLayoutCommand.containerClass || operation.startContainerClass;

                if (operation.newContainerClass !== operation.startContainerClass) {
                    operation.willChangeLayout = true;
                }
            }

            // Populate the operation's position data

            self._getStartMixData(operation);
            self._setInter(operation);

            operation.docState = h.getDocumentState();

            self._getInterMixData(operation);
            self._setFinal(operation);
            self._getFinalMixData(operation);

            self._parseEffects();

            operation.hasEffect = self.hasEffect();

            self._getTweenData(operation);

            operation.newState = self._buildState(operation);

            return self.execFilter('getOperation', operation, arguments);
        },

        /**
         * Performs simultaneous `filter`, `sort`, `insert`, `remove` and `changeLayout`
         * operations as requested.
         *
         * @example
         * .multiMix(multiMixCommand [,animate] [,callback])
         *
         * @public
         * @instance
         * @since       2.0.0
         * @param       {object}    multiMixCommand
         *      An object containing one or more operation commands
         * @param       {boolean}   [animate=true]
         * @param       {function}  [callback=null]
         * @return      {Promise.<mixitup.State>}
         */

        multiMix: function(multiMixCommand) {
            var self        = this,
                operation   = null,
                animate     = false,
                instruction = self._parseMultiMixArgs(arguments);

            // multiMixCommand argument passed purely to please jscs, all params
            // actually derived via arguments list

            self.execAction('multiMix', 0, arguments);

            if (!self._isClicking) {
                self._lastClicked = null;
            }

            if (!self._isMixing) {
                operation = self.getOperation(instruction.command);

                if (self.controls.enable && !self._isClicking) {
                    // Update controls for API calls

                    if (instruction.command.filter) {
                        // We are no longer toggling as API methods override controls

                        self._isToggling            = false;
                        self._toggleArray.length    = 0;

                        // Build a toggle array from the requested command

                        self._buildToggleArray(operation.command);
                    }

                    self._updateControls(operation.command);
                }

                (self._queue.length < 2) && (self._isClicking = false);

                self._userCallback = null;

                if (instruction.callback) self._userCallback = instruction.callback;

                self.execFilter('multiMix', operation, self);
                self.execAction('multiMix', 1, arguments);

                // Always allow the instruction to override the instance setting

                animate = (instruction.animate ^ self.animation.enable) ?
                    instruction.animate :
                    self.animation.enable;

                return self._goMix(animate, operation);
            } else {
                return self._deferMix(arguments, instruction);
            }
        },

        /**
         * Renders a previously created operation at a specific point in its path, as
         * determined by a multiplier between 0 and 1.
         *
         * @example
         * .tween(operation, multiplier)
         *
         * @public
         * @instance
         * @since   3.0.0
         * @param   {mixitup.Operation}     operation
         *      An operation object created via the `getOperation` method
         *
         * @param   {Float}                 multiplier
         *      Any number between 0 and 1 representing the percentage complete of the operation
         * @return  {void}
         */

        tween: function(operation, multiplier) {
            var self            = this,
                target          = null,
                posData         = null,
                toHideIndex     = -1,
                i               = -1;

            multiplier = Math.min(multiplier, 1);
            multiplier = Math.max(multiplier, 0);

            for (i = 0; target = operation.show[i]; i++) {
                posData = operation.showPosData[i];

                target.applyTween(posData, multiplier);
            }

            for (i = 0; target = operation.hide[i]; i++) {
                if (target.isShown) {
                    target.hide();
                }

                if ((toHideIndex = operation.toHide.indexOf(target)) > -1) {
                    posData = operation.toHidePosData[toHideIndex];

                    if (!target.isShown) {
                        target.show();
                    }

                    target.applyTween(posData, multiplier);
                }
            }
        },

        /**
         * @public
         * @instance
         * @since       2.0.0
         * @return      {Promise.<mixitup.State>}
         */

        insert: function() {
            var self = this,
                args = self._parseInsertArgs(arguments);

            return self.multiMix({
                insert: args.command
            }, args.animate, args.callback);
        },

        /**
         * @public
         * @instance
         * @since       3.0.0
         * @return      {Promise.<mixitup.State>}
         */

        insertBefore: function() {
            var self = this,
                args = self._parseInsertArgs(arguments);

            return self.insert(args.command.collection, 'before', args.command.sibling, args.animate, args.callback);
        },

        /**
         * @public
         * @instance
         * @since       3.0.0
         * @return      {Promise.<mixitup.State>}
         */

        insertAfter: function() {
            var self = this,
                args = self._parseInsertArgs(arguments);

            return self.insert(args.command.collection, 'after', args.command.sibling, args.animate, args.callback);
        },

        /**
         * @public
         * @instance
         * @since       2.0.0
         * @return      {Promise.<mixitup.State>}
         */

        prepend: function() {
            var self = this,
                args = self._parseInsertArgs(arguments);

            return self.insert(0, args.command.collection, args.animate, args.callback);
        },

        /**
         * @public
         * @instance
         * @since       2.0.0
         * @return      {Promise.<mixitup.State>}
         */

        append: function() {
            var self = this,
                args = self._parseInsertArgs(arguments);

            return self.insert(self._state.totalTargets, args.command.collection, args.animate, args.callback);
        },

        /**
         * @public
         * @instance
         * @since       3.0.0
         * @return      {Promise.<mixitup.State>}
         */

        remove: function() {
            var self = this,
                args = self._parseRemoveArgs(arguments);

            return self.multiMix({
                remove: args.command
            }, args.animate, args.callback);
        },

        /**
         * @public
         * @instance
         * @since       2.0.0
         * @param       {string}    stringKey
         * @return      {*}
         */

        getOption: function(stringKey) {
            // TODO: requires stringKey parser helper
        },

        /**
         * @public
         * @instance
         * @since       2.0.0
         * @param       {object}    config
         * @return      {void}
         */

        setOptions: function(config) {
            var self = this;

            self.execAction('setOptions', 0, arguments);

            h.extend(self, config, true);

            self.execAction('setOptions', 1, arguments);
        },

        /**
         * @public
         * @instance
         * @since       2.0.0
         * @return      {mixitup.State}
         */

        getState: function() {
            var self    = this,
                state   = null;

            if (typeof Object.assign === 'function') {
                state = new mixitup.State();

                Object.assign(state, self._state);
            } else {
                state = self._state;
            }

            return self.execFilter('getState', state, self);
        },

        /**
         * @public
         * @instance
         * @since 2.1.2
         * @return {void}
         */

        forceRefresh: function() {
            var self = this;

            self._indexTargets();
        },

        /**
         * @public
         * @instance
         * @since   2.0.0
         * @param   {boolean}   hideAll
         * @return  {void}
         */

        destroy: function(hideAll) {
            var self    = this,
                target  = null,
                button  = null,
                i       = 0;

            self.execAction('destroy', 0, arguments);

            self._unbindEvents();

            for (i = 0; target = self._targets[i]; i++) {
                hideAll && target.hide();

                target.unbindEvents();
            }

            for (i = 0; button = self._dom.allButtons[i]; i++) {
                h.removeClass(button, self.controls.activeClass);
            }

            if (self._dom.container.id.indexOf('MixItUp') === 0) {
                self._dom.container.removeAttribute('id');
            }

            delete mixitup.instances[self._id];

            self.execAction('destroy', 1, arguments);
        }
    });

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.TargetDom = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.el = null;

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.TargetDom);

    mixitup.TargetDom.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.TargetDom.prototype.constructor = mixitup.TargetDom;

    /**
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.Target = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.sortString = '';
        this.mixer      = null;
        this.callback   = null;
        this.isShown    = false;
        this.isBound    = false;
        this.isExcluded = false;
        this.handler    = null;
        this.operation  = null;
        this.dom        = new mixitup.TargetDom();

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Target);

    mixitup.Target.prototype = Object.create(mixitup.BasePrototype.prototype);

    h.extend(mixitup.Target.prototype, {
        constructor: mixitup.Target,

        /**
         * Initialises a newly instantiated Target.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Element}   el
         * @param   {object}    mixer
         * @return  {void}
         */

        init: function(el, mixer) {
            var self = this;

            self.execAction('init', 0, arguments);

            self.mixer = mixer;

            self.cacheDom(el);

            self.bindEvents();

            if (self.dom.el.style.display !== 'none') {
                self.isShown = true;
            }

            self.execAction('init', 1, arguments);
        },

        /**
         * Caches references of DOM elements neccessary for the target's functionality.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Element} el
         * @return  {void}
         */

        cacheDom: function(el) {
            var self = this;

            self.execAction('cacheDom', 0, arguments);

            self.dom.el = el;

            self.execAction('cacheDom', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string}    attributeName
         * @return  {void}
         */

        getSortString: function(attributeName) {
            var self    = this,
                value   = self.dom.el.getAttribute('data-' + attributeName) || '';

            self.execAction('getSortString', 0, arguments);

            value = isNaN(value * 1) ?
                value.toLowerCase() :
                value * 1;

            self.sortString = value;

            self.execAction('getSortString', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */

        show: function() {
            var self = this;

            self.execAction('show', 0, arguments);

            if (!self.isShown) {
                self.dom.el.style.display = '';

                self.isShown = true;
            }

            self.execAction('show', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */

        hide: function() {
            var self = this;

            self.execAction('hide', 0, arguments);

            if (self.isShown) {
                self.dom.el.style.display = 'none';

                self.isShown = false;
            }

            self.execAction('hide', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {object}    options
         * @return  {void}
         */

        move: function(options) {
            var self = this;

            self.execAction('move', 0, arguments);

            if (!self.isExcluded) {
                self.mixer._targetsMoved++;
            }

            self.applyStylesIn({
                posIn: options.posIn,
                hideOrShow: options.hideOrShow
            });

            requestAnimationFrame(function() {
                self.applyStylesOut(options);
            });

            self.execAction('move', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {object}    posData
         * @param   {number}    multiplier
         * @return  {void}
         */

        applyTween: function(posData, multiplier) {
            var self                    = this,
                propertyName            = '',
                tweenData               = null,
                posIn                   = posData.posIn,
                currentTransformValues  = [],
                currentValues           = new mixitup.StyleData(),
                i                       = -1;

            self.execAction('applyTween', 0, arguments);

            currentValues.x     = posIn.x;
            currentValues.y     = posIn.y;

            if (multiplier === 0) {
                self.hide();
            } else if (!self.isShown) {
                self.show();
            }

            for (i = 0; propertyName = mixitup.features.TWEENABLE[i]; i++) {
                tweenData = posData.tweenData[propertyName];

                if (propertyName === 'x') {
                    if (!tweenData) continue;

                    currentValues.x = posIn.x + (tweenData * multiplier);
                } else if (propertyName === 'y') {
                    if (!tweenData) continue;

                    currentValues.y = posIn.y + (tweenData * multiplier);
                } else if (tweenData instanceof mixitup.TransformData) {
                    if (!tweenData.value) continue;

                    currentValues[propertyName].value =
                        posIn[propertyName].value + (tweenData.value * multiplier);

                    currentValues[propertyName].unit  = tweenData.unit;

                    currentTransformValues.push(
                        propertyName + '(' + currentValues[propertyName].value + tweenData.unit + ')'
                    );
                } else {
                    if (!tweenData) continue;

                    currentValues[propertyName] = posIn[propertyName] + (tweenData * multiplier);

                    self.dom.el.style[propertyName] = currentValues[propertyName];
                }
            }

            if (currentValues.x || currentValues.y) {
                currentTransformValues.unshift('translate(' + currentValues.x + 'px, ' + currentValues.y + 'px)');
            }

            if (currentTransformValues.length) {
                self.dom.el.style[mixitup.features.transformProp] = currentTransformValues.join(' ');
            }

            self.execAction('applyTween', 1, arguments);
        },

        /**
         * Applies the initial styling to a target element before any transition
         * is applied.
         *
         * @private
         * @instance
         * @param   {object}    options
         * @return  {void}
         */

        applyStylesIn: function(options) {
            var self            = this,
                posIn           = options.posIn,
                isFading        = self.mixer._effectsIn.opacity !== 1,
                transformValues = [];

            self.execAction('applyStylesIn', 0, arguments);

            transformValues.push('translate(' + posIn.x + 'px, ' + posIn.y + 'px)');

            if (options.hideOrShow !== 'show' && self.mixer.animation.animateResizeTargets) {
                self.dom.el.style.width        = posIn.width + 'px';
                self.dom.el.style.height       = posIn.height + 'px';
                self.dom.el.style.marginRight  = posIn.marginRight + 'px';
                self.dom.el.style.marginBottom = posIn.marginBottom + 'px';
            }

            isFading && (self.dom.el.style.opacity = posIn.opacity);

            if (options.hideOrShow === 'show') {
                transformValues = transformValues.concat(self.mixer._transformIn);
            }

            self.dom.el.style[mixitup.features.transformProp] = transformValues.join(' ');

            self.execAction('applyStylesIn', 1, arguments);
        },

        /**
         * Applies a transition followed by the final styles for the element to
         * transition towards.
         *
         * @private
         * @instance
         * @param   {object}    options
         * @return  {void}
         */

        applyStylesOut: function(options) {
            var self            = this,
                transitionRules = [],
                transformValues = [],
                isResizing      = self.mixer.animation.animateResizeTargets,
                isFading        = typeof self.mixer._effectsIn.opacity !== 'undefined';

            self.execAction('applyStylesOut', 0, arguments);

            // Build the transition rules

            transitionRules.push(self.writeTransitionRule(
                mixitup.features.transformRule,
                options.staggerIndex
            ));

            if (options.hideOrShow) {
                transitionRules.push(self.writeTransitionRule(
                    'opacity',
                    options.staggerIndex,
                    options.duration
                ));
            }

            if (isResizing) {
                transitionRules.push(self.writeTransitionRule(
                    'width',
                    options.staggerIndex,
                    options.duration
                ));

                transitionRules.push(self.writeTransitionRule(
                    'height',
                    options.staggerIndex,
                    options.duration
                ));

                transitionRules.push(self.writeTransitionRule(
                    'margin',
                    options.staggerIndex,
                    options.duration
                ));
            }

            // If no callback was provided, the element will
            // not transition in any way so tag it as "immovable"

            if (!options.callback) {
                self.mixer._targetsImmovable++;

                if (self.mixer._targetsMoved === self.mixer._targetsImmovable) {
                    // If the total targets moved is equal to the
                    // number of immovable targets, the operation
                    // should be considered finished

                    self.mixer._cleanUp(options.operation);
                }

                return;
            }

            // If the target will transition in some fasion,
            // assign a callback function

            self.operation = options.operation;
            self.callback = options.callback;

            // As long as the target is not excluded, increment
            // the total number of targets bound

            !self.isExcluded && self.mixer._targetsBound++;

            // Tag the target as bound to differentiate from transitionEnd
            // events that may come from stylesheet driven effects

            self.isBound = true;

            // Apply the transition

            self.applyTransition(transitionRules);

            // Apply width, height and margin negation

            if (isResizing && options.posOut.width > 0 && options.posOut.height > 0) {
                self.dom.el.style.width        = options.posOut.width + 'px';
                self.dom.el.style.height       = options.posOut.height + 'px';
                self.dom.el.style.marginRight  = options.posOut.marginRight + 'px';
                self.dom.el.style.marginBottom = options.posOut.marginBottom + 'px';
            }

            if (!self.mixer.animation.nudge && options.hideOrShow === 'hide') {
                // If we're not nudging, the translation should be
                // applied before any other transforms to prevent
                // lateral movement

                transformValues.push('translate(' + options.posOut.x + 'px, ' + options.posOut.y + 'px)');
            }

            // Apply fade

            switch (options.hideOrShow) {
                case 'hide':
                    isFading && (self.dom.el.style.opacity = self.mixer._effectsOut.opacity);

                    transformValues = transformValues.concat(self.mixer._transformOut);

                    break;
                case 'show':
                    isFading && (self.dom.el.style.opacity = 1);
            }

            if (
                self.mixer.animation.nudge ||
                (!self.mixer.animation.nudge && options.hideOrShow !== 'hide')
            ) {
                // Opposite of above - apply translate after
                // other transform

                transformValues.push('translate(' + options.posOut.x + 'px, ' + options.posOut.y + 'px)');
            }

            // Apply transforms

            self.dom.el.style[mixitup.features.transformProp] = transformValues.join(' ');

            self.execAction('applyStylesOut', 1, arguments);
        },

        /**
         * Combines the name of a CSS property with the appropriate duration and delay
         * values to created a valid transition rule.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string}    rule
         * @param   {number}    staggerIndex
         * @param   {number}    [duration]
         * @return  {string}
         */

        writeTransitionRule: function(rule, staggerIndex, duration) {
            var self    = this,
                delay   = self.getDelay(staggerIndex),
                output  = '';

            output = rule + ' ' +
                (duration || self.mixer.animation.duration) + 'ms ' +
                delay + 'ms ' +
                (rule === 'opacity' ? 'linear' : self.mixer.animation.easing);

            return self.execFilter('writeTransitionRule', output, arguments);
        },

        /**
         * Calculates the transition delay for each target element based on its index, if
         * staggering is applied. If defined, A custom `animation.staggerSeqeuence`
         * function can be used to manipulate the order of indices to produce custom
         * stagger effects (e.g. for use in a grid with irregular row lengths).
         *
         * @private
         * @instance
         * @since   2.0.0
         * @param   {number}    index
         * @return  {number}
         */

        getDelay: function(index) {
            var self    = this,
                delay   = -1;

            if (typeof self.mixer.animation.staggerSequence === 'function') {
                index = self.mixer.animation.staggerSequence.call(self, index, self._state);
            }

            delay = !!self.mixer._staggerDuration ? index * self.mixer._staggerDuration : 0;

            return self.execFilter('getDelay', delay, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string[]}  rules
         * @return  {void}
         */

        applyTransition: function(rules) {
            var self                = this,
                transitionString    = rules.join(', ');

            self.execAction('applyTransition', 0, arguments);

            self.dom.el.style[mixitup.features.transitionProp] = transitionString;

            self.execAction('applyTransition', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Event} e
         * @return  {void}
         */

        handleTransitionEnd: function(e) {
            var self        = this,
                propName    = e.propertyName,
                canResize   = self.mixer.animation.animateResizeTargets;

            self.execAction('handleTransitionEnd', 0, arguments);

            if (
                self.isBound &&
                e.target.matches(self.mixer.selectors.target) &&
                (
                    propName.indexOf('transform') > -1 ||
                    propName.indexOf('opacity') > -1 ||
                    canResize && propName.indexOf('height') > -1 ||
                    canResize && propName.indexOf('width') > -1 ||
                    canResize && propName.indexOf('margin') > -1
                )
            ) {
                self.callback.call(self, self.operation);

                self.isBound = false;
                self.callback = null;
                self.operation = null;
            }

            self.execAction('handleTransitionEnd', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Event}     e
         * @return  {void}
         */

        eventBus: function(e) {
            var self = this;

            self.execAction('eventBus', 0, arguments);

            switch (e.type) {
                case 'webkitTransitionEnd':
                case 'transitionend':
                    self.handleTransitionEnd(e);
            }

            self.execAction('eventBus', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */

        unbindEvents: function() {
            var self = this;

            self.execAction('unbindEvents', 0, arguments);

            h.off(self.dom.el, 'webkitTransitionEnd', self.handler);
            h.off(self.dom.el, 'transitionend', self.handler);

            self.execAction('unbindEvents', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */

        bindEvents: function() {
            var self = this,
                transitionEndEvent = mixitup.features.transitionPrefix === 'webkit' ?
                    'webkitTransitionEnd' :
                    'transitionend';

            self.execAction('bindEvents', 0, arguments);

            self.handler = function(e) {
                return self.eventBus(e);
            };

            h.on(self.dom.el, transitionEndEvent, self.handler);

            self.execAction('bindEvents', 1, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {boolean}   [getBox]
         * @return  {PosData}
         */

        getPosData: function(getBox) {
            var self    = this,
                styles  = {},
                rect    = null,
                posData = new mixitup.StyleData();

            self.execAction('getPosData', 0, arguments);

            posData.x = self.dom.el.offsetLeft;
            posData.y = self.dom.el.offsetTop;

            if (self.mixer.animation.animateResizeTargets || getBox) {
                rect = self.dom.el.getBoundingClientRect();

                posData.top     = rect.top;
                posData.right   = rect.right;
                posData.bottom  = rect.bottom;
                posData.left    = rect.left;

                posData.width  = rect.width;
                posData.height = rect.height;
            }

            if (self.mixer.animation.animateResizeTargets) {
                styles = window.getComputedStyle(self.dom.el);

                posData.marginBottom = parseFloat(styles.marginBottom);
                posData.marginRight  = parseFloat(styles.marginRight);
            }

            return self.execFilter('getPosData', posData, arguments);
        },

        /**
         * @private
         * @instance
         * @since       3.0.0
         * @return      {void}
         */

        cleanUp: function() {
            var self = this;

            self.execAction('cleanUp', 0, arguments);

            self.dom.el.style[mixitup.features.transformProp]  = '';
            self.dom.el.style[mixitup.features.transitionProp] = '';
            self.dom.el.style.opacity                          = '';

            if (self.mixer.animation.animateResizeTargets) {
                self.dom.el.style.width        = '';
                self.dom.el.style.height       = '';
                self.dom.el.style.marginRight  = '';
                self.dom.el.style.marginBottom = '';
            }

            self.execAction('cleanUp', 1, arguments);
        }
    });

    /**
     * A jQuery-like wrapper object for one or more `mixitup.Mixer` instances
     * allowing simultaneous control of multiple instances.
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @public
     * @since       3.0.0
     * @param       {mixitup.Mixer[]}   instances
     */

    mixitup.Collection = function(instances) {
        var instance    = null,
            i           = -1;

        for (i = 0; instance = instances[i]; i++) {
            this[i] = instance;
        }

        this.length = instances.length;
    };

    /**
     * A jQueryUI-like API for calling a method on all instances in the collection
     * by passing the method name as a string followed by an neccessary parameters.
     *
     * @memberof    mixitup.Collection
     * @public
     * @instance
     * @since       3.0.0
     * @param       {string}            methodName
     * @return      {Promise}
     */

    mixitup.Collection.prototype.do = function(methodName) {
        var self        = this,
            instance    = null,
            args        = Array.prototype.slice.call(arguments),
            tasks       = [],
            q           = null,
            i           = -1;

        args.shift();

        for (i = 0; instance = self[i]; i++) {
            if (!q && instance.libraries.q) {
                q = instance.libraries.q;
            }

            tasks.push(instance[methodName].apply(instance, args));
        }

        if (q) {
            return q.all(tasks);
        } else if (mixitup.Mixer.prototype._has._promises) {
            return Promise.all(tasks);
        }
    };

    /**
     * `mixitup.Operation` objects contain all data neccessary to describe the full
     * lifecycle of any MixItUp operation. They can be used to compute and store an
     * operation for use at a later time (e.g. programmatic tweening).
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @public
     * @since       3.0.0
     */

    mixitup.Operation = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.id                  = '';

        this.args                = [];
        this.command             = null;
        this.showPosData         = [];
        this.toHidePosData       = [];

        this.startState          = null;
        this.newState            = null;
        this.docState            = null;

        this.willSort            = false;
        this.willChangeLayout    = false;
        this.hasEffect           = false;
        this.hasFailed           = false;

        this.show                = [];
        this.hide                = [];
        this.matching            = [];
        this.toShow              = [];
        this.toHide              = [];
        this.toMove              = [];
        this.toRemove            = [];
        this.startOrder          = [];
        this.newOrder            = [];
        this.newSort             = null;
        this.startSortString     = '';
        this.newSortString       = '';
        this.startFilter         = null;
        this.newFilter           = null;
        this.startX              = 0;
        this.startY              = 0;
        this.startHeight         = 0;
        this.startWidth          = 0;
        this.newX                = 0;
        this.newY                = 0;
        this.newHeight           = 0;
        this.newWidth            = 0;
        this.startContainerClass = '';
        this.startDisplay        = '';
        this.newContainerClass   = '';
        this.newDisplay          = '';

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Operation);

    mixitup.Operation.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.Operation.prototype.constructor = mixitup.Operation;

    /**
     * `mixitup.State` objects expose various pieces of data detailing the state of
     * a MixItUp instance. They are provided at the start and end of any operation via
     * callbacks and events, with the most recent state stored between operations
     * for retrieval at any time via the API.
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @public
     * @since       3.0.0
     */

    mixitup.State = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        /**
         * The currently active filter selector as set by a control click or the API
         * call.
         *
         * @name        activeFilter
         * @memberof    mixitup.State
         * @instance
         * @type        {string}
         * @default     ''
         */

        this.activeFilter = '';

        /**
         * The currently active sort as set by a control click or API call.
         *
         * @name        activeSort
         * @memberof    mixitup.State
         * @instance
         * @type        {string}
         * @default     ''
         */

        this.activeSort = '';

        /**
         * The currently active containerClass, if applied.
         *
         * @name        activeContainerClass
         * @memberof    mixitup.State
         * @instance
         * @type        {string}
         * @default     ''
         */

        this.activeContainerClass = '';

        /**
         * An array of all target elements indexed by the mixer.
         *
         * @name        targets
         * @memberof    mixitup.State
         * @instance
         * @type        {Array.<Element>}
         * @default     []
         */

        this.targets = [];

        /**
         * An array of all target elements not matching the current filter.
         *
         * @name        hide
         * @memberof    mixitup.State
         * @instance
         * @type        {Array.<Element>}
         * @default     []
         */

        this.hide = [];

        /**
         * An array of all target elements matching the current filter and any additional
         * limits applied such as pagination.
         *
         * @name        show
         * @memberof    mixitup.State
         * @instance
         * @type        {Array.<Element>}
         * @default     []
         */

        this.show = [];

        /**
         * An array of all target elements matching the current filter irrespective of
         * any additional limits applied such as pagination.
         *
         * @name        matching
         * @memberof    mixitup.State
         * @instance
         * @type        {Array.<Element>}
         * @default     []
         */

        this.matching = [];

        /**
         * An integer representing the total number of target elements indexed by the
         * mixer. Equivalent to `state.targets.length`.
         *
         * @name        totalTargets
         * @memberof    mixitup.State
         * @instance
         * @type        {number}
         * @default     -1
         */

        this.totalTargets = -1;

        /**
         * An integer representing the total number of target elements matching the
         * current filter and any additional limits applied such as pagination.
         * Equivalent to `state.show.length`.
         *
         * @name        totalShow
         * @memberof    mixitup.State
         * @instance
         * @type        {number}
         * @default     -1
         */

        this.totalShow = -1;

        /**
         * An integer representing the total number of target elements not matching
         * the current filter. Equivalent to `state.hide.length`.
         *
         * @name        totalHide
         * @memberof    mixitup.State
         * @instance
         * @type        {number}
         * @default     -1
         */

        this.totalHide = -1;

        /**
         * An integer representing the total number of target elements matching the
         * current filter irrespective of any other limits applied such as pagination.
         * Equivalent to `state.matching.length`.
         *
         * @name        totalMatching
         * @memberof    mixitup.State
         * @instance
         * @type        {number}
         * @default     -1
         */

        this.totalMatching = -1;

        /**
         * A boolean indicating whether the last operation "failed", i.e. no targets
         * could be found matching the filter.
         *
         * @name        hasFailed
         * @memberof    mixitup.State
         * @instance
         * @type        {boolean}
         * @default     false
         */

        this.hasFailed = false;

        /**
         * The DOM element that was clicked if the last oepration was triggered by the
         * clicking of a control and not an API call.
         *
         * @name        triggerElement
         * @memberof    mixitup.State
         * @instance
         * @type        {Element|null}
         * @default     null
         */

        this.triggerElement = null;

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.State);

    mixitup.State.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.State.prototype.constructor = mixitup.State;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.UserInstruction = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.command    = {};
        this.animate    = false;
        this.callback   = null;

        this.execAction('construct', 1);

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.UserInstruction);

    mixitup.UserInstruction.prototype = Object.create(mixitup.BasePrototype.prototype);

    mixitup.UserInstruction.prototype.constructor = mixitup.UserInstruction;

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

    /**
     * The `mixitup.Features` class performs all feature and CSS prefix detection
     * neccessary for MixItUp to function correctly, as well as storing various
     * string and array constants. All feature decection is on evaluation of the
     * library and stored in a singleton instance for use by other internal classes.
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.Features = function() {
        mixitup.BasePrototype.call(this);

        this.execAction('construct', 0);

        this.boxSizingPrefix            = '';
        this.transformPrefix            = '';
        this.transitionPrefix           = '';

        this.boxSizingPrefix            = '';
        this.transformProp              = '';
        this.transformRule              = '';
        this.transitionProp             = '';
        this.perspectiveProp            = '';
        this.perspectiveOriginProp      = '';

        this.has                        = new mixitup.Has();
        this.is                         = new mixitup.Is();

        this.canary                     = null;

        this.BOX_SIZING_PROP            = 'boxSizing';
        this.TRANSITION_PROP            = 'transition';
        this.TRANSFORM_PROP             = 'transform';
        this.PERSPECTIVE_PROP           = 'perspective';
        this.PERSPECTIVE_ORIGIN_PROP    = 'perspectiveOrigin';
        this.VENDORS                    = ['Webkit', 'moz', 'O', 'ms'];

        this.TWEENABLE = [
            'opacity',
            'width', 'height',
            'marginRight', 'marginBottom',
            'x', 'y',
            'scale',
            'translateX', 'translateY', 'translateZ',
            'rotateX', 'rotateY', 'rotateZ'
        ];

        this.execAction('construct', 1);
    };

    mixitup.BaseStatic.call(mixitup.Features);

    mixitup.Features.prototype = Object.create(mixitup.BasePrototype.prototype);

    h.extend(mixitup.Features.prototype,
    /** @lends mixitup.Features */
    {
        constructor: mixitup.Features,

        /**
         * @private
         * @return  {void}
         */

        init: function() {
            var self = this;

            self.execAction('init', 0);

            self.canary = document.createElement('div');

            self.runTests();
            self.setPrefixes();
            self.applyPolyfills();

            self.execAction('init', 1);
        },

        /**
         * @private
         * @return  {void}
         */

        runTests: function() {
            var self = this;

            self.execAction('runTests', 0);

            self.has.promises       = typeof Promise === 'function';
            self.has.transitions    = self.transitionPrefix !== 'unsupported';
            self.is.oldIe           = window.atob ? false : true;

            self.execAction('runTests', 1);
        },

        /**
         * @private
         * @return  {void}
         */

        setPrefixes: function() {
            var self = this;

            self.execAction('setPrefixes', 0);

            self.transitionPrefix   = h.getPrefix(self.canary, 'Transition', self.VENDORS);
            self.transformPrefix    = h.getPrefix(self.canary, 'Transform', self.VENDORS);
            self.boxSizingPrefix    = h.getPrefix(self.canary, 'BoxSizing', self.VENDORS);

            self.boxSizingProp = self.boxSizingPrefix ?
                self.boxSizingPrefix + h.camelCase(self.BOX_SIZING_PROP, true) : self.BOX_SIZING_PROP;

            self.transitionProp = self.transitionPrefix ?
                self.transitionPrefix + h.camelCase(self.TRANSITION_PROP, true) : self.TRANSITION_PROP;

            self.transformProp = self.transformPrefix ?
                self.transformPrefix + h.camelCase(self.TRANSFORM_PROP, true) : self.TRANSFORM_PROP;

            self.transformRule = self.transformPrefix ?
                '-' + self.transformPrefix + '-' + self.TRANSFORM_PROP : self.TRANSFORM_PROP;

            self.perspectiveProp = self.transformPrefix ?
                self.transformPrefix + h.camelCase(self.PERSPECTIVE_PROP, true) : self.PERSPECTIVE_PROP;

            self.perspectiveOriginProp = self.transformPrefix ?
                self.transformPrefix + h.camelCase(self.PERSPECTIVE_ORIGIN_PROP, true) :
                self.PERSPECTIVE_ORIGIN_PROP;

            self.execAction('setPrefixes', 1);
        },

        /**
         * @private
         * @return  {void}
         */

        applyPolyfills: function() {
            var self    = this,
                i       = -1;

            self.execAction('applyPolyfills', 0);

            // window.requestAnimationFrame

            for (i = 0; i < self.VENDORS.length && !window.requestAnimationFrame; i++) {
                window.requestAnimationFrame = window[self.VENDORS[i] + 'RequestAnimationFrame'];
            }

            // Element.nextElementSibling

            if (typeof self.canary.nextElementSibling === 'undefined') {
                Object.defineProperty(Element.prototype, 'nextElementSibling', {
                    get: function() {
                        var el = this.nextSibling;

                        while (el) {
                            if (el.nodeType === 1) {
                                return el;
                            }

                            el = el.nextSibling;
                        }

                        return null;
                    }
                });
            }

            // Element.matches

            (function(ElementPrototype) {
                ElementPrototype.matches =
                    ElementPrototype.matches ||
                    ElementPrototype.machesSelector ||
                    ElementPrototype.mozMatchesSelector ||
                    ElementPrototype.msMatchesSelector ||
                    ElementPrototype.oMatchesSelector ||
                    ElementPrototype.webkitMatchesSelector ||
                    function (selector) {
                        var nodes = (this.parentNode || this.doc).querySelectorAll(selector),
                            i = -1;

                        while (nodes[++i] && nodes[i] != this) {
                            return !!nodes[i];
                        }
                    };
            })(Element.prototype);

            self.execAction('applyPolyfills', 1);

            // Object.keys
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys

            if (!Object.keys) {
                Object.keys = (function() {
                    var hasOwnProperty      = Object.prototype.hasOwnProperty,
                        hasDontEnumBug      = false,
                        dontEnums           = [],
                        dontEnumsLength     = -1;

                    hasDontEnumBug = !({
                        toString: null
                    })
                        .propertyIsEnumerable('toString');

                    dontEnums = [
                        'toString',
                        'toLocaleString',
                        'valueOf',
                        'hasOwnProperty',
                        'isPrototypeOf',
                        'propertyIsEnumerable',
                        'constructor'
                    ];

                    dontEnumsLength = dontEnums.length;

                    return function(obj) {
                        var result  = [],
                            prop    = '',
                            i       = -1;

                        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                            throw new TypeError('Object.keys called on non-object');
                        }

                        for (prop in obj) {
                            if (hasOwnProperty.call(obj, prop)) {
                                result.push(prop);
                            }
                        }

                        if (hasDontEnumBug) {
                            for (i = 0; i < dontEnumsLength; i++) {
                                if (hasOwnProperty.call(obj, dontEnums[i])) {
                                    result.push(dontEnums[i]);
                                }
                            }
                        }

                        return result;
                    };
                }());
            }

            // Array.isArray
            // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray

            if (!Array.isArray) {
                Array.isArray = function(arg) {
                    return Object.prototype.toString.call(arg) === '[object Array]';
                };
            }
        }
    });

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.Has = function() {
        this.transitions    = false;
        this.promises       = false;
    };

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.Is = function() {
        this.oldIe          = false;
    };

    // Asign a singleton instance to `mixitup.features` and initialise:

    mixitup.features = new mixitup.Features();

    mixitup.features.init();

    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = mixitup;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return mixitup;
        });
    } else if (typeof window.mixitup === 'undefined' || typeof window.mixitup !== 'function') {
        window.mixitup = window.mixItUp = mixitup;
    }
    mixitup.CORE_VERSION = '3.0.0-beta';
})(window);
/* global mixitup */
/* global h */

h = {

    /**
     * hasClass
     * @since   3.0.0
     * @param   {Element}   el
     * @param   {string}    cls
     * @return  {boolean}
     */

    hasClass: function(el, cls) {
        return el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },

    /**
     * addClass
     * @since   3.0.0
     * @param   {Element}   el
     * @param   {string}    cls
     * @void
     */

    addClass: function(el, cls) {
        if (!this.hasClass(el, cls)) el.className += el.className ? ' ' + cls : cls;
    },

    /**
     * removeClass
     * @since   3.0.0
     * @param   {Element}   el
     * @param   {string}    cls
     * @void
     */

    removeClass: function(el, cls) {
        if (this.hasClass(el, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');

            el.className = el.className.replace(reg, ' ').trim();
        }
    },

    /**
     * extend
     * @since   3.0.0
     * @param   {object}    destination
     * @param   {object}    source
     * @void
     */

    extend: function(destination, source) {
        var property = '';

        for (property in source) {
            if (
                typeof source[property] === 'object' &&
                source[property] !== null &&
                typeof source[property].length === 'undefined'
            ) {
                destination[property] = destination[property] || {};

                this.extend(destination[property], source[property]);
            } else {
                destination[property] = source[property];
            }
        }
    },

    /**
     * on
     * @since   3.0.0
     * @param   {Element}   el
     * @param   {string}    type
     * @param   {function}  fn
     * @param   {boolean}   useCapture
     * @void
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
     * off
     * @since   3.0.0
     * @param   {Element}   el
     * @param   {string}    type
     * @param   {function}  fn
     * @void
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
     * triggerCustom
     * @param   {Element}   element
     * @param   {string}    eventName
     * @param   {object}    data
     * @param   {Document}  [doc]
     * @void
     */

    triggerCustom: function(el, eventName, data, doc) {
        var event = null;

        doc = doc || window.document;

        if (typeof window.CustomEvent === 'function') {
            event = new CustomEvent(eventName, {
                detail: data
            });
        } else {
            event = doc.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, data);
        }

        el.dispatchEvent(event);
    },

    /**
     * index
     * @since   3.0.0
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
     * camelCase
     * @since   2.0.0
     * @param   {string}
     * @return  {string}
     */

    camelCase: function(string) {
        return string.replace(/-([a-z])/g, function(g) {
            return g[1].toUpperCase();
        });
    },

    /**
     * isElement
     * @since   2.1.3
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
     * createElement
     * @since   3.0.0
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
     * deleteElement
     * @since   3.0.0
     * @param   {Element}   el
     * @void
     */

    deleteElement: function(el) {
        if (el.parentElement) {
            el.parentElement.removeChild(el);
        }
    },

    /**
     * isEqualArray
     * @since   3.0.0
     * @param   {*[]}       a
     * @param   {*[]}       b
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
     * arrayShuffle
     * @since   2.0.0
     * @param   {*[]}   oldArray
     * @return  {*[]}
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
     * debounce
     * @since   3.0.0
     * @param   {function}  func
     * @param   {Number}    wait
     * @param   {boolean}   immediate
     * @return  {function}
     */

    debounce: function(func, wait, immediate) {
        var timeout;

        return function() {
            var context     = this,
                args        = arguments,
                later       = function() {
                    timeout = null;

                    if (!immediate) {
                        func.apply(context, args);
                    }
                },
                callNow = immediate && !timeout;

            clearTimeout(timeout);

            timeout = setTimeout(later, wait);

            if (callNow) func.apply(context, args);
        };
    },

    /**
     * position
     * @since   3.0.0
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
     * getHypotenuse
     * @since   3.0.0
     * @param   {object}    node1
     * @return  {object}    node2
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
     * closestParent
     * @since   3.0.0
     * @param   {object}    el
     * @param   {string}    selector
     * @param   {boolean}   [includeSelf]
     * @param   {Number}    [range]
     * @param   {Document}  [doc]
     * @return  {Element}
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
     * children
     * @since   3.0.0
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
     * forEach
     * @since   3.0.0
     * @param   {*[]}       items
     * @param   {function}  callback
     * @void
     */

    forEach: function(items, callback) {
        var i       = -1,
            item    = null;

        for (i = 0; item = items[i]; i++) {
            (typeof callback === 'function') && callback.call(this, item);
        }
    },

    /**
     * clean
     * @since   3.0.0
     * @param   {*[]}   originalArray
     * @return  {*[]}
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
     * getPromise
     * @since  3.0.0
     * @return {object}     libraries
     * @return {object}
     */

    getPromise: function(libraries) {
        var promise = {
                promise: null,
                resolve: null,
                reject: null,
                isResolved: false
            },
            defered = null;

        if (mixitup.Mixer.prototype.has._promises) {
            promise.promise     = new Promise(function(resolve, reject) {
                promise.resolve = resolve;
                promise.reject  = reject;
            });
        } else if (libraries.q && typeof libraries.q === 'function') {
            defered = libraries.q.defer();

            promise.promise = defered.promise;
            promise.resolve = defered.resolve;
            promise.reject  = defered.reject;
        } else {
            console.warn('[MixItUp] WARNING: No available Promises implementations were found');

            return null;
        }

        return promise;
    },

    /**
     * canReportErrors
     * @since   3.0.0
     * @param   {object}  [config]
     * @return  {boolean}
     */

    canReportErrors: function(config) {
        if (!config || config && !config.debug) {
            return true;
        } else if (config && config.debug && config.debug.enable === false) {
            return false;
        }
    },

    /**
     * getPrefix
     * @since   2.0.0
     * @param   {Element}   el
     * @param   {string}    property
     * @param   {String[]}  vendors
     * @return  {string}
     */

    getPrefix: function(el, property, vendors) {
        var i       = -1,
            prefix  = '';

        if (property.toLowerCase() in el.style) return '';

        for (i = 0; prefix = vendors[i]; i++) {
            if (prefix + property in el.style) {
                return prefix.toLowerCase();
            }
        }

        return 'unsupported';
    },

    /**
     * randomHexKey
     * @since   3.0.0
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
     * getDocumentState
     * @since   3.0.0
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
     * bind
     * @since   3.0.0
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
     * isVisible
     * @since   3.0.0
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
     * seal
     * @since   3.0.0
     * @param   {object}    obj
     */

    seal: function(obj) {
        if (typeof Object.seal === 'function') {
            Object.seal(obj);
        }
    },

    /**
     * compareVersions
     * @since   3.0.0
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
    }
};
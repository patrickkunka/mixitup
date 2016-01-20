/* global mixitup, h:true */

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
     * @private
     * @param   {object}    destination
     * @param   {object}    source
     * @return  {void}
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
     * @param   {Element}   el
     * @param   {string}    eventName
     * @param   {object}    data
     * @param   {Document}  [doc]
     * @return  {void}
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
     * Abstracts the ES6 native promise into a Q-like "defered promise" interface.
     *
     * @private
     * @param  {object} libraries
     * @return {mixitup.PromiseWrapper|null}
     */

    getPromise: function(libraries) {
        var defered         = null,
            promiseWrapper  = null;

        promiseWrapper = new this.PromiseWrapper();

        if (mixitup.features.has.promises) {
            promiseWrapper.promise = new Promise(function(resolve, reject) {
                promiseWrapper.resolve = resolve;
                promiseWrapper.reject  = reject;
            });
        } else if (libraries.q && typeof libraries.q === 'function') {
            defered = libraries.q.defer();

            promiseWrapper.promise = defered.promise;
            promiseWrapper.resolve = defered.resolve;
            promiseWrapper.reject  = defered.reject;
        } else if (libraries.bluebird && typeof libraries.bluebird === 'function') {
            // TODO: Implement bluebird promise

            '';
        } else if (window.jQuery || (libraries.jQuery && typeof libraries.jQuery === 'function')) {
            // TODO: Implement jQuery promise

            '';
        } else {
            console.warn(
                '[MixItUp] WARNING: No available Promise implementations were found. Please ' +
                'provide a promise library to the configuration object.'
            );

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

        if (property.toLowerCase() in el.style) return '';

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
    }
};
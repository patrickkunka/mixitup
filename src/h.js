/* global mixitup, h:true */

/**
 * @private
 */

h = {

    /**
     * @private
     * @param   {HTMLElement}   el
     * @param   {string}        cls
     * @return  {boolean}
     */

    hasClass: function(el, cls) {
        return !!el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },

    /**
     * @private
     * @param   {HTMLElement}   el
     * @param   {string}        cls
     * @return  {void}
     */

    addClass: function(el, cls) {
        if (!this.hasClass(el, cls)) el.className += el.className ? ' ' + cls : cls;
    },

    /**
     * @private
     * @param   {HTMLElement}   el
     * @param   {string}        cls
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
     * @param   {object}    destination
     * @param   {object}    source
     * @param   {boolean}   [deep=false]
     * @param   {boolean}   [handleErrors=false]
     * @return  {void}
     */

    extend: function(destination, source, deep, handleErrors) {
        var sourceKeys  = [],
            key         = '',
            i           = -1;

        deep = deep || false;
        handleErrors = handleErrors || false;

        try {
            if (Array.isArray(source)) {
                for (i = 0; i < source.length; i++) {
                    sourceKeys.push(i);
                }
            } else if (source) {
                sourceKeys = Object.keys(source);
            }

            for (i = 0; i < sourceKeys.length; i++) {
                key = sourceKeys[i];

                if (!deep || typeof source[key] !== 'object' || this.isElement(source[key])) {
                    // All non-object properties, or all properties if shallow extend

                    destination[key] = source[key];
                } else if (Array.isArray(source[key])) {
                    // Arrays

                    if (!destination[key]) {
                        destination[key] = [];
                    }

                    this.extend(destination[key], source[key], deep, handleErrors);
                } else {
                    // Objects

                    if (!destination[key]) {
                        destination[key] = {};
                    }

                    this.extend(destination[key], source[key], deep, handleErrors);
                }
            }
        } catch(err) {
            if (handleErrors) {
                this.handleExtendError(err, destination);
            } else {
                throw err;
            }
        }

        return destination;
    },

    /**
     * @private
     * @param   {Error}  err
     * @param   {object} destination
     * @return  {void}
     */

    handleExtendError: function(err, destination) {
        var re                  = /property "?(\w*)"?[,:] object/i,
            matches             = null,
            erroneous           = '',
            message             = '',
            suggestion          = '',
            probableMatch       = '',
            key                 = '',
            mostMatchingChars   = -1,
            i                   = -1;

        if (err instanceof TypeError && (matches = re.exec(err.message))) {
            erroneous = matches[1];

            for (key in destination) {
                i = 0;

                while (i < erroneous.length && erroneous.charAt(i) === key.charAt(i)) {
                    i++;
                }

                if (i > mostMatchingChars) {
                    mostMatchingChars = i;
                    probableMatch = key;
                }
            }

            if (mostMatchingChars > 1) {
                suggestion = mixitup.messages.errorConfigInvalidPropertySuggestion({
                    probableMatch: probableMatch
                });
            }

            message = mixitup.messages.errorConfigInvalidProperty({
                erroneous: erroneous,
                suggestion: suggestion
            });

            throw new TypeError(message);
        }

        throw err;
    },

    /**
     * @private
     * @param   {string} str
     * @return  {function}
     */

    template: function(str) {
        var re          = /\${([\w]*)}/g,
            dynamics    = {},
            matches     = null;

        while ((matches = re.exec(str))) {
            dynamics[matches[1]] = new RegExp('\\${' + matches[1] + '}', 'g');
        }

        return function(data) {
            var key     = '',
                output  = str;

            data = data || {};

            for (key in dynamics) {
                output = output.replace(dynamics[key], typeof data[key] !== 'undefined' ? data[key] : '');
            }

            return output;
        };
    },

    /**
     * @private
     * @param   {HTMLElement}   el
     * @param   {string}        type
     * @param   {function}      fn
     * @param   {boolean}       useCapture
     * @return  {void}
     */

    on: function(el, type, fn, useCapture) {
        if (!el) return;

        if (el.addEventListener) {
            el.addEventListener(type, fn, useCapture);
        } else if (el.attachEvent) {
            el['e' + type + fn] = fn;

            el[type + fn] = function() {
                el['e' + type + fn](window.event);
            };

            el.attachEvent('on' + type, el[type + fn]);
        }
    },

    /**
     * @private
     * @param   {HTMLElement}   el
     * @param   {string}        type
     * @param   {function}      fn
     * @return  {void}
     */

    off: function(el, type, fn) {
        if (!el) return;

        if (el.removeEventListener) {
            el.removeEventListener(type, fn, false);
        } else if (el.detachEvent) {
            el.detachEvent('on' + type, el[type + fn]);
            el[type + fn] = null;
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
            event = new window.CustomEvent(eventType, {
                detail: detail,
                bubbles: true,
                cancelable: true
            });
        } else if (typeof doc.createEvent === 'function') {
            event = doc.createEvent('CustomEvent');
            event.initCustomEvent(eventType, true, true, detail);
        } else {
            event = doc.createEventObject(),
            event.type = eventType;

            event.returnValue = false;
            event.cancelBubble = false;
            event.detail = detail;
        }

        return event;
    },

    /**
     * @private
     * @param   {Event} e
     * @return  {Event}
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
     * @param   {HTMLElement}   el
     * @param   {string}        selector
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
     * Converts a dash or snake-case string to camel case.
     *
     * @private
     * @param   {string}    str
     * @param   {boolean}   [isPascal]
     * @return  {string}
     */

    camelCase: function(str) {
        return str.toLowerCase().replace(/([_-][a-z])/g, function($1) {
            return $1.toUpperCase().replace(/[_-]/, '');
        });
    },

    /**
     * Converts a dash or snake-case string to pascal case.
     *
     * @private
     * @param   {string}    str
     * @param   {boolean}   [isPascal]
     * @return  {string}
     */

    pascalCase: function(str) {
        return (str = this.camelCase(str)).charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Converts a camel or pascal-case string to dash case.
     *
     * @private
     * @param   {string}    str
     * @return  {string}
     */

    dashCase: function(str) {
        return str.replace(/([A-Z])/g, '-$1').replace(/^-/, '').toLowerCase();
    },

    /**
     * @private
     * @param   {HTMLElement}       el
     * @param   {HTMLHtmlElement}   [doc]
     * @return  {boolean}
     */

    isElement: function(el, doc) {
        doc = doc || window.document;

        if (
            window.HTMLElement &&
            el instanceof window.HTMLElement
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
                typeof el.nodeName === 'string'
            );
        }
    },

    /**
     * @private
     * @param   {string}            htmlString
     * @param   {HTMLHtmlElement}   [doc]
     * @return  {DocumentFragment}
     */

    createElement: function(htmlString, doc) {
        var frag = null,
            temp = null;

        doc = doc || window.document;

        frag = doc.createDocumentFragment();
        temp = doc.createElement('div');

        temp.innerHTML = htmlString.trim();

        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }

        return frag;
    },

    /**
     * @private
     * @param   {Node} node
     * @return  {void}
     */

    removeWhitespace: function(node) {
        var deleting;

        while (node && node.nodeName === '#text') {
            deleting = node;

            node = node.previousSibling;

            deleting.parentElement && deleting.parentElement.removeChild(deleting);
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
     * @param   {object}  a
     * @param   {object}  b
     * @return  {boolean}
     */

    deepEquals: function(a, b) {
        var key;

        if (typeof a === 'object' && a && typeof b === 'object' && b) {
            if (Object.keys(a).length !== Object.keys(b).length) return false;

            for (key in a) {
                if (!b.hasOwnProperty(key) || !this.deepEquals(a[key], b[key])) return false;
            }
        } else if (a !== b) {
            return false;
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
     * @param   {object}    list
     */

    arrayFromList: function(list) {
        var output, i;

        try {
            return Array.prototype.slice.call(list);
        } catch(err) {
            output = [];

            for (i = 0; i < list.length; i++) {
                output.push(list[i]);
            }

            return output;
        }
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
     * @param   {HTMLElement}   element
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
     * @param   {object}            el
     * @param   {string}            selector
     * @param   {boolean}           [includeSelf]
     * @param   {HTMLHtmlElement}   [doc]
     * @return  {Element|null}
     */

    closestParent: function(el, selector, includeSelf, doc) {
        var parent  = el.parentNode;

        doc = doc || window.document;

        if (includeSelf && el.matches(selector)) {
            return el;
        }

        while (parent && parent != doc.body) {
            if (parent.matches && parent.matches(selector)) {
                return parent;
            } else if (parent.parentNode) {
                parent = parent.parentNode;
            } else {
                return null;
            }
        }

        return null;
    },

    /**
     * @private
     * @param   {HTMLElement}       el
     * @param   {string}            selector
     * @param   {HTMLHtmlElement}   [doc]
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
     * Creates a clone of a provided array, with any empty strings removed.
     *
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
     * Abstracts an ES6 promise into a q-like deferred interface for storage and deferred resolution.
     *
     * @private
     * @param  {object} libraries
     * @return {h.Deferred}
     */

    defer: function(libraries) {
        var deferred       = null,
            promiseWrapper = null,
            $              = null;

        promiseWrapper = new this.Deferred();

        if (mixitup.features.has.promises) {
            // ES6 native promise or polyfill

            promiseWrapper.promise = new Promise(function(resolve, reject) {
                promiseWrapper.resolve = resolve;
                promiseWrapper.reject  = reject;
            });
        } else if (($ = (window.jQuery || libraries.$)) && typeof $.Deferred === 'function') {
            // jQuery

            deferred = $.Deferred();

            promiseWrapper.promise = deferred.promise();
            promiseWrapper.resolve = deferred.resolve;
            promiseWrapper.reject  = deferred.reject;
        } else if (window.console) {
            // No implementation

            console.warn(mixitup.messages.warningNoPromiseImplementation());
        }

        return promiseWrapper;
    },

    /**
     * @private
     * @param   {Array<Promise>}    tasks
     * @param   {object}            libraries
     * @return  {Promise<Array>}
     */

    all: function(tasks, libraries) {
        var $ = null;

        if (mixitup.features.has.promises) {
            return Promise.all(tasks);
        } else if (($ = (window.jQuery || libraries.$)) && typeof $.when === 'function') {
            return $.when.apply($, tasks)
                .done(function() {
                    // jQuery when returns spread arguments rather than an array or resolutions

                    return arguments;
                });
        }

        // No implementation

        if (window.console) {
            console.warn(mixitup.messages.warningNoPromiseImplementation());
        }

        return [];
    },

    /**
     * @private
     * @param   {HTMLElement}   el
     * @param   {string}        property
     * @param   {Array<string>} vendors
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

    randomHex: function() {
        return ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6).toUpperCase();
    },

    /**
     * @private
     * @param   {HTMLDocument}  [doc]
     * @return  {object}
     */

    getDocumentState: function(doc) {
        doc = typeof doc.body === 'object' ? doc : window.document;

        return {
            scrollTop: window.pageYOffset,
            scrollLeft: window.pageXOffset,
            docHeight: doc.documentElement.scrollHeight,
            docWidth: doc.documentElement.scrollWidth,
            viewportHeight: doc.documentElement.clientHeight,
            viewportWidth: doc.documentElement.clientWidth
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
     * @param   {HTMLElement}   el
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
     * @param   {object}    obj
     */

    freeze: function(obj) {
        if (typeof Object.freeze === 'function') {
            Object.freeze(obj);
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
            controlPart     = parseInt(controlParts[i].replace(/[^\d.]/g, ''));
            specimenPart    = parseInt(specimenParts[i].replace(/[^\d.]/g, '') || 0);

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

    Deferred: function() {
        this.promise    = null;
        this.resolve    = null;
        this.reject     = null;
        this.id         = h.randomHex();
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
    },

    /**
     * @param   {mixitup.Config.ClassNames}   classNames
     * @param   {string}                      elementName
     * @param   {string}                      [modifier]
     * @return  {string}
     */

    getClassname: function(classNames, elementName, modifier) {
        var classname = '';

        classname += classNames.block;

        if (classname.length) {
            classname += classNames.delineatorElement;
        }

        classname += classNames['element' + this.pascalCase(elementName)];

        if (!modifier) return classname;

        if (classname.length) {
            classname += classNames.delineatorModifier;
        }

        classname += modifier;

        return classname;
    },

    /**
     * Returns the value of a property on a given object via its string key.
     *
     * @param   {object}    obj
     * @param   {string}    stringKey
     * @return  {*} value
     */

    getProperty: function(obj, stringKey) {
        var parts           = stringKey.split('.'),
            returnCurrent   = null,
            current         = '',
            i               = 0;

        if (!stringKey) {
            return obj;
        }

        returnCurrent = function(obj) {
            if (!obj) {
                return null;
            } else {
                return obj[current];
            }
        };

        while (i < parts.length) {
            current = parts[i];

            obj = returnCurrent(obj);

            i++;
        }

        if (typeof obj !== 'undefined') {
            return obj;
        } else {
            return null;
        }
    }
};

mixitup.h = h;
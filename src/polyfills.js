(function() {
    var VENDORS = ['webkit', 'moz', 'o', 'ms'],
        canary  = window.document.createElement('div'),
        i       = -1;

    // window.requestAnimationFrame

    for (i = 0; i < VENDORS.length && !window.requestAnimationFrame; i++) {
        window.requestAnimationFrame = window[VENDORS[i] + 'RequestAnimationFrame'];
    }

    // Element.nextElementSibling

    if (typeof canary.nextElementSibling === 'undefined') {
        Object.defineProperty(window.Element.prototype, 'nextElementSibling', {
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
                return Array.prototype.indexOf.call(this.parentElement.querySelectorAll(selector), this) > -1;
            };
    })(window.Element.prototype);

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

    // Object.create
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/create

    if (typeof Object.create !== 'function') {
        Object.create = (function(undefined) {
            var Temp = function() {};

            return function (prototype, propertiesObject) {
                if (prototype !== Object(prototype) && prototype !== null) {
                    throw TypeError('Argument must be an object, or null');
                }

                Temp.prototype = prototype || {};

                var result = new Temp();

                Temp.prototype = null;

                if (propertiesObject !== undefined) {
                    Object.defineProperties(result, propertiesObject);
                }

                if (prototype === null) {
                    /* jshint ignore:start */
                    result.__proto__ = null;
                    /* jshint ignore:end */
                }

                return result;
            };
        })();
    }

    // String.prototyoe.trim

    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }

    // Array.prototype.indexOf
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(searchElement) {
            var n, k, t, len;

            if (this === null) {
                throw new TypeError();
            }

            t = Object(this);

            len = t.length >>> 0;

            if (len === 0) {
                return -1;
            }

            n = 0;

            if (arguments.length > 1) {
                n = Number(arguments[1]);

                if (n !== n) {
                    n = 0;
                } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }

            if (n >= len) {
                return -1;
            }

            for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }

            return -1;
        };
    }

    // Function.prototype.bind
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind

    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            var aArgs, self, FNOP, fBound;

            if (typeof this !== 'function') {
                throw new TypeError();
            }

            aArgs = Array.prototype.slice.call(arguments, 1);

            self = this;

            FNOP = function() {};

            fBound = function() {
                return self.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };

            if (this.prototype) {
                FNOP.prototype = this.prototype;
            }

            fBound.prototype = new FNOP();

            return fBound;
        };
    }

    // Element.prototype.dispatchEvent

    if (!window.Element.prototype.dispatchEvent) {
        window.Element.prototype.dispatchEvent = function(event) {
            try {
                return this.fireEvent('on' + event.type, event);
            } catch (err) {}
        };
    }
})();
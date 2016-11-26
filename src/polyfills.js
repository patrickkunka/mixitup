(function() {
    var VENDORS = ['Webkit', 'moz', 'O', 'ms'],
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
                var nodes = (this.parentNode || this.doc).querySelectorAll(selector),
                    i = -1;

                while (nodes[++i] && nodes[i] != this) {
                    return !!nodes[i];
                }
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
})();
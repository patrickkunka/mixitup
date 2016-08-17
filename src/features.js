/* global mixitup, h */

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
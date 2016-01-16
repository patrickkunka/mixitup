{{>banner}}

(function(window) {
    'use strict';

    var mixitup         = null,
        h               = null;

    {{>factory}}

    {{>h}}

    {{>base-prototype}}

    {{>mixer}}

    {{>target}}

    {{>collection}}

    {{>operation}}

    {{>state}}

    {{>style-data}}

    {{>transform-data}}

    {{>user-instruction}}

    mixitup.CORE_VERSION    = '{{version}}';
    mixitup.h               = h;

    mixitup.Mixer.prototype._featureDetect();

    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = mixitup;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return mixitup;
        });
    } else if (typeof window.mixitup === 'undefined' || typeof window.mixitup !== 'function') {
        window.mixitup = window.mixItUp = mixitup;
    }
})(window);
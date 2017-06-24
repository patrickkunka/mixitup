/* global module, mixitup, define */

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = mixitup;
} else if (typeof define === 'function' && define.amd) {
    define(function() {
        return mixitup;
    });
} else if (typeof window.mixitup === 'undefined' || typeof window.mixitup !== 'function') {
    window.mixitup = mixitup;
}
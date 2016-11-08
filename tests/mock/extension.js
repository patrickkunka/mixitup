(function(window) {
    'use strict';

    var mixitupMockExtension = function(mixitup) {
        var h = mixitup.h;

        if (
            !mixitup.CORE_VERSION ||
            !h.compareVersions(mixitupMockExtension.REQUIRE_CORE_VERSION, mixitup.CORE_VERSION)
        ) {
            throw new Error(
                '[MixItUp-MockExtension] MixItUp MockExtension v' +
                mixitupMockExtension.EXTENSION_VERSION +
                ' requires at least MixItUp v' +
                mixitupMockExtension.REQUIRE_CORE_VERSION
            );
        }

    };

    mixitupMockExtension.TYPE                    = 'mixitup-extension';
    mixitupMockExtension.NAME                    = 'mixitup-mock-extension';
    mixitupMockExtension.EXTENSION_VERSION       = '1.0.0';
    mixitupMockExtension.REQUIRE_CORE_VERSION    = '3.0.0';

    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = mixitupMockExtension;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return mixitupMockExtension;
        });
    } else if (window.mixitup && typeof window.mixitup === 'function') {
        mixitupMockExtension(window.mixitup);
    } else {
        console.error('[MixItUp-MockExtension] MixItUp core not found');
    }
})(window);
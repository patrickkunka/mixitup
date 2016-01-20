/* global define */
{{>banner}}

(function(window) {
    'use strict';

    var mixitup         = null,
        h               = null;

    {{>factory}}

    {{>h}}

    mixitup.CORE_VERSION    = '{{version}}';
    mixitup.h               = h;

    {{>base-prototype}}

    {{>mixer}}

    {{>target}}

    {{>collection}}

    {{>operation}}

    {{>state}}

    {{>style-data}}

    {{>transform-data}}

    {{>user-instruction}}

    {{>messages}}

    {{>features}}

    {{>module-definitions}}
})(window);
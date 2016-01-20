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

    {{>config-animation}}

    {{>config-callbacks}}

    {{>config-controls}}

    {{>config-debug}}

    {{>config-layout}}

    {{>config-libraries}}

    {{>config-load}}

    {{>config-selectors}}

    {{>mixer-dom}}

    {{>click-tracker}}

    {{>style-data}}

    {{>transform-data}}

    {{>transform-defaults}}

    {{>mixer}}

    {{>target-dom}}

    {{>target}}

    {{>collection}}

    {{>operation}}

    {{>state}}

    {{>user-instruction}}

    {{>messages}}

    {{>features}}

    {{>module-definitions}}
})(window);
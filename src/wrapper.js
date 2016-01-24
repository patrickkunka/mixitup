{{>banner}}

(function(window) {
    'use strict';

    var mixitup         = null,
        h               = null;

    {{>factory}}

    {{>h}}

    {{>base-prototype}}

    {{>config-animation}}

    {{>config-callbacks}}

    {{>config-controls}}

    {{>config-debug}}

    {{>config-extensions}}

    {{>config-layout}}

    {{>config-libraries}}

    {{>config-load}}

    {{>config-selectors}}


    {{>config}}

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

    mixitup.CORE_VERSION = '{{version}}';
})(window);
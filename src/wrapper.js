{{>banner}}

(function(window) {
    'use strict';

    var mixitup         = null,
        h               = null;

    {{>factory}}

    {{>h}}

    {{>base}}

    {{>base-static}}

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

    {{>control-definition}}

    {{>control}}

    {{>style-data}}

    {{>transform-data}}

    {{>transform-defaults}}

    {{>events}}

    {{>queue-item}}

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

    mixitup.NAME = '{{name}}';
    mixitup.CORE_VERSION = '{{version}}';
})(window);
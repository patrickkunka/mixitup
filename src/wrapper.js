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

    /**
     * Stores all current instances of MixItUp in the current session, using their IDs as keys.
     *
     * @private
     * @static
     * @since   2.0.0
     * @type    {object}
     */

    mixitup.instances = {};

    /**
     * @private
     * @static
     * @since   3.0.0
     * @type    {mixitup.TransformDefaults}
     */

    mixitup.transformDefaults = new mixitup.TransformDefaults();

    /**
     * @private
     * @static
     * @since   2.0.0
     * @type    {mixitup.ClickTracker}
     */

    mixitup.handled = new mixitup.ClickTracker();

    /**
     * @private
     * @static
     * @since   2.0.0
     * @type    {mixitup.ClickTracker}
     */

    mixitup.bound = new mixitup.ClickTracker();

    {{>module-definitions}}
})(window);
/* global mixitup, h */

/**
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.Target = function() {
    this.execAction('construct', 0);

    this.sortString = '';
    this.mixer      = null;
    this.callback   = null;
    this.isShown    = false;
    this.isBound    = false;
    this.isExcluded = false;
    this.handler    = null;
    this.operation  = null;

    this.dom        = new mixitup.TargetDom();

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.Target.prototype = Object.create(new mixitup.BasePrototype());

h.extend(mixitup.Target.prototype, {
    constructor: mixitup.Target,

    /**
     * Initialises a newly instantiated Target.
     *
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Element}   el
     * @param   {object}    mixer
     * @return  {void}
     */

    init: function(el, mixer) {
        var self = this;

        self.execAction('init', 0, arguments);

        self.mixer = mixer;

        self.cacheDom(el);

        self.bindEvents();

        if (self.dom.el.style.display !== 'none') {
            self.isShown = true;
        }

        self.execAction('init', 1, arguments);
    },

    /**
     * Caches references of DOM elements neccessary for the target's functionality.
     *
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Element} el
     * @return  {void}
     */

    cacheDom: function(el) {
        var self = this;

        self.execAction('cacheDom', 0, arguments);

        self.dom.el = el;

        self.execAction('cacheDom', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {string}    attributeName
     * @return  {void}
     */

    getSortString: function(attributeName) {
        var self    = this,
            value   = self.dom.el.getAttribute('data-' + attributeName) || '';

        self.execAction('getSortString', 0, arguments);

        value = isNaN(value * 1) ?
            value.toLowerCase() :
            value * 1;

        self.sortString = value;

        self.execAction('getSortString', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @return  {void}
     */

    show: function() {
        var self = this;

        self.execAction('show', 0, arguments);

        if (!self.isShown) {
            self.dom.el.style.display = '';

            self.isShown = true;
        }

        self.execAction('show', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @return  {void}
     */

    hide: function() {
        var self = this;

        self.execAction('hide', 0, arguments);

        if (self.isShown) {
            self.dom.el.style.display = 'none';

            self.isShown = false;
        }

        self.execAction('hide', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {object}    options
     * @return  {void}
     */

    move: function(options) {
        var self = this;

        self.execAction('move', 0, arguments);

        if (!self.isExcluded) {
            self.mixer._targetsMoved++;
        }

        self.applyStylesIn({
            posIn: options.posIn,
            hideOrShow: options.hideOrShow
        });

        requestAnimationFrame(function() {
            self.applyStylesOut(options);
        });

        self.execAction('move', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {object}    posData
     * @param   {number}    multiplier
     * @return  {void}
     */

    applyTween: function(posData, multiplier) {
        var self                    = this,
            propertyName            = '',
            tweenData               = null,
            posIn                   = posData.posIn,
            currentTransformValues  = [],
            currentValues           = new mixitup.StyleData(),
            i                       = -1;

        self.execAction('applyTween', 0, arguments);

        currentValues.x     = posIn.x;
        currentValues.y     = posIn.y;

        if (multiplier === 0) {
            self.hide();
        } else if (!self.isShown) {
            self.show();
        }

        for (i = 0; propertyName = mixitup.features.TWEENABLE[i]; i++) {
            tweenData = posData.tweenData[propertyName];

            if (propertyName === 'x') {
                if (!tweenData) continue;

                currentValues.x = posIn.x + (tweenData * multiplier);
            } else if (propertyName === 'y') {
                if (!tweenData) continue;

                currentValues.y = posIn.y + (tweenData * multiplier);
            } else if (tweenData instanceof mixitup.TransformData) {
                if (!tweenData.value) continue;

                currentValues[propertyName].value =
                    posIn[propertyName].value + (tweenData.value * multiplier);

                currentValues[propertyName].unit  = tweenData.unit;

                currentTransformValues.push(
                    propertyName + '(' + currentValues[propertyName].value + tweenData.unit + ')'
                );
            } else {
                if (!tweenData) continue;

                currentValues[propertyName] = posIn[propertyName] + (tweenData * multiplier);

                self.dom.el.style[propertyName] = currentValues[propertyName];
            }
        }

        if (currentValues.x || currentValues.y) {
            currentTransformValues.unshift('translate(' + currentValues.x + 'px, ' + currentValues.y + 'px)');
        }

        if (currentTransformValues.length) {
            self.dom.el.style[mixitup.features.transformProp] = currentTransformValues.join(' ');
        }

        self.execAction('applyTween', 1, arguments);
    },

    /**
     * Applies the initial styling to a target element before any transition
     * is applied.
     *
     * @private
     * @instance
     * @param   {object}    options
     * @return  {void}
     */

    applyStylesIn: function(options) {
        var self            = this,
            posIn           = options.posIn,
            isFading        = self.mixer._effectsIn.opacity !== 1,
            transformValues = [];

        self.execAction('applyStylesIn', 0, arguments);

        transformValues.push('translate(' + posIn.x + 'px, ' + posIn.y + 'px)');

        if (options.hideOrShow !== 'show' && self.mixer.animation.animateResizeTargets) {
            self.dom.el.style.width        = posIn.width + 'px';
            self.dom.el.style.height       = posIn.height + 'px';
            self.dom.el.style.marginRight  = posIn.marginRight + 'px';
            self.dom.el.style.marginBottom = posIn.marginBottom + 'px';
        }

        isFading && (self.dom.el.style.opacity = posIn.opacity);

        if (options.hideOrShow === 'show') {
            transformValues = transformValues.concat(self.mixer._transformIn);
        }

        self.dom.el.style[mixitup.features.transformProp] = transformValues.join(' ');

        self.execAction('applyStylesIn', 1, arguments);
    },

    /**
     * Applies a transition followed by the final styles for the element to
     * transition towards.
     *
     * @private
     * @instance
     * @param   {object}    options
     * @return  {void}
     */

    applyStylesOut: function(options) {
        var self            = this,
            transitionRules = [],
            transformValues = [],
            isResizing      = self.mixer.animation.animateResizeTargets,
            isFading        = typeof self.mixer._effectsIn.opacity !== 'undefined';

        self.execAction('applyStylesOut', 0, arguments);

        // Build the transition rules

        transitionRules.push(self.writeTransitionRule(
            mixitup.features.transformRule,
            options.staggerIndex
        ));

        if (options.hideOrShow) {
            transitionRules.push(self.writeTransitionRule(
                'opacity',
                options.staggerIndex,
                options.duration
            ));
        }

        if (isResizing) {
            transitionRules.push(self.writeTransitionRule(
                'width',
                options.staggerIndex,
                options.duration
            ));

            transitionRules.push(self.writeTransitionRule(
                'height',
                options.staggerIndex,
                options.duration
            ));

            transitionRules.push(self.writeTransitionRule(
                'margin',
                options.staggerIndex,
                options.duration
            ));
        }

        // If no callback was provided, the element will
        // not transition in any way so tag it as "immovable"

        if (!options.callback) {
            self.mixer._targetsImmovable++;

            if (self.mixer._targetsMoved === self.mixer._targetsImmovable) {
                // If the total targets moved is equal to the
                // number of immovable targets, the operation
                // should be considered finished

                self.mixer._cleanUp(options.operation);
            }

            return;
        }

        // If the target will transition in some fasion,
        // assign a callback function

        self.operation = options.operation;
        self.callback = options.callback;

        // As long as the target is not excluded, increment
        // the total number of targets bound

        !self.isExcluded && self.mixer._targetsBound++;

        // Tag the target as bound to differentiate from transitionEnd
        // events that may come from stylesheet driven effects

        self.isBound = true;

        // Apply the transition

        self.applyTransition(transitionRules);

        // Apply width, height and margin negation

        if (isResizing && options.posOut.width > 0 && options.posOut.height > 0) {
            self.dom.el.style.width        = options.posOut.width + 'px';
            self.dom.el.style.height       = options.posOut.height + 'px';
            self.dom.el.style.marginRight  = options.posOut.marginRight + 'px';
            self.dom.el.style.marginBottom = options.posOut.marginBottom + 'px';
        }

        if (!self.mixer.animation.nudge && options.hideOrShow === 'hide') {
            // If we're not nudging, the translation should be
            // applied before any other transforms to prevent
            // lateral movement

            transformValues.push('translate(' + options.posOut.x + 'px, ' + options.posOut.y + 'px)');
        }

        // Apply fade

        switch (options.hideOrShow) {
            case 'hide':
                isFading && (self.dom.el.style.opacity = self.mixer._effectsOut.opacity);

                transformValues = transformValues.concat(self.mixer._transformOut);

                break;
            case 'show':
                isFading && (self.dom.el.style.opacity = 1);
        }

        if (
            self.mixer.animation.nudge ||
            (!self.mixer.animation.nudge && options.hideOrShow !== 'hide')
        ) {
            // Opposite of above - apply translate after
            // other transform

            transformValues.push('translate(' + options.posOut.x + 'px, ' + options.posOut.y + 'px)');
        }

        // Apply transforms

        self.dom.el.style[mixitup.features.transformProp] = transformValues.join(' ');

        self.execAction('applyStylesOut', 1, arguments);
    },

    /**
     * Combines the name of a CSS property with the appropriate duration and delay
     * values to created a valid transition rule.
     *
     * @private
     * @instance
     * @since   3.0.0
     * @param   {string}    rule
     * @param   {number}    staggerIndex
     * @param   {number}    [duration]
     * @return  {string}
     */

    writeTransitionRule: function(rule, staggerIndex, duration) {
        var self    = this,
            delay   = self.getDelay(staggerIndex),
            output  = '';

        output = rule + ' ' +
            (duration || self.mixer.animation.duration) + 'ms ' +
            delay + 'ms ' +
            (rule === 'opacity' ? 'linear' : self.mixer.animation.easing);

        return self.execFilter('writeTransitionRule', output, arguments);
    },

    /**
     * Calculates the transition delay for each target element based on its index, if
     * staggering is applied. If defined, A custom `animation.staggerSeqeuence`
     * function can be used to manipulate the order of indices to produce custom
     * stagger effects (e.g. for use in a grid with irregular row lengths).
     *
     * @private
     * @instance
     * @since   2.0.0
     * @param   {number}    index
     * @return  {number}
     */

    getDelay: function(index) {
        var self    = this,
            delay   = -1;

        if (typeof self.mixer.animation.staggerSequence === 'function') {
            index = self.mixer.animation.staggerSequence.call(self, index, self._state);
        }

        delay = !!self.mixer._staggerDuration ? index * self.mixer._staggerDuration : 0;

        return self.execFilter('getDelay', delay, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {string[]}  rules
     * @return  {void}
     */

    applyTransition: function(rules) {
        var self                = this,
            transitionString    = rules.join(', ');

        self.execAction('applyTransition', 0, arguments);

        self.dom.el.style[mixitup.features.transitionProp] = transitionString;

        self.execAction('applyTransition', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Event} e
     * @return  {void}
     */

    handleTransitionEnd: function(e) {
        var self        = this,
            propName    = e.propertyName,
            canResize   = self.mixer.animation.animateResizeTargets;

        self.execAction('handleTransitionEnd', 0, arguments);

        if (
            self.isBound &&
            e.target.matches(self.mixer.selectors.target) &&
            (
                propName.indexOf('transform') > -1 ||
                propName.indexOf('opacity') > -1 ||
                canResize && propName.indexOf('height') > -1 ||
                canResize && propName.indexOf('width') > -1 ||
                canResize && propName.indexOf('margin') > -1
            )
        ) {
            self.callback.call(self, self.operation);

            self.isBound = false;
            self.callback = null;
            self.operation = null;
        }

        self.execAction('handleTransitionEnd', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Event}     e
     * @return  {void}
     */

    eventBus: function(e) {
        var self = this;

        self.execAction('eventBus', 0, arguments);

        switch (e.type) {
            case 'webkitTransitionEnd':
            case 'transitionend':
                self.handleTransitionEnd(e);
        }

        self.execAction('eventBus', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @return  {void}
     */

    unbindEvents: function() {
        var self = this;

        self.execAction('unbindEvents', 0, arguments);

        h.off(self.dom.el, 'webkitTransitionEnd', self.handler);
        h.off(self.dom.el, 'transitionend', self.handler);

        self.execAction('unbindEvents', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @return  {void}
     */

    bindEvents: function() {
        var self = this,
            transitionEndEvent = mixitup.features.transitionPrefix === 'webkit' ?
                'webkitTransitionEnd' :
                'transitionend';

        self.execAction('bindEvents', 0, arguments);

        self.handler = function(e) {
            return self.eventBus(e);
        };

        h.on(self.dom.el, transitionEndEvent, self.handler);

        self.execAction('bindEvents', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {boolean}   [getBox]
     * @return  {PosData}
     */

    getPosData: function(getBox) {
        var self    = this,
            styles  = {},
            rect    = null,
            posData = new mixitup.StyleData();

        self.execAction('getPosData', 0, arguments);

        posData.x = self.dom.el.offsetLeft;
        posData.y = self.dom.el.offsetTop;

        if (self.mixer.animation.animateResizeTargets || getBox) {
            rect = self.dom.el.getBoundingClientRect();

            posData.top     = rect.top;
            posData.right   = rect.right;
            posData.bottom  = rect.bottom;
            posData.left    = rect.left;

            posData.width  = rect.width;
            posData.height = rect.height;
        }

        if (self.mixer.animation.animateResizeTargets) {
            styles = window.getComputedStyle(self.dom.el);

            posData.marginBottom = parseFloat(styles.marginBottom);
            posData.marginRight  = parseFloat(styles.marginRight);
        }

        return self.execFilter('getPosData', posData, arguments);
    },

    /**
     * @private
     * @instance
     * @since       3.0.0
     * @return      {void}
     */

    cleanUp: function() {
        var self = this;

        self.execAction('cleanUp', 0, arguments);

        self.dom.el.style[mixitup.features.transformProp]  = '';
        self.dom.el.style[mixitup.features.transitionProp] = '';
        self.dom.el.style.opacity                          = '';

        if (self.mixer.animation.animateResizeTargets) {
            self.dom.el.style.width        = '';
            self.dom.el.style.height       = '';
            self.dom.el.style.marginRight  = '';
            self.dom.el.style.marginBottom = '';
        }

        self.execAction('cleanUp', 1, arguments);
    }
});
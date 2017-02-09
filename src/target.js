/* global mixitup, h */

/**
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.Target = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.id         = '';
    this.sortString = '';
    this.mixer      = null;
    this.callback   = null;
    this.isShown    = false;
    this.isBound    = false;
    this.isExcluded = false;
    this.isInDom    = false;
    this.handler    = null;
    this.operation  = null;
    this.data       = null;
    this.dom        = new mixitup.TargetDom();

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.Target);

mixitup.Target.prototype = Object.create(mixitup.Base.prototype);

h.extend(mixitup.Target.prototype, {
    constructor: mixitup.Target,

    /**
     * Initialises a newly instantiated Target.
     *
     * @private
     * @instance
     * @since   3.0.0
     * @param   {(Element|null)}    el
     * @param   {object}            mixer
     * @param   {object}            [data]
     * @return  {void}
     */

    init: function(el, mixer, data) {
        var self = this,
            id   = '';

        self.callActions('beforeInit', arguments);

        self.mixer = mixer;

        if (!el) {
            // If no element is provided, render it

            el = self.render(data);
        }

        self.cacheDom(el);

        self.bindEvents();

        if (self.dom.el.style.display !== 'none') {
            self.isShown = true;
        }

        if (data && mixer.config.data.uidKey) {
            if (typeof (id = data[mixer.config.data.uidKey]) === 'undefined' || id.toString().length < 1) {
                throw new TypeError(mixitup.messages.errorDatasetInvalidUidKey({
                    uidKey: mixer.config.data.uidKey
                }));
            }

            self.id     = id;
            self.data   = data;

            mixer.cache[id] = self;
        }

        self.callActions('afterInit', arguments);
    },

    /**
     * Renders the target element using a user-defined renderer function.
     *
     * @private
     * @instance
     * @since   3.1.4
     * @param   {object} data
     * @return  {void}
     */

    render: function(data) {
        var self    = this,
            render  = null,
            el      = null,
            temp    = null,
            output  = '';

        self.callActions('beforeRender', arguments);

        render = self.callFilters('renderRender', self.mixer.config.render.target, arguments);

        if (typeof render !== 'function') {
            throw new TypeError(mixitup.messages.errorDatasetRendererNotSet());
        }

        output = render(data);

        if (output && typeof output === 'object' && h.isElement(output)) {
            el = output;
        } else if (typeof output === 'string') {
            temp = document.createElement('div');
            temp.innerHTML = output;

            el = temp.firstElementChild;
        }

        return self.callFilters('elRender', el, arguments);
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

        self.callActions('beforeCacheDom', arguments);

        self.dom.el = el;

        self.callActions('afterCacheDom', arguments);
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

        self.callActions('beforeGetSortString', arguments);

        value = isNaN(value * 1) ?
            value.toLowerCase() :
            value * 1;

        self.sortString = value;

        self.callActions('afterGetSortString', arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @return  {void}
     */

    show: function() {
        var self = this;

        self.callActions('beforeShow', arguments);

        if (!self.isShown) {
            self.dom.el.style.display = '';

            self.isShown = true;
        }

        self.callActions('afterShow', arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @return  {void}
     */

    hide: function() {
        var self = this;

        self.callActions('beforeHide', arguments);

        if (self.isShown) {
            self.dom.el.style.display = 'none';

            self.isShown = false;
        }

        self.callActions('afterHide', arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {mixitup.IMoveData} moveData
     * @return  {void}
     */

    move: function(moveData) {
        var self = this;

        self.callActions('beforeMove', arguments);

        if (!self.isExcluded) {
            self.mixer.targetsMoved++;
        }

        self.applyStylesIn(moveData);

        requestAnimationFrame(function() {
            self.applyStylesOut(moveData);
        });

        self.callActions('afterMove', arguments);
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

        self.callActions('beforeApplyTween', arguments);

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

        self.callActions('afterApplyTween', arguments);
    },

    /**
     * Applies the initial styling to a target element before any transition
     * is applied.
     *
     * @private
     * @instance
     * @param   {mixitup.IMoveData} moveData
     * @return  {void}
     */

    applyStylesIn: function(moveData) {
        var self            = this,
            posIn           = moveData.posIn,
            isFading        = self.mixer.effectsIn.opacity !== 1,
            transformValues = [];

        self.callActions('beforeApplyStylesIn', arguments);

        transformValues.push('translate(' + posIn.x + 'px, ' + posIn.y + 'px)');

        if (self.mixer.config.animation.animateResizeTargets) {
            if (moveData.statusChange !== 'show') {
                // Don't apply posIn width or height or showing, as will be 0

                self.dom.el.style.width  = posIn.width + 'px';
                self.dom.el.style.height = posIn.height + 'px';
            }

            self.dom.el.style.marginRight  = posIn.marginRight + 'px';
            self.dom.el.style.marginBottom = posIn.marginBottom + 'px';
        }

        isFading && (self.dom.el.style.opacity = posIn.opacity);

        if (moveData.statusChange === 'show') {
            transformValues = transformValues.concat(self.mixer.transformIn);
        }

        self.dom.el.style[mixitup.features.transformProp] = transformValues.join(' ');

        self.callActions('afterApplyStylesIn', arguments);
    },

    /**
     * Applies a transition followed by the final styles for the element to
     * transition towards.
     *
     * @private
     * @instance
     * @param   {mixitup.IMoveData} moveData
     * @return  {void}
     */

    applyStylesOut: function(moveData) {
        var self            = this,
            transitionRules = [],
            transformValues = [],
            isResizing      = self.mixer.config.animation.animateResizeTargets,
            isFading        = typeof self.mixer.effectsIn.opacity !== 'undefined';

        self.callActions('beforeApplyStylesOut', arguments);

        // Build the transition rules

        transitionRules.push(self.writeTransitionRule(
            mixitup.features.transformRule,
            moveData.staggerIndex
        ));

        if (moveData.statusChange !== 'none') {
            transitionRules.push(self.writeTransitionRule(
                'opacity',
                moveData.staggerIndex,
                moveData.duration
            ));
        }

        if (isResizing) {
            transitionRules.push(self.writeTransitionRule(
                'width',
                moveData.staggerIndex,
                moveData.duration
            ));

            transitionRules.push(self.writeTransitionRule(
                'height',
                moveData.staggerIndex,
                moveData.duration
            ));

            transitionRules.push(self.writeTransitionRule(
                'margin',
                moveData.staggerIndex,
                moveData.duration
            ));
        }

        // If no callback was provided, the element will
        // not transition in any way so tag it as "immovable"

        if (!moveData.callback) {
            self.mixer.targetsImmovable++;

            if (self.mixer.targetsMoved === self.mixer.targetsImmovable) {
                // If the total targets moved is equal to the
                // number of immovable targets, the operation
                // should be considered finished

                self.mixer.cleanUp(moveData.operation);
            }

            return;
        }

        // If the target will transition in some fasion,
        // assign a callback function

        self.operation = moveData.operation;
        self.callback = moveData.callback;

        // As long as the target is not excluded, increment
        // the total number of targets bound

        !self.isExcluded && self.mixer.targetsBound++;

        // Tag the target as bound to differentiate from transitionEnd
        // events that may come from stylesheet driven effects

        self.isBound = true;

        // Apply the transition

        self.applyTransition(transitionRules);

        // Apply width, height and margin negation

        if (isResizing && moveData.posOut.width > 0 && moveData.posOut.height > 0) {
            self.dom.el.style.width        = moveData.posOut.width + 'px';
            self.dom.el.style.height       = moveData.posOut.height + 'px';
            self.dom.el.style.marginRight  = moveData.posOut.marginRight + 'px';
            self.dom.el.style.marginBottom = moveData.posOut.marginBottom + 'px';
        }

        if (!self.mixer.config.animation.nudge && moveData.statusChange === 'hide') {
            // If we're not nudging, the translation should be
            // applied before any other transforms to prevent
            // lateral movement

            transformValues.push('translate(' + moveData.posOut.x + 'px, ' + moveData.posOut.y + 'px)');
        }

        // Apply fade

        switch (moveData.statusChange) {
            case 'hide':
                isFading && (self.dom.el.style.opacity = self.mixer.effectsOut.opacity);

                transformValues = transformValues.concat(self.mixer.transformOut);

                break;
            case 'show':
                isFading && (self.dom.el.style.opacity = 1);
        }

        if (
            self.mixer.config.animation.nudge ||
            (!self.mixer.config.animation.nudge && moveData.statusChange !== 'hide')
        ) {
            // Opposite of above - apply translate after
            // other transform

            transformValues.push('translate(' + moveData.posOut.x + 'px, ' + moveData.posOut.y + 'px)');
        }

        // Apply transforms

        self.dom.el.style[mixitup.features.transformProp] = transformValues.join(' ');

        self.callActions('afterApplyStylesOut', arguments);
    },

    /**
     * Combines the name of a CSS property with the appropriate duration and delay
     * values to created a valid transition rule.
     *
     * @private
     * @instance
     * @since   3.0.0
     * @param   {string}    property
     * @param   {number}    staggerIndex
     * @param   {number}    duration
     * @return  {string}
     */

    writeTransitionRule: function(property, staggerIndex, duration) {
        var self  = this,
            delay = self.getDelay(staggerIndex),
            rule  = '';

        rule = property + ' ' +
            (duration > 0 ? duration : self.mixer.config.animation.duration) + 'ms ' +
            delay + 'ms ' +
            (property === 'opacity' ? 'linear' : self.mixer.config.animation.easing);

        return self.callFilters('ruleWriteTransitionRule', rule, arguments);
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

        if (typeof self.mixer.config.animation.staggerSequence === 'function') {
            index = self.mixer.config.animation.staggerSequence.call(self, index, self.state);
        }

        delay = !!self.mixer.staggerDuration ? index * self.mixer.staggerDuration : 0;

        return self.callFilters('delayGetDelay', delay, arguments);
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

        self.callActions('beforeApplyTransition', arguments);

        self.dom.el.style[mixitup.features.transitionProp] = transitionString;

        self.callActions('afterApplyTransition', arguments);
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
            canResize   = self.mixer.config.animation.animateResizeTargets;

        self.callActions('beforeHandleTransitionEnd', arguments);

        if (
            self.isBound &&
            e.target.matches(self.mixer.config.selectors.target) &&
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

        self.callActions('afterHandleTransitionEnd', arguments);
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

        self.callActions('beforeEventBus', arguments);

        switch (e.type) {
            case 'webkitTransitionEnd':
            case 'transitionend':
                self.handleTransitionEnd(e);
        }

        self.callActions('afterEventBus', arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @return  {void}
     */

    unbindEvents: function() {
        var self = this;

        self.callActions('beforeUnbindEvents', arguments);

        h.off(self.dom.el, 'webkitTransitionEnd', self.handler);
        h.off(self.dom.el, 'transitionend', self.handler);

        self.callActions('afterUnbindEvents', arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @return  {void}
     */

    bindEvents: function() {
        var self                = this,
            transitionEndEvent  = '';

        self.callActions('beforeBindEvents', arguments);

        transitionEndEvent = mixitup.features.transitionPrefix === 'webkit' ? 'webkitTransitionEnd' : 'transitionend';

        self.handler = function(e) {
            return self.eventBus(e);
        };

        h.on(self.dom.el, transitionEndEvent, self.handler);

        self.callActions('afterBindEvents', arguments);
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

        self.callActions('beforeGetPosData', arguments);

        posData.x = self.dom.el.offsetLeft;
        posData.y = self.dom.el.offsetTop;

        if (self.mixer.config.animation.animateResizeTargets || getBox) {
            rect = self.dom.el.getBoundingClientRect();

            posData.top     = rect.top;
            posData.right   = rect.right;
            posData.bottom  = rect.bottom;
            posData.left    = rect.left;

            posData.width  = rect.width;
            posData.height = rect.height;
        }

        if (self.mixer.config.animation.animateResizeTargets) {
            styles = window.getComputedStyle(self.dom.el);

            posData.marginBottom = parseFloat(styles.marginBottom);
            posData.marginRight  = parseFloat(styles.marginRight);
        }

        return self.callFilters('posDataGetPosData', posData, arguments);
    },

    /**
     * @private
     * @instance
     * @since       3.0.0
     * @return      {void}
     */

    cleanUp: function() {
        var self = this;

        self.callActions('beforeCleanUp', arguments);

        self.dom.el.style[mixitup.features.transformProp]  = '';
        self.dom.el.style[mixitup.features.transitionProp] = '';
        self.dom.el.style.opacity                          = '';

        if (self.mixer.config.animation.animateResizeTargets) {
            self.dom.el.style.width        = '';
            self.dom.el.style.height       = '';
            self.dom.el.style.marginRight  = '';
            self.dom.el.style.marginBottom = '';
        }

        self.callActions('afterCleanUp', arguments);
    }
});
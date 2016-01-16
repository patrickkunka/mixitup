/* global mixitup */
/* global h */

/**
 * mixitup.Mixer
 * @since       3.0.0
 * @constructor
 */

mixitup.Mixer = function() {
    var self = this;

    self._execAction('_constructor', 0);

    h.extend(self, {
        selectors: {
            target: '.mix',
            filter: '.filter',
            filterToggle: '.filter-toggle',
            multiMix: '.multimix',
            sort: '.sort'
        },

        animation: {
            enable: true,
            effects: 'fade scale',
            effectsIn: '',
            effectsOut: '',
            duration: 600,
            easing: 'ease',
            perspectiveDistance: '3000',
            perspectiveOrigin: '50% 50%',
            queue: true,
            queueLimit: 1,
            animateChangeLayout: false,
            animateResizeContainer: true,
            animateResizeTargets: false,
            staggerSequence: null,
            reverseOut: false,
            nudgeOut: true
        },

        callbacks: {
            onMixLoad: null,
            onMixStart: null,
            onMixBusy: null,
            onMixEnd: null,
            onMixFail: null,
            onMixClick: null
        },

        controls: {
            enable: true,
            live: false,
            toggleFilterButtons: false,
            toggleLogic: 'or',
            toggleDefault: 'all',
            activeClass: 'active'
        },

        layout: {
            allowNestedTargets: false,
            display: 'inline-block',
            containerClass: '',
            containerClassFail: 'fail'
        },

        load: {
            filter: 'all',
            sort: false
        },

        libraries: {
            q: null
        },

        debug: {
            enable: true
        },

        document: null,
        extensions: null,

        _dom: {
            document: null,
            body: null,
            container: null,
            targets: [],
            parent: null,
            sortButtons: [],
            filterButtons: [],
            filterToggleButtons: [],
            multiMixButtons: [],
            allButtons: []
        },

        _id: '',
        _isMixing: false,
        _isClicking: false,
        _isLoading: true,
        _targets: [],
        _origOrder: [],
        _toggleArray: [],
        _toggleString: '',
        _staggerDuration: 0,
        _incPadding: true,
        _targetsMoved: 0,
        _targetsImmovable: 0,
        _targetsBound: 0,
        _targetsDone: 0,
        _userPromise: null,
        _userCallback: null,
        _effectsIn: null,
        _effectsOut: null,
        _transformIn: [],
        _transformOut: [],
        _queue: [],
        handler: null,
        _state: null,
        _lastOperation: null,
        _lastClicked: null,
        _vendor: ''
    });

    self._execAction('_constructor', 1);

    h.seal(this);
    h.seal(this.selectors);
    h.seal(this.animation);
    h.seal(this.callbacks);
    h.seal(this.controls);
    h.seal(this.layout);
    h.seal(this.load);
    h.seal(this.libraries);
    h.seal(this.debug);
    h.seal(this._dom);
};

/**
 * mixitup.Mixer.prototype
 * @since       3.0.0
 * @prototype
 * @extends     {mixitup.basePrototype}
 */

mixitup.Mixer.prototype = Object.create(mixitup.basePrototype);

h.extend(mixitup.Mixer.prototype, {
    constructor: mixitup.Mixer,

    _actions: {},
    _filters: {},

    _transformProp: 'transform',
    _transformRule: 'transform',
    _transitionProp: 'transition',
    _perspectiveProp: 'perspective',
    _perspectiveOriginProp: 'perspectiveOrigin',

    _tweenable: [
        'opacity',
        'width', 'height',
        'marginRight', 'marginBottom',
        'x', 'y',
        'scale',
        'translateX', 'translateY', 'translateZ',
        'rotateX', 'rotateY', 'rotateZ'
    ],

    _transformDefaults: {
        scale: {
            value: 0.01,
            unit: ''
        },
        translateX: {
            value: 20,
            unit: 'px'
        },
        translateY: {
            value: 20,
            unit: 'px'
        },
        translateZ: {
            value: 20,
            unit: 'px'
        },
        rotateX: {
            value: 90,
            unit: 'deg'
        },
        rotateY: {
            value: 90,
            unit: 'deg'
        },
        rotateZ: {
            value: 180,
            unit: 'deg'
        }
    },

    _is: {},
    has: {},

    _instances: {},

    handled: {
        _filterToggle: {},
        _multimix: {},
        _filter: {},
        _sort: {}
    },

    _bound: {
        _filterToggle: {},
        _multimix: {},
        _filter: {},
        _sort: {}
    },

    /**
     * _featureDetect
     * @private
     * @since 2.0.0
     *
     * Performs all neccessary feature detection on evalulation
     */

    _featureDetect: function() {
        var self                = this,
            testEl              = document.createElement('div'),
            vendorsTrans        = ['Webkit', 'Moz', 'O', 'ms'],
            vendorsRAF          = ['webkit', 'moz'],
            transitionPrefix    = h.getPrefix(testEl, 'Transition', vendorsTrans),
            transformPrefix     = h.getPrefix(testEl, 'Transform', vendorsTrans),
            i                   = -1;

        self._execAction('_featureDetect', 0);

        self._vendor = transformPrefix; // TODO: this is only used for box-sizing, make a seperate test

        mixitup.Mixer.prototype.has._promises      = typeof Promise === 'function';
        mixitup.Mixer.prototype.has._transitions   = transitionPrefix !== 'unsupported';
        mixitup.Mixer.prototype._is._crapIe         = window.atob ? false : true;

        mixitup.Mixer.prototype._transitionProp =
            transitionPrefix ? transitionPrefix + 'Transition' : 'transition';

        mixitup.Mixer.prototype._transformProp =
            transformPrefix ? transformPrefix + 'Transform' : 'transform';

        mixitup.Mixer.prototype._transformRule =
            transformPrefix ? '-' + transformPrefix + '-transform' : 'transform';

        mixitup.Mixer.prototype._perspectiveProp =
            transformPrefix ? transformPrefix + 'Perspective' : 'perspective';

        mixitup.Mixer.prototype._perspectiveOriginProp =
            transformPrefix ? transformPrefix + 'PerspectiveOrigin' : 'perspectiveOrigin';

        // Apply polyfills:

        // window.requestAnimationFrame

        for (i = 0; i < vendorsRAF.length && !window.requestAnimationFrame; i++) {
            window.requestAnimationFrame = window[vendorsRAF[i] + 'RequestAnimationFrame'];
        }

        // Element.nextElementSibling

        if (typeof testEl.nextElementSibling === 'undefined') {
            Object.defineProperty(Element.prototype, 'nextElementSibling', {
                get: function() {
                    var el = this.nextSibling;

                    while (el) {
                        if (el.nodeType === 1) {
                            return el;
                        }

                        el = el.nextSibling;
                    }

                    return null;
                }
            });
        }

        // Element.matches

        (function(ElementPrototype) {
            ElementPrototype.matches =
                ElementPrototype.matches ||
                ElementPrototype.machesSelector ||
                ElementPrototype.mozMatchesSelector ||
                ElementPrototype.msMatchesSelector ||
                ElementPrototype.oMatchesSelector ||
                ElementPrototype.webkitMatchesSelector ||
                function (selector) {
                    var node = this,
                        nodes = (node.parentNode || node.doc).querySelectorAll(selector),
                        i = -1;

                    while (nodes[++i] && nodes[i] != node) {
                        return !!nodes[i];
                    }
                };
        })(Element.prototype);

        self._execAction('_featureDetect', 1);
    },

    /**
     * _init
     * @private
     * @since   2.0.0
     * @param   {Element}   el
     * @param   {object}    config
     * @void
     */

    _init: function(el, config) {
        var self            = this,
            state           = new mixitup.State(),
            operation       = new mixitup.Operation();

        self._execAction('_init', 0, arguments);

        config && h.extend(self, config);

        self._cacheDom(el);

        self.layout.containerClass && h.addClass(el, self.layout.containerClass);

        self.animation.enable = self.animation.enable && mixitup.Mixer.prototype.has._transitions;

        self._indexTargets();

        state.activeFilter = self.load.filter === 'all' ?
            self.selectors.target :
            self.load.filter === 'none' ?
                '' :
                self.load.filter;

        state.activeSort = self.load.sort;
        state.activeContainerClass = self.layout.containerClass;
        state.activeDisplay = self.layout.display;

        if (state.activeSort) {
            // Perform a syncronous sort without an operation

            operation.startSortString   = 'default:asc';
            operation.startOrder        = self._targets;
            operation.newSort           = self._parseSort(state.activeSort);
            operation.newSortString     = state.activeSort;

            self._sort(operation);

            self._printSort(false, operation);

            self._targets = operation.newOrder;
        }

        self._updateControls({
            filter: state.activeFilter,
            sort: state.activeSort
        });

        self._parseEffects();

        self._bindEvents();

        self._state = state;

        if (self._dom.filterToggleButtons.length) {
            // TODO: what about live toggles? is it worth trawling the dom?

            self._buildToggleArray();
        }

        self._execAction('_init', 1, arguments);
    },

    /**
     * _cacheDom
     * @private
     * @since   3.0.0
     * @void
     *
     * Cache references of all neccessary DOM elements
     */

    _cacheDom: function(el) {
        var self = this;

        self._execAction('_cacheDom', 0, arguments);

        self._dom.body      = self._dom.documentgetElementsByTagName('body')[0];
        self._dom.container = el;
        self._dom.parent    = el;

        self._dom.sortButtons =
            Array.prototype.slice.call(self._dom.documentquerySelectorAll(self.selectors.sort));

        self._dom.filterButtons =
            Array.prototype.slice.call(self._dom.documentquerySelectorAll(self.selectors.filter));

        self._dom.filterToggleButtons =
            Array.prototype.slice.call(self._dom.documentquerySelectorAll(self.selectors.filterToggle));

        self._dom.multiMixButtons =
            Array.prototype.slice.call(self._dom.documentquerySelectorAll(self.selectors.multiMix));

        self._dom.allButtons = self._dom.filterButtons
            .concat(self._dom.sortButtons)
            .concat(self._dom.filterToggleButtons)
            .concat(self._dom.multiMixButtons);

        self._execAction('_cacheDom', 1, arguments);
    },

    /**
     * _indexTargets
     * @private
     * @since   3.0.0
     * @void
     *
     * Index matching children of the container, and
     * instantiate mixitup.Target instances for each one
     */

    _indexTargets: function() {
        var self    = this,
            target  = null,
            el      = null,
            i       = -1;

        self._execAction('_indexTargets', 0, arguments);

        self._dom.targets = self.layout.allowNestedTargets ?
            self._dom.container.querySelectorAll(self.selectors.target) :
            h.children(self._dom.container, self.selectors.target, self._dom.document);

        self._dom.targets = Array.prototype.slice.call(self._dom.targets);

        // TODO: allow querying of all descendants via config option, allowing for nested parent

        self._targets = [];

        if (self._dom.targets.length) {
            for (i = 0; el = self._dom.targets[i]; i++) {
                target = new mixitup.Target();

                target._init(el, self);

                self._targets.push(target);
            }

            self._dom.parent = self._dom.targets[0].parentElement.isEqualNode(self._dom.container) ?
                self._dom.container :
                self._dom.targets[0].parentElement;
        }

        self._origOrder = self._targets;

        self._execAction('_indexTargets', 1, arguments);
    },

    /**
     * _bindEvents
     * @private
     * @since   3.0.0
     * @void
     */

    _bindEvents: function() {
        var self            = this,
            proto           = mixitup.Mixer.prototype,
            filterToggles   = proto._bound._filterToggle,
            multimixs       = proto._bound._multimix,
            filters         = proto._bound._filter,
            sorts           = proto._bound._sort,
            button          = null,
            i               = -1;

        self._execAction('_bindEvents', 0);

        self.handler = function(e) {
            return self._eventBus(e);
        };

        if (self.controls.live) {
            h.on(window, 'click', self.handler);
        } else {
            for (i = 0; button = self._dom.allButtons[i]; i++) {
                h.on(button, 'click', self.handler);
            }
        }

        // For each mixitup.Mixer instance, increment the bound value for each button type

        // TODO: could be much DRYer

        filterToggles[self.selectors.filterToggle] =
            (typeof filterToggles[self.selectors.filterToggle] === 'undefined') ?
                1 : filterToggles[self.selectors.filterToggle] + 1;

        multimixs[self.selectors.filter] =
            (typeof multimixs[self.selectors.filter] === 'undefined') ?
                1 : multimixs[self.selectors.multimix] + 1;

        filters[self.selectors.filter] =
            (typeof filters[self.selectors.filter] === 'undefined') ?
                1 : filters[self.selectors.filter] + 1;

        sorts[self.selectors.sort] =
            (typeof sorts[self.selectors.sort] === 'undefined') ?
                1 : sorts[self.selectors.sort] + 1;

        self._execAction('_bindEvents', 1);
    },

    /**
     * _unbindEvents
     * @private
     * @since   3.0.0
     * @void
     */

    _unbindEvents: function() {
        var self    = this,
            button  = null,
            i       = -1;

        self._execAction('_unbindEvents', 0);

        h.off(window, 'click', self.handler);

        for (i = 0; button = self._dom.allButtons[i]; i++) {
            h.on(button, 'click', self.handler);
        }

        self._execAction('_unbindEvents', 1);
    },

    /**
     * _eventBus
     * @private
     * @param   {object}            e
     * @return  {(Boolean|void)}
     */

    _eventBus: function(e) {
        var self = this;

        switch(e.type) {
            case 'click':
                return self.handleClick(e);
        }
    },

    /**
     * handleClick
     * @private
     * @since   3.0.0
     * @param   {object}    button
     * @param   {string}    type
     * @void
     *
     * Determines the type of operation needed and the
     * appropriate parameters when a button is clicked
     */

    handleClick: function(e) {
        var self            = this,
            selectors       = [],
            selector        = '',
            toggleSeperator = self.controls.toggleLogic === 'or' ? ',' : '',
            button          = null,
            command         = {},
            filterString    = '',
            sortString      = '',
            method          = '',
            isTogglingOff   = false,
            el              = null,
            key             = '',
            i               = -1;

        self._execAction('handleClick', 0, arguments);

        for (key in self.selectors) {
            selectors.push(self.selectors[key]);
        }

        selector = selectors.join(',');

        button = h.closestParent(
            e.target,
            selector,
            true,
            Infinity,
            self._dom.document
        );

        if (!button) return;

        if (typeof self.callbacks.onMixClick === 'function') {
            self.callbacks.onMixClick.call(button, self._state, self);

            // TODO: trigger event
        }

        if (
            self._isMixing &&
            (!self.animation.queue || self._queue.length >= self.animation.queueLimit)
        ) {
            if (typeof self.callbacks.onMixBusy === 'function') {
                self.callbacks.onMixBusy.call(self._dom.container, self._state, self);

                // TODO: trigger event
            }

            self._execAction('handleClickBusy', 1, arguments);

            return;
        }

        self._isClicking = true;

        if (button.matches(self.selectors.sort)) {

            // sort

            sortString = button.getAttribute('data-sort');

            if (
                !h.hasClass(button, self.controls.activeClass) ||
                sortString.indexOf('random') > -1
            ) {
                method = 'sort';

                for (i = 0; el = self._dom.sortButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                command = {
                    sort: sortString
                };
            } else {
                return;
            }
        } else if (button.matches(self.selectors.filter)) {

            // filter

            if (!h.hasClass(button, self.controls.activeClass)) {
                method = 'filter';

                for (i = 0; el = self._dom.filterButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                for (i = 0; el = self._dom.filterToggleButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                command = {
                    filter: button.getAttribute('data-filter')
                };
            } else {
                return;
            }
        } else if (button.matches(self.selectors.filterToggle)) {

            // filterToggle

            filterString    = button.getAttribute('data-filter');
            method          = 'filterToggle';

            for (i = 0; el = self._dom.filterButtons[i]; i++) {
                h.removeClass(el, self.controls.activeClass);
            }

            for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
                h.removeClass(el, self.controls.activeClass);
            }

            self._buildToggleArray();

            if (!h.hasClass(button, self.controls.activeClass)) {
                self._toggleArray.push(filterString);
            } else {
                self._toggleArray.splice(self._toggleArray.indexOf(filterString), 1);

                isTogglingOff = true;
            }

            self._toggleArray = h.clean(self._toggleArray);

            self._toggleString = self._toggleArray.join(toggleSeperator);

            if (self._toggleString === '') {
                self._toggleString = self.controls.toggleDefault;

                command = {
                    filter: self._toggleString
                };

                self._updateControls(command);
            } else {
                command = {
                    filter: self._toggleString
                };
            }
        } else if (button.matches(self.selectors.multiMix)) {

            // multiMix

            if (!h.hasClass(button, self.controls.activeClass)) {
                method = 'multiMix';

                for (i = 0; el = self._dom.filterButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                for (i = 0; el = self._dom.filterToggleButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                for (i = 0; el = self._dom.sortButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
                    h.removeClass(el, self.controls.activeClass);
                }

                command = {
                    sort: button.getAttribute('data-sort'),
                    filter: button.getAttribute('data-filter')
                };
            } else {
                return;
            }
        }

        if (method) {
            self._trackClick(button, method, isTogglingOff);

            self.multiMix(command);
        }

        self._execAction('handleClick', 1, arguments);
    },

    /**
     * _trackClick
     * @private
     * @since   3.0.0
     * @param   {Element}   button
     * @param   {string}    method
     * @param   {boolean}   isTogglingOff
     * @void
     */

    _trackClick: function(button, method, isTogglingOff) {
        var self        = this,
            proto       = mixitup.Mixer.prototype,
            selector    = self.selectors[method];

        self._lastClicked = button;

        // Add the active class to a button only once
        // all mixitup.Mixer instances have handled the click

        method = '_' + method;

        proto.handled[method][selector] =
            (typeof proto.handled[method][selector] === 'undefined') ?
                1 : proto.handled[method][selector] + 1;

        if (
            proto.handled[method][selector] ===
            proto._bound[method][selector]
        ) {
            h[(isTogglingOff ? 'remove' : 'add') + 'Class'](button, self.controls.activeClass);

            delete proto.handled[method][selector];
        }
    },

    /**
     * _buildToggleArray
     * @private
     * @since   2.0.0
     * @void
     *
     * Combines the selectors of toggled buttons into an array
     */

    _buildToggleArray: function() {
        var self = this,
            activeFilter = self._state.activeFilter.replace(/\s/g, ''),
            filter = '',
            i = -1;

        activeFilter = activeFilter === self.selectors.target ? '' : activeFilter;

        self._execAction('_buildToggleArray', 0, arguments);

        if (self.controls.toggleLogic === 'or') {
            self._toggleArray = activeFilter.split(',');
        } else {
            self._toggleArray = activeFilter.split('.');

            !self._toggleArray[0] && self._toggleArray.shift();

            for (i = 0; filter = self._toggleArray[i]; i++) {
                self._toggleArray[i] = '.' + filter;
            }
        }

        self._toggleArray = h.clean(self._toggleArray);

        self._execAction('_buildToggleArray', 1, arguments);
    },

    /**
     * _updateControls
     * @private
     * @since   2.0.0
     * @param   {object} command
     * @void
     *
     * Updates buttons to their active/deactive state based
     * on the current state of the instance
     */

    _updateControls: function(command) {
        var self                = this,
            output              = {
                filter: command.filter,
                sort: command.sort
            },
            filterToggleButton  = null,
            activeButton        = null,
            button              = null,
            selector            = '',
            i                   = -1,
            j                   = -1,
            k                   = -1;

        self._execAction('_updateControls', 0, arguments);

        (typeof command.filter === 'undefined') && (output.filter = self._state.activeFilter);
        (typeof command.sort === 'undefined') && (output.sort = self._state.activeSort);
        (output.filter === self.selectors.target) && (output.filter = 'all');

        for (i = 0; button = self._dom.sortButtons[i]; i++) {
            h.removeClass(button, self.controls.activeClass);

            if (button.matches('[data-sort="' + output.sort + '"]')) {
                h.addClass(button, self.controls.activeClass);
            }
        }

        for (i = 0; button = self._dom.filterButtons[i]; i++) {
            h.removeClass(button, self.controls.activeClass);

            if (button.matches('[data-filter="' + output.filter + '"]')) {
                h.addClass(button, self.controls.activeClass);
            }
        }

        for (i = 0; button = self._dom.multiMixButtons[i]; i++) {
            h.removeClass(button, self.controls.activeClass);

            if (
                button.matches('[data-sort="' + output.sort + '"]') &&
                button.matches('[data-filter="' + output.filter + '"]')
            ) {
                h.addClass(button, self.controls.activeClass);
            }
        }

        if (self._toggleArray.length) {
            if (output.filter === 'none' || output.filter === '') {
                for (i = 0; button = self._dom.filterToggleButtons[i]; i++) {
                    h.removeClass(button, self.controls.activeClass);
                }
            }

            for (j = 0; selector = self._toggleArray[j]; j++) {
                activeButton = null;

                if (self.controls.live) {
                    activeButton = self._dom.document
                        .querySelector(self.selectors.filterToggle + '[data-filter="' + selector + '"]');
                } else {
                    for (k = 0; filterToggleButton = self._dom.filterToggleButtons[k]; k++) {
                        if (filterToggleButton.matches('[data-filter="' + selector + '"]')) {
                            activeButton = filterToggleButton;
                        }
                    }
                }

                if (activeButton) {
                    h.addClass(activeButton, self.controls.activeClass);
                }
            }
        }

        self._execAction('_updateControls', 1, arguments);
    },

    /**
     * _insert
     * @private
     * @since   3.0.0
     * @param   {object}        command
     * @param   {Operation}     operation
     * @param   {*[]}           arguments
     * @return  {Promise} ->    {State}
     */

    _insert: function(command, operation) {
        var self        = this,
            nextSibling = self._getNextSibling(command.index, command.sibling, command.position),
            frag        = self._dom.documentcreateDocumentFragment(),
            target      = null,
            el          = null,
            i           = -1;

        self._execAction('insert', 0, arguments);

        if (command.targets) {
            for (i = 0; el = command.targets[i]; i++) {
                if (self._dom.targets.indexOf(el) > -1) {
                    throw new Error('[MixItUp] An inserted element already exists in the container');
                }

                frag.appendChild(el);
                frag.appendChild(self._dom.documentcreateTextNode(' '));

                if (!h.isElement(el, self._dom.document) || !el.matches(self.selectors.target)) continue;

                target = new mixitup.Target();

                target._init(el, self);

                self._targets.splice(command.index, 0, target);

                command.index++;
            }

            self._dom.parent.insertBefore(frag, nextSibling);
        }

        // Since targets have been added, the original order must be updated

        operation.startOrder = self._origOrder = self._targets;

        self._execAction('insert', 1, arguments);
    },

    /**
     * _getNextSibling
     * @private
     * @since   3.0.0
     * @param   {Number}      [index]
     * @param   {Element}     [sibling]
     * @param   {string}      [position]
     */

    _getNextSibling: function(index, sibling, position) {
        var self = this;

        if (sibling) {
            if (position === 'before') {
                return sibling;
            } else if (position === 'after') {
                return sibling.nextElementSibling || null;
            }
        }

        if (typeof self._targets.length && index !== 'undefined') {
            return (index < self._targets.length || !self._targets.length) ?
                self._targets[index]._dom.el :
                self._targets[self._targets.length - 1]._dom.el.nextElementSibling;
        } else {
            return self._dom.parent.children.length ? self._dom.parent.children[0] : null;
        }
    },

    /**
     * _filter
     * @private
     * @since 2.0.0
     * @param   {Operation}     operation
     * @void
     */

    _filter: function(operation) {
        var self        = this,
            condition   = false,
            index       = -1,
            target      = null,
            i           = -1;

        self._execAction('_filter', 0, arguments);

        for (i = 0; target = operation.newOrder[i]; i++) {
            if (typeof operation.newFilter === 'string') {
                // show via selector

                condition = operation.newFilter === '' ?
                    false : target._dom.el.matches(operation.newFilter);

                self._evaluateHideShow(condition, target, false, operation);
            } else if (
                typeof operation.newFilter === 'object' &&
                h.isElement(operation.newFilter, self._dom.document)
            ) {
                // show via element

                self._evaluateHideShow(target._dom.el === operation.newFilter, target, false, operation);
            } else if (
                typeof operation.newFilter === 'object' &&
                operation.newFilter.length
            ) {
                // show via collection

                self._evaluateHideShow(operation.newFilter.indexOf(target._dom.el) > -1, target, false, operation);
            }
        }

        operation.matching = operation.show.slice();

        if (operation.toRemove.length) {
            for (i = 0; target = operation.show[i]; i++) {
                if (operation.toRemove.indexOf(target) > -1) {
                    // If any shown targets should be removed, move them into the toHide array

                    operation.show.splice(i, 1);

                    if ((index = operation.toShow.indexOf(target)) > -1) {
                        operation.toShow.splice(index, 1);
                    }

                    operation.toHide.push(target);
                    operation.hide.push(target);

                    i--;
                }
            }
        }

        self._execAction('_filter', 1, arguments);
    },

    /**
     * _evaluateHideShow
     * @private
     * @since   3.0.0
     * @param   {boolean}   condition
     * @param   {Element}   target
     * @param   {boolean}   isRemoving
     * @param   {Operation} operation
     * @void
     */

    _evaluateHideShow: function(condition, target, isRemoving, operation) {
        var self = this;

        if (condition) {
            if (isRemoving && typeof operation.startFilter === 'string') {
                self._evaluateHideShow(target._dom.el.matches(operation.startFilter), target, false, operation);
            } else {
                operation.show.push(target);

                !target._isShown && operation.toShow.push(target);
            }
        } else {
            operation.hide.push(target);

            target._isShown && operation.toHide.push(target);
        }
    },

    /**
     * _sort
     * @private
     * @since 2.0.0
     * @param   {Operation}     operation
     * @void
     */

    _sort: function(operation) {
        var self = this;

        self._execAction('_sort', 0, arguments);

        operation.startOrder = self._targets;

        switch (operation.newSort[0].sortBy) {
            case 'default':
                operation.newOrder = self._origOrder.slice();

                if (operation.newSort[0].order === 'desc') {
                    operation.newOrder.reverse();
                }

                break;
            case 'random':
                operation.newOrder = h.arrayShuffle(operation.startOrder);

                break;
            case 'custom':
                operation.newOrder = operation.newSort[0].order;

                break;
            default:
                operation.newOrder = operation.startOrder
                    .slice()
                    .sort(function(a, b) {
                        return self._compare(a, b, 0, operation.newSort);
                    });
        }

        if (h.isEqualArray(operation.newOrder, operation.startOrder)) {
            operation.willSort = false;
        }

        self._execAction('_sort', 1, arguments);
    },

    /**
     * _compare
     * @private
     * @since   2.0.0
     * @param   {String|Number}     a
     * @param   {String|Number}     b
     * @param   {Number}            depth
     * @param   {ParsedSort}        sort
     * @return  {Number}
     */

    _compare: function(a, b, depth, sort) {
        depth = depth ? depth : 0;

        var self        = this,
            order       = sort[depth].order,
            attrA       = self._getAttributeValue(a, depth, sort),
            attrB       = self._getAttributeValue(b, depth, sort);

        if (isNaN(attrA * 1) || isNaN(attrB * 1)) {
            attrA = attrA.toLowerCase();
            attrB = attrB.toLowerCase();
        } else {
            attrA = attrA * 1;
            attrB = attrB * 1;
        }

        if (attrA < attrB) {
            return order === 'asc' ? -1 : 1;
        }

        if (attrA > attrB) {
            return order === 'asc' ? 1 : -1;
        }

        if (attrA === attrB && sort.length > depth + 1) {
            return self._compare(a, b, depth + 1, sort);
        }

        return 0;
    },

    /**
     * _getAttributeValue
     * @private
     * @since   3.0.0
     * @param   {Element}           target
     * @param   {ParsedSort}        [sort]
     * @return  {(String|Number)}
     *
     * Reads the values of sort attributes
     */

    _getAttributeValue: function(target, depth, sort) {
        var self    = this,
            value   = '';

        sort = sort ? sort : self._newSort;

        value = target._dom.el.getAttribute('data-' + sort[depth].sortBy);

        if (value === null) {
            if (h.canReportErrors(self)) {
                // Encourage users to assign values to all
                // targets to avoid erroneous sorting when
                // types are mixed

                console.warn(
                    '[MixItUp] The attribute "data-' +
                    self._newSort[depth].sortBy +
                    '" was not present on one or more target elements'
                );
            }
        }

        // If an attribute is not present, return 0 as a safety value

        return value || 0;
    },

    /**
     * _printSort
     * @private
     * @since   2.0.0
     * @param   {boolean}   isResetting
     * @param   {Operation} operation
     * @void
     *
     * Inserts elements into the DOM in the appropriate
     * order using a document fragment for minimal
     * DOM thrashing
     */

    _printSort: function(isResetting, operation) {
        var self        = this,
            order       = isResetting ? operation.startOrder : operation.newOrder,
            targets     = h.children(self._dom.parent, self.selectors.target, self._dom.document),
            nextSibling = targets.length ? targets[targets.length - 1].nextElementSibling : null,
            frag        = self._dom.documentcreateDocumentFragment(),
            target      = null,
            whiteSpace  = null,
            el          = null,
            i           = -1;

        self._execAction('_printSort', 0, arguments);

        for (i = 0; el = targets[i]; i++) {
            // Empty the container

            whiteSpace = el.nextSibling;

            if (el.style.position === 'absolute') continue;

            if (whiteSpace && whiteSpace.nodeName === '#text') {
                self._dom.parent.removeChild(whiteSpace);
            }

            self._dom.parent.removeChild(el);
        }

        for (i = 0; target = order[i]; i++) {
            // Add targets into a document fragment

            el = target._dom.el;

            frag.appendChild(el);
            frag.appendChild(self._dom.documentcreateTextNode(' '));
        }

        // Insert the document fragment into the container
        // before any other non-target elements

        nextSibling ?
            self._dom.parent.insertBefore(frag, nextSibling) :
            self._dom.parent.appendChild(frag);

        self._execAction('_printSort', 1, arguments);
    },

    /**
     * _parseSort
     * @private
     * @since   2.0.0
     * @param   {string}    sortString
     * @return  {String[]}
     *
     * Parse user-defined sort strings into useable values
     * or "rules"
     */

    _parseSort: function(sortString) {
        var self        = this,
            rules       = typeof sortString === 'string' ? sortString.split(' ') : [sortString],
            newSort     = [],
            ruleObj     = null,
            rule        = [],
            i           = -1;

        for (i = 0; i < rules.length; i++) {
            rule = typeof sortString === 'string' ? rules[i].split(':') : ['custom', rules[i]];
            ruleObj = {
                sortBy: h.camelCase(rule[0]),
                order: rule[1] || 'asc'
            };

            newSort.push(ruleObj);

            if (ruleObj.sortBy === 'default' || ruleObj.sortBy === 'random') break;
        }

        return self._execFilter('_parseSort', newSort, arguments);
    },

    /**
     * _parseEffects
     * @private
     * @since   2.0.0
     * @void
     *
     * Parse the user-defined effects string into values
     * and units, and create transform strings
     */

    _parseEffects: function() {
        var self            = this,
            transformName   = '',
            effectsIn       = self.animation.effectsIn || self.animation.effects,
            effectsOut      = self.animation.effectsOut || self.animation.effects;

        self._effectsIn      = new mixitup.StyleData();
        self._effectsOut     = new mixitup.StyleData();
        self._transformIn    = [];
        self._transformOut   = [];

        self._effectsIn.opacity = self._effectsOut.opacity = 1;

        self._parseEffect('fade', effectsIn, self._effectsIn, self._transformIn);
        self._parseEffect('fade', effectsOut, self._effectsOut, self._transformOut, true);

        for (transformName in self._transformDefaults) {
            self._parseEffect(transformName, effectsIn, self._effectsIn, self._transformIn);
            self._parseEffect(transformName, effectsOut, self._effectsOut, self._transformOut, true);
        }

        self._parseEffect('stagger', effectsIn, self._effectsIn, self._transformIn);
        self._parseEffect('stagger', effectsOut, self._effectsOut, self._transformOut, true);
    },

    /**
     * _parseEffect
     * @private
     * @since   2.0.0
     * @param   {string}    effectName
     * @param   {string}    effectString
     * @param   {StyleData} effects
     * @param   {String[]}  transform
     * @param   {boolean}   [isOut]
     */

    _parseEffect: function(effectName, effectString, effects, transform, isOut) {
        var self        = this,
            re          = /\(([^)]+)\)/,
            propIndex   = -1,
            str         = '',
            match       = [],
            val         = '',
            units       = ['%', 'px', 'em', 'rem', 'vh', 'vw', 'deg'],
            unit        = '',
            i           = -1;

        if (!effectString || typeof effectString !== 'string') {
            throw new Error('[MixItUp] Invalid effects string');
        }

        if (effectString.indexOf(effectName) < 0) {
            // The effect is not present in the effects string

            return;
        }

        // The effect is present

        propIndex = effectString.indexOf(effectName + '(');

        // TODO: Can we improve the logic below for DRYness?

        if (propIndex > -1) {
            // The effect has a user defined value in parentheses

            // Extract from the first parenthesis to the end of string

            str = effectString.substring(propIndex);

            // Match any number of characters between "(" and ")"

            match = re.exec(str);

            val = match[1];

            switch (effectName) {
                case 'fade':
                    effects.opacity = parseFloat(val);

                    break;
                case 'stagger':
                    self._staggerDuration = parseFloat(val);

                    // NB: Currently stagger must be applied globally

                    break;
                default:
                    // Transforms

                    for (i = 0; unit = units[i]; i++) {
                        if (val.indexOf(unit) > -1) {
                            effects[effectName].unit = unit;

                            break;
                        }
                    }

                    if (isOut && self.animation.reverseOut && effectName !== 'scale') {
                        effects[effectName].value = parseFloat(val) * -1;
                    } else {
                        effects[effectName].value = parseFloat(val);
                    }

                    transform.push(effectName + '(' + effects[effectName].value + effects[effectName].unit + ')');
            }
        } else {
            // Else, use the default value for the effect

            switch (effectName) {
                case 'fade':
                    effects.opacity = 0;

                    break;
                case 'stagger':
                    self._staggerDuration = 100;

                    break;
                default:
                    // Transforms

                    if (isOut && self.animation.reverseOut && effectName !== 'scale') {
                        effects[effectName].value = self._transformDefaults[effectName].value;
                    } else {
                        effects[effectName].value = self._transformDefaults[effectName].value * -1;
                    }

                    effects[effectName].unit = self._transformDefaults[effectName].unit;

                    transform.push(effectName + '(' + effects[effectName].value + effects[effectName].unit + ')');
            }
        }
    },

    /**
     * _buildState
     * @private
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {State}
     */

    _buildState: function(operation) {
        var self        = this,
            state       = new mixitup.State(),
            target      = null,
            i           = -1;

        self._execAction('_buildState', 0);

        // Map target elements into state arrays.
        // the real target objects should never be exposed

        for (i = 0; target = self._targets[i]; i++) {
            state.targets.push(target._dom.el);
        }

        for (i = 0; target = operation.matching[i]; i++) {
            state.matching.push(target._dom.el);
        }

        for (i = 0; target = operation.show[i]; i++) {
            state.show.push(target._dom.el);
        }

        for (i = 0; target = operation.hide[i]; i++) {
            state.hide.push(target._dom.el);
        }

        state.activeFilter         = operation.newFilter;
        state.activeSort           = operation.newSortString;
        state.activeContainerClass = operation.newContainerClass;
        state.activeDisplay        = operation.newDisplay || self.layout.display;
        state.hasFailed            = !operation.matching.length && operation.newFilter !== '';
        state.totalTargets         = self._targets.length;
        state.totalShow            = operation.show.length;
        state.totalHide            = operation.hide.length;
        state.totalMatching        = operation.matching.length;
        state.triggerElement       = self._lastClicked;

        return self._execFilter('_buildState', state, arguments);
    },

    /**
     * _goMix
     * @private
     * @since   2.0.0
     * @param   {boolean}   shouldAnimate
     * @param   {Operation} operation
     * @void
     */

    _goMix: function(shouldAnimate, operation) {
        var self            = this;

        self._execAction('_goMix', 0, arguments);

        // If the animation duration is set to 0ms,
        // Or the container is hidden
        // then abort animation

        if (
            !self.animation.duration ||
            !h.isVisible(self._dom.container)
        ) {
            shouldAnimate = false;
        }

        if (
            !operation.toShow.length &&
            !operation.toHide.length &&
            !operation.willSort &&
            !operation.willChangeLayout
        ) {
            // If nothing to show or hide, and not sorting or
            // changing layout

            shouldAnimate = false;
        }

        if (
            !operation.startState.show.length &&
            !operation.show.length
        ) {
            // If nothing currently shown, nothing to show

            shouldAnimate = false;
        }

        if (
            !self._userPromise ||
            self._userPromise.isResolved
        ) {
            // If no promise exists, then assign one

            self._userPromise = h.getPromise(self.libraries);
        }

        if (typeof self.callbacks.onMixStart === 'function') {
            self.callbacks.onMixStart.call(self._dom.container, operation.startState, operation.newState, self);
        }

        h.triggerCustom(self._dom.container, 'mixStart', {
            state: operation.startState,
            futureState: operation.newState,
            instance: self
        }, self._dom.document);

        if (shouldAnimate && mixitup.Mixer.prototype.has._transitions) {
            // If we should animate and the platform supports
            // transitions, go for it

            self._isMixing = true;

            if (window.pageYOffset !== operation.docState.scrollTop) {
                window.scrollTo(operation.docState.scrollLeft, operation.docState.scrollTop);
            }

            self._dom.parent.style[mixitup.Mixer.prototype._perspectiveProp] = self.animation.perspective;
            self._dom.parent.style[mixitup.Mixer.prototype._perspectiveOriginProp] = self.animation.perspectiveOrigin;

            if (self.animation.animateResizeContainer) {
                self._dom.parent.style.height = operation.startHeight + 'px';
                self._dom.parent.style.width = operation.startWidth + 'px';
            }

            requestAnimationFrame(function() {
                self._moveTargets(operation);
            });
        } else {
            // Abort

            self._cleanUp(operation);
        }

        self._execAction('_goMix', 1, arguments);

        return self._userPromise.promise;
    },

    /**
     * _getStartMixData
     * @private
     * @since   2.0.0
     * @param   {Operation}     operation
     * @void
     */

    _getStartMixData: function(operation) {
        var self        = this,
            parentStyle = window.getComputedStyle(self._dom.parent),
            parentRect  = self._dom.parent.getBoundingClientRect(),
            target      = null,
            data        = {},
            i           = -1,
            boxSizing   = parentStyle.boxSizing || parentStyle[self._vendor + 'BoxSizing'];

        self._incPadding = (boxSizing === 'border-box');

        self._execAction('_getStartMixData', 0);

        for (i = 0; target = operation.show[i]; i++) {
            data = target._getPosData();

            operation.showPosData[i] = {
                startPosData: data
            };
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            data = target._getPosData();

            operation.toHidePosData[i] = {
                startPosData: data
            };
        }

        operation.startHeight = self._incPadding ?
            parentRect.height :
            parentRect.height -
                parseFloat(parentStyle.paddingTop) -
                parseFloat(parentStyle.paddingBottom) -
                parseFloat(parentStyle.borderTop) -
                parseFloat(parentStyle.borderBottom);

        operation.startWidth = self._incPadding ?
            parentRect.width :
            parentRect.width -
                parseFloat(parentStyle.paddingLeft) -
                parseFloat(parentStyle.paddingRight) -
                parseFloat(parentStyle.borderLeft) -
                parseFloat(parentStyle.borderRight);

        self._execAction('_getStartMixData', 1);
    },

    /**
     * _setInter
     * @private
     * @since   2.0.0
     * @param   {Operation}     operation
     * @void
     */

    _setInter: function(operation) {
        var self    = this,
            target  = null,
            i       = -1;

        self._execAction('_setInter', 0);

        for (i = 0; target = operation.toShow[i]; i++) {
            target._show(operation.willChangeLayout ? operation.newDisplay : self.layout.display);
        }

        if (operation.willChangeLayout) {
            h.removeClass(self._dom.container, operation.startContainerClass);
            h.addClass(self._dom.container, operation.newContainerClass);
        }

        self._execAction('_setInter', 1);
    },

    /**
     * _getInterMixData
     * @private
     * @since   2.0.0
     * @param   {Operation}     operation
     * @void
     */

    _getInterMixData: function(operation) {
        var self    = this,
            target  = null,
            i       = -1;

        self._execAction('_getInterMixData', 0);

        if (operation) {
            for (i = 0; target = operation.show[i]; i++) {
                operation.showPosData[i].interPosData = target._getPosData();
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                operation.toHidePosData[i].interPosData = target._getPosData();
            }

            self._execAction('_getInterMixData', 1);

            return;
        }

        for (i = 0; target = self._show[i]; i++) {
            target._interPosData = target._getPosData();
        }

        for (i = 0; target = self._toHide[i]; i++) {
            target._interPosData = target._getPosData();
        }
    },

    /**
     * _setFinal
     * @private
     * @since   2.0.0
     * @param   {Operation}     operation
     * @void
     */

    _setFinal: function(operation) {
        var self    = this,
            target  = null,
            i       = -1;

        self._execAction('_setFinal', 0);

        operation.willSort && self._printSort(false, operation);

        for (i = 0; target = operation.toHide[i]; i++) {
            target.hide();
        }

        self._execAction('_setFinal', 1);
    },

    /**
     * _getFinalMixData
     * @private
     * @since   2.0.0
     * @param   {Operation}     operation
     * @void
     */

    _getFinalMixData: function(operation) {
        var self        = this,
            parentStyle = null,
            parentRect  = self._dom.parent.getBoundingClientRect(),
            target      = null,
            i           = -1;

        if (!self._incPadding) {
            parentStyle = window.getComputedStyle(self._dom.parent);
        }

        self._execAction('_getFinalMixData', 0, arguments);

        for (i = 0; target = operation.show[i]; i++) {
            operation.showPosData[i].finalPosData = target._getPosData();
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            operation.toHidePosData[i].finalPosData = target._getPosData();
        }

        operation.newHeight = self._incPadding ?
            parentRect.height :
            parentRect.height -
                parseFloat(parentStyle.paddingTop) -
                parseFloat(parentStyle.paddingBottom) -
                parseFloat(parentStyle.borderTop) -
                parseFloat(parentStyle.borderBottom);

        operation.newWidth = self._incPadding ?
            parentRect.width :
            parentRect.width -
                parseFloat(parentStyle.paddingLeft) -
                parseFloat(parentStyle.paddingRight) -
                parseFloat(parentStyle.borderLeft) -
                parseFloat(parentStyle.borderRight);

        if (operation.willSort) {
            self._printSort(true, operation);
        }

        for (i = 0; target = operation.toShow[i]; i++) {
            target.hide();
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            target._show(self.layout.display);
        }

        if (operation.willChangeLayout && self.animation.animateChangeLayout) {
            h.removeClass(self._dom.container, operation.newContainerClass);
            h.addClass(self._dom.container, self.layout.containerClass);
        }

        self._execAction('_getFinalMixData', 1, arguments);
    },

    /**
     *  _getTweenData
     * @private
     * @since    3.0.0
     * @param   {Operation}     operation
     */

    _getTweenData: function(operation) {
        var self        = this,
            target      = null,
            posData     = null,
            effectNames = Object.getOwnPropertyNames(self._effectsIn),
            effectName  = '',
            effect      = null,
            i           = -1,
            j           = -1;

        for (i = 0; target = operation.show[i]; i++) {
            posData             = operation.showPosData[i];
            posData.posIn       = new mixitup.StyleData();
            posData.posOut      = new mixitup.StyleData();
            posData.tweenData   = new mixitup.StyleData();

            // Process x and y

            posData.posIn.x     = target._isShown ? posData.startPosData.x - posData.interPosData.x : 0;
            posData.posIn.y     = target._isShown ? posData.startPosData.y - posData.interPosData.y : 0;
            posData.posOut.x    = posData.finalPosData.x - posData.interPosData.x;
            posData.posOut.y    = posData.finalPosData.y - posData.interPosData.y;

            // Process display

            posData.posIn.display   = target._isShown ? self.layout.display : 'none';
            posData.posOut.display  = self.layout.display;

            // Process opacity

            posData.posIn.opacity       = target._isShown ? 1 : self._effectsIn.opacity;
            posData.posOut.opacity      = 1;
            posData.tweenData.opacity   = posData.posOut.opacity - posData.posIn.opacity;

            // Adjust x and y if not nudging

            if (!target._isShown && !self.animation.nudgeOut) {
                posData.posIn.x = posData.posOut.x;
                posData.posIn.y = posData.posOut.y;
            }

            posData.tweenData.x = posData.posOut.x - posData.posIn.x;
            posData.tweenData.y = posData.posOut.y - posData.posIn.y;

            // Process width, height, and margins

            if (self.animation.animateResizeTargets) {
                posData.posIn.width     = posData.startPosData.width;
                posData.posIn.height    = posData.startPosData.height;

                if (posData.startPosData.width - posData.finalPosData.width) {
                    posData.posIn.marginRight =
                        -(posData.startPosData.width - posData.interPosData.width) +
                        (posData.startPosData.marginRight * 1);
                } else {
                    posData.posIn.marginRight = posData.startPosData.marginRight;
                }

                if (posData.startPosData.height - posData.finalPosData.height) {
                    posData.posIn.marginBottom =
                        -(posData.startPosData.height - posData.interPosData.height) +
                        (posData.startPosData.marginBottom * 1);
                } else {
                    posData.posIn.marginBottom = posData.startPosData.marginBottom;
                }

                posData.posOut.width    = posData.finalPosData.width;
                posData.posOut.height   = posData.finalPosData.height;

                posData.posOut.marginRight =
                    -(posData.finalPosData.width - posData.interPosData.width) +
                    (posData.finalPosData.marginRight * 1);

                posData.posOut.marginBottom =
                    -(posData.finalPosData.height - posData.interPosData.height) +
                    (posData.finalPosData.marginBottom * 1);

                posData.tweenData.width         = posData.posOut.width - posData.posIn.width;
                posData.tweenData.height        = posData.posOut.height - posData.posIn.height;
                posData.tweenData.marginRight   = posData.posOut.marginRight - posData.posIn.marginRight;
                posData.tweenData.marginBottom  = posData.posOut.marginBottom - posData.posIn.marginBottom;
            }

            // Process transforms

            for (j = 0; effectName = effectNames[j]; j++) {
                effect = self._effectsIn[effectName];

                if (!(effect instanceof mixitup.TransformData) || !effect.value) continue;

                posData.posIn[effectName].value = effect.value;
                posData.posOut[effectName].value = 0;
                posData.tweenData[effectName].value = posData.posOut[effectName].value - posData.posIn[effectName].value;

                posData.posIn[effectName].unit =
                    posData.posOut[effectName].unit =
                    posData.tweenData[effectName].unit =
                    effect.unit;
            }
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            posData             = operation.toHidePosData[i];
            posData.posIn       = new mixitup.StyleData();
            posData.posOut      = new mixitup.StyleData();
            posData.tweenData   = new mixitup.StyleData();

            // Process x and y

            posData.posIn.x     = target._isShown ? posData.startPosData.x - posData.interPosData.x : 0;
            posData.posIn.y     = target._isShown ? posData.startPosData.y - posData.interPosData.y : 0;
            posData.posOut.x    = self.animation.nudgeOut ? 0 : posData.posIn.x;
            posData.posOut.y    = self.animation.nudgeOut ? 0 : posData.posIn.y;
            posData.tweenData.x = posData.posOut.x - posData.posIn.x;
            posData.tweenData.y = posData.posOut.y - posData.posIn.y;

            // Process display

            posData.posIn.display = self.layout.display;
            posData.posOut.display = 'none';

            // Process opacity

            posData.posIn.opacity       = 1;
            posData.posOut.opacity      = self._effectsOut.opacity;
            posData.tweenData.opacity   = posData.posOut.opacity - posData.posIn.opacity;

            // Process transforms

            for (j = 0; effectName = effectNames[j]; j++) {
                effect = self._effectsOut[effectName];

                if (!(effect instanceof mixitup.TransformData) || !effect.value) continue;

                posData.posIn[effectName].value     = 0;
                posData.posOut[effectName].value    = effect.value;
                posData.tweenData[effectName].value = posData.posOut[effectName].value - posData.posIn[effectName].value;

                posData.posIn[effectName].unit =
                    posData.posOut[effectName].unit =
                    posData.tweenData[effectName].unit =
                    effect.unit;
            }
        }
    },

    /**
     * _moveTargets
     * @private
     * @since   3.0.0
     * @param   {Operation}     operation
     * @void
     */

    _moveTargets: function(operation) {
        var self            = this,
            target          = null,
            posData         = null,
            hideOrShow      = '',
            willTransition  = false,
            staggerIndex    = -1,
            i               = -1,
            checkProgress   = h.bind(self, self._checkProgress);


        // TODO: this is an extra loop in addition to the calcs
        // done in getOperation, can we get around somehow?

        for (i = 0; target = operation.show[i]; i++) {
            posData = operation.showPosData[i];

            hideOrShow = target._isShown ? false : 'show'; // TODO: can we not mix types here?

            willTransition = self._willTransition(hideOrShow, operation.hasEffect, posData.posIn, posData.posOut);

            if (willTransition) {
                // Prevent non-transitioning targets from incrementing the staggerIndex

                staggerIndex++;
            }

            target._show(operation.willChangeLayout ? operation.newDisplay : self.layout.display);

            target._move({
                posIn: posData.posIn,
                posOut: posData.posOut,
                hideOrShow: hideOrShow,
                staggerIndex: staggerIndex,
                operation: operation,
                callback: willTransition ? checkProgress : null
            });
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            posData = operation.toHidePosData[i];

            hideOrShow = 'hide';

            willTransition = self._willTransition(hideOrShow, posData.posIn, posData.posOut);

            target._move({
                posIn: posData.posIn,
                posOut: posData.posOut,
                hideOrShow: hideOrShow,
                staggerIndex: i,
                operation: operation,
                callback: willTransition ? checkProgress : null
            });
        }

        self._dom.parent.style.perspective = self.animation.perspectiveDistance + 'px';
        self._dom.parent.style.perspectiveOrigin = self.animation.perspectiveOrigin;

        if (self.animation.animateResizeContainer) {
            self._dom.parent.style[mixitup.Mixer.prototype._transitionProp] =
                'height ' + self.animation.duration + 'ms ease, ' +
                'width ' + self.animation.duration + 'ms ease, ';

            requestAnimationFrame(function() {
                self._dom.parent.style.height = operation.newHeight + 'px';
                self._dom.parent.style.width = operation.newWidth + 'px';
            });
        }

        if (operation.willChangeLayout) {
            h.removeClass(self._dom.container, self.layout.containerClass);
            h.addClass(self._dom.container, operation.newContainerClass);
        }
    },

    /**
     * hasEffect
     * @private
     * @return  {boolean}
     */

    hasEffect: function() {
        var self        = this,
            effectables = [
                'scale',
                'translateX', 'translateY', 'translateZ',
                'rotateX', 'rotateY', 'rotateZ'
            ],
            effectName  = '',
            effect      = null,
            value       = -1,
            i           = -1;

        if (self._effectsIn.opacity !== 1) {
            return true;
        }

        for (i = 0; effectName = effectables[i]; i++) {
            effect  = self._effectsIn[effectName];
            value   = (typeof effect && effect.value !== 'undefined') ?
                effect.value : effect;

            if (value !== 0) {
                return true;
            }
        }

        return false;
    },

    /**
     * _willTransition
     * @private
     * @param   {boolean}       hasEffect
     * @param   {StyleData}     posIn
     * @param   {StyleData}     posOut
     * @return  {boolean}
     *
     * Determines if a target element will transition in
     * some fasion and therefore requires binding of
     * transitionEnd
     */

    _willTransition: function(hideOrShow, hasEffect, posIn, posOut) {
        var self = this;

        if (!h.isVisible(self._dom.container)) {
            // If the container is not visible, the transitionEnd
            // event will not occur and MixItUp will hang

            return false;
        }

        // Check if opacity and/or translate will change

        if (
            (hideOrShow && hasEffect) ||
            posIn.x !== posOut.x ||
            posIn.y !== posOut.y
        ) {
            return true;
        } else if (self.animation.animateResizeTargets) {
            // Check if width, height or margins will change

            return (
                posIn.width !== posOut.width ||
                posIn.height !== posOut.height ||
                posIn.marginRight !== posOut.marginRight ||
                posIn.marginTop !== posOut.marginTop
            );
        } else {
            return false;
        }
    },

    /**
     * _checkProgress
     * @private
     * @since   2.0.0
     * @param   {Operation}     operation
     * @void
     */

    _checkProgress: function(operation) {
        var self = this;

        self._targetsDone++;

        if (self._targetsBound === self._targetsDone) {
            self._cleanUp(operation);
        }
    },

    /**
     * _cleanUp
     * @private
     * @since   2.0.0
     * @param   {Operation}     operation
     * @void
     */

    _cleanUp: function(operation) {
        var self = this,
            target = null,
            firstInQueue = null,
            i = -1;

        self._isMixing = false;

        self._execAction('_cleanUp', 0);

        self._targetsMoved = 0;
        self._targetsImmovable = 0;
        self._targetsBound = 0;
        self._targetsDone = 0;

        for (i = 0; target = operation.show[i]; i++) {
            target._cleanUp();

            target._show(operation.willChangeLayout ? operation.newDisplay : self.layout.display);
            target._isShown = true;
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            target._cleanUp();

            target.hide();
            target._isShown = false;
        }

        if (operation.willSort) {
            self._printSort(false, operation);

            self._targets = operation.newOrder;
        }

        if (self.animation.animateResizeContainer) {
            self._dom.parent.style[mixitup.Mixer.prototype._transitionProp] = '';
            self._dom.parent.style.height = '';
            self._dom.parent.style.width = '';
        }

        self._dom.parent.style[mixitup.Mixer.prototype._perspectiveProp] = '';
        self._dom.parent.style[mixitup.Mixer.prototype._perspectiveOriginProp] = '';

        if (operation.willChangeLayout) {
            h.removeClass(self._dom.container, operation.startContainerClass);
            h.addClass(self._dom.container, operation.newContainerClass);
        }

        if (operation.toRemove.length) {
            for (i = 0; target = self._targets[i]; i++) {
                if (operation.toRemove.indexOf(target) > -1) {
                    h.deleteElement(target._dom.el);

                    self._targets.splice(i, 1);

                    i--;
                }
            }

            // Since targets have been removed, the original order must be updated

            self._origOrder = self._targets;
        }

        self._state = operation.newState;
        self._lastOperation = operation;

        self._dom.targets = self._state.targets;

        if (typeof self._userCallback === 'function') {
            self._userCallback.call(self._dom.el, self._state, self);
        }

        if (typeof self.callbacks.onMixEnd === 'function') {
            self.callbacks.onMixEnd.call(self._dom.el, self._state, self);
        }

        h.triggerCustom(self._dom.container, 'mixEnd', {
            state: self._state,
            instance: self
        }, self._dom.document);

        if (self._queue.length) {
            self._execAction('_queue', 0);

            firstInQueue = self._queue.shift();

            self._userPromise = firstInQueue[3];

            self.multiMix.apply(self, firstInQueue);
        }

        self._userPromise.resolve(self._state);
        self._userPromise.isResolved = true;

        self._execAction('_cleanUp', 1);
    },

    /**
     * _parseMultiMixArgs
     * @private
     * @since   2.0.0
     * @param   {*[]}       args
     * @return  {object}
     */

    _parseMultiMixArgs: function(args) {
        var self        = this,
            instruction = new mixitup.UserInstruction(),
            arg         = null,
            i           = -1;

        instruction.animate = self.animation.enable;

        for (i = 0; i < args.length; i++) {
            arg = args[i];

            if (arg !== null) {
                if (typeof arg === 'object' || typeof arg === 'string') {
                    instruction.command = arg;
                } else if (typeof arg === 'boolean') {
                    instruction.animate = arg;
                } else if (typeof arg === 'function') {
                    instruction.callback = arg;
                }
            }
        }

        return self._execFilter('_parseMultiMixArgs', instruction, arguments);
    },

    /**
     * _parseInsertArgs
     * @private
     * @since   2.0.0
     * @param   {*[]}       args
     * @return  {object}
     */

    _parseInsertArgs: function(args) {
        var self        = this,
            instruction = new mixitup.UserInstruction(),
            arg         = null,
            i           = -1;

        instruction.animate = self.animation.enable;

        instruction.command = {
            index: 0, // Index to insert at
            targets: [], // Element(s) to insert
            position: 'before', // Position relative to a sibling if passed
            sibling: null // A sibling element as a reference
        };

        for (i = 0; i < args.length; i++) {
            arg = args[i];

            if (typeof arg === 'number') {
                // Insert index

                instruction.command.index = arg;
            } else if (typeof arg === 'string') {
                // 'before'/'after'

                instruction.command.position = arg;
            } else if (typeof arg === 'object' && h.isElement(arg, self._dom.document)) {
                // Single element

                !instruction.command.targets.length ?
                    (instruction.command.targets = [arg]) :
                    (instruction.command.sibling = arg);
            } else if (typeof arg === 'object' && arg !== null && arg.length) {
                // Multiple elements in array or jQuery collection

                !instruction.command.targets.length ?
                    (instruction.command.targets = arg) :
                    instruction.command.sibling = arg[0];
            } else if (
                typeof arg === 'object' &&
                arg !== null &&
                arg.childNodes &&
                arg.childNodes.length
            ) {
                // Document fragment

                !instruction.command.targets.length ?
                    instruction.command.targets = Array.prototype.slice.call(arg.childNodes) :
                    instruction.command.sibling = arg.childNodes[0];
            } else if (typeof arg === 'boolean') {
                instruction.animate = arg;
            } else if (typeof arg === 'function') {
                instruction.callback = arg;
            }
        }

        if (!instruction.command.targets.length && h.canReportErrors(self)) {
            throw new Error('[MixItUp] No elements were passed to "insert"');
        }

        return self._execFilter('_parseInsertArgs', instruction, arguments);
    },

    /**
     * _parseRemoveArgs
     * @private
     * @since   3.0.0
     * @param   {*[]}       args
     * @return  {object}
     */

    _parseRemoveArgs: function(args) {
        var self        = this,
            instruction = new mixitup.UserInstruction(),
            collection  = [],
            target      = null,
            arg         = null,
            i           = -1;

        instruction.animate = self.animation.enable;

        instruction.command = {
            targets: []
        };

        for (i = 0; i < args.length; i++) {
            arg = args[i];

            switch (typeof arg) {
                case 'number':
                    if (self._targets[arg]) {
                        instruction.command.targets[0] = self._targets[arg];
                    }

                    break;
                case 'string':
                    collection = Array.prototype.slice.call(self._dom.parent.querySelectorAll(arg));

                    break;
                case 'object':
                    if (arg && arg.length) {
                        collection = arg;
                    } else if (h.isElement(arg, self._dom.document)) {
                        collection = [arg];
                    }

                    break;
                case 'boolean':
                    instruction.animate = arg;

                    break;
                case 'function':
                    instruction.callback = arg;

                    break;
            }
        }

        if (collection.length) {
            for (i = 0; target = self._targets[i]; i++) {
                if (collection.indexOf(target._dom.el) > -1) {
                    instruction.command.targets.push(target);
                }
            }
        }

        return self._execFilter('_parseRemoveArgs', instruction, arguments);
    },

    /**
     * _deferMix
     * @private
     * @since   3.0.0
     * @param   {*[]}           args
     * @param   {object}        parsedArgs
     * @return  {Promise} ->    {State}
     */

    _deferMix: function(args, parsedArgs) {
        var self = this;

        self._userPromise = h.getPromise(self.libraries);

        if (self.animation.queue && self._queue.length < self.animation.queueLimit) {
            args[3] = self._userPromise;

            self._queue.push(args);

            (self.controls.enable && !self._isClicking) && self._updateControls(parsedArgs.command);

            self._execAction('multiMixQueue', 1, args);
        } else {
            self._userPromise.resolve(self._state); // TODO: include warning that was busy in state?
            self._userPromise.isResolved = true;

            if (typeof self.callbacks.onMixBusy === 'function') {
                self.callbacks.onMixBusy.call(self._dom.container, self._state, self);
            }

            h.triggerCustom(self._dom.container, 'mixBusy', {
                state: self._state,
                instance: self
            }, self._dom.document);

            self._execAction('multiMixBusy', 1, args);
        }

        return self._userPromise.promise;
    },

    /**
     * init
     * @public
     * @since 3.0.0
     * @return {Promise} -> {State}
     */

    init: function() {
        var self = this;

        return self.multiMix({
            filter: self._state.activeFilter
        });
    },

    /**
     * show
     * @public
     * @since   3.0.0
     * @return  {Promise} ->    {State}
     */

    show: function() {
        var self = this;

        return self.filter('all');
    },

    /**
     * hide
     * @public
     * @since 3.0.0
     * @return {Promise} -> {State}
     */

    hide: function() {
        var self = this;

        return self.filter('none');
    },

    /**
     * isMixing
     * @public
     * @since   2.0.0
     * @return  {boolean}
     */

    isMixing: function() {
        var self = this;

        return self._isMixing;
    },

    /**
     * filter
     * @public
     * @since       2.0.0
     * @shorthand   self.multiMix
     * @param       {*[]}           arguments
     * @return      {Promise} ->    {State}
     */

    filter: function() {
        var self = this,
            args = self._parseMultiMixArgs(arguments);

        self._isClicking && (self._toggleString = '');

        return self.multiMix({
            filter: args.command
        }, args.animate, args.callback);
    },

    /**
     * sort
     * @public
     * @since       2.0.0
     * @shorthand   self.multiMix
     * @param       {*[]}           arguments
     * @return      {Promise} ->    {State}
     */

    sort: function() {
        var self = this,
            args = self._parseMultiMixArgs(arguments);

        return self.multiMix({
            sort: args.command
        }, args.animate, args.callback);
    },

    /**
     * changeLayout
     * @public
     * @since       2.0.0
     * @shorthand   self.multiMix
     * @param       {*[]} arguments
     * @return      {Promise} ->    {State}
     */

    changeLayout: function() {
        // TODO: parse args, and map to multiMix
    },

    /**
     * getOperation
     * @public
     * @since   3.0.0
     * @param   {Command}   command
     * @return  {Operation}
     */

    getOperation: function(command) {
        var self = this,
            sortCommand         = command.sort,
            filterCommand       = command.filter,
            changeLayoutCommand = command.changeLayout,
            removeCommand       = command.remove,
            insertCommand       = command.insert,
            operation           = new mixitup.Operation();

        operation.command       = command;
        operation.startState    = self._state;
        operation.id            = h.randomHexKey();

        self._execAction('getOperation', 0, operation);

        // TODO: passing the operation rather than arguments
        // to the action is non-standard here but essential as
        // we require a reference to original. Perhaps a "pre"
        // filter is the best alternative

        if (self._isMixing) {
            return null;
        }

        if (insertCommand) {
            self._insert(insertCommand, operation);
        }

        if (removeCommand) {
            operation.toRemove = removeCommand.targets;
        }

        if (sortCommand) {
            operation.startSortString   = operation.startState.activeSort;
            operation.newSort           = self._parseSort(sortCommand);
            operation.newSortString     = sortCommand;

            if (sortCommand !== operation.startState.activeSortString || sortCommand === 'random') {
                operation.willSort = true;

                self._sort(operation);
            }
        } else {
            operation.startSortString = operation.newSortString = operation.startState.activeSort;
            operation.startOrder = operation.newOrder = self._targets;
        }

        operation.startFilter = operation.startState.activeFilter;

        if (filterCommand) {
            operation.newFilter = filterCommand === 'all' ?
                self.selectors.target :
                filterCommand === 'none' ?
                    '' :
                    filterCommand;
        } else {
            operation.newFilter = operation.startState.activeFilter;
        }

        self._filter(operation);

        // TODO: we need a definitve object for filter operations,
        // which accomodates selectors, elements, hide vs show etc.

        if (typeof changeLayoutCommand !== 'undefined') {
            operation.startDisplay        = operation.startState.activeDisplay;
            operation.startContainerClass = operation.startState.activeContainerClass;
            operation.newDisplay          = changeLayoutCommand.display || operation.startDisplay;
            operation.newContainerClass   = changeLayoutCommand.containerClass || operation.startContainerClass;

            if (
                operation.newContainerClass !== operation.startContainerClass ||
                operation.newDisplay !== operation.startDisplay
            ) {
                operation.willChangeLayout = true;
            }
        }

        // Populate the operation's position data

        self._getStartMixData(operation);
        self._setInter(operation);

        operation.docState = h.getDocumentState();

        self._getInterMixData(operation);
        self._setFinal(operation);
        self._getFinalMixData(operation);

        self._parseEffects();

        operation.hasEffect = self.hasEffect();

        self._getTweenData(operation);

        operation.newState = self._buildState(operation);

        return self._execFilter('getOperation', operation, arguments);
    },

    /**
     * multiMix
     * @public
     * @since   2.0.0
     * @param   {*[]}           arguments
     * @return  {Promise} ->    {State}
     */

    multiMix: function() {
        var self        = this,
            operation   = null,
            animate     = false,
            instruction = self._parseMultiMixArgs(arguments);

        self._execAction('multiMix', 0, arguments);

        if (!self._isClicking) {
            self._lastClicked = null;
        }

        if (!self._isMixing) {
            operation = self.getOperation(instruction.command);

            if (self.controls.enable && !self._isClicking) {
                // Update controls for API calls

                self._dom.filterToggleButtons.length && self._buildToggleArray();

                // TODO: what about "live" toggles?

                self._updateControls(operation.command);
            }

            (self._queue.length < 2) && (self._isClicking = false);

            self._userCallback = null;

            if (instruction.callback) self._userCallback = instruction.callback;

            self._execFilter('multiMix', operation, self);
            self._execAction('multiMix', 1, arguments);

            // Always allow the instruction to override the instance setting

            animate = (instruction.animate ^ self.animation.enable) ?
                instruction.animate :
                self.animation.enable;

            return self._goMix(animate, operation);
        } else {
            return self._deferMix(arguments, instruction);
        }
    },

    /**
     * tween
     * @public
     * @since   3.0.0
     * @param   {Operation}     operation
     * @param   {Float}         multiplier
     * @void
     */

    tween: function(operation, multiplier) {
        var self            = this,
            target          = null,
            posData         = null,
            toHideIndex     = -1,
            i               = -1;

        multiplier = Math.min(multiplier, 1);
        multiplier = Math.max(multiplier, 0);

        for (i = 0; target = operation.show[i]; i++) {
            posData = operation.showPosData[i];

            target._applyTween(posData, multiplier);
        }

        for (i = 0; target = operation.hide[i]; i++) {
            if (target._dom.el.style.display) {
                target.hide();
            }

            if ((toHideIndex = operation.toHide.indexOf(target)) > -1) {
                posData = operation.toHidePosData[toHideIndex];

                if (!target._dom.el.style.display) {
                    target._show(self.layout.display);
                }

                target._applyTween(posData, multiplier);
            }
        }
    },

    /**
     * insert
     * @public
     * @since       2.0.0
     * @param       {*[]} arguments
     * @shorthand   multiMix
     * @return      {Promise} ->    {State}
     */

    insert: function() {
        var self = this,
            args = self._parseInsertArgs(arguments);

        return self.multiMix({
            insert: args.command
        }, args.animate, args.callback);
    },

    /**
     * insertBefore
     * @public
     * @since       3.0.0
     * @shorthand   insert
     * @param       {*[]}           arguments
     * @return      {Promise} ->    {State}
     */

    insertBefore: function() {
        var self = this,
            args = self._parseInsertArgs(arguments);

        return self.insert(args.command.targets, 'before', args.command.sibling, args.animate, args.callback);
    },

    /**
     * insertAfter
     * @public
     * @since       3.0.0
     * @shorthand   insert
     * @param       {*[]}           arguments
     * @return      {Promise} ->    {State}
     */

    insertAfter: function() {
        var self = this,
            args = self._parseInsertArgs(arguments);

        return self.insert(args.command.targets, 'after', args.command.sibling, args.animate, args.callback);
    },

    /**
     * prepend
     * @public
     * @since       2.0.0
     * @shorthand   insert
     * @param       {*[]}           arguments
     * @return      {Promise} ->    {State}
     */

    prepend: function() {
        var self = this,
            args = self._parseInsertArgs(arguments);

        return self.insert(0, args.command.targets, args.animate, args.callback);
    },

    /**
     * append
     * @public
     * @since       2.0.0
     * @shorthand   insert
     * @param       {*[]}           arguments
     * @return      {Promise} ->    {State}
     */

    append: function() {
        var self = this,
            args = self._parseInsertArgs(arguments);

        return self.insert(self._state.totalTargets, args.command.targets, args.animate, args.callback);
    },

    /**
     * remove
     * @since       3.0.0
     * @shorthand   multiMix
     * @param       {*[]}           arguments
     * @return      {Promise} ->    {State}
     */

    remove: function() {
        var self = this,
            args = self._parseRemoveArgs(arguments);

        return self.multiMix({
            remove: args.command
        }, args.animate, args.callback);
    },

    /**
     * getOption
     * @public
     * @since       2.0.0
     * @param       {string}    string
     * @return      {*}
     */

    getOption: function(stringKey) {
        // TODO: requires stringKey parser helper
    },

    /**
     * setOptions
     * @public
     * @since       2.0.0
     * @param       {object}    config
     */

    setOptions: function(config) {
        var self = this;

        self._execAction('setOptions', 0, arguments);

        // TODO (requires deep extend helper)

        self._execAction('setOptions', 1, arguments);
    },

    /**
     * getState
     * @public
     * @since       2.0.0
     * @return      {State}
     */

    getState: function() {
        var self = this;

        return self._execFilter('getState', self._state, self);
    },

    /**
     * forceRefresh
     * @public
     * @since 2.1.2
     */

    forceRefresh: function() {
        var self = this;

        self._indexTargets();
    },

    /**
     * destroy
     * @public
     * @since   2.0.0
     * @param   {boolean}   hideAll
     * @void
     */

    destroy: function(hideAll) {
        var self    = this,
            target  = null,
            button  = null,
            i       = 0;

        self._execAction('destroy', 0, arguments);

        self._unbindEvents();

        for (i = 0; target = self._targets[i]; i++) {
            hideAll && target.hide();

            target._unbindEvents();
        }

        for (i = 0; button = self._dom.allButtons[i]; i++) {
            h.removeClass(button, self.controls.activeClass);
        }

        if (self._dom.container.id.indexOf('MixItUp') > -1) {
            // TODO: use a regex

            self._dom.container.removeAttribute('id');
        }

        delete mixitup.Mixer.prototype._instances[self._id];

        self._execAction('destroy', 1, arguments);
    }
});
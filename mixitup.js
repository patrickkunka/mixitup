/**!
 * _MixItUp v3.0.0-beta
 *
 * @copyright Copyright 2014-2015 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://mixitup.kunkalabs.com
 *
 * @license   Commercial use requires a commercial license.
 *            https://mixitup.kunkalabs.com/licenses/
 *
 *            Non-commercial use permitted under terms of CC-BY-NC license.
 *            http://creativecommons.org/licenses/by-nc/3.0/
 */

(function(window, undf) {
    'use strict';

    var _MixItUp = null,
        mixItUp = null,
        _Target = null,
        _h = null;

    if (window._MixItUp === undf || typeof window._MixItUp !== 'function') {

        /* _MixItUp Private Core
        ---------------------------------------------------------------------- */

        /**
         * _MixItUp Constructor Function
         * @constructor
         */

        _MixItUp = function() {
            var self = this;

            self._execAction('_constructor', 0);

            _h._extend(self, {

                /* Public Properties
                ---------------------------------------------------------------------- */

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
                    duration: 600,
                    staggerDelay: 0,
                    easing: 'ease',
                    perspectiveDistance: '3000',
                    perspectiveOrigin: '50% 50%',
                    queue: true,
                    queueLimit: 1,
                    animateChangeLayout: false,
                    animateResizeContainer: true,
                    animateResizeTargets: false,
                    staggerSequence: false,
                    reverseOut: false
                },

                callbacks: {
                    onMixLoad: null,
                    onMixStart: null,
                    onMixBusy: null,
                    onMixEnd: null,
                    onMixFail: null,
                    _user: null
                },

                controls: {
                    enable: true,
                    live: false,
                    toggleFilterButtons: false,
                    toggleLogic: 'or',
                    activeClass: 'active'
                },

                layout: {
                    display: 'inline-block',
                    containerClass: '',
                    containerClassFail: 'fail'
                },
                
                load: {
                    filter: 'all',
                    sort: false
                },

                libraries: {
                    jQuery: null,
                    q: null
                },

                /* DOM
                ---------------------------------------------------------------------- */

                _dom: {
                    _body: null,
                    _container: null,
                    _targets: [],
                    _parent: null,
                    _sortButtons: [],
                    _filterButtons: [],
                    _filterToggleButtons: [],
                    _multiMixButtons: []
                },

                /* Private Properties
                ---------------------------------------------------------------------- */

                _isMixing: false,
                _isSorting: false,
                _isClicking: false,
                _isLoading: true,
                _isChangingLayout: false,
                _isChangingClass: false,
                _isChangingDisplay: false,
                _isRemoving: false,

                _targets: [],
                _show: [],
                _hide: [],
                _toShow: [],
                _toHide: [],
                _toMove: [],

                _origOrder: [],
                _currentOrder: [],
                _newOrder: [],

                _activeFilter: null,
                _toggleArray: [],
                _toggleString: '',
                _activeSort: 'default:asc',
                _newSort: null,
                _startHeight: null,
                _newHeight: null,
                _incPadding: true,
                _newDisplay: null,
                _newClass: null,
                _targetsBound: 0,
                _targetsDone: 0,
                _userPromise: null,
                _effects: null,
                _queue: [],
                _state: null
            });

            self._execAction('_constructor', 1);
        };

        /**
         * _MixItUp Prototype
         * @override
         */

        _MixItUp.prototype = {
            constructor: _MixItUp,

            /* Static Properties
            ---------------------------------------------------------------------- */

            _prefix: '',
            _transformProp: 'transform',
            _transformRule: 'transform',
            _transitionProp: 'transition',

            _is: {},
            _has: {},

            _instances: {},

            _extensions: {
                dragndrop: false,
                multiFilter: false,
                pagination: false
            },

            _handled: {
                _filter: {},
                _sort: {}
            },

            _bound: {
                _filter: {},
                _sort: {}
            },

            _actions: {},
            _filters: {},
            
            /* Static Methods
            ---------------------------------------------------------------------- */

            /**
             * Extend
             * @since 2.1.0
             * @param {object} new properties/methods
             * @extends {object} prototype
             */

            extend: function(extension) {
                for (var key in extension) {
                    if (extension[key]) {
                        _MixItUp.prototype[key] = extension[key];
                    }
                }
            },

            /**
             * Add Action
             * @since 2.1.0
             * @param {string} hook name
             * @param {string} method
             * @param {function} function to execute
             * @param {number} priority
             * @extends {object} $._MixItUp.prototype._actions
             */

            addAction: function(hook, name, func, priority) {
                _MixItUp.prototype._addHook('_actions', hook, name, func, priority);
            },

            /**
             * Add Filter
             * @since 2.1.0
             * @param {string} hook name
             * @param {string} method
             * @param {function} function to execute
             * @param {number} priority
             * @extends {object} $._MixItUp.prototype._filters
             */

            addFilter: function(hook, name, func, priority) {
                _MixItUp.prototype._addHook('_filters', hook, name, func, priority);
            },

            /**
             * _addHook
             * @since 2.1.0
             * @param {string} type of hook
             * @param {string} hook name
             * @param {function} function to execute
             * @param {number} priority
             * @extends {object} $._MixItUp.prototype._filters
             */

            _addHook: function(type, hook, name, func, priority) {
                var collection = _MixItUp.prototype[type],
                    obj = {};
                    
                priority = (priority === 1 || priority === 'post') ? 'post' : 'pre';
                    
                obj[hook] = {};
                obj[hook][priority] = {};
                obj[hook][priority][name] = func;

                _h._extend(collection, obj);
            },

            /**
             * _platformDetect
             * @since 2.0.0
             */
            
            _platformDetect: function() {
                var self = this,
                    testEl = document.createElement('div'),
                    vendorsTrans = ['Webkit', 'Moz', 'O', 'ms'],
                    vendorsRAF = ['webkit', 'moz'],
                    getPrefix = function(el){
                        for (var i = 0; i < vendorsTrans.length; i++) {
                            if (vendorsTrans[i] + 'Transition' in el.style) {
                                return vendorsTrans[i].toLowerCase();
                            }
                        }

                        return 'transition' in el.style ? '' : false;
                    },
                    prefix = getPrefix(testEl);

                _MixItUp.prototype._has._promises = typeof Promise !== "undefined" && Promise.toString().indexOf('[native code]') !== -1;
                _MixItUp.prototype._has._transitions = prefix !== false;
                _MixItUp.prototype._is._crapIe = window.atob && self._prefix ? false : true;
                _MixItUp.prototype._prefix = prefix;
                _MixItUp.prototype._transitionProp = prefix ? prefix + 'Transition' : 'transition';
                _MixItUp.prototype._transformProp = prefix ? prefix + 'Transform' : 'transform';
                _MixItUp.prototype._transformRule = prefix ? '-' + prefix + '-transform' : 'transform';
                
                /* Polyfills
                ---------------------------------------------------------------------- */

                /**
                 * window.requestAnimationFrame
                 */

                for(var x = 0; x < vendorsRAF.length && !window.requestAnimationFrame; x++){
                    window.requestAnimationFrame = window[vendorsRAF[x]+'RequestAnimationFrame'];
                }

                /**
                 * Element.nextElementSibling
                 */

                if (testEl.nextElementSibling === undf) {
                    Object.defineProperty(Element.prototype, 'nextElementSibling', {
                        get: function() {
                            var el = this.nextSibling;
                            
                            while (el) {
                                if (el.nodeType ===1) {
                                    return el;
                                }
                                el = el.nextSibling;
                            }
                            return null;
                        }
                    });
                }

                /**
                 * Element.matches
                 */

                (function(ElementPrototype) {
                    ElementPrototype.matches = ElementPrototype.matches || 
                        ElementPrototype.machesSelector ||
                        ElementPrototype.mozMatchesSelector ||
                        ElementPrototype.msMatchesSelector ||
                        ElementPrototype.oMatchesSelector ||
                        ElementPrototype.webkitMatchesSelector ||
                        function (selector) {
                            var node = this,
                                nodes = (node.parentNode || node.document).querySelectorAll(selector),
                                i = -1;
                     
                            while (nodes[++i] && nodes[i] != node) {
                                return !!nodes[i];
                            }
                        };
                })(Element.prototype);
                
                self._execAction('_platformDetect', 1);
            },

            /* Private Methods
            ---------------------------------------------------------------------- */

            /**
             * _init
             * @since 2.0.0
             * @param {Object} el
             * @param {Object} config
             */

            _init: function(el, config) {
                var self = this;
                
                self._execAction('_init', 0, arguments);

                config && _h._extend(self, config);

                self._cacheDom(el);
                
                self.layout.containerClass && _h._addClass(el, self.layout.containerClass);

                self.animation.enable = self.animation.enable && _MixItUp.prototype._has._transitions;

                self._indexTargets(true);

                if (self.load.sort) {
                    self._newSort = self._parseSort(self.load.sort);
                    self._newSortString = self.load.sort;
                    self._activeSort = self.load.sort;
                    self._sort();
                    self._printSort();
                }

                self._activeFilter = self.load.filter === 'all' ? 
                    self.selectors.target :
                    self.load.filter === 'none' ?
                        '' :
                        self.load.filter;

                if (self._dom._filterToggleButtons.length) { // TODO: what about live toggles? is it worth trawling the dom?
                    self._buildToggleArray();
                }

                self._updateControls({filter: self._activeFilter, sort: self._activeSort});

                self._effects = self._parseEffects();

                self._filter();
                self._buildState();
                self._bindEvents();

                self._execAction('_init', 1, arguments);
            },

            /**
             * _cacheDom
             * @since 3.0.0
             */

            _cacheDom: function(el) {
                var self = this;

                self._dom._body = document.getElementsByTagName('body')[0];
                self._dom._container = el;
                self._dom._parent = el;
                self._dom._sortButtons = document.querySelectorAll(self.selectors.sort);
                self._dom._filterButtons = document.querySelectorAll(self.selectors.filter);
                self._dom._filterToggleButtons = document.querySelectorAll(self.selectors.filterToggle);
                self._dom._multiMixButtons = document.querySelectorAll(self.selectors.multiMix);
            },

            /**
             * _indexTargets
             * @since 3.0.0
             */

            _indexTargets: function(){
                var self = this;
                    
                self._execAction('_indexTargets', 0, arguments);

                self._dom._targets = self._dom._container.querySelectorAll(self.selectors.target);

                self._targets = [];
                
                if (self._dom._targets.length) {
                    for (var i = 0, el; el = self._dom._targets[i]; i++) {
                        var target = new _Target();

                        target._init(el, self);

                        self._targets.push(target);
                    }

                    self._dom._parent = self._dom._targets[0].parentElement.isEqualNode(self._dom._container) ?
                        self._dom._container :
                        self._dom._targets[0].parentElement;
                }

                self._currentOrder = self._origOrder = self._targets;
                
                self._execAction('_indexTargets', 1, arguments);
            },

            /**
             * _bindEvents
             * @since 3.0.0
             */

            _bindEvents: function(){
                var self = this,
                    proto = _MixItUp.prototype,
                    filters = proto._bound._filter,
                    sorts = proto._bound._sort;

                self._execAction('_bindHandlers', 0);

                self.handler = function(e) {
                    return self._eventBus(e);
                };

                if (self.controls.live) {
                    _h._on(window, 'click', self.handler);
                } else {
                    _h._forEach(self._dom._filterButtons, function(button) {
                        _h._on(button, 'click', self.handler);
                    });

                    _h._forEach(self._dom._sortButtons, function(button) {
                        _h._on(button, 'click', self.handler);
                    });
                }

                filters[self.selectors.filter] = (filters[self.selectors.filter] === undf) ?
                    1 : filters[self.selectors.filter] + 1;

                sorts[self.selectors.sort] = (sorts[self.selectors.sort] === undf) ?
                    1 : sorts[self.selectors.sort] + 1;

                self._execAction('_bindHandlers', 1);
            },

            /**
             * _unbindEvents
             * @since 3.0.0
             */

            _unbindEvents: function() {
                var self = this;

                self._execAction('_unbindHandlers', 0);

                _h._off(window, 'click', self.handler);

                _h._forEach(self._dom._filterButtons, function(button) {
                    _h._off(button, 'click', self.handler);
                });

                _h._forEach(self._dom._sortButtons, function(button) {
                    _h._off(button, 'click', self.handler);
                });

                delete self.handler;

                self._execAction('_unbindHandlers', 1);
            },

            /**
             * _eventBus
             * @param {Object} e
             */

            _eventBus: function(e) {
                var self = this;

                switch(e.type) {
                    case 'click':
                        return self._handleClick(e);
                }
            },
            
            /**
             * _handleClick
             * @since 3.0.0
             * @param {object} $button
             * @param {string} type
             */
            
            _handleClick: function(e){
                var self = this,
                    selectors = [
                        self.selectors.filter,
                        self.selectors.sort,
                        self.selectors.multiMix
                    ],
                    selector = selectors.join(','),
                    target = _h._closestParent(
                        e.target,
                        selector,
                        true
                    ),
                    command = {},
                    filterString = '',
                    sortString = '',
                    method = '',
                    isTogglingOff = false,
                    i = 0,
                    button = null,
                    trackClick = function(button, method, isTogglingOff) {
                        var proto = _MixItUp.prototype,
                            selector = self.selectors[method];

                        method = '_'+method;

                        proto._handled[method][selector] = (proto._handled[method][selector] === undf) ?
                            1 :
                            proto._handled[method][selector] + 1;

                        if (
                            proto._handled[method][selector] ===
                            proto._bound[method][selector]
                        ) {
                            _h[(isTogglingOff ? '_remove' : '_add') + 'Class'](button, self.controls.activeClass);

                            delete proto._handled[method][selector];
                        }
                    };
                
                self._execAction('_processClick', 0, arguments);

                if (!target) return;

                if (
                    self._isMixing &&
                    (!self.animation.queue || self._queue.length >= self.animation.queueLimit)
                ) {
                    if (typeof self.callbacks.onMixBusy === 'function'){
                        self.callbacks.onMixBusy.call(self._dom._container, self._state, self);
                    }

                    self._execAction('_processClickBusy', 1, arguments);

                    return;
                }

                self._isClicking = true;

                // sort

                if (target.matches(self.selectors.sort)) {
                    sortString = target.getAttribute('data-sort');
                    if (
                        !_h._hasClass(target, self.controls.activeClass) ||
                        sortString.indexOf('random') > -1
                    ) {
                        method = 'sort';

                        for (i = 0; button = self._dom._sortButtons[i]; i++) {
                            _h._removeClass(button, self.controls.activeClass);
                        }

                        command = {
                            sort: sortString
                        };
                    } else {
                        return;
                    }
                } 

                // filter

                else if (target.matches(self.selectors.filter)) {
                    if (!_h._hasClass(target, self.controls.activeClass)) {
                        method = 'filter';

                        for (i = 0; button = self._dom._filterButtons[i]; i++) {
                            _h._removeClass(button, self.controls.activeClass);
                        }

                        for (i = 0; button = self._dom._filterToggleButtons[i]; i++) {
                            _h._removeClass(button, self.controls.activeClass);
                        }

                        command = {
                            filter: target.getAttribute('data-filter')
                        };
                    } else {
                        return;
                    }
                } 

                // filterToggle

                else if (target.matches(self.selectors.filterToggle)) {
                    filterString = target.getAttribute('data-filter');
                    method = 'filterToggle';

                    self._buildToggleArray();

                    if (!_h._hasClass(target, self.controls.activeClass)) {
                        self._toggleArray.push(filterString);
                    } else {
                        self._toggleArray.splice(self._toggleArray.indexOf(filterString, 1));

                        isTogglingOff = true;
                    }

                    self._toggleArray = _h._clean(self._toggleArray);
                    self._toggleArray = self._toggleArray.join(self.controls.toggleLogic === 'or' ? ',' : '');

                    for (i = 0; button = self._dom._filterButtons[i]; i++) {
                        _h._removeClass(button, self.controls.activeClass);
                    }

                    for (i = 0; button = self._dom._multiMixButtons[i]; i++) {
                        _h._removeClass(button, self.controls.activeClass);
                    }

                    command = {
                        filter: self._toggleString
                    };
                } 

                // multiMix

                else if (target.matches(self.selectors.multiMix)) {
                    if (!_h._hasClass(target, self.controls.activeClass)) {
                        method = 'multiMix';

                        for (i = 0; button = self._dom._filterButtons[i]; i++) {
                            _h._removeClass(button, self.controls.activeClass);
                        }

                        for (i = 0; button = self._dom._filterToggleButtons[i]; i++) {
                            _h._removeClass(button, self.controls.activeClass);
                        }

                        for (i = 0; button = self._dom._sortButtons[i]; i++) {
                            _h._removeClass(button, self.controls.activeClass);
                        }

                        for (i = 0; button = self._dom._multiMixButtons[i]; i++) {
                            _h._removeClass(button, self.controls.activeClass);
                        }

                        command = {
                            sort: target.getAttribute('data-sort'),
                            filter: target.getAttribute('data-filter')
                        };
                    } else {
                        return;
                    }
                }

                trackClick(target, method, isTogglingOff);

                self.multiMix(command);

                self._execAction('_processClick', 1, arguments);
            },

            /**
             * _buildToggleArray
             * @since 2.0.0
             */

            _buildToggleArray: function(){
                var self = this,
                    activeFilter = self._activeFilter.replace(/\s/g, '');

                self._execAction('_buildToggleArray', 0, arguments);

                if (self.controls.toggleLogic === 'or') {
                    self._toggleArray = activeFilter.split(',');
                } else {
                    self._toggleArray = activeFilter.split('.');
                
                    !self._toggleArray[0] && self._toggleArray.shift();
                
                    for (var i = 0, filter; filter = self._toggleArray[i]; i++) {
                        self._toggleArray[i] = '.'+filter;
                    }
                }
                
                self._execAction('_buildToggleArray', 1, arguments);
            },

            /**
             * _updateControls
             * @since 2.0.0
             * @param {object} command
             * @param {boolean} multi
             */

            _updateControls: function(command){
                var self = this,
                    output = {
                        filter: command.filter,
                        sort: command.sort
                    },
                    button = null,
                    i = 0,
                    j = 0,
                    selector = '';
                    
                self._execAction('_updateControls', 0, arguments);

                (command.filter === undf) && (output.filter = self._activeFilter);
                (command.sort === undf) && (output.sort = self._activeSort);
                (output.filter === self.selectors.target) && (output.filter = 'all');               

                for (i = 0; button = self._dom._sortButtons[i]; i++) {
                    _h._removeClass(button, self.controls.activeClass);

                    if (button.matches('[data-sort="'+output.sort+'"]')) {
                        _h._addClass(button, self.controls.activeClass);
                    }
                }

                for (i = 0; button = self._dom._filterButtons[i]; i++) {
                    _h._removeClass(button, self.controls.activeClass);
                }

                for (i = 0; button = self._dom._multiMixButtons[i]; i++) {
                    _h._removeClass(button, self.controls.activeClass);

                    if (
                        button.matches('[data-sort="'+output.sort+'"]') &&
                        button.matches('[data-filter="'+output.filter+'"]')
                    ) {
                        _h._addClass(button, self.controls.activeClass);
                    }
                }

                if (self._toggleArray.length) { 
                    if (output.filter === 'none' || output.filter === '') {
                        for (i = 0; button = self._dom._filterToggleButtons[i]; i++) {
                            _h._removeClass(button, self.controls.activeClass);
                        }
                    }

                    for (j = 0; selector = self._toggleArray[j]; j++) {
                        var activeButton = null;

                        if (self.controls.live) {
                            activeButton = document
                                .querySelector(self.selectors.filterToggle+'[data-filter="'+selector+'"]');
                        } else {
                            for (var k = 0, filterToggleButton; filterToggleButton = self._dom._filterToggleButtons[k]; k++) {
                                if (filterToggleButton.matches('[data-filter="'+selector+'"]')) {
                                    activeButton = filterToggleButton;
                                }
                            }
                        }

                        _h._addClass(activeButton, self.controls.activeClass);
                    }
                } else {
                    for (i = 0; button = self._dom._filterButtons[i]; i++) {
                        if (button.matches('[data-filter="'+output.filter+'"]')) {
                            _h._addClass(button, self.controls.activeClass);
                        }
                    }
                }

                self._execAction('_updateControls', 1, arguments);              
            },

            /**
             * _filter
             * @since 2.0.0
             */

            _filter: function(){
                var self = this,
                    shown = false,
                    hidden = false,
                    match = function(target, matchWith, bistable, invert) {
                        if (
                            typeof matchWith === 'string' && target._el.matches(matchWith) ||
                            typeof matchWith === 'object' && target._el === matchWith
                        ) {
                            if (!invert) {
                                self._show.push(target);

                                !target._isShown && self._toShow.push(target);
                            } else {
                                self._hide.push(target);

                                target._isShown && self._toHide.push(target);
                            }

                            if (!bistable) return true;
                        } else if (bistable) {
                            if (!invert) {
                                self._hide.push(target);

                                target._isShown && self._toHide.push(target);
                            } else {
                                if (self._isRemoving && !target._isShown) return;

                                self._show.push(target);

                                !target._isShown && self._toShow.push(target);
                            }
                        }
                    };

                self._execAction('_filter', 0);

                !self._isRemoving && (self._show = []);
                self._hide = [];
                self._toShow = [];
                self._toHide = [];

                for (var i = 0, target; target = self._targets[i]; i++) {
                    switch (typeof self._activeFilter) {
                        case 'string':
                            match(target, self._activeFilter, true);
                            
                            break;
                        case 'object':
                            if (_h._isElement(self._activeFilter)) {
                                match(target, self._activeFilter, true);
                            } else if (self._activeFilter.show) {
                                if (typeof self._activeFilter.show === 'string') {
                                    match(target, self._activeFilter.show, true);
                                } else if (_h._isElement(self._activeFilter.show)) {
                                    match(target, self._activeFilter.show, true);
                                } else if (self._activeFilter.show.length) {
                                    for (var j = 0, toShow; toShow = self._activeFilter.show[j]; j++) {
                                        if (match(target, toShow, false)) {
                                            shown = true;
                                        }
                                    }

                                    if (!shown) {
                                        match(target, null, true);
                                    }
                                }
                            } else if (self._activeFilter.hide) {
                                if (typeof self._activeFilter.hide === 'string') {
                                    match(target, self._activeFilter.hide, true, true);
                                } else if (_h._isElement(self._activeFilter.hide)) {
                                    match(target, self._activeFilter.hide, true, true);
                                } else if (self._activeFilter.hide.length) {
                                    for (var k = 0, toHide; toHide = self._activeFilter.hide[k]; k++) {
                                        if (match(target, toHide, false, true)) {
                                            hidden = true;
                                        }
                                    }

                                    if (!hidden) {
                                        match(target, null, true, true);
                                    }
                                }
                            }
                    }
                }

                self._execAction('_filter', 1);
            },

            /**
             * Sort (private)
             * @since 2.0.0
             */

            _sort: function(){
                var self = this,
                    arrayShuffle = function(oldArray) {
                        var newArray = oldArray.slice(),
                            len = newArray.length,
                            i = len;

                        while (i--) {
                            var p = parseInt(Math.random()*len),
                                t = newArray[i];

                            newArray[i] = newArray[p];
                            newArray[p] = t;
                        }

                        return newArray; 
                    };

                self._execAction('_sort', 0);

                self._currentOrder = [];

                for (var i = 0, target; target = self._targets[i]; i++) {
                    self._currentOrder.push(target);
                }

                switch (self._newSort[0].sortBy) {
                    case 'default':
                        self._newOrder = self._origOrder;
                        break;
                    case 'random':
                        self._newOrder = arrayShuffle(self._currentOrder);
                        break;
                    case 'custom':
                        self._newOrder = self._newSort[0].order;
                        break;
                    default:
                        self._newOrder = self._currentOrder.concat().sort(function(a, b){
                            return self._compare(a, b);
                        });
                }

                self._targets = self._newOrder;

                self._execAction('_sort', 1);
            },

            /**
             * Compare Algorithm
             * @since 2.0.0
             * @param {string|number} a
             * @param {string|number} b
             * @param {number} depth (recursion)
             * @return {number}
             */

            _compare: function(a, b, depth){
                depth = depth ? depth : 0;
            
                var self = this,
                    order = self._newSort[depth].order,
                    getData = function(target){
                        return target._el.getAttribute('data-'+self._newSort[depth].sortBy) || 0;
                    },
                    attrA = isNaN(getData(a) * 1) ? getData(a).toLowerCase() : getData(a) * 1,
                    attrB = isNaN(getData(b) * 1) ? getData(b).toLowerCase() : getData(b) * 1;
                    
                if(attrA < attrB)
                    return order === 'asc' ? -1 : 1;
                if(attrA > attrB)
                    return order === 'asc' ? 1 : -1;
                if(attrA === attrB && self._newSort.length > depth+1)
                    return self._compare(a, b, depth+1);

                return 0;
            },

            /**
             * Print Sort
             * @since 2.0.0
             * @param {boolean} reset
             */

            _printSort: function(reset){
                var self = this,
                    order = reset ? self._currentOrder : self._newOrder,
                    targets = self._dom._parent.querySelectorAll(self.selectors.target),
                    nextSibling = targets.length ? targets[targets.length - 1].nextElementSibling : null,
                    frag = document.createDocumentFragment(),
                    target = null,
                    el = null,
                    i = -1;

                self._execAction('_printSort', 0, arguments);

                for (i = 0; el = targets[i]; i++) {
                    var whiteSpace = el.nextSibling;

                    if (el.style.position === 'absolute') continue;

                    if (whiteSpace && whiteSpace.nodeName === '#text') {
                        self._dom._parent.removeChild(whiteSpace);
                    }

                    self._dom._parent.removeChild(el);
                }

                for (i = 0; target = order[i]; i++) {
                    el = target._el;

                    if (self._newSort[0].sortBy === 'default' && self._newSort[0].order === 'desc' && !reset) {
                        var firstChild = frag.firstChild;

                        frag.insertBefore(el, firstChild);
                        frag.insertBefore(document.createTextNode(' '), el);
                    } else {
                        frag.appendChild(el);
                        frag.appendChild(document.createTextNode(' '));
                    }
                }

                nextSibling ? 
                    self._dom._parent.insertBefore(frag, nextSibling) :
                    self._dom._parent.appendChild(frag);

                self._execAction('_printSort', 1, arguments);
            },

            /**
             * Parse Sort
             * @since 2.0.0
             * @param {string} sortString
             * @return {array} newSort
             */

            _parseSort: function(sortString) {
                var self = this,
                    rules = typeof sortString === 'string' ? sortString.split(' ') : [sortString],
                    newSort = [];

                for (var i = 0; i < rules.length; i++) {
                    var rule = typeof sortString === 'string' ? rules[i].split(':') : ['custom', rules[i]],
                        ruleObj = {
                            sortBy: _h._camelCase(rule[0]),
                            order: rule[1] || 'asc'
                        };

                    newSort.push(ruleObj);

                    if (ruleObj.sortBy === 'default' || ruleObj.sortBy === 'random') break;
                }

                return self._execFilter('_parseSort', newSort, arguments);
            },

            /**
             * Parse Effects
             * @since 2.0.0
             * @return {Object} effects
             */

            _parseEffects: function() {
                var self = this,
                    effects = {
                        opacity: '',
                        transformIn: '',
                        transformOut: ''
                    },
                    parse = function(effect, extract, reverse) {
                        if (self.animation.effects.indexOf(effect) > -1) {
                            if (extract) {
                                var propIndex = self.animation.effects.indexOf(effect+'(');

                                if (propIndex > -1) {
                                    var str = self.animation.effects.substring(propIndex),
                                        match = /\(([^)]+)\)/.exec(str),
                                        val = match[1];

                                        return {val: val};
                                }
                            }

                            return true;
                        } else {
                            return false;
                        }
                    },
                    negate = function(value, invert) {
                        if (invert) {
                            return value.charAt(0) === '-' ? value.substr(1, value.length) : '-'+value;
                        } else {
                            return value;
                        }
                    },
                    buildTransform = function(key, invert) {
                        var transforms = [
                            ['scale', '.01'],
                            ['translateX', '20px'],
                            ['translateY', '20px'],
                            ['translateZ', '20px'],
                            ['rotateX', '90deg'],
                            ['rotateY', '90deg'],
                            ['rotateZ', '180deg']
                        ];
                        
                        for (var i = 0; i < transforms.length; i++) {
                            var prop = transforms[i][0],
                                def = transforms[i][1],
                                inverted = invert && prop !== 'scale';
                                
                            effects[key] += parse(prop) ? prop+'('+negate(parse(prop, true).val || def, inverted)+') ' : '';
                        }
                    };

                effects.opacity = parse('fade') ? parse('fade',true).val || '0' : '1';

                buildTransform('transformIn');

                self.animation.reverseOut ? buildTransform('transformOut', true) : (effects.transformOut = effects.transformIn);

                self.animation.stagger = parse('stagger') ? true : false;
                self.animation.staggerDuration = parseInt(parse('stagger') ? (parse('stagger',true).val ? parse('stagger',true).val : 100) : 100);

                return self._execFilter('_parseEffects', effects);
            },

            /**
             * Build State
             * @since 2.0.0
             * @param {boolean} future
             * @return {object} futureState
             */

            _buildState: function(future){
                var self = this,
                    state = {},
                    targets = [],
                    show = [],
                    hide = [];

                self._execAction('_buildState', 0);

                for (var i = 0, target; target = self._targets[i]; i++) {
                    targets.push(target._el);

                    if (target._isShown) {
                        show.push(target._el);
                    } else {
                        hide.push(target._el);
                    }
                }

                state = {
                    activeFilter: self._activeFilter === '' ? 'none' : self._activeFilter,
                    activeSort: future && self._newSortString ? self._newSortString : self._activeSort,
                    hasFailed: !self._show.length && self._activeFilter !== '',
                    targets: targets,
                    show: show,
                    hide: hide,
                    totalTargets: self._targets.length,
                    totalShow: self._show.length,
                    totalHide: self._hide.length,
                    instance: self,
                    display: future && self._newDisplay ? self._newDisplay : self.layout.display
                };

                if (future){
                    return self._execFilter('_buildState', state);
                } else {
                    self._state = state;

                    self._execAction('_buildState', 1);
                }
            },

            /**
             * goMix
             * @param {Boolean} animate
             * @since 2.0.0
             */

            _goMix: function(animate){
                var self = this,
                    started = 0,
                    finished = 0,
                    resolvePromise = null,
                    done = function() {
                        self._cleanUp();

                        self._isMixing = false;

                        resolvePromise && resolvePromise(self._state);
                    },
                    checkProgress = function() {
                        finished++;

                        if (finished === started) {
                            done();
                        }
                    },
                    phase1 = function() {

                    },
                    phase2 = function() {

                    },
                    phase3 = function() {
                        var target = null,
                            posIn = {},
                            posOut = {},
                            toShow = false,
                            i = -1,
                            doneHide = function() {
                                this._hide();

                                checkProgress();
                            };

                        for (i = 0; target = self._show[i]; i++) {
                            posIn = {
                                x: target._isShown ? target._startPosData.x - target._interPosData.x : 0,
                                y: target._isShown ? target._startPosData.y - target._interPosData.y : 0
                            },
                            posOut = {
                                x: target._finalPosData.x - target._interPosData.x,
                                y: target._finalPosData.y - target._interPosData.y
                            },
                            toShow = target._isShown ? false : 'show';

                            if (
                                toShow ||
                                posIn.x !== posOut.x ||
                                posIn.y !== posOut.y
                            ) {
                                started++;
                            }

                            target._show();

                            target._move(posIn, posOut, toShow, i, checkProgress);
                        }

                        for (i = 0; target = self._toHide[i]; i++) {
                            posIn = {
                                x: target._isShown ? target._startPosData.x - target._interPosData.x : 0,
                                y: target._isShown ? target._startPosData.y - target._interPosData.y : 0
                            };

                            started++;

                            target._move(posIn, {x: 0, y: 0}, 'hide', i, checkProgress);
                        }
                    },
                    futureState = self._buildState(true);
                    
                self._execAction('_goMix', 0, arguments);

                !self.animation.duration && (animate = false);

                if (!self._toShow.length && !self._toHide.length && !self._isSorting) {
                    animate = false;            
                }

                self._userPromise = new Promise(function(resolve, reject) {
                    resolvePromise = resolve;
                });

                if (animate && _MixItUp.prototype._has._transitions) {
                    self._effects = self._parseEffects();

                    self._isMixing = true;

                    self._getStartMixData();
                    self._setInter();
                    self._getInterMixData();
                    self._setFinal();
                    self._getFinalMixData();

                    requestAnimationFrame(phase3);
                } else {
                    done();
                }
                
                self._execAction('_goMix', 1, arguments);

                return self._userPromise;
            },

            /**
             * Get Start Mix Data
             * @since 2.0.0
             */

            _getStartMixData: function(){
                var self = this,
                    target = null,
                    data = {},
                    i = -1;

                self._execAction('_getStartMixData', 0);

                for (i = 0; target = self._show[i]; i++) {
                    data = target._getPosData();

                    target._startPosData = data;
                }

                for (i = 0; target = self._toHide[i]; i++) {
                    data = target._getPosData();

                    target._startPosData = data;
                }

                self._execAction('_getStartMixData', 1);
            },

            /**
             * Set Intermediate Positions
             * @since 2.0.0
             */

            _setInter: function(){
                var self = this;

                self._execAction('_setInter', 0);

                for (var i = 0, target; target = self._toShow[i]; i++) {
                    target._show();
                }

                self._execAction('_setInter', 1);
            },

            /**
             * Get Intermediate Mix Data
             * @since 2.0.0
             */

            _getInterMixData: function(){
                var self = this,
                    target = null,
                    data = {},
                    i = -1;

                self._execAction('_getInterMixData', 0);

                for (i = 0; target = self._show[i]; i++) {
                    data = target._getPosData();

                    target._interPosData = data;
                }

                for (i = 0; target = self._toHide[i]; i++) {
                    data = target._getPosData();

                    target._interPosData = data;
                }

                self._execAction('_getInterMixData', 1);
            },

            /**
             * Set Final Positions
             * @since 2.0.0
             */

            _setFinal: function(){
                var self = this;

                self._execAction('_setFinal', 0);

                self._isSorting && self._printSort();

                for (var i = 0, target; target = self._toHide[i]; i++) {
                    target._hide();
                }

                self._execAction('_setFinal', 1);
            },

            /**
             * Get Final Mix Data
             * @since 2.0.0
             */

            _getFinalMixData: function(){
                var self = this,
                    target = null,
                    data = {},
                    i = -1;

                self._execAction('_getFinalMixData', 0);

                for (i = 0; target = self._show[i]; i++) {
                    data = target._getPosData();

                    target._finalPosData = data;
                }

                for (i = 0; target = self._toHide[i]; i++) {
                    data = target._getPosData();

                    target._finalPosData = data;
                }

                if (self._isSorting) {
                    self._printSort(true);
                }

                for (i = 0; target = self._toShow[i]; i++) {
                    target._hide();
                }

                for (i = 0; target = self._toHide[i]; i++) {
                    target._show();
                }

                self._execAction('_getFinalMixData', 1);
            },

            /**
             * Clean Up
             * @since 2.0.0
             */

            _cleanUp: function(){
                var self = this,
                    target = null,
                    i = -1;

                self._execAction('_cleanUp', 0);

                for (i = 0; target = self._show[i]; i++) {
                    target._cleanUp();

                    target._show();
                    target._isShown = true;
                }

                for (i = 0; target = self._toHide[i]; i++) {
                    target._cleanUp();

                    target._hide();
                    target._isShown = false;
                }

                if (self._isSorting) {
                    self._printSort();

                    self._activeSort = self._newSortString;
                    self._currentOrder = self._newOrder;
                    self._newOrder = [];
                    self._isSorting = false;
                }

                self._isRemoving = false;

                self._buildState();

                if(typeof self.callbacks.onMixEnd === 'function'){
                    self.callbacks.onMixEnd.call(self._dom._el, self._state, self);
                }

                self._execAction('_cleanUp', 1);
            },

            /**
             * Get Delay
             * @since 2.0.0
             * @param {number} i
             * @return {number} delay
             */

            _getDelay: function(i){
                var self = this;

                return self._execFilter('_getDelay', delay, arguments);
            },

            /**
             * Parse MultiMix Arguments
             * @since 2.0.0
             * @param {Array} args
             * @return {Object} output
             */

            _parseMultiMixArgs: function(args) {
                var self = this,
                    output = {
                        command: null,
                        animate: self.animation.enable,
                        callback: null
                    };

                for (var i = 0; i < args.length; i++){
                    var arg = args[i];

                    if(arg !== null){
                        if(typeof arg === 'object' || typeof arg === 'string'){
                            output.command = arg;
                        } else if(typeof arg === 'boolean'){
                            output.animate = arg;
                        } else if(typeof arg === 'function'){
                            output.callback = arg;
                        }
                    }
                }

                return self._execFilter('_parseMultiMixArgs', output, arguments);
            },

            /**
             * Parse Insert Arguments
             * @since 2.0.0
             * @param {array} args
             * @return {object} output
             */

            _parseInsertArgs: function(args){
                var self = this,
                    output = {
                        index: 0,
                        collection: [],
                        multiMix: {filter: self._state.activeFilter},
                        callback: null
                    };

                // TODO: allow for nodelists, querylists, and possibily jqcollections

                for (var i = 0; i < args.length; i++) {
                    var arg = args[i];

                    if (typeof arg === 'number') {
                        output.index = arg;
                    } else if (typeof arg === 'object' && _h._isElement(arg)) {
                        output.collection = [arg];
                    } else if (typeof arg === 'object' && arg !== null && arg.length) {
                        output.collection = arg;
                    } else if (typeof arg === 'object' && arg !== null && arg.childNodes && arg.childNodes.length) {
                        output.collection = arg.childNodes;
                    } else if (typeof arg === 'object' && arg !== null) {
                        output.multiMix = arg;
                    } else if (typeof arg === 'boolean' && !arg) {
                        output.multiMix = false;
                    } else if (typeof arg === 'function') {
                        output.callback = arg;
                    }
                }

                return self._execFilter('_parseInsertArgs', output, arguments);
            },

            /**
             * _parseRemoveArgs
             * @since 3.0.0
             * @param {Array} args
             * @return {Object} output
             */

            _parseRemoveArgs: function(args) {
                var self = this,
                    output = {
                        index: -1,
                        selector: '',
                        collection: [],
                        callback: null
                    };

                for (var i = 0; i < args.length; i++) {
                    var arg = args[i];

                    switch (typeof arg) {
                        case 'number':
                            output.index = arg;

                            break;
                        case 'string':
                            output.selector = arg;

                            break;
                        case 'object':
                            if (arg && arg.length) {
                                output.collection = arg;
                            } else if (_h._isElement(arg)) {
                                output.collection = [arg];
                            }

                            break;
                        case 'function':
                            output.callback = arg;
                    }
                }

                return self._execFilter('_parseRemoveArgs', output, arguments);
            },

            /**
             * Execute Action
             * @since 2.0.0
             * @param {string} methodName
             * @param {boolean} isPost
             * @param {array} args
             */

            _execAction: function(methodName, isPost, args) {
                var self = this,
                    context = isPost ? 'post' : 'pre';

                if (!self._actions.isEmptyObject && self._actions.hasOwnProperty(methodName)) {
                    for (var key in self._actions[methodName][context]) {
                        self._actions[methodName][context][key].call(self, args);
                    }
                }
            },

            /**
             * Execute Filter
             * @since 2.0.0
             * @param {string} methodName
             * @param {mixed} value
             * @return {mixed} value
             */

            _execFilter: function(methodName, value, args){
                var self = this;
                
                if (!self._filters.isEmptyObject && self._filters.hasOwnProperty(methodName)) {
                    for (var key in self._filters[methodName]) {
                        return self._filters[methodName][key].call(self, args);
                    }
                } else {
                    return value;
                }
            },

            /* Public Methods
            ---------------------------------------------------------------------- */

            /**
             * init
             * @since 3.0.0
             * @return {Object} promise --> {Object} state
             */

            init: function() {
                var self = this;

                return self._goMix(self.animation.enable);
            },

            /**
             * isMixing
             * @since 2.0.0
             * @return {boolean}
             */

            isMixing: function(){
                var self = this;
                
            },

            /**
             * filter
             * @since 2.0.0
             * @param {array} arguments
             */

            filter: function(){
                var self = this;
            },
            
            /**
             * sort
             * @since 2.0.0
             * @param {array} arguments
             */
            
            sort: function(){
                var self = this;

            },

            /**
             * changeLayout
             * @since 2.0.0
             * @param {array} arguments
             */

            changeLayout: function(){
                var self = this;

            },

            /**
             * multiMix
             * @since 2.0.0
             * @param {array} arguments
             * @return {Object} promise
             */

            multiMix: function() {
                var self = this,
                    args = self._parseMultiMixArgs(arguments),
                    sort = '',
                    filter = '',
                    changeLayout = '';

                self._execAction('multiMix', 0, arguments);

                if (!self._isMixing) {
                    if (self.controls.enable && !self._isClicking && !self._isRemoving) {
                        self._dom._filterToggleButtons.length && self._buildToggleArray(); // TODO: what about live toggles?

                        self._updateControls(args.command);
                    }

                    (self._queue.length < 2) && (self._isClicking = false);

                    delete self.callbacks._user;

                    if (args.callback) self.callbacks._user = args.callback;

                    sort = args.command.sort;
                    filter = args.command.filter;
                    changeLayout = args.command.changeLayout;

                    if (sort) {
                        self._newSort = self._parseSort(sort);
                        self._newSortString = sort;

                        self._isSorting = true;
                        self._sort();
                    }

                    if (filter !== undf) {
                        filter = (filter === 'all') ? self.selectors.target : filter;

                        self._activeFilter = filter;
                    }

                    self._filter();

                    self._execAction('multiMix', 1, arguments);

                    return self._goMix(args.animate ^ self.animation.enable ? args.animate : self.animation.enable);
                } else {
                    // queue
                }
            },

            /**
             * insert
             * @since 2.0.0
             * @param {Array} arguments
             * @return {Object} promise
             */

            insert: function() {
                var self = this,
                    args = self._parseInsertArgs(arguments),
                    callback = (typeof args.callback === 'function') ? args.callback : null,
                    frag = document.createDocumentFragment(),
                    target = null,
                    nextSibling = (function() {                      
                        if (self._targets.length) {
                            return (args.index < self._targets.length || !self._targets.length) ? 
                                self._targets[args.index]._el :
                                self._targets[self._targets.length - 1]._el.nextElementSibling;
                        } else {
                            return self._dom._parent.children.length ? self._dom._parent.children[0] : null;
                        }
                    })();
                            
                self._execAction('insert', 0, arguments);

                if (args.collection) {
                    for(var i = 0, el; el = args.collection[i]; i++) {
                        frag.appendChild(el);
                        frag.appendChild(document.createTextNode(' '));

                        if (!el.matches(self.selectors.target)) continue;

                        target = new _Target();

                        target._init(el, self);

                        self._targets.splice(args.index, 0, target);
                    }

                    self._dom._parent.insertBefore(frag, nextSibling);
                }

                self._currentOrder = self._origOrder = self._targets;

                self._execAction('insert', 1, arguments);

                if (typeof args.multiMix === 'object') {
                    return self.multiMix(args.multiMix, callback);
                }
            },

            /**
             * prepend
             * @since 2.0.0
             * @shorthand self.insert
             * @param {Array} arguments
             * @param {Object} promise
             */

            prepend: function() {
                var self = this,
                    args = self._parseInsertArgs(arguments);
                
                return self.insert(0, args.collection, args.multiMix, args.callback);
            },

            /**
             * append
             * @since 2.0.0
             * @shorthand self.insert
             * @param {array} arguments
             */

            append: function(){
                var self = this,
                    args = self._parseInsertArgs(arguments);
                
                return self.insert(self._state.totalTargets, args.collection, args.multiMix, args.callback);
            },

            /**
             * remove
             * @since 3.0.0
             * @param {Array} arguments
             * @return {Object} promise
             */

            remove: function() {
                var self = this,
                    args = self._parseRemoveArgs(arguments),
                    activeFilterStart = '',
                    multiMix = {
                        filter: {
                            hide: null
                        }
                    },
                    target = null,
                    i = -1

                self._execAction('remove', 0, arguments);

                activeFilterStart = self.getState().activeFilter;

                self._isRemoving = true;

                if (args.collection.length) {
                    multiMix.filter.hide = args.collection;
                } else if (args.index > -1 && self._targets[args.index]) {
                    multiMix.filter.hide = self._targets[args.index]._el;
                } else if (args.selector) {
                    multiMix.filter.hide = args.selector;
                }

                self._execAction('remove', 1, arguments);

                return self.multiMix(multiMix, args.callback)
                    .then(function(state) {
                        if (args.collection.length) {
                            for (i = 0; target = self._targets[i]; i++) {
                                if (args.collection.indexOf(target._el) > -1) {
                                    _h._deleteElement(target._el);

                                    self._targets.splice(i, 1);

                                    i--;
                                }
                            }
                        } else if (args.index > -1 && self._targets[args.index]) {
                            _h._deleteElement(self._targets[args.index]._el);

                            self._targets.splice(args.index, 1);
                        } else if (args.selector) {
                            for (i = 0; target = self._targets[i]; i++) {
                                if (target._el.matches(args.selector)) {
                                    _h._deleteElement(target._el);

                                    self._targets.splice(i, 1);

                                    i--;
                                }
                            }
                        }

                        self._currentOrder = self._origOrder = self._targets;

                        self._activeFilter = activeFilterStart;
                        self._filter();
                        
                        self._buildState();

                        return self._state;
                    });
            },

            /**
             * getOption
             * @since 2.0.0
             * @param {string} string
             * @return {mixed} value
             */

            getOption: function(string){
                var self = this;

            },

            /**
             * setOptions
             * @since 2.0.0
             * @param {object} config
             */

            setOptions: function(config){
                var self = this;

                self._execAction('setOptions', 0, arguments);

                self._execAction('setOptions', 1, arguments);
            },

            /**
             * getState
             * @since 2.0.0
             * @return {object} state
             */

            getState: function(){
                var self = this;

                return self._execFilter('getState', self._state, self);
            },

            /**
             * forceRefresh
             * @since 2.1.2
             */

            forceRefresh: function(){
                var self = this;

                self._indexTargets();
            },

            /**
             * destroy
             * @since 2.0.0
             * @param {boolean} hideAll
             */

            destroy: function(hideAll){
                var self = this;

                self._execAction('destroy', 0, arguments);

                self._execAction('destroy', 1, arguments);
            }
        };

        /**
         * _Target
         * @constructor
         * @since 3.0.0
         */

        _Target = function() {
            var self = this;

            self._execAction('_constructor', 0, arguments);

            _h._extend(self, {
                _el: null,
                _sortString: '',
                _mixer: null,
                _isShown: false,
                _startPosData: null,
                _interPosData: null,
                _finalPosData: null
            });

            self._execAction('_constructor', 1, arguments);
        };

        /**
         * _Target.prototype
         * @prototype
         * @since 3.0.0
         */

        _Target.prototype = {
            constructor: _Target,

            /* Static Properties
            ---------------------------------------------------------------------- */

            _actions: {},
            _filters: {},

            /* Static Methods
            ---------------------------------------------------------------------- */

            /**
             * extend
             * @since 3.0.0
             * @param {object} new properties/methods
             * @extends {object} prototype
             */

            extend: function(extension) {
                for(var key in extension){
                    _Target.prototype[key] = extension[key];
                }
            },

            /**
             * addAction
             * @since 3.0.0
             * @param {string} hook name
             * @param {string} method
             * @param {function} function to execute
             * @param {number} priority
             * @extends {object} _MixItUp.prototype._actions
             */

            addAction: function(hook, name, func, priority) {
                _Target.prototype._addHook('_actions', hook, name, func, priority);
            },

            /**
             * addFilter
             * @since 3.0.0
             * @param {string} hook name
             * @param {string} method
             * @param {function} function to execute
             * @param {number} priority
             * @extends {object} _MixItUp.prototype._filters
             */

            addFilter: function(hook, name, func, priority) {
                _Target.prototype._addHook('_filters', hook, name, func, priority);
            },

            /**
             * _addHook
             * @since 3.0.0
             * @param {string} type of hook
             * @param {string} hook name
             * @param {function} function to execute
             * @param {number} priority
             * @extends {object} _MixItUp.prototype._filters
             */

            _addHook: function(type, hook, name, func, priority) {
                var collection = _Target.prototype[type],
                    obj = {};

                priority = (priority === 1 || priority === 'post') ? 'post' : 'pre';

                obj[hook] = {};
                obj[hook][priority] = {};
                obj[hook][priority][name] = func;

                _h._extend(collection, obj);
            },

            /* Private Properties
            ---------------------------------------------------------------------- */

            _execAction: _MixItUp.prototype._execAction,
            _execFilter: _MixItUp.prototype._execFilter,

            /**
             * _init
             * @since 3.0.0
             * @param {Object} element
             * @param {Object} mixer
             */

            _init: function(el, mixer) {
                var self = this;

                self._execAction('_init', 0, arguments);

                self._el = el;

                self._mixer = mixer;

                !!self._el.style.display && (self._isShown = true);

                self._execAction('_init', 1, arguments);
            },

            /**
             * _getSortString
             * @param {String} attributeName
             * @since 3.0.0
             */

            _getSortString: function(attributeName) {
                var self = this,
                    value = self._el.getAttribute('data-'+attributeName) || '';

                self._execAction('_getSortString', 0, arguments);

                value = isNaN(value * 1) ?
                    value.toLowerCase() :
                    value * 1;

                self._sortString = value;

                self._execAction('_getSortString', 1, arguments);
            },

            /**
             * _show
             * @param {Boolean} animate
             * @since 3.0.0
             */

            _show: function(animate) {
                var self = this;

                self._execAction('_show', 0, arguments);

                !self._el.style.display && (self._el.style.display = self._mixer.layout.display);

                self._execAction('_show', 1, arguments);
            },

            /**
             * _hide
             * @param {Boolean} animate
             * @since 3.0.0
             */

            _hide: function(animate) {
                var self = this;

                self._execAction('_hide', 0, arguments);

                self._el.style.display = '';

                self._execAction('_hide', 1, arguments);
            },

            /**
             * _move         
             * @param {Object} posIn
             * @param {Object} posOut
             * @param [{String} hideShow]
             * @param [{Number} staggerIndex]
             * @param [{Function} callback]
             * @param [{Number} duration]
             * @since 3.0.0
             */

            // TODO: too many args, might need a parse?

            _move: function(posIn, posOut, hideShow, staggerIndex, callback, duration) {
                var self = this,
                    transitionRules = [],
                    transformValues = [],
                    transformString = '',
                    fading = self._mixer._effects.opacity !== undf,
                    writeTransitionRule = function(rule) {
                        var delay = staggerIndex * self._mixer.animation.staggerDelay;

                        return rule + ' ' +
                            (duration || self._mixer.animation.duration) + 'ms ' +
                            self._mixer.animation.staggerDelay + 'ms ' +
                            (rule === 'opacity' ? 'linear' : self._mixer.animation.easing);
                    },
                    applyStyles = function() {
                        transformValues = [];

                        transitionRules.push(writeTransitionRule(_MixItUp.prototype._transformRule, staggerIndex));

                        if (hideShow) {
                            transitionRules.push(writeTransitionRule('opacity', staggerIndex));
                        }

                        if (
                            hideShow ||
                            posIn.x !== posOut.x ||
                            posIn.y !== posOut.y
                        ) {
                            self._bind(callback);
                        }

                        self._transition(transitionRules);

                        transformValues.push('translate('+posOut.x+'px, '+posOut.y+'px)');

                        if (hideShow === 'hide') {
                            fading && (self._el.style.opacity = self._mixer._effects.opacity);

                            transformValues.push(self._mixer._effects.transformOut);
                        } else if (hideShow === 'show') {
                            fading && (self._el.style.opacity = 1);
                        }

                        self._el.style[_MixItUp.prototype._transformProp] = transformValues.join(' ');
                    };

                self._execAction('_move', 0, arguments);

                transformValues.push('translate('+posIn.x+'px, '+posIn.y+'px)');                

                if (hideShow === 'hide') {
                    fading && (self._el.style.opacity = 1);
                } else if (hideShow === 'show') {
                    fading && (self._el.style.opacity = self._mixer._effects.opacity);

                    transformValues.push(self._mixer._effects.transformIn);
                }

                self._el.style[_MixItUp.prototype._transformProp] = transformValues.join(' ');

                requestAnimationFrame(applyStyles);

                self._execAction('_move', 1, arguments);
            },

            /**
             * _transition
             * @param {Array} rules
             * @since 3.0.0
             */

            _transition: function(rules) {
                var self = this,
                    transitionString = rules.join(', ');

                self._execAction('_transition', 0, arguments);

                self._el.style[_MixItUp.prototype._transitionProp] = transitionString;

                self._execAction('_transition', 1, arguments);
            },

            /**
             * _bind
             * @param {String} transitionProp
             * @param {Function} callback
             * @since 3.0.0
             */

            _bind: function(callback) {
                var self = this,
                    eventName = _MixItUp.prototype._prefix === 'webkit' ? 'webkitTransitionEnd' : 'transitionend',
                    action = function(e) {
                        if (
                            (e.propertyName.indexOf('transform') > -1 ||
                            e.propertyName.indexOf('opacity') > -1) &&
                            e.target.matches(self._mixer.selectors.target)
                        ) {
                            _h._off(self._el, eventName, action);

                            callback.call(self);
                        }
                    };

                self._execAction('_bind', 0, arguments);

                _h._on(self._el, eventName, action);

                self._execAction('_bind', 1, arguments);
            },

            /**
             * _getPosData
             * @since 3.0.0
             */

            _getPosData: function() {
                var self = this,
                    posData = {
                        x: self._el.offsetLeft,
                        y: self._el.offsetTop
                    };

                self._execAction('_getPosData', 0, arguments);

                if (self._mixer.animation.animateResizeTargets) {
                    styles = window.getComputedStyle(self._el);

                    posData.marginBottom = parseInt(styles.marginBottom);
                    posData.marginRight = parseInt(styles.marginRight);
                    posData.width = el.offsetWidth;
                    posData.height = el.offsetHeight;
                }

                return self._execFilter('_getPosData', posData, arguments);
            },

            /**
             * _cleanUp
             */

            _cleanUp: function() {
                var self = this;

                self._execAction('_cleanUp', 0, arguments);

                self._el.style[_MixItUp.prototype._transformProp] = '';
                self._el.style[_MixItUp.prototype._transitionProp] = '';
                self._el.style.opacity = '';

                self._execAction('_cleanUp', 1, arguments);
            }
        };

        /* Helpers
        ---------------------------------------------------------------------- */

        _h = {

            /**
             * _hasClass
             * @since 3.0.0
             */

            _hasClass: function(el, cls) {
                return el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
            },

            /**
             * _addClass
             * @since 3.0.0
             */

            _addClass: function(el, cls) {
                if (!this._hasClass(el, cls)) el.className += el.className ? ' '+cls : cls;
            },

            /**
             * _removeClass
             * @since 3.0.0
             */

            _removeClass: function(el, cls) {
                if (this._hasClass(el, cls)) {
                    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                    el.className = el.className.replace(reg, ' ').trim();
                }
            },

            /**
             * _extend
             * @since 3.0.0
             */

            _extend: function(destination, source) {
                var copy = function(destination, source) {
                    for (var property in source) {
                        if (
                            typeof source[property] === "object" && 
                            source[property] !== null &&
                            typeof source[property].length === 'undefined'
                        ) {
                            destination[property] = destination[property] || {};

                            copy(destination[property], source[property]);
                        } else {
                            destination[property] = source[property];
                        }
                    }
                };

                copy(destination, source);

                return destination;
            },

            /**
             * _on
             * @since 3.0.0
             */

            _on: function(el, type, fn, useCapture) {
                if (!el) return;

                if (el.attachEvent) {
                    el['e'+type+fn] = fn;
                    el[type+fn] = function(){el['e'+type+fn](window.event);};
                    el.attachEvent('on'+type, el[type+fn]);
                } else
                    el.addEventListener(type, fn, useCapture);
            },

            /**
             * _off
             * @since 3.0.0
             */

            _off: function(el, type, fn) {
                if (!el) return;
                
                if (el.detachEvent) {
                    el.detachEvent('on'+type, el[type+fn]);
                    el[type+fn] = null;
                } else
                    el.removeEventListener(type, fn, false);
            },

            /**
             * _index 
             */

            _index: function(el, selector) {
                var i = 0;

                while((el = el.previousElementSibling)!== null) {
                    if (!selector || el.matches(selector)) {
                        ++i;   
                    }
                }
                return i;
            },

            /**
             * _camelCase
             * @since 2.0.0
             * @param {string}
             * @return {string}
             */

            _camelCase: function(string){
                return string.replace(/-([a-z])/g, function(g){
                        return g[1].toUpperCase();
                });
            },

            /**
             * _isElement
             * @since 2.1.3
             * @param {object} element to test
             * @return {boolean}
             */

            _isElement: function(el){
                if(window.HTMLElement){
                    return el instanceof HTMLElement;
                } else {
                    return (
                        el !== null && 
                        el.nodeType === 1 &&
                        el.nodeName === 'string'
                    );
                }
            },

            /**
             * _createElement
             */

            _createElement: function(htmlString) {
                var frag = document.createDocumentFragment(),
                    temp = document.createElement('div');

                temp.innerHTML = htmlString;

                while (temp.firstChild) {
                    frag.appendChild(temp.firstChild);
                }

                return frag;
            },

            /**
             * _deleteElement
             */

            _deleteElement: function(el) {
                if (el.parentElement) {
                    el.parentElement.removeChild(el);
                }
            },

            /**
             * _throttle
             */

            _throttle: function(func, wait, options) {
                var context = null,
                    args = null,
                    result = null,
                    timeout = null,
                    previous = 0,
                    later = function() {
                        previous = options.leading === false ? 0 : new Date();
                        timeout = null;
                        result = func.apply(context, args);
                    };

                options || (options = {});
                
                return function() {
                    var now = new Date(),
                        remaining = null,
                        args = arguments;
                  
                    if (!previous && options.leading === false) previous = now;
                  
                    remaining = wait - (now - previous);
                    context = this;
                    
                    if (remaining <= 0) {
                        clearTimeout(timeout);
                        timeout = null;
                        previous = now;
                        result = func.apply(context, args);
                    } else if (!timeout && options.trailing !== false) {
                        timeout = setTimeout(later, remaining);
                    }

                    return result;
                };
            },

            /**
             * _position
             * @param {Object} el
             * @return {Object} position
             */

            _position: function(el) {
                var xPosition = 0,
                    yPosition = 0;
              
                while (el) {
                    xPosition += el.offsetLeft;
                    yPosition += el.offsetTop;
                    el = el.offsetParent;
                }

                return { x: xPosition, y: yPosition };
            },

            /**
             * _closestParent
             * @param {Object} el
             * @param {String} selector
             * @param {Boolean} includeSelf
             */

            _closestParent: function(el, selector, includeSelf) {
                var parent = el.parentNode;

                if (includeSelf && el.matches(selector)) {
                    return el;
                }

                while (parent && parent != document.body) {
                    if (parent.matches && parent.matches(selector)) {
                        return parent;
                    } else if (parent.parentNode) {
                        parent = parent.parentNode;
                    } else {
                        return null;
                    }
                }

                return null;
            },

            /**
             * _forEach
             * @param {Array} items
             * @param {Function} callback(item)
             */

            _forEach: function(items, callback) {
                for (var i = 0, item; item = items[i]; i++) {
                    (typeof callback === 'function') && callback.call(this, item);
                }
            },

            /**
             * _clean
             * @param {Array} originalArray
             * @return {Array} cleanArray
             */

            _clean: function(originalArray) {
                var cleanArray = [];

                for (var i = 0; i < originalArray.length; i++) {
                    if (originalArray[i]) {
                        cleanArray.push(originalArray[i]);
                    }
                }

                return cleanArray;
            }

        };

        /* mixItUp Public API
        ---------------------------------------------------------------------- */

        mixItUp = function(container, config) {
            var el = null,
                instance = null,
                id = '',
                rand = function(){
                    return ('00000'+(Math.random()*16777216<<0).toString(16)).substr(-6).toUpperCase();
                };

            switch (typeof container) {
                case 'string':
                    el = document.querySelectorAll(container)[0];

                    break;
                case 'object':
                    el = container;

                    break;
                default:
                    console.error('[MixItUp] Invalid selector or element.');
            }

            if (!el.id) {
                id = 'MixItUp' + rand();

                el.id = id;
            } else {
                id = el.id;
            }

            if (_MixItUp.prototype._instances[id] == undf) {
                // todo: check that el has been touched by mixitup

                instance = new _MixItUp(el, config);

                instance._init(el, config);

                _MixItUp.prototype._instances[id] = instance;
            } else if (_MixItUp.prototype._instances[id] instanceof _MixItUp) {
                instance = _MixItUp.prototype._instances[id];

                // todo: warn if sending config and trying to reconfigure 
            }

            return instance;
        };

        _MixItUp.prototype._platformDetect();

        _MixItUp.prototype._h = _h;
        _MixItUp.prototype._Target = _Target;
        _MixItUp.prototype.mixItUp = mixItUp;

        window._MixItUp = _MixItUp;
    }

    /* Module Definitions
    ---------------------------------------------------------------------- */

    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = mixItUp;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return mixItUp;
        });
    } else if (window.mixItUp === undf || typeof window.mixItUp !== 'function') {
        window.mixItUp = mixItUp;
    }
})(window);
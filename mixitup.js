/**!
 * MixItUp v3.0.0-beta
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
	'use strict'

	/**
	 * MixItUp Constructor Function
	 * @constructor
	 */
	
	var MixItUp = function(el, config) {
		var self = this;
		
		self._execAction('_constructor', 0);
		
		_helpers._extend(self, {
			
			/* Public Properties
			---------------------------------------------------------------------- */
			
			selectors: {
				target: '.mix',
				filter: '.filter',
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
				onMixLoad: false,
				onMixStart: false,
				onMixBusy: false,
				onMixEnd: false,
				onMixFail: false,
				_user: false
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

			/* DOM
			---------------------------------------------------------------------- */

			_dom: {
				_body: null,
				_container: null,
				_targets: [],
				_parent: null,
				_sortButtons: [],
				_filterButtons: []
			},

			/* Private Properties
			---------------------------------------------------------------------- */
		
			_isSuckMode: false,
			_isMixing: false,
			_isSorting: false,
			_isClicking: false,
			_isLoading: true,
			_isChangingLayout: false,
			_isChangingClass: false,
			_isChangingDisplay: false,
			
			_targets: [],
			_show: [],
			_hide: [],
			_toShow: [],
			_toHide: [],
			_toMove: [],

			_origOrder: [],
			_startOrder: [],
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
			_queue: [],
		});
	
		self._execAction('_constructor', 1);

		self._init(el, config);
	};
	
	/**
	 * MixItUp Prototype
	 * @override
	 */
	
	MixItUp.prototype = {
		constructor: MixItUp,
		
		/* Static Properties
		---------------------------------------------------------------------- */
		
		_prefix: '',
		_transformProp: 'transform',
		_transformRule: 'transform',
		_transitionProp: 'transition',

		_is: {},
		_has: {},

		_instances: [],

		_handled: {_filter: {}, _sort: {}},
		_bound: {_filter: {}, _sort: {}},
		
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
			for(var key in extension){
				MixItUp.prototype[key] = extension[key];
			}
		},
		
		/**
		 * Add Action
		 * @since 2.1.0
		 * @param {string} hook name
		 * @param {string} namespace
		 * @param {function} function to execute
		 * @param {number} priority
		 * @extends {object} $.MixItUp.prototype._actions
		 */
		
		addAction: function(hook, name, func, priority) {
			MixItUp.prototype._addHook('_actions', hook, name, func, priority);
		},
		
		/**
		 * Add Filter
		 * @since 2.1.0
		 * @param {string} hook name
		 * @param {string} namespace
		 * @param {function} function to execute
		 * @param {number} priority
		 * @extends {object} $.MixItUp.prototype._filters
		 */
		
		addFilter: function(hook, name, func, priority) {
			MixItUp.prototype._addHook('_filters', hook, name, func, priority);
		},
		
		/**
		 * Add Hook
		 * @since 2.1.0
		 * @param {string} type of hook
		 * @param {string} hook name
		 * @param {function} function to execute
		 * @param {number} priority
		 * @extends {object} $.MixItUp.prototype._filters
		 */
		
		_addHook: function(type, hook, name, func, priority) {
			var collection = MixItUp.prototype[type],
				obj = {};
				
			priority = (priority === 1 || priority === 'post') ? 'post' : 'pre';
				
			obj[hook] = {};
			obj[hook][priority] = {};
			obj[hook][priority][name] = func;

			_helpers._extend(true, collection, obj);
		},

		/**
		 * Platform Detect
		 * @since 2.0.0
		 */
		
		_platformDetect: function() {
			var self = this,
				testEl = document.createElement('div'),
				vendorsTrans = ['Webkit', 'Moz', 'O', 'ms'],
				vendorsRAF = ['webkit', 'moz'],
				getPrefix = function(el){
					for (var i = 0; i < vendorsTrans.length; i++){
						if (vendorsTrans[i] + 'Transition' in el.style){
							return vendorsTrans[i].toLowerCase();
						};
					}; 
					return 'transition' in el.style ? '' : false;
				},
				prefix = getPrefix(testEl);


			MixItUp.prototype._has._transition = prefix !== false;
			MixItUp.prototype._prefix = prefix;
			MixItUp.prototype._transition = prefix ? prefix + 'Transition' : 'transition';
			MixItUp.prototype._transformProp = prefix ? prefix + 'Transform' : 'transform';
			MixItUp.prototype._transformRule = prefix ? '-' + prefix + '-transform' : 'transform';
			
			/* Polyfills
			---------------------------------------------------------------------- */
			
			/**
			 * window.requestAnimationFrame
			 */
			
			for(var x = 0; x < vendorsRAF.length && !window.requestAnimationFrame; x++){
				window.requestAnimationFrame = window[vendorsRAF[x]+'RequestAnimationFrame'];
			}

			/**
			 * Object.getPrototypeOf
			 */

			if (typeof Object.getPrototypeOf !== 'function') {
				if (typeof 'test'.__proto__ === 'object'){
					Object.getPrototypeOf = function(object) {
						return object.__proto__;
					};
				} else {
					Object.getPrototypeOf = function(object) {
						return object.constructor.prototype;
					};
				}
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
					var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
			 
					while (nodes[++i] && nodes[i] != node);
			 
					return !!nodes[i];
				}
			})(Element.prototype);
			
			self._execAction('_platformDetect', 1);
		},
		
		
		/* Private Methods
		---------------------------------------------------------------------- */
		
		/**
		 * init
		 * @since 2.0.0
		 * @param {Object} el
		 * @param {Object} config
		 */
		
		_init: function(el, config) {
			var self = this;
			
			self._execAction('_init', 0, arguments);

			config && _helpers._extend(self, config);

			self._dom._body = document.getElementsByTagName('body')[0];
			self._dom._container = el;
			self._dom._parent = el;
			
			self.layout.containerClass && _helpers._addClass(el, self.layout.containerClass);
			
			self._id = el.id;

			self.animation.enable = MixItUp.prototype._has._transition;

			self._indexTargets(true);

			self._activeFilter = self.load.filter === 'all' ? 
				self.selectors.target :
				self.load.filter === 'none' ?
					'' :
					self.load.filter;

			self._filter();

			self._goMix(self.animation.enable);

			MixItUp.prototype._instances.push(self); // TODO: better to abstract this to a higher API, along with init

			self._execAction('_init', 1, arguments);
		},
		
		/**
		 * _indexTargets
		 * @since 3.0.0
		 */
		
		_indexTargets: function(init){
			var self = this;
				
			self._execAction('_indexTargets', 0, arguments);

			self._dom._targets = self._dom._container.querySelectorAll(self.selectors.target);

			for (var i = 0, el; el = self._dom._targets[i]; i++) {
				var target = new _Target();

				target._init(el);
				target._mixer = self;

				self._targets.push(target);
			}

			if (init && self._dom._targets.length) {
				self._dom._parent = self._dom._targets[0].parentElement.isEqualNode(self._dom._container) ?
					self._dom._container :
					self._dom._targets[0].parentElement;
			}
			
			self._execAction('_indexTargets', 1, arguments);
		},
		
		/**
		 * Bind Handlers
		 * @since 2.0.0
		 */
		
		_bindHandlers: function(){
			var self = this;
			
			self._execAction('_bindHandlers', 0);
			
			self._execAction('_bindHandlers', 1);
		},
		
		/**
		 * Process Click
		 * @since 2.0.0
		 * @param {object} $button
		 * @param {string} type
		 */
		
		_processClick: function($button, type){
			var self = this;
			
			self._execAction('_processClick', 0, arguments);
				
			self._execAction('_processClick', 1, arguments);

			// or
			
			self._execAction('_processClickBusy', 1, arguments);
		},
		
		/**
		 * Build Toggle Array
		 * @since 2.0.0
		 */
		
		_buildToggleArray: function(){
			var self = this;
			
			self._execAction('_buildToggleArray', 0, arguments);
			
			self._execAction('_buildToggleArray', 1, arguments);
		},
		
		/**
		 * Update Controls
		 * @since 2.0.0
		 * @param {object} command
		 * @param {boolean} multi
		 */
		
		_updateControls: function(command, multi){
			var self = this;
				
			self._execAction('_updateControls', 0, arguments);
				
			self._execAction('_updateControls', 1, arguments);
		},
		
		/**
		 * Filter (private)
		 * @since 2.0.0
		 */
		
		_filter: function(){
			var self = this;
			
			self._execAction('_filter', 0);

			self._show = [];
			self._hide = [];
			self._toShow = [];
			self._toHide = [];

			for (var i = 0, target; target = self._targets[i]; i++) {
				if (target._el.matches(self._activeFilter)) {
					self._show.push(target);

					!target._isShown && self._toShow.push(target);
				} else {
					self._hide.push(target);

					target._isShown && self._toHide.push(target);
				}
			}
			
			self._execAction('_filter', 1);
		},
		
		/**
		 * Sort (private)
		 * @since 2.0.0
		 */
		
		_sort: function(){
			var self = this;

			self._execAction('_sort', 0);
			
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
			
		},
		
		/**
		 * Print Sort
		 * @since 2.0.0
		 * @param {boolean} reset
		 */
		
		_printSort: function(reset){
			var self = this;
				
			self._execAction('_printSort', 0, arguments);
				
			self._execAction('_printSort', 1, arguments);
		},
		
		/**
		 * Parse Sort
		 * @since 2.0.0
		 * @param {string} sortString
		 * @return {array} newSort
		 */
		
		_parseSort: function(sortString){
			var self = this;
			
			return self._execFilter('_parseSort', newSort, arguments);
		},
		
		/**
		 * Parse Effects
		 * @since 2.0.0
		 * @return {object} effects
		 */
		
		_parseEffects: function(){
			var self = this;

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
				state = {};
			
			self._execAction('_buildState', 0);
			
			self._execAction('_buildState', 1);	
		},
		
		/**
		 * goMix
		 * @param {boolean} animate
		 * @since 2.0.0
		 */
		
		_goMix: function(animate){
			var self = this,
				started = 0,
				done = 0,
				checkProgress = function() {
					done++;

					if (done === started) {
						self._cleanUp();
					}
				},
				phase1 = function() {

				},
				phase2 = function() {

				},
				phase3 = function() {
					for (var i = 0, target; target = self._toShow[i]; i++) {
						started++;

						target._show();

						target._move(0, 0, true, 'show', i, function() {
							checkProgress();
						});
					}

					for (var i = 0, target; target = self._toHide[i]; i++) {
						started++;

						target._move(0, 0, true, 'hide', i, function() {
							this._hide();
							checkProgress();
						});
					}
				};
				
			self._execAction('_goMix', 0, arguments);

			self._isMixing = true;

			self._getOrigMixData();
			self._setInter();
			self._getInterMixData();
			self._setFinal();
			self._getFinalMixData();

			requestAnimationFrame(phase3);
			
			self._execAction('_goMix', 1, arguments);
		},
		
		/**
		 * Get Original Mix Data
		 * @since 2.0.0
		 */
		
		_getOrigMixData: function(){
			var self = this;
			
			self._execAction('_getOrigMixData', 0);

			for (var i = 0, target; target = self._show[i]; i++) {
				var data = target._getPosData();

				target._startPosData = data;
			}

			for (var i = 0, target; target = self._toHide[i]; i++) {
				var data = target._getPosData();

				target._startPosData = data;
			}
			
			self._execAction('_getOrigMixData', 1);
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
			var self = this;
			
			self._execAction('_getInterMixData', 0);

			for (var i = 0, target; target = self._show[i]; i++) {
				var data = target._getPosData();

				target._interPosData = data;
			}

			for (var i = 0, target; target = self._toHide[i]; i++) {
				var data = target._getPosData();

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
			var self = this;
			
			self._execAction('_getFinalMixData', 0);

			for (var i = 0, target; target = self._show[i]; i++) {
				var data = target._getPosData();

				target._finalPosData = data;
			}

			for (var i = 0, target; target = self._toHide[i]; i++) {
				var data = target._getPosData();

				target._finalPosData = data;
			}

			for (var i = 0, target; target = self._toShow[i]; i++) {
				target._hide();
			}

			for (var i = 0, target; target = self._toHide[i]; i++) {
				target._show();
			}
			
			self._execAction('_getFinalMixData', 1);
		},
		
		/**
		 * Clean Up
		 * @since 2.0.0
		 */
		
		_cleanUp: function(){
			var self = this;
				
			self._execAction('_cleanUp', 0);

			for (var i = 0, target; target = self._show[i]; i++) {
				target._cleanUp();

				target._isShown = true;
			}

			for (var i = 0, target; target = self._toHide[i]; i++) {
				target._cleanUp();

				target._isShown = false;
			}

			self._isMixing = true;
			
			self._execAction('_cleanUp', 1);
		},
		
		/**
		 * Get Prefixed CSS
		 * @since 2.0.0
		 * @param {string} property
		 * @param {string} value
		 * @param {boolean} prefixValue
		 * @return {object} styles
		 */
		
		_getPrefixedCSS: function(property, value, prefixValue){
			var self = this;
			
			return self._execFilter('_getPrefixedCSS', styles, arguments);
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
		 * @param {array} args
		 * @return {object} output
		 */
		
		_parseMultiMixArgs: function(args){
			var self = this;
			
			return self._execFilter('_parseMultiMixArgs', output, arguments);
		},
		
		/**
		 * Parse Insert Arguments
		 * @since 2.0.0
		 * @param {array} args
		 * @return {object} output
		 */
		
		_parseInsertArgs: function(args){
			var self = this;
			
			return self._execFilter('_parseInsertArgs', output, arguments);
		},
		
		/**
		 * Execute Action
		 * @since 2.0.0
		 * @param {string} methodName
		 * @param {boolean} isPost
		 * @param {array} args
		 */
		
		_execAction: function(methodName, isPost, args){
			var self = this;

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
			
		},
		
		/* Public Methods
		---------------------------------------------------------------------- */
		
		/**
		 * Is Mixing
		 * @since 2.0.0
		 * @return {boolean}
		 */
		
		isMixing: function(){
			var self = this;
			
		},
		
		/**
		 * Filter (public)
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		filter: function(){
			var self = this;

		},
		
		/**
		 * Sort (public)
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		sort: function(){
			var self = this;

		},

		/**
		 * Change Layout (public)
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		changeLayout: function(){
			var self = this;

		},
		
		/**
		 * MultiMix
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		multiMix: function(){
			var self = this;

		},
		
		/**
		 * Insert
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		insert: function(){
			var self = this;

		},

		/**
		 * Prepend
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		prepend: function(){
			var self = this;

		},
		
		/**
		 * Append
		 * @since 2.0.0
		 * @param {array} arguments
		 */
		
		append: function(){
			var self = this;

		},
		
		/**
		 * Get Option
		 * @since 2.0.0
		 * @param {string} string
		 * @return {mixed} value
		 */
		
		getOption: function(string){
			var self = this;

		},
		
		/**
		 * Set Options
		 * @since 2.0.0
		 * @param {object} config
		 */
		
		setOptions: function(config){
			var self = this;
			
			self._execAction('setOptions', 0, arguments);
			
			self._execAction('setOptions', 1, arguments);
		},
		
		/**
		 * Get State
		 * @since 2.0.0
		 * @return {object} state
		 */
		
		getState: function(){
			var self = this;
			
			return self._execFilter('getState', self._state, self);
		},
		
		/**
		 * Force Refresh
		 * @since 2.1.2
		 */
		
		forceRefresh: function(){
			var self = this;
			
		},
		
		/**
		 * Destroy
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
	 * _Target Constructor
	 * @constructor
	 * @since 3.0.0
	 */
	
	var _Target = function() {
		var self = this;

		_helpers._extend(self, {
			_el: null,
			_sortString: '',
			_mixer: null,
			_isShown: false,
			_startPosData: null,
			_interPosData: null,
			_finalPosData: null
		});
	};

	/**
	 * _Target Prototype
	 * @prototype
	 * @since 3.0.0
	 */
	
	_Target.prototype = {
		constructor: _Target,

		/**
		 * _init
		 * @since 3.0.0
		 */

		_init: function(el) {
			var self = this;

			self._el = el;
		},

		/**
		 * _getSortString
		 * @param {String} attributeName
		 * @since 3.0.0
		 */

		_getSortString: function(attributeName) {
			var self = this,
				value = self._el.getAttribute('data-'+attributeName) || '';

			value = isNaN(value * 1) ?
				value.toLowerCase() :
				value * 1;

			self._sortString = value;
		},

		/**
		 * _show
		 * @param {Boolean} animate
		 * @since 3.0.0
		 */

		_show: function(animate) {
			var self = this;

			self._el.style.display = self._mixer.layout.display;
		},

		/**
		 * _hide
		 * @param {Boolean} animate
		 * @since 3.0.0
		 */

		_hide: function(animate) {
			var self = this;

			self._el.style.display = '';
		},

		/**
		 * _move		 
		 * @param {Number} x
		 * @param {Number} y
		 * @param [{Boolean} animate]
		 * @param [{String} hideShow]
		 * @param [{Number} staggerIndex]
		 * @param [{Function} callback]
		 * @since 3.0.0
		 */

		_move: function(x, y, animate, hideShow, staggerIndex, callback) {
			var self = this,
				transitionRules = [],
				writeRule = function(rule) {
					var delay = staggerIndex * self._mixer.animation.staggerDelay;

					return rule + ' ' +
						self._mixer.animation.duration + 'ms ' +
						self._mixer.animation.staggerDelay + 'ms ' +
						self._mixer.animation.easing;
				},
				applyStyles = function() {
					if (animate) {
						transitionRules.push(writeRule(MixItUp.prototype._transformRule, staggerIndex));

						if (hideShow) {
							transitionRules.push(writeRule('opacity', staggerIndex));
						}

						self._bind(callback);

						self._transition(transitionRules);
					}

					if (x || y) {
						self._el.style[MixItUp.prototype.transformProp] = 'translate3d('+x+'px, '+y+', 0)';
					}

					if (animate && hideShow === 'hide') {
						self._el.style.opacity = 0;
					} else if (animate && hideShow === 'show') {
						self._el.style.opacity = 1;
					}
				};

				if (animate && hideShow === 'hide') {
					self._el.style.opacity = 1;
				} else if (animate && hideShow === 'show') {
					self._el.style.opacity = 0;
				}

				if (animate) {
					requestAnimationFrame(applyStyles);
				} else {
					applyStyles();
				}
		},

		/**
		 * _transition
		 * @param {Array} rules
		 * @since 3.0.0
		 */

		_transition: function(rules) {
			var self = this,
				transitionString = rules.join(', ');

			self._el.style[MixItUp.prototype._transitionProp] = transitionString;
		},

		/**
		 * _bind
		 * @param {String} transitionProp
		 * @param {Function} callback
		 * @since 3.0.0
		 */

		_bind: function(callback) {
			var self = this,
				eventName = MixItUp.prototype._prefix === 'webkit' ? 'webkitTransitionEnd' : 'transitionend',
				action = function(e) {
					if (
						(e.propertyName.indexOf('transform') > -1 ||
						e.propertyName.indexOf('opacity') > -1) &&
						e.target.matches(self._mixer.selectors.target)
					) {
						_helpers._off(self._el, eventName, action);

						callback.call(self);
					}
				};

			_helpers._on(self._el, eventName, action);
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

			if (self._mixer.animation.animateResizeTargets) {
				styles = window.getComputedStyle(self._el);

				posData.marginBottom = parseInt(styles.marginBottom);
				posData.marginRight = parseInt(styles.marginRight);
				posData.width = el.offsetWidth;
				posData.height = el.offsetHeight;
			}

			return posData;
		},

		/**
		 * _cleanUp
		 */

		_cleanUp: function() {
			var self = this;

			self._el.style[MixItUp.prototype._transformProp] = '';
			self._el.style[MixItUp.prototype._transitionProp] = '';
			self._el.style.opacity = '';
		}
	};

	
	/* Helpers
	---------------------------------------------------------------------- */

	var _helpers = {

		/**
         * hasClass
         * @since 3.0.0
         */

        _hasClass: function(el, cls) {
            return el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },

        /**
         * addClass
         * @since 3.0.0
         */

        _addClass: function(el, cls) {
            if (!this._hasClass(el, cls)) el.className += el.className ? ' '+cls : cls;
        },

        /**
         * removeClass
         * @since 3.0.0
         */

        _removeClass: function(el, cls) {
            if (this._hasClass(el, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                el.className = el.className.replace(reg, ' ').trim();
            }
        },

        /**
         * extend
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
         * on
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
         * off
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
		 * CamelCase
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
		 * Is Element
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
		}
	};

	MixItUp.prototype._platformDetect();

	if (typeof exports === 'object' && typeof module === 'object') {
		module.exports = MixItUp;
	} else if (typeof define === 'function' && define.amd) {
		return MixItUp;
	} else {
		window.MixItUp = MixItUp;
	}
	
})(window);
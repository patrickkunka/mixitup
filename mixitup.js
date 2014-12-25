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
				_filterButtons: []
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
			_userPromise: null,
			_effects: null,
			_queue: [],
			_state: null
		});
	
		self._execAction('_constructor', 1);
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

			_helpers._extend(collection, obj);
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

			MixItUp.prototype._has._promises = typeof Promise !== "undefined" && Promise.toString().indexOf('[native code]') !== -1;
			MixItUp.prototype._has._transitions = prefix !== false;

			MixItUp.prototype._is._crapIe = window.atob && self._prefix ? false : true;

			MixItUp.prototype._prefix = prefix;
			MixItUp.prototype._transitionProp = prefix ? prefix + 'Transition' : 'transition';
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

			self.animation.enable = MixItUp.prototype._has._transitions;

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

			self._filter();

			self._buildState();

			self._bindHandlers();

			MixItUp.prototype._instances.push(self); // TODO: better to abstract this to a higher API, along with init

			self._execAction('_init', 1, arguments);

			return self._goMix(self.animation.enable);
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

				self._origOrder = self._targets;
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
					};

					return newArray; 
				};
				
			self._execAction('_sort', 0);
			
			self._startOrder = [];
			
			for (var i = 0, target; target = self._targets[i]; i++) {
				self._startOrder.push(target);
			}
			
			switch (self._newSort[0].sortBy) {
				case 'default':
					self._newOrder = self._origOrder;
					break;
				case 'random':
					self._newOrder = arrayShuffle(self._startOrder);
					break;
				case 'custom':
					self._newOrder = self._newSort[0].order;
					break;
				default:
					self._newOrder = self._startOrder.concat().sort(function(a, b){
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
				order = reset ? self._startOrder : self._newOrder,
				targets = self._dom._parent.querySelectorAll(self.selectors.target),
				nextSibling = targets.length ? targets[targets.length - 1].nextElementSibling : null,
				frag = document.createDocumentFragment();

			self._execAction('_printSort', 0, arguments);
			
			for (var i = 0, el; el = targets[i]; i++) {
				var whiteSpace = el.nextSibling;

				if (el.style.position === 'absolute') continue;
			
				if (whiteSpace && whiteSpace.nodeName === '#text') {
					self._dom._parent.removeChild(whiteSpace);
				}
				
				self._dom._parent.removeChild(el);
			}
			
			for (var i = 0, target; target = order[i]; i++) {
				var el = target._el;

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
						sortBy: _helpers._camelCase(rule[0]),
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
						['rotateZ', '180deg'],
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
		 * @param {boolean} animate
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
					for (var i = 0, target; target = self._show[i]; i++) {
						var posIn = {
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

						target._move(posIn, posOut, toShow, i, function() {
							checkProgress();
						});
					}

					for (var i = 0, target; target = self._toHide[i]; i++) {
						var posIn = {
								x: target._isShown ? target._startPosData.x - target._interPosData.x : 0,
								y: target._isShown ? target._startPosData.y - target._interPosData.y : 0
							};

						started++;

						target._move(posIn, {x: 0, y: 0}, 'hide', i, function() {
							this._hide();

							checkProgress();
						});
					}
				},
				futureState = self._buildState(true);
				
			self._execAction('_goMix', 0, arguments);

			!self.animation.duration && (animate = false);

			if (!self._toShow.length && !self._toHide.length && !self._isSorting) {
				animate = false;			
			}

			if (animate && MixItUp.prototype._has._transitions) {
				self._effects = self._parseEffects();

				self._userPromise = new Promise(function(resolve, reject) {
					resolvePromise = resolve;
				});

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
			var self = this;
			
			self._execAction('_getStartMixData', 0);

			for (var i = 0, target; target = self._show[i]; i++) {
				var data = target._getPosData();

				target._startPosData = data;
			}

			for (var i = 0, target; target = self._toHide[i]; i++) {
				var data = target._getPosData();

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

			if (self._isSorting) {
				self._printSort(true);
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

			if (self._isSorting) {
				self._printSort();

				self._activeSort = self._newSortString;
				self._isSorting = false;
			}

			self._buildState();
			
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

		self._execAction('_constructor', 0, arguments);

		_helpers._extend(self, {
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
	 * _Target Prototype
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
		 * Extend
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
		 * Add Action
		 * @since 3.0.0
		 * @param {string} hook name
		 * @param {string} namespace
		 * @param {function} function to execute
		 * @param {number} priority
		 * @extends {object} $.MixItUp.prototype._actions
		 */
		
		addAction: function(hook, name, func, priority) {
			_Target.prototype._addHook('_actions', hook, name, func, priority);
		},
		
		/**
		 * Add Filter
		 * @since 3.0.0
		 * @param {string} hook name
		 * @param {string} namespace
		 * @param {function} function to execute
		 * @param {number} priority
		 * @extends {object} $.MixItUp.prototype._filters
		 */
		
		addFilter: function(hook, name, func, priority) {
			_Target.prototype._addHook('_filters', hook, name, func, priority);
		},
		
		/**
		 * Add Hook
		 * @since 3.0.0
		 * @param {string} type of hook
		 * @param {string} hook name
		 * @param {function} function to execute
		 * @param {number} priority
		 * @extends {object} $.MixItUp.prototype._filters
		 */
		
		_addHook: function(type, hook, name, func, priority) {
			var collection = _Target.prototype[type],
				obj = {};
				
			priority = (priority === 1 || priority === 'post') ? 'post' : 'pre';
				
			obj[hook] = {};
			obj[hook][priority] = {};
			obj[hook][priority][name] = func;

			_helpers._extend(collection, obj);
		},

		/* Public Properties
		---------------------------------------------------------------------- */

		_execAction: MixItUp.prototype._execAction,
		_execFilter: MixItUp.prototype._execFilter,

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
		 * @param {Object} posIn
		 * @param {Object} posOut
		 * @param [{String} hideShow]
		 * @param [{Number} staggerIndex]
		 * @param [{Function} callback]
		 * @since 3.0.0
		 */

		_move: function(posIn, posOut, hideShow, staggerIndex, callback) {
			var self = this,
				transitionRules = [],
				transformValues = [],
				transformString = '',
				fading = self._mixer._effects.opacity !== undf,
				writeTransitionRule = function(rule) {
					var delay = staggerIndex * self._mixer.animation.staggerDelay;

					return rule + ' ' +
						self._mixer.animation.duration + 'ms ' +
						self._mixer.animation.staggerDelay + 'ms ' +
						(rule === 'opacity' ? 'linear' : self._mixer.animation.easing);
				},
				applyStyles = function() {
					transformValues = [];

					transitionRules.push(writeTransitionRule(MixItUp.prototype._transformRule, staggerIndex));

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

					self._el.style[MixItUp.prototype._transformProp] = transformValues.join(' ');
				};

			transformValues.push('translate('+posIn.x+'px, '+posIn.y+'px)');				

			if (hideShow === 'hide') {
				fading && (self._el.style.opacity = 1);
			} else if (hideShow === 'show') {
				fading && (self._el.style.opacity = self._mixer._effects.opacity);

				transformValues.push(self._mixer._effects.transformIn);
			}

			self._el.style[MixItUp.prototype._transformProp] = transformValues.join(' ');

			requestAnimationFrame(applyStyles);
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
		},

		/**
         * createElement
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
         * throttle
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
        }
	};

	MixItUp.prototype._platformDetect();

	if (typeof exports === 'object' && typeof module === 'object') {
		module.exports = MixItUp;
	} else if (typeof define === 'function' && define.amd) {
		define(MixItUp);
	} else {
		window.MixItUp = MixItUp;
		window._mixItUpHelpers = _helpers;
		window._mixItUpTarget = _Target;
	}
	
})(window);
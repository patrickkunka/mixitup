/* global mixitup, h */

/**
 * The `mixitup.Mixer` class is used to construct discreet user-configured
 * instances of MixItUp around the provided container element(s). Other
 * than the intial `mixitup()` factory function call, which returns an
 * instance of a mixer, all other public API functionality is performed
 * on mixer instances.
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @public
 * @since       3.0.0
 */

mixitup.Mixer = function() {
    this.execAction('construct', 0);

    this.animation          = new mixitup.ConfigAnimation();
    this.callbacks          = new mixitup.ConfigCallbacks();
    this.controls           = new mixitup.ConfigControls();
    this.debug              = new mixitup.ConfigDebug();
    this.extensions         = new mixitup.ConfigExtensions();
    this.layout             = new mixitup.ConfigLayout();
    this.libraries          = new mixitup.ConfigLibraries();
    this.load               = new mixitup.ConfigLoad();
    this.selectors          = new mixitup.ConfigSelectors();

    this._id                = '';

    this._isMixing          = false;
    this._isClicking        = false;
    this._isToggling        = false;
    this._incPadding        = true;

    this._targets           = [];
    this._origOrder         = [];

    this._toggleArray       = [];
    this._toggleString      = '';

    this._targetsMoved      = 0;
    this._targetsImmovable  = 0;
    this._targetsBound      = 0;
    this._targetsDone       = 0;

    this._staggerDuration   = 0;
    this._effectsIn         = null;
    this._effectsOut        = null;
    this._transformIn       = [];
    this._transformOut      = [];
    this._queue             = [];

    this._handler           = null;
    this._state             = null;
    this._lastOperation     = null;
    this._lastClicked       = null;
    this._userCallback      = null;
    this._userPromise       = null;

    this._dom               = new mixitup.MixerDom();

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.Mixer.prototype = Object.create(new mixitup.BasePrototype());

h.extend(mixitup.Mixer.prototype,
/** @lends mixitup.Mixer */
{
    constructor: mixitup.Mixer,

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Element}       el
     * @param   {object}        config
     * @return  {mixitup.State}
     */

    _init: function(el, config) {
        var self        = this,
            state       = new mixitup.State(),
            operation   = new mixitup.Operation();

        self.execAction('_init', 0, arguments);

        config && h.extend(self, config, true);

        self._cacheDom(el);

        self.layout.containerClass && h.addClass(el, self.layout.containerClass);

        self.animation.enable = self.animation.enable && mixitup.features.has.transitions;

        self._indexTargets();

        // Map in whatever state values we can

        state.activeFilter = self.load.filter === 'all' ?
            self.selectors.target :
            self.load.filter === 'none' ?
                '' :
                self.load.filter;

        state.activeSort            = self.load.sort;
        state.activeContainerClass  = self.layout.containerClass;
        state.totalTargets          = self._targets.length;

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

        // TODO: the initial state should be fully mapped, but as the operation is fake we don't have this data

        // state.totalShow         = operation.show.length
        // state.totalHide         = operation.hide.length
        // state.totalMatching     = operation.matching.length;

        self._updateControls({
            filter: state.activeFilter,
            sort: state.activeSort
        });

        self._parseEffects();

        self._bindEvents();

        self._buildToggleArray(null, state);

        return self.execFilter('_init', state, arguments);
    },

    /**
     * Caches references of DOM elements neccessary for the mixer's functionality.
     *
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Element} el
     * @return  {void}
     */

    _cacheDom: function(el) {
        var self    = this,
            button  = null,
            i       = -1;

        self.execAction('_cacheDom', 0, arguments);

        self._dom.body      = self._dom.document.getElementsByTagName('body')[0];
        self._dom.container = el;
        self._dom.parent    = el;

        self._dom.allButtons =
            Array.prototype.slice.call(self._dom.document.querySelectorAll(self.selectors.control));

        for (i = 0; button = self._dom.allButtons[i]; i++) {
            if (button.matches('[data-filter][data-sort]')) {
                self._dom.multiMixButtons.push(button);
            } else if (button.matches('[data-filter]')) {
                self._dom.filterButtons.push(button);
            } else if (button.matches('[data-sort]')) {
                self._dom.sortButtons.push(button);
            } else if (button.matches('[data-toggle]')) {
                self._dom.filterToggleButtons.push(button);
            }
        }

        self.execAction('_cacheDom', 1, arguments);
    },

    /**
     * Indexes all child elements of the mixer matching the `selectors.target`
     * selector, instantiating a mixitup.Target for each one.
     *
     * @private
     * @instance
     * @since   3.0.0
     * @return  {void}
     */

    _indexTargets: function() {
        var self    = this,
            target  = null,
            el      = null,
            i       = -1;

        self.execAction('_indexTargets', 0, arguments);

        self._dom.targets = self.layout.allowNestedTargets ?
            self._dom.container.querySelectorAll(self.selectors.target) :
            h.children(self._dom.container, self.selectors.target, self._dom.document);

        self._dom.targets = Array.prototype.slice.call(self._dom.targets);

        self._targets = [];

        if (self._dom.targets.length) {
            for (i = 0; el = self._dom.targets[i]; i++) {
                target = new mixitup.Target();

                target.init(el, self);

                self._targets.push(target);
            }

            self._dom.parent = self._dom.targets[0].parentElement.isEqualNode(self._dom.container) ?
                self._dom.container :
                self._dom.targets[0].parentElement;
        }

        self._origOrder = self._targets;

        self.execAction('_indexTargets', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @return  {void}
     */

    _bindEvents: function() {
        var self            = this,
            controlTypes    = ['filterToggle', 'multiMix', 'filter', 'sort'],
            button          = null,
            counter         = null,
            selector        = '',
            type            = '',
            i               = -1;

        self.execAction('_bindEvents', 0);

        self._handler = function(e) {
            return self._eventBus(e);
        };

        if (self.controls.live) {
            h.on(window, 'click', self._handler);
        } else {
            for (i = 0; button = self._dom.allButtons[i]; i++) {
                h.on(button, 'click', self._handler);
            }
        }

        // For each mixitup.Mixer instance, increment the total number of bound
        // instances. When a button is clicked, all instances must be handled
        // before a button is changed to its active state.

        for (i = 0; type = controlTypes[i]; i++) {
            counter     = mixitup.bound[type];
            selector    = self.selectors[type];

            if (typeof counter[selector] === 'undefined') {
                counter[selector] = 1;
            } else {
                counter[selector]++;
            }
        }

        self.execAction('_bindEvents', 1);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @return  {void}
     */

    _unbindEvents: function() {
        var self    = this,
            button  = null,
            i       = -1;

        self.execAction('_unbindEvents', 0);

        h.off(window, 'click', self._handler);

        for (i = 0; button = self._dom.allButtons[i]; i++) {
            h.on(button, 'click', self._handler);
        }

        self.execAction('_unbindEvents', 1);
    },

    /**
     * @private
     * @instance
     * @param   {Event}            e
     * @return  {(Boolean|void)}
     */

    _eventBus: function(e) {
        var self = this;

        self.execAction('_eventBus', 0);

        switch(e.type) {
            case 'click':
                return self._handleClick(e);
        }

        self.execAction('_eventBus', 1);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Event}  e
     * @return  {void}
     *
     * Determines the type of operation needed and the
     * appropriate parameters when a button is clicked
     */

    _handleClick: function(e) {
        var self            = this,
            command         = null,
            returnValue     = null,
            method          = '',
            isTogglingOff   = false,
            button          = null;

        self.execAction('_handleClick', 0, arguments);

        if (
            self._isMixing &&
            (!self.animation.queue || self._queue.length >= self.animation.queueLimit)
        ) {
            if (h.canReportErrors(self)) {
                console.warn(mixitup.messages[201]);
            }

            mixitup.events.fire('mixBusy', self._dom.container, {
                state: self._state,
                instance: self
            }, self._dom.document);

            if (typeof self.callbacks.onMixBusy === 'function') {
                self.callbacks.onMixBusy.call(self._dom.container, self._state, self);
            }

            self.execAction('_handleClickBusy', 1, arguments);

            return;
        }

        button = h.closestParent(
            e.target,
            self.selectors.control,
            true,
            Infinity,
            self._dom.document
        );

        if (!button) {
            self.execAction('_handleClick', 1, arguments);

            return;
        }

        self._isClicking = true;

        // This will be automatically mapped into the new operation's future
        // state, but that has not been generated at this point, so we manually
        // add it to the previous state for the following callbacks/events:

        self._state.triggerElement = button;

        // Expose the original event to callbacks and events so that any default
        // behavior can be cancelled (e.g. an <a> being used as a control as a
        // progressive enhancement):

        mixitup.events.fire('mixClick', self._dom.container, {
            state: self._state,
            instance: self,
            originalEvent: e
        }, self._dom.document);

        if (typeof self.callbacks.onMixClick === 'function') {
            returnValue = self.callbacks.onMixClick.call(button, self._state, self, e);

            if (returnValue === false) {
                // The callback has returned false, so do not execute the default action

                return;
            }
        }

        method = self._determineButtonMethod(button);

        switch (method) {
            case 'sort':
                command = self._handleSortClick(button);

                break;
            case 'filter':
                command = self._handleFilterClick(button);

                break;
            case 'filterToggle':
                if (h.hasClass(button, self.controls.activeClass)) {
                    isTogglingOff = true;
                }

                command = self._handleFilterToggleClick(button);

                break;
            case 'multiMix':
                command = self._handleMultiMixClick(button);

                break;
        }

        if (method && command) {
            self._trackClick(button, method, isTogglingOff);

            self.multiMix(command);
        }

        self.execAction('_handleClick', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Element} button
     * @return  {string}
     */

    _determineButtonMethod: function(button) {
        var self        = this,
            method      = '';

        self.execAction('_determineButtonMethod', 0, arguments);

        if (button.matches('[data-filter][data-sort]')) {
            method = 'multiMix';
        } else if (button.matches('[data-filter]')) {
            method = 'filter';
        } else if (button.matches('[data-sort]')) {
            method = 'sort';
        } else if (button.matches('[data-toggle]')) {
            method = 'filterToggle';
        }

        return self.execFilter('_determineButtonMethod', method, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Element}   button
     * @return  {object|null}
     */

    _handleSortClick: function(button) {
        var self        = this,
            returnValue = null,
            sortString  = '',
            el          = null,
            i           = -1;

        self.execAction('_handleSortClick', 0, arguments);

        sortString = button.getAttribute('data-sort');

        if (
            !h.hasClass(button, self.controls.activeClass) ||
            sortString.indexOf('random') > -1
        ) {
            for (i = 0; el = self._dom.sortButtons[i]; i++) {
                h.removeClass(el, self.controls.activeClass);
            }

            for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
                h.removeClass(el, self.controls.activeClass);
            }

            returnValue = {
                sort: sortString
            };
        }

        return self.execFilter('_handleSortClick', returnValue, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Element}   button
     * @return  {object|null}
     */

    _handleFilterClick: function(button) {
        var self    = this,
            command = null,
            el      = null,
            i       = -1;

        self.execAction('_handleFilterClick', 0, arguments);

        if (!h.hasClass(button, self.controls.activeClass)) {
            for (i = 0; el = self._dom.filterButtons[i]; i++) {
                h.removeClass(el, self.controls.activeClass);
            }

            for (i = 0; el = self._dom.filterToggleButtons[i]; i++) {
                h.removeClass(el, self.controls.activeClass);
            }

            for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
                h.removeClass(el, self.controls.activeClass);
            }

            if (self._isToggling) {
                // If we were previously toggling, we are not now,
                // so remove any selectors from the toggle array

                self._isToggling = false;
            }

            // Reset any active toggles regardless of whether we were toggling or not,
            // as an API method could have caused toggle buttons to become active

            self._toggleArray.length = 0;

            command = {
                filter: button.getAttribute('data-filter')
            };
        }

        return self.execFilter('_handleFilterClick', command, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Element}   button
     * @return  {object|null}
     */

    _handleFilterToggleClick: function(button) {
        var self            = this,
            toggleSeperator = '',
            filterString    = '',
            command         = null,
            el              = null,
            i               = -1;

        self.execAction('_handleFilterToggleClick', 0, arguments);

        toggleSeperator = self.controls.toggleLogic === 'or' ? ',' : '';

        if (!self._isToggling) {
            // There were no toggles active previously active

            for (i = 0; el = self._dom.filterToggleButtons[i]; i++) {
                h.removeClass(el, self.controls.activeClass);
            }

            self._toggleArray.length    = 0; // Reset any previously active toggles
            self._isToggling            = true;
        }

        filterString = button.getAttribute('data-toggle');

        for (i = 0; el = self._dom.filterButtons[i]; i++) {
            h.removeClass(el, self.controls.activeClass);
        }

        for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
            h.removeClass(el, self.controls.activeClass);
        }

        // Add or remove filters as needed

        if (!h.hasClass(button, self.controls.activeClass)) {
            self._toggleArray.push(filterString);
        } else {
            self._toggleArray.splice(self._toggleArray.indexOf(filterString), 1);
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
            command =  {
                filter: self._toggleString
            };
        }

        return self.execFilter('_handleFilterToggleClick', command, arguments);
    },

    /**
     * @private
     * @instance
     * @since 3.0.0
     * @param   {Element}   button
     * @return  {object|null}
     */

    _handleMultiMixClick: function(button) {
        var self     = this,
            command  = null,
            el       = null,
            i        = -1;

        self.execAction('_handleMultiMixClick', 0, arguments);

        if (!h.hasClass(button, self.controls.activeClass)) {
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

            if (self._isToggling) {
                // If we were previously toggling, we are not now,
                // so remove any selectors from the toggle array

                self._isToggling            = false;
                self._toggleArray.length    = 0;
            }

            // Update any matching individual filter and sort
            // controls to reflect the multiMix

            self._updateControls(command);
        }

        return self.execFilter('_handleMultiMixClick', command, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Element}   button
     * @param   {string}    method
     * @param   {boolean}   isTogglingOff
     * @return  {void}
     */

    _trackClick: function(button, method, isTogglingOff) {
        var self        = this,
            selector    = self.selectors[method];

        self._lastClicked = button;

        // Add the active class to a button only once
        // all mixitup.Mixer instances have handled the click

        mixitup.handled[method][selector] =
            (typeof mixitup.handled[method][selector] === 'undefined') ?
                1 : mixitup.handled[method][selector] + 1;

        if (mixitup.handled[method][selector] === mixitup.bound[method][selector]) {
            if (isTogglingOff) {
                h.removeClass(button, self.controls.activeClass);
            } else {
                h.addClass(button, self.controls.activeClass);
            }

            delete mixitup.handled[method][selector];
        }
    },

    /**
     * Breaks compound selector strings in an array of discreet selectors,
     * as per the active `controls.toggleLogic` configuration option. Accepts
     * either a dynamic command object, or a state object.
     *
     * @private
     * @instance
     * @since   2.0.0
     * @param   {object}        [command]
     * @param   {mixitup.State} [state]
     * @return  {void}
     */

    _buildToggleArray: function(command, state) {
        var self            = this,
            activeFilter    = '',
            filter          = '',
            i               = -1;

        self.execAction('_buildToggleArray', 0, arguments);

        if (command && typeof command.filter === 'string') {
            activeFilter = command.filter.replace(/\s/g, '');
        } else if (state) {
            activeFilter = state.activeFilter.replace(/\s/g, '');
        } else {
            return;
        }

        activeFilter = activeFilter === self.selectors.target ? '' : activeFilter;

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

        self.execAction('_buildToggleArray', 1, arguments);
    },

    /**
     * Updates controls to their active/inactive state based on the command or
     * current state of the mixer.
     *
     * @private
     * @instance
     * @since   2.0.0
     * @param   {object} command
     * @return  {void}
     */

    _updateControls: function(command) {
        var self                = this,
            filterToggleButton  = null,
            activeButton        = null,
            output              = null,
            button              = null,
            selector            = '',
            i                   = -1,
            j                   = -1;

        output = {
            filter: command && command.filter,
            sort: command && command.sort
        };

        self.execAction('_updateControls', 0, arguments);

        (typeof output.filter === 'undefined') && (output.filter = self._state.activeFilter);
        (typeof output.sort === 'undefined') && (output.sort = self._state.activeSort);
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

        if (self._dom.filterToggleButtons.length) {
            for (i = 0; button = self._dom.filterToggleButtons[i]; i++) {
                h.removeClass(button, self.controls.activeClass);

                if (button.matches('[data-filter="' + output.filter + '"]')) {
                    h.addClass(button, self.controls.activeClass);
                }
            }

            for (i = 0; selector = self._toggleArray[i]; i++) {
                activeButton = null;

                if (self.controls.live) {
                    activeButton = self._dom.document
                        .querySelector(self.selectors.filterToggle + '[data-filter="' + selector + '"]');
                } else {
                    for (j = 0; filterToggleButton = self._dom.filterToggleButtons[j]; j++) {
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

        self.execAction('_updateControls', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {object}        command
     * @param   {Operation}     operation
     * @return  {Promise.<mixitup.State>}
     */

    _insert: function(command, operation) {
        var self        = this,
            nextSibling = null,
            frag        = null,
            target      = null,
            el          = null,
            i           = -1;

        self.execAction('insert', 0, arguments);

        if (typeof command.index === 'undefined') command.index = 0;

        nextSibling = self._getNextSibling(command.index, command.sibling, command.position);
        frag        = self._dom.document.createDocumentFragment();

        if (command.collection) {
            for (i = 0; el = command.collection[i]; i++) {
                if (self._dom.targets.indexOf(el) > -1) {
                    throw new Error(mixitup.messages[151]);
                }

                // Ensure elements are hidden when they are added to the DOM, so they can
                // be animated in gracefully

                el.style.display = 'none';

                frag.appendChild(el);
                frag.appendChild(self._dom.document.createTextNode(' '));

                if (!h.isElement(el, self._dom.document) || !el.matches(self.selectors.target)) continue;

                target = new mixitup.Target();

                target.init(el, self);

                self._targets.splice(command.index, 0, target);

                command.index++;
            }

            self._dom.parent.insertBefore(frag, nextSibling);
        }

        // Since targets have been added, the original order must be updated

        operation.startOrder = self._origOrder = self._targets;

        self.execAction('insert', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Number}      [index]
     * @param   {Element}     [sibling]
     * @param   {string}      [position]
     * @return  {Element}
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

        if (self._targets.length && typeof index !== 'undefined') {
            return (index < self._targets.length || !self._targets.length) ?
                self._targets[index].dom.el :
                self._targets[self._targets.length - 1].dom.el.nextElementSibling;
        } else {
            return self._dom.parent.children.length ? self._dom.parent.children[0] : null;
        }
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    _filter: function(operation) {
        var self        = this,
            condition   = false,
            index       = -1,
            target      = null,
            i           = -1;

        self.execAction('_filter', 0, arguments);

        for (i = 0; target = operation.newOrder[i]; i++) {
            if (typeof operation.newFilter === 'string') {
                // show via selector

                condition = operation.newFilter === '' ?
                    false : target.dom.el.matches(operation.newFilter);

                self._evaluateHideShow(
                    condition,
                    target,
                    false,
                    operation
                );
            } else if (
                typeof operation.newFilter === 'object' &&
                h.isElement(operation.newFilter, self._dom.document)
            ) {
                // show via element

                self._evaluateHideShow(
                    target.dom.el === operation.newFilter,
                    target,
                    false,
                    operation
                );
            } else if (
                typeof operation.newFilter === 'object' &&
                operation.newFilter.length
            ) {
                // show via collection

                self._evaluateHideShow(
                    operation.newFilter.indexOf(target.dom.el) > -1,
                    target,
                    false,
                    operation
                );
            }
        }

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

        operation.matching = operation.show.slice();

        if (operation.show.length === 0 && operation.newFilter !== '' && self._targets.length !== 0) {
            operation.hasFailed = true;
        }

        self.execAction('_filter', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {boolean}   condition
     * @param   {Element}   target
     * @param   {boolean}   isRemoving
     * @param   {Operation} operation
     * @return  {void}
     */

    _evaluateHideShow: function(condition, target, isRemoving, operation) {
        var self = this;

        if (condition) {
            if (isRemoving && typeof operation.startFilter === 'string') {
                self._evaluateHideShow(
                    target.dom.el.matches(operation.startFilter),
                    target,
                    false,
                    operation
                );
            } else {
                operation.show.push(target);

                !target.isShown && operation.toShow.push(target);
            }
        } else {
            operation.hide.push(target);

            target.isShown && operation.toHide.push(target);
        }
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    _sort: function(operation) {
        var self = this;

        self.execAction('_sort', 0, arguments);

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

        self.execAction('_sort', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {mixitup.Target}    a
     * @param   {mixitup.Target}    b
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
     * Reads the values of any data attributes present the provided target element
     * which match the current sort command.
     *
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Element}           target
     * @param   {number}            depth
     * @param   {ParsedSort}        [sort]
     * @return  {(String|Number)}
     */

    _getAttributeValue: function(target, depth, sort) {
        var self    = this,
            value   = '';

        sort = sort ? sort : self._newSort;

        value = target.dom.el.getAttribute('data-' + sort[depth].sortBy);

        if (value === null) {
            if (h.canReportErrors(self)) {
                // Encourage users to assign values to all
                // targets to avoid erroneous sorting when
                // types are mixed

                console.warn(mixitup.messages[250]);
            }
        }

        // If an attribute is not present, return 0 as a safety value

        return value || 0;
    },

    /**
     * Inserts elements into the DOM in the appropriate
     * order using a document fragment for minimal
     * DOM thrashing
     *
     * @private
     * @instance
     * @since   2.0.0
     * @param   {boolean}   isResetting
     * @param   {Operation} operation
     * @return  {void}
     */

    _printSort: function(isResetting, operation) {
        var self        = this,
            order       = isResetting ? operation.startOrder : operation.newOrder,
            targets     = h.children(self._dom.parent, self.selectors.target, self._dom.document),
            nextSibling = targets.length ? targets[targets.length - 1].nextElementSibling : null,
            frag        = self._dom.document.createDocumentFragment(),
            target      = null,
            whiteSpace  = null,
            el          = null,
            i           = -1;

        self.execAction('_printSort', 0, arguments);

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

            el = target.dom.el;

            frag.appendChild(el);
            frag.appendChild(self._dom.document.createTextNode(' '));
        }

        // Insert the document fragment into the container
        // before any other non-target elements

        nextSibling ?
            self._dom.parent.insertBefore(frag, nextSibling) :
            self._dom.parent.appendChild(frag);

        self.execAction('_printSort', 1, arguments);
    },

    /**
     * Parses user-defined sort commands (i.e. `default:asc`) into useable "rules".
     *
     * @private
     * @instance
     * @since   2.0.0
     * @param   {string}    sortString
     * @return  {String[]}
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

        return self.execFilter('_parseSort', newSort, arguments);
    },

    /**
     * Parses all effects out of the user-defined `animation.effects` string into
     * their respective properties and units.
     *
     * @private
     * @instance
     * @since   2.0.0
     * @return  {void}
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

        for (transformName in mixitup.transformDefaults) {
            if (!(mixitup.transformDefaults[transformName] instanceof mixitup.TransformData)) {
                continue;
            }

            self._parseEffect(transformName, effectsIn, self._effectsIn, self._transformIn);
            self._parseEffect(transformName, effectsOut, self._effectsOut, self._transformOut, true);
        }

        self._parseEffect('stagger', effectsIn, self._effectsIn, self._transformIn);
        self._parseEffect('stagger', effectsOut, self._effectsOut, self._transformOut, true);
    },

    /**
     * @private
     * @instance
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
            throw new Error(mixitup.messages[101]);
        }

        if (effectString.indexOf(effectName) < 0) {
            // The effect is not present in the effects string

            if (effectName === 'stagger') {
                // Reset stagger to 0

                self._staggerDuration = 0;
            }

            return;
        }

        // The effect is present

        propIndex = effectString.indexOf(effectName + '(');

        if (propIndex > -1) {
            // The effect has a user defined value in parentheses

            // Extract from the first parenthesis to the end of string

            str = effectString.substring(propIndex);

            // Match any number of characters between "(" and ")"

            match = re.exec(str);

            val = match[1];
        }

        switch (effectName) {
            case 'fade':
                effects.opacity = val ? parseFloat(val) : 0;

                break;
            case 'stagger':
                self._staggerDuration = val ? parseFloat(val) : 100;

                // TODO: Currently stagger must be applied globally, but
                // if seperate values are specified for in/out, this should
                // be respected

                break;
            default:
                // All other effects are transforms following the same structure

                if (isOut && self.animation.reverseOut && effectName !== 'scale') {
                    effects[effectName].value =
                        (val ? parseFloat(val) : mixitup.transformDefaults[effectName].value) * -1;
                } else {
                    effects[effectName].value =
                        (val ? parseFloat(val) : mixitup.transformDefaults[effectName].value);
                }

                if (val) {
                    for (i = 0; unit = units[i]; i++) {
                        if (val.indexOf(unit) > -1) {
                            effects[effectName].unit = unit;

                            break;
                        }
                    }
                } else {
                    effects[effectName].unit = mixitup.transformDefaults[effectName].unit;
                }

                transform.push(
                    effectName +
                    '(' +
                    effects[effectName].value +
                    effects[effectName].unit +
                    ')'
                );
        }
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {State}
     */

    _buildState: function(operation) {
        var self        = this,
            state       = new mixitup.State(),
            target      = null,
            i           = -1;

        self.execAction('_buildState', 0);

        // Map target elements into state arrays.
        // the real target objects should never be exposed

        for (i = 0; target = self._targets[i]; i++) {
            if (!operation.toRemove.length || operation.toRemove.indexOf(target) < 0) {
                state.targets.push(target.dom.el);
            }
        }

        for (i = 0; target = operation.matching[i]; i++) {
            state.matching.push(target.dom.el);
        }

        for (i = 0; target = operation.show[i]; i++) {
            state.show.push(target.dom.el);
        }

        for (i = 0; target = operation.hide[i]; i++) {
            if (!operation.toRemove.length || operation.toRemove.indexOf(target) < 0) {
                state.hide.push(target.dom.el);
            }
        }

        state.activeFilter         = operation.newFilter;
        state.activeSort           = operation.newSortString;
        state.activeContainerClass = operation.newContainerClass;
        state.hasFailed            = operation.hasFailed;
        state.totalTargets         = self._targets.length;
        state.totalShow            = operation.show.length;
        state.totalHide            = operation.hide.length;
        state.totalMatching        = operation.matching.length;
        state.triggerElement       = self._lastClicked;

        return self.execFilter('_buildState', state, arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {boolean}   shouldAnimate
     * @param   {Operation} operation
     * @return  {void}
     */

    _goMix: function(shouldAnimate, operation) {
        var self            = this;

        self.execAction('_goMix', 0, arguments);

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

        mixitup.events.fire('mixStart', self._dom.container, {
            state: operation.startState,
            futureState: operation.newState,
            instance: self
        }, self._dom.document);

        if (typeof self.callbacks.onMixStart === 'function') {
            self.callbacks.onMixStart.call(
                self._dom.container,
                operation.startState,
                operation.newState,
                self
            );
        }

        h.removeClass(self._dom.container, self.layout.containerClassFail);

        if (shouldAnimate && mixitup.features.has.transitions) {
            // If we should animate and the platform supports
            // transitions, go for it

            self._isMixing = true;

            if (window.pageYOffset !== operation.docState.scrollTop) {
                window.scrollTo(operation.docState.scrollLeft, operation.docState.scrollTop);
            }

            if (self.animation.applyPerspective) {
                self._dom.parent.style[mixitup.features.perspectiveProp] =
                    self.animation.perspectiveDistance;

                self._dom.parent.style[mixitup.features.perspectiveOriginProp] =
                    self.animation.perspectiveOrigin;
            }

            if (self.animation.animateResizeContainer || operation.startHeight === operation.newHeight) {
                self._dom.parent.style.height = operation.startHeight + 'px';
            }

            if (self.animation.animateResizeContainer || operation.startWidth === operation.newWidth) {
                self._dom.parent.style.width = operation.startWidth + 'px';
            }

            requestAnimationFrame(function() {
                self._moveTargets(operation);
            });
        } else {
            // Abort

            self._cleanUp(operation);
        }

        self.execAction('_goMix', 1, arguments);

        return self._userPromise.promise;
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    _getStartMixData: function(operation) {
        var self        = this,
            parentStyle = window.getComputedStyle(self._dom.parent),
            parentRect  = self._dom.parent.getBoundingClientRect(),
            target      = null,
            data        = {},
            i           = -1,
            boxSizing   = parentStyle[mixitup.features.boxSizingProp];

        self._incPadding = (boxSizing === 'border-box');

        self.execAction('_getStartMixData', 0);

        for (i = 0; target = operation.show[i]; i++) {
            data = target.getPosData();

            operation.showPosData[i] = {
                startPosData: data
            };
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            data = target.getPosData();

            operation.toHidePosData[i] = {
                startPosData: data
            };
        }

        operation.startX = parentRect.left;
        operation.startY = parentRect.top;

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

        self.execAction('_getStartMixData', 1);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    _setInter: function(operation) {
        var self    = this,
            target  = null,
            i       = -1;

        self.execAction('_setInter', 0);

        for (i = 0; target = operation.toShow[i]; i++) {
            target.show();
        }

        if (operation.willChangeLayout) {
            h.removeClass(self._dom.container, operation.startContainerClass);
            h.addClass(self._dom.container, operation.newContainerClass);
        }

        self.execAction('_setInter', 1);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    _getInterMixData: function(operation) {
        var self    = this,
            target  = null,
            i       = -1;

        self.execAction('_getInterMixData', 0);

        for (i = 0; target = operation.show[i]; i++) {
            operation.showPosData[i].interPosData = target.getPosData();
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            operation.toHidePosData[i].interPosData = target.getPosData();
        }

        self.execAction('_getInterMixData', 1);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    _setFinal: function(operation) {
        var self    = this,
            target  = null,
            i       = -1;

        self.execAction('_setFinal', 0);

        operation.willSort && self._printSort(false, operation);

        for (i = 0; target = operation.toHide[i]; i++) {
            target.hide();
        }

        self.execAction('_setFinal', 1);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
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

        self.execAction('_getFinalMixData', 0, arguments);

        for (i = 0; target = operation.show[i]; i++) {
            operation.showPosData[i].finalPosData = target.getPosData();
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            operation.toHidePosData[i].finalPosData = target.getPosData();
        }

        operation.newX = parentRect.left;
        operation.newY = parentRect.top;

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
            target.show();
        }

        if (operation.willChangeLayout && self.animation.animateChangeLayout) {
            h.removeClass(self._dom.container, operation.newContainerClass);
            h.addClass(self._dom.container, self.layout.containerClass);
        }

        self.execAction('_getFinalMixData', 1, arguments);
    },

    /**
     * @private
     * @instance
     * @since    3.0.0
     * @param    {Operation}     operation
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

            posData.posIn.x     = target.isShown ? posData.startPosData.x - posData.interPosData.x : 0;
            posData.posIn.y     = target.isShown ? posData.startPosData.y - posData.interPosData.y : 0;

            posData.posOut.x = posData.finalPosData.x - posData.interPosData.x;
            posData.posOut.y = posData.finalPosData.y - posData.interPosData.y;

            if (self.animation.balanceContainerShift) {
                // TODO: Needs further testing/investigation

                posData.posOut.x += (operation.startX - operation.newX);
                posData.posOut.y += (operation.startY - operation.newY);
            }

            // Process opacity

            posData.posIn.opacity       = target.isShown ? 1 : self._effectsIn.opacity;
            posData.posOut.opacity      = 1;
            posData.tweenData.opacity   = posData.posOut.opacity - posData.posIn.opacity;

            // Adjust x and y if not nudging

            if (!target.isShown && !self.animation.nudge) {
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

                posData.posIn[effectName].value     = effect.value;
                posData.posOut[effectName].value    = 0;

                posData.tweenData[effectName].value =
                    posData.posOut[effectName].value - posData.posIn[effectName].value;

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

            posData.posIn.x     = target.isShown ? posData.startPosData.x - posData.interPosData.x : 0;
            posData.posIn.y     = target.isShown ? posData.startPosData.y - posData.interPosData.y : 0;
            posData.posOut.x    = self.animation.nudge ? 0 : posData.posIn.x;
            posData.posOut.y    = self.animation.nudge ? 0 : posData.posIn.y;
            posData.tweenData.x = posData.posOut.x - posData.posIn.x;
            posData.tweenData.y = posData.posOut.y - posData.posIn.y;

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

                posData.tweenData[effectName].value =
                    posData.posOut[effectName].value - posData.posIn[effectName].value;

                posData.posIn[effectName].unit =
                    posData.posOut[effectName].unit =
                    posData.tweenData[effectName].unit =
                    effect.unit;
            }
        }
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Operation}     operation
     * @return  {void}
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

            hideOrShow = target.isShown ? false : 'show'; // TODO: can we not mix types here?

            willTransition = self._willTransition(
                hideOrShow,
                operation.hasEffect,
                posData.posIn,
                posData.posOut
            );

            if (willTransition) {
                // Prevent non-transitioning targets from incrementing the staggerIndex

                staggerIndex++;
            }

            target.show();

            target.move({
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

            target.move({
                posIn: posData.posIn,
                posOut: posData.posOut,
                hideOrShow: hideOrShow,
                staggerIndex: i,
                operation: operation,
                callback: willTransition ? checkProgress : null
            });
        }

        if (self.animation.animateResizeContainer) {
            self._dom.parent.style[mixitup.features.transitionProp] =
                'height ' + self.animation.duration + 'ms ease, ' +
                'width ' + self.animation.duration + 'ms ease ';

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
     * @private
     * @instance
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
     * Determines if a target element will transition in
     * some fasion and therefore requires binding of
     * transitionEnd
     *
     * @private
     * @instance
     * @since   3.0.0
     * @param   {string}        hideOrShow
     * @param   {boolean}       hasEffect
     * @param   {StyleData}     posIn
     * @param   {StyleData}     posOut
     * @return  {boolean}
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
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    _checkProgress: function(operation) {
        var self = this;

        self._targetsDone++;

        if (self._targetsBound === self._targetsDone) {
            self._cleanUp(operation);
        }
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    _cleanUp: function(operation) {
        var self        = this,
            target      = null,
            nextInQueue = null,
            i           = -1;

        self._isMixing = false;

        self.execAction('_cleanUp', 0);

        self._targetsMoved          =
            self._targetsImmovable  =
            self._targetsBound      =
            self._targetsDone       = 0;

        for (i = 0; target = operation.show[i]; i++) {
            target.cleanUp();

            target.show();
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            target.cleanUp();

            target.hide();
        }

        if (operation.willSort) {
            self._printSort(false, operation);

            self._targets = operation.newOrder;
        }

        // Remove any styles applied to the parent container

        self._dom.parent.style[mixitup.features.transitionProp]             =
            self._dom.parent.style.height                                   =
            self._dom.parent.style.width                                    =
            self._dom.parent.style[mixitup.features.perspectiveProp]        =
            self._dom.parent.style[mixitup.features.perspectiveOriginProp]  = '';

        if (operation.willChangeLayout) {
            h.removeClass(self._dom.container, operation.startContainerClass);
            h.addClass(self._dom.container, operation.newContainerClass);
        }

        if (operation.toRemove.length) {
            for (i = 0; target = self._targets[i]; i++) {
                if (operation.toRemove.indexOf(target) > -1) {

                    h.deleteElement(target.dom.el);

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

        // mixEnd

        mixitup.events.fire('mixEnd', self._dom.container, {
            state: self._state,
            instance: self
        }, self._dom.document);

        if (typeof self.callbacks.onMixEnd === 'function') {
            self.callbacks.onMixEnd.call(self._dom.container, self._state, self);
        }

        if (operation.hasFailed) {
            // mixFail

            mixitup.events.fire('mixFail', self._dom.container, {
                state: self._state,
                instance: self
            }, self._dom.document);

            if (typeof self.callbacks.onMixFail === 'function') {
                self.callbacks.onMixFail.call(self._dom.container, self._state, self);
            }

            h.addClass(self._dom.container, self.layout.containerClassFail);
        }

        // User-defined callback function

        if (typeof self._userCallback === 'function') {
            self._userCallback.call(self._dom.container, self._state, self);
        }

        self._userPromise.resolve(self._state);

        self._userPromise.isResolved = true;

        if (self._queue.length) {
            self.execAction('_queue', 0);

            nextInQueue = self._queue.shift();

            self._userPromise = nextInQueue[3];

            self.multiMix.apply(self, nextInQueue);
        }

        self.execAction('_cleanUp', 1);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Array<*>}  args
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

        return self.execFilter('_parseMultiMixArgs', instruction, arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Array<*>}  args
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
            collection: [], // Element(s) to insert
            position: 'before', // Position relative to a sibling if passed
            sibling: null // A sibling element as a reference
        };

        for (i = 0; i < args.length; i++) {
            arg = args[i];

            if (typeof arg === 'number') {
                // Insert index

                instruction.command.index = arg;
            } else if (typeof arg === 'string' && ['before', 'after'].indexOf(arg) > -1) {
                // 'before'/'after'

                instruction.command.position = arg;
            } else if (typeof arg === 'string') {
                // Markup

                instruction.command.collection =
                    Array.prototype.slice.call(h.createElement(arg).children);
            } else if (typeof arg === 'object' && h.isElement(arg, self._dom.document)) {
                // Single element

                !instruction.command.collection.length ?
                    (instruction.command.collection = [arg]) :
                    (instruction.command.sibling = arg);
            } else if (typeof arg === 'object' && arg !== null && arg.length) {
                // Multiple elements in array or jQuery collection

                !instruction.command.collection.length ?
                    (instruction.command.collection = arg) :
                    instruction.command.sibling = arg[0];
            } else if (
                typeof arg === 'object' &&
                arg !== null &&
                arg.childNodes &&
                arg.childNodes.length
            ) {
                // Document fragment

                !instruction.command.collection.length ?
                    instruction.command.collection = Array.prototype.slice.call(arg.childNodes) :
                    instruction.command.sibling = arg.childNodes[0];
            } else if (typeof arg === 'boolean') {
                instruction.animate = arg;
            } else if (typeof arg === 'function') {
                instruction.callback = arg;
            }
        }

        if (!instruction.command.collection.length && h.canReportErrors(self)) {
            throw new Error(mixitup.messages[102]);
        }

        return self.execFilter('_parseInsertArgs', instruction, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Array<*>}  args
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
                if (collection.indexOf(target.dom.el) > -1) {
                    instruction.command.targets.push(target);
                }
            }
        }

        return self.execFilter('_parseRemoveArgs', instruction, arguments);
    },

    /**
     * @private
     * @instance
     * @since       3.0.0
     * @param       {Array<*>}                  args
     * @param       {mixitup.UserInstruction}   instruction
     * @return      {Promise.<mixitup.State>}
     */

    _deferMix: function(args, instruction) {
        var self    = this,
            promise = null;

        promise = h.getPromise(self.libraries);

        if (self.animation.queue && self._queue.length < self.animation.queueLimit) {
            args[3] = promise;

            self._queue.push(args);

            (self.controls.enable && !self._isClicking) && self._updateControls(instruction.command);

            self.execAction('multiMixQueue', 1, args);
        } else {
            if (h.canReportErrors(self)) {
                console.warn(mixitup.messages[201]);
            }

            promise.resolve(self._state);
            promise.isResolved = true;

            mixitup.events.fire('mixBusy', self._dom.container, {
                state: self._state,
                instance: self
            }, self._dom.document);

            if (typeof self.callbacks.onMixBusy === 'function') {
                self.callbacks.onMixBusy.call(self._dom.container, self._state, self);
            }

            self.execAction('multiMixBusy', 1, args);
        }

        return promise.promise;
    },

    /**
     * Initialises a newly instantiated mixer by filtering in all targets, or those
     * specified via the `load.filter` configuration option.
     *
     * @example
     * .init()
     *
     * @public
     * @instance
     * @since       3.0.0
     * @param       {boolean}   [startFromHidden]
     *      An optional boolean dictating whether targets should start from a hidden or non-hidden state.
     * @return      {Promise.<mixitup.State>}
     */

    init: function(startFromHidden) {
        var self    = this,
            target  = null,
            i       = -1;

        if (startFromHidden) {
            for (i = 0; target = self._targets[i]; i++) {
                target.hide();
            }
        }

        return self.multiMix({
            filter: self._state.activeFilter
        });
    },

    /**
     * A shorthand method for `.filter('all')`.
     *
     * @example
     * .show()
     *
     * @public
     * @instance
     * @since       3.0.0
     * @return      {Promise.<mixitup.State>}
     */

    show: function() {
        var self = this;

        return self.filter('all');
    },

    /**
     * A shorthand method for `.filter('none')`.
     *
     * @example
     * .hide()
     *
     * @public
     * @instance
     * @since       3.0.0
     * @return      {Promise.<mixitup.State>}
     */

    hide: function() {
        var self = this;

        return self.filter('none');
    },

    /**
     * Returns a boolean indicating whether or not a MixItUp operation is
     * currently in progress.
     *
     * @example
     * .isMixing()
     *
     * @public
     * @instance
     * @since   2.0.0
     * @return  {boolean}
     */

    isMixing: function() {
        var self = this;

        return self._isMixing;
    },

    /**
     * Filters the mixer according to the specified filter command.
     *
     * @example
     * .filter(filterCommand [,animate] [,callback])
     *
     * @public
     * @instance
     * @since       2.0.0
     * @param       {string}    filterCommand
     *      Any valid CSS selector (i.e. `'.category-2'`), or the strings `'all'` or `'none'`.
     * @param       {boolean}   [animate]
     * @param       {function}  [callback]
     * @return      {Promise.<mixitup.State>}
     */

    filter: function(filterCommand) {
        var self = this,
            args = self._parseMultiMixArgs(arguments);

        self._isClicking && (self._toggleString = '');

        return self.multiMix({
            filter: args.command
        }, args.animate, args.callback);
    },

    /**
     * Sorts the mixer according to the specified sort command.
     *
     * @example
     * .sort(sortCommand [,animate] [,callback])
     *
     * @public
     * @instance
     * @since       2.0.0
     * @param       {string}    sortCommand
     *      A colon-seperated "sorting pair" (e.g. `'published:asc'`, or `'random'`.
     * @param       {boolean}   [animate]
     * @param       {function}  [callback]
     * @return      {Promise.<mixitup.State>}
     */

    sort: function(sortCommand) {
        var self = this,
            args = self._parseMultiMixArgs(arguments);

        return self.multiMix({
            sort: args.command
        }, args.animate, args.callback);
    },

    /**
     * @public
     * @instance
     * @since       2.0.0
     * @return      {Promise.<mixitup.State>}
     */

    changeLayout: function() {
        // TODO: parse arguments, and map to multiMix
    },

    /**
     * @public
     * @instance
     * @since   3.0.0
     * @param   {Command}           command
     * @param   {boolean}           [isPreFetch]
     *      An optional boolean indicating that the operation is being pre-fetched for execution at a later time.
     * @return  {Operation|null}
     */

    getOperation: function(command, isPreFetch) {
        var self                = this,
            sortCommand         = command.sort,
            filterCommand       = command.filter,
            changeLayoutCommand = command.changeLayout,
            removeCommand       = command.remove,
            insertCommand       = command.insert,
            operation           = new mixitup.Operation();

        operation.command       = command;
        operation.startState    = self._state;
        operation.id            = h.randomHexKey();

        self.execAction('getOperation', 0, operation);

        // TODO: passing the operation rather than arguments
        // to the action is non-standard here but essential as
        // we require a reference to original. Perhaps a "pre"
        // filter is the best alternative, but as we already use
        // a filter at the end of this function, we would need a
        // new syntax

        if (self._isMixing) {
            if (h.canReportErrors(self)) {
                console.warn(mixitup.messages[201]);
            }

            return null;
        }

        // If the commands are passed directly to multiMix, they need additional parsing:

        if (insertCommand) {
            if (typeof insertCommand.collection === 'undefined') {
                insertCommand = self._parseInsertArgs([insertCommand]).command;
            }

            self._insert(insertCommand, operation);
        }

        if (removeCommand) {
            if (typeof removeCommand.targets === 'undefined' && removeCommand.collection.length) {
                removeCommand = self._parseRemoveArgs([removeCommand.collection]).command;
            }

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
            operation.startContainerClass = operation.startState.activeContainerClass;

            operation.newContainerClass   =
                changeLayoutCommand.containerClass || operation.startContainerClass;

            if (operation.newContainerClass !== operation.startContainerClass) {
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

        return self.execFilter('getOperation', operation, arguments);
    },

    /**
     * Performs simultaneous `filter`, `sort`, `insert`, `remove` and `changeLayout`
     * operations as requested.
     *
     * @example
     * .multiMix(multiMixCommand [,animate] [,callback])
     *
     * @public
     * @instance
     * @since       2.0.0
     * @param       {object}    multiMixCommand
     *      An object containing one or more operation commands
     * @param       {boolean}   [animate=true]
     * @param       {function}  [callback=null]
     * @return      {Promise.<mixitup.State>}
     */

    multiMix: function(multiMixCommand) {
        var self        = this,
            operation   = null,
            animate     = false,
            instruction = self._parseMultiMixArgs(arguments);

        // multiMixCommand argument passed purely to please jscs, all params
        // actually derived via arguments list

        self.execAction('multiMix', 0, arguments);

        if (!self._isClicking) {
            self._lastClicked = null;
        }

        if (!self._isMixing) {
            operation = self.getOperation(instruction.command);

            if (self.controls.enable && !self._isClicking) {
                // Update controls for API calls

                if (instruction.command.filter) {
                    // We are no longer toggling as API methods override controls

                    self._isToggling            = false;
                    self._toggleArray.length    = 0;

                    // Build a toggle array from the requested command

                    self._buildToggleArray(operation.command);
                }

                self._updateControls(operation.command);
            }

            (self._queue.length < 2) && (self._isClicking = false);

            self._userCallback = null;

            if (instruction.callback) self._userCallback = instruction.callback;

            self.execFilter('multiMix', operation, self);
            self.execAction('multiMix', 1, arguments);

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
     * Renders a previously created operation at a specific point in its path, as
     * determined by a multiplier between 0 and 1.
     *
     * @example
     * .tween(operation, multiplier)
     *
     * @public
     * @instance
     * @since   3.0.0
     * @param   {mixitup.Operation}     operation
     *      An operation object created via the `getOperation` method
     *
     * @param   {Float}                 multiplier
     *      Any number between 0 and 1 representing the percentage complete of the operation
     * @return  {void}
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

            target.applyTween(posData, multiplier);
        }

        for (i = 0; target = operation.hide[i]; i++) {
            if (target.isShown) {
                target.hide();
            }

            if ((toHideIndex = operation.toHide.indexOf(target)) > -1) {
                posData = operation.toHidePosData[toHideIndex];

                if (!target.isShown) {
                    target.show();
                }

                target.applyTween(posData, multiplier);
            }
        }
    },

    /**
     * @public
     * @instance
     * @since       2.0.0
     * @return      {Promise.<mixitup.State>}
     */

    insert: function() {
        var self = this,
            args = self._parseInsertArgs(arguments);

        return self.multiMix({
            insert: args.command
        }, args.animate, args.callback);
    },

    /**
     * @public
     * @instance
     * @since       3.0.0
     * @return      {Promise.<mixitup.State>}
     */

    insertBefore: function() {
        var self = this,
            args = self._parseInsertArgs(arguments);

        return self.insert(args.command.collection, 'before', args.command.sibling, args.animate, args.callback);
    },

    /**
     * @public
     * @instance
     * @since       3.0.0
     * @return      {Promise.<mixitup.State>}
     */

    insertAfter: function() {
        var self = this,
            args = self._parseInsertArgs(arguments);

        return self.insert(args.command.collection, 'after', args.command.sibling, args.animate, args.callback);
    },

    /**
     * @public
     * @instance
     * @since       2.0.0
     * @return      {Promise.<mixitup.State>}
     */

    prepend: function() {
        var self = this,
            args = self._parseInsertArgs(arguments);

        return self.insert(0, args.command.collection, args.animate, args.callback);
    },

    /**
     * @public
     * @instance
     * @since       2.0.0
     * @return      {Promise.<mixitup.State>}
     */

    append: function() {
        var self = this,
            args = self._parseInsertArgs(arguments);

        return self.insert(self._state.totalTargets, args.command.collection, args.animate, args.callback);
    },

    /**
     * @public
     * @instance
     * @since       3.0.0
     * @return      {Promise.<mixitup.State>}
     */

    remove: function() {
        var self = this,
            args = self._parseRemoveArgs(arguments);

        return self.multiMix({
            remove: args.command
        }, args.animate, args.callback);
    },

    /**
     * @public
     * @instance
     * @since       2.0.0
     * @param       {string}    stringKey
     * @return      {*}
     */

    getOption: function(stringKey) {
        // TODO: requires stringKey parser helper
    },

    /**
     * @public
     * @instance
     * @since       2.0.0
     * @param       {object}    config
     * @return      {void}
     */

    setOptions: function(config) {
        var self = this;

        self.execAction('setOptions', 0, arguments);

        h.extend(self, config, true);

        self.execAction('setOptions', 1, arguments);
    },

    /**
     * @public
     * @instance
     * @since       2.0.0
     * @return      {mixitup.State}
     */

    getState: function() {
        var self    = this,
            state   = null;

        if (typeof Object.assign === 'function') {
            state = new mixitup.State();

            Object.assign(state, self._state);
        } else {
            state = self._state;
        }

        return self.execFilter('getState', state, self);
    },

    /**
     * @public
     * @instance
     * @since 2.1.2
     * @return {void}
     */

    forceRefresh: function() {
        var self = this;

        self._indexTargets();
    },

    /**
     * @public
     * @instance
     * @since   2.0.0
     * @param   {boolean}   hideAll
     * @return  {void}
     */

    destroy: function(hideAll) {
        var self    = this,
            target  = null,
            button  = null,
            i       = 0;

        self.execAction('destroy', 0, arguments);

        self._unbindEvents();

        for (i = 0; target = self._targets[i]; i++) {
            hideAll && target.hide();

            target.unbindEvents();
        }

        for (i = 0; button = self._dom.allButtons[i]; i++) {
            h.removeClass(button, self.controls.activeClass);
        }

        if (self._dom.container.id.indexOf('MixItUp') === 0) {
            self._dom.container.removeAttribute('id');
        }

        delete mixitup.instances[self._id];

        self.execAction('destroy', 1, arguments);
    }
});
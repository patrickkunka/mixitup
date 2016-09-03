/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.Control = function() {
    mixitup.Base.call(this);

    this.execAction('construct', 0);

    this.el         = null;
    this.selector   = '';
    this.bound      = [];
    this.method     = '';
    this.status     = 'inactive';
    this.action     = '';
    this.handler    = null;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.Control);

mixitup.Control.prototype = Object.create(mixitup.Base.prototype);

h.extend(mixitup.Control.prototype,
/** @lends mixitup.Control */
{
    constructor: mixitup.Control,

    /**
     * @private
     * @param {HTMLElement} el
     * @param {method}      method
     * @param {string}      selector
     */

    init: function(el, method, selector) {
        var self = this;

        self.execAction('init', 0);

        self.el         = el;
        self.method     = method;
        self.selector   = selector;

        self.bindClick();

        mixitup.controls.push(self);

        self.execAction('init', 1);
    },

    /**
     * @private
     * @param  {mixitup.Mixer} mixer
     * @return {boolean}
     */

    isBound: function(mixer) {
        var self    = this,
            isBound = false;

        self.execAction('isBound', 0);

        isBound = self.bound.indexOf(mixer) > -1;

        return self.execFilter('isBound', isBound, arguments);
    },

    /**
     * @private
     * @param  {mixitup.Mixer} mixer
     * @return {void}
     */

    addBinding: function(mixer) {
        var self = this;

        self.execAction('addBinding', 0);

        if (!self.isBound()) {
            self.bound.push(mixer);
        }

        self.execAction('addBinding', 1);
    },

    /**
     * @private
     * @param  {mixitup.Mixer} mixer
     * @return {void}
     */

    removeBinding: function(mixer) {
        var self        = this,
            removeIndex = -1;

        self.execAction('removeBinding', 0);

        if ((removeIndex = self.bound.indexOf(mixer)) > -1) {
            self.bound.splice(removeIndex, 1);
        }

        if (self.bound.length < 1) {
            // No bindings exist, unbind event click handlers

            self.unbindClick();

            // Remove from `mixitup.controls` list

            removeIndex = mixitup.controls.indexOf(self);

            mixitup.controls.splice(removeIndex, 1);
        }

        self.execAction('removeBinding', 1);
    },

    /**
     * @private
     * @return {void}
     */

    bindClick: function() {
        var self = this;

        self.execAction('bindClick', 0);

        self.handler = function(e) {
            self.handleClick(e);
        };

        h.on(self.el, 'click', self.handler);

        self.execAction('bindClick', 1);
    },

    /**
     * @private
     * @return {void}
     */

    unbindClick: function() {
        var self = this;

        self.execAction('unbindClick', 0);

        h.off(self.el, 'click', self.handler);

        self.handler = null;

        self.execAction('unbindClick', 1);
    },

    handleClick: function(e) {
        var self    = this,
            button  = null;

        self.execAction('handleClick', 0);

        if (!self.selector) {
            button = self.el;
        } else {
            button = h.closestParent(e.target, self.selector, true);
        }

        console.log('button was clicked', self);

        // if toggle, check if toggling on or off based on status before responding

        self.execAction('handleClick', 1);
    },

    update: function(command, toggleArray) {
        var self = this;

        self.execAction('update', 0);

        // check type of button, and if value matches appropriate command value, if so set to active

        // If toggle, go through each selector in array, and check for match

        switch(self.method) {
            case 'filter':
                if (command.filter === self.el.getAttribute('data-filter')) {
                    self.setStatus('active');
                }

                break;
            case 'toggle':
                toggleArray;

                break;
            case 'multiMix':

                break;
            case 'sort':

                break;
        }

        self.execAction('update', 1);
    },

    setStatus: function(status) {
        var self    = this,
            mixer   = self.bound[0];

        // TODO: currently takes the activeClass of the first bound mixer, should we check all and build up an active
        // classes list?

        switch (status) {
            case 'active':
                h.addClass(self.el, mixer.controls.activeClass);

                break;
            case 'inactive':
                h.removeClass(self.el, mixer.controls.activeClass);
        }

        self.status = status;
    }
});

mixitup.controls = [];

/**
//  * @private
//  * @instance
//  * @since   3.0.0
//  * @param   {Event}  e
//  * @return  {void}
//  *
//  * Determines the type of operation needed and the
//  * appropriate parameters when a button is clicked
//  */

// _handleClick: function(e) {
//     var self            = this,
//         command         = null,
//         returnValue     = null,
//         method          = '',
//         isTogglingOff   = false,
//         button          = null;

//     self.execAction('_handleClick', 0, arguments);

//     if (
//         self._isMixing &&
//         (!self.animation.queue || self._queue.length >= self.animation.queueLimit)
//     ) {
//         if (h.canReportErrors(self)) {
//             console.warn(mixitup.messages[301]);
//         }

//         mixitup.events.fire('mixBusy', self._dom.container, {
//             state: self._state,
//             instance: self
//         }, self._dom.document);

//         if (typeof self.callbacks.onMixBusy === 'function') {
//             self.callbacks.onMixBusy.call(self._dom.container, self._state, self);
//         }

//         self.execAction('_handleClickBusy', 1, arguments);

//         return;
//     }

//     button = h.closestParent(
//         e.target,
//         self.selectors.control,
//         true,
//         Infinity,
//         self._dom.document
//     );

//     if (!button) {
//         self.execAction('_handleClick', 1, arguments);

//         return;
//     }

//     self._isClicking = true;

//     // This will be automatically mapped into the new operation's future
//     // state, but that has not been generated at this point, so we manually
//     // add it to the previous state for the following callbacks/events:

//     self._state.triggerElement = button;

//     // Expose the original event to callbacks and events so that any default
//     // behavior can be cancelled (e.g. an <a> being used as a control as a
//     // progressive enhancement):

//     mixitup.events.fire('mixClick', self._dom.container, {
//         state: self._state,
//         instance: self,
//         originalEvent: e
//     }, self._dom.document);

//     if (typeof self.callbacks.onMixClick === 'function') {
//         returnValue = self.callbacks.onMixClick.call(button, self._state, self, e);

//         if (returnValue === false) {
//             // The callback has returned false, so do not execute the default action

//             return;
//         }
//     }

//     method = self._determineButtonMethod(button);

//     switch (method) {
//         case 'sort':
//             command = self._handleSortClick(button);

//             break;
//         case 'filter':
//             command = self._handleFilterClick(button);

//             break;
//         case 'filterToggle':
//             if (h.hasClass(button, self.controls.activeClass)) {
//                 isTogglingOff = true;
//             }

//             command = self._handleFilterToggleClick(button);

//             break;
//         case 'multiMix':
//             command = self._handleMultiMixClick(button);

//             break;
//     }

//     if (method && command) {
//         self._trackClick(button, method, isTogglingOff);

//         self.multiMix(command);
//     }

//     self.execAction('_handleClick', 1, arguments);
// },

/**
//  * @private
//  * @instance
//  * @since   3.0.0
//  * @param   {Element}   button
//  * @return  {object|null}
//  */

// _handleSortClick: function(button) {
//     var self        = this,
//         returnValue = null,
//         sortString  = '',
//         el          = null,
//         i           = -1;

//     self.execAction('_handleSortClick', 0, arguments);

//     sortString = button.getAttribute('data-sort');

//     if (
//         !h.hasClass(button, self.controls.activeClass) ||
//         sortString.indexOf('random') > -1
//     ) {
//         for (i = 0; el = self._dom.sortButtons[i]; i++) {
//             h.removeClass(el, self.controls.activeClass);
//         }

//         for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
//             h.removeClass(el, self.controls.activeClass);
//         }

//         returnValue = {
//             sort: sortString
//         };
//     }

//     return self.execFilter('_handleSortClick', returnValue, arguments);
// },

// /**
//  * @private
//  * @instance
//  * @since   3.0.0
//  * @param   {Element}   button
//  * @return  {object|null}
//  */

// _handleFilterClick: function(button) {
//     var self    = this,
//         command = null,
//         el      = null,
//         i       = -1;

//     self.execAction('_handleFilterClick', 0, arguments);

//     if (!h.hasClass(button, self.controls.activeClass)) {
//         for (i = 0; el = self._dom.filterButtons[i]; i++) {
//             h.removeClass(el, self.controls.activeClass);
//         }

//         for (i = 0; el = self._dom.filterToggleButtons[i]; i++) {
//             h.removeClass(el, self.controls.activeClass);
//         }

//         for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
//             h.removeClass(el, self.controls.activeClass);
//         }

//         if (self._isToggling) {
//             // If we were previously toggling, we are not now,
//             // so remove any selectors from the toggle array

//             self._isToggling = false;
//         }

//         // Reset any active toggles regardless of whether we were toggling or not,
//         // as an API method could have caused toggle buttons to become active

//         self._toggleArray.length = 0;

//         command = {
//             filter: button.getAttribute('data-filter')
//         };
//     }

//     return self.execFilter('_handleFilterClick', command, arguments);
// },

// /**
//  * @private
//  * @instance
//  * @since   3.0.0
//  * @param   {Element}   button
//  * @return  {object|null}
//  */

// _handleFilterToggleClick: function(button) {
//     var self            = this,
//         toggleSeperator = '',
//         filterString    = '',
//         command         = null,
//         el              = null,
//         i               = -1;

//     self.execAction('_handleFilterToggleClick', 0, arguments);

//     toggleSeperator = self.controls.toggleLogic === 'or' ? ',' : '';

//     if (!self._isToggling) {
//         // There were no toggles active previously active

//         for (i = 0; el = self._dom.filterToggleButtons[i]; i++) {
//             h.removeClass(el, self.controls.activeClass);
//         }

//         self._toggleArray.length    = 0; // Reset any previously active toggles
//         self._isToggling            = true;
//     }

//     filterString = button.getAttribute('data-toggle');

//     for (i = 0; el = self._dom.filterButtons[i]; i++) {
//         h.removeClass(el, self.controls.activeClass);
//     }

//     for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
//         h.removeClass(el, self.controls.activeClass);
//     }

//     // Add or remove filters as needed

//     if (!h.hasClass(button, self.controls.activeClass)) {
//         self._toggleArray.push(filterString);
//     } else {
//         self._toggleArray.splice(self._toggleArray.indexOf(filterString), 1);
//     }

//     self._toggleArray = h.clean(self._toggleArray);

//     self._toggleString = self._toggleArray.join(toggleSeperator);

//     if (self._toggleString === '') {
//         self._toggleString = self.controls.toggleDefault;

//         command = {
//             filter: self._toggleString
//         };

//         self._updateControls(command);
//     } else {
//         command =  {
//             filter: self._toggleString
//         };
//     }

//     return self.execFilter('_handleFilterToggleClick', command, arguments);
// },

// /**
//  * @private
//  * @instance
//  * @since 3.0.0
//  * @param   {Element}   button
//  * @return  {object|null}
//  */

// _handleMultiMixClick: function(button) {
//     var self     = this,
//         command  = null,
//         el       = null,
//         i        = -1;

//     self.execAction('_handleMultiMixClick', 0, arguments);

//     if (!h.hasClass(button, self.controls.activeClass)) {
//         for (i = 0; el = self._dom.filterButtons[i]; i++) {
//             h.removeClass(el, self.controls.activeClass);
//         }

//         for (i = 0; el = self._dom.filterToggleButtons[i]; i++) {
//             h.removeClass(el, self.controls.activeClass);
//         }

//         for (i = 0; el = self._dom.sortButtons[i]; i++) {
//             h.removeClass(el, self.controls.activeClass);
//         }

//         for (i = 0; el = self._dom.multiMixButtons[i]; i++) {
//             h.removeClass(el, self.controls.activeClass);
//         }

//         command = {
//             sort: button.getAttribute('data-sort'),
//             filter: button.getAttribute('data-filter')
//         };

//         if (self._isToggling) {
//             // If we were previously toggling, we are not now,
//             // so remove any selectors from the toggle array

//             self._isToggling            = false;
//             self._toggleArray.length    = 0;
//         }

//         // Update any matching individual filter and sort
//         // controls to reflect the multiMix

//         self._updateControls(command);
//     }

//     return self.execFilter('_handleMultiMixClick', command, arguments);
// },
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
    this.pending    = -1;
    this.type       = '';
    this.status     = 'inactive'; // enum: ['inactive', 'active', 'disabled', 'live']
    this.filter     = '';
    this.sort       = '';
    this.canDisable = false;
    this.handler    = null;
    this.classnames = new mixitup.UiClassnames();

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
     * @param {string}      type
     * @param {string}      selector
     */

    init: function(el, type, selector) {
        var self = this;

        self.execAction('init', 0, arguments);

        self.el         = el;
        self.type       = type;
        self.selector   = selector;

        if (self.selector) {
            self.status = 'live';
        } else {
            self.canDisable = typeof self.el.disable === 'boolean';

            switch (self.type) {
                case 'filter':
                    self.filter = self.el.getAttribute('data-filter');

                    break;
                case 'toggle':
                    self.filter = self.el.getAttribute('data-toggle');

                    break;
                case 'sort':
                    self.sort   = self.el.getAttribute('data-sort');

                    break;
                case 'multimix':
                    self.filter = self.el.getAttribute('data-filter');
                    self.sort   = self.el.getAttribute('data-sort');

                    break;
            }
        }

        self.bindClick();

        mixitup.controls.push(self);

        self.execAction('init', 1, arguments);
    },

    /**
     * @private
     * @param  {mixitup.Mixer} mixer
     * @return {boolean}
     */

    isBound: function(mixer) {
        var self    = this,
            isBound = false;

        self.execAction('isBound', 0, arguments);

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

        self.execAction('addBinding', 0, arguments);

        if (!self.isBound()) {
            self.bound.push(mixer);
        }

        self.execAction('addBinding', 1, arguments);
    },

    /**
     * @private
     * @param  {mixitup.Mixer} mixer
     * @return {void}
     */

    removeBinding: function(mixer) {
        var self        = this,
            removeIndex = -1;

        self.execAction('removeBinding', 0, arguments);

        if ((removeIndex = self.bound.indexOf(mixer)) > -1) {
            self.bound.splice(removeIndex, 1);
        }

        if (self.bound.length < 1) {
            // No bindings exist, unbind event click handlers

            self.unbindClick();

            // Remove from `mixitup.controls` list

            removeIndex = mixitup.controls.indexOf(self);

            mixitup.controls.splice(removeIndex, 1);

            if (self.status === 'active') {
                self.setStatus(self.el, 'inactive');
            }
        }

        self.execAction('removeBinding', 1, arguments);
    },

    /**
     * @private
     * @return {void}
     */

    bindClick: function() {
        var self = this;

        self.execAction('bindClick', 0, arguments);

        self.handler = function(e) {
            self.handleClick(e);
        };

        h.on(self.el, 'click', self.handler);

        self.execAction('bindClick', 1, arguments);
    },

    /**
     * @private
     * @return {void}
     */

    unbindClick: function() {
        var self = this;

        self.execAction('unbindClick', 0, arguments);

        h.off(self.el, 'click', self.handler);

        self.handler = null;

        self.execAction('unbindClick', 1, arguments);
    },

    /**
     * @private
     * @param   {MouseEvent} e
     * @return  {void}
     */

    handleClick: function(e) {
        var self        = this,
            button      = null,
            mixer       = null,
            isActive    = false,
            returnValue = void(0),
            command     = {},
            clone       = null,
            commands    = [],
            i           = -1;

        self.execAction('handleClick', 0, arguments);

        this.pending = 0;

        if (!self.selector) {
            button = self.el;
        } else {
            button = h.closestParent(e.target, self.selector, true, self.bound[0].dom.document);
        }

        if (!button) {
            self.execAction('handleClick', 1, arguments);

            return;
        }

        switch (self.type) {
            case 'filter':
                command.filter = self.filter || button.getAttribute('data-filter');

                break;
            case 'sort':
                command.sort = self.sort || button.getAttribute('data-sort');

                break;
            case 'multimix':
                command.filter  = self.filter || button.getAttribute('data-filter');
                command.sort    = self.sort || button.getAttribute('data-sort');

                break;
            case 'toggle':
                command.filter  = self.filter || button.getAttribute('data-toggle');

                if (self.status === 'live') {
                    isActive = h.hasClass(button, self.classnames.active);
                } else {
                    isActive = self.status === 'active';
                }

                break;
        }

        for (i = 0; i < self.bound.length; i++) {
            // Create a clone of the command for each bound mixer instance

            clone = new mixitup.CommandMultimix();

            h.extend(clone, command);

            commands.push(clone);
        }

        commands = self.execFilter('handleClick', commands, arguments);

        self.pending = self.bound.length;

        for (i = 0; mixer = self.bound[i]; i++) {
            command = commands[i];

            if (!command) {
                // An extension may set a command null to indicate that the click should not be handled

                continue;
            }

            mixitup.events.fire('mixClick', mixer.dom.container, {
                state: mixer.state,
                instance: mixer,
                originalEvent: e,
                control: mixer.lastClicked
            }, mixer.dom.document);

            if (typeof mixer.config.callbacks.onMixClick === 'function') {
                returnValue = mixer.config.callbacks.onMixClick.call(mixer.lastClicked, mixer.state, mixer, e);

                if (returnValue === false) {
                    // User has returned `false` from the callback, so do not handle click

                    continue;
                }
            }

            if (mixer.lastClicked) {
                mixer.lastClicked = button;
            }

            if (self.type === 'toggle') {
                console.log('toggle is active?', isActive, command.filter);

                isActive ? mixer.toggleOff(command.filter) : mixer.toggleOn(command.filter);
            } else {
                mixer.multiMix(command);
            }
        }

        self.execAction('handleClick', 1, arguments);
    },

    /**
     * @param   {object}          command
     * @param   {Array<string>}   toggleArray
     * @return  {void}
     */

    update: function(command, toggleArray) {
        var self    = this,
            actions = new mixitup.CommandMultimix();

        self.execAction('update', 0, arguments);

        self.pending--;

        self.pending = Math.max(0, self.pending);

        if (self.pending > 0) return;

        if (self.status === 'live') {
            // Live control (status unknown)

            self.updateLive(command, toggleArray);
        } else if (status !== self.status) {
            // Static control with a change in status

            actions.sort    = self.sort;
            actions.filter  = self.filter;

            self.execFilter('actionsUpdate', actions, arguments);

            self.parseStatusChange(self.el, command, actions, toggleArray);
        }

        self.execAction('update', 1, arguments);
    },

    /**
     * @param   {mixitup.CommandMultimix} command
     * @param   {Array<string>}           toggleArray
     * @return  {void}
     */

    updateLive: function(command, toggleArray) {
        var self            = this,
            controlButtons  = null,
            actions         = null,
            button          = null,
            i               = -1;

        self.execAction('beforeUpdateLive', 0, arguments);

        controlButtons = self.el.querySelectorAll(self.selector);

        for (i = 0; button = controlButtons[i]; i++) {
            actions = new mixitup.CommandMultimix();

            switch (self.type) {
                case 'filter':
                    actions.filter = button.getAttribute('data-filter');

                    break;
                case 'sort':
                    actions.sort = button.getAttribute('data-sort');

                    break;
                case 'multimix':
                    actions.filter  = button.getAttribute('data-filter');
                    actions.sort    = button.getAttribute('data-sort');

                    break;
                case 'toggle':
                    actions.filter  = button.getAttribute('data-toggle');

                    break;
            }

            actions = self.execFilter('actionsUpdateLive', actions, arguments);

            self.parseStatusChange(button, command, actions, toggleArray);
        }

        self.execAction('afterUpdateLive', 1, arguments);
    },

    /**
     * @param   {HTMLElement}             button
     * @param   {mixitup.CommandMultimix} command
     * @param   {mixitup.CommandMultimix} actions
     * @param   {Array<string>}           toggleArray
     * @return  {void}
     */

    parseStatusChange: function(button, command, actions, toggleArray) {
        var self    = this,
            toggle  = '',
            i       = -1;

        self.execAction('beforeParseStatusChange', 0, arguments);

        switch (self.type) {
            case 'filter':
                if (command.filter === actions.filter) {
                    self.setStatus(button, 'active');
                } else {
                    self.setStatus(button, 'inactive');
                }

                break;
            case 'multimix':
                if (command.sort === actions.sort && command.filter === actions.filter) {
                    self.setStatus(button, 'active');
                } else {
                    self.setStatus(button, 'inactive');
                }

                break;
            case 'sort':
                if (command.sort === actions.sort) {
                    self.setStatus(button, 'active');
                } else {
                    self.setStatus(button, 'inactive');
                }

                break;
            case 'toggle':
                if (toggleArray.length < 1) self.setStatus(button, 'inactive');

                if (command.filter === actions.filter) {
                    self.setStatus(button, 'active');
                }

                for (i = 0; i < toggleArray.length; i++) {
                    toggle = toggleArray[i];

                    if (toggle === actions.filter) {
                        // Button matches one active toggle

                        self.setStatus(button, 'active');

                        break;
                    }

                    self.setStatus(button, 'inactive');
                }

                break;
        }

        self.execAction('afterParseStatusChange', 1, arguments);
    },

    /**
     * @param   {HTMLElement}   button
     * @param   {string}        status
     * @return  {void}
     */

    setStatus: function(button, status) {
        var self = this;

        self.execAction('setStatus', 0, arguments);

        switch (status) {
            case 'active':
                h.addClass(button, self.classnames.active);
                h.removeClass(button, self.classnames.disabled);

                if (self.canDisable) self.el.disabled = false;

                break;
            case 'inactive':
                h.removeClass(button, self.classnames.active);
                h.removeClass(button, self.classnames.disabled);

                if (self.canDisable) self.el.disabled = false;

                break;
            case 'disabled':
                if (self.canDisable) self.el.disabled = true;

                h.addClass(button, self.classnames.disabled);
                h.removeClass(button, self.classnames.active);

                break;
        }

        if (self.status !== 'live') {
            // Update the control's status propery if not live

            self.status = status;
        }

        self.execAction('setStatus', 1, arguments);
    }
});

mixitup.controls = [];
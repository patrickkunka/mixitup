/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.Control = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

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
    this.classNames = new mixitup.UiClassNames();

    this.callActions('afterConstruct');

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

        this.callActions('beforeInit', arguments);

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

        this.callActions('afterInit', arguments);
    },

    /**
     * @private
     * @param  {mixitup.Mixer} mixer
     * @return {boolean}
     */

    isBound: function(mixer) {
        var self    = this,
            isBound = false;

        this.callActions('beforeIsBound', arguments);

        isBound = self.bound.indexOf(mixer) > -1;

        return self.callFilters('afterIsBound', isBound, arguments);
    },

    /**
     * @private
     * @param  {mixitup.Mixer} mixer
     * @return {void}
     */

    addBinding: function(mixer) {
        var self = this;

        this.callActions('beforeAddBinding', arguments);

        if (!self.isBound()) {
            self.bound.push(mixer);
        }

        this.callActions('afterAddBinding', arguments);
    },

    /**
     * @private
     * @param  {mixitup.Mixer} mixer
     * @return {void}
     */

    removeBinding: function(mixer) {
        var self        = this,
            removeIndex = -1;

        this.callActions('beforeRemoveBinding', arguments);

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
                self.renderStatus(self.el, 'inactive');
            }
        }

        this.callActions('afterRemoveBinding', arguments);
    },

    /**
     * @private
     * @return {void}
     */

    bindClick: function() {
        var self = this;

        this.callActions('beforeBindClick', arguments);

        self.handler = function(e) {
            self.handleClick(e);
        };

        h.on(self.el, 'click', self.handler);

        this.callActions('afterBindClick', arguments);
    },

    /**
     * @private
     * @return {void}
     */

    unbindClick: function() {
        var self = this;

        this.callActions('beforeUnbindClick', arguments);

        h.off(self.el, 'click', self.handler);

        self.handler = null;

        this.callActions('afterUnbindClick', arguments);
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

        this.callActions('beforeHandleClick', arguments);

        this.pending = 0;

        mixer = self.bound[0];

        if (!self.selector) {
            button = self.el;
        } else {
            button = h.closestParent(e.target, mixer.config.selectors.control + self.selector, true, mixer.dom.document);
        }

        if (!button) {
            self.callActions('afterHandleClick', arguments);

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
                    isActive = h.hasClass(button, self.classNames.active);
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

        commands = self.callFilters('commandsHandleClick', commands, arguments);

        self.pending = self.bound.length;

        for (i = 0; mixer = self.bound[i]; i++) {
            command = commands[i];

            if (!command) {
                // An extension may set a command null to indicate that the click should not be handled

                continue;
            }

            if (!mixer.lastClicked) {
                mixer.lastClicked = button;
            }

            mixitup.events.fire('mixClick', mixer.dom.container, {
                state: mixer.state,
                instance: mixer,
                originalEvent: e,
                control: mixer.lastClicked
            }, mixer.dom.document);

            if (typeof mixer.config.callbacks.onMixClick === 'function') {
                returnValue = mixer.config.callbacks.onMixClick.call(mixer.lastClicked, mixer.state, e, mixer);

                if (returnValue === false) {
                    // User has returned `false` from the callback, so do not handle click

                    continue;
                }
            }

            if (self.type === 'toggle') {
                isActive ? mixer.toggleOff(command.filter) : mixer.toggleOn(command.filter);
            } else {
                mixer.multimix(command);
            }
        }

        this.callActions('afterHandleClick', arguments);
    },

    /**
     * @param   {object}          command
     * @param   {Array<string>}   toggleArray
     * @return  {void}
     */

    update: function(command, toggleArray) {
        var self    = this,
            actions = new mixitup.CommandMultimix();

        self.callActions('beforeUpdate', arguments);

        self.pending--;

        self.pending = Math.max(0, self.pending);

        if (self.pending > 0) return;

        if (self.status === 'live') {
            // Live control (status unknown)

            self.updateLive(command, toggleArray);
        } else {
            // Static control

            actions.sort    = self.sort;
            actions.filter  = self.filter;

            self.callFilters('actionsUpdate', actions, arguments);

            self.parseStatusChange(self.el, command, actions, toggleArray);
        }

        self.callActions('afterUpdate', arguments);
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

        self.callActions('beforeUpdateLive', arguments);

        if (!self.el) return;

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

            actions = self.callFilters('actionsUpdateLive', actions, arguments);

            self.parseStatusChange(button, command, actions, toggleArray);
        }

        self.callActions('afterUpdateLive', arguments);
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
            alias   = '',
            toggle  = '',
            i       = -1;

        self.callActions('beforeParseStatusChange', arguments);

        switch (self.type) {
            case 'filter':
                if (command.filter === actions.filter) {
                    self.renderStatus(button, 'active');
                } else {
                    self.renderStatus(button, 'inactive');
                }

                break;
            case 'multimix':
                if (command.sort === actions.sort && command.filter === actions.filter) {
                    self.renderStatus(button, 'active');
                } else {
                    self.renderStatus(button, 'inactive');
                }

                break;
            case 'sort':
                if (command.sort.match(/:asc/g)) {
                    alias = command.sort.replace(/:asc/g, '');
                }

                if (command.sort === actions.sort || alias === actions.sort) {
                    self.renderStatus(button, 'active');
                } else {
                    self.renderStatus(button, 'inactive');
                }

                break;
            case 'toggle':
                if (toggleArray.length < 1) self.renderStatus(button, 'inactive');

                if (command.filter === actions.filter) {
                    self.renderStatus(button, 'active');
                }

                for (i = 0; i < toggleArray.length; i++) {
                    toggle = toggleArray[i];

                    if (toggle === actions.filter) {
                        // Button matches one active toggle

                        self.renderStatus(button, 'active');

                        break;
                    }

                    self.renderStatus(button, 'inactive');
                }

                break;
        }

        self.callActions('afterParseStatusChange', arguments);
    },

    /**
     * @param   {HTMLElement}   button
     * @param   {string}        status
     * @return  {void}
     */

    renderStatus: function(button, status) {
        var self = this;

        self.callActions('beforeRenderStatus', arguments);

        switch (status) {
            case 'active':
                h.addClass(button, self.classNames.active);
                h.removeClass(button, self.classNames.disabled);

                if (self.canDisable) self.el.disabled = false;

                break;
            case 'inactive':
                h.removeClass(button, self.classNames.active);
                h.removeClass(button, self.classNames.disabled);

                if (self.canDisable) self.el.disabled = false;

                break;
            case 'disabled':
                if (self.canDisable) self.el.disabled = true;

                h.addClass(button, self.classNames.disabled);
                h.removeClass(button, self.classNames.active);

                break;
        }

        if (self.status !== 'live') {
            // Update the control's status propery if not live

            self.status = status;
        }

        self.callActions('afterRenderStatus', arguments);
    }
});

mixitup.controls = [];
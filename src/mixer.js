/* global mixitup, h */

/**
 * The `mixitup.Mixer` class is used to hold discreet, user-configured
 * instances of MixItUp on a provided container element.
 *
 * Mixer instances are returned whenever the `mixitup()` factory function is called,
 * which expose a range of methods enabling API-based filtering, sorting,
 * insertion, removal and more.
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @public
 * @since       3.0.0
 */

mixitup.Mixer = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.config            = new mixitup.Config();

    this.id                = '';

    this.isBusy            = false;
    this.isToggling        = false;
    this.incPadding        = true;

    this.controls          = [];
    this.targets           = [];
    this.origOrder         = [];
    this.cache             = {};

    this.toggleArray       = [];

    this.targetsMoved      = 0;
    this.targetsImmovable  = 0;
    this.targetsBound      = 0;
    this.targetsDone       = 0;

    this.staggerDuration   = 0;
    this.effectsIn         = null;
    this.effectsOut        = null;
    this.transformIn       = [];
    this.transformOut      = [];
    this.queue             = [];

    this.state             = null;
    this.lastOperation     = null;
    this.lastClicked       = null;
    this.userCallback      = null;
    this.userDeferred      = null;

    this.dom               = new mixitup.MixerDom();

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.Mixer);

mixitup.Mixer.prototype = Object.create(mixitup.Base.prototype);

h.extend(mixitup.Mixer.prototype,
/** @lends mixitup.Mixer */
{
    constructor: mixitup.Mixer,

    /**
     * @private
     * @instance
     * @since 3.0.0
     * @param {HTMLElement} container
     * @param {HTMLElement} document
     * @param {string}      id
     * @param {object}      [config]
     */

    attach: function(container, document, id, config) {
        var self    = this,
            target  = null,
            i       = -1;

        self.callActions('beforeAttach', arguments);

        self.id = id;

        if (config) {
            h.extend(self.config, config, true, true);
        }

        self.sanitizeConfig();

        self.cacheDom(container, document);

        if (self.config.layout.containerClassName) {
            h.addClass(self.dom.container, self.config.layout.containerClassName);
        }

        if (!mixitup.features.has.transitions) {
            self.config.animation.enable = false;
        }

        if (typeof window.console === 'undefined') {
            self.config.debug.showWarnings = false;
        }

        if (self.config.data.uidKey) {
            // If the dataset API is in use, force disable controls

            self.config.controls.enable = false;
        }

        self.indexTargets();

        self.state = self.getInitialState();

        for (i = 0; target = self.lastOperation.toHide[i]; i++) {
            target.hide();
        }

        if (self.config.controls.enable) {
            self.initControls();

            self.buildToggleArray(null, self.state);

            self.updateControls({
                filter: self.state.activeFilter,
                sort: self.state.activeSort
            });
        }

        self.parseEffects();

        self.callActions('afterAttach', arguments);
    },

    /**
     * @private
     * @instance
     * @since 3.0.0
     * @return {void}
     */

    sanitizeConfig: function() {
        var self = this;

        self.callActions('beforeSanitizeConfig', arguments);

        // Sanitize enum/string config options

        self.config.controls.scope          = self.config.controls.scope.toLowerCase().trim();
        self.config.controls.toggleLogic    = self.config.controls.toggleLogic.toLowerCase().trim();
        self.config.controls.toggleDefault  = self.config.controls.toggleDefault.toLowerCase().trim();

        self.config.animation.effects       = self.config.animation.effects.trim();

        self.callActions('afterSanitizeConfig', arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @return  {mixitup.State}
     */

    getInitialState: function() {
        var self        = this,
            state       = new mixitup.State(),
            operation   = new mixitup.Operation();

        self.callActions('beforeGetInitialState', arguments);

        // Map initial values into a mock state object in order to construct an operation

        state.activeContainerClassName = self.config.layout.containerClassName;

        if (self.config.load.dataset) {
            // Dataset API

            if (!self.config.data.uidKey || typeof self.config.data.uidKey !== 'string') {
                throw new TypeError(mixitup.messages.errorConfigDataUidKeyNotSet());
            }

            operation.startDataset = operation.newDataset = state.activeDataset = self.config.load.dataset.slice();
            operation.startContainerClassName = operation.newContainerClassName = state.activeContainerClassName;
            operation.show = self.targets.slice();

            state = self.callFilters('stateGetInitialState', state, arguments);
        } else {
            // DOM API

            state.activeFilter              = self.parseFilterArgs([self.config.load.filter]).command;
            state.activeSort                = self.parseSortArgs([self.config.load.sort]).command;
            state.totalTargets              = self.targets.length;

            state = self.callFilters('stateGetInitialState', state, arguments);

            if (
                state.activeSort.collection || state.activeSort.attribute ||
                state.activeSort.order === 'random' || state.activeSort.order === 'desc'
            ) {
                // Sorting on load

                operation.newSort = state.activeSort;

                self.sortOperation(operation);

                self.printSort(false, operation);

                self.targets = operation.newOrder;
            } else {
                operation.startOrder = operation.newOrder = self.targets;
            }

            operation.startFilter               = operation.newFilter               = state.activeFilter;
            operation.startSort                 = operation.newSort                 = state.activeSort;
            operation.startContainerClassName   = operation.newContainerClassName   = state.activeContainerClassName;

            if (operation.newFilter.selector === 'all') {
                operation.newFilter.selector = self.config.selectors.target;
            } else if (operation.newFilter.selector === 'none') {
                operation.newFilter.selector = '';
            }
        }

        operation = self.callFilters('operationGetInitialState', operation, [state]);

        self.lastOperation = operation;

        if (operation.newFilter) {
            self.filterOperation(operation);
        }

        state = self.buildState(operation);

        return state;
    },

    /**
     * Caches references of DOM elements neccessary for the mixer's functionality.
     *
     * @private
     * @instance
     * @since   3.0.0
     * @param   {HTMLElement}       el
     * @param   {HTMLHtmlElement}   document
     * @return  {void}
     */

    cacheDom: function(el, document) {
        var self    = this;

        self.callActions('beforeCacheDom', arguments);

        self.dom.document  = document;
        self.dom.body      = self.dom.document.querySelector('body');
        self.dom.container = el;
        self.dom.parent    = el;

        self.callActions('afterCacheDom', arguments);
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

    indexTargets: function() {
        var self            = this,
            target          = null,
            el              = null,
            dataset         = null,
            i               = -1;

        self.callActions('beforeIndexTargets', arguments);

        self.dom.targets = self.config.layout.allowNestedTargets ?
            self.dom.container.querySelectorAll(self.config.selectors.target) :
            h.children(self.dom.container, self.config.selectors.target, self.dom.document);

        self.dom.targets = h.arrayFromList(self.dom.targets);

        self.targets = [];

        if ((dataset = self.config.load.dataset) && dataset.length !== self.dom.targets.length) {
            throw new Error(mixitup.messages.errorDatasetPrerenderedMismatch());
        }

        if (self.dom.targets.length) {
            for (i = 0; el = self.dom.targets[i]; i++) {
                target = new mixitup.Target();

                target.init(el, self, dataset ? dataset[i] : void(0));

                target.isInDom = true;

                self.targets.push(target);
            }

            self.dom.parent = self.dom.targets[0].parentElement === self.dom.container ?
                self.dom.container :
                self.dom.targets[0].parentElement;
        }

        self.origOrder = self.targets;

        self.callActions('afterIndexTargets', arguments);
    },

    initControls: function() {
        var self                = this,
            definition          = '',
            controlElements     = null,
            el                  = null,
            parent              = null,
            delagators          = null,
            control             = null,
            i                   = -1,
            j                   = -1;

        self.callActions('beforeInitControls', arguments);

        switch (self.config.controls.scope) {
            case 'local':
                parent = self.dom.container;

                break;
            case 'global':
                parent = self.dom.document;

                break;
            default:
                throw new Error(mixitup.messages.errorConfigInvalidControlsScope());
        }

        for (i = 0; definition = mixitup.controlDefinitions[i]; i++) {
            if (self.config.controls.live || definition.live) {
                if (definition.parent) {
                    delagators = self.dom[definition.parent];

                    if (!delagators || delagators.length < 0) continue;

                    if (typeof delagators.length !== 'number') {
                        delagators = [delagators];
                    }
                } else {
                    delagators = [parent];
                }

                for (j = 0; (el = delagators[j]); j++) {
                    control = self.getControl(el,  definition.type, definition.selector);

                    self.controls.push(control);
                }
            } else {
                controlElements = parent.querySelectorAll(self.config.selectors.control + definition.selector);

                for (j = 0; (el = controlElements[j]); j++) {
                    control = self.getControl(el, definition.type, '');

                    if (!control) continue;

                    self.controls.push(control);
                }
            }
        }

        self.callActions('afterInitControls', arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {HTMLElement} el
     * @param   {string}      type
     * @param   {string}      selector
     * @return  {mixitup.Control|null}
     */

    getControl: function(el, type, selector) {
        var self    = this,
            control = null,
            i       = -1;

        self.callActions('beforeGetControl', arguments);

        if (!selector) {
            // Static controls only

            for (i = 0; control = mixitup.controls[i]; i++) {
                if (control.el === el && control.isBound(self)) {
                    // Control already bound to this mixer (as another type).

                    // NB: This prevents duplicate controls from being registered where a selector
                    // might collide, eg: "[data-filter]" and "[data-filter][data-sort]"

                    return self.callFilters('controlGetControl', null, arguments);
                } else if (control.el === el && control.type === type && control.selector === selector) {
                    // Another mixer is already using this control, add this mixer as a binding

                    control.addBinding(self);

                    return self.callFilters('controlGetControl', control, arguments);
                }
            }
        }

        // Create new control

        control = new mixitup.Control();

        control.init(el, type, selector);

        control.classNames.base     = h.getClassname(self.config.classNames, type);
        control.classNames.active   = h.getClassname(self.config.classNames, type, self.config.classNames.modifierActive);
        control.classNames.disabled = h.getClassname(self.config.classNames, type, self.config.classNames.modifierDisabled);

        // Add a reference to this mixer as a binding

        control.addBinding(self);

        return self.callFilters('controlGetControl', control, arguments);
    },

    /**
     * Creates a compound selector by joining the `toggleArray` value as per the
     * defined toggle logic.
     *
     * @private
     * @instance
     * @since   3.0.0
     * @return  {string}
     */

    getToggleSelector: function() {
        var self            = this,
            delineator      = self.config.controls.toggleLogic === 'or' ? ', ' : '',
            toggleSelector  = '';

        self.callActions('beforeGetToggleSelector', arguments);

        self.toggleArray = h.clean(self.toggleArray);

        toggleSelector = self.toggleArray.join(delineator);

        if (toggleSelector === '') {
            toggleSelector = self.config.controls.toggleDefault;
        }

        return self.callFilters('selectorGetToggleSelector', toggleSelector, arguments);
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

    buildToggleArray: function(command, state) {
        var self                    = this,
            activeFilterSelector    = '';

        self.callActions('beforeBuildToggleArray', arguments);

        if (command && command.filter) {
            activeFilterSelector = command.filter.selector.replace(/\s/g, '');
        } else if (state) {
            activeFilterSelector = state.activeFilter.selector.replace(/\s/g, '');
        } else {
            return;
        }

        if (activeFilterSelector === self.config.selectors.target || activeFilterSelector === 'all') {
            activeFilterSelector = '';
        }

        if (self.config.controls.toggleLogic === 'or') {
            self.toggleArray = activeFilterSelector.split(',');
        } else {
            self.toggleArray = self.splitCompoundSelector(activeFilterSelector);
        }

        self.toggleArray = h.clean(self.toggleArray);

        self.callActions('afterBuildToggleArray', arguments);
    },

    /**
     * Takes a compound selector (e.g. `.cat-1.cat-2`, `[data-cat="1"][data-cat="2"]`)
     * and breaks into its individual selectors.
     *
     * @private
     * @instance
     * @since   3.0.0
     * @param   {string} compoundSelector
     * @return  {string[]}
     */

    splitCompoundSelector: function(compoundSelector) {
        // Break at a `.` or `[`, capturing the delineator

        var partials    = compoundSelector.split(/([\.\[])/g),
            toggleArray = [],
            selector    = '',
            i           = -1;

        if (partials[0] === '') {
            partials.shift();
        }

        for (i = 0; i < partials.length; i++) {
            if (i % 2 === 0) {
                selector = '';
            }

            selector += partials[i];

            if (i % 2 !== 0) {
                toggleArray.push(selector);
            }
        }

        return toggleArray;
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

    updateControls: function(command) {
        var self    = this,
            control = null,
            output  = new mixitup.CommandMultimix(),
            i       = -1;

        self.callActions('beforeUpdateControls', arguments);

        // Sanitise to defaults

        if (command.filter) {
            output.filter = command.filter.selector;
        } else {
            output.filter = self.state.activeFilter.selector;
        }

        if (command.sort) {
            output.sort = self.buildSortString(command.sort);
        } else {
            output.sort = self.buildSortString(self.state.activeSort);
        }

        if (output.filter === self.config.selectors.target) {
            output.filter = 'all';
        }

        if (output.filter === '') {
            output.filter = 'none';
        }

        h.freeze(output);

        for (i = 0; control = self.controls[i]; i++) {
            control.update(output, self.toggleArray);
        }

        self.callActions('afterUpdateControls', arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {mixitup.CommandSort}   command
     * @return  {string}
     */

    buildSortString: function(command) {
        var self    = this;
        var output  = '';

        output += command.sortString;

        if (command.next) {
            output += ' ' + self.buildSortString(command.next);
        }

        return output;
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {object}        command
     * @param   {Operation}     operation
     * @return  {Promise.<mixitup.State>}
     */

    insertTargets: function(command, operation) {
        var self            = this,
            nextSibling     = null,
            insertionIndex  = -1,
            frag            = null,
            target          = null,
            el              = null,
            i               = -1;

        self.callActions('beforeInsertTargets', arguments);

        if (typeof command.index === 'undefined') command.index = 0;

        nextSibling = self.getNextSibling(command.index, command.sibling, command.position);
        frag        = self.dom.document.createDocumentFragment();

        if (nextSibling) {
            insertionIndex = h.index(nextSibling, self.config.selectors.target);
        } else {
            insertionIndex = self.targets.length;
        }

        if (command.collection) {
            for (i = 0; el = command.collection[i]; i++) {
                if (self.dom.targets.indexOf(el) > -1) {
                    throw new Error(mixitup.messages.errorInsertPreexistingElement());
                }

                // Ensure elements are hidden when they are added to the DOM, so they can
                // be animated in gracefully

                el.style.display = 'none';

                frag.appendChild(el);
                frag.appendChild(self.dom.document.createTextNode(' '));

                if (!h.isElement(el, self.dom.document) || !el.matches(self.config.selectors.target)) continue;

                target = new mixitup.Target();

                target.init(el, self);

                target.isInDom = true;

                self.targets.splice(insertionIndex, 0, target);

                insertionIndex++;
            }

            self.dom.parent.insertBefore(frag, nextSibling);
        }

        // Since targets have been added, the original order must be updated

        operation.startOrder = self.origOrder = self.targets;

        self.callActions('afterInsertTargets', arguments);
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

    getNextSibling: function(index, sibling, position) {
        var self    = this,
            element = null;

        index = Math.max(index, 0);

        if (sibling && position === 'before') {
            // Explicit sibling

            element = sibling;
        } else if (sibling && position === 'after') {
            // Explicit sibling

            element = sibling.nextElementSibling || null;
        } else if (self.targets.length > 0 && typeof index !== 'undefined') {
            // Index and targets exist

            element = (index < self.targets.length || !self.targets.length) ?
                self.targets[index].dom.el :
                self.targets[self.targets.length - 1].dom.el.nextElementSibling;
        } else if (self.targets.length === 0 && self.dom.parent.children.length > 0) {
            // No targets but other siblings

            if (self.config.layout.siblingAfter) {
                element = self.config.layout.siblingAfter;
            } else if (self.config.layout.siblingBefore) {
                element = self.config.layout.siblingBefore.nextElementSibling;
            } else {
                self.dom.parent.children[0];
            }
        } else {
            element === null;
        }

        return self.callFilters('elementGetNextSibling', element, arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    filterOperation: function(operation) {
        var self        = this,
            testResult  = false,
            index       = -1,
            action      = '',
            target      = null,
            i           = -1;

        self.callActions('beforeFilterOperation', arguments);

        action = operation.newFilter.action;

        for (i = 0; target = operation.newOrder[i]; i++) {
            if (operation.newFilter.collection) {
                // show via collection

                testResult = operation.newFilter.collection.indexOf(target.dom.el) > -1;
            } else {
                // show via selector

                if (operation.newFilter.selector === '') {
                    testResult = false;
                } else {
                    testResult = target.dom.el.matches(operation.newFilter.selector);
                }
            }

            self.evaluateHideShow(testResult, target, action, operation);
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

        if (operation.show.length === 0 && operation.newFilter.selector !== '' && self.targets.length !== 0) {
            operation.hasFailed = true;
        }

        self.callActions('afterFilterOperation', arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {boolean}   testResult
     * @param   {Element}   target
     * @param   {string}    action
     * @param   {Operation} operation
     * @return  {void}
     */

    evaluateHideShow: function(testResult, target, action, operation) {
        var self = this,
            filteredTestResult = false,
            args = Array.prototype.slice.call(arguments, 1);

        filteredTestResult = self.callFilters('testResultEvaluateHideShow', testResult, args);

        self.callActions('beforeEvaluateHideShow', arguments);

        if (
            filteredTestResult === true && action === 'show' ||
            filteredTestResult === false && action === 'hide'
        ) {
            operation.show.push(target);

            !target.isShown && operation.toShow.push(target);
        } else {
            operation.hide.push(target);

            target.isShown && operation.toHide.push(target);
        }

        self.callActions('afterEvaluateHideShow', arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    sortOperation: function(operation) {
        var self = this;

        self.callActions('beforeSortOperation', arguments);

        operation.startOrder = self.targets;

        if (operation.newSort.collection) {
            // Sort by collection

            operation.newOrder = operation.newSort.collection;
        } else if (operation.newSort.order === 'random') {
            // Sort random

            operation.newOrder = h.arrayShuffle(operation.startOrder);
        } else if (operation.newSort.attribute === '') {
            // Sort by default

            operation.newOrder = self.origOrder.slice();

            if (operation.newSort.order === 'desc') {
                operation.newOrder.reverse();
            }
        } else {
            // Sort by attribute

            operation.newOrder = operation.startOrder.slice();

            operation.newOrder.sort(function(a, b) {
                return self.compare(a, b, operation.newSort);
            });
        }

        if (h.isEqualArray(operation.newOrder, operation.startOrder)) {
            operation.willSort = false;
        }

        self.callActions('afterSortOperation', arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {mixitup.Target}        a
     * @param   {mixitup.Target}        b
     * @param   {mixitup.CommandSort}   command
     * @return  {Number}
     */

    compare: function(a, b, command) {
        var self        = this,
            order       = command.order,
            attrA       = self.getAttributeValue(a, command.attribute),
            attrB       = self.getAttributeValue(b, command.attribute);

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

        if (attrA === attrB && command.next) {
            return self.compare(a, b, command.next);
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
     * @param   {mixitup.Target}    target
     * @param   {string}            [attribute]
     * @return  {(String|Number)}
     */

    getAttributeValue: function(target, attribute) {
        var self    = this,
            value   = '';

        value = target.dom.el.getAttribute('data-' + attribute);

        if (value === null) {
            if (self.config.debug.showWarnings) {
                // Encourage users to assign values to all targets to avoid erroneous sorting
                // when types are mixed

                console.warn(mixitup.messages.warningInconsistentSortingAttributes({
                    attribute: 'data-' + attribute
                }));
            }
        }

        // If an attribute is not present, return 0 as a safety value

        return self.callFilters('valueGetAttributeValue', value || 0, arguments);
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

    printSort: function(isResetting, operation) {
        var self        = this,
            startOrder  = isResetting ? operation.newOrder : operation.startOrder,
            newOrder    = isResetting ? operation.startOrder : operation.newOrder,
            nextSibling = startOrder.length ? startOrder[startOrder.length - 1].dom.el.nextElementSibling : null,
            frag        = window.document.createDocumentFragment(),
            whitespace  = null,
            target      = null,
            el          = null,
            i           = -1;

        self.callActions('beforePrintSort', arguments);

        // Empty the container

        for (i = 0; target = startOrder[i]; i++) {
            el = target.dom.el;

            if (el.style.position === 'absolute') continue;

            h.removeWhitespace(el.previousSibling);

            el.parentElement.removeChild(el);
        }

        whitespace = nextSibling ? nextSibling.previousSibling : self.dom.parent.lastChild;

        if (whitespace && whitespace.nodeName === '#text') {
            h.removeWhitespace(whitespace);
        }

        for (i = 0; target = newOrder[i]; i++) {
            // Add targets into a document fragment

            el = target.dom.el;

            if (h.isElement(frag.lastChild)) {
                frag.appendChild(window.document.createTextNode(' '));
            }

            frag.appendChild(el);
        }

        // Insert the document fragment into the container
        // before any other non-target elements

        if (self.dom.parent.firstChild && self.dom.parent.firstChild !== nextSibling) {
            frag.insertBefore(window.document.createTextNode(' '), frag.childNodes[0]);
        }

        if (nextSibling) {
            frag.appendChild(window.document.createTextNode(' '));

            self.dom.parent.insertBefore(frag, nextSibling);
        } else {
            self.dom.parent.appendChild(frag);
        }

        self.callActions('afterPrintSort', arguments);
    },

    /**
     * Parses user-defined sort strings (i.e. `default:asc`) into sort commands objects.
     *
     * @private
     * @instance
     * @since   3.0.0
     * @param   {string}                sortString
     * @param   {mixitup.CommandSort}   command
     * @return  {mixitup.CommandSort}
     */

    parseSortString: function(sortString, command) {
        var self        = this,
            rules       = sortString.split(' '),
            current     = command,
            rule        = [],
            i           = -1;

        // command.sortString = sortString;

        for (i = 0; i < rules.length; i++) {
            rule = rules[i].split(':');

            current.sortString  = rules[i];
            current.attribute   = h.dashCase(rule[0]);
            current.order       = rule[1] || 'asc';

            switch (current.attribute) {
                case 'default':
                    // treat "default" as sorting by no attribute

                    current.attribute = '';

                    break;
                case 'random':
                    // treat "random" as an order not an attribute

                    current.attribute   = '';
                    current.order       = 'random';

                    break;
            }

            if (!current.attribute || current.order === 'random') break;

            if (i < rules.length - 1) {
                // Embed reference to the next command

                current.next = new mixitup.CommandSort();

                h.freeze(current);

                current = current.next;
            }
        }

        return self.callFilters('commandsParseSort', command, arguments);
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

    parseEffects: function() {
        var self            = this,
            transformName   = '',
            effectsIn       = self.config.animation.effectsIn || self.config.animation.effects,
            effectsOut      = self.config.animation.effectsOut || self.config.animation.effects;

        self.callActions('beforeParseEffects', arguments);

        self.effectsIn      = new mixitup.StyleData();
        self.effectsOut     = new mixitup.StyleData();
        self.transformIn    = [];
        self.transformOut   = [];

        self.effectsIn.opacity = self.effectsOut.opacity = 1;

        self.parseEffect('fade', effectsIn, self.effectsIn, self.transformIn);
        self.parseEffect('fade', effectsOut, self.effectsOut, self.transformOut, true);

        for (transformName in mixitup.transformDefaults) {
            if (!(mixitup.transformDefaults[transformName] instanceof mixitup.TransformData)) {
                continue;
            }

            self.parseEffect(transformName, effectsIn, self.effectsIn, self.transformIn);
            self.parseEffect(transformName, effectsOut, self.effectsOut, self.transformOut, true);
        }

        self.parseEffect('stagger', effectsIn, self.effectsIn, self.transformIn);
        self.parseEffect('stagger', effectsOut, self.effectsOut, self.transformOut, true);

        self.callActions('afterParseEffects', arguments);
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

    parseEffect: function(effectName, effectString, effects, transform, isOut) {
        var self        = this,
            re          = /\(([^)]+)\)/,
            propIndex   = -1,
            str         = '',
            match       = [],
            val         = '',
            units       = ['%', 'px', 'em', 'rem', 'vh', 'vw', 'deg'],
            unit        = '',
            i           = -1;

        self.callActions('beforeParseEffect', arguments);

        if (typeof effectString !== 'string') {
            throw new TypeError(mixitup.messages.errorConfigInvalidAnimationEffects());
        }

        if (effectString.indexOf(effectName) < 0) {
            // The effect is not present in the effects string

            if (effectName === 'stagger') {
                // Reset stagger to 0

                self.staggerDuration = 0;
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
                self.staggerDuration = val ? parseFloat(val) : 100;

                // TODO: Currently stagger must be applied globally, but
                // if seperate values are specified for in/out, this should
                // be respected

                break;
            default:
                // All other effects are transforms following the same structure

                if (isOut && self.config.animation.reverseOut && effectName !== 'scale') {
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

        self.callActions('afterParseEffect', arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {State}
     */

    buildState: function(operation) {
        var self        = this,
            state       = new mixitup.State(),
            target      = null,
            i           = -1;

        self.callActions('beforeBuildState', arguments);

        // Map target elements into state arrays.
        // the real target objects should never be exposed

        for (i = 0; target = self.targets[i]; i++) {
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

        state.id                        = self.id;
        state.container                 = self.dom.container;
        state.activeFilter              = operation.newFilter;
        state.activeSort                = operation.newSort;
        state.activeDataset             = operation.newDataset;
        state.activeContainerClassName  = operation.newContainerClassName;
        state.hasFailed                 = operation.hasFailed;
        state.totalTargets              = self.targets.length;
        state.totalShow                 = operation.show.length;
        state.totalHide                 = operation.hide.length;
        state.totalMatching             = operation.matching.length;
        state.triggerElement            = operation.triggerElement;

        return self.callFilters('stateBuildState', state, arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {boolean}   shouldAnimate
     * @param   {Operation} operation
     * @return  {void}
     */

    goMix: function(shouldAnimate, operation) {
        var self        = this,
            deferred    = null;

        self.callActions('beforeGoMix', arguments);

        // If the animation duration is set to 0ms,
        // or no effects specified,
        // or the container is hidden
        // then abort animation

        if (
            !self.config.animation.duration || !self.config.animation.effects || !h.isVisible(self.dom.container)
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

        mixitup.events.fire('mixStart', self.dom.container, {
            state: operation.startState,
            futureState: operation.newState,
            instance: self
        }, self.dom.document);

        if (typeof self.config.callbacks.onMixStart === 'function') {
            self.config.callbacks.onMixStart.call(
                self.dom.container,
                operation.startState,
                operation.newState,
                self
            );
        }

        h.removeClass(self.dom.container, h.getClassname(self.config.classNames, 'container', self.config.classNames.modifierFailed));

        if (!self.userDeferred) {
            // Queue empty, no pending operations

            deferred = self.userDeferred = h.defer(mixitup.libraries);
        } else {
            // Use existing deferred

            deferred = self.userDeferred;
        }

        self.isBusy = true;

        if (!shouldAnimate || !mixitup.features.has.transitions) {
            // Abort

            if (self.config.debug.fauxAsync) {
                setTimeout(function() {
                    self.cleanUp(operation);
                }, self.config.animation.duration);
            } else {
                self.cleanUp(operation);
            }

            return self.callFilters('promiseGoMix', deferred.promise, arguments);
        }

        // If we should animate and the platform supports transitions, go for it

        if (window.pageYOffset !== operation.docState.scrollTop) {
            window.scrollTo(operation.docState.scrollLeft, operation.docState.scrollTop);
        }

        if (self.config.animation.applyPerspective) {
            self.dom.parent.style[mixitup.features.perspectiveProp] =
                self.config.animation.perspectiveDistance;

            self.dom.parent.style[mixitup.features.perspectiveOriginProp] =
                self.config.animation.perspectiveOrigin;
        }

        if (
            self.config.animation.animateResizeContainer &&
            operation.startHeight !== operation.newHeight &&
            operation.viewportDeltaY !== operation.startHeight - operation.newHeight
        ) {
            self.dom.parent.style.height = operation.startHeight + 'px';
        }

        if (
            self.config.animation.animateResizeContainer &&
            operation.startWidth !== operation.newWidth &&
            operation.viewportDeltaX !== operation.startWidth - operation.newWidth
        ) {
            self.dom.parent.style.width = operation.startWidth + 'px';
        }

        if (operation.startHeight === operation.newHeight) {
            self.dom.parent.style.height = operation.startHeight + 'px';
        }

        if (operation.startWidth === operation.newWidth) {
            self.dom.parent.style.width = operation.startWidth + 'px';
        }

        if (operation.startHeight === operation.newHeight && operation.startWidth === operation.newWidth) {
            self.dom.parent.style.overflow = 'hidden';
        }

        requestAnimationFrame(function() {
            self.moveTargets(operation);
        });

        return self.callFilters('promiseGoMix', deferred.promise, arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    getStartMixData: function(operation) {
        var self        = this,
            parentStyle = window.getComputedStyle(self.dom.parent),
            parentRect  = self.dom.parent.getBoundingClientRect(),
            target      = null,
            data        = {},
            i           = -1,
            boxSizing   = parentStyle[mixitup.features.boxSizingProp];

        self.incPadding = (boxSizing === 'border-box');

        self.callActions('beforeGetStartMixData', arguments);

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

        operation.startHeight = self.incPadding ?
            parentRect.height :
            parentRect.height -
                parseFloat(parentStyle.paddingTop) -
                parseFloat(parentStyle.paddingBottom) -
                parseFloat(parentStyle.borderTop) -
                parseFloat(parentStyle.borderBottom);

        operation.startWidth = self.incPadding ?
            parentRect.width :
            parentRect.width -
                parseFloat(parentStyle.paddingLeft) -
                parseFloat(parentStyle.paddingRight) -
                parseFloat(parentStyle.borderLeft) -
                parseFloat(parentStyle.borderRight);

        self.callActions('afterGetStartMixData', arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    setInter: function(operation) {
        var self    = this,
            target  = null,
            i       = -1;

        self.callActions('beforeSetInter', arguments);

        // Prevent scrollbar flicker on non-inertial scroll platforms by clamping height/width

        if (self.config.animation.clampHeight) {
            self.dom.parent.style.height    = operation.startHeight + 'px';
            self.dom.parent.style.overflow  = 'hidden';
        }

        if (self.config.animation.clampWidth) {
            self.dom.parent.style.width     = operation.startWidth + 'px';
            self.dom.parent.style.overflow  = 'hidden';
        }

        for (i = 0; target = operation.toShow[i]; i++) {
            target.show();
        }

        if (operation.willChangeLayout) {
            h.removeClass(self.dom.container, operation.startContainerClassName);
            h.addClass(self.dom.container, operation.newContainerClassName);
        }

        self.callActions('afterSetInter', arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    getInterMixData: function(operation) {
        var self    = this,
            target  = null,
            i       = -1;

        self.callActions('beforeGetInterMixData', arguments);

        for (i = 0; target = operation.show[i]; i++) {
            operation.showPosData[i].interPosData = target.getPosData();
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            operation.toHidePosData[i].interPosData = target.getPosData();
        }

        self.callActions('afterGetInterMixData', arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    setFinal: function(operation) {
        var self    = this,
            target  = null,
            i       = -1;

        self.callActions('beforeSetFinal', arguments);

        operation.willSort && self.printSort(false, operation);

        for (i = 0; target = operation.toHide[i]; i++) {
            target.hide();
        }

        self.callActions('afterSetFinal', arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    getFinalMixData: function(operation) {
        var self        = this,
            parentStyle = null,
            parentRect  = null,
            target      = null,
            i           = -1;

        self.callActions('beforeGetFinalMixData', arguments);

        for (i = 0; target = operation.show[i]; i++) {
            operation.showPosData[i].finalPosData = target.getPosData();
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            operation.toHidePosData[i].finalPosData = target.getPosData();
        }

        // Remove clamping

        if (self.config.animation.clampHeight || self.config.animation.clampWidth) {
            self.dom.parent.style.height    =
            self.dom.parent.style.width     =
            self.dom.parent.style.overflow  = '';
        }

        if (!self.incPadding) {
            parentStyle = window.getComputedStyle(self.dom.parent);
        }

        parentRect  = self.dom.parent.getBoundingClientRect();

        operation.newX = parentRect.left;
        operation.newY = parentRect.top;

        operation.newHeight = self.incPadding ?
            parentRect.height :
            parentRect.height -
                parseFloat(parentStyle.paddingTop) -
                parseFloat(parentStyle.paddingBottom) -
                parseFloat(parentStyle.borderTop) -
                parseFloat(parentStyle.borderBottom);

        operation.newWidth = self.incPadding ?
            parentRect.width :
            parentRect.width -
                parseFloat(parentStyle.paddingLeft) -
                parseFloat(parentStyle.paddingRight) -
                parseFloat(parentStyle.borderLeft) -
                parseFloat(parentStyle.borderRight);

        operation.viewportDeltaX = operation.docState.viewportWidth - this.dom.document.documentElement.clientWidth;
        operation.viewportDeltaY = operation.docState.viewportHeight - this.dom.document.documentElement.clientHeight;

        if (operation.willSort) {
            self.printSort(true, operation);
        }

        for (i = 0; target = operation.toShow[i]; i++) {
            target.hide();
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            target.show();
        }

        if (operation.willChangeLayout) {
            h.removeClass(self.dom.container, operation.newContainerClassName);
            h.addClass(self.dom.container, self.config.layout.containerClassName);
        }

        self.callActions('afterGetFinalMixData', arguments);
    },

    /**
     * @private
     * @instance
     * @since    3.0.0
     * @param    {Operation}     operation
     */

    getTweenData: function(operation) {
        var self            = this,
            target          = null,
            posData         = null,
            effectNames     = Object.getOwnPropertyNames(self.effectsIn),
            effectName      = '',
            effect          = null,
            widthChange     = -1,
            heightChange    = -1,
            i               = -1,
            j               = -1;

        self.callActions('beforeGetTweenData', arguments);

        for (i = 0; target = operation.show[i]; i++) {
            posData             = operation.showPosData[i];
            posData.posIn       = new mixitup.StyleData();
            posData.posOut      = new mixitup.StyleData();
            posData.tweenData   = new mixitup.StyleData();

            // Process x and y

            if (target.isShown) {
                posData.posIn.x = posData.startPosData.x - posData.interPosData.x;
                posData.posIn.y = posData.startPosData.y - posData.interPosData.y;
            } else {
                posData.posIn.x = posData.posIn.y = 0;
            }

            posData.posOut.x = posData.finalPosData.x - posData.interPosData.x;
            posData.posOut.y = posData.finalPosData.y - posData.interPosData.y;

            // Process opacity

            posData.posIn.opacity       = target.isShown ? 1 : self.effectsIn.opacity;
            posData.posOut.opacity      = 1;
            posData.tweenData.opacity   = posData.posOut.opacity - posData.posIn.opacity;

            // Adjust x and y if not nudging

            if (!target.isShown && !self.config.animation.nudge) {
                posData.posIn.x = posData.posOut.x;
                posData.posIn.y = posData.posOut.y;
            }

            posData.tweenData.x = posData.posOut.x - posData.posIn.x;
            posData.tweenData.y = posData.posOut.y - posData.posIn.y;

            // Process width, height, and margins

            if (self.config.animation.animateResizeTargets) {
                posData.posIn.width     = posData.startPosData.width;
                posData.posIn.height    = posData.startPosData.height;

                // "||" Prevents width/height change from including 0 width/height if hiding or showing

                widthChange = (posData.startPosData.width || posData.finalPosData.width) - posData.interPosData.width;

                posData.posIn.marginRight = posData.startPosData.marginRight - widthChange;

                heightChange = (posData.startPosData.height || posData.finalPosData.height) - posData.interPosData.height;

                posData.posIn.marginBottom = posData.startPosData.marginBottom - heightChange;

                posData.posOut.width    = posData.finalPosData.width;
                posData.posOut.height   = posData.finalPosData.height;

                widthChange = (posData.finalPosData.width || posData.startPosData.width) - posData.interPosData.width;

                posData.posOut.marginRight = posData.finalPosData.marginRight - widthChange;

                heightChange = (posData.finalPosData.height || posData.startPosData.height) - posData.interPosData.height;

                posData.posOut.marginBottom = posData.finalPosData.marginBottom - heightChange;

                posData.tweenData.width         = posData.posOut.width - posData.posIn.width;
                posData.tweenData.height        = posData.posOut.height - posData.posIn.height;
                posData.tweenData.marginRight   = posData.posOut.marginRight - posData.posIn.marginRight;
                posData.tweenData.marginBottom  = posData.posOut.marginBottom - posData.posIn.marginBottom;
            }

            // Process transforms

            for (j = 0; effectName = effectNames[j]; j++) {
                effect = self.effectsIn[effectName];

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
            posData.posOut.x    = self.config.animation.nudge ? 0 : posData.posIn.x;
            posData.posOut.y    = self.config.animation.nudge ? 0 : posData.posIn.y;
            posData.tweenData.x = posData.posOut.x - posData.posIn.x;
            posData.tweenData.y = posData.posOut.y - posData.posIn.y;

            // Process width, height, and margins

            if (self.config.animation.animateResizeTargets) {
                posData.posIn.width         = posData.startPosData.width;
                posData.posIn.height        = posData.startPosData.height;

                widthChange = posData.startPosData.width - posData.interPosData.width;

                posData.posIn.marginRight = posData.startPosData.marginRight - widthChange;

                heightChange = posData.startPosData.height - posData.interPosData.height;

                posData.posIn.marginBottom = posData.startPosData.marginBottom - heightChange;
            }

            // Process opacity

            posData.posIn.opacity       = 1;
            posData.posOut.opacity      = self.effectsOut.opacity;
            posData.tweenData.opacity   = posData.posOut.opacity - posData.posIn.opacity;

            // Process transforms

            for (j = 0; effectName = effectNames[j]; j++) {
                effect = self.effectsOut[effectName];

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

        self.callActions('afterGetTweenData', arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    moveTargets: function(operation) {
        var self            = this,
            target          = null,
            moveData        = null,
            posData         = null,
            statusChange    = '',
            willTransition  = false,
            staggerIndex    = -1,
            i               = -1,
            checkProgress   = self.checkProgress.bind(self);

        self.callActions('beforeMoveTargets', arguments);

        // TODO: this is an extra loop in addition to the calcs
        // done in getOperation, could some of this be done there?

        for (i = 0; target = operation.show[i]; i++) {
            moveData    = new mixitup.IMoveData();
            posData     = operation.showPosData[i];

            statusChange = target.isShown ? 'none' : 'show';

            willTransition = self.willTransition(
                statusChange,
                operation.hasEffect,
                posData.posIn,
                posData.posOut
            );

            if (willTransition) {
                // Prevent non-transitioning targets from incrementing the staggerIndex

                staggerIndex++;
            }

            target.show();

            moveData.posIn          = posData.posIn;
            moveData.posOut         = posData.posOut;
            moveData.statusChange   = statusChange;
            moveData.staggerIndex   = staggerIndex;
            moveData.operation      = operation;
            moveData.callback       = willTransition ? checkProgress : null;

            target.move(moveData);
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            posData  = operation.toHidePosData[i];
            moveData = new mixitup.IMoveData();

            statusChange = 'hide';

            willTransition = self.willTransition(statusChange, posData.posIn, posData.posOut);

            moveData.posIn          = posData.posIn;
            moveData.posOut         = posData.posOut;
            moveData.statusChange   = statusChange;
            moveData.staggerIndex   = i;
            moveData.operation      = operation;
            moveData.callback       = willTransition ? checkProgress : null;

            target.move(moveData);
        }

        if (self.config.animation.animateResizeContainer) {
            self.dom.parent.style[mixitup.features.transitionProp] =
                'height ' + self.config.animation.duration + 'ms ease, ' +
                'width ' + self.config.animation.duration + 'ms ease ';

            requestAnimationFrame(function() {
                if (
                    operation.startHeight !== operation.newHeight &&
                    operation.viewportDeltaY !== operation.startHeight - operation.newHeight
                ) {
                    self.dom.parent.style.height = operation.newHeight + 'px';
                }

                if (
                    operation.startWidth !== operation.newWidth &&
                    operation.viewportDeltaX !== operation.startWidth - operation.newWidth
                ) {
                    self.dom.parent.style.width = operation.newWidth + 'px';
                }
            });
        }

        if (operation.willChangeLayout) {
            h.removeClass(self.dom.container, self.config.layout.ContainerClassName);
            h.addClass(self.dom.container, operation.newContainerClassName);
        }

        self.callActions('afterMoveTargets', arguments);
    },

    /**
     * @private
     * @instance
     * @return  {boolean}
     */

    hasEffect: function() {
        var self        = this,
            EFFECTABLES = [
                'scale',
                'translateX', 'translateY', 'translateZ',
                'rotateX', 'rotateY', 'rotateZ'
            ],
            effectName  = '',
            effect      = null,
            result      = false,
            value       = -1,
            i           = -1;

        if (self.effectsIn.opacity !== 1) {
            return self.callFilters('resultHasEffect', true, arguments);
        }

        for (i = 0; effectName = EFFECTABLES[i]; i++) {
            effect  = self.effectsIn[effectName];
            value   = (typeof effect && effect.value !== 'undefined') ?
                effect.value : effect;

            if (value !== 0) {
                result = true;

                break;
            }
        }

        return self.callFilters('resultHasEffect', result, arguments);
    },

    /**
     * Determines if a target element will transition in
     * some fasion and therefore requires binding of
     * transitionEnd
     *
     * @private
     * @instance
     * @since   3.0.0
     * @param   {string}        statusChange
     * @param   {boolean}       hasEffect
     * @param   {StyleData}     posIn
     * @param   {StyleData}     posOut
     * @return  {boolean}
     */

    willTransition: function(statusChange, hasEffect, posIn, posOut) {
        var self    = this,
            result  = false;

        if (!h.isVisible(self.dom.container)) {
            // If the container is not visible, the transitionEnd
            // event will not occur and MixItUp will hang

            result = false;
        } else if (
            (statusChange !== 'none' && hasEffect) ||
            posIn.x !== posOut.x ||
            posIn.y !== posOut.y
        ) {
            // If opacity and/or translate will change

            result = true;
        } else if (self.config.animation.animateResizeTargets) {
            // Check if width, height or margins will change

            result = (
                posIn.width !== posOut.width ||
                posIn.height !== posOut.height ||
                posIn.marginRight !== posOut.marginRight ||
                posIn.marginTop !== posOut.marginTop
            );
        } else {
            result = false;
        }

        return self.callFilters('resultWillTransition', result, arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    checkProgress: function(operation) {
        var self = this;

        self.targetsDone++;

        if (self.targetsBound === self.targetsDone) {
            self.cleanUp(operation);
        }
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Operation}     operation
     * @return  {void}
     */

    cleanUp: function(operation) {
        var self                = this,
            target              = null,
            whitespaceBefore    = null,
            whitespaceAfter     = null,
            nextInQueue         = null,
            i                   = -1;

        self.callActions('beforeCleanUp', arguments);

        self.targetsMoved          =
            self.targetsImmovable  =
            self.targetsBound      =
            self.targetsDone       = 0;

        for (i = 0; target = operation.show[i]; i++) {
            target.cleanUp();

            target.show();
        }

        for (i = 0; target = operation.toHide[i]; i++) {
            target.cleanUp();

            target.hide();
        }

        if (operation.willSort) {
            self.printSort(false, operation);
        }

        // Remove any styles applied to the parent container

        self.dom.parent.style[mixitup.features.transitionProp]             =
            self.dom.parent.style.height                                   =
            self.dom.parent.style.width                                    =
            self.dom.parent.style.overflow                                 =
            self.dom.parent.style[mixitup.features.perspectiveProp]        =
            self.dom.parent.style[mixitup.features.perspectiveOriginProp]  = '';

        if (operation.willChangeLayout) {
            h.removeClass(self.dom.container, operation.startContainerClassName);
            h.addClass(self.dom.container, operation.newContainerClassName);
        }

        if (operation.toRemove.length) {
            for (i = 0; target = self.targets[i]; i++) {
                if (operation.toRemove.indexOf(target) > -1) {
                    if (
                        (whitespaceBefore = target.dom.el.previousSibling) && whitespaceBefore.nodeName === '#text' &&
                        (whitespaceAfter = target.dom.el.nextSibling) && whitespaceAfter.nodeName === '#text'
                    ) {
                        h.removeWhitespace(whitespaceBefore);
                    }

                    if (!operation.willSort) {
                        // NB: Sorting will remove targets as a bi-product of `printSort()`

                        self.dom.parent.removeChild(target.dom.el);
                    }

                    self.targets.splice(i, 1);

                    target.isInDom = false;

                    i--;
                }
            }

            // Since targets have been removed, the original order must be updated

            self.origOrder = self.targets;
        }

        if (operation.willSort) {
            self.targets = operation.newOrder;
        }

        self.state = operation.newState;
        self.lastOperation = operation;

        self.dom.targets = self.state.targets;

        // mixEnd

        mixitup.events.fire('mixEnd', self.dom.container, {
            state: self.state,
            instance: self
        }, self.dom.document);

        if (typeof self.config.callbacks.onMixEnd === 'function') {
            self.config.callbacks.onMixEnd.call(self.dom.container, self.state, self);
        }

        if (operation.hasFailed) {
            // mixFail

            mixitup.events.fire('mixFail', self.dom.container, {
                state: self.state,
                instance: self
            }, self.dom.document);

            if (typeof self.config.callbacks.onMixFail === 'function') {
                self.config.callbacks.onMixFail.call(self.dom.container, self.state, self);
            }

            h.addClass(self.dom.container, h.getClassname(self.config.classNames, 'container', self.config.classNames.modifierFailed));
        }

        // User-defined callback function

        if (typeof self.userCallback === 'function') {
            self.userCallback.call(self.dom.container, self.state, self);
        }

        if (typeof self.userDeferred.resolve === 'function') {
            self.userDeferred.resolve(self.state);
        }

        self.userCallback  = null;
        self.userDeferred  = null;
        self.lastClicked   = null;
        self.isToggling    = false;
        self.isBusy        = false;

        if (self.queue.length) {
            self.callActions('beforeReadQueueCleanUp', arguments);

            nextInQueue = self.queue.shift();

            // Update non-public API properties stored in queue

            self.userDeferred  = nextInQueue.deferred;
            self.isToggling    = nextInQueue.isToggling;
            self.lastClicked   = nextInQueue.triggerElement;

            if (nextInQueue.instruction.command instanceof mixitup.CommandMultimix) {
                self.multimix.apply(self, nextInQueue.args);
            } else {
                self.dataset.apply(self, nextInQueue.args);
            }
        }

        self.callActions('afterCleanUp', arguments);
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Array<*>}  args
     * @return  {mixitup.UserInstruction}
     */

    parseMultimixArgs: function(args) {
        var self        = this,
            instruction = new mixitup.UserInstruction(),
            arg         = null,
            i           = -1;

        instruction.animate = self.config.animation.enable;
        instruction.command = new mixitup.CommandMultimix();

        for (i = 0; i < args.length; i++) {
            arg = args[i];

            if (arg === null) continue;

            if (typeof arg === 'object') {
                h.extend(instruction.command, arg);
            } else if (typeof arg === 'boolean') {
                instruction.animate = arg;
            } else if (typeof arg === 'function') {
                instruction.callback = arg;
            }
        }

        // Coerce arbitrary command arguments into typed command objects

        if (instruction.command.insert && !(instruction.command.insert instanceof mixitup.CommandInsert)) {
            instruction.command.insert = self.parseInsertArgs([instruction.command.insert]).command;
        }

        if (instruction.command.remove && !(instruction.command.remove instanceof mixitup.CommandRemove)) {
            instruction.command.remove = self.parseRemoveArgs([instruction.command.remove]).command;
        }

        if (instruction.command.filter && !(instruction.command.filter instanceof mixitup.CommandFilter)) {
            instruction.command.filter = self.parseFilterArgs([instruction.command.filter]).command;
        }

        if (instruction.command.sort && !(instruction.command.sort instanceof mixitup.CommandSort)) {
            instruction.command.sort = self.parseSortArgs([instruction.command.sort]).command;
        }

        if (instruction.command.changeLayout && !(instruction.command.changeLayout instanceof mixitup.CommandChangeLayout)) {
            instruction.command.changeLayout = self.parseChangeLayoutArgs([instruction.command.changeLayout]).command;
        }

        instruction = self.callFilters('instructionParseMultimixArgs', instruction, arguments);

        h.freeze(instruction);

        return instruction;
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Array<*>}  args
     * @return  {mixitup.UserInstruction}
     */

    parseFilterArgs: function(args) {
        var self        = this,
            instruction = new mixitup.UserInstruction(),
            arg         = null,
            i           = -1;

        instruction.animate = self.config.animation.enable;
        instruction.command = new mixitup.CommandFilter();

        for (i = 0; i < args.length; i++) {
            arg = args[i];

            if (typeof arg === 'string') {
                // Selector

                instruction.command.selector = arg;
            } else if (arg === null) {
                instruction.command.collection = [];
            } else if (typeof arg === 'object' && h.isElement(arg, self.dom.document)) {
                // Single element

                instruction.command.collection = [arg];
            } else if (typeof arg === 'object' && typeof arg.length !== 'undefined') {
                // Multiple elements in array, NodeList or jQuery collection

                instruction.command.collection = h.arrayFromList(arg);
            } else if (typeof arg === 'object') {
                // Filter command

                h.extend(instruction.command, arg);
            } else if (typeof arg === 'boolean') {
                instruction.animate = arg;
            } else if (typeof arg === 'function') {
                instruction.callback = arg;
            }
        }

        if (instruction.command.selector && instruction.command.collection) {
            throw new Error(mixitup.messages.errorFilterInvalidArguments());
        }

        instruction = self.callFilters('instructionParseFilterArgs', instruction, arguments);

        h.freeze(instruction);

        return instruction;
    },

    parseSortArgs: function(args) {
        var self        = this,
            instruction = new mixitup.UserInstruction(),
            arg         = null,
            sortString  = '',
            i           = -1;

        instruction.animate = self.config.animation.enable;
        instruction.command = new mixitup.CommandSort();

        for (i = 0; i < args.length; i++) {
            arg = args[i];

            if (arg === null) continue;

            switch (typeof arg) {
                case 'string':
                    // Sort string

                    sortString = arg;

                    break;
                case 'object':
                    // Array of element references

                    if (arg.length) {
                        instruction.command.collection = h.arrayFromList(arg);
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

        if (sortString) {
            instruction.command = self.parseSortString(sortString, instruction.command);
        }

        instruction = self.callFilters('instructionParseSortArgs', instruction, arguments);

        h.freeze(instruction);

        return instruction;
    },

    /**
     * @private
     * @instance
     * @since   2.0.0
     * @param   {Array<*>}  args
     * @return  {mixitup.UserInstruction}
     */

    parseInsertArgs: function(args) {
        var self        = this,
            instruction = new mixitup.UserInstruction(),
            arg         = null,
            i           = -1;

        instruction.animate = self.config.animation.enable;
        instruction.command = new mixitup.CommandInsert();

        for (i = 0; i < args.length; i++) {
            arg = args[i];

            if (arg === null) continue;

            if (typeof arg === 'number') {
                // Insert index

                instruction.command.index = arg;
            } else if (typeof arg === 'string' && ['before', 'after'].indexOf(arg) > -1) {
                // 'before'/'after'

                instruction.command.position = arg;
            } else if (typeof arg === 'string') {
                // Markup

                instruction.command.collection =
                    h.arrayFromList(h.createElement(arg).childNodes);
            } else if (typeof arg === 'object' && h.isElement(arg, self.dom.document)) {
                // Single element

                !instruction.command.collection.length ?
                    (instruction.command.collection = [arg]) :
                    (instruction.command.sibling = arg);
            } else if (typeof arg === 'object' && arg.length) {
                // Multiple elements in array or jQuery collection

                !instruction.command.collection.length ?
                    (instruction.command.collection = arg) :
                    instruction.command.sibling = arg[0];
            } else if (typeof arg === 'object' && arg.childNodes && arg.childNodes.length) {
                // Document fragment

                !instruction.command.collection.length ?
                    instruction.command.collection = h.arrayFromList(arg.childNodes) :
                    instruction.command.sibling = arg.childNodes[0];
            } else if (typeof arg === 'object') {
                // Insert command

                h.extend(instruction.command, arg);
            } else if (typeof arg === 'boolean') {
                instruction.animate = arg;
            } else if (typeof arg === 'function') {
                instruction.callback = arg;
            }
        }

        if (instruction.command.index && instruction.command.sibling) {
            throw new Error(mixitup.messages.errorInsertInvalidArguments());
        }

        if (!instruction.command.collection.length && self.config.debug.showWarnings) {
            console.warn(mixitup.messages.warningInsertNoElements());
        }

        instruction = self.callFilters('instructionParseInsertArgs', instruction, arguments);

        h.freeze(instruction);

        return instruction;
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Array<*>}  args
     * @return  {mixitup.UserInstruction}
     */

    parseRemoveArgs: function(args) {
        var self        = this,
            instruction = new mixitup.UserInstruction(),
            target      = null,
            arg         = null,
            i           = -1;

        instruction.animate = self.config.animation.enable;
        instruction.command = new mixitup.CommandRemove();

        for (i = 0; i < args.length; i++) {
            arg = args[i];

            if (arg === null) continue;

            switch (typeof arg) {
                case 'number':
                    if (self.targets[arg]) {
                        instruction.command.targets[0] = self.targets[arg];
                    }

                    break;
                case 'string':
                    instruction.command.collection = h.arrayFromList(self.dom.parent.querySelectorAll(arg));

                    break;
                case 'object':
                    if (arg && arg.length) {
                        instruction.command.collection = arg;
                    } else if (h.isElement(arg, self.dom.document)) {
                        instruction.command.collection = [arg];
                    } else {
                        // Remove command

                        h.extend(instruction.command, arg);
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

        if (instruction.command.collection.length) {
            for (i = 0; target = self.targets[i]; i++) {
                if (instruction.command.collection.indexOf(target.dom.el) > -1) {
                    instruction.command.targets.push(target);
                }
            }
        }

        if (!instruction.command.targets.length && self.config.debug.showWarnings) {
            console.warn(mixitup.messages.warningRemoveNoElements());
        }

        h.freeze(instruction);

        return instruction;
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Array<*>}  args
     * @return  {mixitup.UserInstruction}
     */

    parseDatasetArgs: function(args) {
        var self        = this,
            instruction = new mixitup.UserInstruction(),
            arg         = null,
            i           = -1;

        instruction.animate = self.config.animation.enable;
        instruction.command = new mixitup.CommandDataset();

        for (i = 0; i < args.length; i++) {
            arg = args[i];

            if (arg === null) continue;

            switch (typeof arg) {
                case 'object':
                    if (Array.isArray(arg) || typeof arg.length === 'number') {
                        instruction.command.dataset = arg;
                    } else {
                        // Change layout command

                        h.extend(instruction.command, arg);
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

        h.freeze(instruction);

        return instruction;
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Array<*>}  args
     * @return  {mixitup.UserInstruction}
     */

    parseChangeLayoutArgs: function(args) {
        var self        = this,
            instruction = new mixitup.UserInstruction(),
            arg         = null,
            i           = -1;

        instruction.animate = self.config.animation.enable;
        instruction.command = new mixitup.CommandChangeLayout();

        for (i = 0; i < args.length; i++) {
            arg = args[i];

            if (arg === null) continue;

            switch (typeof arg) {
                case 'string':
                    instruction.command.containerClassName = arg;

                    break;
                case 'object':
                    // Change layout command

                    h.extend(instruction.command, arg);

                    break;
                case 'boolean':
                    instruction.animate = arg;

                    break;
                case 'function':
                    instruction.callback = arg;

                    break;
            }
        }

        h.freeze(instruction);

        return instruction;
    },

    /**
     * @private
     * @instance
     * @since       3.0.0
     * @param       {mixitup.QueueItem}         queueItem
     * @return      {Promise.<mixitup.State>}
     */

    queueMix: function(queueItem) {
        var self            = this,
            deferred        = null,
            toggleSelector  = '';

        self.callActions('beforeQueueMix', arguments);

        deferred = h.defer(mixitup.libraries);

        if (self.config.animation.queue && self.queue.length < self.config.animation.queueLimit) {
            queueItem.deferred = deferred;

            self.queue.push(queueItem);

            // Keep controls in sync with user interactions. Mixer will catch up as it drains the queue.

            if (self.config.controls.enable) {
                if (self.isToggling) {
                    self.buildToggleArray(queueItem.instruction.command);

                    toggleSelector = self.getToggleSelector();

                    self.updateControls({
                        filter: {
                            selector: toggleSelector
                        }
                    });
                } else {
                    self.updateControls(queueItem.instruction.command);
                }
            }
        } else {
            if (self.config.debug.showWarnings) {
                console.warn(mixitup.messages.warningMultimixInstanceQueueFull());
            }

            deferred.resolve(self.state);

            mixitup.events.fire('mixBusy', self.dom.container, {
                state: self.state,
                instance: self
            }, self.dom.document);

            if (typeof self.config.callbacks.onMixBusy === 'function') {
                self.config.callbacks.onMixBusy.call(self.dom.container, self.state, self);
            }
        }

        return self.callFilters('promiseQueueMix', deferred.promise, arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {Array.<object>}    newDataset
     * @return  {Operation}
     */

    getDataOperation: function(newDataset) {
        var self                = this,
            operation           = new mixitup.Operation(),
            startDataset        = [];

        operation = self.callFilters('operationUnmappedGetDataOperation', operation, arguments);

        if (self.dom.targets.length && !(startDataset = (self.state.activeDataset || [])).length) {
            throw new Error(mixitup.messages.errorDatasetNotSet());
        }

        operation.id            = h.randomHex();
        operation.startState    = self.state;
        operation.startDataset  = startDataset;
        operation.newDataset    = newDataset.slice();

        self.diffDatasets(operation);

        operation.startOrder = self.targets;
        operation.newOrder = operation.show;

        if (self.config.animation.enable) {
            self.getStartMixData(operation);
            self.setInter(operation);

            operation.docState = h.getDocumentState(self.dom.document);

            self.getInterMixData(operation);
            self.setFinal(operation);
            self.getFinalMixData(operation);

            self.parseEffects();

            operation.hasEffect = self.hasEffect();

            self.getTweenData(operation);
        }

        self.targets = operation.show.slice();

        operation.newState = self.buildState(operation);

        // NB: Targets to be removed must be included in `self.targets` for removal during clean up,
        // but are added after state is built so that state is accurate

        Array.prototype.push.apply(self.targets, operation.toRemove);

        operation = self.callFilters('operationMappedGetDataOperation', operation, arguments);

        return operation;
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {mixitup.Operation} operation
     * @return  {void}
     */

    diffDatasets: function(operation) {
        var self                = this,
            persistantStartIds  = [],
            persistantNewIds    = [],
            insertedTargets     = [],
            data                = null,
            target              = null,
            el                  = null,
            frag                = null,
            nextEl              = null,
            uids                = {},
            id                  = '',
            i                   = -1;

        self.callActions('beforeDiffDatasets', arguments);

        for (i = 0; data = operation.newDataset[i]; i++) {
            if (typeof (id = data[self.config.data.uidKey]) === 'undefined' || id.toString().length < 1) {
                throw new TypeError(mixitup.messages.errorDatasetInvalidUidKey({
                    uidKey: self.config.data.uidKey
                }));
            }

            if (!uids[id]) {
                uids[id] = true;
            } else {
                throw new Error(mixitup.messages.errorDatasetDuplicateUid({
                    uid: id
                }));
            }

            if ((target = self.cache[id]) instanceof mixitup.Target) {
                // Already in cache

                if (self.config.data.dirtyCheck && !h.deepEquals(data, target.data)) {
                    // change detected

                    el = target.render(data);

                    target.data = data;

                    if (el !== target.dom.el) {
                        // Update target element reference

                        if (target.isInDom) {
                            target.unbindEvents();

                            self.dom.parent.replaceChild(el, target.dom.el);
                        }

                        if (!target.isShown) {
                            el.style.display = 'none';
                        }

                        target.dom.el = el;

                        if (target.isInDom) {
                            target.bindEvents();
                        }
                    }
                }

                el = target.dom.el;
            } else {
                // New target

                target = new mixitup.Target();

                target.init(null, self, data);

                target.hide();
            }

            if (!target.isInDom) {
                // Adding to DOM

                if (!frag) {
                    // Open frag

                    frag = self.dom.document.createDocumentFragment();
                }

                if (frag.lastElementChild) {
                    frag.appendChild(self.dom.document.createTextNode(' '));
                }

                frag.appendChild(target.dom.el);

                target.isInDom = true;

                target.unbindEvents();
                target.bindEvents();
                target.hide();

                operation.toShow.push(target);

                insertedTargets.push(target);
            } else {
                // Already in DOM

                nextEl = target.dom.el.nextElementSibling;

                persistantNewIds.push(id);

                if (frag) {
                    // Close and insert previously opened frag

                    if (frag.lastElementChild) {
                        frag.appendChild(self.dom.document.createTextNode(' '));
                    }

                    self.insertDatasetFrag(frag, target.dom.el, insertedTargets);

                    frag = null;
                }
            }

            operation.show.push(target);
        }

        if (frag) {
            // Unclosed frag remaining

            nextEl = nextEl || self.config.layout.siblingAfter;

            if (nextEl) {
                frag.appendChild(self.dom.document.createTextNode(' '));
            }

            self.insertDatasetFrag(frag, nextEl, insertedTargets);
        }

        for (i = 0; data = operation.startDataset[i]; i++) {
            id = data[self.config.data.uidKey];

            target = self.cache[id];

            if (operation.show.indexOf(target) < 0) {
                // Previously shown but now absent

                operation.hide.push(target);
                operation.toHide.push(target);
                operation.toRemove.push(target);
            } else {
                persistantStartIds.push(id);
            }
        }

        if (!h.isEqualArray(persistantStartIds, persistantNewIds)) {
            operation.willSort = true;
        }

        self.callActions('afterDiffDatasets', arguments);
    },

    /**
     * @private
     * @instance
     * @since   3.1.5
     * @param   {DocumentFragment}          frag
     * @param   {(HTMLElement|null)}        nextEl
     * @param   {Array.<mixitup.Target>}    targets
     * @return  {void}
     */

    insertDatasetFrag: function(frag, nextEl, targets) {
        var self = this;
        var insertAt = nextEl ? Array.from(self.dom.parent.children).indexOf(nextEl) : self.targets.length;

        self.dom.parent.insertBefore(frag, nextEl);

        while (targets.length) {
            self.targets.splice(insertAt, 0, targets.shift());

            insertAt++;
        }
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {mixitup.CommandSort} sortCommandA
     * @param   {mixitup.CommandSort} sortCommandB
     * @return  {boolean}
     */

    willSort: function(sortCommandA, sortCommandB) {
        var self    = this,
            result  = false;

        if (
            self.config.behavior.liveSort ||
            sortCommandA.order       === 'random' ||
            sortCommandA.attribute   !== sortCommandB.attribute ||
            sortCommandA.order       !== sortCommandB.order ||
            sortCommandA.collection  !== sortCommandB.collection ||
            (sortCommandA.next === null && sortCommandB.next) ||
            (sortCommandA.next && sortCommandB.next === null)
        ) {
            result = true;
        } else if (sortCommandA.next && sortCommandB.next) {
            result = self.willSort(sortCommandA.next, sortCommandB.next);
        } else {
            result = false;
        }

        return self.callFilters('resultWillSort', result, arguments);
    },

    /**
     * A shorthand method for `.filter('all')`. Shows all targets in the container.
     *
     * @example
     *
     * .show()
     *
     * @example <caption>Example: Showing all targets</caption>
     *
     * mixer.show()
     *     .then(function(state) {
     *         console.log(state.totalShow === state.totalTargets); // true
     *     });
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
     * A shorthand method for `.filter('none')`. Hides all targets in the container.
     *
     * @example
     *
     * .hide()
     *
     * @example <caption>Example: Hiding all targets</caption>
     *
     * mixer.hide()
     *     .then(function(state) {
     *         console.log(state.totalShow === 0); // true
     *         console.log(state.totalHide === state.totalTargets); // true
     *     });
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
     *
     * .isMixing()
     *
     * @example <caption>Example: Checking the status of a mixer</caption>
     *
     * mixer.sort('random', function() {
     *     console.log(mixer.isMixing()) // false
     * });
     *
     * console.log(mixer.isMixing()) // true
     *
     * @public
     * @instance
     * @since   2.0.0
     * @return  {boolean}
     */

    isMixing: function() {
        var self = this;

        return self.isBusy;
    },

    /**
     * Filters all targets in the container by a provided selector string, or the values `'all'`
     * or `'none'`. Only targets matching the selector will be shown.
     *
     * @example
     *
     * .filter(selector [, animate] [, callback])
     *
     * @example <caption>Example 1: Filtering targets by a class selector</caption>
     *
     * mixer.filter('.category-a')
     *     .then(function(state) {
     *         console.log(state.totalShow === containerEl.querySelectorAll('.category-a').length); // true
     *     });
     *
     * @example <caption>Example 2: Filtering targets by an attribute selector</caption>
     *
     * mixer.filter('[data-category~="a"]')
     *     .then(function(state) {
     *         console.log(state.totalShow === containerEl.querySelectorAll('[data-category~="a"]').length); // true
     *     });
     *
     * @example <caption>Example 3: Filtering targets by a compound selector</caption>
     *
     * // Show only those targets with the classes 'category-a' AND 'category-b'
     *
     * mixer.filter('.category-a.category-c')
     *     .then(function(state) {
     *         console.log(state.totalShow === containerEl.querySelectorAll('.category-a.category-c').length); // true
     *     });
     *
     * @example <caption>Example 4: Filtering via an element collection</caption>
     *
     * var collection = Array.from(container.querySelectorAll('.mix'));
     *
     * console.log(collection.length); // 34
     *
     * // Filter the collection manually using Array.prototype.filter
     *
     * var filtered = collection.filter(function(target) {
     *    return parseInt(target.getAttribute('data-price')) > 10;
     * });
     *
     * console.log(filtered.length); // 22
     *
     * // Pass the filtered collection to MixItUp
     *
     * mixer.filter(filtered)
     *    .then(function(state) {
     *        console.log(state.activeFilter.collection.length === 22); // true
     *    });
     *
     * @public
     * @instance
     * @since       2.0.0
     * @param       {(string|HTMLElement|Array.<HTMLElement>)} selector
     *      Any valid CSS selector (i.e. `'.category-a'`), or the values `'all'` or `'none'`. The filter method also accepts a reference to single target element or a collection of target elements to show.
     * @param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    filter: function() {
        var self        = this,
            instruction = self.parseFilterArgs(arguments);

        return self.multimix({
            filter: instruction.command
        }, instruction.animate, instruction.callback);
    },

    /**
     * Adds an additional selector to the currently active filter selector, concatenating
     * as per the logic defined in `controls.toggleLogic`.
     *
     * @example
     *
     * .toggleOn(selector [, animate] [, callback])
     *
     * @example <caption>Example: Toggling on a filter selector</caption>
     *
     * console.log(mixer.getState().activeFilter.selector); // '.category-a'
     *
     * mixer.toggleOn('.category-b')
     *     .then(function(state) {
     *         console.log(state.activeFilter.selector); // '.category-a, .category-b'
     *     });
     *
     * @public
     * @instance
     * @since       3.0.0
     * @param       {string}    selector
     *      Any valid CSS selector (i.e. `'.category-a'`)
     * @param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    toggleOn: function() {
        var self            = this,
            instruction     = self.parseFilterArgs(arguments),
            selector        = instruction.command.selector,
            toggleSelector  = '';

        self.isToggling = true;

        if (self.toggleArray.indexOf(selector) < 0) {
            self.toggleArray.push(selector);
        }

        toggleSelector = self.getToggleSelector();

        return self.multimix({
            filter: toggleSelector
        }, instruction.animate, instruction.callback);
    },

    /**
     * Removes a selector from the active filter selector.
     *
     * @example
     *
     * .toggleOff(selector [, animate] [, callback])
     *
     * @example <caption>Example: Toggling off a filter selector</caption>
     *
     * console.log(mixer.getState().activeFilter.selector); // '.category-a, .category-b'
     *
     * mixer.toggleOff('.category-b')
     *     .then(function(state) {
     *         console.log(state.activeFilter.selector); // '.category-a'
     *     });
     *
     * @public
     * @instance
     * @since       3.0.0
     * @param       {string}    selector
     *      Any valid CSS selector (i.e. `'.category-a'`)
     * @param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    toggleOff: function() {
        var self            = this,
            instruction     = self.parseFilterArgs(arguments),
            selector        = instruction.command.selector,
            selectorIndex   = self.toggleArray.indexOf(selector),
            toggleSelector  = '';

        self.isToggling = true;

        if (selectorIndex > -1) {
            self.toggleArray.splice(selectorIndex, 1);
        }

        toggleSelector = self.getToggleSelector();

        return self.multimix({
            filter: toggleSelector
        }, instruction.animate, instruction.callback);
    },

    /**
     * Sorts all targets in the container according to a provided sort string.
     *
     * @example
     *
     * .sort(sortString [, animate] [, callback])
     *
     * @example <caption>Example 1: Sorting by the default DOM order</caption>
     *
     * // Reverse the default order of the targets
     *
     * mixer.sort('default:desc')
     *     .then(function(state) {
     *         console.log(state.activeSort.attribute === 'default'); // true
     *         console.log(state.activeSort.order === 'desc'); // true
     *     });
     *
     * @example <caption>Example 2: Sorting by a custom data-attribute</caption>
     *
     * // Sort the targets by the value of a `data-published-date` attribute
     *
     * mixer.sort('published-date:asc')
     *     .then(function(state) {
     *         console.log(state.activeSort.attribute === 'published-date'); // true
     *         console.log(state.activeSort.order === 'asc'); // true
     *     });
     *
     * @example <caption>Example 3: Sorting by multiple attributes</caption>
     *
     * // Sort the targets by the value of a `data-published-date` attribute, then by `data-title`
     *
     * mixer.sort('published-date:desc data-title:asc')
     *     .then(function(state) {
     *         console.log(state.activeSort.attribute === 'published-date'); // true
     *         console.log(state.activeSort.order === 'desc'); // true
     *
     *         console.log(state.activeSort.next.attribute === 'title'); // true
     *         console.log(state.activeSort.next.order === 'asc'); // true
     *     });
     *
     * @example <caption>Example 4: Sorting by random</caption>
     *
     * mixer.sort('random')
     *     .then(function(state) {
     *         console.log(state.activeSort.order === 'random') // true
     *     });
     *
     * @example <caption>Example 5: Sorting via an element collection</caption>
     *
     * var collection = Array.from(container.querySelectorAll('.mix'));
     *
     * // Swap the position of two elements in the collection:
     *
     * var temp = collection[1];
     *
     * collection[1] = collection[0];
     * collection[0] = temp;
     *
     * // Pass the sorted collection to MixItUp
     *
     * mixer.sort(collection)
     *     .then(function(state) {
     *         console.log(state.targets[0] === collection[0]); // true
     *     });
     *
     * @public
     * @instance
     * @since       2.0.0
     * @param       {(string|Array.<HTMLElement>)}    sortString
     *      A valid sort string (e.g. `'default'`, `'published-date:asc'`, or `'random'`). The sort method also accepts an array of all target elements in a user-defined order.
     * @param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    sort: function() {
        var self        = this,
            instruction = self.parseSortArgs(arguments);

        return self.multimix({
            sort: instruction.command
        }, instruction.animate, instruction.callback);
    },

    /**
     * Changes the layout of the container by adding, removing or updating a
     * layout-specific class name. If `animation.animateResizetargets` is
     * enabled, MixItUp will attempt to gracefully animate the width, height,
     * and position of targets between layout states.
     *
     * @example
     *
     * .changeLayout(containerClassName [, animate] [, callback])
     *
     * @example <caption>Example 1: Adding a new class name to the container</caption>
     *
     * mixer.changeLayout('container-list')
     *      .then(function(state) {
     *          console.log(state.activeContainerClass === 'container-list'); // true
     *      });
     *
     * @example <caption>Example 2: Removing a previously added class name from the container</caption>
     *
     * mixer.changeLayout('')
     *      .then(function(state) {
     *          console.log(state.activeContainerClass === ''); // true
     *      });
     *
     * @public
     * @instance
     * @since       2.0.0
     * @param       {string}    containerClassName
     *      A layout-specific class name to add to the container.
     * @param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    changeLayout: function() {
        var self        = this,
            instruction = self.parseChangeLayoutArgs(arguments);

        return self.multimix({
            changeLayout: instruction.command
        }, instruction.animate, instruction.callback);
    },

    /**
     * Updates the contents and order of the container to reflect the provided dataset,
     * if the dataset API is in use.
     *
     * The dataset API is designed for use in API-driven JavaScript applications, and
     * can be used instead of DOM-based methods such as `.filter()`, `.sort()`,
     * `.insert()`, etc. When used, insertion, removal, sorting and pagination can be
     * achieved purely via changes to your data model, without the uglyness of having
     * to interact with or query the DOM directly.
     *
     * @example
     *
     * .dataset(dataset [, animate] [, callback])
     *
     * @example <caption>Example 1: Rendering a dataset</caption>
     *
     * var myDataset = [
     *     {id: 1, ...},
     *     {id: 2, ...},
     *     {id: 3, ...}
     * ];
     *
     * mixer.dataset(myDataset)
     *     .then(function(state) {
     *         console.log(state.totalShow === 3); // true
     *     });
     *
     * @example <caption>Example 2: Sorting a dataset</caption>
     *
     * // Create a new dataset in reverse order
     *
     * var newDataset = myDataset.slice().reverse();
     *
     * mixer.dataset(newDataset)
     *     .then(function(state) {
     *         console.log(state.activeDataset[0] === myDataset[2]); // true
     *     });
     *
     * @example <caption>Example 3: Removing an item from the dataset</caption>
     *
     * console.log(myDataset.length); // 3
     *
     * // Create a new dataset with the last item removed.
     *
     * var newDataset = myDataset.slice().pop();
     *
     * mixer.dataset(newDataset)
     *     .then(function(state) {
     *         console.log(state.totalShow === 2); // true
     *     });
     *
     * @public
     * @instance
     * @since       3.0.0
     * @param       {Array.<object>}    dataset
     *      An array of objects, each one representing the underlying data model of a target to be rendered.
     * @param       {boolean}           [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}          [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    dataset: function() {
        var self        = this,
            instruction = self.parseDatasetArgs(arguments),
            operation   = null,
            queueItem   = null,
            animate     = false;

        self.callActions('beforeDataset', arguments);

        if (!self.isBusy) {
            if (instruction.callback) self.userCallback = instruction.callback;

            animate = (instruction.animate ^ self.config.animation.enable) ? instruction.animate : self.config.animation.enable;

            operation = self.getDataOperation(instruction.command.dataset);

            return self.goMix(animate, operation);
        } else {
            queueItem = new mixitup.QueueItem();

            queueItem.args          = arguments;
            queueItem.instruction   = instruction;

            return self.queueMix(queueItem);
        }
    },

    /**
     * Performs simultaneous `filter`, `sort`, `insert`, `remove` and `changeLayout`
     * operations as requested.
     *
     * @example
     *
     * .multimix(multimixCommand [, animate] [, callback])
     *
     * @example <caption>Example 1: Performing simultaneous filtering and sorting</caption>
     *
     * mixer.multimix({
     *     filter: '.category-b',
     *     sort: 'published-date:desc'
     * })
     *     .then(function(state) {
     *         console.log(state.activeFilter.selector === '.category-b'); // true
     *         console.log(state.activeSort.attribute === 'published-date'); // true
     *     });
     *
     * @example <caption>Example 2: Performing simultaneous sorting, insertion, and removal</caption>
     *
     * console.log(mixer.getState().totalShow); // 6
     *
     * // NB: When inserting via `multimix()`, an object should be provided as the value
     * // for the `insert` portion of the command, allowing for a collection of elements
     * // and an insertion index to be specified.
     *
     * mixer.multimix({
     *     sort: 'published-date:desc', // Sort the container, including any new elements
     *     insert: {
     *         collection: [newElementReferenceA, newElementReferenceB], // Add 2 new elements at index 5
     *         index: 5
     *     },
     *     remove: existingElementReference // Remove 1 existing element
     * })
     *     .then(function(state) {
     *         console.log(state.activeSort.attribute === 'published-date'); // true
     *         console.log(state.totalShow === 7); // true
     *     });
     *
     * @public
     * @instance
     * @since       2.0.0
     * @param       {object}    multimixCommand
     *      An object containing one or more things to do
     * @param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    multimix: function() {
        var self        = this,
            operation   = null,
            animate     = false,
            queueItem   = null,
            instruction = self.parseMultimixArgs(arguments);

        self.callActions('beforeMultimix', arguments);

        if (!self.isBusy) {
            operation = self.getOperation(instruction.command);

            if (self.config.controls.enable) {
                // Update controls for API calls

                if (instruction.command.filter && !self.isToggling) {
                    // As we are not toggling, reset the toggle array
                    // so new filter overrides existing toggles

                    self.toggleArray.length = 0;
                    self.buildToggleArray(operation.command);
                }

                if (self.queue.length < 1) {
                    self.updateControls(operation.command);
                }
            }

            if (instruction.callback) self.userCallback = instruction.callback;

            // Always allow the instruction to override the instance setting

            animate = (instruction.animate ^ self.config.animation.enable) ?
                instruction.animate :
                self.config.animation.enable;

            self.callFilters('operationMultimix', operation, arguments);

            return self.goMix(animate, operation);
        } else {
            queueItem = new mixitup.QueueItem();

            queueItem.args           = arguments;
            queueItem.instruction    = instruction;
            queueItem.triggerElement = self.lastClicked;
            queueItem.isToggling     = self.isToggling;

            return self.queueMix(queueItem);
        }
    },

    /**
     * @private
     * @instance
     * @since   3.0.0
     * @param   {object}            multimixCommand
     * @param   {boolean}           [isPreFetch]
     *      An optional boolean indicating that the operation is being pre-fetched for execution at a later time.
     * @return  {Operation|null}
     */

    getOperation: function(multimixCommand) {
        var self                = this,
            sortCommand         = multimixCommand.sort,
            filterCommand       = multimixCommand.filter,
            changeLayoutCommand = multimixCommand.changeLayout,
            removeCommand       = multimixCommand.remove,
            insertCommand       = multimixCommand.insert,
            operation           = new mixitup.Operation();

        operation = self.callFilters('operationUnmappedGetOperation', operation, arguments);

        operation.id                = h.randomHex();
        operation.command           = multimixCommand;
        operation.startState        = self.state;
        operation.triggerElement    = self.lastClicked;

        if (self.isBusy) {
            if (self.config.debug.showWarnings) {
                console.warn(mixitup.messages.warningGetOperationInstanceBusy());
            }

            return null;
        }

        if (insertCommand) {
            self.insertTargets(insertCommand, operation);
        }

        if (removeCommand) {
            operation.toRemove = removeCommand.targets;
        }

        operation.startSort = operation.newSort = operation.startState.activeSort;
        operation.startOrder = operation.newOrder = self.targets;

        if (sortCommand) {
            operation.startSort = operation.startState.activeSort;
            operation.newSort   = sortCommand;

            operation.willSort = self.willSort(sortCommand, operation.startState.activeSort);

            if (operation.willSort) {
                self.sortOperation(operation);
            }
        }

        operation.startFilter = operation.startState.activeFilter;

        if (filterCommand) {
            operation.newFilter = filterCommand;
        } else {
            operation.newFilter = h.extend(new mixitup.CommandFilter(), operation.startFilter);
        }

        if (operation.newFilter.selector === 'all') {
            operation.newFilter.selector = self.config.selectors.target;
        } else if (operation.newFilter.selector === 'none') {
            operation.newFilter.selector = '';
        }

        self.filterOperation(operation);

        operation.startContainerClassName = operation.startState.activeContainerClassName;

        if (changeLayoutCommand) {
            operation.newContainerClassName = changeLayoutCommand.containerClassName;

            if (operation.newContainerClassName !== operation.startContainerClassName) {
                operation.willChangeLayout = true;
            }
        } else {
            operation.newContainerClassName = operation.startContainerClassName;
        }

        if (self.config.animation.enable) {
            // Populate the operation's position data

            self.getStartMixData(operation);
            self.setInter(operation);

            operation.docState = h.getDocumentState(self.dom.document);

            self.getInterMixData(operation);
            self.setFinal(operation);
            self.getFinalMixData(operation);

            self.parseEffects();

            operation.hasEffect = self.hasEffect();

            self.getTweenData(operation);
        }

        if (operation.willSort) {
            self.targets = operation.newOrder;
        }

        operation.newState = self.buildState(operation);

        return self.callFilters('operationMappedGetOperation', operation, arguments);
    },

    /**
     * Renders a previously created operation at a specific point in its path, as
     * determined by a multiplier between 0 and 1.
     *
     * @example
     * .tween(operation, multiplier)
     *
     * @private
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
        var target          = null,
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
     * Inserts one or more new target elements into the container at a specified
     * index.
     *
     * To be indexed as targets, new elements must match the `selectors.target`
     * selector (`'.mix'` by default).
     *
     * @example
     *
     * .insert(newElements [, index] [, animate], [, callback])
     *
     * @example <caption>Example 1: Inserting a single element via reference</caption>
     *
     * console.log(mixer.getState().totalShow); // 0
     *
     * // Create a new element
     *
     * var newElement = document.createElement('div');
     * newElement.classList.add('mix');
     *
     * mixer.insert(newElement)
     *     .then(function(state) {
     *         console.log(state.totalShow === 1); // true
     *     });
     *
     * @example <caption>Example 2: Inserting a single element via HTML string</caption>
     *
     * console.log(mixer.getState().totalShow); // 1
     *
     * // Create a new element via reference
     *
     * var newElementHtml = '&lt;div class="mix"&gt;&lt;/div&gt;';
     *
     * // Create and insert the new element at index 1
     *
     * mixer.insert(newElementHtml, 1)
     *     .then(function(state) {
     *         console.log(state.totalShow === 2); // true
     *         console.log(state.show[1].outerHTML === newElementHtml); // true
     *     });
     *
     * @example <caption>Example 3: Inserting multiple elements via reference</caption>
     *
     * console.log(mixer.getState().totalShow); // 2
     *
     * // Create an array of new elements to insert.
     *
     * var newElement1 = document.createElement('div');
     * var newElement2 = document.createElement('div');
     *
     * newElement1.classList.add('mix');
     * newElement2.classList.add('mix');
     *
     * var newElementsCollection = [newElement1, newElement2];
     *
     * // Insert the new elements starting at index 1
     *
     * mixer.insert(newElementsCollection, 1)
     *     .then(function(state) {
     *         console.log(state.totalShow === 4); // true
     *         console.log(state.show[1] === newElement1); // true
     *         console.log(state.show[2] === newElement2); // true
     *     });
     *
     * @example <caption>Example 4: Inserting a jQuery collection object containing one or more elements</caption>
     *
     * console.log(mixer.getState().totalShow); // 4
     *
     * var $newElement = $('&lt;div class="mix"&gt;&lt;/div&gt;');
     *
     * // Insert the new elements starting at index 3
     *
     * mixer.insert($newElement, 3)
     *     .then(function(state) {
     *         console.log(state.totalShow === 5); // true
     *         console.log(state.show[3] === $newElement[0]); // true
     *     });
     *
     * @public
     * @instance
     * @since       2.0.0
     * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
     *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
     * @param       {number}    index=0
     *      The index at which to insert the new element(s). `0` by default.
     * @param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    insert: function() {
        var self = this,
            args = self.parseInsertArgs(arguments);

        return self.multimix({
            insert: args.command
        }, args.animate, args.callback);
    },

    /**
     * Inserts one or more new elements before a provided reference element.
     *
     * @example
     *
     * .insertBefore(newElements, referenceElement [, animate] [, callback])
     *
     * @example <caption>Example: Inserting a new element before a reference element</caption>
     *
     * // An existing reference element is chosen at index 2
     *
     * var referenceElement = mixer.getState().show[2];
     *
     * // Create a new element
     *
     * var newElement = document.createElement('div');
     * newElement.classList.add('mix');
     *
     * mixer.insertBefore(newElement, referenceElement)
     *     .then(function(state) {
     *         // The new element is inserted into the container at index 2, before the reference element
     *
     *         console.log(state.show[2] === newElement); // true
     *
     *         // The reference element is now at index 3
     *
     *         console.log(state.show[3] === referenceElement); // true
     *     });
     *
     * @public
     * @instance
     * @since       3.0.0
     * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
     *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
     * @param       {HTMLElement}    referenceElement
     *      A reference to an existing element in the container to insert new elements before.
     *@param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    insertBefore: function() {
        var self = this,
            args = self.parseInsertArgs(arguments);

        return self.insert(args.command.collection, 'before', args.command.sibling, args.animate, args.callback);
    },

    /**
     * Inserts one or more new elements after a provided reference element.
     *
     * @example
     *
     * .insertAfter(newElements, referenceElement [, animate] [, callback])
     *
     * @example <caption>Example: Inserting a new element after a reference element</caption>
     *
     * // An existing reference element is chosen at index 2
     *
     * var referenceElement = mixer.getState().show[2];
     *
     * // Create a new element
     *
     * var newElement = document.createElement('div');
     * newElement.classList.add('mix');
     *
     * mixer.insertAfter(newElement, referenceElement)
     *     .then(function(state) {
     *         // The new element is inserted into the container at index 3, after the reference element
     *
     *         console.log(state.show[3] === newElement); // true
     *     });
     *
     * @public
     * @instance
     * @since       3.0.0
     * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
     *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
     * @param       {HTMLElement}    referenceElement
     *      A reference to an existing element in the container to insert new elements after.
     * @param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    insertAfter: function() {
        var self = this,
            args = self.parseInsertArgs(arguments);

        return self.insert(args.command.collection, 'after', args.command.sibling, args.animate, args.callback);
    },

    /**
     * Inserts one or more new elements into the container before all existing targets.
     *
     * @example
     *
     * .prepend(newElements [,animate] [,callback])
     *
     * @example <caption>Example: Prepending a new element</caption>
     *
     * // Create a new element
     *
     * var newElement = document.createElement('div');
     * newElement.classList.add('mix');
     *
     * // Insert the element into the container
     *
     * mixer.prepend(newElement)
     *     .then(function(state) {
     *         console.log(state.show[0] === newElement); // true
     *     });
     *
     * @public
     * @instance
     * @since       3.0.0
     * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
     *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
     * @param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    prepend: function() {
        var self = this,
            args = self.parseInsertArgs(arguments);

        return self.insert(0, args.command.collection, args.animate, args.callback);
    },

    /**
     * Inserts one or more new elements into the container after all existing targets.
     *
     * @example
     *
     * .append(newElements [,animate] [,callback])
     *
     * @example <caption>Example: Appending a new element</caption>
     *
     * // Create a new element
     *
     * var newElement = document.createElement('div');
     * newElement.classList.add('mix');
     *
     * // Insert the element into the container
     *
     * mixer.append(newElement)
     *     .then(function(state) {
     *         console.log(state.show[state.show.length - 1] === newElement); // true
     *     });
     *
     * @public
     * @instance
     * @since       3.0.0
     * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
     *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
     * @param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    append: function() {
        var self = this,
            args = self.parseInsertArgs(arguments);

        return self.insert(self.state.totalTargets, args.command.collection, args.animate, args.callback);
    },

    /**
     * Removes one or more existing target elements from the container.
     *
     * @example
     *
     * .remove(elements [, animate] [, callback])
     *
     * @example <caption>Example 1: Removing an element by reference</caption>
     *
     * var elementToRemove = containerEl.firstElementChild;
     *
     * mixer.remove(elementToRemove)
     *      .then(function(state) {
     *          console.log(state.targets.indexOf(elementToRemove) === -1); // true
     *      });
     *
     * @example <caption>Example 2: Removing a collection of elements by reference</caption>
     *
     * var elementsToRemove = containerEl.querySelectorAll('.category-a');
     *
     * console.log(elementsToRemove.length) // 3
     *
     * mixer.remove(elementsToRemove)
     *      .then(function() {
     *          console.log(containerEl.querySelectorAll('.category-a').length); // 0
     *      });
     *
     * @example <caption>Example 3: Removing one or more elements by selector</caption>
     *
     * mixer.remove('.category-a')
     *      .then(function() {
     *          console.log(containerEl.querySelectorAll('.category-a').length); // 0
     *      });
     *
     * @example <caption>Example 4: Removing an element by index</caption>
     *
     * console.log(mixer.getState.totalShow); // 4
     *
     * // Remove the element at index 3
     *
     * mixer.remove(3)
     *      .then(function(state) {
     *          console.log(state.totalShow); // 3
     *          console.log(state.show[3]); // undefined
     *      });
     *
     *
     * @public
     * @instance
     * @since       3.0.0
     * @param       {(HTMLElement|Array.<HTMLElement>|string|number)}    elements
     *      A reference to a single element to remove, an array-like collection of elements, a selector string, or the index of an element to remove.
     * @param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *      A promise resolving with the current state object.
     */

    remove: function() {
        var self = this,
            args = self.parseRemoveArgs(arguments);

        return self.multimix({
            remove: args.command
        }, args.animate, args.callback);
    },

    /**
     * Retrieves the the value of any property or sub-object within the current
     * mixitup configuration, or the whole configuration object.
     *
     * @example
     *
     * .getConfig([stringKey])
     *
     * @example <caption>Example 1: retrieve the entire configuration object</caption>
     *
     * var config = mixer.getConfig(); // Config { ... }
     *
     * @example <caption>Example 2: retrieve a named sub-object of configuration object</caption>
     *
     * var animation = mixer.getConfig('animation'); // ConfigAnimation { ... }
     *
     * @example <caption>Example 3: retrieve a value of configuration object via a dot-notation string key</caption>
     *
     * var effects = mixer.getConfig('animation.effects'); // 'fade scale'
     *
     * @public
     * @instance
     * @since       2.0.0
     * @param       {string}    [stringKey]    A "dot-notation" string key
     * @return      {*}
     */

    getConfig: function(stringKey) {
        var self    = this,
            value   = null;

        if (!stringKey) {
            value = self.config;
        } else {
            value = h.getProperty(self.config, stringKey);
        }

        return self.callFilters('valueGetConfig', value, arguments);
    },

    /**
     * Updates the configuration of the mixer, after it has been instantiated.
     *
     * See the Configuration Object documentation for a full list of avilable
     * configuration options.
     *
     * @example
     *
     * .configure(config)
     *
     * @example <caption>Example 1: Updating animation options</caption>
     *
     * mixer.configure({
     *     animation: {
     *         effects: 'fade translateX(-100%)',
     *         duration: 300
     *     }
     * });
     *
     * @example <caption>Example 2: Removing a callback after it has been set</caption>
     *
     * var mixer;
     *
     * function handleMixEndOnce() {
     *     // Do something ..
     *
     *     // Then nullify the callback
     *
     *     mixer.configure({
     *         callbacks: {
     *             onMixEnd: null
     *         }
     *     });
     * };
     *
     * // Instantiate a mixer with a callback defined
     *
     * mixer = mixitup(containerEl, {
     *     callbacks: {
     *         onMixEnd: handleMixEndOnce
     *     }
     * });
     *
     * @public
     * @instance
     * @since       3.0.0
     * @param       {object}    config
     *      An object containing one of more configuration options.
     * @return      {void}
     */

    configure: function(config) {
        var self = this;

        self.callActions('beforeConfigure', arguments);

        h.extend(self.config, config, true, true);

        self.callActions('afterConfigure', arguments);
    },

    /**
     * Returns an object containing information about the current state of the
     * mixer. See the State Object documentation for more information.
     *
     * NB: State objects are immutable and should therefore be regenerated
     * after any operation.
     *
     * @example
     *
     * .getState();
     *
     * @example <caption>Example: Retrieving a state object</caption>
     *
     * var state = mixer.getState();
     *
     * console.log(state.totalShow + 'targets are currently shown');
     *
     * @public
     * @instance
     * @since       2.0.0
     * @return      {mixitup.State} An object reflecting the current state of the mixer.
     */

    getState: function() {
        var self    = this,
            state   = null;

        state = new mixitup.State();

        h.extend(state, self.state);

        h.freeze(state);

        return self.callFilters('stateGetState', state, arguments);
    },

    /**
     * Forces the re-indexing all targets within the container.
     *
     * This should only be used if some other piece of code in your application
     * has manipulated the contents of your container, which should be avoided.
     *
     * If you need to add or remove target elements from the container, use
     * the built-in `.insert()` or `.remove()` methods, and MixItUp will keep
     * itself up to date.
     *
     * @example
     *
     * .forceRefresh()
     *
     * @example <caption>Example: Force refreshing the mixer after external DOM manipulation</caption>
     *
     * console.log(mixer.getState().totalShow); // 3
     *
     * // An element is removed from the container via some external DOM manipulation code:
     *
     * containerEl.removeChild(containerEl.firstElementChild);
     *
     * // The mixer does not know that the number of targets has changed:
     *
     * console.log(mixer.getState().totalShow); // 3
     *
     * mixer.forceRefresh();
     *
     * // After forceRefresh, the mixer is in sync again:
     *
     * console.log(mixer.getState().totalShow); // 2
     *
     * @public
     * @instance
     * @since 2.1.2
     * @return {void}
     */

    forceRefresh: function() {
        var self = this;

        self.indexTargets();
    },

    /**
     * Forces the re-rendering of all targets when using the Dataset API.
     *
     * By default, targets are only re-rendered when `data.dirtyCheck` is
     * enabled, and an item's data has changed when `dataset()` is called.
     *
     * The `forceRender()` method allows for the re-rendering of all targets
     * in response to some arbitrary event, such as the changing of the target
     * render function.
     *
     * Targets are rendered against their existing data.
     *
     * @example
     *
     * .forceRender()
     *
     * @example <caption>Example: Force render targets after changing the target render function</caption>
     *
     * console.log(container.innerHTML); // ... &lt;span class="mix"&gt;Foo&lt;/span&gt; ...
     *
     * mixer.configure({
     *     render: {
     *         target: (item) => `&lt;a href="/${item.slug}/" class="mix"&gt;${item.title}&lt;/a&gt;`
     *     }
     * });
     *
     * mixer.forceRender();
     *
     * console.log(container.innerHTML); // ... &lt;a href="/foo/" class="mix"&gt;Foo&lt;/a&gt; ...
     *
     * @public
     * @instance
     * @since 3.2.1
     * @return {void}
     */

    forceRender: function() {
        var self    = this,
            target  = null,
            el      = null,
            id      = '';

        for (id in self.cache) {
            target = self.cache[id];

            el = target.render(target.data);

            if (el !== target.dom.el) {
                // Update target element reference

                if (target.isInDom) {
                    target.unbindEvents();

                    self.dom.parent.replaceChild(el, target.dom.el);
                }

                if (!target.isShown) {
                    el.style.display = 'none';
                }

                target.dom.el = el;

                if (target.isInDom) {
                    target.bindEvents();
                }
            }
        }

        self.state = self.buildState(self.lastOperation);
    },

    /**
     * Removes mixitup functionality from the container, unbinds all control
     * event handlers, and deletes the mixer instance from MixItUp's internal
     * cache.
     *
     * This should be performed whenever a mixer's container is removed from
     * the DOM, such as during a page change in a single page application,
     * or React's `componentWillUnmount()`.
     *
     * @example
     *
     * .destroy([cleanUp])
     *
     * @example <caption>Example: Destroying the mixer before removing its container element</caption>
     *
     * mixer.destroy();
     *
     * containerEl.parentElement.removeChild(containerEl);
     *
     * @public
     * @instance
     * @since   2.0.0
     * @param   {boolean}   [cleanUp=false]
     *     An optional boolean dictating whether or not to clean up any inline `display: none;` styling applied to hidden targets.
     * @return  {void}
     */

    destroy: function(cleanUp) {
        var self    = this,
            control = null,
            target  = null,
            i       = 0;

        self.callActions('beforeDestroy', arguments);

        for (i = 0; control = self.controls[i]; i++) {
            control.removeBinding(self);
        }

        for (i = 0; target = self.targets[i]; i++) {
            if (cleanUp) {
                target.show();
            }

            target.unbindEvents();
        }

        if (self.dom.container.id.match(/^MixItUp/)) {
            self.dom.container.removeAttribute('id');
        }

        delete mixitup.instances[self.id];

        self.callActions('afterDestroy', arguments);
    }
});
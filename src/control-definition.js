/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 * @param       {string}    method
 * @param       {string}    selector
 * @param       {boolean}   [live]
 */

mixitup.ControlDefinition = function(method, selector, live) {
    this.method             = method;
    this.selector           = selector;
    this.live               = live || false;

    h.freeze(this);
    h.seal(this);
};

mixitup.controlDefinitions = [];

mixitup.controlDefinitions.push(new mixitup.ControlDefinition('multiMix', '[data-filter][data-sort]'));
mixitup.controlDefinitions.push(new mixitup.ControlDefinition('filter', '[data-filter]'));
mixitup.controlDefinitions.push(new mixitup.ControlDefinition('sort', '[data-sort]'));
mixitup.controlDefinitions.push(new mixitup.ControlDefinition('toggle', '[data-toggle]'));
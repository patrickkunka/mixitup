/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       2.0.0
 */

mixitup.Control = function() {
    mixitup.Base.call(this);

    this.execAction('construct', 0);

    this.el         = null;
    this.selector   = '';
    this.bound      = [];
    this.type       = '';
    this.status     = '';
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
     * @param {string}      [selector]
     */

    init: function(el, selector) {
        var self = this;

        self.el         = el;
        self.selector   = selector;

        self.bindClick(el, selector);
    },

    /**
     * @private
     * @param  {mixitup.Mixer} mixer
     * @return {boolean}
     */

    isBound: function(mixer) {
        var self = this;

        return self.bound.indexOf(mixer) > -1;
    },

    /**
     * @private
     * @param  {mixitup.Mixer} mixer
     * @return {void}
     */

    addBound: function(mixer) {
        var self = this;

        if (!self.isBound()) {
            self.bound.push(mixer);
        }
    },

    /**
     * @private
     * @param  {mixitup.Mixer} mixer
     * @return {void}
     */

    removeBound: function(mixer) {
        var self        = this,
            removeIndex = -1;

        if ((removeIndex = self.bound.indexOf(mixer)) > -1) {
            self.bound.splice(removeIndex, 1);
        }
    },

    /**
     * @private
     * @param {HTMLElement} el
     * @param {string}      [selector]
     */

    bindClick: function(el) {
        var self = this;

        self.handler = function(e) {
            self.handleClick(e);
        };

        h.on(el, 'click', self.handler);
    },

    unbindClick: function() {
        var self = this;

        h.off(self.el, 'click', self.handler);

        self.handler = null;
    },

    handleClick: function(e) {
        var self    = this,
            button  = null;

        if (!self.selector) {
            button = self.el;
        } else {
            button = h.closestParent(e.target, self.selector, true);
        }

        console.log('button was clicked', button);
    }
});

mixitup.controls = [];
/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigAnimation = function() {
    this._execAction('constructor', 0);

    this.enable                 = true;
    this.effects                = 'fade scale';
    this.effectsIn              = '';
    this.effectsOut             = '';
    this.duration               = 600;
    this.easing                 = 'ease';
    this.perspectiveDistance    = '3000';
    this.perspectiveOrigin      = '50% 50%';
    this.queue                  = true;
    this.queueLimit             = 3;
    this.animateChangeLayout    = false;
    this.animateResizeContainer = true;
    this.animateResizeTargets   = false;
    this.staggerSequence        = null;
    this.reverseOut             = false;
    this.nudgeOut               = true;

    this._execAction('constructor', 1);

    h.seal(this);
};

mixitup.ConfigAnimation.prototype = new mixitup.BasePrototype();
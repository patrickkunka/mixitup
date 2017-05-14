/* global mixitup, h */

/**
 * `mixitup.Operation` objects contain all data neccessary to describe the full
 * lifecycle of any MixItUp operation. They can be used to compute and store an
 * operation for use at a later time (e.g. programmatic tweening).
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.Operation = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.id                      = '';

    this.args                    = [];
    this.command                 = null;
    this.showPosData             = [];
    this.toHidePosData           = [];

    this.startState              = null;
    this.newState                = null;
    this.docState                = null;

    this.willSort                = false;
    this.willChangeLayout        = false;
    this.hasEffect               = false;
    this.hasFailed               = false;

    this.triggerElement          = null;

    this.show                    = [];
    this.hide                    = [];
    this.matching                = [];
    this.toShow                  = [];
    this.toHide                  = [];
    this.toMove                  = [];
    this.toRemove                = [];
    this.startOrder              = [];
    this.newOrder                = [];
    this.startSort               = null;
    this.newSort                 = null;
    this.startFilter             = null;
    this.newFilter               = null;
    this.startDataset            = null;
    this.newDataset              = null;
    this.viewportDeltaX          = 0;
    this.viewportDeltaY          = 0;
    this.startX                  = 0;
    this.startY                  = 0;
    this.startHeight             = 0;
    this.startWidth              = 0;
    this.newX                    = 0;
    this.newY                    = 0;
    this.newHeight               = 0;
    this.newWidth                = 0;
    this.startContainerClassName = '';
    this.startDisplay            = '';
    this.newContainerClassName   = '';
    this.newDisplay              = '';

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.Operation);

mixitup.Operation.prototype = Object.create(mixitup.Base.prototype);

mixitup.Operation.prototype.constructor = mixitup.Operation;
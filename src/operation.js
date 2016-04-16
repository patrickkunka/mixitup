/* global mixitup, h */

/**
 * `mixitup.Operation` objects contain all data neccessary to describe the full
 * lifecycle of any MixItUp operation. They can be used to compute and store an
 * operation for use at a later time (e.g. programmatic tweening).
 *
 * @constructor
 * @namespace
 * @memberof    mixitup
 * @public
 * @since       3.0.0
 */

mixitup.Operation = function() {
    this.execAction('construct', 0);

    this.id                  = '';

    this.args                = [];
    this.command             = null;
    this.showPosData         = [];
    this.toHidePosData       = [];

    this.startState          = null;
    this.newState            = null;
    this.docState            = null;

    this.willSort            = false;
    this.willChangeLayout    = false;
    this.hasEffect           = false;
    this.hasFailed           = false;

    this.show                = [];
    this.hide                = [];
    this.matching            = [];
    this.toShow              = [];
    this.toHide              = [];
    this.toMove              = [];
    this.toRemove            = [];
    this.startOrder          = [];
    this.newOrder            = [];
    this.newSort             = null;
    this.startSortString     = '';
    this.newSortString       = '';
    this.startFilter         = null;
    this.newFilter           = null;
    this.startX              = 0;
    this.startY              = 0;
    this.startHeight         = 0;
    this.startWidth          = 0;
    this.newX                = 0;
    this.newY                = 0;
    this.newHeight           = 0;
    this.newWidth            = 0;
    this.startContainerClass = '';
    this.startDisplay        = '';
    this.newContainerClass   = '';
    this.newDisplay          = '';

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.Operation.prototype = Object.create(new mixitup.BasePrototype());

mixitup.Operation.prototype.constructor = mixitup.Operation;
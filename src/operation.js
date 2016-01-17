/* global mixitup, h */

/**
 * @since       3.0.0
 * @constructor
 *
 * Operation objects contain all data neccessary to describe
 * the full lifecycle of any individual MixItUp operation
 */

mixitup.Operation = function() {
    this._execAction('_constructor', 0);

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
    this.startHeight         = 0;
    this.startWidth          = 0;
    this.newHeight           = 0;
    this.newWidth            = 0;
    this.startContainerClass = '';
    this.startDisplay        = '';
    this.newContainerClass   = '';
    this.newDisplay          = '';

    this._execAction('_constructor', 1);

    h.seal(this);
};

mixitup.Operation.prototype = Object.create(mixitup.basePrototype);

h.extend(mixitup.Operation.prototype, {
    _actions: {},
    _filters: {}
});
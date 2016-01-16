/* global mixitup */
/* global h */

/**
 * mixitup.State
 * @since       3.0.0
 * @constructor
 *
 * mixitup.State objects form part of the public API and are provided
 * at the start and end of any operation. The most recent state
 * object is stored between operations and can also be retrieved
 * via the API.
 */

mixitup.State = function() {
    this._execAction('_constructor', 0);

    this.activeFilter         = '';
    this.activeSort           = '';
    this.activeDisplay        = '';
    this.activeContainerClass = '';
    this.targets              = [];
    this.hide                 = [];
    this.show                 = [];
    this.matching             = [];
    this.totalTargets         = -1;
    this.totalShow            = -1;
    this.totalHide            = -1;
    this.totalMatching        = -1;
    this.hasFailed            = false;
    this.triggerElement       = null;

    this._execAction('_constructor', 1);

    h.seal(this);
};

/**
 * mixitup.State.prototype
 * @since       3.0.0
 * @prototype
 * @extends     {mixitup.basePrototype}
 */

mixitup.State.prototype = Object.create(mixitup.basePrototype);

h.extend(mixitup.State.prototype, {
    _actions: {},
    _filters: {}
});
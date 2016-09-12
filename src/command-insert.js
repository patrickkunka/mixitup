/* global mixitup, h */

/**
 * An object into which all arbitrary arguments sent to '.insert()' are mapped.
 *
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.CommandInsert = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    this.index      = 0;
    this.collection = [];
    this.position   = 'before'; // enum: ['before', 'after']
    this.sibling    = null;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.CommandInsert);

mixitup.CommandInsert.prototype = Object.create(mixitup.Base.prototype);

mixitup.CommandInsert.prototype.constructor = mixitup.CommandInsert;
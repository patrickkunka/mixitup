/* global mixitup, h */

/**
 * An group of references to any mixitup extensions to be applied to the
 * instance. This is only neccessary when loading mixitup via a module
 * loader such as Browserify or RequireJS, where a reference to the
 * extension cannot be acessed from the global `window` scope.
 *
 * @constructor
 * @memberof    mixitup
 * @memberof    mixitup.Config
 * @name        extensions
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigExtensions = function() {
    this.execAction('construct', 0);

    this.pagination     = null;
    this.dragndrop      = null;
    this.multiFilter    = null;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.ConfigExtensions.prototype = Object.create(new mixitup.BasePrototype());

mixitup.ConfigExtensions.prototype.constructor = mixitup.ConfigExtensions;
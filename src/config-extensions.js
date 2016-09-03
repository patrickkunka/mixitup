/* global mixitup, h */

/**
 * An group of references to any mixitup extensions to be applied to the
 * instance. This is only neccessary when loading mixitup via a module
 * loader such as Browserify or RequireJS, where a reference to the
 * extension cannot be accessed from the global `window` scope.
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
    mixitup.Base.call(this);

    this.execAction('construct', 0);

    this.pagination     = null;
    this.dragndrop      = null;
    this.multiFilter    = null;

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigExtensions);

mixitup.ConfigExtensions.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigExtensions.prototype.constructor = mixitup.ConfigExtensions;
/* global mixitup, h */

/**
 * The `mixitup.Config` class encompasses the full set of user-configurable
 * options for each MixItUp instance, and is organised into to several
 * semantically distinct sub-objects.
 *
 * An optional object literal containing any combination of these properies,
 * known as the "configuration object", can be passed as the second parameter to
 * the `mixitup` factory function to customise the functionality of the MixItUp
 * instance as needed.
 *
 * @constructor
 * @memberof    mixitup
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.Config = function() {
    mixitup.Base.call(this);

    this.execAction('construct', 0);

    this.animation          = new mixitup.ConfigAnimation();
    this.callbacks          = new mixitup.ConfigCallbacks();
    this.controls           = new mixitup.ConfigControls();
    this.debug              = new mixitup.ConfigDebug();
    this.layout             = new mixitup.ConfigLayout();
    this.libraries          = new mixitup.ConfigLibraries();
    this.load               = new mixitup.ConfigLoad();
    this.selectors          = new mixitup.ConfigSelectors();
    this.extensions         = new mixitup.ConfigExtensions();

    this.execAction('construct', 1);

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.Config);

mixitup.Config.prototype = Object.create(mixitup.Base.prototype);

mixitup.Config.prototype.constructor = mixitup.Config;
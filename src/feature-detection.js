mixitup.Has = function() {
    this.transitions    = false;
    this.promises       = false;
};

mixitup.Is = function() {
    this.oldIe          = false;
};

mixitup.Features = function() {
    this.has                        = new mixitup.Has();
    this.is                         = new mixitup.Is();

    this.TRANSITION_PROP            = 'transition';
    this.TRANSFORM_PROP             = 'transform';
    this.PERSPECTIVE_PROP           = 'perspective';
    this.PERSPECTIVE_ORIGIN_PROP    = 'perspectiveOrigin';
    this.VENDORS_TRANSITION         = ['Webkit', 'Moz', 'O', 'ms'];
    this.VENDORS_RAF                = ['Webkit', 'moz'];

    this.transformPrefix            = '';
    this.transitionPrefix           = '';

    this.transformProp              = '';
    this.transformRule              = '';
    this.transitionProp             = '';
    this.perspectiveProp            = '';
    this.perspectiveOriginProp      = '';
};

mixitup.Features.prototype = new mixitup.BasePrototype();

h.extend(mixitup.Features.prototype, {
    init: function() {
        var self    = this,
            canary  = document.createElement('div');

        self.transitionPrefix   = h.getPrefix(canary, 'Transition', self.VENDORS_TRANSITION);
        self.transformPrefix    = h.getPrefix(canary, 'Transformn', self.VENDORS_TRANSITION);

        // TODO: add box-sizing prefix test

        self.has.promises       = typeof Promise === 'function';
        self.has.transitions    = self.transitionPrefix !== 'unsupported';
        self.is.oldIe           = window.atob ? false : true;

        self.transitionProp = self.transitionPrefix ?
            self.transitionPrefix + h.camelCase(self.TRANSITION_PROP, true) : self.TRANSITION_PROP;

        self.transformProp = self.transitionPrefix ?
            self.transformPrefix + h.camelCase(self.TRANSFORM_PROP, true) : self.TRANSFORM_PROP;

        self.transformRule = self.transformPrefix ?
            self.transformPrefix + '-' + self.TRANSFORM_PROP : self.TRANSFORM_PROP;

        self.perspectiveProp = self.transformPrefix ?
            self.transformPrefix + h.camelCase(self.PERSPECTIVE_PROP, true) : self.PERSPECTIVE_PROP;

        self.perspectiveOriginProp = self.transformPrefix ?
            self.transformPrefix + h.camelCase(self.PERSPECTIVE_ORIGIN_PROP, true) :
            self.PERSPECTIVE_ORIGIN_PROP;

        // TODO: add polyfills
    }
});

mixitup.features = new mixitup.Features();

mixitup.features.init();

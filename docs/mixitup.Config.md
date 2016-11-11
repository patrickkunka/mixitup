# mixitup.Config

## Overview

`mixitup.Config` is an interface used for customising the functionality of a
mixer instance. It is organised into several semantically distinct sub-objects,
each one pertaining to a particular aspect of MixItUp functionality.

An object literal containing any or all of the available properies,
known as the "configuration object", can be passed as the second parameter to
the `mixitup` factory function when creating a mixer instance to customise its
functionality as needed.

If no configuration object is passed, the mixer instance will take on the default
configuration values detailed below.


## Members

### <a id="mixitup.Config.animation">animation</a>

*Version added: 2.0.0*



A group of properties defining MixItUp's animation and effects settings.




### <a id="mixitup.Config.callbacks">callbacks</a>

*Version added: 2.0.0*



A group of optional callback functions to be invoked at various
points within the lifecycle of a mixer operation.

Each function is analogous to an event of the same name triggered from the
container element, and is invoked immediately after it.

All callback functions receive the current `state` object as their first
argument, as well as other more specific arguments described below.




### <a id="mixitup.Config.controls">controls</a>

*Version added: 2.0.0*



A group of properties relating to clickable control elements.




### <a id="mixitup.Config.classNames">classNames</a>

*Version added: 3.0.0*



A group of properties defining the output and structure of class names programmatically
added to controls and containers to reflect the state of the mixer.

Most commonly, class names are added to controls by MixItUp to indicate that
the control is active so that it can be styled accordingly - `'mixitup-control-active'` by default.

Using a "BEM" like structure, each classname is broken into the three parts:
a block namespace (`'mixitup'`), an element name (e.g. `'control'`), and an optional modifier
name (e.g. `'active'`) reflecting the state of the element.

By default, each part of the classname is concatenated together using single hyphens as
delineators, but this can be easily customised to match the naming convention and style of
your proejct.




### <a id="mixitup.Config.data">data</a>

*Version added: 3.0.0*



A group of properties relating to MixItUp's dataset API.




### <a id="mixitup.Config.debug">debug</a>

*Version added: 3.0.0*



A group of properties allowing the toggling of various debug features.




### <a id="mixitup.Config.layout">layout</a>

*Version added: 3.0.0*



A group of properties relating to the layout of the container.




### <a id="mixitup.Config.load">load</a>

*Version added: 2.0.0*



A group of properties defining the initial state of the mixer on load (instantiation).




### <a id="mixitup.Config.selectors">selectors</a>

*Version added: 3.0.0*



A group of properties defining the selectors used to query elements within a mixitup container.




### <a id="mixitup.Config.render">render</a>

*Version added: 3.0.0*



A group of optional render functions for creating and updating elements.





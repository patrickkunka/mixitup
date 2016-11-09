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

### <a id="mixitup.Config.animation">mixitup.Config.animation</a>

**Version added: 2.0.0**



A group of properties defining MixItUp's animation and effects settings.




### <a id="mixitup.Config.callbacks">mixitup.Config.callbacks</a>

**Version added: 2.0.0**



A group of optional callback functions to be invoked at various
points within the lifecycle of a mixer operation.

Each function is analogous to an event of the same name triggered from the
container element, and is invoked immediately after it.

All callback functions receive the current `state` object as their first
argument, as well as other more specific arguments described below.




### <a id="mixitup.Config.controls">mixitup.Config.controls</a>

**Version added: 2.0.0**








### <a id="mixitup.Config.classNames">mixitup.Config.classNames</a>

**Version added: 3.0.0**



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




### <a id="mixitup.Config.data">mixitup.Config.data</a>

**Version added: 3.0.0**



A group of properties relating to MixItUp's dataset API.




### <a id="mixitup.Config.debug">mixitup.Config.debug</a>

**Version added: 3.0.0**








### <a id="mixitup.Config.layout">mixitup.Config.layout</a>

**Version added: 3.0.0**








### <a id="mixitup.Config.load">mixitup.Config.load</a>

**Version added: 2.0.0**








### <a id="mixitup.Config.selectors">mixitup.Config.selectors</a>

**Version added: 3.0.0**









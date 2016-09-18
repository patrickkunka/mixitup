# mixitup.Config

## Overview

`mixitup.Config` is an interface implemented by MixItUp as a means of customising
the functionality of an instance. It is organised into several semantically
distinct sub-objects, each one pertaining to a particular aspect of MixItUp functionality.

An object literal containing any or all of the available properies,
known as the "configuration object", can be passed as the second parameter to
the `mixitup` factory function when creating a mixer instance to customise its
functionality as needed.

If no congiguration object is passed, the mixer instance will take on the default
configuration values detailed below.


## Members

### <a id="mixitup.Config.animation">mixitup.Config.animation</a>

**Version added: 2.0.0**



A group of properties defining MixItUp's animation and effects settings.




### <a id="mixitup.Config.callbacks">mixitup.Config.callbacks</a>

**Version added: 2.0.0**








### <a id="mixitup.Config.controls">mixitup.Config.controls</a>

**Version added: 2.0.0**








### <a id="mixitup.Config.classnames">mixitup.Config.classnames</a>

**Version added: 3.0.0**



A group of properties defining the output and structure of classnames programmatically
added to controls and containers to reflect the state of the mixer.

Most commonly, classnames are added to control buttons by MixItUp to indicate that
the control is active so that it can be styled accordingly - `'mixitup-control-active'` by default.

Using a "BEM" like structure, each classname is broken into the three parts:
a block namespace (`'mixitup'`), an element name (e.g. `'control'`), and an optional modifier
name (e.g. `'active'`) reflecting the state of the element.

By default, each part of the classname is concatenated together using single hyphens as
delineators, but this can be easily customised to match the naming convention and style of
your proejct.




### <a id="mixitup.Config.debug">mixitup.Config.debug</a>

**Version added: 3.0.0**








### <a id="mixitup.Config.layout">mixitup.Config.layout</a>

**Version added: 3.0.0**








### <a id="mixitup.Config.load">mixitup.Config.load</a>

**Version added: 2.0.0**








### <a id="mixitup.Config.selectors">mixitup.Config.selectors</a>

**Version added: 3.0.0**









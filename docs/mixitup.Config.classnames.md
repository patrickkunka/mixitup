# mixitup.Config.classnames

## Overview

A group of properties defining the output and structure of classnames programmatically
added to controls and containers to reflect the state of the mixer.

Using a "BEM" like structure, each classname is broken into the three parts by default:
a block namespace ("mixitup"), an element name (e.g. "control"), and an optional modifier
name (e.g. "active") reflecting the state of the element.

By default, each part of the classname is concatenated together using single hyphens as
delineators, but this can be easily customised to match the naming convention and style of
your proejct.


## Members

### <a id="mixitup.Config.classnames#block">mixitup.Config.classnames.block</a>







|Type | Default
|---  | ---
|`string`| `'mixitup'`


### <a id="mixitup.Config.classnames#elementFilter">mixitup.Config.classnames.elementFilter</a>







|Type | Default
|---  | ---
|`string`| `'control'`


### <a id="mixitup.Config.classnames#elementSort">mixitup.Config.classnames.elementSort</a>







|Type | Default
|---  | ---
|`string`| `'control'`


### <a id="mixitup.Config.classnames#elementMultimix">mixitup.Config.classnames.elementMultimix</a>







|Type | Default
|---  | ---
|`string`| `'control'`


### <a id="mixitup.Config.classnames#elementToggle">mixitup.Config.classnames.elementToggle</a>







|Type | Default
|---  | ---
|`string`| `'control'`


### <a id="mixitup.Config.classnames#modifierActive">mixitup.Config.classnames.modifierActive</a>







|Type | Default
|---  | ---
|`string`| `'active'`


### <a id="mixitup.Config.classnames#modifierDisabled">mixitup.Config.classnames.modifierDisabled</a>







|Type | Default
|---  | ---
|`string`| `'disabled'`


### <a id="mixitup.Config.classnames#delineatorElement">mixitup.Config.classnames.delineatorElement</a>







|Type | Default
|---  | ---
|`string`| `'-'`


### <a id="mixitup.Config.classnames#delineatorModifier">mixitup.Config.classnames.delineatorModifier</a>







|Type | Default
|---  | ---
|`string`| `'-'`



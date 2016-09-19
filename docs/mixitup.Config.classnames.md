# mixitup.Config.classnames

## Overview

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


## Members

### <a id="mixitup.Config.classnames#block">mixitup.Config.classnames.block</a>




The "block" portion, or top-level namespace added to the start of any classnames created by MixItUp.


|Type | Default
|---  | ---
|`string`| `'mixitup'`

> Example 1: changing the `config.classnames.block` value

```js
var mixer = mixitup(containerEl, {
    classnames: {
        block: 'portfolio'
    }
});

// example active control output: "portfolio-control-active"
```
> Example 2: Removing `config.classnames.block`

```js
var mixer = mixitup(containerEl, {
    classnames: {
        block: ''
    }
});

// example active control output: "control-active"
```

### <a id="mixitup.Config.classnames#elementFilter">mixitup.Config.classnames.elementFilter</a>




The "element" portion of the classname added to filter controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classnames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

> Example 1: changing the `config.classnames.elementFilter` value

```js
var mixer = mixitup(containerEl, {
    classnames: {
        elementFilter: 'filter'
    }
});

// example active filter output: "mixitup-filter-active"
```
> Example 2: changing the `config.classnames.block` and `config.classnames.elementFilter` values

```js
var mixer = mixitup(containerEl, {
    classnames: {
        block: 'portfolio',
        elementFilter: 'filter'
    }
});

// example active filter output: "portfolio-filter-active"
```

### <a id="mixitup.Config.classnames#elementSort">mixitup.Config.classnames.elementSort</a>




The "element" portion of the classname added to sort controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classnames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

> Example 1: changing the `config.classnames.elementSort` value

```js
var mixer = mixitup(containerEl, {
    classnames: {
        elementSort: 'sort'
    }
});

// example active sort output: "mixitup-sort-active"
```
> Example 2: changing the `config.classnames.block` and `config.classnames.elementSort` values

```js
var mixer = mixitup(containerEl, {
    classnames: {
        block: 'portfolio',
        elementSort: 'sort'
    }
});

// example active sort output: "portfolio-sort-active"
```

### <a id="mixitup.Config.classnames#elementMultimix">mixitup.Config.classnames.elementMultimix</a>




The "element" portion of the classname added to multimix controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classnames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

> Example 1: changing the `config.classnames.elementMultimix` value

```js
var mixer = mixitup(containerEl, {
    classnames: {
        elementMultimix: 'multimix'
    }
});

// example active multimix output: "mixitup-multimix-active"
```
> Example 2: changing the `config.classnames.block` and `config.classnames.elementMultimix` values

```js
var mixer = mixitup(containerEl, {
    classnames: {
        block: 'portfolio',
        elementSort: 'multimix'
    }
});

// example active multimix output: "portfolio-multimix-active"
```

### <a id="mixitup.Config.classnames#elementToggle">mixitup.Config.classnames.elementToggle</a>




The "element" portion of the classname added to toggle controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classnames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

> Example 1: changing the `config.classnames.elementToggle` value

```js
var mixer = mixitup(containerEl, {
    classnames: {
        elementToggle: 'toggle'
    }
});

// example active toggle output: "mixitup-toggle-active"
```
> Example 2: changing the `config.classnames.block` and `config.classnames.elementToggle` values

```js
var mixer = mixitup(containerEl, {
    classnames: {
        block: 'portfolio',
        elementToggle: 'toggle'
    }
});

// example active toggle output: "portfolio-toggle-active"
```

### <a id="mixitup.Config.classnames#modifierActive">mixitup.Config.classnames.modifierActive</a>




The "modifier" portion of the classname added to active controls.


|Type | Default
|---  | ---
|`string`| `'active'`


### <a id="mixitup.Config.classnames#modifierDisabled">mixitup.Config.classnames.modifierDisabled</a>




The "modifier" portion of the classname added to disabled controls.


|Type | Default
|---  | ---
|`string`| `'disabled'`


### <a id="mixitup.Config.classnames#delineatorElement">mixitup.Config.classnames.delineatorElement</a>




The delineator used between the "block" and "element" portions of any classname added by MixItUp.

If the block portion is ommited by setting it to an empty string, no delineator will be added.


|Type | Default
|---  | ---
|`string`| `'-'`

> Example: changing the delineator to match BEM convention

```js
var mixer = mixitup(containerEl, {
    classnames: {
        delineatorElement: '__'
    }
});

// example active control output: "mixitup__control-active"
```

### <a id="mixitup.Config.classnames#delineatorModifier">mixitup.Config.classnames.delineatorModifier</a>




The delineator used between the "element" and "modifier" portions of any classname added by MixItUp.

If the element portion is ommited by setting it to an empty string, no delineator will be added.


|Type | Default
|---  | ---
|`string`| `'-'`

> Example: changing both delineators to match BEM convention

```js
var mixer = mixitup(containerEl, {
    classnames: {
        delineatorElement: '__'
        delineatorModifer: '--'
    }
});

// example active control output: "mixitup__control--active"
```


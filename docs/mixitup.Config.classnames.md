# mixitup.Config.classNames

## Overview

A group of properties defining the output and structure of classNames programmatically
added to controls and containers to reflect the state of the mixer.

Most commonly, classNames are added to control buttons by MixItUp to indicate that
the control is active so that it can be styled accordingly - `'mixitup-control-active'` by default.

Using a "BEM" like structure, each classname is broken into the three parts:
a block namespace (`'mixitup'`), an element name (e.g. `'control'`), and an optional modifier
name (e.g. `'active'`) reflecting the state of the element.

By default, each part of the classname is concatenated together using single hyphens as
delineators, but this can be easily customised to match the naming convention and style of
your proejct.


## Members

### <a id="mixitup.Config.classNames#block">mixitup.Config.classNames.block</a>




The "block" portion, or top-level namespace added to the start of any classNames created by MixItUp.


|Type | Default
|---  | ---
|`string`| `'mixitup'`

> Example 1: changing the `config.classNames.block` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio'
    }
});

// example active control output: "portfolio-control-active"
```
> Example 2: Removing `config.classNames.block`

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: ''
    }
});

// example active control output: "control-active"
```

### <a id="mixitup.Config.classNames#elementContainer">mixitup.Config.classNames.elementContainer</a>




The "element" portion of the classname added to container.


|Type | Default
|---  | ---
|`string`| `'container'`


### <a id="mixitup.Config.classNames#elementFilter">mixitup.Config.classNames.elementFilter</a>




The "element" portion of the classname added to filter controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classNames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

> Example 1: changing the `config.classNames.elementFilter` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        elementFilter: 'filter'
    }
});

// example active filter output: "mixitup-filter-active"
```
> Example 2: changing the `config.classNames.block` and `config.classNames.elementFilter` values

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio',
        elementFilter: 'filter'
    }
});

// example active filter output: "portfolio-filter-active"
```

### <a id="mixitup.Config.classNames#elementSort">mixitup.Config.classNames.elementSort</a>




The "element" portion of the classname added to sort controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classNames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

> Example 1: changing the `config.classNames.elementSort` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        elementSort: 'sort'
    }
});

// example active sort output: "mixitup-sort-active"
```
> Example 2: changing the `config.classNames.block` and `config.classNames.elementSort` values

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio',
        elementSort: 'sort'
    }
});

// example active sort output: "portfolio-sort-active"
```

### <a id="mixitup.Config.classNames#elementMultimix">mixitup.Config.classNames.elementMultimix</a>




The "element" portion of the classname added to multimix controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classNames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

> Example 1: changing the `config.classNames.elementMultimix` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        elementMultimix: 'multimix'
    }
});

// example active multimix output: "mixitup-multimix-active"
```
> Example 2: changing the `config.classNames.block` and `config.classNames.elementMultimix` values

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio',
        elementSort: 'multimix'
    }
});

// example active multimix output: "portfolio-multimix-active"
```

### <a id="mixitup.Config.classNames#elementToggle">mixitup.Config.classNames.elementToggle</a>




The "element" portion of the classname added to toggle controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classNames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

> Example 1: changing the `config.classNames.elementToggle` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        elementToggle: 'toggle'
    }
});

// example active toggle output: "mixitup-toggle-active"
```
> Example 2: changing the `config.classNames.block` and `config.classNames.elementToggle` values

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio',
        elementToggle: 'toggle'
    }
});

// example active toggle output: "portfolio-toggle-active"
```

### <a id="mixitup.Config.classNames#modifierActive">mixitup.Config.classNames.modifierActive</a>




The "modifier" portion of the classname added to active controls.


|Type | Default
|---  | ---
|`string`| `'active'`


### <a id="mixitup.Config.classNames#modifierDisabled">mixitup.Config.classNames.modifierDisabled</a>




The "modifier" portion of the classname added to disabled controls.


|Type | Default
|---  | ---
|`string`| `'disabled'`


### <a id="mixitup.Config.classNames#modifierFailed">mixitup.Config.classNames.modifierFailed</a>




The "modifier" portion of the classname added to the container when in a "failed" state.


|Type | Default
|---  | ---
|`string`| `'failed'`


### <a id="mixitup.Config.classNames#delineatorElement">mixitup.Config.classNames.delineatorElement</a>




The delineator used between the "block" and "element" portions of any classname added by MixItUp.

If the block portion is ommited by setting it to an empty string, no delineator will be added.


|Type | Default
|---  | ---
|`string`| `'-'`

> Example: changing the delineator to match BEM convention

```js
var mixer = mixitup(containerEl, {
    classNames: {
        delineatorElement: '__'
    }
});

// example active control output: "mixitup__control-active"
```

### <a id="mixitup.Config.classNames#delineatorModifier">mixitup.Config.classNames.delineatorModifier</a>




The delineator used between the "element" and "modifier" portions of any classname added by MixItUp.

If the element portion is ommited by setting it to an empty string, no delineator will be added.


|Type | Default
|---  | ---
|`string`| `'-'`

> Example: changing both delineators to match BEM convention

```js
var mixer = mixitup(containerEl, {
    classNames: {
        delineatorElement: '__'
        delineatorModifier: '--'
    }
});

// example active control output: "mixitup__control--active"
```


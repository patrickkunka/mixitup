# mixitup.Config.classNames

## Overview

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

### Contents

- [block](#block)
- [elementContainer](#elementContainer)
- [elementFilter](#elementFilter)
- [elementSort](#elementSort)
- [elementMultimix](#elementMultimix)
- [elementToggle](#elementToggle)
- [modifierActive](#modifierActive)
- [modifierDisabled](#modifierDisabled)
- [modifierFailed](#modifierFailed)
- [delineatorElement](#delineatorElement)
- [delineatorModifier](#delineatorModifier)


## Members

### block




The "block" portion, or top-level namespace added to the start of any class names created by MixItUp.


|Type | Default
|---  | ---
|`string`| `'mixitup'`

##### Example 1: changing the `config.classNames.block` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio'
    }
});

// example active control output: "portfolio-control-active"
```
##### Example 2: Removing `config.classNames.block`

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: ''
    }
});

// example active control output: "control-active"
```

### elementContainer




The "element" portion of the class name added to container.


|Type | Default
|---  | ---
|`string`| `'container'`


### elementFilter




The "element" portion of the class name added to filter controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classNames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

##### Example 1: changing the `config.classNames.elementFilter` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        elementFilter: 'filter'
    }
});

// example active filter output: "mixitup-filter-active"
```
##### Example 2: changing the `config.classNames.block` and `config.classNames.elementFilter` values

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio',
        elementFilter: 'filter'
    }
});

// example active filter output: "portfolio-filter-active"
```

### elementSort




The "element" portion of the class name added to sort controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classNames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

##### Example 1: changing the `config.classNames.elementSort` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        elementSort: 'sort'
    }
});

// example active sort output: "mixitup-sort-active"
```
##### Example 2: changing the `config.classNames.block` and `config.classNames.elementSort` values

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio',
        elementSort: 'sort'
    }
});

// example active sort output: "portfolio-sort-active"
```

### elementMultimix




The "element" portion of the class name added to multimix controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classNames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

##### Example 1: changing the `config.classNames.elementMultimix` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        elementMultimix: 'multimix'
    }
});

// example active multimix output: "mixitup-multimix-active"
```
##### Example 2: changing the `config.classNames.block` and `config.classNames.elementMultimix` values

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio',
        elementSort: 'multimix'
    }
});

// example active multimix output: "portfolio-multimix-active"
```

### elementToggle




The "element" portion of the class name added to toggle controls.

By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
each type's element value can be individually overwritten to match the unique classNames of your controls as needed.


|Type | Default
|---  | ---
|`string`| `'control'`

##### Example 1: changing the `config.classNames.elementToggle` value

```js
var mixer = mixitup(containerEl, {
    classNames: {
        elementToggle: 'toggle'
    }
});

// example active toggle output: "mixitup-toggle-active"
```
##### Example 2: changing the `config.classNames.block` and `config.classNames.elementToggle` values

```js
var mixer = mixitup(containerEl, {
    classNames: {
        block: 'portfolio',
        elementToggle: 'toggle'
    }
});

// example active toggle output: "portfolio-toggle-active"
```

### modifierActive




The "modifier" portion of the class name added to active controls.


|Type | Default
|---  | ---
|`string`| `'active'`


### modifierDisabled




The "modifier" portion of the class name added to disabled controls.


|Type | Default
|---  | ---
|`string`| `'disabled'`


### modifierFailed




The "modifier" portion of the class name added to the container when in a "failed" state.


|Type | Default
|---  | ---
|`string`| `'failed'`


### delineatorElement




The delineator used between the "block" and "element" portions of any class name added by MixItUp.

If the block portion is ommited by setting it to an empty string, no delineator will be added.


|Type | Default
|---  | ---
|`string`| `'-'`

##### Example: changing the delineator to match BEM convention

```js
var mixer = mixitup(containerEl, {
    classNames: {
        delineatorElement: '__'
    }
});

// example active control output: "mixitup__control-active"
```

### delineatorModifier




The delineator used between the "element" and "modifier" portions of any class name added by MixItUp.

If the element portion is ommited by setting it to an empty string, no delineator will be added.


|Type | Default
|---  | ---
|`string`| `'-'`

##### Example: changing both delineators to match BEM convention

```js
var mixer = mixitup(containerEl, {
    classNames: {
        delineatorElement: '__'
        delineatorModifier: '--'
    }
});

// example active control output: "mixitup__control--active"
```


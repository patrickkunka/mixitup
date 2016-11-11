# mixitup.Config.selectors

## Overview

A group of properties defining the selectors used to query elements within a mixitup container.


## Members

### <a id="mixitup.Config.selectors#target">target</a>




A selector string used to query and index target elements within the container.

By default, the class selector `'.mix'` is used, but this can be changed to an
attribute or element selector to match the style of your project.


|Type | Default
|---  | ---
|`string`| `'.mix'`

##### Example 1: Changing the target selector

```js

var mixer = mixitup(containerEl, {
    selectors: {
        target: '.portfolio-item'
    }
});
```
##### Example 2: Using an attribute selector as a target selector

```js

// The mixer will search for any children with the attribute `data-ref="mix"`

var mixer = mixitup(containerEl, {
    selectors: {
        target: '[data-ref="mix"]'
    }
});
```


# mixitup.Config.layout

## Overview

A group of properties relating to the layout of the container.

### Contents

- [allowNestedTargets](#allowNestedTargets)
- [containerClassName](#containerClassName)


## Members

### allowNestedTargets




A boolean dictating whether or not mixitup should query all descendants
of the container for targets, or only immediate children.

By default, mixitup will query all descendants matching the
`selectors.target` selector when indexing targets upon instantiation.
This allows for targets to be nested inside a sub-container which is
useful when ring-fencing targets from locally scoped controls in your
markup (see `controls.scope`).

However, if you are building a more complex UI requiring the nesting
of mixers within mixers, you will most likely want to limit targets to
immediate children of the container by setting this property to `false`.


|Type | Default
|---  | ---
|`boolean`| `true`

##### Example: Restricting targets to immediate children

```js

var mixer = mixitup(containerEl, {
    layout: {
        allowNestedTargets: false
    }
});
```

### containerClassName




A string specifying an optional class name to apply to the container when in
its default state.

By changing this class name or adding a class name to the container via the
`.changeLayout()` API method, the CSS layout of the container can be changed,
and MixItUp will attemp to gracefully animate the container and its targets
between states.


|Type | Default
|---  | ---
|`string`| `''`

##### Example 1: Specifying a container class name

```js

var mixer = mixitup(containerEl, {
    layout: {
        containerClassName: 'grid'
    }
});
```
##### Example 2: Changing the default class name with `.changeLayout()`

```js

var mixer = mixitup(containerEl, {
    layout: {
        containerClassName: 'grid'
    }
});

mixer.changeLayout('list')
    .then(function(state) {
         console.log(state.activeContainerClass); // "list"
    });
```


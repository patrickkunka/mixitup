# mixitup.Config.debug

## Overview

A group of properties allowing the toggling of various debug features.

### Contents

- [enable](#enable)
- [showWarnings](#showWarnings)


## Members

### enable




A boolean dictating whether or not the mixer instance returned by the
`mixitup()` factory function should expose private properties and methods.

By default, mixer instances only expose their public API, but enabling
debug mode will give you access to various mixer internals which may aid
in debugging, or the authoring of extensions.


|Type | Default
|---  | ---
|`boolean`| `false`

##### Example: Enabling debug mode

```js

var mixer = mixitup(containerEl, {
    debug: {
        enable: true
    }
});

// Private properties and methods will now be visible on the mixer instance:

console.log(mixer);
```

### showWarnings




A boolean dictating whether or not warnings should be shown when various
common gotchas occur.

Warnings are intended to provide insights during development when something
occurs that is not a fatal, but may indicate an issue with your integration,
and are therefore turned on by default. However, you may wish to disable
them in production.


|Type | Default
|---  | ---
|`boolean`| `true`

##### Example 1: Disabling warnings

```js

var mixer = mixitup(containerEl, {
    debug: {
        showWarnings: false
    }
});
```
##### Example 2: Disabling warnings based on environment

```js

var showWarnings = myAppConfig.environment === 'development' ? true : false;

var mixer = mixitup(containerEl, {
    debug: {
        showWarnings: showWarnings
    }
});
```


#mixitup

The `mixitup` factory function is used to create discreet instances
of MixItUp, also known as "mixers" in v3.

This is the first entry point for the v3 API, and abstracts away the
functionality of instantiating mixer objects directly.

```js
mixitup(container [,config] [,foreignDoc])
```

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`Element,Array.<Element>,string` | `container` | A DOM element, NodeList, jQuery collection, or selector string representing
the container element(s) on which to instantiate MixItUp.
|Param   |`object` | `[config]` | An optional "configuration object" used to customize the behavior of the MixItUp instance.
|Param   |`object` | `[foreignDoc]` | An optional reference to a `document`, which can be used to control a MixItUp instance in an iframe.
|Param   |`boolean` | `[returnCollection]` |
|Returns |`mixitup.Mixer,mixitup.Collection` | A "mixer" object representing the instance of MixItUp, or a collection of
mixers if instantiating on multiple containers.
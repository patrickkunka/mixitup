#mixitup

```js
mixitup(container [,config] [,foreignDoc])
```

The `mixitup` factory function is used to create discreet instances
of MixItUp, also known as "Mixers" in v3.

It is the first entry point for the v3 API, and abstracts away the
functionality of instantiating `Mixer` objects directly.

The factory function also checks whether or not a MixItUp instance is
already active on specified element, and if so, returns that instance
rather than creating a duplicate.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`Element, Array.<Element>, string` | `container` | An element, element array, or selector string representing the container(s) on which to instantiate MixItUp.
|Param   |`object` | `[config]` | An optional "configuration object" used to customize the behavior of the MixItUp instance.
|Param   |`object` | `[foreignDoc]` | An optional reference to a `document`, which can be used to control a MixItUp instance in an iframe.
|Returns |`mixitup.Mixer, mixitup.Collection` | An object representing the instance of MixItUp, or a "collection" if instantiating multiple mixers.

**Version added: 3.0.0**

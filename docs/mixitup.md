#mixitup

```js
mixitup(container [,config] [,foreignDoc])
```

The `mixitup` "factory" function is used to create discreet instances
of MixItUp, or "mixers". When loading MixItUp via a `<script>` tag, the
factory function is accessed as the global variable `mixitup`. When using
a module loader such as Browserify or RequireJS however, the factory
function is exported directly into your module when you require
the MixItUp library.

It is the first entry point for the v3 API, and abstracts away the
functionality of instantiating mixer objects directly.

The factory function also checks whether or not a MixItUp instance is
already active on specified element, and if so, returns that instance
rather than creating a duplicate.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`Element, string` | `container` | A DOM element or selector string representing the container(s) on which to instantiate MixItUp.
|Param   |`object` | `[config]` | An optional "configuration object" used to customize the behavior of the MixItUp instance.
|Param   |`object` | `[foreignDoc]` | An optional reference to a `document`, which can be used to control a MixItUp instance in an iframe.
|Returns |`mixitup.Mixer` | A "mixer" object representing the instance of MixItUp

**Version added: 3.0.0**

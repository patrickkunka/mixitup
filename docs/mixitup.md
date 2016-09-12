#mixitup

```js
mixitup(container [,config] [,foreignDoc])
```

The `mixitup` "factory" function is used to create individual instances
of MixItUp, or "mixers". All API methods can then be called using the
mixer instance returned by the factory function.

When loading MixItUp via a `&lsaquo;script%rsaquo;` tag, the factory function is accessed
as the global variable `mixitup`. When using a module loader such as Browserify
or RequireJS however, the factory function is exported directly into your module
when you require the MixItUp library.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`Element, string` | `container` | A DOM element or selector string representing the container(s) on which to instantiate MixItUp.
|Param   |`object` | `[config]` | An optional "configuration object" used to customize the behavior of the MixItUp instance.
|Param   |`object` | `[foreignDoc]` | An optional reference to a `document`, which can be used to control a MixItUp instance in an iframe.
|Returns |`mixitup.Mixer` | A "mixer" object representing the instance of MixItUp

**Version added: 3.0.0**

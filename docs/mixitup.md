#mixitup()

*Version added: 3.0.0*

`mixitup(container [,config] [,foreignDoc])`

The `mixitup()` "factory" function creates individual instances of MixItUp
("mixers"), which are returned with the function is called.

Various API methods can then be called on the returned mixer instance.

When loading MixItUp via a script tag, the factory function is accessed
as the global variable `mixitup`. When using a module loader such as Browserify
or RequireJS however, the factory function is exported directly into your module
when you require the MixItUp library.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`Element, string` | `container` | A DOM element or selector string representing the container(s) on which to instantiate MixItUp.
|Param   |`object` | `[config]` | An optional "configuration object" used to customize the behavior of the MixItUp instance.
|Param   |`object` | `[foreignDoc]` | An optional reference to a `document`, which can be used to control a MixItUp instance in an iframe.
|Returns |`mixitup.Mixer` | A "mixer" object representing the instance of MixItUp

###### Example 1: Creating a mixer instance with an element reference

```js
var containerEl = document.querySelector('.container');

var mixer = mixitup(containerEl);
```
###### Example 2: Creating a mixer instance with a selector string

```js
var mixer = mixitup('.container');
```
###### Example 3: Passing a configuration object

```js
var mixer = mixitup(containerEl, {
    animation: {
        effects: 'fade scale(0.5)'
    }
});
```
###### Example 4: Passing an iframe reference

```js
var mixer = mixitup(containerEl, config, foreignDocument);
```

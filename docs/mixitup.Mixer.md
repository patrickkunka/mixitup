# mixitup.Mixer

## Overview

The `mixitup.Mixer` class is used to construct discreet user-configured
instances of MixItUp around the provided container element(s). Other
than the intial `mixitup()` factory function call, which returns an
instance of a mixer, all other public API functionality is performed
on mixer instances.


## Members

### <a id="mixitup.Mixer#init">mixitup.Mixer.init</a>

**Version added: 3.0.0**

```js
.init([startFromHidden])
```

Initialises a newly instantiated mixer by filtering in all targets, or those
specified via the `load.filter` configuration option.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


> Example 1: Running init after mixer instantiation

```js
var container = document.querySelector('.mixitup-container');
var mixer = mixitup(container);

mixer.init();
```
> 

```js
var mixer = mixitup(.mixitup-container, {
    selectors: {
        target: '.item'
    }
});

mixer.init();
```

### <a id="mixitup.Mixer#show">mixitup.Mixer.show</a>

**Version added: 3.0.0**

```js
.show()
```

A shorthand method for `.filter('all')`.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#hide">mixitup.Mixer.hide</a>

**Version added: 3.0.0**

```js
.hide()
```

A shorthand method for `.filter('none')`.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#isMixing">mixitup.Mixer.isMixing</a>

**Version added: 2.0.0**

```js
.isMixing()
```

Returns a boolean indicating whether or not a MixItUp operation is
currently in progress.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`boolean` | 



### <a id="mixitup.Mixer#filter">mixitup.Mixer.filter</a>

**Version added: 2.0.0**

```js
.filter(selector [,animate] [,callback])
```

Filters the mixer according to the specified filter command.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `selector` | Any valid CSS selector (i.e. `'.category-2'`), or the strings `'all'` or `'none'`.
|Param   |`boolean` | `[animate]` | 
|Param   |`function` | `[callback]` | 
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#toggleOn">mixitup.Mixer.toggleOn</a>

**Version added: 3.0.0**

```js
.toggleOn(selector [,animate] [,callback])
```

Adds a selector to the currently active set of toggles and filters the mixer.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `selector` | Any valid CSS selector (i.e. `'.category-2'`)
|Param   |`boolean` | `[animate]` | 
|Param   |`function` | `[callback]` | 
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#toggleOff">mixitup.Mixer.toggleOff</a>

**Version added: 3.0.0**

```js
.toggleOn(selector [,animate] [,callback])
```

Removes a selector from the currently active set of toggles and filters the mixer.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `selector` | Any valid CSS selector (i.e. `'.category-2'`)
|Param   |`boolean` | `[animate]` | 
|Param   |`function` | `[callback]` | 
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#sort">mixitup.Mixer.sort</a>

**Version added: 2.0.0**

```js
.sort(sortString [,animate] [,callback])
```

Sorts the mixer according to the specified sort command.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `sortString` | A colon-seperated "sorting pair" (e.g. `'published:asc'`, or `'random'`.
|Param   |`boolean` | `[animate]` | 
|Param   |`function` | `[callback]` | 
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#changeLayout">mixitup.Mixer.changeLayout</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#getOperation">mixitup.Mixer.getOperation</a>

**Version added: 3.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `command` | 
|Param   |`boolean` | `[isPreFetch]` | An optional boolean indicating that the operation is being pre-fetched for execution at a later time.
|Returns |`Operation, null` | 



### <a id="mixitup.Mixer#multimix">mixitup.Mixer.multimix</a>

**Version added: 2.0.0**

```js
.multimix(multimixCommand [,animate] [,callback])
```

Performs simultaneous `filter`, `sort`, `insert`, `remove` and `changeLayout`
operations as requested.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `multimixCommand` | An object containing one or more things to do
|Param   |`boolean` | `[animate]` | 
|Param   |`function` | `[callback]` | 
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#tween">mixitup.Mixer.tween</a>

**Version added: 3.0.0**

```js
.tween(operation, multiplier)
```

Renders a previously created operation at a specific point in its path, as
determined by a multiplier between 0 and 1.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`mixitup.Operation` | `operation` | An operation object created via the `getOperation` method
|Param   |`Float` | `multiplier` | Any number between 0 and 1 representing the percentage complete of the operation
|Returns |`void` | 



### <a id="mixitup.Mixer#insert">mixitup.Mixer.insert</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#insertBefore">mixitup.Mixer.insertBefore</a>

**Version added: 3.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#insertAfter">mixitup.Mixer.insertAfter</a>

**Version added: 3.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#prepend">mixitup.Mixer.prepend</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#append">mixitup.Mixer.append</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#remove">mixitup.Mixer.remove</a>

**Version added: 3.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 



### <a id="mixitup.Mixer#getConfig">mixitup.Mixer.getConfig</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `[stringKey]` | 
|Returns |`*` | 



### <a id="mixitup.Mixer#configure">mixitup.Mixer.configure</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `config` | 
|Returns |`void` | 



### <a id="mixitup.Mixer#getState">mixitup.Mixer.getState</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`mixitup.State` | 



### <a id="mixitup.Mixer#forceRefresh">mixitup.Mixer.forceRefresh</a>

**Version added: 2.1.2**





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`void` | 



### <a id="mixitup.Mixer#destroy">mixitup.Mixer.destroy</a>

**Version added: 2.0.0**





|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`boolean` | `hideAll` | 
|Returns |`void` | 




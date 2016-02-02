# mixitup.Mixer

## Overview

The `mixitup.Mixer` class is used to construct discreet user-configured
instances of MixItUp around the provided container element(s). Other
than the intial `mixitup()` factory function call, which returns an
instance of a mixer, all other public API functionality is performed
on mixer instances.

## Members

### <a id="mixitup.Mixer#init">mixitup.Mixer.init</a>

```js
.init()
```

Initialises a newly instantiated mixer by filtering in all targets, or those
specified via the `load.filter` configuration option.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`boolean` | `[startFromHidden]` | An optional boolean dictating whether targets should start from a hidden or non-hidden state.
|Returns |`Promise.<mixitup.State>` | 


**Version added: 3.0.0**
### <a id="mixitup.Mixer#show">mixitup.Mixer.show</a>

```js
.show()
```

A shorthand method for `.filter('all')`.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


**Version added: 3.0.0**
### <a id="mixitup.Mixer#hide">mixitup.Mixer.hide</a>

```js
.hide()
```

A shorthand method for `.filter('none')`.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


**Version added: 3.0.0**
### <a id="mixitup.Mixer#isMixing">mixitup.Mixer.isMixing</a>

```js
.isMixing()
```

Returns a boolean indicating whether or not a MixItUp operation is
currently in progress.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`boolean` | 


**Version added: 2.0.0**
### <a id="mixitup.Mixer#filter">mixitup.Mixer.filter</a>

```js
.filter(filterCommand [,animate] [,callback])
```

Filters the mixer according to the specified filter command.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `filterCommand` | Any valid CSS selector (i.e. `'.category-2'`), or the strings `'all'` or `'none'`.
|Param   |`boolean` | `[animate]` | 
|Param   |`function` | `[callback]` | 
|Returns |`Promise.<mixitup.State>` | 


**Version added: 2.0.0**
### <a id="mixitup.Mixer#sort">mixitup.Mixer.sort</a>

```js
.sort(sortCommand [,animate] [,callback])
```

Sorts the mixer according to the specified sort command.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `sortCommand` | A colon-seperated "sorting pair" (e.g. `'published:asc'`, or `'random'`.
|Param   |`boolean` | `[animate]` | 
|Param   |`function` | `[callback]` | 
|Returns |`Promise.<mixitup.State>` | 


**Version added: 2.0.0**
### <a id="mixitup.Mixer#changeLayout">mixitup.Mixer.changeLayout</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


**Version added: 2.0.0**
### <a id="mixitup.Mixer#getOperation">mixitup.Mixer.getOperation</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`Command` | `command` | 
|Param   |`boolean` | `[isPreFetch]` | An optional boolean indicating that the operation is being pre-fetched for execution at a later time.
|Returns |`Operation, null` | 


**Version added: 3.0.0**
### <a id="mixitup.Mixer#multiMix">mixitup.Mixer.multiMix</a>

```js
.multiMix(multiMixCommand [,animate] [,callback])
```

Performs simultaneous `filter`, `sort`, `insert`, `remove` and `changeLayout`
operations as requested.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `multiMixCommand` | An object containing one or more operation commands
|Param   |`boolean` | `[animate]` | 
|Param   |`function` | `[callback]` | 
|Returns |`Promise.<mixitup.State>` | 


**Version added: 2.0.0**
### <a id="mixitup.Mixer#tween">mixitup.Mixer.tween</a>

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


**Version added: 3.0.0**
### <a id="mixitup.Mixer#insert">mixitup.Mixer.insert</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


**Version added: 2.0.0**
### <a id="mixitup.Mixer#insertBefore">mixitup.Mixer.insertBefore</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


**Version added: 3.0.0**
### <a id="mixitup.Mixer#insertAfter">mixitup.Mixer.insertAfter</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


**Version added: 3.0.0**
### <a id="mixitup.Mixer#prepend">mixitup.Mixer.prepend</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


**Version added: 2.0.0**
### <a id="mixitup.Mixer#append">mixitup.Mixer.append</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


**Version added: 2.0.0**
### <a id="mixitup.Mixer#remove">mixitup.Mixer.remove</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


**Version added: 3.0.0**
### <a id="mixitup.Mixer#getOption">mixitup.Mixer.getOption</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `stringKey` | 
|Returns |`*` | 


**Version added: 2.0.0**
### <a id="mixitup.Mixer#setOptions">mixitup.Mixer.setOptions</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `config` | 
|Returns |`void` | 


**Version added: 2.0.0**
### <a id="mixitup.Mixer#getState">mixitup.Mixer.getState</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`mixitup.State` | 


**Version added: 2.0.0**
### <a id="mixitup.Mixer#forceRefresh">mixitup.Mixer.forceRefresh</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`void` | 


**Version added: 2.1.2**
### <a id="mixitup.Mixer#destroy">mixitup.Mixer.destroy</a>





|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`boolean` | `hideAll` | 
|Returns |`void` | 


**Version added: 2.0.0**

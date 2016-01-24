# mixitup.Mixer

## Overview

The `mixitup.Mixer` class is used to construct discreet user-configured
instances of MixItUp around the provided container element(s). Other
than the intial `mixitup()` factory function call, which returns an
instance of a mixer, all other public API functionality is performed
on mixer instances.

## Members

### <a id="mixitup.Mixer#init">mixitup.Mixer.init</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#show">mixitup.Mixer.show</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#hide">mixitup.Mixer.hide</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#isMixing">mixitup.Mixer.isMixing</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`boolean` | 


### <a id="mixitup.Mixer#filter">mixitup.Mixer.filter</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#sort">mixitup.Mixer.sort</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#changeLayout">mixitup.Mixer.changeLayout</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#getOperation">mixitup.Mixer.getOperation</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`Command` | `command` | 
|Returns |`Operation,null` | 


### <a id="mixitup.Mixer#multiMix">mixitup.Mixer.multiMix</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `multiMixCommand` | 
|Param   |`boolean` | `[animate]` | 
|Param   |`function` | `[callback]` | 
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#tween">mixitup.Mixer.tween</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`Operation` | `operation` | 
|Param   |`Float` | `multiplier` | 
|Returns |`void` | 


### <a id="mixitup.Mixer#insert">mixitup.Mixer.insert</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#insertBefore">mixitup.Mixer.insertBefore</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#insertAfter">mixitup.Mixer.insertAfter</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#prepend">mixitup.Mixer.prepend</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#append">mixitup.Mixer.append</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#remove">mixitup.Mixer.remove</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | 


### <a id="mixitup.Mixer#getOption">mixitup.Mixer.getOption</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `stringKey` | 
|Returns |`*` | 


### <a id="mixitup.Mixer#setOptions">mixitup.Mixer.setOptions</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `config` | 
|Returns |`void` | 


### <a id="mixitup.Mixer#getState">mixitup.Mixer.getState</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`mixitup.State` | 


### <a id="mixitup.Mixer#forceRefresh">mixitup.Mixer.forceRefresh</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`void` | 


### <a id="mixitup.Mixer#destroy">mixitup.Mixer.destroy</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`boolean` | `hideAll` | 
|Returns |`void` | 

# mixitup.BasePrototype

## Overview

The BasePrototype class exposes a set of static methods which all other MixItUp
classes inherit as a means of integrating extensions via the addition of new
methods and/or actions and hooks.

## Members

### <a id="mixitup.BasePrototype.extend">mixitup.BasePrototype.extend</a>



Performs a shallow extend on the class's prototype, enabling the addition of
multiple new members to the class in a single operation.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`object` | `extension` | 
|Returns |`void` | 


**Added v2.1.0**
### <a id="mixitup.BasePrototype.addAction">mixitup.BasePrototype.addAction</a>



Registers an action function to be executed at a predefined hook.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `hook` | 
|Param   |`string` | `name` | 
|Param   |`function` | `func` | 
|Param   |`number` | `priority` | 
|Returns |`void` | 


**Added v2.1.0**
### <a id="mixitup.BasePrototype.addFilter">mixitup.BasePrototype.addFilter</a>



Registers a filter function to be executed at a predefined hook.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `hook` | 
|Param   |`string` | `name` | 
|Param   |`function` | `func` | 
|Returns |`void` | 


**Added v2.1.0**

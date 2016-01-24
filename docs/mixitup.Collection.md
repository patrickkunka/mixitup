# mixitup.Collection

## Overview

A jQuery-like wrapper object for one or more `mixitup.Mixer` instances
allowing simultaneous control of multiple instances.

## Members

### <a id="mixitup.Collection#do">mixitup.Collection.do</a>

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`string` | `methodName` | 
|Returns |`Promise` | 
A jQueryUI-like API for calling a method on all instances in the collection
by passing the method name as a string followed by an neccessary parameters.
Version 1 Migration Guide
=========

1. [Overview](#overview)
1. [Basic Operation](#basic-operation)
1. [Filtering](#filtering)
1. [Sorting](#sorting)
1. [The Configuration Object](#the-configuration-object)
1. [API Methods](#api-methods)

## Overview

MixItUp 2 is a much-needed rewrite of MixItUp 1 and while the concept and functionality remains the same, the basic syntax and API has changed and is not compatible with any 1.x version or integration.

This guide provides an overview of the most important changes but is not exhaustive. Further information can be found in the Get Started tutorial and Docs.

## Basic Operation

- The jQuery MixItUp method is now “camel cased” as follows: `.mixItUp()`
- Target elements no longer require the default css rule `opacity: 0;`. **Including this will break MixItUp**. However, the default rule `display: none;` is still required on all targets.

## Filtering

Consistent with the jQuery .filter() method, filtering is now executed with pure CSS selector strings rather than discreet class names. This allows for much easier advanced-filtering implementation through combinations of selectors.

The filter API method is also consistent with jQuery’s implementation including the ability to send a jQuery collection object as an argument.

```
<div class="filter" data-filter=".category-1">Category 1</div>
<div class="filter" data-filter=".category-2">Category 2</div>
...
<div class="filter" data-filter=".category-1.category-2"> ... </div>
<div class="filter" data-filter=".category-1, .category-2"> ... </div>
<div class="filter" data-filter=".category-1:not(.category-3)"> ...</div>
```
> Pure CSS selectors are now used for filtering.

## Sorting

To follow the standard definitions, the behaviour of the “ascending” and “descending” sort orders has been reversed from their behaviour in version 1.

Sorting is now executed via a single “data-sort” attribute with its value taking the following syntax of a colon-separated string; where the first part of the string is the data-attribute to sort by, and the second is the order:

```
<div class="sort" data-sort="myorder:asc">Ascending</div>
<div class="sort" data-sort="myorder:desc">Descending</div>
```
> Sorting is now executed via a single "data-sort" attribute

## The Configuration Object

In 1.x all configuration options were contained in a single flat object literal. With the addition of many new configuration options in version 2, the configuration object has been organized into several nested objects of related properties. Please see the Docs for the full list of properties and  their default values.

```
$('#Container').mixItUp({
	selectors: { ... },
	animation:  { ... },
	callbacks: { ... },
	controls:  { ... },
	layout:  { ... },
	load:  { ... }
});
```
> The configuration object takes on a new format of nested sub-objects for cleaner organization.

## API Methods

The functionality and syntax of the filter and sort API methods reflect the changes as stated above. Many new API methods have also been added and most operational API methods now accept an optional callback function as a parameter.

Please review the API Methods section of the Docs for further information.

<br/>

-------
*&copy; 2014 KunkaLabs Limited*
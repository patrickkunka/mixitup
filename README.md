MixItUp
=========

### What is MixItUp?

MixItUp is a jQuery plugin providing animated filtering and sorting.

MixItUp is great for managing any categorized or ordered content like portfolios, galleries and blogs, but can also function as a powerful tool for engaging application UI and data-visualisation.

### Why MixItUp?

MixItUp plays nice with your existing HTML and CSS, making it a great choice for responsive layouts.

Rather than using absolute positioning to control layout, MixItUp is designed to work with your existing inline-flow layout. Want to use percentages, media queries, inline-block, or even flex box? No problem!

### Basic Overview

For a getting started guide, tutorials, documentation and support, please visit the MixItUp website at [mixitup.kunkalabs.com](https://mixitup.kunkalabs.com)

A typical MixItUp workflow looks like this:

#### HTML

Build your container:

```
<div id="Container">
	<div class="mix category-1" data-my-order="1"> ... </div>
	<div class="mix category-1" data-my-order="2"> ... </div>
	<div class="mix category-2" data-my-order="3"> ... </div>
	<div class="mix category-2" data-my-order="4"> ... </div>
</div>
```
> MixItUp targets elements with the class `mix` inside a container. Categories for filtering are added as classes, and sort attributes are added as custom data attributes.

Build your filter controls:

```
<button class="filter" data-filter=".category-1">Category 1</button>
<button class="filter" data-filter=".category-2">Category 2</button>
```
> Filtering happens when filter buttons are clicked.


Build your sort controls:

```
<button class="sort" data-sort="my-order:asc">Ascending Order</button>
<button class="sort" data-sort="my-order:desc">Descending Order</button>
```
> Sorting happens when sort buttons are clicked.

#### CSS

Hide target elements:
```
#Container .mix{
	display: none;
}
```
> In your project's stylesheet, set the display property of target elements to `none`. MixItUp will show only those elements which match the current filter.

#### JS

Instantiate MixItUp on your container using jQuery:

```
$(function(){
	$('#Container').mixItUp();	
});
```
> Using our container's ID, we can instantiate MixItUp with the jQuery method `.mixItUp()`

### Full Documentation

1. [Configuration Object](docs/configuration-object.md)                                                     
1. [API Methods](docs/api-methods.md)
1. [State Object](docs/state-object.md)
1. [Events](docs/events.md)                                                                                 
1. [Version 1 Migration Guide](docs/version-1-migration.md)
                                                                                                            
A much prettier version of the full documentation is also available at [mixitup.kunkalabs.com/docs](https://mixitup.kunkalabs.com/docs)

### ChangeLog

1. [ChangeLog](CHANGELOG.md)

### Licenses

For use in commercial projects and products we require that you purchase a commercial license.

For more information see [mixitup.kunkalabs.com/licenses](https://mixitup.kunkalabs.com/licenses)

MixItUp is free to use in non-commercial projects under the terms of the Creative Commons CC-BY-NC license.

### Support & Bugs

Support forums are provided at [mixitup.kunkalabs.com/support](https://mixitup.kunkalabs.com/support)

We ask that all general support questions and issues are posted there and that GitHub issues be used *only* for bug-related issues. All non-bug-related issues posted to GitHub will be closed without comment.

- Please be patient while we respond to your questions as we have very limited  resources. The support forum is provided as a courtesy to MixItUp users so that knowledge can be shared – support is not guaranteed.
- Please be as detailed as possible when posting. If you can include a link to your project, a CodePen or JSFiddle demo, or a even just a code snippet of your setup, it is much more likely your question will be answered quickly and correctly.
- Do not email KunkaLabs with support questions. All support emails will be ignored.
- If you think you’ve found a bug we encourage you to submit a GitHub Issue rather than posting in the support forums. This way we can keep bugs tracked efficiently and hopefully fix them swiftly.
- When submitting a bug report please provide as much details as possible about your development environment, browser and OS, and the expected vs. resulting behaviour. Please also include any console errors that arise.
- If you can pinpoint the erroneous code even better. Pull requests are always appreciated.

<br/>

-------
*&copy; 2014 KunkaLabs Limited*

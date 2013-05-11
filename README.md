## MixItUp - A CSS3 and jQuery Filter & Sort Plugin

### What Is MixItUp?

MixItUp is a light-weight but powerful jQuery plugin that provides beautiful animated filtering and sorting of categorized and ordered content. It plays nice with your existing HTML and CSS, making it a great choice for fluid, responsive layouts. It's perfect for portfolios, galleries, blogs, or any categorized or ordered content!

### How does it work?

MixItUp uses jQuery to decide which elements to hide, show or re-position based on your filters, and then applies the power of CSS3 transitions to smoothly animate these elements to their new locations. It's an extremely efficient approach that makes the most of your modern browser's rendering power, and avoids more resource-heavy approaches involving jQuery .animate() and position: absolute.

By not forcing absolute positioning on your design, all elements remain in the document flow and your fluid layout will behave exactly as it normally would - leaving you free to use percentages and media queries to achieve that pixel-perfect responsive design! When MixItUp is finished working its magic, it cleans up its code and gets outta your DOM.

### Which browsers and devices can I use it with?

MixItUp is optimized for the current generation of modern, CSS3-ready browsers. Due to its light-weight and efficient approach, It works beautifully and smoothly on all modern devices including smartphones and tablets.

In older browsers (such as Internet Explorer 9 and below) that do not support CSS3 transitions, MixItUp will degrade gracefully to a simple hide/show filter. By not including extensive jQuery animation fall-backs, we've kept MixItUp ultra-light and optimized for the future of the web.

### How did it begin development?

At Barrel LLC, many of the designs we create for our clients involve pages with responsive grid layouts and filtering between categories. We weren't satisfied with how the existing filtering plugins out there handled percentage-based responsive behavior, and seeing a need for something lighter and more forward-looking, we decided to build our own solution!

### How may I use MixItUp?

You are free to use MixItUp on any commercial or non-commercial project. Just be sure to keep the license information and attribution in the code.

## Getting Started

For the full documentation and list of configuration options please visit out marketing site at [mixitup.io](http://mixitup.io).

MixItUp couldn't be easier to setup. Just follow these simple steps in your HTML, CSS and JavaScript:

### HTML

#### Build Your Container and Content

MixItUp can be applied to any type of elements within a container, such as an unordered list. Your container should have a unique ID (e.g. 'Grid') that we will use to instantiate MixItUp in your JavaScript. By default, MixItUp will apply itself only to elements within your container with the class 'mix', but this can be changed with the 'targetSelector' configuration option.

The filtering categories of each target element should be entered into its class attribute (after the targetSelector class if you are using a class):

	<ul id="Grid">
    	<li class="mix dogs"></li>
    	<li class="mix cats"></li>
    	<li class="mix krakens"></li>
    	<li class="mix dogs cats"></li>
    	<li ...
	</ul>

Additional alphabetic or numeric HTML5 data attributes for sorting may also be added to your target elements:

	<ul id="Grid">
    	<li class="mix dogs" data-name="Abby" data-age="2"></li>
    	<li class="mix cats" data-name="Bucky" data-age="9"></li>
    	<li class="mix dogs" data-name="Francis" data-age="5"></li>
    	<li class="mix krakens" data-name="Kraken" data-age="3987"></li>
    	<li ...
	</ul>

#### Build Your Filter Controls

Filtering happens when filter buttons are clicked. By default MixItUp will apply filtering click handlers to any element with the class 'filter', but this can be changed with the the 'filterSelector' configuration option. When a filter category is active, its corresponding filter buttons gets the class 'active', which can be used for styling active buttons.

These buttons could also be part of an unordered list. The desired filter categories of each filter button should be entered as the "data-filter" attribute. See the 'filterLogic' option for details on how MixItUp handles multiple filters.

	<ul>
	    <li class="filter" data-filter="dogs"></li>
	    <li class="filter" data-filter="cats"></li>
	    <li class="filter" data-filter="krakens"></li>
	    <li class="filter" data-filter="dogs cats"></li>
	</ul>

Alternatively, elements may be filtered directly via javascript with the 'filter' method.

#### Build Your Sort Controls

Sorting happens when sort buttons are clicked. By default MixItUp will apply sorting click handlers to any element with the class 'sort', but this can be changed with the the 'sortSelector' configuration option.

These buttons could also be part of an unordered list, with the data attribute to sort by entered as the "data-sort" attribute, and the order to sort by entered as the "data-order" attribute:

	<ul>
	    <li class="sort" data-sort="data-name" data-order="desc"></li>
	    <li class="sort" data-sort="data-name" data-order="asc"></li>
	    <li class="sort" data-sort="data-age" data-order="desc"></li>
	    <li class="sort" data-sort="data-age" data-order="asc"></li>
	    <li class="sort" data-sort="default" data-order="asc"></li>
	    <li class="sort" data-sort="random"></li>
	</ul>

Sorting by 'default' maintains the order that elements are originally entered into the DOM, and is useful for toggling between descending and ascending order, without sorting by a specific attribute.

Alternatively, elements may be sorted directly via javascript with the 'sort' method.

### CSS

If you're not sure where to begin with your styling, check out our boilerplate template and demos.

If you want to go it alone though, here are some dos and don'ts:

#### Dos

Because MixItUp never interferes the flow, width, or height of your elements, the styling and design is completely up to you. Just be sure to make sure your target elements have the following CSS properties in your stylesheet:

	#Grid .mix{
	    opacity: 0;
	    display: none;
	}
	
These two styles ensure that there's no FOUC (flash of unstyled content) or showing of hidden target elements before MixItUp instantiates. This way, MixItUp controls the initial loading of your elements, when your page is ready.

You'll probably want to add these two properties only once you've finished designing your layout and you're ready to instantiate MixItUp - otherwise you won't be able to see your elements!

#### Don'ts

Avoid applying styles such as position: absolute or float: left/right to your elements, as doing so removes your elements from the natural flow of the document. If you're looking to build a layout that doesn't follow the natural horizontal documental flow, we recommend David DeSandro's excellent plugin Isotope. MixItUp is intended as a lightweight and modern filter and sort plugin - not a layout tool.

### JavaScript

MixItUp uses the jQuery JavaScript library. Make sure you have jQuery loaded into your project's head before MixItUp:

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="js/jquery.mixitup.min.js"></script>
	...

MixItUp is instantiated on your container in your JavaScript like this:

	$(function(){
     
	    $('#Grid').mixitup();
     
	});

And we're done!

As long as you use the default selectors in your HTML, MixItUp should run straight out of the box. If you're looking to do something more advanced, see our the full documentation on [mixitup.io](http://mixitup.io) for all available configuration options.
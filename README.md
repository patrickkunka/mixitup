# MixItUp 3

MixItUp is a high-performance, dependency-free library for animated DOM manipulation, giving you the power to filter, sort, add and remove DOM elements with beautiful animations.

MixItUp plays nice with your existing HTML and CSS, making it a great choice for responsive layouts. Want to use percentages, media queries, inline-block, or even flexbox? No problem!

For our live sandbox demo, full documentation, tutorials and more, please visit [--website pending--](pending).

#### Licensing

MixItUp is open source and free to use for non-commercial, educational and non-profit use. For use in commercial projects, a commercial license is required. For licensing information and FAQs please see [--website pending--](pending).

#### Full Documentation

- [Factory Function](./docs/mixitup.md)
- [Configuration Object](./docs/mixitup.Config.md)
- [Mixer API Methods](./docs/mixitup.Mixer.md)
- [Mixer Events](./docs/mixitup.Events.md)
- [State Object](./docs/mixitup.State.md)

## Getting Started

#### Contents

- [CSS](#css)
- [HTML](#html)
- [Loading the MixItUp JavaScript](#loading-the-mixitup-javascript)
- [Creating a Mixer](#creating-a-mixer)

Most commonly, MixItUp is applied to a "container" of "target" elements, which could be a portfolio of projects, a list of blog posts, a selection of products, or anything kind of UI where filtering and/or sorting would be advantageous.

To get started, firstly build and style your layout as desired, then add MixItUp to your project's JavaScript.

### CSS

While MixItUp can be added on top of any existing CSS layout, we strongly recommend inline-block or flexbox-based styling over floats and legacy grid frameworks when dealing with grid-based designs for a number of reasons. Find out more about MixItUp-compatible grid layouts [--website pending--]().

### HTML

#### 1. Build Your Container

```html
<div class="container">
    <div class="mix category-a" data-order="1"></div>
    <div class="mix category-b" data-order="2"></div>
    <div class="mix category-b category-c" data-order="3"></div>
    <div class="mix category-a category-d" data-order="4"></div>
</div>
```

By default, MixItUp will query the container for any elements matching the selector `'.mix'`, and index them as "targets".

Targets can be filtered using any valid selector string (e.g. `'.category-a'`), and are sorted via custom data attributes (e.g. `'data-order'`).

*NB: When structuring your markup, ensure that all target elements are adjacent siblings in your container.*

##### Using Attributes Over Classes

If you prefer to use classes exclusively for styling, HTML5 data attributes can be used as an alternative to the above and provide a separation of presentational and behavioral information in your markup. Simply configure MixItUp to query your targets via an attribute selector (e.g. `[data-ref="mix"]`), and filter accordingly (e.g. `[data-category~="a"]`). For example:

```html
<div class="my-container-styling-class" data-ref="container">
    <div class="my-target-styling-class" data-ref="mix" data-category="a" data-order="1"></div>
    <div class="my-target-styling-class" data-ref="mix" data-category="b" data-order="2"></div>
    <div class="my-target-styling-class" data-ref="mix" data-category="b c" data-order="3"></div>
    <div class="my-target-styling-class" data-ref="mix" data-category="a d" data-order="4"></div>
</div>
```

#### 2. Build Your Controls

Filtering and sorting happens when controls are clicked. You may use any clickable element as a control, but `<button type="button">` is recommended for accessibility and keyboard control.

Starting with MixItUp 3, it is expected (by default) that controls are within your container to prevent accidental interaction with other active MixItup instances in the DOM. You may want to keep your grid of target elements isolated from your controls at a block level. In such cases an additional wrapper element can be added around target elements:

```html
<div class="container">
    <div class="controls">
        <!-- controls here -->
    </div>

    <div class="grid">
        <!-- targets here -->
    </div>
</div>
```

If you wish to place your controls outside the container, or anywhere elsewhere in the DOM, simply change the `controls.scope` configuration option from `'local'` (default) to `'global'`, and MixItUp will query the entire document for controls.

##### Filter Controls

Filter controls are queried and bound by MixItUp based on the presence of a `data-filter` attribute, whose value must be a valid selector string (e.g. `'.category-a'`), or the values `'all'` or `'none'`;

```html
<button type="button" data-filter="all">All</button>
<button type="button" data-filter=".category-a">Category A</button>
<button type="button" data-filter=".category-b">Category B</button>
<button type="button" data-filter=".category-c">Category C</button>
```

For more information on MixItUp's full filtering functionality, see our [--website pending--]() tutorial.

##### Sort Controls

Sort controls are queried and bound based on the presence of a `data-sort` attribute, whose value takes the form of a "sort string" made up of the name of the attribute to sort by, followed by an optional colon-separated sorting order (e.g. `'order'`, `'order:asc'`, `'order:desc'`).

```html
    <button type="button" data-sort="order:asc">Ascending</button>
    <button type="button" data-sort="order:descending">Descending</button>
    <button type="button" data-sort="random">Random</button>
```

The values `'default'` and `'random'` are also valid, with `'default'` referring to the original order of target elements in the DOM at the time of mixer instantiation.

For more information on MixItUp's full sorting functionality, see our [--website pending--]() tutorial.

### 3. Loading the MixItUp JavaScript

Firstly, load the MixItUp library into your project. This can be done in a number of ways.

#### Script Tag

The most simple way to load MixItUp in your project is to include it via a `<script>` tag before the closing `</body>` tag on your page.

```html
        ...

        <script src="/path/to/mixitup.min.js"></script>
    </body>
</html>
```

With this technique, the MixItUp factory function will be made available via the global variable `mixitup`.

#### Module Loader

If you are building a modular JavaScript project with Webpack, Browserify, or RequireJS, MixItUp can be installed via your package manager of choice and imported into any of your project's modules with local scoping.

`npm install mixitup --save`

```js
// ES2015

import mixitup from 'mixitup';

// CommonJS

var mixitup = require('mixitup');

// AMD

require(['mixitup'], function(mixitup) {

});
```

### 4. Creating a Mixer

With the `mixitup` factory function loaded, you may now instantiate a "mixer" on your container to enable MixItUp functionality. Call the function passing a selector string or a reference to your container element as the first parameter.

```js
mixitup('.container');
```
> Instantiate a mixer on the element matching the selector `'.container'`

Your mixer is now ready to interact with, either via physical controls, or its API. Click a control or call an API method to see if everything is working correctly.

#### Configuration

If you wish to customize the functionality of your mixer, an optional "configuration object" can be passed as the second parameter to the `mixitup` function. If no configuration object is passed, the default settings will be used.

See the [Configuration Object](/docs/mixitup.Config.md) documentation for the full set of configuration options and defaults.

```js
mixitup('.container', {
    selectors: {
        target: '.blog-item'
    },
    animation: {
        duration: 300
    }
});
```
> Passing a configuration object as the second parameter

#### Using the API

If you wish to interact with your mixer via its API, the factory function creates and returns a reference to your mixer which can then be used to call API methods on.

```js
var containerEl = document.querySelector('.container');

var mixer = mixitup(containerEl);

mixer.filter('.category-a');
```

Starting from MixItUp 3, all targets start from their shown state and no loading animation occurs which is great for quickly progressively enhancing pre-rendered UI.

However, you may wish to have your targets start from hidden and feature a loading animation. Please see our [--website pending--]() tutorial for more information on different ways to initialise your mixer.
# MixItUp 3

[![Build Status](https://travis-ci.org/patrickkunka/mixitup.svg?branch=v3)](https://travis-ci.org/patrickkunka/mixitup)
[![Coverage Status](https://coveralls.io/repos/github/patrickkunka/mixitup/badge.svg?branch=v3)](https://coveralls.io/github/patrickkunka/mixitup?branch=v3)

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

- [HTML](#html)
- [CSS](#css)
- [JavaScript](#javascript)

Most commonly, MixItUp is applied to a **"container"** of **"target"** elements, which could be a portfolio of projects, a list of blog posts, a selection of products, or any kind of UI where filtering and/or sorting would be advantageous.

To get started, follow these few simple steps:

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

By default, MixItUp will query the container for targets matching the selector `'.mix'`, although any valid selector can be used via the `selectors.target` configuration option.

Targets can be filtered using any valid selector e.g. `'.category-a'`, and are sorted via optional custom data attributes e.g. `'data-order'`.

*NB: Other non-target elements may be included inside your container, but all targets must be adjacent siblings.*

#### 2. Build Your Controls

One way that filtering and sorting happens is when controls are clicked. You may use any clickable element as a control, but `<button type="button">` is recommended for accessibility.

##### Filter Controls

Filter controls are queried based on the presence of a `data-filter` attribute, whose value must be `'all'`, `'none'`, or a valid selector string e.g. `'.category-a'`.

```html
<button type="button" data-filter="all">All</button>
<button type="button" data-filter=".category-a">Category A</button>
<button type="button" data-filter=".category-b">Category B</button>
<button type="button" data-filter=".category-c">Category C</button>
```

For more information on MixItUp's full filtering functionality, see our [--website pending--]() tutorial.

##### Sort Controls

Sort controls are queried based on the presence of a `data-sort` attribute, whose value takes the form of a "sort string" made up of the name of the attribute to sort by, followed by an optional colon-separated sorting order e.g. `'order'`, `'order:asc'`, `'order:desc'`.

```html
<button type="button" data-sort="order:asc">Ascending</button>
<button type="button" data-sort="order:descending">Descending</button>
<button type="button" data-sort="random">Random</button>
```

The values `'default'` and `'random'` are also valid, with `'default'` referring to the original order of target elements in the DOM at the time of mixer instantiation.

For more information on MixItUp's full sorting functionality, see our [--website pending--]() tutorial.

##### Control Scoping

Starting with MixItUp 3, controls should be placed within your container (local scoping) to prevent accidental interaction with other active MixItUp instances in the DOM.

To keep your grid of target elements isolated from your controls and aid with styling, additional wrapper elements can be added to ringfence controls and target elements:

```html
<div class="container">
    <div class="controls">
        <!-- controls here -->
    </div>

    <div class="targets">
        <!-- targets here -->
    </div>
</div>
```
> Structuring your container

If you wish to place your controls outside the container simply change the `controls.scope` configuration option from `'local'` (default) to `'global'`, and MixItUp will query the entire document for controls.

### CSS

While MixItUp can be added on top of any existing CSS layout, we strongly recommend inline-block or flexbox-based styling over floats and legacy grid frameworks when dealing with grid-based designs for a number of reasons.

Find out more about MixItUp-compatible grid layouts [--website pending--]().

### JavaScript

#### 4. Load MixItUp

Firstly, load the MixItUp JavaScript library using the preferred method for your project.

##### Module Loader

If you are building a modular JavaScript project with Webpack, Browserify, or RequireJS, MixItUp can be installed using your package manager of choice (e.g. npm, jspm, yarn) and then imported into any of your project's modules.

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

##### Script Tag

The most simple way to load MixItUp in your project is to include it via a `<script>` tag before the closing `</body>` tag on your page.

```html
        ...

        <script src="/path/to/mixitup.min.js"></script>
    </body>
</html>
```

With this technique, the MixItUp factory function will be made available via the global variable `mixitup`.

#### 5. Create a Mixer

With the `mixitup` factory function loaded, you may now instantiate a "mixer" on your container to enable MixItUp functionality. Call the function passing a selector string or a reference to your container element as the first parameter.

```js
mixitup('.container');
```
> Instantiating a mixer

Your mixer is now ready for you to interact with, either via physical controls, or its API. Click a control or call an API method to check that everything is working correctly.

##### Custom Configuration

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

##### Using the API

If you wish to interact with your mixer via its API, the factory function creates and returns a reference to your mixer which can then be used to call API methods on.

```js
var containerEl = document.querySelector('.container');

var mixer = mixitup(containerEl);

mixer.filter('.category-a');
```
> Calling a mixer API method

*Building a JavaScript web application?* You may wish to use MixItUp 3's new "dataset" API. When using dataset, MixItUp acts purely as the "view" layer of your UI component allowing you to interact with it purely via your data model, and avoiding the DOM API entirely. For more information check out out [--website pending--]() tutorial.

##### Loading Animations

Starting from MixItUp 3, all targets start from their shown state and no loading animation occurs which is ideal for quickly progressively enhancing pre-rendered UI.

However, you may wish to have your targets start from hidden and feature a loading animation. Please see our [--website pending--]() tutorial for more information on different ways to initialise your mixer.

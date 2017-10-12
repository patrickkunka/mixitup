# MixItUp 3

[![Build Status](https://travis-ci.org/patrickkunka/mixitup.svg?branch=v3)](https://travis-ci.org/patrickkunka/mixitup)
[![Coverage Status](https://coveralls.io/repos/github/patrickkunka/mixitup/badge.svg?branch=v3)](https://coveralls.io/github/patrickkunka/mixitup?branch=v3)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/gh/patrickkunka/mixitup/badge?style=rounded)](https://www.jsdelivr.com/package/gh/patrickkunka/mixitup)

MixItUp is a high-performance, dependency-free library for animated DOM manipulation, giving you the power to filter, sort, add and remove DOM elements with beautiful animations.

MixItUp plays nice with your existing HTML and CSS, making it a great choice for responsive layouts and compatible with inline-flow, percentages, media queries, flexbox and more.

For a live sandbox, full documentation, tutorials and more, please visit [kunkalabs.com/mixitup](https://www.kunkalabs.com/mixitup/).

Migrating from MixItUp 2? Check out the [MixItUp 3 Migration Guide](./docs/mixitup-3-migration-guide.md).

#### Licensing

MixItUp is open source and free to use for non-commercial, educational and non-profit use. For use in commercial projects, **a commercial license is required**. For licensing information and FAQs please see the [MixItUp Licenses](https://www.kunkalabs.com/mixitup/licenses/) page.

#### Documentation

- [Factory Function](./docs/mixitup.md)
- [Configuration Object](./docs/mixitup.Config.md)
- [Mixer API Methods](./docs/mixitup.Mixer.md)
- [State Object](./docs/mixitup.State.md)
- [Mixer Events](./docs/mixitup.Events.md)

#### Browser Support

MixItUp 3 has been tested for compatibility with the following browsers.

- Chrome 16+
- Firefox 16+
- Safari 6.2+
- Yandex 14+
- Edge 13+
- IE 10+ (with animations), IE 8-9 (no animations)

## Getting Started

#### Contents

- [Building the Container](#building-the-container)
- [Building Controls](#building-controls)
- [Styling the Container](#styling-the-container)
- [Loading MixItUp](#loading-mixitup)
- [Creating a Mixer](#creating-a-mixer)
- [Configuration](#configuration)

Most commonly, MixItUp is applied to a **"container"** of **"target"** elements, which could be a portfolio of projects, a list of blog posts, a selection of products, or any kind of UI where filtering and/or sorting would be advantageous.

To get started, follow these simple steps:

### Building the Container

By default, MixItUp will query the container for targets matching the selector `'.mix'`.

```html
<div class="container">
    <div class="mix category-a" data-order="1"></div>
    <div class="mix category-b" data-order="2"></div>
    <div class="mix category-b category-c" data-order="3"></div>
    <div class="mix category-a category-d" data-order="4"></div>
</div>
```

Targets can be filtered using any valid selector e.g. `'.category-a'`, and are sorted via optional custom data attributes e.g. `'data-order'`.

Further reading: [Marking-up MixItUp Containers](https://www.kunkalabs.com/tutorials/marking-up-mixitup-containers/)

### Building Controls

One way that filtering and sorting happens is when controls are clicked. You may use any clickable element as a control, but `<button type="button">` is recommended for accessibility.

#### Filter Controls

Filter controls are queried based on the presence of a `data-filter` attribute, whose value must be `'all'`, `'none'`, or a valid selector string e.g. `'.category-a'`.

```html
<button type="button" data-filter="all">All</button>
<button type="button" data-filter=".category-a">Category A</button>
<button type="button" data-filter=".category-b">Category B</button>
<button type="button" data-filter=".category-c">Category C</button>
```

Further reading: [Filtering with MixItUp](https://www.kunkalabs.com/tutorials/filtering-with-mixitup/)

#### Sort Controls

Sort controls are queried based on the presence of a `data-sort` attribute, whose value takes the form of a "sort string" made up of the name of the attribute to sort by, followed by an optional colon-separated sorting order e.g. `'order'`, `'order:asc'`, `'order:desc'`.

```html
<button type="button" data-sort="order:asc">Ascending</button>
<button type="button" data-sort="order:descending">Descending</button>
<button type="button" data-sort="random">Random</button>
```

The values `'default'` and `'random'` are also valid, with `'default'` referring to the original order of target elements in the DOM at the time of mixer instantiation.

Further reading: [Sorting with MixItUp](https://www.kunkalabs.com/tutorials/sorting-with-mixitup/)

### Styling the Container

While MixItUp can be added on top of any existing CSS layout, we strongly recommend inline-block or flexbox-based styling over floats and legacy grid frameworks when dealing with grid-based designs for a number of reasons.

Further reading: [MixItUp Grid Layouts](https://www.kunkalabs.com/tutorials/mixitup-grid-layouts/)

### Loading MixItUp

Firstly, load the MixItUp JavaScript library using the preferred method for your project.

#### Script Tag

The most simple way to load MixItUp in your project is to include it via a `<script>` tag before the closing `</body>` tag on your page.

```html
        ...

        <script src="/path/to/mixitup.min.js"></script>
    </body>
</html>
```

With this technique, the MixItUp factory function will be made available via the global variable `mixitup`.

#### Module Import

If you are building a modular JavaScript project with Webpack, Browserify, or RequireJS, MixItUp can be installed using your package manager of choice (e.g. npm, jspm, yarn) and then imported into any of your project's modules.

`npm install mixitup --save`

```js
// ES2015

import mixitup from 'mixitup';
```

```js
// CommonJS

var mixitup = require('mixitup');
```

```js
// AMD

require(['mixitup'], function(mixitup) {

});
```

### Creating a Mixer

With the `mixitup()` factory function available, you may now instantiate a "mixer" on your container to enable MixItUp functionality.

Call the factory function passing a selector string or a reference to your container element as the first parameter, and a the newly instantiated mixer will be returned.

###### Example: Instantiating a mixer with a selector string

```js
var mixer = mixitup('.container');
```

###### Example: Instantiating a mixer with an element reference

```js
var mixer = mixitup(containerEl);
```

Your mixer is now ready for you to interact with, either via its controls (see above), or its API (see [Mixer API Methods](./docs/mixitup.Mixer.md)). Click a control or call an API method to check that everything is working correctly.

### Configuration

If you wish to customize the functionality of your mixer, an optional "configuration object" can be passed as the second parameter to the `mixitup` function. If no configuration object is passed, the default settings will be used.

Further reading: [Configuration Object](/docs/mixitup.Config.md)

###### Example: Passing a configuration object

```js
var mixer = mixitup(containerEl, {
    selectors: {
        target: '.blog-item'
    },
    animation: {
        duration: 300
    }
});
```

#### Using the API

If you wish to interact with your mixer via its API, the mixer reference returned by the factory function can be used to call API methods.

###### Example: Calling an API method

```js
var mixer = mixitup(containerEl);

mixer.filter('.category-a');
```

Further reading: [Mixer API Methods](./docs/mixitup.Mixer.md)

#### Building a modern JavaScript application?

You may wish to use MixItUp 3's new "dataset" API. Dataset is designed for use in API-driven JavaScript applications, and can be used instead of DOM-based methods such as `.filter()`, `.sort()`, `.insert()`, etc. When used, insertion, removal, sorting and pagination can be achieved purely via changes to your data model, without the uglyness of having to interact with or query the DOM directly.

Further reading: [Using the Dataset API](https://www.kunkalabs.com/tutorials/using-the-dataset-api/)

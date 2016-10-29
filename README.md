# MixItUp 3

MixItUp is a high-performance, dependency-free library for animated DOM manipulation. MixItUp gives you the power to filter, sort, add and remove DOM elements with beautiful animations — on top of native CSS layouts.

For full documentation, tutorials, and more please visit [--website pending--](pending).

#### Licensing

MixItUp is open source and free to use for non-commercial, educational and non-profit use. For use in commercial projects, a commercial license is required. For licensing information and FAQs please see [--website pending--](pending).

#### API Docs

- [Factory Function](./docs/mixitup.md)
- [Configuration Object](./docs/mixitup.Config.md)
- [Mixer API Methods](./docs/mixitup.Mixer.md)
- [Mixer Events](./docs/mixitup.Events.md)
- [State Object](./docs/mixitup.State.md)

## Getting Started

Most commonly, MixItUp is applied to a "container" of "target" elements, which can then be filtered, sorted, added and removed as needed.

To get started, firstly build and style your layout as desired, then add MixItUp to your project's JavaScript.

#### Contents

- [CSS](#css)
- [HTML](#html)
- [Loading the MixItUp JavaScript](#loading-the-mixitup-javascript)
- [Creating a Mixer](#creating-a-mixer)

### CSS

While MixItUp can be added on top of any existing CSS layout, we strongly recommend "inline-block" or "flex-box"-based styling over floats and legacy grid frameworks when dealing with grid-based designs for a number of reasons. Find out more about MixItUp-compatible grid layouts [--website pending--]().

### HTML

#### Container and Targets

When structuring your markup, ensure that all target elements are adjacent siblings in your container.

```html
<div class="container">
    <div class="mix category-1"></div>
    <div class="mix category-2"></div>
    <div class="mix category-2 category-3"></div>
    <div class="mix category-1 category-4"></div>
</div>
```

By default, MixItUp will query the container for any elements matching the selector `.mix`, and index them as "targets", although you configure MixItUp to query targets via any valid selector using the `selectors.target` configuration option.

Aditional classes or attributes on your targets may then be used to filter those matching a valid selector string (e.g. `.category-a`).

Data attributes can be added to target elements to enable sorting:

```html
<div class="container">
    <div class="mix category-a" data-order="1"></div>
    <div class="mix category-b" data-order="2"></div>
    <div class="mix category-b category-c" data-order="3"></div>
    <div class="mix category-a category-d" data-order="4"></div>
</div>
```

If you prefer to use the `class` attribute exclusively for styling, HTML5 data attributes can be used as an alternative to the above and provide a seperation of presentational and behavioral information in your markup:

```html
<div class="my-container-styling-class" data-ref="container">
    <div class="my-target-styling-class" data-ref="mix" data-category="a" data-order="1"></div>
    <div class="my-target-styling-class" data-ref="mix" data-category="b" data-order="2"></div>
    <div class="my-target-styling-class" data-ref="mix" data-category="b c" data-order="3"></div>
    <div class="my-target-styling-class" data-ref="mix" data-category="a d" data-order="4"></div>
</div>
```

Simply configure MixItUp to query your targets via an attribute selector (e.g. `[data-ref="mix"]`), and filter accordingly (e.g. `[data-category~="a"]`).

#### Filtering and Sorting Controls

You can perform filtering and sorting of target elements via "control" elements within in your container.

Filter controls are queried and bound by MixItUp based on the presence of a `data-filter` attribute, whose value must be a valid selector string (e.g. `'.category-a'`), or the values `'all'` or `'none'`;

```html
<div class="controls">
    <button type="button" data-filter="all">All</button>
    <button type="button" data-filter=".category-a">Category A</button>
    <button type="button" data-filter=".category-b">Category B</button>
    <button type="button" data-filter=".category-c">Category C</button>
</div>
```

Sort controls are queried and bound based on the presence of a `data-sort` attribute, whose value must a valid sort string made up of the name of the attribute to sort by, followed by an optional sorting order (e.g. `'order'`, `'order:asc'`, `'order:desc'`).

```html
<div class="controls">
    <button type="button" data-sort="order:asc">Ascending</button>
    <button type="button" data-sort="order:descending">Descending</button>
    <button type="button" data-sort="random">Random</button>
</div>
```

The values `'default'` and `'random'` are also valid, with `'default'` referring to the original order of target elements in the DOM at the time of mixer instantiation.

#### Multi-attribute Sorting

Multiple space-seperated sort strings can be used to sort elements by two or more attributes. For example, to sort elements first by the value of `data-publish-date` and then by the value of `data-sort-date`, you could do the following:

```html
<button type="button" data-sort="publish-date:descending edited-date:descending">Publish date / Descending</button>
```

For more information on MixItUp's full sorting functionality, see our [--website pending--]() tutorial.

Simulataneous Filtering and Sorting (Multimix Controls)

Starting with MixItUp 3, controls can be used for simulataneous filtering and sorting (as per the `.multimix()` API method) by including both `data-filter` and `data-sort` attributes:

``` html
<button type="button" data-filter=".category-a" data-sort="default:asc">Category A / Ascending</button>
```

#### Toggle Controls

Also new with MixItUp 3, is the ability to define filter "toggle" controls via markup (rather than configuration), by using `data-toggle` attributes instead of `data-filter`. The toggling behavior (`'and'` or `'or'`) must still be defined via the configuration object).

```html
<div class="controls">
    <button type="button" data-toggle=".category-a">Category A</button>
    <button type="button" data-toggle=".category-b">Category B</button>
    <button type="button" data-toggle=".category-c">Category C</button>
</div>
```

For more information on MixItUp's full filtering functionality, see our [--website pending--]() tutorial.

### Loading the MixItUp JavaScript

Firstly, load the MixItUp library into your project. This can be done in a number of ways.

#### Script Tag

The most simple way to load MixItUp in your project is to include it via a `<script>` tag before the closing `</body>` tag on your page.

```html
        ...

        <script src="/path/to/mixitup.min.js"></script>
    </body>
</html>
```

With this technique, the MixItUp factory function will be made available via the global variable `mixitup` in your project.

#### Module Loader

If you are building a modular JavaScript project with webpack, browserify, or requirejs, MixItUp can be installed via your package manager of choice and imported into any of your project's modules with local scoping.

`npm install mixitup --save`

##### ES2015

```js
import mixitup from 'mixitup';
```

##### CommonJS

```js
var mixitup = require('mixitup');
```

##### AMD

```js
require(['mixitup'], function(mixitup) {

});
```

### Creating a Mixer

With the `mixitup` factory function loaded, you may now instantiate a "mixer" on your container to enable MixItUp functionality.

```js
var containerEl = document.querySelector('.container');

var mixer = mixitup(containerEl);
```

To create a mixer, call the `mixitup` factory function passing a reference to your container element as the first parameter. A mixer instance will be created and returned, which can then be used to interact with the mixer via its API if needed.

*NB: If you intend only to control MixItUp via physical DOM controls, you may not need the mixer reference, and can call mixitup() as a void.*

If you wish to customize the functionality of your mixer, an optional "configuration object" can be passed as the second parameter to the factory function. If no configuration object is passed, the default settings will be used.

See the [Configuration Object](/docs/mixitup.Config.md) documentation for the full set of configuration options and defaults.

```js
var mixer = mixitup(containerEl, {
    selectors: {
        target: '.blog-item'
    }
});
```

Your mixer is now ready to interact with, either via physical DOM controls, or its API. See the [Mixer API](./docs/mixitup.Mixer.md) documentation for the full set of public API methods.
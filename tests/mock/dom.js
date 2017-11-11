'use strict';

require('jsdom-global')();

const renderElement = (html) => {
    const temp = document.createElement('div');

    temp.innerHTML = html;

    return temp.firstElementChild;
};

module.exports = {
    getContainer() {
        return renderElement('<div class="mixitup-container" data-ref="container">' +
            '<div id="target-1" class="mix category-a" data-ref="mix" data-category="a" data-published="20161102" data-views="100"></div> ' +
            '<div id="target-2" class="mix category-a" data-ref="mix" data-category="a" data-published="20130501" data-views="54"></div> ' +
            '<div id="target-3" class="mix category-b" data-ref="mix" data-category="b" data-published="20121231" data-views="3"></div> ' +
            '<div id="target-4" class="mix category-b" data-ref="mix" data-category="b" data-published="20160407" data-views="62"></div> ' +
            '<div id="target-5" class="mix category-c" data-ref="mix" data-category="c" data-published="20160820" data-views="54"></div> ' +
            '<div id="target-6" class="mix category-a category-c" data-ref="mix" data-category="a c" data-published="20151020" data-views="95"></div>' +
            '<span class="mixitup-container-gap></span>' +
        '</div>');
    },

    getTarget() {
        return renderElement('<div id="7" class="mix category-d" data-ref="mix" data-category="d" data-published="20161222" data-views="132"></div>');
    },

    getEmptyContainer() {
        return renderElement('<div class="container" data-ref="container"></div>');
    },

    getFilterControls() {
        return renderElement('<div class="mixitup-controls">' +
            '<div class="mixitup-control" data-filter="all">All</div> ' +
            '<div class="mixitup-control" data-filter="none">None</div> ' +
            '<div class="mixitup-control" data-filter=".category-a">Category A</div> ' +
            '<div class="mixitup-control" data-filter=".category-b">Category B</div> ' +
            '<div class="mixitup-control" data-filter=".category-c">Category C</div> ' +
            '<div class="mixitup-control" data-filter=".category-d">Category D</div> ' +
            '<div class="mixitup-control" data-filter=".category-a, .category-b">Category A OR B</div> ' +
            '<div class="mixitup-control" data-filter=".category-a.category-c">Category A AND C</div> ' +
            '<div class="mixitup-control mixitup_control__attr-a" data-filter=\'[data-category="a"]\'>Category A (attribute)</div> ' +
            '<div class="mixitup-control mixitup_control__attr-a-or-b" data-filter=\'[data-category="a"], [data-category="b"]\'>Category A OR B (attribute)</div> ' +
            '<div class="mixitup-control mixitup_control__attr-a-and-c" data-filter=\'[data-category="a"][data-category="c"]\'>Category A AND C (attribute)</div> ' +
            '<div class="mixitup-control" data-toggle=".category-a">Category A</div> ' +
            '<div class="mixitup-control" data-toggle=".category-b">Category B</div> ' +
            '<div class="mixitup-control" data-toggle=".category-c">Category C</div> ' +
        '</div>');
    },

    getFilterControl() {
        return renderElement('<div class="mixitup-control" data-filter=".category-d">Category D</div>');
    },

    getToggleControl() {
        return renderElement('<div class="mixitup-control" data-toggle=".category-b">Category B</div>');
    },

    getSortControl() {
        return renderElement('<div class="mixitup-control" data-sort="views:desc published:asc">Views (desc) Published (asc)</div>');
    },

    getSortControls() {
        return renderElement('<div class="mixitup-controls">' +
            '<div class="mixitup-control" data-sort="default">Default</div> ' +
            '<div class="mixitup-control" data-sort="default:asc">Default Ascending</div> ' +
            '<div class="mixitup-control" data-sort="default:desc">Default Descending</div> ' +
            '<div class="mixitup-control" data-sort="random">Random</div> ' +
            '<div class="mixitup-control" data-sort="published">Published Date</div> ' +
            '<div class="mixitup-control" data-sort="views">Views</div> ' +
            '<div class="mixitup-control" data-sort="published:asc views:desc">Published (asc) Views (desc)</div> ' +
        '</div>');
    },

    getMultimixControls() {
        return renderElement('<div class="mixitup-controls">' +
            '<div class="mixitup-control" data-filter="all" data-sort="default:asc">All / Default</div> ' +
            '<div class="mixitup-control" data-filter=".category-b" data-sort="published">Category B / Published</div> ' +
        '</div>');
    },

    getTotalWhitespace(html) {
        let re = /[>? ]( )[<? ]/g;
        let totalWhitespace = 0;
        let matches;

        while (matches = re.exec(html)) {
            totalWhitespace++;
        }

        return totalWhitespace;
    },

    Item: class Item {
        constructor(data) {
            this.id         = typeof data !== 'undefined' ? data.id : undefined;
            this.categories = Array.prototype.slice.call(data.categories) || [];
            this.published  = typeof data.published === 'string' ? data.published : '';
            this.views      = typeof data.views === 'number' ? data.views : 0;

            Object.seal(this);
        }

        get classList() {
            return 'mix ' + this.categories.map(category => 'category-' + category).join(' ');
        }

        get categoryList() {
            return this.categories.join(' ');
        }
    },

    ITEM_TEMPLATE: '<div id="${id}" class="${classList}" data-ref="mix" data-category="${categoryList}" data-published="${published}" data-views="${views}"></div>',

    ITEM_TEMPLATE_ALT: '<div id="${id}"></div>'
};
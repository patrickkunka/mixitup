'use strict';

require('jsdom-global')();

const renderElement = (html) => {
    const temp = document.createElement('div');

    temp.innerHTML = html;

    return temp.firstElementChild;
};

module.exports = {
    getContainer() {
        return renderElement('<div class="container" data-ref="container">' +
            '<div id="1" class="mix category-a" data-ref="mix" data-category="a" data-published="20161102"></div> ' +
            '<div id="2" class="mix category-a" data-ref="mix" data-category="a" data-published="20130501"></div> ' +
            '<div id="3" class="mix category-b" data-ref="mix" data-category="b" data-published="20121231"></div> ' +
            '<div id="4" class="mix category-b" data-ref="mix" data-category="b" data-published="20160407"></div> ' +
            '<div id="5" class="mix category-c" data-ref="mix" data-category="c" data-published="20160820"></div> ' +
            '<div id="6" class="mix category-a category-c" data-ref="mix" data-category="a c" data-published="20151020"></div>' +
        '</div>');
    },

    getEmptyContainer() {
        return renderElement('<div class="container" data-ref="container"></div>');
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
            this.id = typeof data !== 'undefined' ? data.id : undefined;
            this.categories = Array.prototype.slice.call(data.categories) || [];
        }

        get categoryClassList() {
            return this.categories.map(category => 'category-' + category).join(' ');
        }

        get categoryList() {
            return this.categories.join(' ');
        }
    },

    ITEM_TEMPLATE: '<div id="${id}" class="mix ${categoryClassList}" data-ref="mix" data-category="${categoryList}"></div>'
};
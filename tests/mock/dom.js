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
            '<div id="1" class="mix category-a" data-ref="mix" data-category="a" data-published="20161102" data-views="100"></div> ' +
            '<div id="2" class="mix category-a" data-ref="mix" data-category="a" data-published="20130501" data-views="54"></div> ' +
            '<div id="3" class="mix category-b" data-ref="mix" data-category="b" data-published="20121231" data-views="3"></div> ' +
            '<div id="4" class="mix category-b" data-ref="mix" data-category="b" data-published="20160407" data-views="62"></div> ' +
            '<div id="5" class="mix category-c" data-ref="mix" data-category="c" data-published="20160820" data-views="54"></div> ' +
            '<div id="6" class="mix category-a category-c" data-ref="mix" data-category="a c" data-published="20151020" data-views="95"></div>' +
            '<span class="container_gap></span>' +
        '</div>');
    },

    getTarget() {
        return renderElement('<div id="7" class="mix category-d" data-ref="mix" data-category="d" data-published="20161222" data-views="132"></div>');
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

    ITEM_TEMPLATE: '<div id="${id}" class="${classList}" data-ref="mix" data-category="${categoryList}" data-published="${published}" data-views="${views}"></div>'
};
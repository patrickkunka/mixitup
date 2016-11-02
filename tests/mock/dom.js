require('jsdom-global')();

const renderElement = (html) => {
    const temp = document.createElement('div');

    temp.innerHTML = html;

    return temp.firstElementChild;
};

module.exports = {
    getContainer() {
        return renderElement('<div class="container" data-ref="container">' +
            '<div id="1" class="mix category-a" data-ref="mix" data-category="a"></div> ' +
            '<div id="2" class="mix category-a" data-ref="mix" data-category="a"></div> ' +
            '<div id="3" class="mix category-b" data-ref="mix" data-category="b"></div> ' +
            '<div id="4" class="mix category-b" data-ref="mix" data-category="b"></div> ' +
            '<div id="5" class="mix category-c" data-ref="mix" data-category="c"></div> ' +
            '<div id="6" class="mix category-a category-c" data-ref="mix" data-category="a c"></div>' +
        '</div>');
    },

    getEmptyContainer() {
        return renderElement('<div class="container" data-ref="container"></div>');
    }
};
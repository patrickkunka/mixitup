var jsdom = require('jsdom-global');

jsdom();

var renderElement = function(html) {
    var temp = document.createElement('div');

    temp.innerHTML = html;

    return temp.firstElementChild;
};

var getContainer = function() {
    return renderElement('<div class="container" data-ref="container">' +
        '<div class="mix category-a" data-ref="mix" data-category="a"></div> ' +
        '<div class="mix category-a" data-ref="mix" data-category="a"></div> ' +
        '<div class="mix category-b" data-ref="mix" data-category="b"></div> ' +
        '<div class="mix category-b" data-ref="mix" data-category="b"></div> ' +
        '<div class="mix category-c" data-ref="mix" data-category="c"></div> ' +
        '<div class="mix category-a category-c" data-ref="mix" data-category="a c"></div> ' +
    '</div>');
};

var getEmptyContainer = function() {
    return renderElement('<div class="container" data-ref="container"></div>');
};

module.exports = {
    getContainer: getContainer,
    getEmptyContainer: getEmptyContainer
};
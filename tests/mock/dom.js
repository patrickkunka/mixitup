var jsdom = require('jsdom-global');

jsdom();

var getContainer = function() {
    var html = '<div class="container" data-ref="container">' +
        '<div class="mix category-1" data-ref="mix" data-category="1"></div> ' +
        '<div class="mix category-1" data-ref="mix" data-category="1"></div> ' +
        '<div class="mix category-2" data-ref="mix" data-category="2"></div> ' +
        '<div class="mix category-2" data-ref="mix" data-category="2"></div> ' +
        '<div class="mix category-3" data-ref="mix" data-category="3"></div> ' +
        '<div class="mix category-1 category-3" data-ref="mix" data-category="1 3"></div> ' +
    '</div>';

    var temp = document.createElement('div');

    temp.innerHTML = html;

    return temp.firstElementChild;
};

module.exports = {
    getContainer: getContainer
};
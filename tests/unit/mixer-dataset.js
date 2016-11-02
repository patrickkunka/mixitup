require('jsdom-global')();

var chai    = require('chai');
var dom     = require('../mock/dom');
var mixitup = require('../../dist/mixitup.js');
var dataset = require('../mock/dataset');

var ITEM_TEMPLATE = '<div id="${id}" class="mix ${categoryClassList}" data-ref="mix" data-category="${categoryList}"></div>';

var Item = function(data) {
    this.id         = data.id || '';
    this.categories = Array.prototype.slice.call(data.categories) || [];

    Object.assign(this, {
        categoryClassList: {
            get: function() {
                return this.categories.map(function(category) {
                    return 'category-' + category;
                }).join(' ');
            }
        },
        categoryList: {
            get: function() {
                return this.categories.join(' ');
            }
        }
    });
};

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

dataset = dataset.map(function(data) {
    return new Item(data);
});

describe('mixitup()', function() {
    it('should throw an error if `load.dataset` does not match pre-rendered targets', function() {
        var emptyContainer = dom.getEmptyContainer();

        chai.assert.throws(function() {
            mixitup(emptyContainer, {
                load: {
                    dataset: dataset
                }
            });
        }, mixitup.messages.ERROR_DATASET_PRERENDERED_MISMATCH());
    });

    it('should throw an error if UID not provided in dataset API mode', function() {
        var container = dom.getContainer();

        chai.assert.throws(function() {
            mixitup(container, {
                load: {
                    dataset: dataset
                }
            });
        }, mixitup.messages.ERROR_CONFIG_DATA_UID_NOT_SET());
    });

    it('should instantiate in dataset API mode when provided with `load.dataset` and a matching container', function() {
        var container = dom.getContainer();
        var targets = Array.prototype.slice.call(container.children);

        var mixer = mixitup(container, {
            data: {
                uid: 'id'
            },
            render: {
                target: mixitup.h.template(ITEM_TEMPLATE)
            },
            load: {
                dataset: dataset
            }
        });

        var state = mixer.getState();

        chai.assert.equal(state.activeFilter, null);
        chai.assert.equal(state.activeSort, null);
        chai.assert.deepEqual(state.activeDataset, dataset);
        chai.assert.deepEqual(state.targets, targets);
        chai.assert.deepEqual(state.show, targets);
        chai.assert.deepEqual(state.matching, []);
    });
});
'use strict';

require('jsdom-global')();

const chai    = require('chai');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

let dataset = require('../mock/dataset');

const ITEM_TEMPLATE = '<div id="${id}" class="mix ${categoryClassList}" data-ref="mix" data-category="${categoryList}"></div>';

class Item {
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
}

function getTotalWhitespace(html) {
    let re = /[>? ]( )[<? ]/g;
    let totalWhitespace = 0;
    let matches;

    while (matches = re.exec(html)) {
        totalWhitespace++;
    }

    return totalWhitespace;
}

dataset = dataset.map(data => new Item(data));

describe('mixitup()', () => {
    it('should throw an error if `load.dataset` does not match pre-rendered targets', () => {
        let emptyContainer = dom.getEmptyContainer();

        chai.assert.throws(() => {
            mixitup(emptyContainer, {
                load: {
                    dataset: dataset
                }
            });
        }, mixitup.messages.ERROR_DATASET_PRERENDERED_MISMATCH());
    });

    it('should throw an error if UID not provided in dataset API mode', () => {
        let container = dom.getContainer();

        chai.assert.throws(() => {
            mixitup(container, {
                load: {
                    dataset: dataset
                }
            });
        }, mixitup.messages.ERROR_CONFIG_DATA_UID_NOT_SET());
    });

    it('should instantiate in dataset API mode when provided with `load.dataset` and a matching container', () => {
        let container = dom.getContainer();
        let targets = Array.prototype.slice.call(container.children);

        let mixer = mixitup(container, {
            data: {
                uid: 'id'
            },
            load: {
                dataset: dataset
            }
        });

        let state = mixer.getState();

        chai.assert.equal(state.activeFilter, null);
        chai.assert.equal(state.activeSort, null);
        chai.assert.deepEqual(state.activeDataset, dataset);
        chai.assert.deepEqual(state.targets, targets);
        chai.assert.deepEqual(state.show, targets);
        chai.assert.deepEqual(state.matching, []);
    });
});

describe('mixitup.Mixer', () => {
    describe('#dataset()', () => {
        let container = dom.getContainer();
        let workingDataset = dataset.slice();
        let config = {
            data: {
                uid: 'id'
            },
            render: {
                target: mixitup.h.template(ITEM_TEMPLATE)
            },
            load: {
                dataset: dataset
            }
        };

        let mixer = mixitup(container, config);

        let startTotalWhitespace = getTotalWhitespace(container.outerHTML);

        it('should throw an error if an item is added to the dataset, without a render function defined', () => {
            let newDataset = dataset.slice();
            let container = dom.getContainer();
            let erMixer = mixitup(container, {
                data: {
                    uid: 'id'
                },
                load: {
                    dataset: dataset
                }
            });

            newDataset.push(new Item({
                id: 99,
                categories: ['d']
            }));

            chai.assert.throws(() => {
                erMixer.dataset(newDataset);
            }, mixitup.messages.ERROR_DATASET_RENDERER_NOT_SET());
        });

        it('should throw an error if an item is added to the dataset without a valid UID', () => {
            let newDataset = dataset.slice();
            let container = dom.getContainer();

            let erMixer = mixitup(container, config);

            newDataset.push(new Item({
                categories: ['d']
            }));

            chai.assert.throws(() => {
                erMixer.dataset(newDataset);
            }, mixitup.messages.ERROR_DATASET_INVALID_UID({
                uid: 'id'
            }));
        });

        it('should throw an error if an item with a duplicate UID is added to the dataset', () => {
            let newDataset = dataset.slice();
            let container = dom.getContainer();

            let erMixer = mixitup(container, config);

            newDataset.push(new Item({
                id: 1,
                categories: ['d']
            }));

            chai.assert.throws(() => {
                erMixer.dataset(newDataset);
            }, mixitup.messages.ERROR_DATASET_DUPLICATE_UID({
                uid: '1'
            }));
        });

        it('should insert a target when a new item is added to end of the dataset', () => {
            workingDataset.push(new Item({
                id: 7,
                categories: ['d']
            }));

            return mixer.dataset(workingDataset)
                .then((state) => {
                    chai.assert.equal(state.totalShow, 7);
                    chai.assert.equal(state.show[6].id, '7');
                    chai.assert.isOk(state.show[6].matches('.category-d'));
                });
        });

        it('should insert a target when a new item is added to the start of the dataset', () => {
            workingDataset.unshift(new Item({
                id: 0,
                categories: ['d']
            }));

            return mixer.dataset(workingDataset)
                .then((state) => {
                    chai.assert.equal(state.totalShow, 8);
                    chai.assert.equal(state.show[0].id, '0');
                    chai.assert.isOk(state.show[0].matches('.category-d'));
                });
        });

        it('should insert a target when a new item is added at an arbitrary point in the dataset', () => {
            workingDataset.splice(3, 0, new Item({
                id: 999,
                categories: ['d']
            }));

            return mixer.dataset(workingDataset)
                .then((state) => {
                    chai.assert.equal(state.totalShow, 9);
                    chai.assert.equal(state.show[3].id, '999');
                    chai.assert.isOk(state.show[3].matches('.category-d'));
                });
        });

        it('should remove a target when an item is removed from the end of the dataset', () => {
            workingDataset.pop();

            return mixer.dataset(workingDataset)
                .then((state) => {
                    chai.assert.equal(state.totalShow, 8);
                    chai.assert.notEqual(state.show[7].id, '7');
                });
        });

        it('should remove a target when an item is removed from the start of the dataset', () => {
            workingDataset.shift();

            return mixer.dataset(workingDataset)
                .then((state) => {
                    chai.assert.equal(state.totalShow, 7);
                    chai.assert.notEqual(state.show[0].id, '0');
                });
        });

        it('should remove a target when an item is removed from an arbitary point in the dataset', () => {
            let removed = workingDataset.splice(2, 1);

            chai.assert.equal(removed[0].id, 999);

            return mixer.dataset(workingDataset)
                .then((state) => {
                    chai.assert.equal(state.totalShow, 6);
                    chai.assert.notEqual(state.show[2].id, '999');
                });
        });

        it('should sort targets when the dataset is sorted', () => {
            workingDataset.reverse();

            let ids = workingDataset.map((item) => item.id.toString());

            return mixer.dataset(workingDataset)
                .then((state) => {
                    let elIds = state.show.map((el) => el.id);

                    chai.assert.equal(state.totalShow, 6);
                    chai.assert.deepEqual(ids, elIds);
                });
        });

        it('should not insert excessive whitespace after DOM manipulations', () => {
            chai.assert.equal(getTotalWhitespace(container.outerHTML), startTotalWhitespace);
        });
    });
});
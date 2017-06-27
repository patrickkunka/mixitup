'use strict';

require('jsdom-global')();

const chai          = require('chai');
const dom           = require('../mock/dom');
const mixitup       = require('../../dist/mixitup.js');
const JSONDataset   = require('../mock/dataset');

const dataset       = JSONDataset.map(data => new dom.Item(data));

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('mixitup()', () => {
    it('should throw an error if `load.dataset` does not match pre-rendered targets', () => {
        const emptyContainer = dom.getEmptyContainer();

        chai.assert.throws(() => {
            mixitup(emptyContainer, {
                load: {
                    dataset: dataset
                }
            });
        }, mixitup.messages.errorDatasetPrerenderedMismatch());
    });

    it('should throw an error if UID not provided in dataset API mode', () => {
        const container = dom.getContainer();
        let mixer;

        chai.assert.throws(() => {
            mixer = mixitup(container, {
                load: {
                    dataset: dataset
                }
            });
        }, mixitup.messages.errorConfigDataUidKeyNotSet());
    });

    it('should instantiate in dataset API mode when provided with `load.dataset` and a matching container', () => {
        const container = dom.getContainer();
        const targets = Array.prototype.slice.call(container.children);

        const mixer = mixitup(container, {
            data: {
                uidKey: 'id'
            },
            load: {
                dataset: dataset
            }
        });

        const state = mixer.getState();

        chai.assert.equal(state.activeFilter, null);
        chai.assert.equal(state.activeSort, null);
        chai.assert.deepEqual(state.activeDataset, dataset);
        chai.assert.deepEqual(state.targets, targets);
        chai.assert.deepEqual(state.show, targets);
        chai.assert.deepEqual(state.matching, []);

        mixer.destroy();
    });
});

describe('mixitup.Mixer', () => {
    describe('#dataset()', () => {
        const container = dom.getContainer();
        const workingDataset = dataset.slice();
        const config = {
            data: {
                uidKey: 'id',
                dirtyCheck: true
            },
            render: {
                target: mixitup.h.template(dom.ITEM_TEMPLATE)
            },
            load: {
                dataset: dataset
            }
        };

        const mixer = mixitup(container, config);

        const startTotalWhitespace = dom.getTotalWhitespace(container.outerHTML);

        after(() => mixer.destroy());

        it('should throw an error if an item is added to the dataset, without a render function defined', () => {
            const newDataset = dataset.slice();
            const container = dom.getContainer();
            const erMixer = mixitup(container, {
                data: {
                    uidKey: 'id'
                },
                load: {
                    dataset: dataset
                }
            });

            newDataset.push(new dom.Item({
                id: 99,
                categories: ['d']
            }));

            chai.assert.throws(() => {
                erMixer.dataset(newDataset);
            }, mixitup.messages.errorDatasetRendererNotSet());
        });

        it('should throw an error if an item is added to the dataset without a valid UID', () => {
            const newDataset = dataset.slice();
            const container = dom.getContainer();

            const erMixer = mixitup(container, config);

            newDataset.push(new dom.Item({
                categories: ['d']
            }));

            chai.assert.throws(() => {
                erMixer.dataset(newDataset);
            }, mixitup.messages.errorDatasetInvalidUidKey({
                uidKey: 'id'
            }));
        });

        it('should throw an error if an item with a duplicate UID is added to the dataset', () => {
            const newDataset = dataset.slice();
            const container = dom.getContainer();

            const erMixer = mixitup(container, config);

            newDataset.push(new dom.Item({
                id: 'target-1',
                categories: ['d']
            }));

            chai.assert.throws(() => {
                erMixer.dataset(newDataset);
            }, mixitup.messages.errorDatasetDuplicateUid({
                uid: 'target-1'
            }));
        });

        it('should insert a target when a new item is added to end of the dataset', () => {
            workingDataset.push(new dom.Item({
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
            workingDataset.unshift(new dom.Item({
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
            workingDataset.splice(3, 0, new dom.Item({
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
            const removed = workingDataset.splice(2, 1);

            chai.assert.equal(removed[0].id, 999);

            return mixer.dataset(workingDataset)
                .then((state) => {
                    chai.assert.equal(state.totalShow, 6);
                    chai.assert.notEqual(state.show[2].id, '999');
                });
        });

        it('should sort targets when the dataset is sorted', () => {
            workingDataset.reverse();

            const ids = workingDataset.map((item) => item.id.toString());

            return mixer.dataset(workingDataset)
                .then((state) => {
                    const elIds = state.show.map((el) => el.id);

                    chai.assert.equal(state.totalShow, 6);
                    chai.assert.deepEqual(ids, elIds);
                });
        });

        it('should sort rerender targets if their data changes and dirtyChecking is enabled', () => {
            workingDataset[0] = new dom.Item(Object.assign({}, workingDataset[0]));

            workingDataset[0].categories.push('z');

            return mixer.dataset(workingDataset)
                .then((state) => {
                    chai.assert.isOk(state.show[0].matches('.category-z'));
                });
        });

        it('should not insert excessive whitespace after DOM manipulations', () => {
            chai.assert.equal(dom.getTotalWhitespace(container.outerHTML), startTotalWhitespace);
        });

        it('should accept a callback function which is invoked after dataset change', () => {
            workingDataset.reverse();

            const ids = workingDataset.map((item) => item.id.toString());

            const promise = new Promise(resolve => mixer.dataset(workingDataset, resolve));

            chai.assert.isFulfilled(promise);

            return promise
                .then((state) => {
                    const elIds = state.show.map((el) => el.id);

                    chai.assert.equal(state.totalShow, 6);
                    chai.assert.deepEqual(ids, elIds);
                });
        });

        it('should accept a boolean allowing toggling off of animation', () => {
            workingDataset.reverse();

            const ids = workingDataset.map((item) => item.id.toString());

            return mixer.dataset(workingDataset, false)
                .then(state => {
                    const elIds = state.show.map((el) => el.id);

                    chai.assert.equal(state.totalShow, 6);
                    chai.assert.deepEqual(ids, elIds);
                });
        });

        it('should re-render targets reflective of template changes when `forceRender` is called', () => {
            let firstTarget = mixer.getState().show[0];

            chai.assert.equal(firstTarget.outerHTML, '<div id="target-6" class="mix category-a category-c category-z" data-ref="mix" data-category="a c z" data-published="20151020" data-views="95"></div>');

            mixer.configure({
                render: {
                    target: mixitup.h.template(dom.ITEM_TEMPLATE_ALT)
                }
            });


            mixer.forceRender();

            firstTarget = mixer.getState().show[0];

            chai.assert.equal(firstTarget.outerHTML, '<div id="target-6"></div>');
        });
    });
});
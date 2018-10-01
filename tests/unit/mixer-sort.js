'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const dataset = require('../mock/dataset');
const mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('mixitup.Mixer', () => {
    describe('#sort()', () => {
        const container = dom.getContainer();
        const originalOrder = Array.prototype.slice.call(container.children);
        const mixer = mixitup(container);

        const idsByPublishedDate = dataset.slice().sort((a, b) => {
            const dateA = a.published;
            const dateB = b.published;

            if (dateA < dateB) {
                return -1;
            }

            if (dateA > dateB) {
                return 1;
            }

            return 0;
        }).map(item => item.id.toString());

        const idsByViewsThenPublishedDate = dataset.slice().sort((a, b) => {
            const viewsA = a.views;
            const viewsB = b.views;

            const sortByPublishedDate = function(a, b) {
                const dateA = a.published;
                const dateB = b.published;

                if (dateA < dateB) {
                    return -1;
                }

                if (dateA > dateB) {
                    return 1;
                }

                return 0;
            };

            if (viewsA < viewsB) {
                return -1;
            }

            if (viewsA > viewsB) {
                return 1;
            }

            sortByPublishedDate(a, b);
        }).map(item => item.id.toString());

        after(() => mixer.destroy());

        it('accepts `default` as a sort string, but should have no effect on the order', () => {
            var startOrder = mixer.getState().show;

            return mixer.sort('default')
                .then(state => {
                    chai.assert.deepEqual(startOrder, state.show);
                    chai.assert.equal(state.activeSort.sortString, 'default');
                    chai.assert.equal(state.activeSort.order, 'asc');
                    chai.assert.equal(state.activeSort.attribute, '');
                });
        });

        it('accepts `default:asc` as a sort string, but should have no effect on the order', () => {
            var startOrder = mixer.getState().show;

            return mixer.sort('default:asc')
                .then(state => {
                    chai.assert.deepEqual(startOrder, state.show);
                    chai.assert.equal(state.activeSort.sortString, 'default:asc');
                    chai.assert.equal(state.activeSort.order, 'asc');
                    chai.assert.equal(state.activeSort.attribute, '');
                });
        });

        it('accepts `default:desc` as a sort string, which should reverse the order', () => {
            var reversedOrder = mixer.getState().show.slice().reverse();

            return mixer.sort('default:desc')
                .then(state => {
                    chai.assert.deepEqual(state.show, reversedOrder);
                    chai.assert.equal(state.activeSort.sortString, 'default:desc');
                    chai.assert.equal(state.activeSort.order, 'desc');
                    chai.assert.equal(state.activeSort.attribute, '');
                });
        });

        it('should return the mixer to its original order if sorted by `default` after previous transformations', () => {
            return mixer.sort('default')
                .then(state => chai.assert.deepEqual(state.show, originalOrder));
        });

        it('should accept `random` as a sort string, shuffling the targets', () => {
            return mixer.sort('random')
                .then(state => {
                    chai.assert.notDeepEqual(state.show, originalOrder);
                    chai.assert.equal(state.activeSort.sortString, 'random');
                    chai.assert.equal(state.activeSort.order, 'random');
                    chai.assert.equal(state.activeSort.attribute, '');
                });
        });

        it('should accept a data-attribute as a sort string, sorting by the attribute\'s value', () => {
            return mixer.sort('published')
                .then(state => {
                    const targetIds = state.show.map(el => el.id);

                    chai.assert.equal(state.activeSort.sortString, 'published');
                    chai.assert.equal(state.activeSort.order, 'asc');
                    chai.assert.equal(state.activeSort.attribute, 'published');

                    chai.assert.deepEqual(targetIds, idsByPublishedDate);
                });
        });

        it('should accept a data-attribute and an order as sorting, sorting by the attribute\'s value in the defined order', () => {
            const idsByPublishedDateDesc = idsByPublishedDate.slice().reverse();

            return mixer.sort('published:desc')
                .then(state => {
                    const targetIds = state.show.map(el => el.id);

                    chai.assert.equal(state.activeSort.sortString, 'published:desc');
                    chai.assert.equal(state.activeSort.order, 'desc');
                    chai.assert.equal(state.activeSort.attribute, 'published');

                    chai.assert.deepEqual(targetIds, idsByPublishedDateDesc);
                });
        });

        it('should accept multiple sort strings for multi attribute sorting', () => {
            return mixer.sort('views published')
                .then(state => {
                    const targetIds = state.show.map(el => el.id);

                    chai.assert.isOk(state.activeSort.next);
                    chai.assert.instanceOf(state.activeSort.next, mixitup.CommandSort);

                    chai.assert.equal(state.activeSort.sortString, 'views');
                    chai.assert.equal(state.activeSort.order, 'asc');
                    chai.assert.equal(state.activeSort.attribute, 'views');

                    chai.assert.equal(state.activeSort.next.sortString, 'published');
                    chai.assert.equal(state.activeSort.next.order, 'asc');
                    chai.assert.equal(state.activeSort.next.attribute, 'published');

                    chai.assert.deepEqual(targetIds, idsByViewsThenPublishedDate);
                });
        });

        it('should accept multiple sort strings with orders for multi attribute sorting', () => {
            const idsByViewsThenPublishedDateDesc = idsByViewsThenPublishedDate.slice().reverse();

            return mixer.sort('views:desc published:desc')
                .then(state => {
                    const targetIds = state.show.map(el => el.id);

                    chai.assert.deepEqual(targetIds, idsByViewsThenPublishedDateDesc);
                });
        });

        it('should accept multiple sort strings with orders for multi attribute sorting', () => {
            const idsByViewsThenPublishedDateDesc = idsByViewsThenPublishedDate.slice().reverse();

            return mixer.sort('views:desc published:desc')
                .then(state => {
                    const targetIds = state.show.map(el => el.id);

                    chai.assert.deepEqual(targetIds, idsByViewsThenPublishedDateDesc);
                });
        });

        it('should accept a collection of elements by which to sort by', () => {
            const firstTarget = mixer.getState().targets[0];
            const collection = mixer.getState().targets.slice().reverse();

            return mixer.sort(collection)
                .then(state => {
                    const lastTarget = state.targets[state.targets.length - 1];

                    chai.assert.deepEqual(lastTarget, firstTarget);
                });
        });

        it('should error if any element in the collection provided does not exist in the container', () => {
            const mixer = mixitup(container);

            const collection = [document.createElement('div')];

            chai.assert.throws(() => mixer.sort(collection));
        });

        it('should accept a callback function which is invoked after sorting', () => {
            const promise = new Promise(resolve => mixer.sort('random', resolve));

            chai.assert.isFulfilled(promise);

            return promise
                .then(state => chai.assert.equal(state.activeSort.sortString, 'random'));
        });

        it('should accept a boolean allowing toggling off of animation', () => {
            return mixer.sort('random', false)
                .then(state => chai.assert.equal(state.activeSort.sortString, 'random'));
        });

        it('should resort when sorting attributes are dynamically edited, if `behavior.liveSort` is enabled', () => {
            const newDate = '20170628';
            let startOrder = null;

            return mixer.sort('published', false)
                .then(state => {
                    const target4 = container.querySelector('#target-4');

                    startOrder = state.targets;

                    target4.setAttribute('data-published', newDate);

                    return mixer.sort('published', false);
                })
                .then(state => {
                    // Order has not changed

                    chai.assert.deepEqual(state.targets, startOrder);
                    chai.assert.notEqual(state.targets[5].getAttribute('data-published'), newDate);

                    mixer.configure({
                        behavior: {
                            liveSort: true
                        }
                    });

                    return mixer.sort('published', false);
                })
                .then(state => {
                    // Order has changed

                    chai.assert.notDeepEqual(state.targets, startOrder);
                    chai.assert.equal(state.targets[5].getAttribute('data-published'), newDate);
                });
        });
    });
});
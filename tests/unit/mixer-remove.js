'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('mixitup.Mixer', () => {
    describe('#remove()', () => {
        it('should accept an element as an argument', () => {
            const container = dom.getContainer();
            const mixer = mixitup(container);
            const toRemove = container.children[3];

            return mixer.remove(toRemove)
                .then(state => {
                    chai.assert.notEqual(state.show[3].id, 'target-4');
                    chai.assert.equal(state.show[3].id, 'target-5');
                    chai.assert.equal(state.totalShow, '5');

                    mixer.destroy();
                });
        });

        it('should accept a collection of elements as an argument', () => {
            const container = dom.getContainer();
            const mixer = mixitup(container);
            const toRemove = [container.children[3], container.children[0]];

            return mixer.remove(toRemove)
                .then(state => {
                    chai.assert.equal(state.show[0].id, 'target-2');
                    chai.assert.equal(state.show[3].id, 'target-6');
                    chai.assert.equal(state.totalShow, '4');

                    mixer.destroy();
                });
        });

        it('should accept an index as an argument', () => {
            const container = dom.getContainer();
            const mixer = mixitup(container);

            return mixer.remove(3)
                .then(state => {
                    chai.assert.equal(state.show[3].id, 'target-5');
                    chai.assert.equal(state.totalShow, '5');

                    mixer.destroy();
                });
        });

        it('should accept a selector as an argument', () => {
            const container = dom.getContainer();
            const mixer = mixitup(container);

            return mixer.remove('.category-a')
                .then(state => {
                    chai.assert.equal(state.totalShow, '3');

                    mixer.destroy();
                });
        });

        it('should allow no elements to be removed with a warning', () => {
            const container = dom.getContainer();
            const mixer = mixitup(container);

            return mixer.remove()
                .then(state => {
                    chai.assert.equal(state.totalShow, '6');

                    mixer.destroy();
                });
        });

        it('should accept a callback function which is invoked after removal', () => {
            const container = dom.getContainer();
            const mixer = mixitup(container);
            const toRemove = container.children[0];

            const promise = new Promise(resolve => mixer.insert(mixer.remove(toRemove), resolve));

            chai.assert.isFulfilled(promise);

            return promise
                .then(() => {
                    chai.assert.notEqual(toRemove, container);

                    mixer.destroy();
                });
        });

        it('should accept a boolean allowing toggling off of animation', () => {
            const container = dom.getContainer();
            const mixer = mixitup(container);
            const toRemove = container.children[0];

            return mixer.remove(toRemove, false)
                .then(() => {
                    chai.assert.notEqual(toRemove, container);

                    mixer.destroy();
                });
        });
    });
});
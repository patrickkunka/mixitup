
'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('mixitup.Mixer', () => {
    describe('#toggleOn()', () => {
        const container = dom.getContainer();
        const mixer = mixitup(container);

        it('should activate an initial toggle', () => {
            const matching = Array.prototype.slice.call(container.querySelectorAll('.category-a'));

            return mixer.toggleOn('.category-a')
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should activate a further toggle', () => {
            const matching = Array.prototype.slice.call(container.querySelectorAll('.category-a, .category-c'));

            return mixer.toggleOn('.category-c')
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should activate a non-existant toggle with no effect', () => {
            const matching = Array.prototype.slice.call(container.querySelectorAll('.category-a, .category-c'));

            return mixer.toggleOn('.category-z')
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });
    });

    describe('#toggleOff()', () => {
        const container = dom.getContainer();
        const mixer = mixitup(container, {
            load: {
                filter: '.category-a, .category-b, .category-c'
            }
        });

        it('should deactivate a toggle', () => {
            const matching = Array.prototype.slice.call(container.querySelectorAll('.category-a, .category-b'));

            return mixer.toggleOff('.category-c')
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should deactivate a non existent toggle with no effect', () => {
            const matching = Array.prototype.slice.call(container.querySelectorAll('.category-a, .category-b'));

            return mixer.toggleOff('.category-z')
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });
    });
});

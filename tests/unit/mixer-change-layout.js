'use strict';

require('jsdom-global')();

const chai          = require('chai');
const dom           = require('../mock/dom');
const mixitup       = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('mixitup.Mixer', () => {
    let container   = dom.getContainer();
    let newClass    = 'mixitup-container__display-rows';
    let mixer       = mixitup(container);

    describe('#changeLayout()', () => {
        it('should add a new class name to the container', () => {
            return mixer.changeLayout(newClass)
                .then(state => {
                    chai.assert.equal(state.activeContainerClassName, newClass);
                    chai.assert.isOk(container.matches('.' + newClass));
                });
        });

        it('should remove the class name from the container', () => {
            return mixer.changeLayout('')
                .then(state => {
                    chai.assert.equal(state.activeContainerClassName, '');
                    chai.assert.notOk(container.matches('.' + newClass));
                });
        });

        it('should accept a callback function which is invoked after filtering', () => {
            let promise = new Promise(resolve => mixer.changeLayout(newClass, resolve));

            chai.assert.isFulfilled(promise);

            return promise
                .then(state => {
                    chai.assert.equal(state.activeContainerClassName, newClass);
                    chai.assert.isOk(container.matches('.' + newClass));
                });
        });

        it('should accept a boolean allowing toggling off of animation', () => {
            return mixer.changeLayout('', false)
                .then(state => {
                    chai.assert.equal(state.activeContainerClassName, '');
                    chai.assert.notOk(container.matches('.' + newClass));
                });
        });
    });
});
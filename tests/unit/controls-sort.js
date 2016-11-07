'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('Controls', () => {
    describe('Sort', () => {
        let frag        = document.createDocumentFragment();
        let container   = dom.getContainer();
        let controls    = dom.getSortControls();

        container.insertBefore(controls, container.children[0]);

        frag.appendChild(container);

        let mixer = mixitup(container, {
            controls: {
                scope: 'local'
            }
        }, frag);

        after(() => mixer.destroy());

        it('should detect nested sort controls and set active states upon instantiation', () => {
            let control1 = controls.querySelector('[data-sort="default"]');
            let control2 = controls.querySelector('[data-sort="default:asc"]');

            chai.assert.isOk(control1.matches('.mixitup-control-active'));
            chai.assert.isOk(control2.matches('.mixitup-control-active'));
        });

        it('should handle sort control clicks with a single sortString value', () => {
            let control = controls.querySelector('[data-sort="default:desc"]');

            control.click();

            let state = mixer.getState();

            chai.assert.isOk(control.matches('.mixitup-control-active'));
            chai.assert.equal(state.activeSort.sortString, 'default:desc');
            chai.assert.equal(state.activeSort.attribute, '');
            chai.assert.equal(state.activeSort.order, 'desc');
        });

        it('should handle sort control clicks with "random" value', () => {
            let control = controls.querySelector('[data-sort="random"]');

            control.click();

            let state = mixer.getState();

            chai.assert.isOk(control.matches('.mixitup-control-active'));
            chai.assert.equal(state.activeSort.sortString, 'random');
            chai.assert.equal(state.activeSort.attribute, '');
            chai.assert.equal(state.activeSort.order, 'random');
        });

        it('should activate buttons in response to matching API calls', () => {
            let control = controls.querySelector('[data-sort="published:asc views:desc"]');

            return mixer.sort('published:asc views:desc')
                .then(state => {
                    chai.assert.isOk(control.matches('.mixitup-control-active'));
                    chai.assert.equal(state.activeSort.sortString, 'published:asc');
                    chai.assert.isOk(state.activeSort.next);
                    chai.assert.equal(state.activeSort.next.sortString, 'views:desc');
                });
        });
    });
});
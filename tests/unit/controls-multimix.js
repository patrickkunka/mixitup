'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('Controls', () => {
    describe('Multimix', () => {
        let frag        = document.createDocumentFragment();
        let container   = dom.getContainer();
        let controls    = dom.getMultimixControls();

        container.insertBefore(controls, container.children[0]);

        frag.appendChild(container);

        let mixer = mixitup(container, {
            controls: {
                scope: 'local'
            }
        }, frag);

        after(() => mixer.destroy());

        it('should detect nested filter controls and set active states upon instantiation', () => {
            let control = controls.querySelector('[data-filter="all"][data-sort="default:asc"]');

            chai.assert.isOk(control.matches('.mixitup-control-active'));
        });

        it('should read filter and sort actions simultaneously', () => {
            let control = controls.querySelector('[data-filter=".category-b"][data-sort="published"]');

            control.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '.category-b');
            chai.assert.equal(state.activeSort.sortString, 'published');

            chai.assert.isOk(control.matches('.mixitup-control-active'));
        });
    });
});
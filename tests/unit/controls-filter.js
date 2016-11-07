'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('Controls', () => {
    describe('Filter', () => {
        let frag        = document.createDocumentFragment();
        let container   = dom.getContainer();
        let controls    = dom.getFilterControls();

        container.insertBefore(controls, container.children[0]);

        frag.appendChild(container);

        let mixer = mixitup(container, {
            controls: {
                scope: 'local'
            }
        }, frag);

        after(() => mixer.destroy());

        it('should detect nested filter controls and set active states upon instantiation', () => {
            let filter = controls.querySelector('[data-filter="all"]');

            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should map filter controls with value "none" to the selector ""', () => {
            let filter = controls.querySelector('[data-filter="none"]');

            filter.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '');
            chai.assert.equal(state.totalShow, 0);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should map filter controls with value "all" to the target selector', () => {
            let filter = controls.querySelector('[data-filter="all"]');

            filter.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '.mix');
            chai.assert.equal(state.totalHide, 0);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with a selector value', () => {
            let filter = controls.querySelector('[data-filter=".category-a"]');
            let totalMatching = container.querySelectorAll('.category-a').length;

            filter.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '.category-a');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with a compound OR selector', () => {
            let filter = controls.querySelector('[data-filter=".category-a, .category-b"]');
            let totalMatching = container.querySelectorAll('.category-a, .category-b').length;

            filter.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '.category-a, .category-b');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with a compound AND selector', () => {
            let filter = controls.querySelector('[data-filter=".category-a.category-c"]');
            let totalMatching = container.querySelectorAll('.category-a.category-c').length;

            filter.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '.category-a.category-c');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with an attribute selector value', () => {
            let filter = controls.querySelector('.mixitup_control__attr-a');
            let totalMatching = container.querySelectorAll('[data-category="a"]').length;

            filter.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '[data-category="a"]');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with an attribute selector value', () => {
            let filter = controls.querySelector('.mixitup_control__attr-a');
            let totalMatching = container.querySelectorAll('[data-category="a"]').length;

            filter.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '[data-category="a"]');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with a compound OR attribute selector value', () => {
            let filter = controls.querySelector('.mixitup_control__attr-a-or-b');
            let totalMatching = container.querySelectorAll('[data-category="a"], [data-category="b"]').length;

            filter.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '[data-category="a"], [data-category="b"]');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with a compound AND attribute selector value', () => {
            let filter = controls.querySelector('.mixitup_control__attr-a-and-c');
            let totalMatching = container.querySelectorAll('[data-category="a"][data-category="c"]').length;

            filter.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '[data-category="a"][data-category="c"]');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it ('should allow a single set of controls to control multiple mixer instance simultanously', () => {
            let frag = document.createDocumentFragment();

            let container1 = dom.getContainer();
            let container2 = dom.getContainer();
            let controls = dom.getFilterControls();

            frag.appendChild(controls);
            frag.appendChild(container1);
            frag.appendChild(container2);

            let mixer1 = mixitup(container1, {}, frag);
            let mixer2 = mixitup(container2, {}, frag);

            after(() => {
                mixer1.destroy();
                mixer2.destroy();
            });

            let filter = controls.querySelector('[data-filter=".category-a"]');

            filter.click();

            chai.assert.equal(mixer1.getState().activeFilter.selector, '.category-a');
            chai.assert.equal(mixer2.getState().activeFilter.selector, '.category-a');
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });
    });
});
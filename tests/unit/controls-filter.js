'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('Controls', () => {
    describe('Filter', () => {
        const frag        = document.createDocumentFragment();
        const container   = dom.getContainer();
        const controls    = dom.getFilterControls();

        container.insertBefore(controls, container.children[0]);

        frag.appendChild(container);

        const mixer = mixitup(container, {
            controls: {
                scope: 'local'
            }
        }, frag);

        after(() => mixer.destroy());

        it('should detect nested filter controls and set active states upon instantiation', () => {
            const filter = controls.querySelector('[data-filter="all"]');

            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should map filter controls with value "none" to the selector ""', () => {
            const filter = controls.querySelector('[data-filter="none"]');

            filter.click();

            const state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '');
            chai.assert.equal(state.totalShow, 0);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should map filter controls with value "all" to the target selector', () => {
            const filter = controls.querySelector('[data-filter="all"]');

            filter.click();

            const state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '.mix');
            chai.assert.equal(state.totalHide, 0);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with a selector value', () => {
            const filter = controls.querySelector('[data-filter=".category-a"]');
            const totalMatching = container.querySelectorAll('.category-a').length;

            filter.click();

            const state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '.category-a');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with a compound OR selector', () => {
            const filter = controls.querySelector('[data-filter=".category-a, .category-b"]');
            const totalMatching = container.querySelectorAll('.category-a, .category-b').length;

            filter.click();

            const state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '.category-a, .category-b');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with a compound AND selector', () => {
            const filter = controls.querySelector('[data-filter=".category-a.category-c"]');
            const totalMatching = container.querySelectorAll('.category-a.category-c').length;

            filter.click();

            const state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '.category-a.category-c');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with an attribute selector value', () => {
            const filter = controls.querySelector('.mixitup_control__attr-a');
            const totalMatching = container.querySelectorAll('[data-category="a"]').length;

            filter.click();

            const state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '[data-category="a"]');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with an attribute selector value', () => {
            const filter = controls.querySelector('.mixitup_control__attr-a');
            const totalMatching = container.querySelectorAll('[data-category="a"]').length;

            filter.click();

            const state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '[data-category="a"]');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with a compound OR attribute selector value', () => {
            const filter = controls.querySelector('.mixitup_control__attr-a-or-b');
            const totalMatching = container.querySelectorAll('[data-category="a"], [data-category="b"]').length;

            filter.click();

            const state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '[data-category="a"], [data-category="b"]');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should accept filter controls with a compound AND attribute selector value', () => {
            const filter = controls.querySelector('.mixitup_control__attr-a-and-c');
            const totalMatching = container.querySelectorAll('[data-category="a"][data-category="c"]').length;

            filter.click();

            const state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '[data-category="a"][data-category="c"]');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it ('should allow a single set of controls to control multiple mixer instance simultanously', () => {
            const frag = document.createDocumentFragment();

            const container1 = dom.getContainer();
            const container2 = dom.getContainer();
            const controls = dom.getFilterControls();

            frag.appendChild(controls);
            frag.appendChild(container1);
            frag.appendChild(container2);

            const mixer1 = mixitup(container1, {}, frag);
            const mixer2 = mixitup(container2, {}, frag);

            after(() => {
                mixer1.destroy();
                mixer2.destroy();
            });

            const filter = controls.querySelector('[data-filter=".category-a"]');

            filter.click();

            chai.assert.equal(mixer1.getState().activeFilter.selector, '.category-a');
            chai.assert.equal(mixer2.getState().activeFilter.selector, '.category-a');
            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it ('should activate the appropriate controls on load for a single selector', () => {
            const frag = document.createDocumentFragment();

            const container = dom.getContainer();
            const controls = dom.getFilterControls();

            frag.appendChild(controls);
            frag.appendChild(container);

            const mixer = mixitup(container, {
                load: {
                    filter: '.category-a'
                }
            }, frag);

            after(() => mixer.destroy());

            const filter = controls.querySelector('[data-filter=".category-a"]');

            chai.assert.isTrue(filter.classList.contains('mixitup-control-active'));
        });
    });
});
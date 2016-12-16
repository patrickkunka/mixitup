'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('Controls', () => {
    describe('Live', () => {
        let frag            = document.createDocumentFragment();
        let container       = dom.getContainer();
        let filterControls  = dom.getFilterControls();
        let sortControls    = dom.getSortControls();

        container.insertBefore(filterControls, container.children[0]);
        container.insertBefore(sortControls, filterControls);

        frag.appendChild(container);

        let mixer = mixitup(container, {
            controls: {
                scope: 'local',
                live: true
            }
        }, frag);

        after(() => mixer.destroy());

        it('should detect nested controls and set active states upon instantiation', () => {
            let filter = filterControls.querySelector('[data-filter="all"]');

            chai.assert.isOk(filter.matches('.mixitup-control-active'));
        });

        it('should allow new filter controls to be added', () => {
            let control = dom.getFilterControl();
            let totalMatching = container.querySelectorAll('.category-d').length;

            filterControls.appendChild(control);

            control.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '.category-d');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(control.matches('.mixitup-control-active'));
        });

        it('should allow new toggle controls to be added', () => {
            let control = dom.getToggleControl();
            let totalMatching = container.querySelectorAll('.category-b, .category-d').length;

            filterControls.appendChild(control);

            control.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeFilter.selector, '.category-d, .category-b');
            chai.assert.equal(state.totalShow, totalMatching);
            chai.assert.isOk(control.matches('.mixitup-control-active'));
        });

        it('should allow new sort controls to be added', () => {
            let control = dom.getSortControl();

            sortControls.appendChild(control);

            control.click();

            let state = mixer.getState();

            chai.assert.equal(state.activeSort.sortString, 'views:desc');
            chai.assert.isOk(state.activeSort.next);
            chai.assert.equal(state.activeSort.next.sortString, 'published:asc');
            chai.assert.isOk(control.matches('.mixitup-control-active'));
        });

        it ('should allow a single set of filter controls to control multiple mixer instance simultanously', () => {
            let frag = document.createDocumentFragment();

            let container1 = dom.getContainer();
            let container2 = dom.getContainer();
            let controls = dom.getFilterControls();
            let config = {
                controls: {
                    live: true
                }
            };

            frag.appendChild(controls);
            frag.appendChild(container1);
            frag.appendChild(container2);

            let mixer1 = mixitup(container1, config, frag);
            let mixer2 = mixitup(container2, config, frag);

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

        it ('should restrict control clicks to only those matching is a control selector is defined', () => {
            let frag = document.createDocumentFragment();

            let container = dom.getContainer();
            let controls = dom.getFilterControls();

            let config = {
                controls: {
                    live: true
                },
                selectors: {
                    control: '.mixitup-control-restrict'
                }
            };

            frag.appendChild(controls);
            frag.appendChild(container);

            let mixer = mixitup(container, config, frag);

            after(() => {
                mixer.destroy();
            });

            let filter1 = controls.querySelector('[data-filter=".category-a"]');

            filter1.classList.add('mixitup-control-restrict');

            filter1.click();

            let filter2 = controls.querySelector('[data-filter=".category-b"]');

            filter2.click();

            chai.assert.equal(mixer.getState().activeFilter.selector, '.category-a');
            chai.assert.isOk(filter1.matches('.mixitup-control-active'));
            chai.assert.isNotOk(filter2.matches('.mixitup-control-active'));
        });
    });
});
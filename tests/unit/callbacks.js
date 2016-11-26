'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

describe('mixitup()', () => {
    it('should accept an `onMixStart` callback, invoked at the start of operations', () => {
        let container = dom.getContainer();
        let wasCalled = false;

        let mixer = mixitup(container, {
            callbacks: {
                onMixStart: (state, futureState) => {
                    chai.assert.instanceOf(state, mixitup.State);
                    chai.assert.instanceOf(futureState, mixitup.State);
                    chai.assert.notEqual(state.totalShow, futureState.totalShow);

                    wasCalled = true;
                }
            }
        });

        return mixer.hide()
            .then(() => chai.assert.equal(wasCalled, true));
    });

    it('should accept an `onMixBusy` callback, called if simulataneous operation is rejected', () => {
        let container = dom.getContainer();
        let wasCalled = false;

        let mixer = mixitup(container, {
            debug: {
                fauxAsync: true
            },
            animation: {
                duration: 200,
                queue: false
            },
            callbacks: {
                onMixBusy: (state) => {
                    chai.assert.instanceOf(state, mixitup.State);

                    wasCalled = true;
                }
            }
        });

        mixer.hide();

        return mixer.show()
            .then(() => chai.assert.equal(wasCalled, true));
    });

    it('should accept an `onMixEnd` callback, called at the end of an operation', () => {
        let container = dom.getContainer();
        let wasCalled = false;
        let endState;

        let mixer = mixitup(container, {
            callbacks: {
                onMixEnd: (state) => {
                    endState = state;

                    chai.assert.instanceOf(state, mixitup.State);

                    wasCalled = true;
                }
            }
        });

        return mixer.hide()
            .then(state => {
                chai.assert.equal(state.totalShow, endState.totalShow);
                chai.assert.equal(wasCalled, true);
            });
    });

    it('should accept an `onMixFail` callback, called when a filter operation does not match any targets', () => {
        let container = dom.getContainer();
        let wasCalled = false;

        let mixer = mixitup(container, {
            callbacks: {
                onMixFail: (state) => {
                    chai.assert.instanceOf(state, mixitup.State);

                    wasCalled = true;
                }
            }
        });

        return mixer.filter('.category-x')
            .then(() => {
                chai.assert.equal(wasCalled, true);
            });
    });

    it('should accept an `onMixClick` callback invoked when a control is clicked', () => {
        let frag        = document.createDocumentFragment();
        let container   = dom.getContainer();
        let controls    = dom.getFilterControls();
        let wasCalled   = false;
        let filter      = controls.querySelector('[data-filter="none"]');

        container.insertBefore(controls, container.children[0]);

        frag.appendChild(container);

        let mixer = mixitup(container, {
            controls: {
                scope: 'local'
            },
            callbacks: {
                onMixClick: function(state, originalEvent) {
                    var self = this;

                    chai.assert.instanceOf(state, mixitup.State);
                    chai.assert.instanceOf(originalEvent, window.MouseEvent);
                    chai.assert.equal(self, filter);

                    wasCalled = true;
                }
            }
        }, frag);

        filter.click();

        return Promise.resolve()
            .then(() => {
                chai.assert.equal(wasCalled, true);

                mixer.destroy();
            });
    });

    it('should accept an `onMixClick` callback which can be cancelled by returning false', () => {
        let frag        = document.createDocumentFragment();
        let container   = dom.getContainer();
        let controls    = dom.getFilterControls();
        let wasCalled   = false;
        let filter      = controls.querySelector('[data-filter="none"]');

        container.insertBefore(controls, container.children[0]);

        frag.appendChild(container);

        let mixer = mixitup(container, {
            controls: {
                scope: 'local'
            },
            callbacks: {
                onMixClick: () => {
                    return false;
                },
                onMixEnd: () => {
                    // Will not be called

                    wasCalled = true;
                }
            }
        }, frag);

        filter.click();

        return Promise.resolve()
            .then(() => {
                chai.assert.equal(wasCalled, false);

                mixer.destroy();
            });
    });
});
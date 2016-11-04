'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('mixitup.Mixer', () => {
    describe('#filter()', () => {
        let container = dom.getContainer();
        let mixer = mixitup(container);

        it('should accept a class selector', () => {
            let matching = Array.prototype.slice.call(container.querySelectorAll('.category-a'));

            return mixer.filter('.category-a')
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept an attribute selector', () => {
            let matching = Array.prototype.slice.call(container.querySelectorAll('[data-category~="a"]'));

            return mixer.filter('[data-category~="a"]')
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a compound OR class selector', () => {
            let matching = Array.prototype.slice.call(container.querySelectorAll('.category-a, .category-b'));

            return mixer.filter('.category-a, .category-b')
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a compound AND class selector', () => {
            let matching = Array.prototype.slice.call(container.querySelectorAll('.category-a.category-c'));

            return mixer.filter('.category-a.category-c')
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a compound OR attribute selector', () => {
            let matching = Array.prototype.slice.call(container.querySelectorAll('[data-category~="a"], [data-category~="c"]'));

            return mixer.filter('[data-category~="a"], [data-category~="c"]')
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a compound AND attribute selector', () => {
            let matching = Array.prototype.slice.call(container.querySelectorAll('[data-category~="a"][data-category~="c"]'));

            return mixer.filter('[data-category~="a"][data-category~="c"]')
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.equal(state.totalShow, 1);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept "none"', () => {
            return mixer.filter('none')
                .then(state => {
                    chai.assert.equal(state.totalShow, 0);
                    chai.assert.equal(state.hasFailed, false);
                    chai.assert.deepEqual(state.hide, Array.prototype.slice.call(container.children));
                    chai.assert.equal(state.activeFilter.selector, '');
                });
        });

        it('should accept "all"', () => {
            return mixer.filter('all')
                .then(state => {
                    chai.assert.deepEqual(state.show, Array.prototype.slice.apply(container.children));
                    chai.assert.deepEqual(state.show, state.targets);
                });
        });

        it('should fail if queried with a non matching selector', () => {
            return mixer.filter('.non-mathing-selector')
                .then(state => {
                    chai.assert.deepEqual(state.show, []);
                    chai.assert.equal(state.hasFailed, true);
                });
        });

        it('should accept a single element', () => {
            let el = container.firstElementChild;

            return mixer.filter(el)
                .then(state => {
                    chai.assert.deepEqual(state.show, [el]);
                    chai.assert.equal(state.activeFilter.selector, '');
                    chai.assert.deepEqual(state.activeFilter.collection, [el]);
                });
        });

        it('should accept a collection of elements', () => {
            let collection = [
                container.firstElementChild,
                container.lastElementChild
            ];

            return mixer.filter(collection)
                .then(state => {
                    chai.assert.deepEqual(state.show, collection);
                    chai.assert.equal(state.activeFilter.selector, '');
                    chai.assert.deepEqual(state.activeFilter.collection, collection);
                });
        });

        it('should interpret `null` as hide all', () => {
            return mixer.filter(null)
                .then(state => {
                    chai.assert.deepEqual(state.show, []);
                    chai.assert.equal(state.activeFilter.selector, '');
                    chai.assert.deepEqual(state.activeFilter.collection, []);
                });
        });

        it('should interpret `[]` as hide all', () => {
            return mixer.filter(null)
                .then(state => {
                    chai.assert.deepEqual(state.show, []);
                    chai.assert.equal(state.activeFilter.selector, '');
                    chai.assert.deepEqual(state.activeFilter.collection, []);
                });
        });

        it('should accept a full CommandFilter object, allowing for inverse filtering via selector', () => {
            let command = {
                selector: '.category-a',
                action: 'hide'
            };

            let collection = Array.prototype.slice.call(container.querySelectorAll(':not(.category-a)'));

            return mixer.filter(command)
                .then(state => {
                    chai.assert.deepEqual(state.show, collection);
                    chai.assert.equal(state.activeFilter.selector, '.category-a');
                    chai.assert.equal(state.activeFilter.action, 'hide');
                });
        });

        it('should accept a full CommandFilter object, allowing for inverse filtering via a collection', () => {
            let el = container.querySelector('.category-a.category-c');

            let command = {
                collection: [el],
                action: 'hide'
            };

            let collection = Array.prototype.slice.call(container.querySelectorAll(':not(.category-a.category-c)'));

            return mixer.filter(command)
                .then(state => {
                    chai.assert.deepEqual(state.show, collection);
                    chai.assert.deepEqual(state.activeFilter.collection, [el]);
                    chai.assert.equal(state.activeFilter.action, 'hide');
                });
        });

        it('should accept a callback function which is invoked after filtering', () => {
            let matching = Array.prototype.slice.call(container.querySelectorAll('.category-a'));

            let promise = new Promise(resolve => mixer.filter('.category-a', resolve));

            chai.assert.isFulfilled(promise);

            return promise
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should return a promise which is resolved after filtering', () => {
            let matching = Array.prototype.slice.call(container.querySelectorAll('.category-a'));

            return mixer.filter('.category-a')
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a boolean allowing toggling off of animation', () => {
            let matching = Array.prototype.slice.call(container.querySelectorAll('.category-a'));

            return mixer.filter('.category-a', false)
                .then(state => {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should throw an error if both a selector and a collection are provided', () => {
            let command = {
                collection: [],
                selector: '.selector'
            };

            chai.assert.throws(() => {
                mixer.filter(command);
            }, Error, mixitup.messages.errorFilterInvalidArguments());
        });
    });
});

describe('mixitup.Mixer', () => {
    describe('#hide()', () => {
        let container = dom.getContainer();
        let mixer = mixitup(container);

        it('should hide all elements', () => {
            return mixer.hide()
                .then(state => {
                    chai.assert.equal(state.totalShow, 0);
                    chai.assert.equal(state.totalHide, state.targets.length);
                    chai.assert.equal(state.activeFilter.selector, '');
                });
        });
    });
});

describe('mixitup.Mixer', () => {
    describe('#show()', () => {
        let container = dom.getContainer();
        let mixer = mixitup(container);

        it('should show all elements', () => {
            return mixer.filter('.category-a')
                .then(mixer.show)
                .then(state => {
                    chai.assert.equal(state.totalShow, state.targets.length);
                    chai.assert.equal(state.totalHide, 0);
                    chai.assert.equal(state.activeFilter.selector, '.mix');
                });
        });
    });
});
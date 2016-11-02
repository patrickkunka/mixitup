require('jsdom-global')();

var chai    = require('chai');
var dom     = require('../mock/dom');
var mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('mixitup.Mixer', function() {
    describe('#filter()', function() {
        var container = dom.getContainer();
        var mixer = mixitup(container);

        it('should accept a class selector', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('.category-a'));

            return mixer.filter('.category-a')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept an attribute selector', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('[data-category~="a"]'));

            return mixer.filter('[data-category~="a"]')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a compound OR class selector', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('.category-a, .category-b'));

            return mixer.filter('.category-a, .category-b')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a compound AND class selector', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('.category-a.category-c'));

            return mixer.filter('.category-a.category-c')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a compound OR attribute selector', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('[data-category~="a"], [data-category~="c"]'));

            return mixer.filter('[data-category~="a"], [data-category~="c"]')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a compound AND attribute selector', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('[data-category~="a"][data-category~="c"]'));

            return mixer.filter('[data-category~="a"][data-category~="c"]')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.equal(state.totalShow, 1);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept "none"', function() {
            return mixer.filter('none')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, 0);
                    chai.assert.equal(state.hasFailed, false);
                    chai.assert.deepEqual(state.hide, Array.prototype.slice.call(container.children));
                    chai.assert.equal(state.activeFilter.selector, '');
                });
        });

        it('should accept "all"', function() {
            return mixer.filter('all')
                .then(function(state) {
                    chai.assert.deepEqual(state.show, Array.prototype.slice.apply(container.children));
                    chai.assert.deepEqual(state.show, state.targets);
                });
        });

        it('should fail if queried with a non matching selector', function() {
            return mixer.filter('.non-mathing-selector')
                .then(function(state) {
                    chai.assert.deepEqual(state.show, []);
                    chai.assert.equal(state.hasFailed, true);
                });
        });

        it('should accept a single element', function() {
            var el = container.firstElementChild;

            return mixer.filter(el)
                .then(function(state) {
                    chai.assert.deepEqual(state.show, [el]);
                    chai.assert.equal(state.activeFilter.selector, '');
                    chai.assert.deepEqual(state.activeFilter.collection, [el]);
                });
        });

        it('should accept a collection of elements', function() {
            var collection = [
                container.firstElementChild,
                container.lastElementChild
            ];

            return mixer.filter(collection)
                .then(function(state) {
                    chai.assert.deepEqual(state.show, collection);
                    chai.assert.equal(state.activeFilter.selector, '');
                    chai.assert.deepEqual(state.activeFilter.collection, collection);
                });
        });

        it('should interpret `null` as hide all', function() {
            return mixer.filter(null)
                .then(function(state) {
                    chai.assert.deepEqual(state.show, []);
                    chai.assert.equal(state.activeFilter.selector, '');
                    chai.assert.deepEqual(state.activeFilter.collection, []);
                });
        });

        it('should interpret `[]` as hide all', function() {
            return mixer.filter(null)
                .then(function(state) {
                    chai.assert.deepEqual(state.show, []);
                    chai.assert.equal(state.activeFilter.selector, '');
                    chai.assert.deepEqual(state.activeFilter.collection, []);
                });
        });

        it('should accept a full CommandFilter object, allowing for inverse filtering via selector', function() {
            var command = {
                selector: '.category-a',
                action: 'hide'
            };

            var collection = Array.prototype.slice.call(container.querySelectorAll(':not(.category-a)'));

            return mixer.filter(command)
                .then(function(state) {
                    chai.assert.deepEqual(state.show, collection);
                    chai.assert.equal(state.activeFilter.selector, '.category-a');
                    chai.assert.equal(state.activeFilter.action, 'hide');
                });
        });

        it('should accept a full CommandFilter object, allowing for inverse filtering via a collection', function() {
            var el = container.querySelector('.category-a.category-c');

            var command = {
                collection: [el],
                action: 'hide'
            };

            var collection = Array.prototype.slice.call(container.querySelectorAll(':not(.category-a.category-c)'));

            return mixer.filter(command)
                .then(function(state) {
                    chai.assert.deepEqual(state.show, collection);
                    chai.assert.deepEqual(state.activeFilter.collection, [el]);
                    chai.assert.equal(state.activeFilter.action, 'hide');
                });
        });

        it('should accept a callback function which is invoked after filtering', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('.category-a'));

            var promise = new Promise(function(resolve) {
                mixer.filter('.category-a', resolve);
            });

            chai.assert.isFulfilled(promise);

            return promise
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should return a promise which is resolved after filtering', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('.category-a'));

            return mixer.filter('.category-a')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a boolean allowing toggling of animation', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('.category-a'));

            return mixer.filter('.category-a', false)
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should throw an error if both a selector and a collection are provided', function() {
            var command = {
                collection: [],
                selector: '.selector'
            };

            chai.assert.throws(function() {
                mixer.filter(command);
            }, Error, mixitup.messages.ERROR_FILTER_INVALID_ARGUMENTS());
        });
    });
});
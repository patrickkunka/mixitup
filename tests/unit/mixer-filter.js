require('jsdom-global')();

var chai    = require('chai');
var dom     = require('../mock/dom');
var mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));

describe('mixitup.Mixer', function() {
    describe('#filter()', function() {
        var container = dom.getContainer();
        var mixer = mixitup(container);

        it('should accept a class selector', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('.category-1'));

            return mixer.filter('.category-1')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept an attribute selector', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('[data-category~="1"]'));

            return mixer.filter('[data-category~="1"]')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a compound OR class selector', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('.category-1, .category-2'));

            return mixer.filter('.category-1, .category-2')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a compound AND class selector', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('.category-1.category-3'));

            return mixer.filter('.category-1.category-3')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a compound OR attribute selector', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('[data-category~="1"], [data-category~="3"]'));

            return mixer.filter('[data-category~="1"], [data-category~="3"]')
                .then(function(state) {
                    chai.assert.equal(state.totalShow, matching.length);
                    chai.assert.deepEqual(state.show, matching);
                    chai.assert.deepEqual(state.matching, matching);
                });
        });

        it('should accept a compound AND attribute selector', function() {
            var matching = Array.prototype.slice.call(container.querySelectorAll('[data-category~="1"][data-category~="3"]'));

            return mixer.filter('[data-category~="1"][data-category~="3"]')
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
    });
});
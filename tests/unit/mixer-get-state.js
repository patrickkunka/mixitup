require('jsdom-global')();

var chai    = require('chai');
var dom     = require('../mock/dom');
var mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));

describe('mixitup.Mixer', function() {
    describe('#getState()', function() {
        var container = dom.getContainer();
        var id = container.id = 'test-id';
        var mixer = mixitup(container);
        var state = mixer.getState();

        it('should contain an id equal to the container id', function() {
            chai.assert.equal(state.container.id, id);
        });

        it('should contain a reference to the container element', function() {
            chai.assert.equal(state.container, container);
        });

        it('should contain a reference to the container element', function() {
            chai.assert.equal(state.container, container);
        });

        it('should contain an activeFilter object with the default selector active', function() {
            chai.assert.instanceOf(state.activeFilter, mixitup.CommandFilter);
            chai.assert.equal(state.activeFilter.selector, '.mix');
        });

        it('should contain an activeSort object with the default sort string active', function() {
            chai.assert.instanceOf(state.activeSort, mixitup.CommandSort);
            chai.assert.equal(state.activeSort.sortString, 'default:asc');
        });

        it('should contain an empty activeContainerClass string', function() {
            chai.assert.equal(state.activeContainerClass, '');
        });

        it('should contain a null activeDataset', function() {
            chai.assert.deepEqual(state.activeDataset, null);
        });

        it('should contain a hasFailed boolean, set to false', function() {
            chai.assert.deepEqual(state.hasFailed, false);
        });

        it('should contain a list of targets deeply equaling the contents of the container', function() {
            chai.assert.deepEqual(state.targets, Array.prototype.slice.apply(container.children));
        });

        it('should contain a totalTargets integer, equal to the number of targets in the container', function() {
            chai.assert.equal(state.totalTargets, container.children.length);
        });

        it('should contain a list of targets currently shown', function() {
            chai.assert.deepEqual(state.show, Array.prototype.slice.apply(container.children));
            chai.assert.deepEqual(state.show, state.targets);
        });

        it('should contain a totalShow integer, equal to the number of targets shown', function() {
            chai.assert.equal(state.totalShow, container.children.length);
        });

        it('should contain a list of targets matching the active selector', function() {
            chai.assert.deepEqual(state.matching, Array.prototype.slice.apply(container.children));
            chai.assert.deepEqual(state.matching, state.targets);
        });

        it('should contain a totalMatching integer, equal to the number of targets matching the active selector', function() {
            chai.assert.equal(state.totalMatching, container.children.length);
        });

        it('should contain a list of targets currently hidden', function() {
            chai.assert.deepEqual(state.hide, []);
        });

        it('should contain a totalShow integer, equal to the number of targets hidden', function() {
            chai.assert.equal(state.totalHide, 0);
        });

        it('should contain a null triggerElement reference', function() {
            chai.assert.equal(state.triggerElement, null);
        });
    });
});
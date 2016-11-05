'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));

describe('mixitup.Mixer', () => {
    describe('#getState()', () => {
        let container = dom.getContainer();
        let id = container.id = 'test-id';
        let mixer = mixitup(container);
        let state = mixer.getState();

        after(() => mixer.destroy());

        it('should contain an id equal to the container id', () => {
            chai.assert.equal(state.container.id, id);
        });

        it('should contain a reference to the container element', () => {
            chai.assert.equal(state.container, container);
        });

        it('should contain a reference to the container element', () => {
            chai.assert.equal(state.container, container);
        });

        it('should contain an activeFilter object with the default selector active', () => {
            chai.assert.instanceOf(state.activeFilter, mixitup.CommandFilter);
            chai.assert.equal(state.activeFilter.selector, '.mix');
        });

        it('should contain an activeSort object with the default sort string active', () => {
            chai.assert.instanceOf(state.activeSort, mixitup.CommandSort);
            chai.assert.equal(state.activeSort.sortString, 'default:asc');
        });

        it('should contain an empty activeContainerClassName string', () => {
            chai.assert.equal(state.activeContainerClassName, '');
        });

        it('should contain a null activeDataset', () => {
            chai.assert.deepEqual(state.activeDataset, null);
        });

        it('should contain a hasFailed boolean, set to false', () => {
            chai.assert.deepEqual(state.hasFailed, false);
        });

        it('should contain a list of targets deeply equaling the contents of the container', () => {
            chai.assert.deepEqual(state.targets, Array.prototype.slice.apply(container.children));
        });

        it('should contain a totalTargets integer, equal to the number of targets in the container', () => {
            chai.assert.equal(state.totalTargets, container.children.length);
        });

        it('should contain a list of targets currently shown', () => {
            chai.assert.deepEqual(state.show, Array.prototype.slice.apply(container.children));
            chai.assert.deepEqual(state.show, state.targets);
        });

        it('should contain a totalShow integer, equal to the number of targets shown', () => {
            chai.assert.equal(state.totalShow, container.children.length);
        });

        it('should contain a list of targets matching the active selector', () => {
            chai.assert.deepEqual(state.matching, Array.prototype.slice.apply(container.children));
            chai.assert.deepEqual(state.matching, state.targets);
        });

        it('should contain a totalMatching integer, equal to the number of targets matching the active selector', () => {
            chai.assert.equal(state.totalMatching, container.children.length);
        });

        it('should contain a list of targets currently hidden', () => {
            chai.assert.deepEqual(state.hide, []);
        });

        it('should contain a totalShow integer, equal to the number of targets hidden', () => {
            chai.assert.equal(state.totalHide, 0);
        });

        it('should contain a null triggerElement reference', () => {
            chai.assert.equal(state.triggerElement, null);
        });
    });
});
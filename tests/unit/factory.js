'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

describe('mixitup()', () => {
    it('should throw an error if no container reference', () => {
        chai.assert.throws(() => mixitup(), Error, mixitup.messages.errorFactoryInvalidContainer());
    });

    it('should throw an error if a null container reference is passed', () => {
        chai.assert.throws(() => mixitup(null), Error, mixitup.messages.errorFactoryInvalidContainer());
    });

    it('should throw an error if an invalid container reference is passed', () => {
        chai.assert.throws(() => mixitup({}), Error, mixitup.messages.errorFactoryInvalidContainer());
    });

    it('should throw an error if an invalid reference or selector is passed', function() {
        chai.assert.throws(() => mixitup(false), Error, mixitup.messages.errorFactoryInvalidContainer());
    });

    it('should accept an element reference as a container', () => {
        let container = dom.getContainer();
        let mixer = mixitup(container);

        chai.assert.isOk(mixer);
    });

    it('should accept a container selector', () => {
        let container = dom.getContainer();

        window.document.open();
        window.document.write(container.outerHTML);
        window.document.close();

        let mixer = mixitup('.container');
        let state = mixer.getState();

        chai.assert.isOk(mixer);
        chai.assert.equal(state.container, window.document.querySelector('.container'));
    });

    it('should throw an error if the container selector yields no element', () => {
        chai.assert.throws(() => mixitup('.invalid-container-selector', Error, mixitup.messages.errorFactoryContainerNotFound()));
    });

    it('should return an instance of a facade by default', () => {
        let container = dom.getContainer();
        let mixer = mixitup(container);

        chai.assert.instanceOf(mixer, mixitup.Facade);
    });

    it('should return an instance of a mixer if debug mode enabled', () => {
        let container = dom.getContainer();
        let mixer = mixitup(container, {
            debug: {
                enable: true
            }
        });

        chai.assert.instanceOf(mixer, mixitup.Mixer);
    });

    it('should return a single instance of a mixer, wrapping the first element if multiple elements passed', () => {
        let elementList = [
            dom.getContainer(),
            dom.getContainer()
        ];

        let mixer = mixitup(elementList, {
            debug: {
                enable: true
            }
        });

        chai.assert.instanceOf(mixer, mixitup.Mixer);
        chai.assert.equal(mixer.getState().container, elementList[0]);
    });

    it('should return an instance of a collection if multiple elements passed and `returnCollection` specified', () => {
        let elementList = [
            dom.getContainer(),
            dom.getContainer()
        ];

        let collection = mixitup(elementList, void(0), void(0), true);

        chai.assert.instanceOf(collection, mixitup.Collection);
        chai.assert.instanceOf(collection[0], mixitup.Facade);
        chai.assert.instanceOf(collection[1], mixitup.Facade);
    });

    it('should add a unique ID to the container if no ID present', () => {
        let container = dom.getContainer();
        let mixer = mixitup(container);
        let state = mixer.getState();

        chai.assert.equal(container.id, state.id);
    });

    it('should use any existing ID on the container as the mixer ID if present', () => {
        let container = dom.getContainer();
        let id = 'test-id';

        container.id = id;

        let mixer = mixitup(container);
        let state = mixer.getState();

        chai.assert.equal(id, state.id);
    });

    it('should not allow multiple instance to be instantiated on a single container', () => {
        let container = dom.getContainer();

        let mixer1 = mixitup(container, {
            debug: {
                enable: true
            }
        });

        let mixer2 = mixitup(container, {
            debug: {
                enable: true,
                showWarnings: false
            }
        });

        let facade = mixitup(container);

        chai.assert.equal(mixer1, mixer2);
        chai.assert.notEqual(facade, mixer1);
        chai.assert.notEqual(facade, mixer2);
    });
});
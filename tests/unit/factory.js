'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

describe('mixitup()', () => {
    let config = {
        controls: {
            enable: false
        }
    };

    it('should throw an error if no container reference', () => {
        chai.assert.throws(() => mixitup(config), Error, mixitup.messages.errorFactoryInvalidContainer());
    });

    it('should throw an error if a null container reference is passed', () => {
        chai.assert.throws(() => mixitup(null, config), Error, mixitup.messages.errorFactoryInvalidContainer());
    });

    it('should throw an error if an invalid container reference is passed', () => {
        chai.assert.throws(() => mixitup({}, config), Error, mixitup.messages.errorFactoryInvalidContainer());
    });

    it('should throw an error if an invalid reference or selector is passed', function() {
        chai.assert.throws(() => mixitup(false, config), Error, mixitup.messages.errorFactoryInvalidContainer());
    });

    it('should throw an error if an invalid configuration option is passed', function() {
        let container = dom.getContainer();

        chai.assert.throws(() => {
            mixitup(container, {
                animations: {}
            }, {
                controls: {
                    enable: false
                }
            });
        }, TypeError);
    });

    it('should accept an element reference as a container', () => {
        let container = dom.getContainer();
        let mixer = mixitup(container, config);

        chai.assert.isOk(mixer);

        mixer.destroy();
    });

    it('should accept a container selector', () => {
        let container = dom.getContainer();

        document.body.appendChild(container);

        // NB: Querying by className can bind the wrong mixer and interfere with other tests

        container.id = 'unique-id';

        let mixer = mixitup('#unique-id', config);
        let state = mixer.getState();

        chai.assert.isOk(mixer);
        chai.assert.equal(state.container, window.document.querySelector('#unique-id'));

        mixer.destroy();
    });

    it('should accept a container and valid configuration object', function() {
        let container = dom.getContainer();
        let mixer = mixitup(container, {
            selectors: {
                target: '[data-ref="mix"]'
            },
            controls: {
                enable: false
            }
        });

        let state = mixer.getState();

        chai.assert.isOk(mixer);
        chai.assert.equal(state.activeFilter.selector, '[data-ref="mix"]');

        mixer.destroy();
    });

    it('should throw an error if the container selector yields no element', () => {
        chai.assert.throws(() => mixitup('.invalid-container-selector', config), Error, mixitup.messages.errorFactoryContainerNotFound());
    });

    it('should return an instance of a facade by default', () => {
        let container = dom.getContainer();
        let mixer = mixitup(container, config);

        chai.assert.instanceOf(mixer, mixitup.Facade);

        mixer.destroy();
    });

    it('should return an instance of a mixer if debug mode enabled', () => {
        let container = dom.getContainer();
        let mixer = mixitup(container, {
            debug: {
                enable: true
            },
            controls: {
                enable: false
            }
        });

        chai.assert.instanceOf(mixer, mixitup.Mixer);

        mixer.destroy();
    });

    it('should return a single instance of a mixer, wrapping the first element if multiple elements passed', () => {
        let elementList = [
            dom.getContainer(),
            dom.getContainer()
        ];

        let mixer = mixitup(elementList, {
            debug: {
                enable: true
            },
            controls: {
                enable: false
            }
        });

        chai.assert.instanceOf(mixer, mixitup.Mixer);
        chai.assert.equal(mixer.getState().container, elementList[0]);

        mixer.destroy();
    });

    it('should return an instance of a collection if multiple elements passed and `returnCollection` specified', () => {
        let elementList = [
            dom.getContainer(),
            dom.getContainer()
        ];

        let collection = mixitup(elementList, config, void(0), true);

        chai.assert.instanceOf(collection, mixitup.Collection);
        chai.assert.instanceOf(collection[0], mixitup.Facade);
        chai.assert.instanceOf(collection[1], mixitup.Facade);

        collection.mixitup('destroy');
    });

    it('should add a unique ID to the container if no ID present', () => {
        let container = dom.getContainer();
        let mixer = mixitup(container, config);
        let state = mixer.getState();

        chai.assert.equal(container.id, state.id);

        mixer.destroy();
    });

    it('should use any existing ID on the container as the mixer ID if present', () => {
        let container = dom.getContainer();
        let id = 'test-id';

        container.id = id;

        let mixer = mixitup(container, config);
        let state = mixer.getState();

        chai.assert.equal(id, state.id);

        mixer.destroy();
    });

    it('should not allow multiple instance to be instantiated on a single container', () => {
        let container = dom.getContainer();

        let mixer1 = mixitup(container, {
            debug: {
                enable: true
            },
            controls: {
                enable: false
            }
        });

        let mixer2 = mixitup(container, {
            debug: {
                enable: true,
                showWarnings: false
            },
            controls: {
                enable: false
            }
        });

        let facade = mixitup(container);

        chai.assert.equal(mixer1, mixer2);
        chai.assert.notEqual(facade, mixer1);
        chai.assert.notEqual(facade, mixer2);

        mixer1.destroy();
    });
});
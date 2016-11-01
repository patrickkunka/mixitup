require('jsdom-global')();

var chai    = require('chai');
var dom     = require('../mock/dom');
var mixitup = require('../../dist/mixitup.js');

describe('mixitup()', function() {
    it('should throw an error if no container reference', function() {
        chai.assert.throws(function() {
            mixitup();
        }, Error, mixitup.messages.ERROR_FACTORY_INVALID_CONTAINER());
    });

    it('should throw an error if a null container reference is passed', function() {
        chai.assert.throws(function() {
            mixitup(null);
        }, Error, mixitup.messages.ERROR_FACTORY_INVALID_CONTAINER());
    });

    it('should throw an error if an invalid container reference is passed', function() {
        chai.assert.throws(function() {
            mixitup({});
        }, Error, mixitup.messages.ERROR_FACTORY_INVALID_CONTAINER());
    });

    it('should throw an error if an invalid reference or selector is passed', function() {
        chai.assert.throws(function() {
            mixitup(false);
        }, Error, mixitup.messages.ERROR_FACTORY_INVALID_CONTAINER());
    });

    it('should accept an element reference as a container', function() {
        var container = dom.getContainer();
        var mixer = mixitup(container);

        chai.assert.isOk(mixer);
    });

    it('should accept a container selector', function() {
        var container = dom.getContainer();

        window.document.open();
        window.document.write(container.outerHTML);
        window.document.close();

        var mixer = mixitup('.container');
        var state = mixer.getState();

        chai.assert.isOk(mixer);
        chai.assert.equal(state.container, window.document.querySelector('.container'));
    });

    it('should throw an error if the container selector yields no element', function() {
        chai.assert.throws(function() {
            mixitup('.invalid-container-selector');
        }, Error, mixitup.messages.ERROR_FACTORY_CONTAINER_NOT_FOUND());
    });

    it('should return an instance of a facade by default', function() {
        var container = dom.getContainer();
        var mixer = mixitup(container);

        chai.assert.instanceOf(mixer, mixitup.Facade);
    });

    it('should return an instance of a mixer if debug mode enabled', function() {
        var container = dom.getContainer();
        var mixer = mixitup(container, {
            debug: {
                enable: true
            }
        });

        chai.assert.instanceOf(mixer, mixitup.Mixer);
    });

    it('should return a single instance of a mixer, wrapping the first element if multiple elements passed', function() {
        var elementList = [
            dom.getContainer(),
            dom.getContainer()
        ];

        var mixer = mixitup(elementList, {
            debug: {
                enable: true
            }
        });

        chai.assert.instanceOf(mixer, mixitup.Mixer);
        chai.assert.equal(mixer.getState().container, elementList[0]);
    });

    it('should return an instance of a collection if multiple elements passed and `returnCollection` specified', function() {
        var elementList = [
            dom.getContainer(),
            dom.getContainer()
        ];

        var collection = mixitup(elementList, void(0), void(0), true);

        chai.assert.instanceOf(collection, mixitup.Collection);
        chai.assert.instanceOf(collection[0], mixitup.Facade);
        chai.assert.instanceOf(collection[1], mixitup.Facade);
    });

    it('should add a unique ID to the container if no ID present', function() {
        var container = dom.getContainer();
        var mixer = mixitup(container);
        var state = mixer.getState();

        chai.assert.equal(container.id, state.id);
    });

    it('should use any existing ID on the container as the mixer ID if present', function() {
        var container = dom.getContainer();
        var id = 'test-id';

        container.id = id;

        var mixer = mixitup(container);
        var state = mixer.getState();

        chai.assert.equal(id, state.id);
    });

    it('should not allow multiple instance to be instantiated on a single container', function() {
        var container = dom.getContainer();

        var mixer1 = mixitup(container, {
            debug: {
                enable: true
            }
        });
        var mixer2 = mixitup(container, {
            debug: {
                enable: true,
                showWarnings: false
            }
        });

        var facade = mixitup(container);

        chai.assert.equal(mixer1, mixer2);
        chai.assert.notEqual(facade, mixer1);
        chai.assert.notEqual(facade, mixer2);
    });
});
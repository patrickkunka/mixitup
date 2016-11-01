require('jsdom-global')();

var chai    = require('chai');
var dom     = require('../mock/dom');
var mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-as-promised'));
chai.use(require('chai-shallow-deep-equal'));

describe('mixitup()', function() {
    it('should throw an error if no container reference or selector passed', function() {
        chai.assert.throws(function() {
            mixitup();
        }, Error, mixitup.messages.ERROR_FACTORY_INVALID_CONTAINER());
    });

    it('should throw an error if an invalid reference or selector passed', function() {
        chai.assert.throws(function() {
            mixitup(false);
        }, Error, mixitup.messages.ERROR_FACTORY_INVALID_CONTAINER());
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
});
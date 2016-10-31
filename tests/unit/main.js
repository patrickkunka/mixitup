require('jsdom-global')();

var chai    = require('chai');
var mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-as-promised'));
chai.use(require('chai-shallow-deep-equal'));

describe('mixitup', function() {
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
        var container = document.createElement('div');
        var mixer = mixitup(container);

        chai.assert.instanceOf(mixer, mixitup.Facade);
    });

    it('should return an instance of a mixer if debug mode enabled', function() {
        var container = document.createElement('div');
        var mixer = mixitup(container, {
            debug: {
                enable: true
            }
        });

        chai.assert.instanceOf(mixer, mixitup.Mixer);
    });
});
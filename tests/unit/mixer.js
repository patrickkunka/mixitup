require('jsdom-global')();

var chai    = require('chai');
var dom     = require('../mock/dom');
var mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-as-promised'));
chai.use(require('chai-shallow-deep-equal'));

describe('mixitup.Mixer', function() {
    describe('#getState()', function() {
        var container = dom.getContainer();
        var mixer = mixitup(container);
        var state = mixer.getState();

        it('should contain a reference to the container element', function() {
            chai.assert.equal(state.container, container);
        });

        it('should contain a list of targets deeply equaling the contents of the container', function() {
            var container = dom.getContainer();
            var mixer = mixitup(container);
            var state = mixer.getState();

            chai.assert.deepEqual(state.targets, Array.prototype.slice.apply(container.children));
        });
    });
});
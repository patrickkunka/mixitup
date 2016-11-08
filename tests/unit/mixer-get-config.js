'use strict';

require('jsdom-global')();

const chai          = require('chai');
const dom           = require('../mock/dom');
const mixitup       = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('mixitup.Mixer', () => {
    let container   = dom.getContainer();
    let mixer       = mixitup(container);

    describe('#getConfig()', () => {
        it('should retrieve the whole config object if no stringKey passed', () => {
            let config = mixer.getConfig();

            chai.assert.instanceOf(config, mixitup.Config);
        });

        it('should retrieve a config sub-object if single prop stringKey passed', () => {
            let config = mixer.getConfig('animation');

            chai.assert.instanceOf(config, mixitup.ConfigAnimation);
        });

        it('should retrieve a nested property value if multi-prop stringKey passed', () => {
            let config = mixer.getConfig('animation.effects');

            chai.assert.equal(typeof config, 'string');
        });
    });
});
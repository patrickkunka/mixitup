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

        it('should retrieve a the current configuration, reflective of any changes', () => {
            let newEffects = 'fade translateZ(-100px)';

            mixer.configure({
                animation: {
                    effects: newEffects
                }
            });

            let newConfig = mixer.getConfig('animation.effects');

            chai.assert.equal(newConfig, newEffects);
        });

        it('should throw an error if an invalid configuration option is passed', function() {
            chai.assert.throws(() => {
                mixer.configure({
                    animations: {}
                });
            }, TypeError, mixitup.messages.errorConfigInvalidProperty({
                erroneous: 'animations',
                suggestion: mixitup.messages.errorConfigInvalidPropertySuggestion({
                    probableMatch: 'animation'
                })
            }));
        });
    });
});
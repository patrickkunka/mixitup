'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('mixitup.Mixer', () => {
    describe('Queue', () => {
        let container = dom.getContainer();
        let mixer = mixitup(container, {
            debug: {
                fauxAsync: true
            },
            animation: {
                duration: 100
            }
        });

        it('should warn if too many operations are pushed into the queue', () => {
            let promise = Promise.all([
                mixer.show(),
                mixer.hide(),
                mixer.show(),
                mixer.hide(),
                mixer.show()
            ]);

            chai.assert.isFulfilled(promise);
        });
    });
});

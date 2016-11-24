'use strict';

require('jsdom-global')();

const chai          = require('chai');
const dom           = require('../mock/dom');
const mixitup       = require('../../dist/mixitup.js');
const JSONDataset   = require('../mock/dataset');
const dataset       = JSONDataset.map(data => new dom.Item(data));

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('mixitup.Mixer', () => {
    describe('Queue', () => {
        it('should warn if too many multimix operations are pushed into the queue', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container, {
                debug: {
                    fauxAsync: true
                },
                animation: {
                    duration: 200
                }
            });

            let promise = Promise.all([
                mixer.hide(),
                mixer.show(),
                mixer.hide(),
                mixer.show(),
                mixer.hide()
            ]);

            chai.assert.isFulfilled(promise);

            return promise;
        });

        it('should warn if too many dataset operations are pushed into the queue', () => {
            let container = dom.getContainer();

            let mixer = mixitup(container, {
                debug: {
                    fauxAsync: true
                },
                animation: {
                    duration: 200
                },
                data: {
                    uidKey: 'id'
                },
                load: {
                    dataset: dataset
                }
            });

            let promise = Promise.all([
                mixer.dataset([]),
                mixer.dataset(dataset),
                mixer.dataset([]),
                mixer.dataset(dataset),
                mixer.dataset([])
            ]);

            chai.assert.isFulfilled(promise);

            return promise;
        });
    });
});

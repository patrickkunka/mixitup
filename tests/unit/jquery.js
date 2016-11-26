'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const dataset = require('../mock/dataset');
const mixitup = require('../../dist/mixitup.js');
const $       = require('jquery');

describe('mixitup()', () => {
    it('should add a .mixItUp() method to jQuery if passed to .use() ', () => {
        mixitup.use($);

        chai.assert.typeOf($.fn.mixItUp, 'function');
    });

    it('should provide instantiation via the v2 jQuery API', () => {
        let $container = $(dom.getContainer());

        $container.mixItUp();

        chai.assert.isOk($container[0].id);
    });

    it('should accept a configuration object via the v2 jQuery API', () => {
        let $container = $(dom.getContainer());
        let state;

        $container.mixItUp({
            load: {
                filter: 'none'
            }
        });

        state = $container.mixItUp('getState');

        chai.assert.instanceOf(state, mixitup.State);
    });

    it('should allow methods to be called via the v2 jQuery API', () => {
        let $container = $(dom.getContainer());

        $container.mixItUp({
            load: {
                filter: 'none'
            }
        });

        return new Promise(resolve => {
            $container.mixItUp('filter', 'all', resolve);
        })
            .then(state => {
                chai.assert.instanceOf(state, mixitup.State);
                chai.assert.equal(state.activeFilter.selector, '.mix');
            });
    });
});
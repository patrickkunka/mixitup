'use strict';

require('jsdom-global')();

const chai      = require('chai');
const dom       = require('../mock/dom');
const extension = require('../mock/extension');
const mixitup   = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('Extension', () => {
    it('should register itself via the mixitup.use() method', () => {
        mixitup.use(extension);

        chai.assert.isOk(mixitup.extensions[extension.NAME]);
    });
});
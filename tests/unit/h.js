'use strict';

const chai    = require('chai');
const mixitup = require('../../dist/mixitup.js');

const h       = mixitup.h;

describe('h#compareVersions()', () => {
    it('should return true if versions are matching', () => {
        let result = h.compareVersions('1.0.0', '1.0.0');

        chai.assert.isOk(result);
    });

    it('should return false if specimen version is less than control', () => {
        let result = h.compareVersions('1.0.0', '0.1.2');

        chai.assert.isNotOk(result);
    });

    it('should return true if specimen version is greater than control', () => {
        let result = h.compareVersions('1.0.0', '1.1.2');

        chai.assert.isOk(result);
    });

    it('should return true if specimen version is greater than control, with double figures', () => {
        let result = h.compareVersions('3.0.0', '10.1.2');

        chai.assert.isOk(result);
    });

    it('should handle semver carat notation', () => {
        let result = h.compareVersions('^3.0.0', '2.0.0');

        chai.assert.isNotOk(result);
    });

    it('should handle semver label notation', () => {
        let result = h.compareVersions('^3.0.0', '3.0.0-beta');

        chai.assert.isOk(result);
    });
});

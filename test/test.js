/* global describe, before, it */

'use strict';

const assert = require('assert');
const path = require('path');
const scraper = require('../src/scraper');

describe('catalog.js', function () {
  let catalog;

  before(function (done) {
    scraper('201590')
    .catalogFromFile(path.join(__dirname, 'test.xml'))
    .then(function (scraped) {
      catalog = scraped;
      done();
    });
  });

  describe('catalog', function () {
    it('should have 886 courses', function () {
      assert.equal(catalog.courses.length, 886);
    });

    it('should parse the Middlebury catalog link', function () {
      assert.equal(catalog.href, 'http://catalog.middlebury.edu/offerings/searchxml/catalog/catalog%2FMCUG/term/term%2F201590/level/topic%2Flevel%2FUG/type/genera%3Aoffering%2FLCT/type/genera%3Aoffering%2FLAB/type/genera%3Aoffering%2FDSC/type/genera%3Aoffering%2FPE/type/genera%3Aoffering%2FSEM/location/resource%2Fplace%2Fcampus%2FM/time_start/0/time_end/86400/search/Search');
    });

    it('should parse the term', function () {
      assert.equal(catalog.term.id, '201590');
      assert.equal(catalog.term.text, 'Fall 2015');
      assert.equal(catalog.term.href, 'http://catalog.middlebury.edu/terms/view/catalog/catalog%2FMCUG/term/term%2F201590');
      assert.equal(catalog.term.season, 'fall');
      assert.equal(catalog.term.year, '2015');
    });
  });

  describe('course', function () {

    describe('title', function () {
      it('should parse the title', function() {
        assert.equal(catalog.courses[0].title, 'Politics, Media, Pop. Culture');
      });
    });

    describe('href', function () {
      it('should parse the href', function () {
        assert.equal(catalog.courses[0].href, 'http://catalog.middlebury.edu/offerings/view/catalog/catalog%2FMCUG/offering/section%2F201590%2F92348');
      });
    });

    describe('code', function () {
      it('should parse the course code', function () {
        assert.equal(catalog.courses[0].code, 'AMST0102A-F15');
      });
    });


  });
});

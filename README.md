## catalog.js

### A JavaScript API for the Middlebury course catalog.

[![Build Status](https://travis-ci.org/coursereviews/catalog.js.svg?branch=master)](https://travis-ci.org/coursereviews/catalog.js)

## Install

```sh
$ npm install --save middlebury-catalog
```

## Examples

Scrape the course catalog for term `201590`. The URL is automatically
constructed based on the term.

```js
const catalog = require('middlebury-catalog');

catalog('201590')
  .catalogFromUrl()
  .then(function (catalog) {
    console.log(catalog.courses[0]);
  });
```

Specify an XML file to scrape from. You must still provide a term to catalog.

```js
const catalog = require('middlebury-catalog');

catalog('201590')
  .catalogFromFile('test/test.xml')
  .then(function (catalog) {
    console.log(catalog.courses[0]);
  });
```

## Develop

Clone the repository then run:

```sh
$ npm install
```

Run the tests with:

```
$ npm test
```

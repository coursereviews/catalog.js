# catalog.js

A JavaScript API for the Middlebury course catalog.

## Usage

Scrape from url

```js
var scraper = require('./src/scraper');

// the scraper is able to construct the url given a term
scraper('201590').catalogFromUrl()
.then(function (xml) {
  console.log(xml);
});
```

Scrape from file

```js
var scraper = require('./src/scraper');

scraper('201590').catalogFromFile('test/test.xml')
.then(function (xml) {
  console.log(xml);
});
```


## Develop

Clone the repository then run

```sh
$ npm install
```

and run the tests with

```
$ npm test
```

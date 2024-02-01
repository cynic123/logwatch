# random-syllable

> Return a semi-speakable syllable, 2 or 3 letters.


[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/mock-end/random-syllable/blob/master/LICENSE)

[![build:?](https://img.shields.io/travis/mock-end/random-syllable/master.svg?style=flat-square)](https://travis-ci.org/mock-end/random-syllable)
[![coverage:?](https://img.shields.io/coveralls/mock-end/random-syllable/master.svg?style=flat-square)](https://coveralls.io/github/mock-end/random-syllable)


## Install

```
$ npm install --save random-syllable
```

## Usage

```js
var randomSyllable = require('random-syllable');

// API
// - randomSyllable([options]);

// options
// - length


randomSyllable();
// => fop

randomSyllable({ length: 2 });
// => ji
```

## Related

- [random-lorem](https://github.com/mock-end/random-lorem) - Return a semi-pronounceable random (nonsense) word.
- [random-title](https://github.com/mock-end/random-title) - Return a random title populated by semi-pronounceable random (nonsense) words.
- [random-sentence](https://github.com/mock-end/random-sentence) - Return a random sentence populated by semi-pronounceable random (nonsense) words.
- [random-paragraph](https://github.com/mock-end/random-paragraph) - Return a random paragraph generated from sentences populated by semi-pronounceable random (nonsense) words.


## Contributing

Pull requests and stars are highly welcome.

For bugs and feature requests, please [create an issue](https://github.com/mock-end/random-syllable/issues/new).

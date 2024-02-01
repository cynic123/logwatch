'use strict';

var clamp         = require('clamp');
var isObject      = require('is-object');
var toInteger     = require('to-integer');
var randomChar    = require('random-char');
var randomNatural = require('random-natural');

module.exports = function (options) {

  var length = isObject(options)
    ? options.length
    : options;

  if (length) {
    length = toInteger(length);
    length = clamp(length, 2, 3);
  } else {
    length = randomNatural({ min: 2, max: 3 });
  }

  var consonants = 'bcdfghjklmnprstvwz'; // consonants except hard to speak ones
  var vowels = 'aeiou';                  // vowels
  var all = consonants + vowels;         // all

  var text = '';
  var char;

  for (var i = 0; i < length; i++) {
    if (i === 0) {
      // First character can be anything
      char = randomChar({ pool: all });
    } else if (consonants.indexOf(char) === -1) {
      // Last character was a vowel, now we want a consonant
      char = randomChar({ pool: consonants });
    } else {
      // Last character was a consonant, now we want a vowel
      char = randomChar({ pool: vowels });
    }

    text += char;
  }

  return text;
};

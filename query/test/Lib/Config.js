
'use strict'

const chai = require('chai');
chai.use(require('chai-http'));

var app = require('../../app');

module.exports.chai = chai;
module.exports.app = app;
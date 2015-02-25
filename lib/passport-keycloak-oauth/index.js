'use strict';

var utils = require('./utils');

var OAuth2Strategy = require('./oauth2');

require('pkginfo')(module, 'version');

exports.Strategy =
exports.OAuth2Strategy = OAuth2Strategy;
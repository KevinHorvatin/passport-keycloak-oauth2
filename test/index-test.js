/*global describe, it */
'use strict';
var should = require('should');
var keycloak = require('../lib/passport-keycloak-oauth');

describe('passport-keycloak-oath module', function () {
  it('should report a version', function() {
    keycloak.version.should.be.instanceof(String);
  });
  it('should export OAuth 2.0 strategy', function() {
    keycloak.Strategy.should.be.instanceof(Function);
    keycloak.OAuth2Strategy.should.be.instanceof(Function);
    keycloak.Strategy.should.equal(keycloak.OAuth2Strategy);  
  });
});

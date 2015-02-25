/*global describe, it */
'use strict';
var should = require('should');
var kcUtils = require('../lib/passport-keycloak-oauth/utils.js');

describe('keycloak utils module', function () {
  describe('transform method', function() {
    it('should transform object keys with "-" to "_"', function() {
      var options = { 'my-funky-name' : 'funky',
                      'cantTouchThis' : 'hammerTime' };
      var newOptions = kcUtils.transform(options);
      newOptions.my_funky_name.should.equal('funky');
      newOptions.cantTouchThis.should.equal('hammerTime');
      should.not.exist(newOptions['my-funky-name']);
    });
    it('should return empty object, when given empty object', function() 
    {
      var options = kcUtils.transform({});
      /* jshint ignore: start */
      options.should.be.empty;
      /* jshint ignore: end */
    });
  });
  describe('loadConfig method',

   function() {
    it('should load keycloak file and transform config keys', function ()
    {
      var options = kcUtils.loadConfig (__dirname+'/keycloak.json');
      options.realm.should.equal('keycloakRealm');
      options.auth_server_url.should.equal('https://keycloak.example.com/auth');
    });
    it('should throw an error when given a bad file name', function()
    {
      var caughtError = false;
      try {
        var options = kcUtils.loadConfig ('/no/such/file');
      } catch (e) {
        e.message.should.equal('Unable to read config options from: /no/such/file');
        caughtError = true;
      }
      caughtError.should.equal(true, 'Bogus filename did not throw error');
    });
  });
  describe('mapOptions method', function() {
    it('should map keycloak fields to OAuth 2.0 fields', function() {
      var options = {
         "realm": "keycloakRealm",
         "auth_server_url": "https://keycloak.example.com/auth",
         "resource": "kc-resource",
         "public_client": "true"
      };
      var oauth2 = kcUtils.mapOptions(options);

      oauth2.clientID.should.equal(options.resource);
      oauth2.clientSecret.should.equal("xx");
      oauth2.authorizationURL.should.equal("https://keycloak.example.com/auth/realms/keycloakRealm/protocol/openid-connect/login");
      oauth2.tokenURL.should.equal("https://keycloak.example.com/auth/realms/keycloakRealm/protocol/openid-connect/access/codes");
    });
    it('should map keycloak options when public-client is false', function() {
      var options = {
         "realm": "keycloakRealm",
         "auth_server_url": "https://keycloak.example.com/auth",
         "resource": "kc-resource",
         "credentials": {
            "secret": "secret, secret, i've got a secret"
         }
      };
      var oauth2 = kcUtils.mapOptions(options);

      oauth2.clientID.should.equal(options.resource);
      oauth2.clientSecret.should.equal("secret, secret, i've got a secret");
      oauth2.authorizationURL.should.equal("https://keycloak.example.com/auth/realms/keycloakRealm/protocol/openid-connect/login");
      oauth2.tokenURL.should.equal("https://keycloak.example.com/auth/realms/keycloakRealm/protocol/openid-connect/access/codes");
    });
    it('should throw an error if configuration is missing secret for when public_client is falsey', function () {
      var options = {
         "realm": "keycloakRealm",
         "auth_server_url": "https://keycloak.example.com/auth",
         "resource": "kc-resource"
      };
      var caughtError = false;
      try {
        var oauth2 = kcUtils.mapOptions(options);
      } catch (e) {
        e.message.should.equal('Configuration requires credentials.secret');
        caughtError = true;
      }
      caughtError.should.equal(true);
    });
  });
  describe('getUserInfoURL method', function(){
    it('should create the correct url for a realm.', function() {
      var options = {
         "realm": "keycloakRealm",
         "auth_server_url": "https://keycloak.example.com/auth" 
       };
       var userInfoURL = kcUtils.getUserInfoURL(options);
       userInfoURL.should.equal("https://keycloak.example.com/auth/realms/keycloakRealm/protocol/openid-connect/userinfo");
    });
  });
});
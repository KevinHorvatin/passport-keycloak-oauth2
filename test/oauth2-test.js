/*global describe, it */
'use strict';
var should = require('should');
var KeycloakStrategy = require('../lib/passport-keycloak-oauth/oauth2');

describe('KeycloakStrategy', function () {
  it('should have name keycloak', function() {
    var keycloakStrategy = new KeycloakStrategy({
      realm: 'keycloakRealm',
      auth_server_url: 'https://keycloak.example.com/auth',
      clientID: 'id',
      clientSecret: 'xx'
    });
    should.exist(keycloakStrategy);
    keycloakStrategy.name.should.equal('keycloak');
  });
  it('should load keycloak.json and set all OAuth required options', function() {
    var keycloakStrategy = new KeycloakStrategy({ keycloakFile: __dirname+'/keycloak.json' });
    keycloakStrategy.options.realm.should.equal('keycloakRealm', 'Unable to find the realm.');
  });

  it('should load keycloak-public.json and set clientSecret to default value', function() {
    var keycloakStrategy = new KeycloakStrategy({ keycloakFile: __dirname+'/public-keycloak.json' });
    keycloakStrategy.options.clientSecret.should.equal('xx', 'Unable to find default clientSecret.');
  });
});
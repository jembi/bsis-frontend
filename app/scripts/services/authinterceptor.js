'use strict';

angular.module('bsis')
  .factory('Authinterceptor', function (Base64) {

    var user = localStorage.getItem('loggedOnUser');
    user = JSON.parse(user);

    var auth = localStorage.getItem('auth');

    return {
      'setLoggedInUser': function (u,authheader) {
        user = u;
        localStorage.setItem('loggedOnUser', JSON.stringify( user ));
        auth = authheader;
        localStorage.setItem('auth', auth);
      },
      'getLoggedInUser': function() {
        var user = localStorage.getItem('loggedOnUser');
        user = JSON.parse(user);
        return user;
      },
      'removeLoggedInUser': function () {
        user = null;
        localStorage.removeItem('loggedOnUser');
        auth = null;
        localStorage.removeItem('auth');
      },
      'request': function (config) {

        if (user) {
          config.headers.authorization = 'Basic ' + auth;
        }

        return config;
      }
    };
  }).config(function ($httpProvider) {
    $httpProvider.interceptors.push('Authinterceptor');
  });
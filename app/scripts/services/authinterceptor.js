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
      'request': function (config) {

        if (user) {

          var requestTS = new Date().toISOString();
          try {
            /**
             * Try and synchronize with server time
             *
             */
            requestTS = new Date(Math.abs(new Date().getTime() + user.timeDiff)).toISOString();
          } catch (e) {
            console.log(e.message);
          }
          var username = user.username;

          //$http.defaults.headers.common.Authorization = 'Basic ' + auth;
          config.headers.authorization = 'Basic ' + auth;

          /*config.headers['auth-username'] = username;
          config.headers['auth-ts'] = requestTS;
          config.headers['auth-salt'] = requestSalt;
          config.headers['auth-token'] = hash.toString(CryptoJS.enc.Hex);
          */
        }

        return config;
      }
    };
  }).config(function ($httpProvider) {
    $httpProvider.interceptors.push('Authinterceptor');
  });
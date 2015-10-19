'use strict';

/* NB! remember to include the factory (Alerting) into your Controllers */
/* <alert ng-repeat="alert in alerts.top" type="alert.type" close="closeAlert('top', $index)">{{alert.msg}}</alert> */

angular.module('bsis')
  .factory('Alerting', function ($rootScope) {

    var alerts = {};

    return {
      AlertAddMsg: function (alertScope, alertType, alertMsg) {

        // check if alertScope object exists
        if ( !alerts[alertScope] ){
          alerts[alertScope] = [];
        }

        // create alertObject
        var alertObject = { type: alertType, msg: alertMsg };

        // push alertObject to appropriate alertScope
        alerts[alertScope].push(alertObject);

      },
      AlertAddServerMsg: function (errCode) {

        var alertMsg;
        switch (errCode){
          case 403:
            alertMsg = 'The request has been forbidden by the server. Please contact the server administrator';
            break;
          case 404:
            alertMsg = 'The request resource could not be found';
            break;
          default:
            alertMsg = 'A server-side error has occurred. Please contact the server administrator';
        }

        // check if server object exists
        if ( !alerts.server ){
          alerts.server = [];
        }

        // create alertObject
        var alertObject = { type: 'danger', msg: alertMsg };

        // push alertObject to appropriate alertScope
        alerts.server.push(alertObject);

      },
      AlertReset: function (alertScope) {

        if( !alertScope ){
          // reset the alerts objects
          alerts = {};
        }else{
          if ( alerts ){
            // reset the alerts objects
            alerts[alertScope] = undefined;
          }
        }

      },
      AlertValidationMsgs: function () {

        validationRequiredMsg = 'This field is required!';
        validationPasswordConfirmMsg = 'Please confirm you password!';
        validationFormErrorsMsg = 'There appears to be some errors in your form. Please correct and try again.';

      },

      AlertClose: function (alertScope, index) {
        alerts[alertScope].splice(index, 1);
      },

      getAlerts: function () {
        return alerts;
      }

    };

  })
  .run( function($rootScope, $location, Alerting) {

    // register listener to watch route changes
    $rootScope.$on( '$routeChangeStart', function() {
      // reset the alert object for each route changed
      if (!$location.search().persistErrors){
        Alerting.AlertReset();
      }

    });

  });

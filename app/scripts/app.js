'use strict';

var app = angular.module('bsis', [
  'ngRoute',
  'ui.bootstrap',
  'ngResource',
  'ngTable',
  'xeditable',
  'ui.select',
  'ngSanitize',
  'checklist-model',
  'ngMessages',
  '720kb.tooltips'

])
  .config(function($routeProvider, PERMISSIONS) {
    $routeProvider

      // DEFAULT VIEW - DISPLAY HOME PAGE IF USER AUTHENTICATED
      .when('/', {
        templateUrl : 'views/home.html',
        controller  : 'HomeCtrl',
        permission: PERMISSIONS.AUTHENTICATED
      })

      // LOGIN PAGE
      .when('/login', {
        templateUrl : 'views/login.html',
        controller  : 'LoginCtrl'
      })

      // LOGOUT PAGE
      .when('/logout', {
        templateUrl : 'views/login.html',
        controller  : 'LoginCtrl'
      })

      // HOME PAGE
      .when('/home', {
        templateUrl : 'views/home.html',
        controller  : 'HomeCtrl',
        permission: PERMISSIONS.AUTHENTICATED
      })

      // DONORS URLs
      .when('/donors', {
        templateUrl : 'views/donors.html',
        controller  : 'DonorsCtrl',
        permission: PERMISSIONS.VIEW_DONOR_INFORMATION
      })
      .when('/findDonor', {
        templateUrl : 'views/donors.html',
        controller  : 'DonorsCtrl',
        permission: PERMISSIONS.VIEW_DONOR
      })
      .when('/addDonor', {
        templateUrl : 'views/donors.html',
        controller  : 'AddDonorCtrl',
        permission: PERMISSIONS.ADD_DONOR
      })
      .when('/addDonation', {
        templateUrl : 'views/donors.html',
        controller  : 'AddDonationCtrl',
        permission: PERMISSIONS.ADD_DONATION
      })
      .when('/manageClinic', {
        templateUrl : 'views/donors.html',
        controller  : 'ViewDonationBatchCtrl',
        permission: PERMISSIONS.VIEW_DONATION_BATCH
      })
      .when('/exportDonorList', {
        templateUrl : 'views/donors.html',
        controller  : 'DonorListCtrl',
        permission: PERMISSIONS.EXPORT_CLINIC_DATA
      })
      .when('/viewDonor', {
        templateUrl : 'views/donors.html',
        controller  : 'ViewDonorCtrl',
        permission: PERMISSIONS.VIEW_DONOR
      })
      .when('/manageDonationBatches', {
        templateUrl : 'views/donors.html',
        controller  : 'DonorClinicCtrl',
        permission: PERMISSIONS.VIEW_DONATION_BATCH
      })

      // COMPONENTS URLs
      .when('/components', {
        templateUrl : 'views/components.html',
        controller  : 'ComponentsCtrl',
        permission: PERMISSIONS.VIEW_COMPONENT_INFORMATION
      })
      .when('/recordComponents', {
        templateUrl : 'views/components.html',
        controller  : 'ComponentsCtrl',
        permission: PERMISSIONS.ADD_COMPONENT
      })
      .when('/findComponents', {
        templateUrl : 'views/components.html',
        controller  : 'ComponentsCtrl',
        permission: PERMISSIONS.VIEW_COMPONENT
      })
      .when('/discardComponents', {
        templateUrl : 'views/components.html',
        controller  : 'ComponentsCtrl',
        permission: PERMISSIONS.DISCARD_COMPONENT
      })
      .when('/findDiscards', {
        templateUrl : 'views/components.html',
        controller  : 'ComponentsCtrl',
        permission: PERMISSIONS.VIEW_DISCARDS
      })

      // TESTING URLs
      .when('/testing', {
        templateUrl : 'views/testing.html',
        controller  : 'TestBatchCtrl',
        permission: PERMISSIONS.VIEW_TESTING_INFORMATION
      })
      .when('/viewTestResults', {
        templateUrl : 'views/testing.html',
        controller  : 'TestingCtrl',
        permission: PERMISSIONS.VIEW_TEST_OUTCOME
      })
      .when('/manageTestBatch', {
        templateUrl : 'views/testing.html',
        controller  : 'TestBatchCtrl',
        permission: PERMISSIONS.VIEW_TEST_BATCH
      })
      .when('/viewTestBatch', {
        templateUrl : 'views/testing.html',
        controller  : 'ViewTestBatchCtrl',
        permission: PERMISSIONS.VIEW_TEST_BATCH
      })
      .when('/manageTTITesting', {
        templateUrl : 'views/testing.html',
        controller  : 'RecordTestResultsCtrl',
        permission: PERMISSIONS.ADD_TTI_OUTCOME
      })
      .when('/managePendingTests', {
        templateUrl : 'views/testing.html',
        controller  : 'RecordTestResultsCtrl',
        permission: PERMISSIONS.ADD_TTI_OUTCOME
      })
      .when('/manageBloodGroupTesting', {
        templateUrl : 'views/testing.html',
        controller  : 'RecordTestResultsCtrl',
        permission: PERMISSIONS.ADD_BLOOD_TYPING_OUTCOME
      })
      .when('/manageBloodGroupMatchTesting', {
        templateUrl : 'views/testing.html',
        controller  : 'RecordTestResultsCtrl',
        permission: PERMISSIONS.ADD_BLOOD_TYPING_OUTCOME
      })
      .when('/uploadTestResults', {
        templateUrl : 'views/testing.html',
        controller  : 'TestingCtrl',
        permission: PERMISSIONS.ADD_TEST_OUTCOME
      })

      // INVENTORY URLs
      .when('/inventory', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        permission: PERMISSIONS.VIEW_INVENTORY_INFORMATION
      })
      .when('/manageInventory', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        permission: PERMISSIONS.VIEW_COMPONENT
      })
      .when('/transferComponents', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        permission: PERMISSIONS.ISSUE_COMPONENT
      })
      .when('/issueComponents', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        permission: PERMISSIONS.ISSUE_COMPONENT
      })
      .when('/componentUsage', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        permission: PERMISSIONS.VIEW_COMPONENT
      })

      // LABELLING URLs
      .when('/labelling', {
        templateUrl : 'views/labelling.html',
        controller  : 'LabellingCtrl',
        permission: PERMISSIONS.COMPONENT_LABELLING
      })
      .when('/labelComponents', {
        templateUrl : 'views/labelling.html',
        controller  : 'LabellingCtrl',
        permission: PERMISSIONS.COMPONENT_LABELLING
      })

      // REPORTS URLs
      .when('/reports', {
        templateUrl : 'views/reports.html',
        controller  : 'ReportsCtrl',
        permission: PERMISSIONS.VIEW_REPORTING_INFORMATION
      })

      // MOBILE URLs
      .when('/mobile', {
        templateUrl : 'views/mobile.html',
        controller  : 'MobileCtrl',
        permission: PERMISSIONS.VIEW_MOBILE_CLINIC_INFORMATION
      })

      // SETTINGS URLs
      .when('/settings', {
        templateUrl : 'views/settings.html',
        controller  : 'SettingsCtrl',
        permission: PERMISSIONS.AUTHENTICATED
      })
      .when('/locations', {
        templateUrl : 'views/settings.html',
        controller  : 'LocationsCtrl',
        permission: PERMISSIONS.MANAGE_DONATION_SITES
      })
      .when('/configurations', {
        templateUrl : 'views/settings.html',
        controller  : 'ConfigurationsCtrl',
        permission: PERMISSIONS.MANAGE_DONATION_SITES
      })
      .when('/manageConfiguration', {
        templateUrl : 'views/settings.html',
        controller  : 'ManageConfigurationsCtrl',
        permission: PERMISSIONS.MANAGE_DONATION_SITES
      })
      .when('/accountSettings', {
        templateUrl: 'views/settings.html',
        controller: 'AccountSettingsCtrl',
        permission: PERMISSIONS.AUTHENTICATED
      })
      .when('/users', {
        templateUrl : 'views/settings.html',
        controller : 'UsersCtrl',
        permission: PERMISSIONS.MANAGE_USERS
      })
      .when('/manageUser', {
        templateUrl : 'views/settings.html',
        controller : 'ManageUserCtrl',
        permission: PERMISSIONS.MANAGE_USERS
      })
      .when('/roles', {
        templateUrl : 'views/settings.html',
        controller : 'RolesCtrl',
        permission: PERMISSIONS.MANAGE_ROLES
      })
      .when('/manageRole', {
        templateUrl : 'views/settings.html',
        controller : 'ManageRolesCtrl',
        permission: PERMISSIONS.MANAGE_ROLES
      })
      .when('/packTypes', {
        templateUrl : 'views/settings.html',
        controller  : 'PackTypesCtrl',
        permission: PERMISSIONS.MANAGE_BLOOD_BAG_TYPES
      })
      .when('/managePackType', {
        templateUrl : 'views/settings.html',
        controller  : 'ManagePackTypesCtrl',
        permission: PERMISSIONS.MANAGE_BLOOD_BAG_TYPES
      })
      .when('/deferralReasons', {
        templateUrl : 'views/settings.html',
        controller : 'DeferralReasonsCtrl',
        permission: PERMISSIONS.MANAGE_ROLES
      })
      .when('/manageDeferralReason', {
        templateUrl : 'views/settings.html',
        controller : 'ManageDeferralReasonsCtrl',
        permission: PERMISSIONS.MANAGE_ROLES
      })
      .when('/discardReasons', {
        templateUrl : 'views/settings.html',
        controller : 'DiscardReasonsCtrl',
        permission: PERMISSIONS.MANAGE_DISCARD_REASONS
      })
      .when('/manageDiscardReason', {
        templateUrl : 'views/settings.html',
        controller : 'ManageDiscardReasonsCtrl',
        permission: PERMISSIONS.MANAGE_DISCARD_REASONS
      })
      .when('/donationTypes', {
        templateUrl : 'views/settings.html',
        controller : 'DonationTypesCtrl',
        permission: PERMISSIONS.MANAGE_DISCARD_REASONS
      })
      .when('/manageDonationType', {
        templateUrl : 'views/settings.html',
        controller : 'ManageDonationTypesCtrl',
        permission: PERMISSIONS.MANAGE_DISCARD_REASONS
      })

      .otherwise({
        redirectTo: '/home'
      });
  })

  .run(function(editableOptions) {
    editableOptions.theme = 'bs3';
  })

  .run( ['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {

    // on route change, check to see if user has appropriate permissions
    $rootScope.$on('$routeChangeStart', function(scope, next, current) {

      // set initial accessDenied value to false
      if (!($rootScope.accessDenied === true && $location.path() == '/home')){
        $rootScope.accessDenied = false;
      }

      var permission = next.$$route.permission;

      // if the required permission is not in the current user's permissions list, redirect to home page and display alert
      if (permission !== undefined && $rootScope.sessionUserPermissions.indexOf(permission) <= -1){
        $rootScope.accessDenied = true;
        $location.path('/home');
      }
    });

  }])

  .run( ['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {

    $rootScope.$on('$locationChangeStart', function(event){

      // Retrieve the session from storage
      var consoleSession = AuthService.getSession();

      //used to control if header is displayed
      $rootScope.displayHeader = false;

      //check if session exists
      if( consoleSession ){
        //check if session has expired
        var currentTime = new Date();
        currentTime = currentTime.toISOString();
        if( currentTime >= consoleSession.expires ){
          //session expired - user needs to log in
          AuthService.logout();
          $location.path( "/login" );
        }else{
          AuthService.refreshSession();
        }

      }else{
        // no session - user needs to log in
        $location.path( "/login" );
      }

      /*
      //console.log("in locationChangeStart: ");
      //if (!AuthService.isAuthorized($location.path)) {
      if (!$rootScope.isLoggedIn){
        //console.log("Attempt to access unauthorized route");
        // event.preventDefault();
        if($rootScope.isLoggedIn) {
            $location.path( "/home" );
        } else {
            $location.path( "/" );
        }
      }
      */
    });
  }])

  .directive('bsisTabTo', [function () {
    return {
      restrict: "A",
      link: function (scope, el, attrs) {
        el.bind('keyup', function(e) {
          if (this.value.length === this.maxLength) {
            var element = document.getElementById(attrs.bsisTabTo);
            if (element)
              element.focus();
          }
        });
      }
    };
  }])

  /* Custom directive to capitalize the first lettter of input fields */
  .directive('capitalizeFirstLetter', ['$parse', function($parse) {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
          var capitalize = function(inputValue) {
             var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
             if(capitalized !== inputValue) {
                modelCtrl.$setViewValue(capitalized);
                modelCtrl.$render();
              }
              return capitalized;
          };
           modelCtrl.$parsers.push(capitalize);
           capitalize($parse(attrs.ngModel)(scope)); // capitalize first letter
       }
   };
  }])

  /* Custom datepicker directive, makes use of angular-ui datepicker */
  .directive("dateselect", function(){
    return {
      restrict: "E",
      require: "^ngModel",
      replace: "true",
      scope:{
        ngModel: "=",
        ngRequired: "=",
        dateOptions: "=",
        minDate: "=",
        maxDate: "=",
        opened: "=",
        format: "=",
        initDate: "=",
        calIcon: "="
      },
      link: function($scope, element, attrs) {
        $scope.open = function(event){
          event.preventDefault();
          event.stopPropagation();
          $scope.opened = true;
          $scope.calIcon = 'fa-calendar';
        };

        $scope.clear = function () {
          $scope.ngModel = null;
        };
      },
      templateUrl: 'views/template/dateselect.html'
    };
  })

  .directive("dateselectEnd", ["$filter", function($filter){
    return {
      restrict: "E",
      require: ["^ngModel"],
      replace: "true",
      scope:{
        ngModel: "=",
        ngRequired: "=",
        dateOptions: "=",
        minDate: "=",
        maxDate: "=",
        opened: "=",
        format: "=",
        initDate: "=",
        calIcon: "="
      },
      link: function(scope, element, attrs,ctrl) {
        scope.open = function(event){
          event.preventDefault();
          event.stopPropagation();
          scope.opened = true;
          scope.calIcon = 'fa-calendar';
        };

        scope.clear = function () {
          scope.ngModel = null;
        };

        var converted = false;
        var ngModel = ctrl[0];
        ngModel.$parsers.push(function(viewValue) {
          converted = false;
          return viewValue.toISOString();
        });

        if (!ngModel) return;

        scope.$watch(
          function(){
            return ngModel.$modelValue;
          },
          function(modelValue){
            if(!converted && modelValue){
              converted = true;
              var endOfDay = moment(modelValue).endOf('day').toDate();
              ngModel.$setViewValue(endOfDay);
              ngModel.$render();

            }
          });

      },
      templateUrl: 'views/template/dateselect.html'
    };
  }])


    /*  Custom directive to check if user has associated permission
        example use: <span has-permission="{{permissions.SOME_PERMISSION}}">
    */
  .directive('hasPermission', ['$rootScope', function ($rootScope)  {
    return {
      link: function(scope, element, attrs) {
        // if the permission is not an empty string, determine if element should be displayed
        if(attrs.hasPermission !== ''){
          var permission = attrs.hasPermission;
          showOrHide();
        }

        // determine if user has permission to view the element -
        function showOrHide() {
          var hasPermission = false;
          // if user has the appropriate permission, set hasPermission to TRUE
          if ($rootScope.sessionUserPermissions.indexOf(permission) > -1){
            hasPermission = true;
          }

          // remove the element if the user does not have the appropriate permission
          if(!hasPermission){
            element.remove();
          }
        }
      }
    };
  }])

  /*  Custom directive to check if user has associated permissions - use a semicolon (;) separated list of permissions
      example use: <span has-permissions="{{permissions.SOME_PERMISSION}};{{permissions.SOME_PERMISSION_#2}}">
  */
  .directive('hasPermissions', ['$rootScope', function ($rootScope)  {
    return {
      link: function(scope, element, attrs) {
        // if the permission is not an empty string, determine if element should be displayed
        if(attrs.hasPermissions !== ''){
          var permissions = attrs.hasPermissions.split(';');
          showOrHide();
        }

        // determine if user has permissions to view the element -
        function showOrHide() {
          var hasPermissions = true;
          for (var permission in permissions){
            // if user doesn't have one of the appropriate permissions, set to FALSE
            if ($rootScope.sessionUserPermissions.indexOf(permissions[permission]) < 0){
              hasPermissions = false;
            }
          }

          // remove the element if the user does not have the appropriate permission
          if(!hasPermissions){
            element.remove();
          }
        }
      }
    };
  }])

  /*  Custom directive to calculate age from birthDate
      example use: <span calculate-age dob="{{donor.birthDate}}" age="age">{{age}}</span>
  */
  .directive('calculateAge', function() {
    return {
        restrict: 'EA',
        scope: {
            dob: '@',
            age: '=',
        },
        link: function ($scope) {
          var age = '';
          if($scope.dob === ''){
            $scope.age = '';
          }
          else{
            var today = new Date();
            var birthDate = new Date($scope.dob);
            age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            $scope.age = age;
          }
        }
    };
  })

  .directive('selectOnFocus', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
  })


  .directive('integer', ['REGEX', function(REGEX) {
    var INTEGER_REGEXP = REGEX.INTEGER;
    return {
      require: 'ngModel',
      link: function($scope, elm, attrs, ctrl) {
        ctrl.$validators.integer = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            // empty input is valid
            return true;
          }
          if (INTEGER_REGEXP.test(viewValue)) {
            // input valid
            return true;
          }
          // input invalid
          return false;
        };
      }
    };
  }])

  .directive('decimal', ['REGEX', function(REGEX) {
    var DECIMAL_REGEXP = REGEX.DECIMAL;
    return {
      require: 'ngModel',
      link: function($scope, elm, attrs, ctrl) {
        ctrl.$validators.decimal = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            // empty input is valid
            return true;
          }
          if (DECIMAL_REGEXP.test(viewValue)) {
            // input valid
            return true;
          }
          // input invalid
          return false;
        };
      }
    };
  }])

  .directive('alphaName', ['REGEX', function(REGEX) {
    var ALPHA_REGEXP = REGEX.NAME;
    return {
      require: 'ngModel',
      link: function($scope, elm, attrs, ctrl) {
        ctrl.$validators.alphaName = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            // empty input is valid
            return true;
          }
          if (ALPHA_REGEXP.test(viewValue)) {
            // input valid
            return true;
          }
            // input invalid
          return false;
        };
      }
    };
  }])

  .directive('compareTo', function(){
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
          ngModel.$validate();
        });
      }
    };
  })

;

// initialize system & user config before app starts
(function() {

  function initializeConfig() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    return $http.get('config/config.json').then(function(response) {
      app.constant('SYSTEMCONFIG', response.data);

        var url = 'http://' + response.data.apiHost + ':' + response.data.apiPort + '/' + response.data.apiApp;
        return $http.get(url+'/configurations').then(function(response) {
          app.constant('USERCONFIG', response.data);

          var config = response.data.configurations;

          // initialise date/time format constants
          for (var i=0,  tot=config.length; i < tot; i++) {
            if (config[i].name == 'dateFormat'){
              app.constant('DATEFORMAT', config[i].value);
            }
            else if (config[i].name == 'dateTimeFormat'){
              app.constant('DATETIMEFORMAT', config[i].value);
            }
            else if (config[i].name == 'timeFormat'){
              app.constant('TIMEFORMAT', config[i].value);
            }
          }

        }, function() {
          // Handle error case
          app.constant('CONFIGAPI', 'No Config Loaded');
        });


    }, function() {
      // Handle error case
      app.constant('SYSTEMCONFIG', 'No Config Loaded');
    });

  }

  function bootstrapApplication() {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['bsis']);
    });
  }

  initializeConfig().then(bootstrapApplication);

}());

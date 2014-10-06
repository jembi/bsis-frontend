'use strict';

angular.module('bsis', [
  'ngRoute',
  'ui.bootstrap',
  'mockAPI',
  'ngTable',
  'xeditable',
  'ui.select',
  'ngSanitize'
])
  .config(function($routeProvider, PERMISSIONS) {
    $routeProvider
      // HOME PAGE
      .when('/', {
        templateUrl : 'views/login.html',
        controller  : 'LoginCtrl'
      })

      // LOGOUT PAGE
      .when('/logout', {
        templateUrl : 'views/login.html',
        controller  : 'LoginCtrl'
      })

      .when('/home', {
        templateUrl : 'views/home.html',
        controller  : 'HomeCtrl'
      })

      // DONORS URLs
      .when('/donors', {
        templateUrl : 'views/donors.html',
        controller  : 'DonorsCtrl',
        permission: PERMISSIONS.VIEW_DONOR
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
      .when('/linkDonation', {
        templateUrl : 'views/donors.html',
        controller  : 'AddDonationCtrl',
        permission: PERMISSIONS.ADD_DONATION
      })
      .when('/manageClinic', {
        templateUrl : 'views/donors.html',
        controller  : 'DonorClinicCtrl',
        permission: PERMISSIONS.VIEW_DONATION_BATCH
      })
      .when('/exportDonorList', {
        templateUrl : 'views/donors.html',
        controller  : 'DonorListCtrl',
        permission: PERMISSIONS.VIEW_DONOR
      })
      .when('/viewDonor', {
        templateUrl : 'views/donors.html',
        controller  : 'ViewDonorCtrl',
        permission: PERMISSIONS.VIEW_DONOR
      })

      // COMPONENTS URLs
      .when('/components', {
        templateUrl : 'views/components.html',
        controller  : 'ComponentsCtrl',
        permission: PERMISSIONS.VIEW_COMPONENT
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
        permission: PERMISSIONS.VIEW_TEST_OUTCOME
      })
      .when('/viewTestResults', {
        templateUrl : 'views/testing.html',
        controller  : 'TestingCtrl',
        permission: PERMISSIONS.VIEW_TEST_OUTCOME
      })
      .when('/manageTestBatch', {
        templateUrl : 'views/testing.html',
        controller  : 'TestBatchCtrl',
        permission: PERMISSIONS.VIEW_TEST_OUTCOME
      })
      .when('/viewTestBatch', {
        templateUrl : 'views/testing.html',
        controller  : 'ViewTestBatchCtrl',
        permission: PERMISSIONS.VIEW_TEST_OUTCOME
      })
      .when('/recordTestResults', {
        templateUrl : 'views/testing.html',
        controller  : 'TestBatchCtrl',
        permission: PERMISSIONS.ADD_TEST_OUTCOME
      })
      .when('/manageTTITesting', {
        templateUrl : 'views/testing.html',
        controller  : 'RecordTestResultsCtrl',
        permission: PERMISSIONS.VIEW_TTI_OUTCOME
      })
      .when('/manageBloodGroupTesting', {
        templateUrl : 'views/testing.html',
        controller  : 'RecordTestResultsCtrl',
        permission: PERMISSIONS.VIEW_BLOOD_TYPING_OUTCOME
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
        permission: PERMISSIONS.VIEW_INVENTORY_INFORMATION
      })
      .when('/transferComponents', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        permission: PERMISSIONS.VIEW_INVENTORY_INFORMATION
      })
      .when('/issueComponents', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        permission: PERMISSIONS.VIEW_INVENTORY_INFORMATION
      })
      .when('/componentUsage', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        permission: PERMISSIONS.VIEW_INVENTORY_INFORMATION
      })

      // LABELLING URLs
      .when('/labelling', {
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
        permission: PERMISSIONS.VIEW_ADMIN_INFORMATION
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
      var permission = next.$$route.permission;
      // if the required permission is not in the current user's permissions list, redirect to logout
      if (permission !== undefined && $rootScope.sessionUserPermissions.indexOf(permission) <= -1){
        $location.path('/logout');
      }
    });
    
  }])

  .run( ['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {

    $rootScope.$on('$locationChangeStart', function(event){
      
      // Retrieve the session from storage
      var consoleSession = localStorage.getItem('consoleSession');
      consoleSession = JSON.parse(consoleSession);

      //used to control if header is displayed
      $rootScope.displayHeader = false;

      //check if session exists
      if( consoleSession ){

        //check if session has expired
        var currentTime = new Date();
        currentTime = currentTime.toISOString();
        if( currentTime >= consoleSession.expires ){
          localStorage.removeItem('consoleSession');
          //session expired - user needs to log in
          $location.path( "/" );

        }else{

          //session still active - update expires time
          currentTime = new Date();
          //add 1 hour onto timestamp (1 hour persistence time)
          var expireTime = new Date(currentTime.getTime() + (1*1000*60*60));
          //get sessionID
          var sessionID = consoleSession.sessionID;
          var sessionUser = consoleSession.sessionUser;
          var sessionUserName = consoleSession.sessionUserName;
          var sessionUserPermissions = consoleSession.sessionUserPermissions;

          //set the header to display
          $rootScope.displayHeader = true;

          //create session object
          var consoleSessionObject = { 'sessionID': sessionID, 'sessionUser': sessionUser, 'sessionUserName': sessionUserName, 'sessionUserPermissions': sessionUserPermissions, 'expires': expireTime };

          // Put updated object into storage
          localStorage.setItem('consoleSession', JSON.stringify( consoleSessionObject ));
          
          $rootScope.sessionUserName = sessionUserName;
          $rootScope.sessionUserPermissions = sessionUserPermissions;
        }

      }else{
        // no session - user needs to log in
        $location.path( "/" );
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
        initDate: "@",
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

  .directive('hasPermission', function ($rootScope)  {
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
  })


;

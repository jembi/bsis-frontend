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

      .when('/home', {
        templateUrl : 'views/home.html',
        controller  : 'HomeCtrl',
        data: {
          permission: PERMISSIONS.VIEW_HOME
        }
      })

      // DONORS URLs
      .when('/donors', {
        templateUrl : 'views/donors.html',
        controller  : 'DonorsCtrl',
        data: {
          permission: PERMISSIONS.VIEW_DONORS
        }
      })
      .when('/findDonor', {
        templateUrl : 'views/donors.html',
        controller  : 'DonorsCtrl',
        data: {
          permission: PERMISSIONS.FIND_DONOR
        }
      })
      .when('/addDonor', {
        templateUrl : 'views/donors.html',
        controller  : 'AddDonorCtrl',
        data: {
          permission: PERMISSIONS.ADD_DONOR
        }
      })
      .when('/linkDonation', {
        templateUrl : 'views/donors.html',
        controller  : 'AddDonationCtrl',
        data: {
          permission: PERMISSIONS.LINK_DONATION
        }
      })
      .when('/manageClinic', {
        templateUrl : 'views/donors.html',
        controller  : 'DonorClinicCtrl',
        data: {
          permission: PERMISSIONS.MANAGE_CLINIC
        }
      })
      .when('/exportDonorList', {
        templateUrl : 'views/donors.html',
        controller  : 'DonorListCtrl',
        data: {
          permission: PERMISSIONS.EXPORT_DONOR_LIST
        }
      })
      .when('/viewDonor', {
        templateUrl : 'views/donors.html',
        controller  : 'ViewDonorCtrl',
        data: {
          permission: PERMISSIONS.VIEW_DONORS
        }
      })

      // COMPONENTS URLs
      .when('/components', {
        templateUrl : 'views/components.html',
        controller  : 'ComponentsCtrl',
        data: {
          permission: PERMISSIONS.VIEW_COMPONENTS
        }
      })
      .when('/recordComponents', {
        templateUrl : 'views/components.html',
        controller  : 'ComponentsCtrl',
        data: {
          permission: PERMISSIONS.VIEW_COMPONENTS
        }
      })
      .when('/findComponents', {
        templateUrl : 'views/components.html',
        controller  : 'ComponentsCtrl',
        data: {
          permission: PERMISSIONS.VIEW_COMPONENTS
        }
      })
      .when('/discardComponents', {
        templateUrl : 'views/components.html',
        controller  : 'ComponentsCtrl',
        data: {
          permission: PERMISSIONS.VIEW_COMPONENTS
        }
      })
      .when('/findDiscards', {
        templateUrl : 'views/components.html',
        controller  : 'ComponentsCtrl',
        data: {
          permission: PERMISSIONS.VIEW_COMPONENTS
        }
      })

      // TESTING URLs
      .when('/testing', {
        templateUrl : 'views/testing.html',
        controller  : 'TestBatchCtrl',
        data: {
          permission: PERMISSIONS.VIEW_TESTING
        }
      })
      .when('/viewTestResults', {
        templateUrl : 'views/testing.html',
        controller  : 'TestingCtrl',
        data: {
          permission: PERMISSIONS.VIEW_TESTING
        }
      })
      .when('/manageTestBatch', {
        templateUrl : 'views/testing.html',
        controller  : 'TestBatchCtrl',
        data: {
          permission: PERMISSIONS.VIEW_TESTING
        }
      })
      .when('/viewTestBatch', {
        templateUrl : 'views/testing.html',
        controller  : 'ViewTestBatchCtrl',
        data: {
          permission: PERMISSIONS.VIEW_TESTING
        }
      })
      .when('/serologyTesting', {
        templateUrl : 'views/testing.html',
        controller  : 'TestingCtrl',
        data: {
          permission: PERMISSIONS.VIEW_TESTING
        }
      })
      .when('/ttiTesting', {
        templateUrl : 'views/testing.html',
        controller  : 'TestBatchCtrl',
        data: {
          permission: PERMISSIONS.VIEW_TESTING
        }
      })
      .when('/manageTTITesting', {
        templateUrl : 'views/testing.html',
        controller  : 'TTITestBatchCtrl',
        data: {
          permission: PERMISSIONS.VIEW_TESTING
        }
      })
      .when('/uploadTestResults', {
        templateUrl : 'views/testing.html',
        controller  : 'TestingCtrl',
        data: {
          permission: PERMISSIONS.VIEW_TESTING
        }
      })

      // INVENTORY URLs
      .when('/inventory', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        data: {
          permission: PERMISSIONS.VIEW_INVENTORY
        }
      })
      .when('/manageInventory', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        data: {
          permission: PERMISSIONS.VIEW_INVENTORY
        }
      })
      .when('/transferComponents', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        data: {
          permission: PERMISSIONS.VIEW_INVENTORY
        }
      })
      .when('/issueComponents', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        data: {
          permission: PERMISSIONS.VIEW_INVENTORY
        }
      })
      .when('/componentUsage', {
        templateUrl : 'views/inventory.html',
        controller  : 'InventoryCtrl',
        data: {
          permission: PERMISSIONS.VIEW_INVENTORY
        }
      })

      // LABELLING URLs
      .when('/labelling', {
        templateUrl : 'views/labelling.html',
        controller  : 'LabellingCtrl',
        data: {
          permission: PERMISSIONS.VIEW_LABELLING
        }
      })

      // REPORTS URLs
      .when('/reports', {
        templateUrl : 'views/reports.html',
        controller  : 'ReportsCtrl',
        data: {
          permission: PERMISSIONS.VIEW_REPORTS
        }
      })

      // MOBILE URLs
      .when('/mobile', {
        templateUrl : 'views/mobile.html',
        controller  : 'MobileCtrl',
        data: {
          permission: PERMISSIONS.VIEW_MOBILE
        }
      })

      // SETTINGS URLs
      .when('/settings', {
        templateUrl : 'views/settings.html',
        controller  : 'SettingsCtrl',
        data: {
          permission: PERMISSIONS.VIEW_LABELLING
        }
      })

      .otherwise({
        redirectTo: '/home'
      });
  })

  .run(function(editableOptions) {
    editableOptions.theme = 'bs3';
  })

  .run( ['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
    $rootScope.$on('$locationChangeStart', function(event){
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

;

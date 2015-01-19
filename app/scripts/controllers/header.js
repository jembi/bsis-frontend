'use strict';

angular.module('bsis')
.controller('HeaderCtrl', function ($scope, $location, AuthService, ICONS, PERMISSIONS) {

  $scope.icons = ICONS;

  $scope.sectionList = [
    {'title': 'HOME',
     'href': '#home',
     'icon': ICONS.HOME,
     'permission': ''
    },
    {'title': 'DONORS',
     'href': '#donors',
     'icon': ICONS.DONORS,
     'permission': PERMISSIONS.VIEW_DONOR_INFORMATION
    },
    {'title': 'COMPONENTS',
     'href': '#components',
     'icon': ICONS.COMPONENTS,
     'permission': PERMISSIONS.VIEW_COMPONENT_INFORMATION
    },
    {'title': 'TESTING',
     'href': '#testing',
     'icon': ICONS.TESTING,
     'permission': PERMISSIONS.VIEW_TESTING_INFORMATION
    },
    {'title': 'LABELLING',
     'href': '#labelling',
     'icon': ICONS.LABELLING,
     'permission': PERMISSIONS.LABEL_COMPONENT
    },
    {'title': 'INVENTORY',
     'href': '#inventory',
     'icon': ICONS.INVENTORY,
     'permission': PERMISSIONS.VIEW_INVENTORY_INFORMATION
    },
    {'title': 'REPORTS',
     'href': '#reports',
     'icon': ICONS.REPORTS,
     'permission': PERMISSIONS.VIEW_REPORTING_INFORMATION
    },
    {'title': 'MOBILE CLINIC',
     'href': '#mobile',
     'icon': ICONS.MOBILE,
     'permission': PERMISSIONS.VIEW_MOBILE_CLINIC_INFORMATION
    },
    {'title': 'SETTINGS',
     'href': '#settings',
     'icon': ICONS.SETTINGS,
     'permission': PERMISSIONS.VIEW_ADMIN_INFORMATION
    }
  ];

  // set menu on initial load
  // if on donors page, set menu to DONORS
  if(~$location.path().indexOf('donors')                  ||
    ~$location.path().indexOf('findDonor')                ||
    ~$location.path().indexOf('addDonor')                 ||
    ~$location.path().indexOf('viewDonor')                ||
    ~$location.path().indexOf('addDonation')              ||
    ~$location.path().indexOf('manageDonationBatches')    ||
    ~$location.path().indexOf('manageClinic')             ||
    ~$location.path().indexOf('exportDonorList')
    ){
      $scope.currentSection = 'DONORS';
      
    }

  // else if on components page, set menu to COMPONENTS
  else if(~$location.path().indexOf('components')   ||
      ~$location.path().indexOf('findComponents')   ||
      ~$location.path().indexOf('recordComponents') ||
      ~$location.path().indexOf('findDiscards')     ||
      ~$location.path().indexOf('discardComponents')
    ){
      $scope.currentSection = 'COMPONENTS';
    }

  // else if on testing page, set menu to TESTING
  else if(~$location.path().indexOf('testing')                   ||
      ~$location.path().indexOf('viewTestResults')               ||
      ~$location.path().indexOf('manageTestBatch')               ||
      ~$location.path().indexOf('viewTestBatch')                 ||
      ~$location.path().indexOf('manageTTITesting')              ||
      ~$location.path().indexOf('manageBloodGroupTesting')       ||
      ~$location.path().indexOf('manageBloodGroupMatchTesting')  ||
      ~$location.path().indexOf('uploadTestResults')
    ){
      $scope.currentSection = 'TESTING';
    }

  // else if on inventory page, set menu to INVENTORY
  else if(~$location.path().indexOf('inventory')        ||
      ~$location.path().indexOf('manageInventory')      ||
      ~$location.path().indexOf('transferComponents')   ||
      ~$location.path().indexOf('issueComponents')      ||
      ~$location.path().indexOf('componentUsage')
    ){
      $scope.currentSection = 'INVENTORY';
    }

  // else if on labelling page, set menu to LABELLING
  else if(~$location.path().indexOf('labelling')           ||
      ~$location.path().indexOf('labelComponents')
    ){
      $scope.currentSection = 'LABELLING';
    }

  // else if on reports page, set menu to REPORTS
  else if(~$location.path().indexOf('reports')
    ){
      $scope.currentSection = 'REPORTS';
    }

  // else if on mobile clinic page, set menu to MOBILE
  else if(~$location.path().indexOf('mobile')
    ){
      $scope.currentSection = 'MOBILE';
    }

  // else if on settings page, set menu to SETTINGS
  else if(~$location.path().indexOf('settings')        ||
      ~$location.path().indexOf('locations')
    ){
      $scope.currentSection = 'SETTINGS';
    }

  // else set menu to HOME
  else{
      $scope.currentSection = 'HOME';
    }

  //set menu on location change
  $scope.$on('$locationChangeStart', function(event){

    // if on donors page, set menu to DONORS
    if(~$location.path().indexOf('donors')                  ||
      ~$location.path().indexOf('findDonor')                ||
      ~$location.path().indexOf('addDonor')                 ||
      ~$location.path().indexOf('viewDonor')                ||
      ~$location.path().indexOf('addDonation')              ||
      ~$location.path().indexOf('manageDonationBatches')    ||
      ~$location.path().indexOf('manageClinic')             ||
      ~$location.path().indexOf('exportDonorList')
      ){
        $scope.currentSection = 'DONORS';
        
      }
    
    // else if on components page, set menu to COMPONENTS
    else if(~$location.path().indexOf('components')   ||
        ~$location.path().indexOf('findComponents')   ||
        ~$location.path().indexOf('recordComponents') ||
        ~$location.path().indexOf('findDiscards')     ||
        ~$location.path().indexOf('discardComponents')
    ){
      $scope.currentSection = 'COMPONENTS';
    }

    // else if on testing page, set menu to TESTING
    else if(~$location.path().indexOf('testing')                 ||
      ~$location.path().indexOf('viewTestResults')               ||
      ~$location.path().indexOf('manageTestBatch')               ||
      ~$location.path().indexOf('viewTestBatch')                 ||
      ~$location.path().indexOf('manageTTITesting')              ||
      ~$location.path().indexOf('manageBloodGroupTesting')       ||
      ~$location.path().indexOf('manageBloodGroupMatchTesting')  ||
      ~$location.path().indexOf('uploadTestResults')
    ){
      $scope.currentSection = 'TESTING';
    }

      // else if on inventory page, set menu to INVENTORY
    else if(~$location.path().indexOf('inventory')        ||
        ~$location.path().indexOf('manageInventory')      ||
        ~$location.path().indexOf('transferComponents')   ||
        ~$location.path().indexOf('issueComponents')      ||
        ~$location.path().indexOf('componentUsage')
      ){
        $scope.currentSection = 'INVENTORY';
      }

      // else if on labelling page, set menu to LABELLING
    else if(~$location.path().indexOf('labelling')           ||
        ~$location.path().indexOf('labelComponents')
      ){
        $scope.currentSection = 'LABELLING';
      }

    // else if on reports page, set menu to REPORTS
    else if(~$location.path().indexOf('reports')
      ){
        $scope.currentSection = 'REPORTS';
      }

    // else if on mobile clinic page, set menu to MOBILE
    else if(~$location.path().indexOf('mobile')
      ){
        $scope.currentSection = 'MOBILE';
      }

    // else if on settings page, set menu to SETTINGS
    else if(~$location.path().indexOf('settings')        ||
      ~$location.path().indexOf('locations')
      ){
        $scope.currentSection = 'SETTINGS';
      }

    // else set menu to HOME
    else{
      $scope.currentSection = 'HOME';
    }

  });

  $scope.status = {
    isopen: false
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.logout = function () {
    AuthService.logout();
    $location.path( "/" );
  };

});
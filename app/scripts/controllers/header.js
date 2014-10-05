'use strict';

angular.module('bsis')
.controller('HeaderCtrl', function ($scope, $location, AuthService, ICONS) {

  $scope.icons = ICONS;

  // set menu on initial load
  // if on donors page, set menu to DONORS
  if(~$location.path().indexOf('donors')        ||
    ~$location.path().indexOf('findDonor')      ||
    ~$location.path().indexOf('addDonor')       ||
    ~$location.path().indexOf('viewDonor')      ||
    ~$location.path().indexOf('linkDonation')   ||
    ~$location.path().indexOf('manageClinic')   ||
    ~$location.path().indexOf('exportDonorList')
    ){
      $scope.currentSection = 'DONORS';
      $scope.sectionList = [
        {'title': 'HOME',
         'href': '#home',
         'icon': ICONS.HOME},
        {'title': 'COMPONENTS',
         'href': '#components',
         'icon': ICONS.COMPONENTS},
        {'title': 'TESTING',
         'href': '#testing',
         'icon': ICONS.TESTING},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'icon': ICONS.INVENTORY},
        {'title': 'LABELLING',
         'href': '#labelling',
         'icon': ICONS.LABELLING},
        {'title': 'REPORTS',
         'href': '#reports',
         'icon': ICONS.REPORTS},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'icon': ICONS.MOBILE},
        {'title': 'SETTINGS',
         'href': '#settings',
         'icon': ICONS.SETTINGS}
      ];
    }

  // else if on components page, set menu to COMPONENTS
  else if(~$location.path().indexOf('components')   ||
      ~$location.path().indexOf('findComponents')   ||
      ~$location.path().indexOf('recordComponents') ||
      ~$location.path().indexOf('findDiscards')     ||
      ~$location.path().indexOf('discardComponents')
    ){
      $scope.currentSection = 'COMPONENTS';
      $scope.sectionList = [
        {'title': 'HOME',
         'href': '#home',
         'icon': ICONS.HOME},
        {'title': 'DONORS',
         'href': '#donors',
         'icon': ICONS.DONORS},
        {'title': 'TESTING',
         'href': '#testing',
         'icon': ICONS.TESTING},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'icon': ICONS.INVENTORY},
        {'title': 'LABELLING',
         'href': '#labelling',
         'icon': ICONS.LABELLING},
        {'title': 'REPORTS',
         'href': '#reports',
         'icon': ICONS.REPORTS},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'icon': ICONS.MOBILE},
        {'title': 'SETTINGS',
         'href': '#settings',
         'icon': ICONS.SETTINGS}
      ];
    }

  // else if on testing page, set menu to TESTING
  else if(~$location.path().indexOf('testing')              ||
      ~$location.path().indexOf('viewTestResults')          ||
      ~$location.path().indexOf('manageTestBatch')          ||
      ~$location.path().indexOf('viewTestBatch')            ||
      ~$location.path().indexOf('recordTestResults')        ||
      ~$location.path().indexOf('manageTTITesting')         ||
      ~$location.path().indexOf('manageBloodGroupTesting')  ||
      ~$location.path().indexOf('uploadTestResults')
    ){
      $scope.currentSection = 'TESTING';
      $scope.sectionList = [
        {'title': 'HOME',
         'href': '#home',
         'icon': ICONS.HOME},
        {'title': 'DONORS',
         'href': '#donors',
         'icon': ICONS.DONORS},
        {'title': 'COMPONENTS',
         'href': '#components',
         'icon': ICONS.COMPONENTS},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'icon': ICONS.INVENTORY},
        {'title': 'LABELLING',
         'href': '#labelling',
         'icon': ICONS.LABELLING},
        {'title': 'REPORTS',
         'href': '#reports',
         'icon': ICONS.REPORTS},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'icon': ICONS.MOBILE},
        {'title': 'SETTINGS',
         'href': '#settings',
         'icon': ICONS.SETTINGS}
      ];
    }

  // else if on inventory page, set menu to INVENTORY
  else if(~$location.path().indexOf('inventory')        ||
      ~$location.path().indexOf('manageInventory')      ||
      ~$location.path().indexOf('transferComponents')   ||
      ~$location.path().indexOf('issueComponents')      ||
      ~$location.path().indexOf('componentUsage')
    ){
      $scope.currentSection = 'INVENTORY';
      $scope.sectionList = [
        {'title': 'HOME',
         'href': '#home',
         'icon': ICONS.HOME},
        {'title': 'DONORS',
         'href': '#donors',
         'icon': ICONS.DONORS},
        {'title': 'COMPONENTS',
         'href': '#components',
         'icon': ICONS.COMPONENTS},
        {'title': 'TESTING',
         'href': '#testing',
         'icon': ICONS.TESTING},
        {'title': 'LABELLING',
         'href': '#labelling',
         'icon': ICONS.LABELLING},
        {'title': 'REPORTS',
         'href': '#reports',
         'icon': ICONS.REPORTS},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'icon': ICONS.MOBILE},
        {'title': 'SETTINGS',
         'href': '#settings',
         'icon': ICONS.SETTINGS}
      ];
    }

  // else if on labelling page, set menu to LABELLING
  else if(~$location.path().indexOf('labelling')           ||
      ~$location.path().indexOf('labelComponents')
    ){
      $scope.currentSection = 'LABELLING';
      $scope.sectionList = [
        {'title': 'HOME',
         'href': '#home',
         'icon': ICONS.HOME},
        {'title': 'DONORS',
         'href': '#donors',
         'icon': ICONS.DONORS},
        {'title': 'COMPONENTS',
         'href': '#components',
         'icon': ICONS.COMPONENTS},
        {'title': 'TESTING',
         'href': '#testing',
         'icon': ICONS.TESTING},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'icon': ICONS.INVENTORY},
        {'title': 'REPORTS',
         'href': '#reports',
         'icon': ICONS.REPORTS},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'icon': ICONS.MOBILE},
        {'title': 'SETTINGS',
         'href': '#settings',
         'icon': ICONS.SETTINGS}
      ];
    }

  // else if on reports page, set menu to REPORTS
  else if(~$location.path().indexOf('reports')
    ){
      $scope.currentSection = 'REPORTS';
      $scope.sectionList = [
        {'title': 'HOME',
         'href': '#home',
         'icon': ICONS.HOME},
        {'title': 'DONORS',
         'href': '#donors',
         'icon': ICONS.DONORS},
        {'title': 'COMPONENTS',
         'href': '#components',
         'icon': ICONS.COMPONENTS},
        {'title': 'TESTING',
         'href': '#testing',
         'icon': ICONS.TESTING},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'icon': ICONS.INVENTORY},
        {'title': 'LABELLING',
         'href': '#labelling',
         'icon': ICONS.LABELLING},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'icon': ICONS.MOBILE},
        {'title': 'SETTINGS',
         'href': '#settings',
         'icon': ICONS.SETTINGS}
      ];
    }

  // else if on mobile clinic page, set menu to MOBILE
  else if(~$location.path().indexOf('mobile')
    ){
      $scope.currentSection = 'MOBILE';
      $scope.sectionList = [
        {'title': 'HOME',
         'href': '#home',
         'icon': ICONS.HOME},
        {'title': 'DONORS',
         'href': '#donors',
         'icon': ICONS.DONORS},
        {'title': 'COMPONENTS',
         'href': '#components',
         'icon': ICONS.COMPONENTS},
        {'title': 'TESTING',
         'href': '#testing',
         'icon': ICONS.TESTING},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'icon': ICONS.INVENTORY},
        {'title': 'LABELLING',
         'href': '#labelling',
         'icon': ICONS.LABELLING},
        {'title': 'REPORTS',
         'href': '#reports',
         'icon': ICONS.REPORTS},
        {'title': 'SETTINGS',
         'href': '#settings',
         'icon': ICONS.SETTINGS}
      ];
    }

  // else if on settings page, set menu to SETTINGS
  else if(~$location.path().indexOf('settings')
    ){
      $scope.currentSection = 'SETTINGS';
      $scope.sectionList = [
        {'title': 'HOME',
         'href': '#home',
         'icon': ICONS.HOME},
        {'title': 'DONORS',
         'href': '#donors',
         'icon': ICONS.DONORS},
        {'title': 'COMPONENTS',
         'href': '#components',
         'icon': ICONS.COMPONENTS},
        {'title': 'TESTING',
         'href': '#testing',
         'icon': ICONS.TESTING},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'icon': ICONS.INVENTORY},
        {'title': 'LABELLING',
         'href': '#labelling',
         'icon': ICONS.LABELLING},
        {'title': 'REPORTS',
         'href': '#reports',
         'icon': ICONS.REPORTS},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'icon': ICONS.MOBILE}
      ];
    }

  // else set menu to HOME
  else{
      $scope.currentSection = 'HOME';
      $scope.sectionList = [
        {'title': 'DONORS',
         'href': '#donors',
         'icon': ICONS.DONORS},
        {'title': 'COMPONENTS',
         'href': '#components',
         'icon': ICONS.COMPONENTS},
        {'title': 'TESTING',
         'href': '#testing',
         'icon': ICONS.TESTING},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'icon': ICONS.INVENTORY},
        {'title': 'LABELLING',
         'href': '#labelling',
         'icon': ICONS.LABELLING},
        {'title': 'REPORTS',
         'href': '#reports',
         'icon': ICONS.REPORTS},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'icon': ICONS.MOBILE},
        {'title': 'SETTINGS',
         'href': '#settings',
         'icon': ICONS.SETTINGS}
      ];
    }

  //set menu on location change
  $scope.$on('$locationChangeStart', function(event){

    // if on donors page, set menu to DONORS
    if(~$location.path().indexOf('donors')          ||
      ~$location.path().indexOf('findDonor')        ||
      ~$location.path().indexOf('addDonor')         ||
      ~$location.path().indexOf('viewDonor')        ||
      ~$location.path().indexOf('linkDonation')     ||
      ~$location.path().indexOf('manageClinic')     ||
      ~$location.path().indexOf('exportDonorList')
    ){
      $scope.currentSection = 'DONORS';
      $scope.sectionList = [
        {'title': 'HOME',
         'href': '#home',
         'icon': ICONS.HOME},
        {'title': 'COMPONENTS',
         'href': '#components',
         'icon': ICONS.COMPONENTS},
        {'title': 'TESTING',
         'href': '#testing',
         'icon': ICONS.TESTING},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'icon': ICONS.INVENTORY},
        {'title': 'LABELLING',
         'href': '#labelling',
         'icon': ICONS.LABELLING},
        {'title': 'REPORTS',
         'href': '#reports',
         'icon': ICONS.REPORTS},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'icon': ICONS.MOBILE},
        {'title': 'SETTINGS',
         'href': '#settings',
         'icon': ICONS.SETTINGS}
      ];
    }
    
    // else if on components page, set menu to COMPONENTS
    else if(~$location.path().indexOf('components')   ||
        ~$location.path().indexOf('findComponents')   ||
        ~$location.path().indexOf('recordComponents') ||
        ~$location.path().indexOf('findDiscards')     ||
        ~$location.path().indexOf('discardComponents')
    ){
      $scope.currentSection = 'COMPONENTS';
      $scope.sectionList = [
        {'title': 'HOME',
         'href': '#home',
         'icon': ICONS.HOME},
        {'title': 'DONORS',
         'href': '#donors',
         'icon': ICONS.DONORS},
        {'title': 'TESTING',
         'href': '#testing',
         'icon': ICONS.TESTING},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'icon': ICONS.INVENTORY},
        {'title': 'LABELLING',
         'href': '#labelling',
         'icon': ICONS.LABELLING},
        {'title': 'REPORTS',
         'href': '#reports',
         'icon': ICONS.REPORTS},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'icon': ICONS.MOBILE},
        {'title': 'SETTINGS',
         'href': '#settings',
         'icon': ICONS.SETTINGS}
      ];
    }

    // else if on testing page, set menu to TESTING
    else if(~$location.path().indexOf('testing')            ||
      ~$location.path().indexOf('viewTestResults')          ||
      ~$location.path().indexOf('manageTestBatch')          ||
      ~$location.path().indexOf('viewTestBatch')            ||
      ~$location.path().indexOf('recordTestResults')        ||
      ~$location.path().indexOf('manageTTITesting')         ||
      ~$location.path().indexOf('manageBloodGroupTesting')  ||
      ~$location.path().indexOf('uploadTestResults')
    ){
      $scope.currentSection = 'TESTING';
      $scope.sectionList = [
        {'title': 'HOME',
         'href': '#home',
         'icon': ICONS.HOME},
        {'title': 'DONORS',
         'href': '#donors',
         'icon': ICONS.DONORS},
        {'title': 'COMPONENTS',
         'href': '#components',
         'icon': ICONS.COMPONENTS},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'icon': ICONS.INVENTORY},
        {'title': 'LABELLING',
         'href': '#labelling',
         'icon': ICONS.LABELLING},
        {'title': 'REPORTS',
         'href': '#reports',
         'icon': ICONS.REPORTS},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'icon': ICONS.MOBILE},
        {'title': 'SETTINGS',
         'href': '#settings',
         'icon': ICONS.SETTINGS}
      ];
    }

      // else if on inventory page, set menu to INVENTORY
    else if(~$location.path().indexOf('inventory')        ||
        ~$location.path().indexOf('manageInventory')      ||
        ~$location.path().indexOf('transferComponents')   ||
        ~$location.path().indexOf('issueComponents')      ||
        ~$location.path().indexOf('componentUsage')
      ){
        $scope.currentSection = 'INVENTORY';
        $scope.sectionList = [
          {'title': 'HOME',
           'href': '#home',
           'icon': ICONS.HOME},
          {'title': 'DONORS',
           'href': '#donors',
           'icon': ICONS.DONORS},
          {'title': 'COMPONENTS',
           'href': '#components',
           'icon': ICONS.COMPONENTS},
          {'title': 'TESTING',
           'href': '#testing',
           'icon': ICONS.TESTING},
          {'title': 'LABELLING',
           'href': '#labelling',
           'icon': ICONS.LABELLING},
          {'title': 'REPORTS',
           'href': '#reports',
           'icon': ICONS.REPORTS},
          {'title': 'MOBILE CLINIC',
           'href': '#mobile',
           'icon': ICONS.MOBILE},
          {'title': 'SETTINGS',
           'href': '#settings',
           'icon': ICONS.SETTINGS}
        ];
      }

      // else if on labelling page, set menu to LABELLING
    else if(~$location.path().indexOf('labelling')           ||
        ~$location.path().indexOf('labelComponents')
      ){
        $scope.currentSection = 'LABELLING';
        $scope.sectionList = [
          {'title': 'HOME',
           'href': '#home',
           'icon': ICONS.HOME},
          {'title': 'DONORS',
           'href': '#donors',
           'icon': ICONS.DONORS},
          {'title': 'COMPONENTS',
           'href': '#components',
           'icon': ICONS.COMPONENTS},
          {'title': 'TESTING',
           'href': '#testing',
           'icon': ICONS.TESTING},
          {'title': 'INVENTORY',
           'href': '#inventory',
           'icon': ICONS.INVENTORY},
          {'title': 'REPORTS',
           'href': '#reports',
           'icon': ICONS.REPORTS},
          {'title': 'MOBILE CLINIC',
           'href': '#mobile',
           'icon': ICONS.MOBILE},
          {'title': 'SETTINGS',
           'href': '#settings',
           'icon': ICONS.SETTINGS}
        ];
      }

    // else if on reports page, set menu to REPORTS
    else if(~$location.path().indexOf('reports')
      ){
        $scope.currentSection = 'REPORTS';
        $scope.sectionList = [
          {'title': 'HOME',
           'href': '#home',
           'icon': ICONS.HOME},
          {'title': 'DONORS',
           'href': '#donors',
           'icon': ICONS.DONORS},
          {'title': 'COMPONENTS',
           'href': '#components',
           'icon': ICONS.COMPONENTS},
          {'title': 'TESTING',
           'href': '#testing',
           'icon': ICONS.TESTING},
          {'title': 'INVENTORY',
           'href': '#inventory',
           'icon': ICONS.INVENTORY},
          {'title': 'LABELLING',
           'href': '#labelling',
           'icon': ICONS.LABELLING},
          {'title': 'MOBILE CLINIC',
           'href': '#mobile',
           'icon': ICONS.MOBILE},
          {'title': 'SETTINGS',
           'href': '#settings',
           'icon': ICONS.SETTINGS}
        ];
      }

    // else if on mobile clinic page, set menu to MOBILE
    else if(~$location.path().indexOf('mobile')
      ){
        $scope.currentSection = 'MOBILE';
        $scope.sectionList = [
          {'title': 'HOME',
           'href': '#home',
           'icon': ICONS.HOME},
          {'title': 'DONORS',
           'href': '#donors',
           'icon': ICONS.DONORS},
          {'title': 'COMPONENTS',
           'href': '#components',
           'icon': ICONS.COMPONENTS},
          {'title': 'TESTING',
           'href': '#testing',
           'icon': ICONS.TESTING},
          {'title': 'INVENTORY',
           'href': '#inventory',
           'icon': ICONS.INVENTORY},
          {'title': 'LABELLING',
           'href': '#labelling',
           'icon': ICONS.LABELLING},
          {'title': 'REPORTS',
           'href': '#reports',
           'icon': ICONS.REPORTS},
          {'title': 'SETTINGS',
           'href': '#settings',
           'icon': ICONS.SETTINGS}
        ];
      }

    // else if on settings page, set menu to SETTINGS
    else if(~$location.path().indexOf('settings')
      ){
        $scope.currentSection = 'SETTINGS';
        $scope.sectionList = [
          {'title': 'HOME',
           'href': '#home',
           'icon': ICONS.HOME},
          {'title': 'DONORS',
           'href': '#donors',
           'icon': ICONS.DONORS},
          {'title': 'COMPONENTS',
           'href': '#components',
           'icon': ICONS.COMPONENTS},
          {'title': 'TESTING',
           'href': '#testing',
           'icon': ICONS.TESTING},
          {'title': 'INVENTORY',
           'href': '#inventory',
           'icon': ICONS.INVENTORY},
          {'title': 'LABELLING',
           'href': '#labelling',
           'icon': ICONS.LABELLING},
          {'title': 'REPORTS',
           'href': '#reports',
           'icon': ICONS.REPORTS},
          {'title': 'MOBILE CLINIC',
           'href': '#mobile',
           'icon': ICONS.MOBILE}
        ];
      }

    // else set menu to HOME
    else{
      $scope.currentSection = 'HOME';
      $scope.sectionList = [
        {'title': 'DONORS',
         'href': '#donors',
         'icon': ICONS.DONORS},
        {'title': 'COMPONENTS',
         'href': '#components',
         'icon': ICONS.COMPONENTS},
        {'title': 'TESTING',
         'href': '#testing',
         'icon': ICONS.TESTING},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'icon': ICONS.INVENTORY},
        {'title': 'LABELLING',
         'href': '#labelling',
         'icon': ICONS.LABELLING},
        {'title': 'REPORTS',
         'href': '#reports',
         'icon': ICONS.REPORTS},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'icon': ICONS.MOBILE},
        {'title': 'SETTINGS',
         'href': '#settings',
         'icon': ICONS.SETTINGS}
      ];
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
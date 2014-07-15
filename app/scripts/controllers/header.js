'use strict';

angular.module('bsis')
.controller('HeaderCtrl', function ($scope, $location, AuthService, ICONS) {

  $scope.icons = ICONS;

  // set menu on initial load
  // if on donors page, set menu to DONORS
  if(~$location.path().indexOf('donors')        ||
    ~$location.path().indexOf('findDonor')      ||
    ~$location.path().indexOf('addDonor')       ||
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
  else if(~$location.path().indexOf('components')        ||
      ~$location.path().indexOf('findComponents')   ||
      ~$location.path().indexOf('recordComponents')
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
  else if(~$location.path().indexOf('testing')           ||
      ~$location.path().indexOf('viewTestResults')  ||
      ~$location.path().indexOf('manageTestBatch')  ||
      ~$location.path().indexOf('serologyTesting')  ||
      ~$location.path().indexOf('ttiTesting')       ||
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
  else if(~$location.path().indexOf('inventory')           ||
      ~$location.path().indexOf('manageInventory')  ||
      ~$location.path().indexOf('transferComponents')  ||
      ~$location.path().indexOf('issueComponents')  ||
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
    else if(~$location.path().indexOf('components')        ||
        ~$location.path().indexOf('findComponents')   ||
        ~$location.path().indexOf('recordComponents')
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
    else if(~$location.path().indexOf('testing')           ||
      ~$location.path().indexOf('viewTestResults')  ||
      ~$location.path().indexOf('manageTestBatch')  ||
      ~$location.path().indexOf('serologyTesting')  ||
      ~$location.path().indexOf('ttiTesting')       ||
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
  else if(~$location.path().indexOf('inventory')           ||
      ~$location.path().indexOf('manageInventory')  ||
      ~$location.path().indexOf('transferComponents')  ||
      ~$location.path().indexOf('issueComponents')  ||
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
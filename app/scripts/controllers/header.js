'use strict';

angular.module('bsis')
.controller('HeaderCtrl', function ($scope, $location, AuthService) {

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
         'glyph': 'glyphicon-home'},
        {'title': 'COMPONENTS',
         'href': '#components',
         'glyph': 'glyphicon-tasks'},
        {'title': 'TESTING',
         'href': '#testing',
         'glyph': 'glyphicon-inbox'},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'glyph': 'glyphicon-tag'},
        {'title': 'REPORTS',
         'href': '#reports',
         'glyph': 'glyphicon-stats'},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'glyph': 'glyphicon-road'},
        {'title': 'SETTINGS',
         'href': '#settings',
         'glyph': 'glyphicon-cog'}
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
         'glyph': 'glyphicon-home'},
        {'title': 'DONORS',
         'href': '#donors',
         'glyph': 'glyphicon-tint'},
        {'title': 'TESTING',
         'href': '#testing',
         'glyph': 'glyphicon-inbox'},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'glyph': 'glyphicon-tag'},
        {'title': 'REPORTS',
         'href': '#reports',
         'glyph': 'glyphicon-stats'},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'glyph': 'glyphicon-road'},
        {'title': 'SETTINGS',
         'href': '#settings',
         'glyph': 'glyphicon-cog'}
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
         'glyph': 'glyphicon-home'},
        {'title': 'DONORS',
         'href': '#donors',
         'glyph': 'glyphicon-tint'},
        {'title': 'COMPONENTS',
         'href': '#components',
         'glyph': 'glyphicon-tasks'},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'glyph': 'glyphicon-tag'},
        {'title': 'REPORTS',
         'href': '#reports',
         'glyph': 'glyphicon-stats'},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'glyph': 'glyphicon-road'},
        {'title': 'SETTINGS',
         'href': '#settings',
         'glyph': 'glyphicon-cog'}
      ];
    }

  // else set menu to HOME
  else{
      $scope.currentSection = 'HOME';
      $scope.sectionList = [
        {'title': 'DONORS',
         'href': '#donors',
         'glyph': 'glyphicon-tint'},
        {'title': 'COMPONENTS',
         'href': '#components',
         'glyph': 'glyphicon-tasks'},
        {'title': 'TESTING',
         'href': '#testing',
         'glyph': 'glyphicon-inbox'},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'glyph': 'glyphicon-tag'},
        {'title': 'REPORTS',
         'href': '#reports',
         'glyph': 'glyphicon-stats'},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'glyph': 'glyphicon-road'},
        {'title': 'SETTINGS',
         'href': '#settings',
         'glyph': 'glyphicon-cog'}
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
         'glyph': 'glyphicon-home'},
        {'title': 'COMPONENTS',
         'href': '#components',
         'glyph': 'glyphicon-tasks'},
        {'title': 'TESTING',
         'href': '#testing',
         'glyph': 'glyphicon-inbox'},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'glyph': 'glyphicon-tag'},
        {'title': 'REPORTS',
         'href': '#reports',
         'glyph': 'glyphicon-stats'},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'glyph': 'glyphicon-road'},
        {'title': 'SETTINGS',
         'href': '#settings',
         'glyph': 'glyphicon-cog'}
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
             'glyph': 'glyphicon-home'},
            {'title': 'DONORS',
             'href': '#donors',
             'glyph': 'glyphicon-tint'},
            {'title': 'TESTING',
             'href': '#testing',
             'glyph': 'glyphicon-inbox'},
            {'title': 'INVENTORY',
             'href': '#inventory',
             'glyph': 'glyphicon-tag'},
            {'title': 'REPORTS',
             'href': '#reports',
             'glyph': 'glyphicon-stats'},
            {'title': 'MOBILE CLINIC',
             'href': '#mobile',
             'glyph': 'glyphicon-road'},
            {'title': 'SETTINGS',
             'href': '#settings',
             'glyph': 'glyphicon-cog'}
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
         'glyph': 'glyphicon-home'},
        {'title': 'DONORS',
         'href': '#donors',
         'glyph': 'glyphicon-tint'},
        {'title': 'COMPONENTS',
         'href': '#components',
         'glyph': 'glyphicon-tasks'},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'glyph': 'glyphicon-tag'},
        {'title': 'REPORTS',
         'href': '#reports',
         'glyph': 'glyphicon-stats'},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'glyph': 'glyphicon-road'},
        {'title': 'SETTINGS',
         'href': '#settings',
         'glyph': 'glyphicon-cog'}
      ];
    }

    // else set menu to HOME
    else{
      $scope.currentSection = 'HOME';
      $scope.sectionList = [
        {'title': 'DONORS',
         'href': '#donors',
         'glyph': 'glyphicon-tint'},
        {'title': 'COMPONENTS',
         'href': '#components',
         'glyph': 'glyphicon-tasks'},
        {'title': 'TESTING',
         'href': '#testing',
         'glyph': 'glyphicon-inbox'},
        {'title': 'INVENTORY',
         'href': '#inventory',
         'glyph': 'glyphicon-tag'},
        {'title': 'REPORTS',
         'href': '#reports',
         'glyph': 'glyphicon-stats'},
        {'title': 'MOBILE CLINIC',
         'href': '#mobile',
         'glyph': 'glyphicon-road'},
        {'title': 'SETTINGS',
         'href': '#settings',
         'glyph': 'glyphicon-cog'}
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
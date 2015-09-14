'use strict';

angular.module('bsis')
.controller('HeaderCtrl', function ($scope, $location, AuthService, ICONS, PERMISSIONS, UI) {

  $scope.icons = ICONS;

  $scope.isPasswordReset = function() {
    var loggedOnUser = AuthService.getLoggedOnUser();
    return loggedOnUser && loggedOnUser.passwordReset;
  };

  $scope.sectionList = [
    {'title': 'HOME',
      'href': '#home',
      'icon': ICONS.HOME,
      'permission': '',
      'sectionEnabled' : 'true'
    },
    {'title': 'DONORS',
      'href': '#donors',
      'icon': ICONS.DONORS,
      'permission': PERMISSIONS.VIEW_DONOR_INFORMATION,
      'sectionEnabled' : UI.DONORS_TAB_ENABLED
    },
    {'title': 'COMPONENTS',
      'href': '#components',
      'icon': ICONS.COMPONENTS,
      'permission': PERMISSIONS.VIEW_COMPONENT_INFORMATION,
      'sectionEnabled' : UI.COMPONENTS_TAB_ENABLED
    },
    {'title': 'TESTING',
      'href': '#testing',
      'icon': ICONS.TESTING,
      'permission': PERMISSIONS.VIEW_TESTING_INFORMATION,
      'sectionEnabled' : UI.TESTING_TAB_ENABLED
    },
    {'title': 'LABELLING',
      'href': '#labelling',
      'icon': ICONS.LABELLING,
      'permission': PERMISSIONS.LABEL_COMPONENT,
      'sectionEnabled' : UI.LABELLING_TAB_ENABLED
    },
    {'title': 'INVENTORY',
      'href': '#inventory',
      'icon': ICONS.INVENTORY,
      'permission': PERMISSIONS.VIEW_INVENTORY_INFORMATION,
      'sectionEnabled' : UI.INVENTORY_TAB_ENABLED
    },
    {'title': 'REPORTS',
      'href': '#reports',
      'icon': ICONS.REPORTS,
      'permission': PERMISSIONS.VIEW_REPORTING_INFORMATION,
      'sectionEnabled' : UI.REPORTS_TAB_ENABLED
    },
    {'title': 'MOBILE CLINIC',
      'href': '#mobile',
      'icon': ICONS.MOBILE,
      'permission': PERMISSIONS.VIEW_MOBILE_CLINIC_INFORMATION,
      'sectionEnabled' : UI.MOBILE_CLINIC_TAB_ENABLED
    },
    {'title': 'SETTINGS',
      'href': '#settings',
      'icon': ICONS.SETTINGS,
      'permission': PERMISSIONS.VIEW_ADMIN_INFORMATION,
      'sectionEnabled' : 'true'
    }
  ];

  var donorRoutes = [
    '/donors',
    '/findDonor',
    '/addDonor',
    '/viewDonor',
    '/addDonation',
    '/manageDonationBatches',
    '/manageClinic',
    '/donorCounselling',
    '/exportDonorList'
  ];

  var componentsRoutes = [
    '/components',
    '/findComponents',
    '/recordComponents',
    '/findDiscards',
    '/discardComponents'
  ];

  var testingRoutes = [
    '/testing',
    '/viewTestResults',
    '/manageTestBatch',
    '/viewTestBatch',
    '/manageTTITesting',
    '/managePendingTests',
    '/manageBloodGroupTesting',
    '/manageBloodGroupMatchTesting',
    '/uploadTestResults'
  ];

  var inventoryRoutes = [
    '/inventory',
    '/manageInventory',
    '/transferComponents',
    '/issueComponents',
    '/componentUsage'
  ];

  var labellingRoutes = [
    '/labelling',
    '/labelComponents'
  ];

  var reportsRoutes = [
    '/reports'
  ];

  var mobileRoutes = [
    '/mobile'
  ];

  var settingsRoutes = [
    '/settings',
    '/accountSettings',
    '/locations',
    '/deferralReasons',
    '/manageDeferralReason',
    '/discardReasons',
    '/manageDiscardReason',
    '/configurations',
    '/manageConfiguration',
    '/users',
    '/manageUser',
    '/roles',
    '/manageRole',
    '/donationTypes',
    '/manageDonationType',
    '/packTypes',
    '/managePackType',
    '/auditLog',
    '/adverseEventTypes',
    '/addAdverseEventType'
  ];

  var setMenuSelection = function() {

    // if on donors page, set menu to DONORS
    if (donorRoutes.indexOf($location.path()) >= 0 || /^\/donorCounselling\/\d+$/.test($location.path()) || /^\/viewDonor\/\d+$/.test($location.path())) {
      $scope.currentSection = 'DONORS';
    }

    // else if on components page, set menu to COMPONENTS
    else if (componentsRoutes.indexOf($location.path()) >= 0) {
      $scope.currentSection = 'COMPONENTS';
    }

    // else if on testing page, set menu to TESTING
    else if (testingRoutes.indexOf($location.path()) >= 0) {
      $scope.currentSection = 'TESTING';
    }

      // else if on inventory page, set menu to INVENTORY
    else if (inventoryRoutes.indexOf($location.path()) >= 0) {
      $scope.currentSection = 'INVENTORY';
    }

      // else if on labelling page, set menu to LABELLING
    else if (labellingRoutes.indexOf($location.path()) >= 0) {
      $scope.currentSection = 'LABELLING';
    }

    // else if on reports page, set menu to REPORTS
    else if (reportsRoutes.indexOf($location.path()) >= 0) {
      $scope.currentSection = 'REPORTS';
    }

    // else if on mobile clinic page, set menu to MOBILE
    else if (mobileRoutes.indexOf($location.path()) >= 0) {
      $scope.currentSection = 'MOBILE';
    }

    // else if on settings page, set menu to SETTINGS
    else if (settingsRoutes.indexOf($location.path()) >= 0 || /^\/editAdverseEventType\/\d+$/.test($location.path())) {
      $scope.currentSection = 'SETTINGS';
    }

    // else set menu to HOME
    else {
      $scope.currentSection = 'HOME';
    }

  };

  //set menu on location change
  var unregisterLocationListener = $scope.$on('$locationChangeStart', setMenuSelection);
  $scope.$on('$destroy', function() {
    unregisterLocationListener();
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
    $location.path('/');
  };

  // set menu on initial load
  setMenuSelection();

});

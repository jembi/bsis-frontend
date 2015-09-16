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
    '/exportDonorList',
    '/donorCounselling/\\d+'
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
    '/addAdverseEventType',
    '/editAdverseEventType/\\d+'
  ];

  /**
   * Test the path against the provided regular expressions.
   *
   * The expressions are prefixed with ^ and suffixed with $ so that only exact
   * matches are counted.
   *
   * @returns {Boolean} true if at least one route matches.
   */
  function matchesRoutes(path, routes) {
    return routes.some(function(route) {
      return new RegExp('^' + route + '$').test(path);
    });
  }

  var setMenuSelection = function() {

    // if on donors page, set menu to DONORS
    if (matchesRoutes($location.path(), donorRoutes)) {
      $scope.currentSection = 'DONORS';
    }

    // else if on components page, set menu to COMPONENTS
    else if (matchesRoutes($location.path(), componentsRoutes)) {
      $scope.currentSection = 'COMPONENTS';
    }

    // else if on testing page, set menu to TESTING
    else if (matchesRoutes($location.path(), testingRoutes)) {
      $scope.currentSection = 'TESTING';
    }

      // else if on inventory page, set menu to INVENTORY
    else if (matchesRoutes($location.path(), inventoryRoutes)) {
      $scope.currentSection = 'INVENTORY';
    }

      // else if on labelling page, set menu to LABELLING
    else if (matchesRoutes($location.path(), labellingRoutes)) {
      $scope.currentSection = 'LABELLING';
    }

    // else if on reports page, set menu to REPORTS
    else if (matchesRoutes($location.path(), reportsRoutes)) {
      $scope.currentSection = 'REPORTS';
    }

    // else if on mobile clinic page, set menu to MOBILE
    else if (matchesRoutes($location.path(), mobileRoutes)) {
      $scope.currentSection = 'MOBILE';
    }

    // else if on settings page, set menu to SETTINGS
    else if (matchesRoutes($location.path(), settingsRoutes)) {
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

'use strict';

angular.module('bsis')
  .controller('HeaderCtrl', function($scope, $location, AuthService, ConfigurationsService, ICONS, PERMISSIONS, UI) {

    $scope.icons = ICONS;
    var uuidRegexPattern = '[0-9a-f\\-]*';
    $scope.warningMessage = ConfigurationsService.getStringValue('ui.header.warningMessage');

    $scope.isPasswordReset = function() {
      var loggedOnUser = AuthService.getLoggedOnUser();
      return loggedOnUser && loggedOnUser.passwordReset;
    };

    $scope.sectionList = [
      {
        'title': 'HOME',
        'href': '#home',
        'icon': ICONS.HOME,
        'permission': PERMISSIONS.AUTHENTICATED,
        'sectionEnabled': 'true'
      },
      {
        'title': 'DONORS',
        'href': '#donors',
        'icon': ICONS.DONORS,
        'permission': PERMISSIONS.VIEW_DONOR_INFORMATION,
        'sectionEnabled': UI.DONORS_TAB_ENABLED
      },
      {
        'title': 'COMPONENTS',
        'href': '#components',
        'icon': ICONS.COMPONENTS,
        'permission': PERMISSIONS.VIEW_COMPONENT_INFORMATION,
        'sectionEnabled': UI.COMPONENTS_TAB_ENABLED
      },
      {
        'title': 'TESTING',
        'href': '#testing',
        'icon': ICONS.TESTING,
        'permission': PERMISSIONS.VIEW_TESTING_INFORMATION,
        'sectionEnabled': UI.TESTING_TAB_ENABLED
      },
      {
        'title': 'LABELLING',
        'href': '#labelling',
        'icon': ICONS.LABELLING,
        'permission': PERMISSIONS.LABEL_COMPONENT,
        'sectionEnabled': UI.LABELLING_TAB_ENABLED
      },
      {
        'title': 'INVENTORY',
        'href': '#inventory',
        'icon': ICONS.INVENTORY,
        'permission': PERMISSIONS.VIEW_INVENTORY_INFORMATION,
        'sectionEnabled': UI.INVENTORY_TAB_ENABLED
      },
      {
        'title': 'REPORTS',
        'href': '#reports',
        'icon': ICONS.REPORTS,
        'permission': PERMISSIONS.VIEW_REPORTING_INFORMATION,
        'sectionEnabled': UI.REPORTS_TAB_ENABLED
      },
      {
        'title': 'MOBILE CLINIC',
        'href': '#mobile',
        'icon': ICONS.MOBILE,
        'permission': PERMISSIONS.VIEW_MOBILE_CLINIC_INFORMATION,
        'sectionEnabled': UI.MOBILE_CLINIC_TAB_ENABLED
      },
      {
        'title': 'SETTINGS',
        'href': '#settings',
        'icon': ICONS.SETTINGS,
        'permission': PERMISSIONS.AUTHENTICATED,
        'sectionEnabled': 'true'
      }
    ];

    var donorRoutes = [
      '/donors',
      '/findDonor',
      '/duplicateDonors',
      '/manageDuplicateDonors',
      '/manageDonors',
      '/addDonor',
      '/viewDonor/' + uuidRegexPattern,
      '/addDonation',
      '/manageDonationBatches',
      '/manageClinic',
      '/donorCounselling',
      '/exportDonorList',
      '/donorCounselling/' + uuidRegexPattern,
      '/manageClinic/' + uuidRegexPattern
    ];

    var componentsRoutes = [
      '/components',
      '/findComponents',
      '/recordComponents',
      '/findDiscards',
      '/discardComponents',
      '/addComponentBatch',
      '/viewComponentBatch/' + uuidRegexPattern,
      '/viewComponentBatches'
    ];

    var testingRoutes = [
      '/testing',
      '/viewTestSample',
      '/manageTestBatch',
      '/viewTestBatch/' + uuidRegexPattern,
      '/manageTTITesting/' + uuidRegexPattern + '/\\w+',
      '/reEnterTTI/' + uuidRegexPattern + '/\\w+',
      '/reEnterBloodTyping/' + uuidRegexPattern + '/\\w+',
      '/managePendingTests/' + uuidRegexPattern + '/\\w+',
      '/manageBloodGroupTesting/' + uuidRegexPattern + '/\\w+',
      '/managePendingBloodTypingTests/' + uuidRegexPattern + '/\\w+',
      '/manageBloodGroupMatchTesting/' + uuidRegexPattern
    ];

    var inventoryRoutes = [
      '/inventory',
      '/findInventory',
      '/viewStockLevels',
      '/manageOrders',
      '/fulfilOrder/' + uuidRegexPattern,
      '/viewOrder/' + uuidRegexPattern,
      '/viewOrders',
      '/manageReturns',
      '/recordReturn/' + uuidRegexPattern,
      '/viewReturn/' + uuidRegexPattern,
      '/viewReturns',
      '/recordTransfusions',
      '/findTransfusion'
    ];

    var labellingRoutes = [
      '/labelling',
      '/findSafeComponents',
      '/labelComponents'
    ];

    var reportsRoutes = [
      '/reports',
      '/aboRhGroupsReport',
      '/donationTypesReport',
      '/ttiPrevalenceReport',
      '/bloodUnitsIssuedReport',
      '/donorsDeferredReport',
      '/unitsDiscardedReport',
      '/componentsProducedReport',
      '/donorsAdverseEventsReport',
      '/transfusionsReport'
    ];

    var mobileRoutes = [
      '/mobile',
      '/lookUp',
      '/mobileDonorCounselling',
      '/mobileClinicExport'
    ];

    var settingsRoutes = [
      '/settings',
      '/accountSettings',
      '/locations',
      '/manageLocation/?' + uuidRegexPattern,
      '/componentTypes',
      '/manageComponentType/?' + uuidRegexPattern,
      '/manageComponentTypeCombination/?' + uuidRegexPattern,
      '/deferralReasons',
      '/manageDeferralReason/?' + uuidRegexPattern,
      '/discardReasons',
      '/manageDiscardReason/?' + uuidRegexPattern,
      '/configurations',
      '/manageConfiguration/?' + uuidRegexPattern,
      '/users',
      '/manageUser/?' + uuidRegexPattern,
      '/roles',
      '/manageRole/?' + uuidRegexPattern,
      '/donationTypes',
      '/manageDonationType/?' + uuidRegexPattern,
      '/packTypes',
      '/managePackType/?' + uuidRegexPattern,
      '/auditLog',
      '/adverseEventTypes',
      '/addAdverseEventType',
      '/editAdverseEventType/?' + uuidRegexPattern,
      '/divisions',
      '/manageDivision',
      '/manageDivision/?' + uuidRegexPattern,
      '/dataExport',
      '/componentTypeCombinations',
      '/bloodTests',
      '/manageBloodTest/?' + uuidRegexPattern,
      '/bloodTestingRules',
      '/manageBloodTestingRule/?' + uuidRegexPattern,
      '/transfusionReactionTypes',
      '/manageTransfusionReactionType/?' + uuidRegexPattern
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
      if (matchesRoutes($location.path(), donorRoutes)) { // if on donors page, set menu to DONORS
        $scope.currentSection = 'DONORS';
      } else if (matchesRoutes($location.path(), componentsRoutes)) { // else if on components page, set menu to COMPONENTS
        $scope.currentSection = 'COMPONENTS';
      } else if (matchesRoutes($location.path(), testingRoutes)) { // else if on testing page, set menu to TESTING
        $scope.currentSection = 'TESTING';
      } else if (matchesRoutes($location.path(), inventoryRoutes)) { // else if on inventory page, set menu to INVENTORY
        $scope.currentSection = 'INVENTORY';
      } else if (matchesRoutes($location.path(), labellingRoutes)) { // else if on labelling page, set menu to LABELLING
        $scope.currentSection = 'LABELLING';
      } else if (matchesRoutes($location.path(), reportsRoutes)) { // else if on reports page, set menu to REPORTS
        $scope.currentSection = 'REPORTS';
      } else if (matchesRoutes($location.path(), mobileRoutes)) { // else if on mobile clinic page, set menu to MOBILE
        $scope.currentSection = 'MOBILE CLINIC';
      } else if (matchesRoutes($location.path(), settingsRoutes)) { // else if on settings page, set menu to SETTINGS
        $scope.currentSection = 'SETTINGS';
      } else { // else set menu to HOME
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

    $scope.logout = function() {
      AuthService.logout();
      $location.path('/');
    };

    // set menu on initial load
    setMenuSelection();

  });

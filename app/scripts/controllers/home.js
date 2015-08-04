'use strict';

angular.module('bsis')
  .controller('HomeCtrl', function ($scope, ICONS, PERMISSIONS,
                                    DONORS_TAB_ENABLED, COMPONENTS_TAB_ENABLED, TESTING_TAB_ENABLED,
                                    LABELLING_TAB_ENABLED, INVENTORY_TAB_ENABLED, REPORTS_TAB_ENABLED,
                                    MOBILE_CLINIC_TAB_ENABLED) {

    $scope.donorsTabEnabled = DONORS_TAB_ENABLED;
    $scope.componentsTabEnabled = COMPONENTS_TAB_ENABLED;
    $scope.testingTabEnabled = TESTING_TAB_ENABLED;
    $scope.labellingTabEnabled = LABELLING_TAB_ENABLED;
    $scope.inventoryTabEnabled = INVENTORY_TAB_ENABLED;
    $scope.reportsTabEnabled = REPORTS_TAB_ENABLED;
    $scope.mobileClinicTabEnabled = MOBILE_CLINIC_TAB_ENABLED;
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

  });

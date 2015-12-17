'use strict';

angular.module('bsis')
    .controller('HomeCtrl', function ($scope, ICONS, PERMISSIONS, UI) {
        $scope.donorsTabEnabled = UI.DONORS_TAB_ENABLED;
        $scope.componentsTabEnabled = UI.COMPONENTS_TAB_ENABLED;
        $scope.testingTabEnabled = UI.TESTING_TAB_ENABLED;
        $scope.labellingTabEnabled = UI.LABELLING_TAB_ENABLED;
        $scope.inventoryTabEnabled = UI.INVENTORY_TAB_ENABLED;
        $scope.reportsTabEnabled = UI.REPORTS_TAB_ENABLED;
        $scope.mobileClinicTabEnabled = UI.MOBILE_CLINIC_TAB_ENABLED;
        $scope.icons = ICONS;
        $scope.permissions = PERMISSIONS;

    });

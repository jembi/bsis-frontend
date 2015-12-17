'use strict';

angular.module('bsis')
    .controller('InventoryCtrl', function ($scope, $rootScope, $location, InventoryService, ICONS, PERMISSIONS) {

        $scope.icons = ICONS;
        $scope.permissions = PERMISSIONS;

        $scope.isCurrent = function (path) {
            var initialView = '';
            if (path.length > 1 && $location.path().substr(0, path.length) === path) {
                $location.path(path);
                $scope.selection = path;
                return true;
            } else if ($location.path() === path) {
                return true;
            } else {
                // for first time load of /inventory view, determine the initial view
                if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_COMPONENT) > -1)) {
                    initialView = '/manageInventory';
                }
                else if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.ISSUE_COMPONENT) > -1)) {
                    initialView = '/transferComponents';
                }

                // if first time load of /inventory view , and path === initialView, return true
                if ($location.path() === "/inventory" && path === initialView) {
                    $location.path(initialView);
                    return true;
                }

                return false;
            }
        };
    });

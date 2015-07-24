'use strict';

angular.module('bsis')
  .controller('DiscardReasonsCtrl', function ($scope, $location, DiscardReasonsService, ngTableParams, $timeout, $filter, ICONS, PERMISSIONS) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    var data = [{}];
    $scope.data = data;
    $scope.discardReasons = {};

    $scope.clear = function () {

    };

    $scope.clearForm = function (form) {
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.getDiscards = function () {
      DiscardReasonsService.getDiscards(function (response) {
        if (response !== false) {
          data = response;
          $scope.data = data;
          $scope.discardReasons = data;
          $scope.discardReasonsCount = $scope.discardReasons.length;

        }
        else {
        }
      });
    };

    $scope.discardsTableParams = new ngTableParams({
        page: 1,            // show first page
        count: 6,          // count per page
        filter: {},
        sorting: {}
      },
      {
        defaultSort: 'asc',
        counts: [], // hide page counts control
        total: data.length, // length of data
        getData: function ($defer, params) {
          var filteredData = params.filter() ?
            $filter('filter')(data, params.filter()) : data;
          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) : data;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.$watch("data", function () {
      $timeout(function () {
        $scope.discardsTableParams.reload();
      });
    });

    $scope.addNewDiscardReason = function () {
      DiscardReasonsService.setDiscardReason("");
      $location.path('/manageDiscardReason');
    };

    $scope.manageDiscardReason = function (discard) {
      $scope.discard = discard;
      DiscardReasonsService.setDiscardReason(discard);
      $location.path("/manageDiscardReason");
    };

    $scope.getDiscards();

  })

  .controller('ManageDiscardReasonsCtrl', function ($scope, $location, DiscardReasonsService, ICONS, PERMISSIONS, DATATYPES) {
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.selection = '/manageDiscardReason';

    $scope.discard = DiscardReasonsService.getDiscardReason();

    if ($scope.discard === "") {
      $scope.discard = {
        isDeleted : false
      };
    } else {
      $scope.disableDiscardname = true;
    }

    $scope.dataTypes = DATATYPES.options;

    $scope.saveDiscardReason = function (discard, discardForm) {

      if (discardForm.$valid) {
        if (typeof(discard) != 'undefined') {
          if (typeof(discard.id) != 'undefined') {
            $scope.updateDiscardReason(discard, discardForm);
          } else {
            $scope.addDiscardReason(discard, discardForm);
          }
        } else {

        }
      } else {
        $scope.submitted = true;
      }
    };

    $scope.serverError = {};


    $scope.updateDiscardReason = function (discard, discardForm) {
      if (discardForm.$valid) {

        DiscardReasonsService.updateDiscardReason(discard, function (response, err) {
          if (response !== false) {
            $scope.go('/discardReasons');
          } else {

            if (err.reason) {
              $scope.discardReasonInvalid = "ng-invalid";
              $scope.serverError.reason = err.reason;
            }
          }
        });
      } else {
        $scope.submitted = true;
      }
    };


    $scope.addDiscardReason = function (discard, discardForm) {

      if (discardForm.$valid) {
        discard.isDeleted = false;
        DiscardReasonsService.addDiscardReason(discard, function (response, err) {
          if (response !== false) {
            $scope.discard = {
              reason: '',
              isDeleted: false
            };
            discardForm.$setPristine();
            $scope.submitted = '';
            $scope.go('/discardReasons');
          }
          else {
            if (err.reason) {
              $scope.discardReasonInvalid = "ng-invalid";
              $scope.serverError.reason = err.reason;
            }
          }
        });
      }
      else {
        $scope.submitted = true;
      }
    };

    $scope.clearForm = function (form) {
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.cancel = function (form) {
      $scope.clearForm(form);
      $location.path("/discardReasons");
    };


    $scope.go = function (path) {
      $location.path(path);
    };
  });
'use strict';

angular.module('bsis')
  .controller('DeferralsCtrl', function ($scope, $location, DeferralsService, ngTableParams, $timeout, $filter, ICONS, PERMISSIONS) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    var data = [{}];
    $scope.data = data;
    $scope.deferrals = {};

    $scope.clear = function () {

    };

    $scope.clearForm = function(form){
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.getDeferrals = function () {
      DeferralsService.getDeferrals(function(response){
        if (response !== false){
          data = response;
          $scope.data = data;
          $scope.deferrals = data;
          $scope.deferralsCount = $scope.deferrals.length;

        }
        else{
        }
      });
    };

    $scope.deferralsTableParams = new ngTableParams({
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
        $scope.deferralsTableParams.reload();
      });
    });

    $scope.addNewDeferral = function () {
      DeferralsService.setDeferral("");
      $location.path('/manageDeferral');
    };

    $scope.manageDeferral = function (deferral) {
      $scope.deferral = deferral;
      DeferralsService.setDeferral(deferral);
      $location.path("/manageDeferral");
    };

    $scope.getDeferrals();

  })

  .controller('ManageDeferralsCtrl', function ($scope, $location, DeferralsService, ICONS, PERMISSIONS, DATATYPES){
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.selection = '/manageDeferral';

    $scope.deferral = DeferralsService.getDeferral();

    if ($scope.deferral === ""){
      $scope.deferral = {};
    } else {
      $scope.disableDeferralname = true;
    }

    $scope.dataTypes = DATATYPES.options;

    $scope.saveDeferral = function (deferral, deferralForm) {

      if (deferralForm.$valid) {
        if (typeof(deferral) != 'undefined') {
          if (typeof(deferral.id) != 'undefined') {
            $scope.updateDeferral(deferral, deferralForm);
          } else {
            $scope.addDeferral(deferral, deferralForm);
          }
        } else {

        }
      } else {
        $scope.submitted = true;
      }
    };

    $scope.serverError = {};


    $scope.updateDeferral = function (deferral, deferralForm) {
      if (deferralForm.$valid) {

        DeferralsService.updateDeferral(deferral, function (response, err) {
          if (response !== false){
            $scope.go('/deferrals');
          } else{

            if(err.value){
              $scope.deferralValueInvalid = "ng-invalid";
              $scope.serverError.value = err.value;
            }

            if(err.name){
              $scope.deferralNameInvalid = "ng-invalid";
              $scope.serverError.name = err.name;
            }
          }
        });
      } else {
        $scope.submitted = true;
      }
    };


    $scope.addDeferral = function (deferral, deferralForm) {

      if (deferralForm.$valid) {
        DeferralsService.addDeferral(deferral, function (response, err) {
          if (response !== false) {
            $scope.deferral = {
              name: '',
              description: ''
            };
            deferralForm.$setPristine();
            $scope.submitted = '';
            $scope.go('/deferrals');
          }
          else {
            if(err.value){
              $scope.deferralValueInvalid = "ng-invalid";
              $scope.serverError.value = err.value;
            }

            if(err.name){
              $scope.deferralNameInvalid = "ng-invalid";
              $scope.serverError.name = err.name;
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
      $location.path("/deferrals");
    };


    $scope.go = function (path) {
      $location.path(path);
    };
  });

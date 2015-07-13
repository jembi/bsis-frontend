'use strict';

angular.module('bsis')
  .controller('ConfigurationsCtrl', function ($scope, $location, ConfigurationsService, ICONS, PERMISSIONS, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    var data = [{}];
    $scope.data = data;
    $scope.configurations = {};

    $scope.clear = function () {

    };

    $scope.clearForm = function(form){
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.getConfigurations = function () {
      ConfigurationsService.getConfigurations(function(response){
        if (response !== false){
          data = response;
          $scope.configurations = data;
          console.log("configurations: ",response);
        }
        else{

        }
      });

    };

    $scope.configurationsTableParams = new ngTableParams({
        page: 1,            // show first page
        count: 6,          // count per page
        filter: {},
        sorting: {}
      },
      {
        defaultSort: 'asc',
        counts: [], // hide page counts control
        total: $scope.data.length, // length of data
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
        $scope.configurationsTableParams.reload();
      });
    });

    $scope.addNewConfiguration = function () {
      ConfigurationsService.setConfiguration("");
      $location.path('/manageConfiguration');
    };

    $scope.manageConfiguration = function (configuration) {
      $scope.configuration = configuration;
      ConfigurationsService.setConfiguration(configuration);
      $location.path("/manageConfiguration");
    };

    $scope.getConfigurations();

  })

  .controller('ManageConfigurationsCtrl', function ($scope, $location, ConfigurationsService, ICONS, PERMISSIONS, DATEFORMAT){
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.selection = '/manageConfiguration';

    $scope.configuration = ConfigurationsService.getConfiguration();

    if ($scope.configuration === ""){
      $scope.configuration = {};
    } else {
      $scope.disableConfigurationname = true;
    }

    $scope.saveConfiguration = function (configuration, configurationForm) {
      if (configurationForm.$valid) {
        if (typeof(configuration) != 'undefined') {
          if (typeof(configuration.id) != 'undefined') {
            $scope.updateConfiguration(configuration, configurationForm);
          } else {
            $scope.addConfiguration(configuration, configurationForm);
          }
        } else {

        }
      } else {
        $scope.submitted = true;
      }
    };


    $scope.updateConfiguration = function (configuration, configurationForm) {
      if (configurationForm.$valid) {

        ConfigurationsService.updateConfiguration(configuration, function (response, err) {
          if (response !== false){
            $scope.go('/configurations');
          } else{
            if(err["configuration.configurationname"]){
              $scope.configurationnameInvalid = "ng-invalid";
              $scope.serverError = err["configuration.configurationname"];
            }
          }
        });
      } else {
        $scope.submitted = true;
      }
    };


    $scope.addConfiguration = function (configuration, configurationForm) {

      if (configurationForm.$valid) {
        ConfigurationsService.addConfiguration(configuration, function (response, err) {
          if (response !== false) {
            $scope.configuration = {
              name: '',
              description: ''
            };
            configurationForm.$setPristine();
            $scope.submitted = '';
            $scope.go('/configurations');
          }
          else {
            if(err["configuration.configurationname"]){
              $scope.configurationnameInvalid = "ng-invalid";
              $scope.serverError = err["configuration.configurationname"];
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
      $location.path("/configurations");
    };


    $scope.go = function (path) {
      $location.path(path);
    };
  });

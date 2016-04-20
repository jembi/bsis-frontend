angular.module('bsis')
  .controller('DiscardComponentsCtrl', function($scope, $location, ComponentService, ICONS, PERMISSIONS, $filter, ngTableParams, $timeout, $routeParams) {

    $scope.componentsSearch = $routeParams;

    var data = [{}];
    $scope.data = data;
    $scope.discard = {};

    $scope.clear = function() {
      $scope.componentsSearch = {};
      $scope.discardsSearch = {};
      $scope.searchResults = '';
      $scope.selectedComponentTypes = {};
      $scope.componentSelected = '';
      $location.search({});
    };

    $scope.clearForm = function(form) {
      form.$setPristine();
      $location.search({});
      $scope.submitted = '';
    };

    $scope.clearDiscardComponentForm = function() {
      $location.search({});
      $scope.discard = {};
      $scope.componentSelected = '';
      $scope.submitted = '';
      $scope.selectedComponents = [];
    };

    ComponentService.getComponentsFormFields(function(response) {
      if (response !== false) {
        $scope.data = response;
        $scope.componentTypes = $scope.data.componentTypes;
        $scope.discardReasons = $scope.data.discardReasons;
        $scope.icons = ICONS;
        $scope.permissions = PERMISSIONS;
        $scope.selectedComponents = [];
      }
    });

    $scope.discardComponents = function(discardComponentsForm) {

      if (discardComponentsForm.$valid && $scope.selectedComponents.length > 0) {

        $scope.discard.selectedComponents = $scope.selectedComponents;

        angular.forEach($scope.discard.selectedComponents, function(component) {
          $scope.componentToDiscard = {};
          $scope.componentToDiscard.componentId = component;
          $scope.componentToDiscard.discardReason = $scope.discard.discardReason;
          $scope.componentToDiscard.discardReasonText = $scope.discard.discardReasonText;

          $scope.discardingComponent = true;
          ComponentService.discardComponent($scope.componentToDiscard, function(discardResponse) {
            if (discardResponse !== false) {
              data = discardResponse.components;
              $scope.data = data;
              $scope.discard = {};
              discardComponentsForm.$setPristine();
              $scope.submitted = '';
              $scope.componentSelected = '';
              $scope.selectedComponents = [];
              $scope.discardingComponent = false;
            } else {
              // TODO: handle case where response == false
              $scope.discardingComponent = false;
            }
          });
        });
      } else {
        $scope.submitted = true;
        $scope.componentSelected = $scope.selectedComponents.length > 0;
      }
    };

    $scope.componentsTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 6,          // count per page
      filter: {},
      sorting: {}
    },
      {
        defaultSort: 'asc',
        counts: [], // hide page counts control
        total: data.length, // length of data
        getData: function($defer, params) {
          var filteredData = params.filter() ?
            $filter('filter')(data, params.filter()) : data;
          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) : data;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.getComponentsByDIN = function() {
      $scope.componentsSearch.search = true;
      $location.search($scope.componentsSearch);

      $scope.searching = true;
      ComponentService.getComponentsByDIN($scope.componentsSearch.donationIdentificationNumber, function(componentsResponse) {
        if (componentsResponse !== false) {
          data = componentsResponse.components;
          $scope.data = data;

          $scope.searchResults = $scope.data.length !== 0;
          $scope.searching = false;
        } else {
          $scope.searchResults = false;
          $scope.searching = false;
        }
      });
    };

    if ($routeParams.search) {
      $scope.getComponentsByDIN();
    }

    $scope.$watch('data', function() {
      $timeout(function() {
        $scope.componentsTableParams.reload();
      });
    });

    // toggle selection util method to toggle checkboxes
    $scope.toggleSelection = function toggleSelection(componentId) {
      var idx = $scope.selectedComponents.indexOf(componentId);
      // is currently selected
      if (idx > -1) {
        $scope.selectedComponents.splice(idx, 1);
      } else {
        $scope.selectedComponents.push(componentId);
      }
    };
  });
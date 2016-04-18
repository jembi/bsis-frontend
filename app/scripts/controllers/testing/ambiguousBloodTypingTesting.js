'use strict';

angular.module('bsis')

  .controller('AmbiguousBloodTypingTestingCtrl', function($scope, $location, $log, TestingService, $q, $filter, ngTableParams, $timeout, $routeParams, BLOODABO, BLOODRH) {

    $scope.bloodAboOptions = BLOODABO;
    $scope.bloodRhOptions = BLOODRH;
    $scope.data = [];

    $scope.go = function(path) {
      $location.path(path + '/' + $routeParams.id);
    };

    var getSamples = function() {
      TestingService.getTestBatchDonations($routeParams.id, 'AMBIGUOUS', function(response) {
        $scope.data = response.donations;
        $scope.testBatchCreatedDate = response.testBatchCreatedDate;
        $scope.numberOfDonations = response.numberOfDonations;
        $scope.bloodTypingResolutions = {};

        angular.forEach($scope.data, function(sample) {
          var din = sample.donationIdentificationNumber;
          $scope.bloodTypingResolutions[din] = {};
          $scope.bloodTypingResolutions[din].donationIdentificationNumber = din;
          $scope.bloodTypingResolutions[din].bloodAbo = sample.bloodAbo;
          $scope.bloodTypingResolutions[din].bloodRh = sample.bloodRh;
          $scope.bloodTypingResolutions[din].resolved = false;
          $scope.bloodTypingResolutions[din].indeterminate = false;
          $scope.bloodTypingResolutions[din].id = sample.id;
        });
      }, function(err) {
        $log.error(err);
      });
    };

    getSamples();

    $scope.saveBloodTypingResolutions = function(bloodTypingResolutions) {

      $scope.savingTestResults = true;
      var bloodTypingResolutionsArray = {};
      bloodTypingResolutionsArray.bloodTypingResolutions = [];
      var requests = [];

      angular.forEach(bloodTypingResolutions, function(bloodTypingResolution) {
        // only save if resolved == true or indeterminate == true
        if (bloodTypingResolution.resolved || bloodTypingResolution.indeterminate) {
          var status = 'RESOLVED';
          if (bloodTypingResolution.indeterminate) {
            status = 'NO_TYPE_DETERMINED';
          }
          bloodTypingResolution.status = status;
          var bloodTypingResolutionForm = {};
          
          bloodTypingResolutionForm.status = bloodTypingResolution.status;
          bloodTypingResolutionForm.bloodAbo = bloodTypingResolution.bloodAbo;
          bloodTypingResolutionForm.bloodRh = bloodTypingResolution.bloodRh;
          bloodTypingResolutionForm.donationId = bloodTypingResolution.id;


          bloodTypingResolutionsArray.bloodTypingResolutions.push(bloodTypingResolutionForm);
        }
      });

      var request = TestingService.saveBloodTypingResolutions(bloodTypingResolutionsArray, angular.noop);
      requests.push(request);

      $q.all(requests).then(function() {
        $location.path('/viewTestBatch/' + $routeParams.id);
      }).catch(function(err) {
        $log.error(err);
        // TODO: handle the case where there have been errors
      }).finally(function() {
        $scope.savingTestResults = false;
      });

    };

    $scope.testOutcomesTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      filter: {},
      sorting: {}
    },
      {
        defaultSort: 'asc',
        counts: [], // hide page counts control
        total: $scope.data.length, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.$watch('data', function() {
      $timeout(function() {
        $scope.testOutcomesTableParams.reload();
      });
    });

  })
;

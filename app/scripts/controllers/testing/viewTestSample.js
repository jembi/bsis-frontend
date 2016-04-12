angular.module('bsis').controller('ViewTestSampleCtrl', function($scope, $location, $routeParams, $timeout, TestingService) {

  // Initial values
  $scope.searching = false;
  $scope.donation = null;
  $scope.testResults = [];
  $scope.search = {
    donationIdentificationNumber: $routeParams.donationIdentificationNumber || null
  };

  // Find the test sample when the form is submitted
  $scope.findTestSample = function() {
    $location.search(angular.extend({search: true}, $scope.search));
    $scope.searching = true;
    TestingService.getTestResultsByDIN($scope.search.donationIdentificationNumber, function(response) {
      if (response !== false && response.testResults) {
        $scope.donation = response.donation;
        $scope.testResults = response.testResults.recentTestResults;
      }
      $scope.searching = false;
    });
  };

  // Clear the search form
  $scope.clear = function() {
    $location.search({});
    $scope.searching = false;
    $scope.donation = null;
    $scope.testResults = [];
    $scope.search.donationIdentificationNumber = null;
    $scope.viewTestSampleForm.$setPristine();
  };

  if ($routeParams.search) {
    // Defer doing the search until after the form has been loaded
    $timeout(function() {
      $scope.findTestSample();
      $scope.viewTestSampleForm.$setSubmitted();
    });
  }
});

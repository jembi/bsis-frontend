'use strict';

angular.module('bsis')
  .controller('AddDonorCtrl', function($scope, $location, $routeParams, $modal, ConfigurationsService, DonorService, DATEFORMAT, MONTH, TITLE, GENDER) {

    var minAge = ConfigurationsService.getIntValue('donors.minimumAge');
    var maxAge = ConfigurationsService.getIntValue('donors.maximumAge') || 100;
    var minBirthDate = moment().subtract(maxAge, 'years');
    var maxBirthDate = moment().subtract(minAge, 'years');

    DonorService.getDonorFormFields(function(response) {
      if (response !== false) {
        $scope.data = response;
        $scope.addressTypes = $scope.data.addressTypes;
        $scope.languages = $scope.data.languages;
        $scope.venues = $scope.data.venues;
        $scope.donor = $scope.data.addDonorForm;
        $scope.searchDonor = DonorService.getDonor();
        $scope.donor.firstName = $routeParams.firstName;
        $scope.donor.lastName = $routeParams.lastName;

        // clear $scope.searchDonor fields after assigning them to $scope.donor
        $scope.searchDonor.firstName = '';
        $scope.searchDonor.lastName = '';

        $scope.title = TITLE.options;
        $scope.month = MONTH.options;
        $scope.gender = GENDER.options;
      }
    });

    function confirmAddDonor(birthDate) {

      var message;
      if (birthDate.isBefore(minBirthDate)) {
        message = 'This donor is over the maximum age of ' + maxAge + '.';
      } else if (birthDate.isAfter(maxBirthDate)) {
        message = 'This donor is below the minimum age of ' + minAge + '.';
      } else {
        // Don't show confirmation
        return Promise.resolve(null);
      }
      message += ' Are you sure that you want to continue?';

      var modal = $modal.open({
        animation: false,
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: {
            title: 'Invalid donor',
            button: 'Add donor',
            message: message
          }
        }
      });

      return modal.result;
    }

    $scope.addDonor = function(newDonor, dob, valid) {

      if (valid) {

        newDonor.birthDate = dob.year + '-' + dob.month + '-' + dob.dayOfMonth;
        var birthDate = moment(newDonor.birthDate, 'YYYY-MM-DD');

        if (!moment(birthDate).isValid()) {
          $scope.dobValid = false;
          $scope.addingDonor = false;
        } else {

          confirmAddDonor(birthDate).then(function() {

            $scope.addingDonor = true;

            DonorService.addDonor(newDonor, function(donor) {

              $scope.format = DATEFORMAT;
              $scope.initDate = $scope.donor.birthDate;
              $scope.donorBirthDateOpen = false;
              $scope.submitted = '';
              $location.path('/viewDonor/' + donor.id).search({});
            }, function(err) {
              $scope.errorMessage = err.userMessage;
              $scope.err = err;
              if (err['donor.birthDate']) {
                $scope.dobValid = false;
              }
              $scope.addingDonor = false;
            });
          });
        }
      } else {
        $scope.submitted = true;
      }
    };

  });
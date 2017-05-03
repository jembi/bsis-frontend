'use strict';

angular.module('bsis')
  .controller('AddDonorCtrl', function($scope, $location, $routeParams, DonorService, DATEFORMAT, MONTH, TITLE, GENDER) {

    function initialiseDonorForm() {
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

          $scope.title = TITLE.options;
          $scope.month = MONTH.options;
          $scope.gender = GENDER.options;
        }
      });
    }

    function confirmAddDonor(birthDate) {
      return DonorService.checkDonorAge(birthDate);
    }

    $scope.addDonor = function(newDonor, dob, valid) {

      if (valid) {

        var birthDate = moment(dob.year + '-' + dob.month + '-' + dob.dayOfMonth, 'YYYY-M-D');
        newDonor.birthDate = birthDate.format('YYYY-MM-DD');

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

    initialiseDonorForm();

  });

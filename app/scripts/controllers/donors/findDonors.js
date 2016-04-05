'use strict';

angular.module('bsis')
  
.controller('FindDonorsCtrl', function($scope, $rootScope, $location, $routeParams, ConfigurationsService, DonorService, ICONS, PERMISSIONS, DATEFORMAT, $filter, ngTableParams, $timeout, $q, Alerting, UI, $modal) {

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;
  $scope.getBooleanValue = ConfigurationsService.getBooleanValue;
  $scope.alerts = Alerting.getAlerts();
  $scope.ui = UI;

  // Tabs with their active status
  $scope.tabs = {
    overview: false,
    demographics: false,
    donations: false,
    deferrals: false
  };

  var activeTab = $routeParams.tab || 'overview';
  if ($scope.tabs[activeTab] === false) {
    $scope.tabs[activeTab] = true;
  } else {
    $scope.tabs.overview = true;
  }

  var data = [{}];
  $scope.data = data;
  $scope.age = '';

  $scope.donorSearch = $routeParams;
  $scope.searchResults = '';

  $scope.canAddDonors = false;

  $scope.closeAlert = function(alertScope, index) {
    Alerting.alertClose(alertScope, index);
  };

  // Check that at least one search field is entered
  $scope.isDonorSearchValid = function() {
    var search = $scope.donorSearch;
    return search.firstName || search.lastName || search.donorNumber || search.donationIdentificationNumber;
  };

  $scope.findDonor = function(form) {
    if (form && !form.$valid) {
      return;
    }
    $scope.donorSearch.search = true;
    Alerting.setPersistErrors(false);
    $location.search($scope.donorSearch);
    $scope.searching = true;
    DonorService.findDonor($scope.donorSearch, function(response) {
      data = response.donors;
      $scope.searchResults = true;
      $scope.data = response.donors;
      $scope.canAddDonors = response.canAddDonors;
      $scope.searching = false;
    }, function() {
      $scope.searchResults = false;
      $scope.searching = false;
    });
  };

  if ($routeParams.search) {
    $scope.findDonor();
  }

  $scope.$watch('data', function() {
    $timeout(function() {
      $scope.tableParams.reload();
    });
  });

  $scope.isCurrent = function(path) {
    var initialView = '';
    if ($location.path().indexOf('/viewDonor') === 0 && path === '/findDonor') {
      $scope.selection = '/viewDonor';
      return true;
    } else if ($location.path() === '/addDonor' && path === '/findDonor') {
      $scope.selection = $location.path();
      return true;
    } else if ($location.path().indexOf('/manageClinic') === 0 && path === '/manageDonationBatches') {
      $scope.selection = '/manageClinic';
      return true;
    } else if ($location.path().indexOf('/locations') === 0 && path === initialView) {
      $scope.selection = '/locations';
      return true;
    } else if ($location.path().indexOf('/donorCounselling') === 0 && path.indexOf('/donorCounselling') === 0) {
      var currentPath = $location.path();
      $scope.selection = currentPath === '/donorCounselling' ? currentPath : '/donorCounsellingDetails';
      return true;
    } else if (path.length > 1 && $location.path().substr(0, path.length) === path) {
      $location.path(path);
      $scope.selection = path;
      return true;
    } else if ($location.path() === path) {
      return true;
    } else {
      // for first time load of /donors view, determine the initial view
      if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_DONOR) > -1)) {
        initialView = '/findDonor';
      } else if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_DONATION_BATCH) > -1)) {
        initialView = '/manageDonationBatches';
      } else if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.EXPORT_CLINIC_DATA) > -1)) {
        initialView = '/exportDonorList';
      }

      // if first time load of /donors view , and path === initialView, return true
      if ($location.path() === '/donors' && path === initialView) {
        $location.path(initialView);
        return true;
      }

      return false;
    }
  };

  $scope.clear = function(form) {
    if (form) {
      form.$setPristine();
    }
    $location.search({});
    $scope.donorSearch = {};
    $scope.searchResults = '';
    $scope.donation = {};
    $scope.deferral = {};
    $scope.newDonationBatch = {backEntry: false};
    $scope.donorListSearchResults = '';
    $scope.donorList = {};
  };

  $scope.clearForm = function(form) {
    form.$setPristine();
    $location.search({});
    $scope.submitted = '';
  };

  $scope.viewDonor = function(item) {

    $scope.donor = item;
    DonorService.setDonor(item);

    $scope.format = DATEFORMAT;
    $scope.initDate = item.birthDate;
    $scope.calIcon = 'fa-calendar';

    $scope.donorBirthDateOpen = false;

    $location.path('/viewDonor/' + item.id).search({});
  };

  $scope.addNewDonor = function(donor) {
    DonorService.setDonor(donor);
    $location.path('/addDonor');
  };

  var minAge = ConfigurationsService.getIntValue('donors.minimumAge');
  var maxAge = ConfigurationsService.getIntValue('donors.maximumAge') || 100;
  var minBirthDate = moment().subtract(maxAge, 'years');
  var maxBirthDate = moment().subtract(minAge, 'years');

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

  $scope.updateDonor = function(donor) {
    var d = $q.defer();
    DonorService.updateDonor(donor, function(response) {
        $scope.donor = response;
        //Reset Error Message
        $scope.err = null;
        d.resolve();
        if ($scope.donorPermissions) {
          $scope.donorPermissions.canDelete = response.permissions.canDelete;
        }
      },
      function(err) {
        $scope.donor = donor;
        $scope.err = err;
        d.reject('Server Error');
      });
    return d.promise;
  };

  $scope.raiseError = function(errorName, errorMessage) {
    $scope.formErrors.push(
      {
        name: errorName,
        error: errorMessage
      }
    );
  };

  $scope.clearError = function(errorName) {
    $scope.errorObject[errorName] = [];
    $scope.formErrors = $scope.formErrors.filter(function(obj) {
      return obj.name !== errorName;
    });
  };

  $scope.onCancel = function() {
    $scope.errorObject = {};
    $scope.formErrors = [];
  };

  $scope.errorObject = {};

  $scope.getError = function(errorName) {
    $scope.errorObject[errorName] = $scope.formErrors.filter(function(obj) {
      return obj.name == errorName;
    });
  };

  $scope.formErrors = [];

  $scope.checkIdentifier = function(identifierData) {
    if (!identifierData.idNumber || angular.isUndefined(identifierData.idType)) {
      $scope.clearError('identifier');
      $scope.raiseError('identifier', 'Please enter a valid identifier');
      $scope.getError('identifier');
      return ' ';
    } else {
      $scope.clearError('identifier');
    }
  };

  $scope.master = DonorService.getDonor();

  $scope.cancelForm = function(donor, form) {
    $scope.clearForm(form);
    DonorService.getDonorById(donor.id, function(freshDonor) {
      $scope.donor = freshDonor;
      $scope.err = null;
    }, function(err) {
      $scope.err = err;
    });
  };

  $scope.postalSameAsHome = false;
  $scope.workSameAsHome = false;


  $scope.sameAsHome = function(form, addressType) {
    if (addressType == 'Postal') {
      form.postalAddressLine1.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressLine1.$modelValue);
      form.postalAddressLine1.$render();
      form.postalAddressLine2.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressLine2.$modelValue);
      form.postalAddressLine2.$render();
      form.postalAddressCity.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressCity.$modelValue);
      form.postalAddressCity.$render();
      form.postalAddressDistrict.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressDistrict.$modelValue);
      form.postalAddressDistrict.$render();
      form.postalAddressState.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressState.$modelValue);
      form.postalAddressState.$render();
      form.postalAddressProvince.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressProvince.$modelValue);
      form.postalAddressProvince.$render();
      form.postalAddressCountry.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressCountry.$modelValue);
      form.postalAddressCountry.$render();
      form.postalAddressZipcode.$setViewValue((form.postalSameAsHome.$viewValue === false) ? null : form.homeAddressZipcode.$modelValue);
      form.postalAddressZipcode.$render();
    }

    if (addressType == 'Work') {
      form.workAddressLine1.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressLine1.$modelValue);
      form.workAddressLine1.$render();
      form.workAddressLine2.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressLine2.$modelValue);
      form.workAddressLine2.$render();
      form.workAddressCity.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressCity.$modelValue);
      form.workAddressCity.$render();
      form.workAddressDistrict.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressDistrict.$modelValue);
      form.workAddressDistrict.$render();
      form.workAddressState.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressState.$modelValue);
      form.workAddressState.$render();
      form.workAddressProvince.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressProvince.$modelValue);
      form.workAddressProvince.$render();
      form.workAddressCountry.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressCountry.$modelValue);
      form.workAddressCountry.$render();
      form.workAddressZipcode.$setViewValue((form.workSameAsHome.$viewValue === false) ? null : form.homeAddressZipcode.$modelValue);
      form.workAddressZipcode.$render();
    }

  };

  $scope.edit = function() {
  };

  $scope.tableParams = new ngTableParams({
    page: 1,            // show first page
    count: 8,          // count per page
    sorting: {}
  }, {
    defaultSort: 'asc',
    counts: [], // hide page counts control
    total: data.length, // length of data
    getData: function($defer, params) {
      var orderedData = params.sorting() ?
        $filter('orderBy')(data, params.orderBy()) : data;
      params.total(orderedData.length); // set total for pagination
      $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  });
});
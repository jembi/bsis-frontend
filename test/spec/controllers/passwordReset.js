'use strict';
/* global readJSON: true */

describe('Controller: PasswordResetCtrl', function () {

  beforeEach(module('bsis'));

  beforeEach(function(){
    module('bsis', function($provide){
      $provide.constant('SYSTEMCONFIG', readJSON('test/mockData/systemconfig.json'));
    });
  });

  var scope;
  var modalInstance;

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    modalInstance = {
      close: angular.noop
    };

    $controller('PasswordResetCtrl', {
      $scope: scope,
      $modalInstance: modalInstance,
      user: readJSON('test/mockData/superuser.json'),
      password: 'currentPassword'
    });
  }));

  describe('setPassword()', function() {

    it('should do nothing if the form is invalid', inject(function(UsersService) {
      spyOn(UsersService, 'updateLoggedOnUser');

      scope.setPassword({
        passwordResetForm: {
          $invalid: true
        }
      });

      expect(UsersService.updateLoggedOnUser).not.toHaveBeenCalled();
    }));

    it('should display an error message on error', inject(function(UsersService) {
      spyOn(UsersService, 'updateLoggedOnUser').and.callFake(function(update, onSuccess, onError) {
        expect(update.modifyPassword).toBe(true);
        expect(update.currentPassword).toBe('currentPassword');
        expect(update.password).toBe('newPassword');
        expect(update.confirmPassword).toBe('newPassword');
        onError();
      });

      var childScope = {
        passwordResetForm: {
          $invalid: false
        },
        newPassword: 'newPassword',
        confirmPassword: 'newPassword'
      };
      scope.setPassword(childScope);

      expect(UsersService.updateLoggedOnUser).toHaveBeenCalled();
      expect(childScope.errorMessage).toBe('Setting your new password failed. Please try again.');
    }));

    it('should redirect to the home page on success', inject(function($location, UsersService) {
      spyOn($location, 'path');
      spyOn(modalInstance, 'close');
      spyOn(UsersService, 'updateLoggedOnUser').and.callFake(function(update, onSuccess) {
        expect(update.modifyPassword).toBe(true);
        expect(update.currentPassword).toBe('currentPassword');
        expect(update.password).toBe('newPassword');
        expect(update.confirmPassword).toBe('newPassword');
        onSuccess();
      });

      scope.setPassword({
        passwordResetForm: {
          $invalid: false
        },
        newPassword: 'newPassword',
        confirmPassword: 'newPassword'
      });

      expect(UsersService.updateLoggedOnUser).toHaveBeenCalled();
      expect($location.path).toHaveBeenCalledWith('/home');
      expect(modalInstance.close).toHaveBeenCalled();
    }));
  });
});

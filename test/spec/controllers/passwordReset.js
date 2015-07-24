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

  beforeEach(inject(function($controller, $rootScope, AuthService) {
    scope = $rootScope.$new();

    spyOn(AuthService, 'getLoggedOnUser').and.callFake(function() {
      return readJSON('test/mockData/superuser.json');
    });

    $controller('PasswordResetCtrl', {
      $scope: scope
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

    it('should display an error message on error', inject(function($location, UsersService) {
      spyOn($location, 'path');
      spyOn(UsersService, 'updateLoggedOnUser').and.callFake(function(update, onSuccess, onError) {
        expect(update.modifyPassword).toBe(true);
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
      expect($location.path).not.toHaveBeenCalled();
      expect(childScope.errorMessage).toBe('Setting your new password failed. Please try again.');
    }));

    it('should close the modal on success', inject(function($location, UsersService) {
      spyOn($location, 'path');
      spyOn(UsersService, 'updateLoggedOnUser').and.callFake(function(update, onSuccess) {
        expect(update.modifyPassword).toBe(true);
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
    }));
  });
});

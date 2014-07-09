'use strict';

angular.module('bsis')
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .constant('ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
  })
  .constant('PERMISSIONS', {
    VIEW_HOME: 'VIEW_HOME',

    // DONOR PERMISSIONS
    VIEW_DONORS: 'VIEW_DONORS',
    FIND_DONOR: 'FIND_DONOR',
    ADD_DONOR: 'ADD_DONOR',
    LINK_DONATION: 'LINK_DONATION',
    MANAGE_CLINIC: 'MANAGE_CLINIC',
    EXPORT_DONOR_LIST: "EXPORT_DONOR_LIST",

    // COMPONENTS PERMISSIONS
    VIEW_COMPONENTS: 'VIEW_COMPONENTS',

    // TESTING PERMISSIONS
    VIEW_TESTING: 'VIEW_TESTING',

    // INVENTORY PERMISSIONS
    VIEW_INVENTORY: 'VIEW_INVENTORY'

  });
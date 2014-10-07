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
  .constant('ICONS', {
    HOME: 'fa-home',
    DONORS: 'fa-clipboard',
    COMPONENTS: 'fa-filter',
    TESTING: 'fa-flask',
    INVENTORY:  'fa-tint', //'fa-archive',
    LABELLING: 'fa-barcode',
    REPORTS: 'fa-bar-chart-o',
    MOBILE: 'fa-truck',
    SETTINGS: 'fa-cogs',
    USER: 'fa-user',
    ACCOUNT: 'fa-cog',
    LOGOUT: 'fa-sign-out',
    MALE: 'fa-male',
    FEMALE: 'fa-female',
    CALENDAR: 'fa-calendar',
    WARNING: 'fa-warning',
    PLUS: 'fa-plus-square',
    INFO: 'fa-info',
    INFOCIRCLE: 'fa-info-circle',
    COMMENT: 'fa-comment',
    CIRCLE: 'fa-circle',
    CIRCLEO: 'fa-circle-o',
    TINT: 'fa-tint',
    BARS: 'fa-bars',
    ARCHIVE: 'fa-archive',
    PHONE: 'fa-phone',
    GLOBE: 'fa-globe'
  })

  .constant('BLOODGROUP', {
    options: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
  })
  .constant('MONTH', {
    "options": [
    {
      "id": 1,
      "name": "January"
    },
    {
      "id": 2,
      "name": "February"
    },
    {
      "id": 3,
      "name": "March"
    },
    {
      "id": 4,
      "name": "April"
    },
    {
      "id": 5,
      "name": "May"
    },
    {
      "id": 6,
      "name": "June"
    },
    {
      "id": 7,
      "name": "July"
    },
    {
      "id": 8,
      "name": "August"
    },
    {
      "id": 9,
      "name": "September"
    },
    {
      "id": 10,
      "name": "October"
    },
    {
      "id": 11,
      "name": "November"
    },
    {
      "id": 12,
      "name": "December"
    }
  ]
  })
  .constant('TITLE', {
    options: ["Mr","Mrs","Ms","Dr","Prof"]
  })
  .constant('GENDER', {
    options: ["Male","Female"]
  })
  .constant('PACKTYPE', {
    "packtypes": [
    {
      "id": 1,
      "name": "Single",
      "isDeleted": false
    },
    {
      "id": 2,
      "name": "Triple",
      "isDeleted": false
    },
    {
      "id": 3,
      "name": "Quad",
      "isDeleted": false
    }
  ]
  })
  .constant('COMPONENTTYPE', {
    "componentTypes": [
    {
      "id": 1,
      "name": "All Components",
      "isDeleted": false
    },
    {
      "id": 2,
      "name": "Whole Blood",
      "isDeleted": false
    },
    {
      "id": 3,
      "name": "Red Cell Concentrate",
      "isDeleted": false
    },
    {
      "id": 4,
      "name": "Fresh Frozen Plasma",
      "isDeleted": false
    },
    {
      "id": 5,
      "name": "Buffy Coat",
      "isDeleted": false
    }
  ]
  })
  .constant('TTIOUTCOME', {
    options: ["POS","NEG"]
  })
  .constant('BGSOUTCOME', {
    options: ["POS","NEG"]
  })
  .constant('ABO', {
    options: ["A","B","AB","O"]
  })
  .constant('RH', {
    options: ["+","-"]
  })
;

  
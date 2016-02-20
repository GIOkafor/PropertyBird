angular.module('reapp.constants', [])

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
  admin: 'admin_role',
  public: 'public_role'
})

.constant('IDX_KEY', 'f4fd144531da81ace06aa74e420391b3');
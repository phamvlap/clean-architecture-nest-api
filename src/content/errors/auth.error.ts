const AUTH_LOGIN_FAILED = {
  code: 'auth_login_failed',
  message: 'Email or password is incorrect',
};

const AUTH_FORBIDDEN = {
  code: 'auth_forbidden',
  message: 'You do not have permission for this action',
};

const AUTH_FAILED_RESET_PASSWORD = {
  code: 'auth_failed_reset_password',
  message: 'Failed to reset password',
};

export { AUTH_LOGIN_FAILED, AUTH_FORBIDDEN, AUTH_FAILED_RESET_PASSWORD };

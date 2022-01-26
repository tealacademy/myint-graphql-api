export enum PIECE_EDGES {
  PIECE_TAG = 'piece_tag',
  PIECE_SLIDE = 'piece_slide',
}

export enum LOG_EDGES {
  USER_LOG_ITEM = 'user_log_item',
}

export enum LOG_ACTIONS {
  LOGIN_USER = 'Login user',
  LOGOUT_USER = 'Logout user',
  CONFIRM_USER = 'Confirm user',
  REGISTER_USER = 'Register user',
  CREATE_USER = 'Create user',
}

export enum USER_EDGES {
  USER_PROFILE = 'user_profile',
}

export enum EMAIL {
  CONFIRM_SUBJECT = 'Activate your MyinT',
}

export enum ERROR_MESSAGES {
  EMAIL_CONFIRM_INCORRECT = 'Email or confirm token are incorrect',
  EMAIL_PASSWORD_INCORRECT = 'Invalid email-address or password',
  CONFIRM_EMAIL = 'Please confirm your email-address',
}

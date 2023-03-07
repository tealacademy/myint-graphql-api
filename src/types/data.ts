export enum MODELS {
  CHALLENGE = 'Challenge',
  CLUE = 'Clue',
  FRAME = 'Frame',
  GROUP = 'Group',
  MYINTSET = 'MyinTSet',
  PIECE = 'Piece',
  PIECEVERSIONEDGE = 'PieceVersionEdge',
  PROFILE = 'Profile',
  ROLE = 'Role',
  TAG = 'Tag',
  THEME = 'Theme',
  USER = 'User',
  ORGANISATION = 'Organisation',
  ORGANISATIONGROUPEDGE = 'OrganisationGroupEdge',
  CHALLENGEFRAMEEDGE = 'ChallengeFrameEdge',
  CHALLENGEMYINTSETEDGE = 'ChallengeMyinTSetEdge',
} // ! missing the edge-models

export enum ROLES {
  VIEWER = 2001,
  EDITOR = 1984,
  ADMIN = 5150,
}

export enum PIECE_EDGES {
  // PIECE_TAG = 'piece_tag',
  // PIECE_SLIDE = 'piece_slide',
  // PIECE_OWNER = 'piece_owner',
  PIECE_VERSION_RELEASE = 'release',
  PIECE_VERSION_UPDATE = 'update',
}

export enum FRAME_EDGES {
  FRAME_TAG = 'frame_tag',
  FRAME_CLUE = 'frame_clue',
  FRAME_OWNER = 'frame_owner',
  FRAME_MYINTSET = 'frame_myintset',
  CLUE_IDEA = 'clue_idea',
}

export enum CHALLENGE_EDGES {
  CHALLENGE_FRAME = 'challenge_frame',
}

export enum TAG_EDGES {
  USER_TAG = 'user_tag',
}

export enum LOG_EDGES {
  USER_LOG_ITEM = 'user_log_item',
}

export enum LOG_ACTIONS {
  LOGIN_USER = 'login user',
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
  NO_OWNER_DEFINED = 'No owner defined',
  PIECE_FIND = 'Cannot find requested Piece',
  PIECE_UPDATE = 'Cannot update Piece',
  PIECE_COPY = 'Cannot copy Piece',
  PIECE_CREATE = 'Cannot create Piece',
  PIECE_RELEASE = 'Cannot release Piece',
  PIECE_TAGS = 'New Piece contains unknown tags',
  PIECE_QUERY = 'Error in query finding Pieces',
  PIECE_UPDATEVERSION = 'Error in finding correct update-edge of piece',
  USER_CREATE = 'Cannot create User',
  USER_CREATE_ADMIN = 'Cannot create Admin User',
  USER_REGISTER = 'Cannot register User',
  USER_PROFILE_MISSING = 'Profile of User is missing',
  USER_PROFILE = 'Profile can not be created for user',
}

export enum SUBSCRIPTIONS {
  MESSAGES = 'MESSAGES',
}

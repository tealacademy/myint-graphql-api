import { CreateProfileInput } from '../schema/profile.schema'
import { CreateGroupInput } from '../schema/group.schema'
import { CreateRoleInput } from '../schema/role.schema'
import { MODELS } from './data'

enum DEFAULT_VALUES {
  MASTER_EMAIL = 'tealacademy.nl@gmail.com',
  DEFAULT_PASSWORD = 'MyinT007!',
  MASTER_FIRSTNAME = 'Administrator',
  ADMIN_GROUP_NAME = 'Administrators',
  ADMIN_GROUP_DESCRIPTION = 'Group of users with permissions on every object',
}

export const firstAdminUser = {
  eMail: DEFAULT_VALUES.MASTER_EMAIL,
  passWord: DEFAULT_VALUES.DEFAULT_PASSWORD,
}

export const firstAdminProfile: CreateProfileInput = {
  firstName: DEFAULT_VALUES.MASTER_FIRSTNAME,
}

export const adminGroup: CreateGroupInput = {
  name: DEFAULT_VALUES.ADMIN_GROUP_NAME,
  description: DEFAULT_VALUES.ADMIN_GROUP_DESCRIPTION,
}

export const adminRole: CreateRoleInput = {
  Id: '',
  permissions: [
    {
      objectType: MODELS.CHALLENGE,
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    {
      objectType: MODELS.CLUE,
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    {
      objectType: MODELS.FRAME,
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    {
      objectType: MODELS.GROUP,
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    {
      objectType: MODELS.MYINTSET,
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    {
      objectType: MODELS.PIECE,
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    {
      objectType: MODELS.PROFILE,
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    {
      objectType: MODELS.ROLE,
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    {
      objectType: MODELS.TAG,
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    {
      objectType: MODELS.THEME,
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    {
      objectType: MODELS.USER,
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  ],
}

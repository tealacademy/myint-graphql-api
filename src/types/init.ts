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

export const viewerRole: CreateRoleInput = {
  Id: '',
  title: 'viewer',
  permissions: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
}

export const editorRole: CreateRoleInput = {
  Id: '',
  title: 'editor',
  permissions: {
    create: false,
    read: true,
    update: true,
    delete: false,
  },
}

export const creatorRole: CreateRoleInput = {
  Id: '',
  title: 'creator',
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
  },
}

import { InputType } from 'type-graphql'
import { CreateRoleInput, GetRoleInput, RoleModel } from '../schema/role.schema'
import { User } from '../schema/user.schema'

class RoleService {
  async createRole(input: CreateRoleInput & { owner: User['_id'] }) {
    //} & { user: User["_id"] }) {
    return RoleModel.create(input)
  }

  async findRoles() {
    // Pagination login
    return RoleModel.find().lean()
  }

  async findSingleRole(input: GetRoleInput) {
    return RoleModel.findOne(input).lean()
  }
}

export default RoleService

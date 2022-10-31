import { CreateRoleInput, GetRoleInput, RoleModel } from '../schema/role.schema'

class RoleService {
  async createRole(input: CreateRoleInput) {
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

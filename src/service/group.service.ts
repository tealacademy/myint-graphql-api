import { CreateGroupInput, GetGroupInput, GroupModel } from '../schema/group.schema'

class GroupService {
  async createGroup(input: CreateGroupInput) {
    //} & { user: User["_id"] }) {
    return GroupModel.create(input)
  }

  async findGroups() {
    // Pagination login
    return GroupModel.find().lean()
  }

  async findSingleGroup(input: GetGroupInput) {
    return GroupModel.findOne(input).lean()
  }
}

export default GroupService

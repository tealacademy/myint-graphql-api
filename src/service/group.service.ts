import { CreateGroupInput, GetGroupInput, UserGroupModel, ParticipantGroupModel } from '../schema/group.schema'
import { User } from '../schema/user.schema'

class GroupService {
  async createUserGroup(input: CreateGroupInput & { owner: User['_id'] }) {
    //} & { user: User["_id"] }) {
    return UserGroupModel.create(input)
  }

  // async createParticipantGroup(input: CreateGroupInput & { owner: User['_id'] }) {
  //   //} & { user: User["_id"] }) {
  //   return ParticipantGroupModel.create(input)
  // }

  async findParticipantGroups() {
    // Pagination login
    return ParticipantGroupModel.find().lean()
  }

  async findSingleParticipantGroup(input: GetGroupInput) {
    return ParticipantGroupModel.findOne(input).lean()
  }
}

export default GroupService

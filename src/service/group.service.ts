import { CreateGroupInput, GetGroupInput, TribeModel } from '../schema/group.schema'
import { User } from '../schema/user.schema'

class GroupService {
  async createUserGroup(input: CreateGroupInput & { owner: User['_id'] }) {
    //} & { user: User["_id"] }) {
    // return UserGroupModel.create(input)
  }

  // async createParticipantGroup(input: CreateGroupInput & { owner: User['_id'] }) {
  //   //} & { user: User["_id"] }) {
  //   return ParticipantGroupModel.create(input)
  // }

  async findTribes() {
    // Pagination login
    return TribeModel.find().lean()
  }

  async findSingleTribe(input: GetGroupInput) {
    return TribeModel.findOne(input).lean()
  }
}

export default GroupService

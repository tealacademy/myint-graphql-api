import { CreateProfileInput, GetProfileInput, ProfileModel } from '../schema/profile.schema'

class ProfileService {
  async createProfile(input: CreateProfileInput) {
    return ProfileModel.create(input)
  }

  async findProfiles() {
    return ProfileModel.find().lean()
  }

  async findSingleProfile(input: GetProfileInput) {
    return ProfileModel.findOne(input).lean()
  }
}

export default ProfileService

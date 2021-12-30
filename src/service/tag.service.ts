import {
  CreateTagInput,
  GetTagInput,
  TagModel
} from "../schema/tag.schema"
import { User } from "../schema/user.schema"

class TagService {
    async createTag(input: CreateTagInput) {
      return TagModel.create(input)
  }

  async findTags() {
    // Pagination login
    return TagModel.find().lean()
  }

  async findSingleTag(input: GetTagInput) {
    return TagModel.findOne(input).lean()
  }
}

export default TagService

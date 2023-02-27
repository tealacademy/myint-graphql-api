import { CreateTagInput, GetTagInput, ListTagInput, TagModel, Tag } from '../schema/tag.schema'
import { User } from '../schema/user.schema'
import { TAG_EDGES } from '../types/data'

class TagService {
  /**
   * Create the tag and link it to the current user
   * @param input
   * @returns
   */
  async createTag(input: CreateTagInput & { owner: User['_id'] }) {
    // Avoid typos by providing user with selectbox and
    // double-check in UI when tags are very, very similar

    // Tags are allways uppercase
    input.title = input.title.toUpperCase()

    // Check if not already present
    const newTag = !TagModel.findOne({ title: input.title }).lean() ? await TagModel.create(input) : null

    // Avoid typos by providing user with selectbox and
    // double-check in UI when tags are very, very similar
    return newTag
  }

  async findUserTags(userId: string) {
    const tags = await TagModel.find({ owner: userId }).lean()

    return tags
  }

  async findTags(tags: Tag[], userId: string) {
    const tags2 = await TagModel.find().lean()

    return tags2
  }

  async checkTags(tags: Tag[], userId: string) {
    let exist = true

    for (const tag of tags) {
      const foundTag = await TagModel.findOne({ _id: tag._id, owner: userId }).lean()
      exist = exist && foundTag !== null
    }

    return exist
  }

  async findSingleTag(input: GetTagInput & { owner: User['_id'] }) {
    // must be of owner, other searchfields optional
    return TagModel.findOne({ ...input }).lean()
  }

  /** Creates tags in the tags-model that do not exist yet and adjusts the input
   *
   */
  // async handleTagList(inputTags: CreateTagInput[], owner: User['_id']) {
  //   console.log('handleTagList', inputTags)

  //   const newTags = []
  //   for (const tag of inputTags) {
  //     // If no ID, we need to create tag
  //     const existingTag = await this.findSingleTag({ Id: tag.Id, owner: owner })

  //     const newTag = tag.Id === '' || !existingTag ? await this.createTag({ ...tag, owner: owner }) : existingTag

  //     newTags.push(newTag)
  //   }
  //   return newTags
  // }
}

export default TagService
